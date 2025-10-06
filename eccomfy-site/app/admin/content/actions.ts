"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import type { ProductChoiceOption, ProductQuantityOption, ProductSizeOption } from "@/lib/content";

export type ContentFormState = {
  error?: string;
  success?: string;
};

const SUCCESS_MESSAGE = "Creado correctamente.";
const SLUG_PATTERN = /^[a-z0-9-]+$/;

function parsePosition(input: FormDataEntryValue | null): number | null {
  const value = Number(input);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.floor(value);
}

function revalidateContentPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/content");
  if (slug) {
    revalidatePath(`/design/${slug}`);
  }
}

function parseId(formData: FormData, key = "id"): number | null {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return Math.floor(value);
}

function parseJsonArrayField(formData: FormData, key: string): unknown[] | null {
  const raw = formData.get(key);
  if (typeof raw !== "string") {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error(`parseJsonArrayField:${key}`, error);
  }
  return null;
}

function parsePositiveNumber(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function parseNonNegativeInteger(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
}

function sanitizeSizes(raw: unknown[] | null): ProductSizeOption[] | string {
  if (!raw || raw.length === 0) {
    return "Agregá al menos una medida.";
  }

  const sizes: ProductSizeOption[] = [];
  for (const [index, item] of raw.entries()) {
    if (!item || typeof item !== "object") {
      return "Revisá los datos de las medidas.";
    }
    const data = item as Record<string, unknown>;
    const label = typeof data.label === "string" ? data.label.trim() : "";
    const width = parsePositiveNumber(data.width ?? data.width_mm);
    const height = parsePositiveNumber(data.height ?? data.height_mm);
    const depth = parsePositiveNumber(data.depth ?? data.depth_mm);
    const basePrice = parsePositiveNumber(data.basePrice ?? data.base_price);
    const position = parseNonNegativeInteger(data.position, index);
    const id = typeof data.id === "string" && data.id.trim() ? data.id.trim() : randomUUID();

    if (!label || width === null || height === null || depth === null || basePrice === null) {
      return "Completá todos los campos obligatorios de las medidas con valores válidos.";
    }

    sizes.push({
      id,
      label,
      width_mm: Math.round(width),
      height_mm: Math.round(height),
      depth_mm: Math.round(depth),
      base_price: Number(basePrice.toFixed(2)),
      position,
    });
  }

  return sizes.sort((a, b) => a.position - b.position);
}

function sanitizeChoiceOptions(
  raw: unknown[] | null,
  emptyMessage: string,
  invalidMessage: string,
): ProductChoiceOption[] | string {
  if (!raw || raw.length === 0) {
    return emptyMessage;
  }

  const options: ProductChoiceOption[] = [];
  for (const [index, item] of raw.entries()) {
    if (!item || typeof item !== "object") {
      return invalidMessage;
    }
    const data = item as Record<string, unknown>;
    const label = typeof data.label === "string" ? data.label.trim() : "";
    const descriptionRaw = typeof data.description === "string" ? data.description.trim() : null;
    const description = descriptionRaw ? descriptionRaw : null;
    const priceModifier = parsePositiveNumber(data.priceModifier ?? data.price_modifier ?? 1);
    const position = parseNonNegativeInteger(data.position, index);
    const id = typeof data.id === "string" && data.id.trim() ? data.id.trim() : randomUUID();

    if (!label || priceModifier === null) {
      return invalidMessage;
    }

    options.push({
      id,
      label,
      description,
      price_modifier: Number(priceModifier.toFixed(4)),
      position,
    });
  }

  return options.sort((a, b) => a.position - b.position);
}

function sanitizeQuantities(raw: unknown[] | null): ProductQuantityOption[] | string {
  if (!raw || raw.length === 0) {
    return "Agregá al menos una cantidad disponible.";
  }

  const quantities: ProductQuantityOption[] = [];
  for (const [index, item] of raw.entries()) {
    if (!item || typeof item !== "object") {
      return "Revisá los datos de las cantidades.";
    }
    const data = item as Record<string, unknown>;
    const label = typeof data.label === "string" ? data.label.trim() : "";
    const quantityValue = parsePositiveNumber(data.quantity);
    const priceModifier = parsePositiveNumber(data.priceModifier ?? data.price_modifier ?? 1);
    const position = parseNonNegativeInteger(data.position, index);
    const id = typeof data.id === "string" && data.id.trim() ? data.id.trim() : randomUUID();

    if (!label || quantityValue === null || priceModifier === null) {
      return "Completá todos los campos obligatorios de las cantidades con valores válidos.";
    }

    quantities.push({
      id,
      label,
      quantity: Math.max(1, Math.floor(quantityValue)),
      price_modifier: Number(priceModifier.toFixed(4)),
      position,
    });
  }

  return quantities.sort((a, b) => a.position - b.position);
}

export async function createProductAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireStaff();
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugInput.toLowerCase();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const position = parsePosition(formData.get("position"));

  if (!title || !slug || !description || !image || position === null) {
    return { error: "Completá todos los campos obligatorios del producto." };
  }

  if (!SLUG_PATTERN.test(slug)) {
    return { error: "Usá solo letras, números y guiones para el identificador." };
  }

  const existing = db.prepare("SELECT id FROM products WHERE slug = ? LIMIT 1").get(slug);
  if (existing) {
    return { error: "Ya existe un producto con ese identificador." };
  }

  const sizesResult = sanitizeSizes(parseJsonArrayField(formData, "sizes"));
  if (typeof sizesResult === "string") {
    return { error: sizesResult };
  }

  const materialsResult = sanitizeChoiceOptions(
    parseJsonArrayField(formData, "materials"),
    "Agregá al menos un material disponible.",
    "Revisá los datos ingresados para materiales y multiplicadores.",
  );
  if (typeof materialsResult === "string") {
    return { error: materialsResult };
  }

  const finishesResult = sanitizeChoiceOptions(
    parseJsonArrayField(formData, "finishes"),
    "Agregá al menos un acabado disponible.",
    "Revisá los datos ingresados para los acabados.",
  );
  if (typeof finishesResult === "string") {
    return { error: finishesResult };
  }

  const printSidesResult = sanitizeChoiceOptions(
    parseJsonArrayField(formData, "printSides"),
    "Agregá al menos una opción de impresión.",
    "Revisá los datos ingresados para las caras impresas.",
  );
  if (typeof printSidesResult === "string") {
    return { error: printSidesResult };
  }

  const speedsResult = sanitizeChoiceOptions(
    parseJsonArrayField(formData, "productionSpeeds"),
    "Agregá al menos una velocidad de producción.",
    "Revisá los datos ingresados para las velocidades de producción.",
  );
  if (typeof speedsResult === "string") {
    return { error: speedsResult };
  }

  const quantitiesResult = sanitizeQuantities(parseJsonArrayField(formData, "quantities"));
  if (typeof quantitiesResult === "string") {
    return { error: quantitiesResult };
  }

  try {
    db.prepare(
      `INSERT INTO products
        (title, slug, description, image, position, sizes_json, materials_json, finishes_json, print_sides_json, production_speeds_json, quantities_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      title,
      slug,
      description,
      image,
      position,
      JSON.stringify(sizesResult),
      JSON.stringify(materialsResult),
      JSON.stringify(finishesResult),
      JSON.stringify(printSidesResult),
      JSON.stringify(speedsResult),
      JSON.stringify(quantitiesResult),
    );
    revalidateContentPaths(slug);
    return { success: SUCCESS_MESSAGE };
  } catch (error) {
    console.error("createProductAction", error);
    return { error: "No pudimos guardar el producto." };
  }
}

export async function createMetricAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireStaff();
  const value = String(formData.get("value") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const position = parsePosition(formData.get("position"));

  if (!value || !label || position === null) {
    return { error: "Completá todos los campos." };
  }

  try {
    db.prepare("INSERT INTO metrics (value, label, position) VALUES (?, ?, ?)").run(value, label, position);
    revalidateContentPaths();
    return { success: SUCCESS_MESSAGE };
  } catch (error) {
    console.error("createMetricAction", error);
    return { error: "No pudimos guardar la métrica." };
  }
}

export async function createTestimonialAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireStaff();
  const quote = String(formData.get("quote") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const highlight = formData.get("highlight") === "on" ? 1 : 0;
  const position = parsePosition(formData.get("position"));

  if (!quote || !name || !role || position === null) {
    return { error: "Completá todos los campos obligatorios." };
  }

  try {
    db.prepare(
      "INSERT INTO testimonials (quote, name, role, highlight, position) VALUES (?, ?, ?, ?, ?)",
    ).run(quote, name, role, highlight, position);
    revalidateContentPaths();
    return { success: SUCCESS_MESSAGE };
  } catch (error) {
    console.error("createTestimonialAction", error);
    return { error: "No pudimos guardar el testimonio." };
  }
}

export async function createBrandAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireStaff();
  const name = String(formData.get("name") ?? "").trim();
  const position = parsePosition(formData.get("position"));

  if (!name || position === null) {
    return { error: "Completá todos los campos." };
  }

  try {
    db.prepare("INSERT INTO brands (name, position) VALUES (?, ?)").run(name, position);
    revalidateContentPaths();
    return { success: SUCCESS_MESSAGE };
  } catch (error) {
    console.error("createBrandAction", error);
    if (error instanceof Error && "code" in error && (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
      return { error: "Ya cargaste esa marca." };
    }
    return { error: "No pudimos guardar la marca." };
  }
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireStaff();
  const id = parseId(formData);
  if (!id) return;
  const row = db.prepare<{ slug: string }>("SELECT slug FROM products WHERE id = ?").get(id);
  if (!row) return;
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  revalidateContentPaths(row.slug);
}

export async function deleteMetricAction(formData: FormData): Promise<void> {
  await requireStaff();
  const id = parseId(formData);
  if (!id) return;
  db.prepare("DELETE FROM metrics WHERE id = ?").run(id);
  revalidateContentPaths();
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  await requireStaff();
  const id = parseId(formData);
  if (!id) return;
  db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);
  revalidateContentPaths();
}

export async function deleteBrandAction(formData: FormData): Promise<void> {
  await requireStaff();
  const id = parseId(formData);
  if (!id) return;
  db.prepare("DELETE FROM brands WHERE id = ?").run(id);
  revalidateContentPaths();
}
