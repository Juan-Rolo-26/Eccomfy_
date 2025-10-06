import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "eccomfy.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_staff INTEGER NOT NULL DEFAULT 0,
    email_verified_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    consumed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    consumed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    sizes_json TEXT NOT NULL,
    materials_json TEXT NOT NULL,
    finishes_json TEXT NOT NULL,
    print_sides_json TEXT NOT NULL,
    production_speeds_json TEXT NOT NULL,
    quantities_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    highlight INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    position INTEGER NOT NULL DEFAULT 0
  );

  -- legacy tables kept for backward compatibility are not recreated here
`);

type LegacyProductStyleRow = {
  id: number;
  title: string;
  description: string;
  href: string;
  image: string;
  position: number | null;
};

type LegacySizeRow = {
  id: number;
  label: string;
  width_mm: number;
  height_mm: number;
  depth_mm: number;
  base_price: number;
  position: number | null;
};

type LegacyChoiceRow = {
  id: number;
  label: string;
  description: string | null;
  price_modifier: number | null;
  position: number | null;
};

type LegacyQuantityRow = {
  id: number;
  label: string;
  quantity: number | null;
  price_modifier: number | null;
  position: number | null;
};

function normalizeNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  return fallback;
}

function normalizeInteger(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (Number.isInteger(parsed)) {
    return parsed;
  }
  return fallback;
}

function slugify(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[^A-Za-z0-9\s-]/g, "")
    .replace(/[\u0300-\u036f]/g, "");
  return normalized
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractSlugCandidate(href: string): string {
  const cleaned = href.trim();
  if (!cleaned) return "";
  const parts = cleaned.split("/").filter(Boolean);
  const last = parts.pop();
  return last ? slugify(last) : slugify(cleaned);
}

function ensureUniqueSlug(base: string, used: Set<string>, fallbackId: number): string {
  const baseSlug = base || `producto-${fallbackId}`;
  let candidate = baseSlug;
  let attempt = 2;
  while (used.has(candidate)) {
    candidate = `${baseSlug}-${attempt}`;
    attempt += 1;
  }
  used.add(candidate);
  return candidate;
}

function tableNames(): Set<string> {
  const rows = db
    .prepare<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table'")
    .all();
  return new Set(rows.map((row) => row.name));
}

function migrateLegacyProductData() {
  try {
    const productCountRow = db.prepare<{ count: number }>("SELECT COUNT(*) as count FROM products").get();
    if (productCountRow && productCountRow.count > 0) {
      return;
    }

    const tables = tableNames();
    if (!tables.has("product_styles")) {
      return;
    }

    const legacyProducts = db
      .prepare<LegacyProductStyleRow>(
        "SELECT id, title, description, href, image, position FROM product_styles ORDER BY position ASC",
      )
      .all();

    if (legacyProducts.length === 0) {
      return;
    }

    const legacySizes: LegacySizeRow[] = tables.has("design_sizes")
      ? db
          .prepare<LegacySizeRow>(
            "SELECT id, label, width_mm, height_mm, depth_mm, base_price, position FROM design_sizes ORDER BY position ASC",
          )
          .all()
      : [];

    const legacyMaterials: LegacyChoiceRow[] = tables.has("design_materials")
      ? db
          .prepare<LegacyChoiceRow>(
            "SELECT id, label, description, price_modifier, position FROM design_materials ORDER BY position ASC",
          )
          .all()
      : [];

    const legacyFinishes: LegacyChoiceRow[] = tables.has("design_finishes")
      ? db
          .prepare<LegacyChoiceRow>(
            "SELECT id, label, description, price_modifier, position FROM design_finishes ORDER BY position ASC",
          )
          .all()
      : [];

    const legacyPrintSides: LegacyChoiceRow[] = tables.has("design_print_sides")
      ? db
          .prepare<LegacyChoiceRow>(
            "SELECT id, label, description, price_modifier, position FROM design_print_sides ORDER BY position ASC",
          )
          .all()
      : [];

    const legacyProductionSpeeds: LegacyChoiceRow[] = tables.has("design_production_speeds")
      ? db
          .prepare<LegacyChoiceRow>(
            "SELECT id, label, description, price_modifier, position FROM design_production_speeds ORDER BY position ASC",
          )
          .all()
      : [];

    const legacyQuantities: LegacyQuantityRow[] = tables.has("design_quantities")
      ? db
          .prepare<LegacyQuantityRow>(
            "SELECT id, label, quantity, price_modifier, position FROM design_quantities ORDER BY position ASC",
          )
          .all()
      : [];

    const serializedSizes = JSON.stringify(
      legacySizes.map((item, index) => ({
        id: String(item.id ?? index + 1),
        label: item.label,
        width_mm: normalizeNumber(item.width_mm, 0),
        height_mm: normalizeNumber(item.height_mm, 0),
        depth_mm: normalizeNumber(item.depth_mm, 0),
        base_price: normalizeNumber(item.base_price, 0),
        position: normalizeInteger(item.position, index),
      })),
    );

    const serializeChoices = (items: LegacyChoiceRow[]) =>
      JSON.stringify(
        items.map((item, index) => ({
          id: String(item.id ?? index + 1),
          label: item.label,
          description: item.description ? item.description : null,
          price_modifier: normalizeNumber(item.price_modifier, 1),
          position: normalizeInteger(item.position, index),
        })),
      );

    const serializedMaterials = serializeChoices(legacyMaterials);
    const serializedFinishes = serializeChoices(legacyFinishes);
    const serializedPrintSides = serializeChoices(legacyPrintSides);
    const serializedProductionSpeeds = serializeChoices(legacyProductionSpeeds);

    const serializedQuantities = JSON.stringify(
      legacyQuantities.map((item, index) => ({
        id: String(item.id ?? index + 1),
        label: item.label,
        quantity: Math.max(0, Math.floor(normalizeNumber(item.quantity, 0))),
        price_modifier: normalizeNumber(item.price_modifier, 1),
        position: normalizeInteger(item.position, index),
      })),
    );

    const usedSlugs = new Set<string>();
    const insertProduct = db.prepare(
      `INSERT INTO products (title, slug, description, image, position, sizes_json, materials_json, finishes_json, print_sides_json, production_speeds_json, quantities_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    const migrate = db.transaction((rows: LegacyProductStyleRow[]) => {
      rows.forEach((row, index) => {
        const title = row.title?.trim() ?? "";
        const description = row.description?.trim() ?? "";
        const image = row.image?.trim() ?? "";
        const slugCandidate = extractSlugCandidate(row.href ?? "");
        const fallbackSlug = slugify(title) || slugify(`producto-${row.id}`);
        const slug = ensureUniqueSlug(slugCandidate || fallbackSlug, usedSlugs, row.id ?? index + 1);
        const position = normalizeInteger(row.position, index);

        insertProduct.run(
          title,
          slug,
          description,
          image,
          position,
          serializedSizes,
          serializedMaterials,
          serializedFinishes,
          serializedPrintSides,
          serializedProductionSpeeds,
          serializedQuantities,
        );
      });
    });

    migrate(legacyProducts);
  } catch (error) {
    console.error("migrateLegacyProductData", error);
  }
}

migrateLegacyProductData();

try {
  db.prepare("ALTER TABLE users ADD COLUMN is_staff INTEGER NOT NULL DEFAULT 0").run();
} catch (error) {
  if (
    !(
      error instanceof Error &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("duplicate column name")
    )
  ) {
    throw error;
  }
}

try {
  db.prepare("ALTER TABLE users ADD COLUMN email_verified_at TEXT").run();
  db.prepare(
    "UPDATE users SET email_verified_at = COALESCE(email_verified_at, created_at)",
  ).run();
} catch (error) {
  if (
    !(
      error instanceof Error &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("duplicate column name")
    )
  ) {
    throw error;
  }
}

export type DbUser = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_staff: number;
  email_verified_at: string | null;
  created_at: string;
};

export default db;
