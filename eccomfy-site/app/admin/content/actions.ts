"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import type { ProductConfiguration } from "@/lib/content";
import { saveProductImage } from "@/lib/uploads";

export type ContentFormState = {
  error?: string;
  success?: string;
};

const SUCCESS_MESSAGE = "Creado correctamente.";

const normalizeSlug = (value: string): string => {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
};

const parseLines = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

function parseStringList(
  raw: string,
  label: string,
  { allowEmpty = false }: { allowEmpty?: boolean } = {},
): ParseResult<string[]> {
  const lines = parseLines(raw);
  if (!allowEmpty && lines.length === 0) {
    return { ok: false, error: `Agregá al menos una opción en ${label.toLowerCase()}.` };
  }
  return { ok: true, value: lines };
}

const parseDecimal = (value: string): number | null => {
  const normalized = value.replace(/,/g, ".");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
};

const parseInteger = (value: string): number | null => {
  const normalized = value.replace(/,/g, "");
  if (!/^[-+]?\d+$/.test(normalized)) {
    return null;
  }
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
};

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

function parseSizesInput(raw: string): ParseResult<ProductConfiguration["sizes"]> {
  const lines = parseLines(raw);
  if (lines.length === 0) {
    return { ok: false, error: "Agregá al menos una medida (formato: nombre|ancho|alto|profundidad|precio base)." };
  }

  const sizes = [] as ProductConfiguration["sizes"];

  for (const line of lines) {
    const [label, widthRaw, heightRaw, depthRaw, basePriceRaw] = line.split("|").map((part) => part.trim());
    if (!label || !widthRaw || !heightRaw || !depthRaw) {
      return {
        ok: false,
        error: "Cada medida debe incluir nombre, ancho, alto y profundidad (en mm). Opcionalmente podés sumar el precio base.",
      };
    }

    const width = parseDecimal(widthRaw);
    const height = parseDecimal(heightRaw);
    const depth = parseDecimal(depthRaw);
    const basePrice = basePriceRaw ? parseDecimal(basePriceRaw) : 0;

    if (width === null || height === null || depth === null || width <= 0 || height <= 0 || depth <= 0) {
      return { ok: false, error: "Las dimensiones deben ser números positivos." };
    }

    if (basePrice === null || basePrice < 0) {
      return { ok: false, error: "El precio base debe ser un número mayor o igual a 0." };
    }

    sizes.push({
      label,
      width_mm: Math.round(width),
      height_mm: Math.round(height),
      depth_mm: Math.round(depth),
      base_price: Number(basePrice.toFixed(2)),
    });
  }

  return { ok: true, value: sizes };
}

function parseMaterialsInput(raw: string, label: string): ParseResult<ProductConfiguration["materials"]> {
  const lines = parseLines(raw);
  if (lines.length === 0) {
    return { ok: false, error: `Agregá al menos una opción en ${label}.` };
  }

  const materials = [] as ProductConfiguration["materials"];

  for (const line of lines) {
    const [name, descriptionRaw, modifierRaw] = line.split("|").map((part) => part.trim());
    if (!name) {
      return { ok: false, error: `Cada opción de ${label.toLowerCase()} necesita al menos un nombre.` };
    }

    const modifier = modifierRaw ? parseDecimal(modifierRaw) : 1;
    if (modifier === null || modifier <= 0) {
      return {
        ok: false,
        error: `El multiplicador en ${label.toLowerCase()} debe ser un número mayor a 0.`,
      };
    }

    materials.push({
      label: name,
      description: descriptionRaw || null,
      price_modifier: Number(modifier.toFixed(4)),
    });
  }

  return { ok: true, value: materials };
}

function buildProductConfiguration(formData: FormData): ParseResult<ProductConfiguration> {
  const sizesResult = parseSizesInput(String(formData.get("sizes") ?? ""));
  if (!sizesResult.ok) return sizesResult;

  const productType = String(formData.get("productType") ?? "").trim();
  if (!productType) {
    return { ok: false, error: "Ingresá el tipo de producto (por ejemplo: caja o bolsa)." };
  }

  const possibilitiesResult = parseStringList(String(formData.get("possibilities") ?? ""), "Posibilidades", {
    allowEmpty: true,
  });
  if (!possibilitiesResult.ok) return possibilitiesResult;

  const baseColorsResult = parseStringList(String(formData.get("baseColors") ?? ""), "Colores base", {
    allowEmpty: true,
  });
  if (!baseColorsResult.ok) return baseColorsResult;

  const serigraphyColorsResult = parseStringList(
    String(formData.get("serigraphyColors") ?? ""),
    "Colores de serigrafía",
    { allowEmpty: true },
  );
  if (!serigraphyColorsResult.ok) return serigraphyColorsResult;

  const materialsResult = parseMaterialsInput(String(formData.get("materials") ?? ""), "Materiales");
  if (!materialsResult.ok) return materialsResult;

  const stockRaw = String(formData.get("stock") ?? "").trim();
  const stock = stockRaw ? parseInteger(stockRaw) : null;
  if (!stockRaw || stock === null || stock < 0) {
    return { ok: false, error: "El stock debe ser un número entero mayor o igual a 0." };
  }

  const unitPriceRaw = String(formData.get("unitPrice") ?? "").trim();
  const unitPrice = unitPriceRaw ? parseDecimal(unitPriceRaw) : null;
  if (!unitPriceRaw || unitPrice === null || unitPrice < 0) {
    return { ok: false, error: "Ingresá el precio unitario de la caja." };
  }

  const minQuantityRaw = String(formData.get("minPurchase") ?? "").trim();
  const maxQuantityRaw = String(formData.get("maxPurchase") ?? "").trim();

  const minQuantity = minQuantityRaw ? parseInteger(minQuantityRaw) : null;
  if (minQuantityRaw && (minQuantity === null || minQuantity < 0)) {
    return { ok: false, error: "La compra mínima debe ser un entero mayor o igual a 0." };
  }

  const maxQuantity = maxQuantityRaw ? parseInteger(maxQuantityRaw) : null;
  if (maxQuantityRaw && (maxQuantity === null || maxQuantity <= 0)) {
    return { ok: false, error: "La compra máxima debe ser un entero mayor a 0." };
  }

  if (minQuantity !== null && maxQuantity !== null && maxQuantity < minQuantity) {
    return { ok: false, error: "La compra máxima debe ser mayor o igual a la mínima." };
  }

  const colorOptions = [...baseColorsResult.value, ...serigraphyColorsResult.value].map((label) => ({
    label,
    hex: null,
    price_modifier: 1,
  }));

  const configuration: ProductConfiguration = {
    sizes: sizesResult.value,
    materials: materialsResult.value,
    finishes: [],
    printSides: [],
    productionSpeeds: [],
    quantities: [],
    colors: colorOptions,
    highlights: [],
    min_quantity: minQuantity,
    max_quantity: maxQuantity,
    product_type: productType,
    possibilities: possibilitiesResult.value,
    stock,
    base_colors: baseColorsResult.value,
    serigraphy_colors: serigraphyColorsResult.value,
    unit_price: Number(unitPrice.toFixed(2)),
  };

  return { ok: true, value: configuration };
}

