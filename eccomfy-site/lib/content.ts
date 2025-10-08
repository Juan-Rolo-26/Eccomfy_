import db from "./db";

export type ProductConfigurationSize = {
  label: string;
  width_mm: number;
  height_mm: number;
  depth_mm: number;
  base_price: number;
};

export type ProductConfigurationMaterial = {
  label: string;
  description?: string | null;
  price_modifier: number;
};

export type ProductConfigurationQuantity = {
  label: string;
  quantity: number;
  price_modifier: number;
};

export type ProductConfigurationColor = {
  label: string;
  hex?: string | null;
  price_modifier: number;
};

export type ProductConfiguration = {
  sizes: ProductConfigurationSize[];
  materials: ProductConfigurationMaterial[];
  finishes: ProductConfigurationMaterial[];
  printSides: ProductConfigurationMaterial[];
  productionSpeeds: ProductConfigurationMaterial[];
  quantities: ProductConfigurationQuantity[];
  colors: ProductConfigurationColor[];
  highlights: string[];
  min_quantity?: number | null;
  max_quantity?: number | null;
  product_type?: string | null;
  possibilities: string[];
  stock?: number | null;
  base_colors: string[];
  serigraphy_colors: string[];
  unit_price?: number | null;
};

export type ProductStyle = {
  id: number;
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  configuration: ProductConfiguration;
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

const toBoolean = (value: unknown) => Boolean(typeof value === "number" ? value : Number(value));

const DEFAULT_CONFIGURATION: ProductConfiguration = {
  sizes: [],
  materials: [],
  finishes: [],
  printSides: [],
  productionSpeeds: [],
  quantities: [],
  colors: [],
  highlights: [],
  min_quantity: null,
  max_quantity: null,
  product_type: null,
  possibilities: [],
  stock: null,
  base_colors: [],
  serigraphy_colors: [],
  unit_price: null,
};

type RawProductConfig = Partial<Omit<ProductConfiguration, "min_quantity" | "max_quantity"> & {
  min_quantity?: number | string | null;
  max_quantity?: number | string | null;
}>;

function parseNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseProductConfig(rawConfig: unknown): ProductConfiguration {
  if (!rawConfig) {
    return { ...DEFAULT_CONFIGURATION };
  }

  const configValue = typeof rawConfig === "string" ? rawConfig : JSON.stringify(rawConfig);

  try {
    const parsed = JSON.parse(configValue) as RawProductConfig;

    const normalizeMaterials = (
      values: ProductConfigurationMaterial[] | undefined,
    ): ProductConfigurationMaterial[] => {
      if (!Array.isArray(values)) return [];
      return values
        .filter((item): item is ProductConfigurationMaterial => Boolean(item && item.label))
        .map((item) => ({
          label: item.label,
          description: item.description ?? null,
          price_modifier: parseNumber(item.price_modifier) ?? 1,
        }));
    };

    const normalizeQuantities = (
      values: ProductConfigurationQuantity[] | undefined,
    ): ProductConfigurationQuantity[] => {
      if (!Array.isArray(values)) return [];
      return values
        .filter((item): item is ProductConfigurationQuantity => Boolean(item && item.label))
        .map((item) => ({
          label: item.label,
          quantity: Math.max(0, parseNumber(item.quantity) ?? 0),
          price_modifier: parseNumber(item.price_modifier) ?? 1,
        }));
    };

    const normalizeColors = (
      values: ProductConfigurationColor[] | undefined,
    ): ProductConfigurationColor[] => {
      if (!Array.isArray(values)) return [];
      return values
        .filter((item): item is ProductConfigurationColor => Boolean(item && item.label))
        .map((item) => ({
          label: item.label,
          hex: item.hex ?? null,
          price_modifier: parseNumber(item.price_modifier) ?? 1,
        }));
    };

    const normalizeSizes = (
      values: ProductConfigurationSize[] | undefined,
    ): ProductConfigurationSize[] => {
      if (!Array.isArray(values)) return [];
      return values
        .filter((item): item is ProductConfigurationSize => Boolean(item && item.label))
        .map((item) => ({
          label: item.label,
          width_mm: Math.max(0, parseNumber(item.width_mm) ?? 0),
          height_mm: Math.max(0, parseNumber(item.height_mm) ?? 0),
          depth_mm: Math.max(0, parseNumber(item.depth_mm) ?? 0),
          base_price: Math.max(0, parseNumber(item.base_price) ?? 0),
        }));
    };

    const parseStringArray = (value: unknown): string[] => {
      if (!Array.isArray(value)) return [];
      return value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0);
    };

    return {
      sizes: normalizeSizes(parsed.sizes as ProductConfigurationSize[] | undefined),
      materials: normalizeMaterials(parsed.materials as ProductConfigurationMaterial[] | undefined),
      finishes: normalizeMaterials(parsed.finishes as ProductConfigurationMaterial[] | undefined),
      printSides: normalizeMaterials(parsed.printSides as ProductConfigurationMaterial[] | undefined),
      productionSpeeds: normalizeMaterials(parsed.productionSpeeds as ProductConfigurationMaterial[] | undefined),
      quantities: normalizeQuantities(parsed.quantities as ProductConfigurationQuantity[] | undefined),
      colors: normalizeColors(parsed.colors as ProductConfigurationColor[] | undefined),
      highlights: Array.isArray(parsed.highlights)
        ? parsed.highlights.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        : [],
      min_quantity: parseNumber(parsed.min_quantity),
      max_quantity: parseNumber(parsed.max_quantity),
      product_type:
        typeof parsed === "object" && parsed && "product_type" in parsed && typeof parsed.product_type === "string"
          ? parsed.product_type
          : null,
      possibilities: parseStringArray((parsed as RawProductConfig & { possibilities?: unknown }).possibilities),
      stock:
        typeof parsed === "object" && parsed && "stock" in parsed
          ? parseNumber((parsed as { stock?: unknown }).stock)
          : null,
      base_colors: parseStringArray((parsed as RawProductConfig & { base_colors?: unknown }).base_colors),
      serigraphy_colors: parseStringArray((parsed as RawProductConfig & { serigraphy_colors?: unknown }).serigraphy_colors),
      unit_price:
        typeof parsed === "object" && parsed && "unit_price" in parsed
          ? parseNumber((parsed as { unit_price?: unknown }).unit_price)
          : null,
    };
  } catch (error) {
    console.error("parseProductConfig", error);
    return { ...DEFAULT_CONFIGURATION };
  }
}

