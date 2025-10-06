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

  CREATE TABLE IF NOT EXISTS product_styles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    href TEXT NOT NULL,
    image TEXT NOT NULL,
    config TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
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

  CREATE TABLE IF NOT EXISTS design_sizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    width_mm INTEGER NOT NULL,
    height_mm INTEGER NOT NULL,
    depth_mm INTEGER NOT NULL,
    base_price REAL NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS design_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    description TEXT,
    price_modifier REAL NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS design_finishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    description TEXT,
    price_modifier REAL NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS design_print_sides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    description TEXT,
    price_modifier REAL NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS design_production_speeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    description TEXT,
    price_modifier REAL NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS design_quantities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_modifier REAL NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );
`);

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

try {
  db.prepare("ALTER TABLE product_styles ADD COLUMN slug TEXT").run();
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
  db.prepare("ALTER TABLE product_styles ADD COLUMN config TEXT").run();
  db.prepare("UPDATE product_styles SET config = '{}' WHERE config IS NULL OR trim(config) = ''").run();
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
  db.exec(
    "CREATE UNIQUE INDEX IF NOT EXISTS product_styles_slug_unique ON product_styles(slug) WHERE slug IS NOT NULL AND slug != ''",
  );
} catch (error) {
  if (
    !(
      error instanceof Error &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("already exists")
    )
  ) {
    throw error;
  }
}

db.prepare(
  "UPDATE product_styles SET slug = CASE WHEN slug IS NULL OR trim(slug) = '' THEN lower(replace(title, ' ', '-')) ELSE slug END",
).run();
db.prepare("UPDATE product_styles SET config = '{}' WHERE config IS NULL OR trim(config) = ''").run();

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