function slugExists(slug: string, excludeId?: number): boolean {
  const row = db.prepare<{ id: number }>("SELECT id FROM product_styles WHERE slug = ? LIMIT 1").get(slug);
  if (!row) {
    return false;
  }
  if (excludeId && row.id === excludeId) {
    return false;
  }
  return true;
}

function parsePosition(input: FormDataEntryValue | null): number | null {
  const value = Number(input);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.floor(value);
}

function revalidateContentPaths() {
  revalidatePath("/");
  revalidatePath("/design");
  revalidatePath("/products");
  revalidatePath("/admin/content");
  revalidatePath("/admin/products");
}

function parseId(formData: FormData, key = "id"): number | null {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return Math.floor(value);
}

type ExistingProductRow = {
  id: number;
  slug: string;
  image: string;
  href: string;
};

function findProductById(id: number): ExistingProductRow | null {
  const row = db
    .prepare<ExistingProductRow>("SELECT id, slug, image, href FROM product_styles WHERE id = ? LIMIT 1")
    .get(id);
  return row ?? null;
}

export async function createProductStyleAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireStaff();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageInput = String(formData.get("image") ?? "").trim();
  const imageFile = formData.get("imageFile");
  const position = parsePosition(formData.get("position"));
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = normalizeSlug(slugInput || title);

  if (!slug) {
    return { error: "Ingresá un identificador válido (solo letras, números y guiones)." };
  }

  if (slugExists(slug)) {
    return { error: "Ya existe un producto con ese identificador." };
  }

  const configResult = buildProductConfiguration(formData);
  if (!configResult.ok) {
    return { error: configResult.error };
  }

  let image = imageInput;

  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveProductImage(imageFile, slug);
    } catch (error) {
      console.error("saveProductImage", error);
      return { error: "No pudimos guardar la imagen del producto." };
    }
  }

  if (!title || !description || !image || position === null) {
    return { error: "Completá todos los campos." };
  }

  try {
    const href = `/design/${slug}`;
    db.prepare(
      "INSERT INTO product_styles (slug, title, description, href, image, config, position) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run(slug, title, description, href, image, JSON.stringify(configResult.value), position);
    revalidateContentPaths();
    revalidatePath(href);
    return { success: SUCCESS_MESSAGE };
  } catch (error) {
    console.error("createProductStyleAction", error);
    return { error: "No pudimos guardar el producto." };
  }
}

export async function updateProductStyleAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireStaff();
  const id = parseId(formData);
  if (!id) {
    return { error: "No encontramos el producto indicado." };
  }

  const existing = findProductById(id);
  if (!existing) {
    return { error: "El producto que querés editar no existe." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageInput = String(formData.get("image") ?? "").trim();
  const imageFile = formData.get("imageFile");
  const position = parsePosition(formData.get("position"));
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = normalizeSlug(slugInput || title);

  if (!slug) {
    return { error: "Ingresá un identificador válido (solo letras, números y guiones)." };
  }

  if (slugExists(slug, id)) {
    return { error: "Ya existe un producto con ese identificador." };
  }

  const configResult = buildProductConfiguration(formData);
  if (!configResult.ok) {
    return { error: configResult.error };
  }

  let image = imageInput || existing.image;

  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveProductImage(imageFile, slug);
    } catch (error) {
      console.error("saveProductImage", error);
      return { error: "No pudimos guardar la imagen del producto." };
    }
  }

  if (!title || !description || !image || position === null) {
    return { error: "Completá todos los campos." };
  }

  try {
    const href = `/design/${slug}`;
    db.prepare(
      "UPDATE product_styles SET slug = ?, title = ?, description = ?, href = ?, image = ?, config = ?, position = ? WHERE id = ?",
    ).run(slug, title, description, href, image, JSON.stringify(configResult.value), position, id);
    revalidateContentPaths();
    revalidatePath(href);
    revalidatePath(existing.href);
    return { success: "Actualizado correctamente." };
  } catch (error) {
    console.error("updateProductStyleAction", error);
    return { error: "No pudimos actualizar el producto." };
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

export async function deleteProductStyleAction(formData: FormData): Promise<void> {
  await requireStaff();
  const id = parseId(formData);
  if (!id) return;
  db.prepare("DELETE FROM product_styles WHERE id = ?").run(id);
  revalidateContentPaths();
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