type ProductStyleRow = {
  id: number;
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  config: string;
  position: number;
};

export function getProductStyles(): ProductStyle[] {
  const rows = db
    .prepare<ProductStyleRow>(
      "SELECT id, slug, title, description, href, image, config, position FROM product_styles ORDER BY position ASC",
    )
    .all();
  return rows.map(({ id, slug, title, description, href, image, config }) => ({
    id,
    slug,
    title,
    description,
    href,
    image,
    configuration: parseProductConfig(config),
  }));
}

export function getProductStyleBySlug(slug: string): ProductStyle | null {
  const row = db
    .prepare<ProductStyleRow>(
      "SELECT id, slug, title, description, href, image, config, position FROM product_styles WHERE slug = ? LIMIT 1",
    )
    .get(slug);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    href: row.href,
    image: row.image,
    configuration: parseProductConfig(row.config),
  };
}

export function summarizeProductStyle(style: ProductStyle): { badges: string[]; highlights: string[] } {
  const badges: string[] = [];
  const highlights: string[] = [];

  const { configuration } = style;

  if (configuration.sizes.length > 0) {
    const firstSize = configuration.sizes[0];
    badges.push(`${firstSize.label}`);
  }

  if (configuration.materials.length > 0) {
    badges.push(configuration.materials[0].label);
  }

  if (configuration.product_type) {
    badges.push(configuration.product_type);
  }

  if (configuration.base_colors.length > 0) {
    badges.push(`${configuration.base_colors.length} colores base`);
  }

  if (configuration.highlights.length > 0) {
    highlights.push(...configuration.highlights);
  }

  if (highlights.length === 0) {
    if (configuration.min_quantity) {
      highlights.push(`Pedido mínimo ${configuration.min_quantity} u.`);
    }
    if (configuration.max_quantity) {
      highlights.push(`Pedido máximo ${configuration.max_quantity} u.`);
    }
    if (configuration.possibilities.length > 0) {
      highlights.push(`Variantes: ${configuration.possibilities.join(", ")}`);
    }
    if (configuration.stock !== null && configuration.stock !== undefined) {
      highlights.push(`Stock: ${configuration.stock} u.`);
    }
    if (configuration.unit_price !== null && configuration.unit_price !== undefined) {
      highlights.push(`Precio de referencia $${configuration.unit_price.toFixed(2)}`);
    }
    if (configuration.sizes.length > 1) {
      highlights.push(`${configuration.sizes.length} medidas configuradas.`);
    }
  }

  const uniqueBadges = Array.from(new Set(badges)).slice(0, 4);
  const trimmedHighlights = highlights.slice(0, 4);

  return {
    badges: uniqueBadges,
    highlights: trimmedHighlights,
  };
}

export function getMetrics(): Metric[] {
  const rows = db
    .prepare<Metric & { position: number }>(
      "SELECT id, value, label FROM metrics ORDER BY position ASC"
    )
    .all();
  return rows.map(({ id, value, label }) => ({ id, value, label }));
}

export function getTestimonials(): Testimonial[] {
  const rows = db
    .prepare<Testimonial & { position: number }>(
      "SELECT id, quote, name, role, highlight FROM testimonials ORDER BY position ASC"
    )
    .all();
  return rows.map(({ id, quote, name, role, highlight }) => ({
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
      "SELECT id, name FROM brands ORDER BY position ASC"
    )
    .all();
  return rows.map(({ id, name }) => ({ id, name }));
}
