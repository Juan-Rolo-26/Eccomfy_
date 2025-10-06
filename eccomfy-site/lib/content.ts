import db from "./db";

export type ProductSizeOption = {
  id: string;
  label: string;
  width_mm: number;
  height_mm: number;
  depth_mm: number;
  base_price: number;
  position: number;
};

export type ProductChoiceOption = {
  id: string;
  label: string;
  description: string | null;
  price_modifier: number;
  position: number;
};

export type ProductQuantityOption = {
  id: string;
  label: string;
  quantity: number;
  price_modifier: number;
  position: number;
};

export type ProductOptions = {
  sizes: ProductSizeOption[];
  materials: ProductChoiceOption[];
  finishes: ProductChoiceOption[];
  printSides: ProductChoiceOption[];
  productionSpeeds: ProductChoiceOption[];
  quantities: ProductQuantityOption[];
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  href: string;
  description: string;
  image: string;
  position: number;
  options: ProductOptions;
};

export type Metric = {
  id: number;
  value: string;
  label: string;
};

export type Testimonial = {
  id: number;
  quote: string;
  name: string;
  role: string;
  highlight: boolean;
};

export type Brand = {
  id: number;
  name: string;
};

type ProductRow = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  position: number;
  sizes_json: string;
  materials_json: string;
  finishes_json: string;
  print_sides_json: string;
  production_speeds_json: string;
  quantities_json: string;
};

const toBoolean = (value: unknown) => Boolean(typeof value === "number" ? value : Number(value));

function parseJsonArray(value: string): unknown[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("parseJsonArray", error);
    return [];
  }
}

function normalizePosition(raw: unknown, fallback: number): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(0, Math.floor(parsed));
}

function mapSizeOption(raw: unknown, index: number): ProductSizeOption | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const data = raw as Record<string, unknown>;
  const label = typeof data.label === "string" ? data.label.trim() : "";
  const id = typeof data.id === "string" && data.id.trim() ? data.id.trim() : `${index}`;
  const width = Number(data.width_mm ?? data.width);
  const height = Number(data.height_mm ?? data.height);
  const depth = Number(data.depth_mm ?? data.depth);
  const basePrice = Number(data.base_price ?? data.basePrice);
  const position = normalizePosition(data.position, index);

  if (!label || !Number.isFinite(width) || !Number.isFinite(height) || !Number.isFinite(depth) || !Number.isFinite(basePrice)) {
    return null;
  }

  return {
    id,
    label,
    width_mm: Math.max(0, Math.round(width)),
    height_mm: Math.max(0, Math.round(height)),
    depth_mm: Math.max(0, Math.round(depth)),
    base_price: Number(basePrice),
    position,
  };
}

function mapChoiceOption(raw: unknown, index: number): ProductChoiceOption | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const data = raw as Record<string, unknown>;
  const label = typeof data.label === "string" ? data.label.trim() : "";
  const descriptionRaw = typeof data.description === "string" ? data.description.trim() : null;
  const description = descriptionRaw ? descriptionRaw : null;
  const priceModifier = Number(data.price_modifier ?? data.priceModifier ?? 1);
  const position = normalizePosition(data.position, index);
  const id = typeof data.id === "string" && data.id.trim() ? data.id.trim() : `${index}`;

  if (!label || !Number.isFinite(priceModifier)) {
    return null;
  }

  return {
    id,
    label,
    description,
    price_modifier: Number(priceModifier),
    position,
  };
}

function mapQuantityOption(raw: unknown, index: number): ProductQuantityOption | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const data = raw as Record<string, unknown>;
  const label = typeof data.label === "string" ? data.label.trim() : "";
  const quantity = Number(data.quantity);
  const priceModifier = Number(data.price_modifier ?? data.priceModifier ?? 1);
  const position = normalizePosition(data.position, index);
  const id = typeof data.id === "string" && data.id.trim() ? data.id.trim() : `${index}`;

  if (!label || !Number.isFinite(quantity) || !Number.isFinite(priceModifier)) {
    return null;
  }

  return {
    id,
    label,
    quantity: Math.max(0, Math.floor(quantity)),
    price_modifier: Number(priceModifier),
    position,
  };
}

function mapProductRow(row: ProductRow): Product {
  const sizes = parseJsonArray(row.sizes_json)
    .map((item, index) => mapSizeOption(item, index))
    .filter((item): item is ProductSizeOption => Boolean(item))
    .sort((a, b) => a.position - b.position);

  const materials = parseJsonArray(row.materials_json)
    .map((item, index) => mapChoiceOption(item, index))
    .filter((item): item is ProductChoiceOption => Boolean(item))
    .sort((a, b) => a.position - b.position);

  const finishes = parseJsonArray(row.finishes_json)
    .map((item, index) => mapChoiceOption(item, index))
    .filter((item): item is ProductChoiceOption => Boolean(item))
    .sort((a, b) => a.position - b.position);

  const printSides = parseJsonArray(row.print_sides_json)
    .map((item, index) => mapChoiceOption(item, index))
    .filter((item): item is ProductChoiceOption => Boolean(item))
    .sort((a, b) => a.position - b.position);

  const productionSpeeds = parseJsonArray(row.production_speeds_json)
    .map((item, index) => mapChoiceOption(item, index))
    .filter((item): item is ProductChoiceOption => Boolean(item))
    .sort((a, b) => a.position - b.position);

  const quantities = parseJsonArray(row.quantities_json)
    .map((item, index) => mapQuantityOption(item, index))
    .filter((item): item is ProductQuantityOption => Boolean(item))
    .sort((a, b) => a.position - b.position);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    href: `/design/${row.slug}`,
    description: row.description,
    image: row.image,
    position: row.position,
    options: {
      sizes,
      materials,
      finishes,
      printSides,
      productionSpeeds,
      quantities,
    },
  };
}

export function getProducts(): Product[] {
  const rows = db
    .prepare<ProductRow>(
      "SELECT id, title, slug, description, image, position, sizes_json, materials_json, finishes_json, print_sides_json, production_speeds_json, quantities_json FROM products ORDER BY position ASC",
    )
    .all();

  return rows.map((row: ProductRow) => mapProductRow(row));
}

export function getProductBySlug(slug: string): Product | null {
  const row = db
    .prepare<ProductRow>(
      "SELECT id, title, slug, description, image, position, sizes_json, materials_json, finishes_json, print_sides_json, production_speeds_json, quantities_json FROM products WHERE slug = ?",
    )
    .get(slug);

  if (!row) {
    return null;
  }

  return mapProductRow(row);
}

export function getMetrics(): Metric[] {
  const rows = db
    .prepare<Metric & { position: number }>(
      "SELECT id, value, label FROM metrics ORDER BY position ASC",
    )
    .all();
  return rows.map(({ id, value, label }: Metric & { position: number }) => ({ id, value, label }));
}

export function getTestimonials(): Testimonial[] {
  const rows = db
    .prepare<Testimonial & { position: number }>(
      "SELECT id, quote, name, role, highlight FROM testimonials ORDER BY position ASC",
    )
    .all();
  return rows.map(({ id, quote, name, role, highlight }: Testimonial & { position: number }) => ({
    id,
    quote,
    name,
    role,
    highlight: toBoolean(highlight),
  }));
}

export function getBrands(): Brand[] {
  const rows = db
    .prepare<Brand & { position: number }>(
      "SELECT id, name FROM brands ORDER BY position ASC",
    )
    .all();
  return rows.map(({ id, name }: Brand & { position: number }) => ({ id, name }));
}
