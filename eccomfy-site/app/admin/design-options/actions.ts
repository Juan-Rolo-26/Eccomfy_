"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { requireStaff } from "@/lib/auth";

const DESIGN_INDEX_PATH = "/design";
const DESIGN_PRODUCT_PATH = "/design/[slug]";
const ADMIN_PATH = "/admin/design-options";

export type FormState = {
  error?: string;
  success?: string;
};

function revalidateDesign() {
  revalidatePath(DESIGN_INDEX_PATH);
  revalidatePath(DESIGN_PRODUCT_PATH);
  revalidatePath(ADMIN_PATH);
}

function parseNumber(value: FormDataEntryValue | null): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

function parseInteger(value: FormDataEntryValue | null): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

async function ensureStaff() {
  await requireStaff();
}

function success(message: string): FormState {
  revalidateDesign();
  return { success: message };
}

function failure(message = "No pudimos guardar los datos."): FormState {
  return { error: message };
}

function parsePosition(value: FormDataEntryValue | null): number {
  return parseInteger(value) ?? 0;
}

export async function createSizeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await ensureStaff();
  const label = String(formData.get("label") ?? "").trim();
  const width = parseInteger(formData.get("width"));
  const height = parseInteger(formData.get("height"));
  const depth = parseInteger(formData.get("depth"));
  const basePrice = parseNumber(formData.get("basePrice"));
  const position = parsePosition(formData.get("position"));

  if (!label || width === null || height === null || depth === null || basePrice === null) {
    return failure("Completá todos los campos con valores válidos.");
  }

  try {
    db.prepare(
      "INSERT INTO design_sizes (label, width_mm, height_mm, depth_mm, base_price, position) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(label, width, height, depth, basePrice, position);
    return success("Medida agregada.");
  } catch (error) {
    console.error("createSizeAction", error);
    return failure();
  }
}

export async function deleteSizeAction(formData: FormData): Promise<void> {
  await ensureStaff();
  const id = parseInteger(formData.get("id"));
  if (!id) return;
  db.prepare("DELETE FROM design_sizes WHERE id = ?").run(id);
  revalidateDesign();
}

export async function updateSizeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await ensureStaff();
  const id = parseInteger(formData.get("id"));
  const label = String(formData.get("label") ?? "").trim();
  const width = parseInteger(formData.get("width"));
  const height = parseInteger(formData.get("height"));
  const depth = parseInteger(formData.get("depth"));
  const basePrice = parseNumber(formData.get("basePrice"));
  const position = parsePosition(formData.get("position"));

  if (!id || !label || width === null || height === null || depth === null || basePrice === null) {
    return failure("Revisá los datos ingresados para la medida.");
  }

  try {
    db.prepare(
      "UPDATE design_sizes SET label = ?, width_mm = ?, height_mm = ?, depth_mm = ?, base_price = ?, position = ? WHERE id = ?",
    ).run(label, width, height, depth, basePrice, position, id);
    return success("Medida actualizada.");
  } catch (error) {
    console.error("updateSizeAction", error);
    return failure();
  }
}

function createGenericInsertAction(
  table: string,
  options: { description?: boolean; modifier?: boolean },
  successMessage: string,
) {
  return async function (_prev: FormState, formData: FormData): Promise<FormState> {
    await ensureStaff();
    const label = String(formData.get("label") ?? "").trim();
    const descriptionRaw = options.description ? String(formData.get("description") ?? "").trim() : null;
    const description = descriptionRaw ? descriptionRaw : null;
    const priceModifier = options.modifier
      ? parseNumber(formData.get("priceModifier")) ?? 1
      : 1;
    const position = parseInteger(formData.get("position")) ?? 0;

    if (!label) {
      return failure("Completá todos los campos obligatorios.");
    }

    try {
      const sql = `INSERT INTO ${table} (label${options.description ? ", description" : ""}, price_modifier, position) VALUES (?, ${options.description ? "?, " : ""}?, ?)`;
      const params = options.description
        ? [label, description, priceModifier, position]
        : [label, priceModifier, position];
      db.prepare(sql).run(...params);
      return success(successMessage);
    } catch (error) {
      console.error(`create action ${table}`, error);
      return failure();
    }
  };
}

function createGenericDeleteAction(table: string) {
  return async function (formData: FormData): Promise<void> {
    await ensureStaff();
    const id = parseInteger(formData.get("id"));
    if (!id) return;
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    revalidateDesign();
  };
}

