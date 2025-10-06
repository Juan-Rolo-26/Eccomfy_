"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import type { ProductConfiguration } from "@/lib/content";

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

function parseQuantitiesInput(raw: string): ParseResult<ProductConfiguration["quantities"]> {
  const lines = parseLines(raw);
  if (lines.length === 0) {
    return { ok: false, error: "Cargá al menos una cantidad disponible (formato: etiqueta|stock|multiplicador)." };
  }

  const quantities = [] as ProductConfiguration["quantities"];

  for (const line of lines) {
    const [label, quantityRaw, modifierRaw] = line.split("|").map((part) => part.trim());
    if (!label || !quantityRaw) {
      return {
        ok: false,
        error: "Cada cantidad debe incluir etiqueta y unidades disponibles (por ejemplo: 500 u).",
      };
    }

    const quantity = parseInteger(quantityRaw);
    if (quantity === null || quantity <= 0) {
      return { ok: false, error: "Las unidades disponibles deben ser un entero mayor a 0." };
    }

    const modifier = modifierRaw ? parseDecimal(modifierRaw) : 1;
    if (modifier === null || modifier <= 0) {
      return {
        ok: false,
        error: "El multiplicador de precio para la cantidad debe ser un número mayor a 0.",
      };
    }

    quantities.push({
      label,
      quantity,
      price_modifier: Number(modifier.toFixed(4)),
    });
  }

  return { ok: true, value: quantities };
}

function parseColorsInput(raw: string): ParseResult<ProductConfiguration["colors"]> {
  const lines = parseLines(raw);
  if (lines.length === 0) {
    return { ok: true, value: [] };
  }

  const colors = [] as ProductConfiguration["colors"];

  for (const line of lines) {
    const [label, hexRaw, modifierRaw] = line.split("|").map((part) => part.trim());
    if (!label) {
      return { ok: false, error: "Cada color necesita un nombre." };
    }

    const modifier = modifierRaw ? parseDecimal(modifierRaw) : 1;
    if (modifier === null || modifier <= 0) {
      return { ok: false, error: "El multiplicador de color debe ser un número mayor a 0." };
    }

    const hex = hexRaw && /^#?[0-9a-fA-F]{6}$/.test(hexRaw) ? (hexRaw.startsWith("#") ? hexRaw : `#${hexRaw}`) : null;

    colors.push({ label, hex, price_modifier: Number(modifier.toFixed(4)) });
  }

  return { ok: true, value: colors };
}

function buildProductConfiguration(formData: FormData): ParseResult<ProductConfiguration> {
  const sizesResult = parseSizesInput(String(formData.get("sizes") ?? ""));
  if (!sizesResult.ok) return sizesResult;

  const materialsResult = parseMaterialsInput(String(formData.get("materials") ?? ""), "Materiales");
  if (!materialsResult.ok) return materialsResult;

  const finishesResult = parseMaterialsInput(String(formData.get("finishes") ?? ""), "Acabados");
  if (!finishesResult.ok) return finishesResult;

  const printSidesResult = parseMaterialsInput(String(formData.get("printSides") ?? ""), "Caras impresas");
  if (!printSidesResult.ok) return printSidesResult;

  const speedsResult = parseMaterialsInput(String(formData.get("productionSpeeds") ?? ""), "Velocidades de producción");
  if (!speedsResult.ok) return speedsResult;

  const quantitiesResult = parseQuantitiesInput(String(formData.get("quantities") ?? ""));
  if (!quantitiesResult.ok) return quantitiesResult;

  const colorsResult = parseColorsInput(String(formData.get("colors") ?? ""));
  if (!colorsResult.ok) return colorsResult;

  const highlights = parseLines(String(formData.get("highlights") ?? ""));

  const minQuantityRaw = String(formData.get("minQuantity") ?? "").trim();
  const maxQuantityRaw = String(formData.get("maxQuantity") ?? "").trim();

  const minQuantity = minQuantityRaw ? parseInteger(minQuantityRaw) : null;
  if (minQuantityRaw && (minQuantity === null || minQuantity < 0)) {
    return { ok: false, error: "El pedido mínimo debe ser un entero mayor o igual a 0." };
  }

  const maxQuantity = maxQuantityRaw ? parseInteger(maxQuantityRaw) : null;
  if (maxQuantityRaw && (maxQuantity === null || maxQuantity <= 0)) {
    return { ok: false, error: "El pedido máximo debe ser un entero mayor a 0." };
  }

  if (minQuantity !== null && maxQuantity !== null && maxQuantity < minQuantity) {
    return { ok: false, error: "El máximo debe ser mayor o igual al mínimo." };
  }

  const configuration: ProductConfiguration = {
    sizes: sizesResult.value,
    materials: materialsResult.value,
    finishes: finishesResult.value,
    printSides: printSidesResult.value,
    productionSpeeds: speedsResult.value,
    quantities: quantitiesResult.value,
    colors: colorsResult.value,
    highlights,
    min_quantity: minQuantity,
    max_quantity: maxQuantity,
  };

  return { ok: true, value: configuration };
}

function slugExists(slug: string): boolean {
  const row = db.prepare<{ count: number }>("SELECT COUNT(*) as count FROM product_styles WHERE slug = ?").get(slug);
  return (row?.count ?? 0) > 0;
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
  revalidatePath("/admin/content");
  revalidatePath("/products");
}

function parseId(formData: FormData, key = "id"): number | null {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return Math.floor(value);
}

export async function createProductStyleAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireStaff();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
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
