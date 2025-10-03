import db from "./db";

export type ProductStyle = {
  id: number;
  title: string;
  description: string;
  href: string;
  image: string;
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

export function getProductStyles(): ProductStyle[] {
  const rows = db
    .prepare<ProductStyle & { position: number }>(
      "SELECT id, title, description, href, image FROM product_styles ORDER BY position ASC"
    )
    .all();
  return rows.map(({ id, title, description, href, image }) => ({ id, title, description, href, image }));
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