function createGenericUpdateAction(
  table: string,
  options: { description?: boolean; modifier?: boolean },
  successMessage: string,
) {
  return async function (_prev: FormState, formData: FormData): Promise<FormState> {
    await ensureStaff();
    const id = parseInteger(formData.get("id"));
    const label = String(formData.get("label") ?? "").trim();
    const descriptionRaw = options.description ? String(formData.get("description") ?? "").trim() : null;
    const description = descriptionRaw ? descriptionRaw : null;
    const priceModifier = options.modifier ? parseNumber(formData.get("priceModifier")) ?? 1 : 1;
    const position = parsePosition(formData.get("position"));

    if (!id || !label) {
      return failure("Revisá los campos obligatorios.");
    }

    try {
      const sql = `UPDATE ${table} SET label = ?${options.description ? ", description = ?" : ""}, price_modifier = ?, position = ? WHERE id = ?`;
      const params = options.description
        ? [label, description, priceModifier, position, id]
        : [label, priceModifier, position, id];
      db.prepare(sql).run(...params);
      return success(successMessage);
    } catch (error) {
      console.error(`update action ${table}`, error);
      return failure();
    }
  };
}

export const createMaterialAction = createGenericInsertAction(
  "design_materials",
  { description: true, modifier: true },
  "Material agregado.",
);
export const deleteMaterialAction = createGenericDeleteAction("design_materials");
export const updateMaterialAction = createGenericUpdateAction(
  "design_materials",
  { description: true, modifier: true },
  "Material actualizado.",
);

export const createFinishAction = createGenericInsertAction(
  "design_finishes",
  { description: true, modifier: true },
  "Acabado agregado.",
);
export const deleteFinishAction = createGenericDeleteAction("design_finishes");
export const updateFinishAction = createGenericUpdateAction(
  "design_finishes",
  { description: true, modifier: true },
  "Acabado actualizado.",
);

export const createPrintSideAction = createGenericInsertAction(
  "design_print_sides",
  { description: true, modifier: true },
  "Opción de impresión agregada.",
);
export const deletePrintSideAction = createGenericDeleteAction("design_print_sides");
export const updatePrintSideAction = createGenericUpdateAction(
  "design_print_sides",
  { description: true, modifier: true },
  "Opción de impresión actualizada.",
);

export const createSpeedAction = createGenericInsertAction(
  "design_production_speeds",
  { description: true, modifier: true },
  "Velocidad agregada.",
);
export const deleteSpeedAction = createGenericDeleteAction("design_production_speeds");
export const updateSpeedAction = createGenericUpdateAction(
  "design_production_speeds",
  { description: true, modifier: true },
  "Velocidad actualizada.",
);

export async function createQuantityAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await ensureStaff();
  const label = String(formData.get("label") ?? "").trim();
  const quantity = parseInteger(formData.get("quantity"));
  const priceModifier = parseNumber(formData.get("priceModifier")) ?? 1;
  const position = parsePosition(formData.get("position"));

  if (!label || quantity === null) {
    return failure("Completá todos los campos obligatorios.");
  }

  try {
    db.prepare(
      "INSERT INTO design_quantities (label, quantity, price_modifier, position) VALUES (?, ?, ?, ?)",
    ).run(label, quantity, priceModifier, position);
    return success("Stock agregado.");
  } catch (error) {
    console.error("createQuantityAction", error);
    return failure();
  }
}

export const deleteQuantityAction = createGenericDeleteAction("design_quantities");

export async function updateQuantityAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await ensureStaff();
  const id = parseInteger(formData.get("id"));
  const label = String(formData.get("label") ?? "").trim();
  const quantity = parseInteger(formData.get("quantity"));
  const priceModifier = parseNumber(formData.get("priceModifier")) ?? 1;
  const position = parsePosition(formData.get("position"));

  if (!id || !label || quantity === null) {
    return failure("Revisá los campos obligatorios.");
  }

  try {
    db.prepare(
      "UPDATE design_quantities SET label = ?, quantity = ?, price_modifier = ?, position = ? WHERE id = ?",
    ).run(label, quantity, priceModifier, position, id);
    return success("Stock actualizado.");
  } catch (error) {
    console.error("updateQuantityAction", error);
    return failure();
  }
}
