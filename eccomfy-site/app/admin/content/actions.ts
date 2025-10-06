"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { requireStaff } from "@/lib/auth";

export type ContentFormState = {
  error?: string;
  success?: string;
};

const SUCCESS_MESSAGE = "Creado correctamente.";

function parsePosition(input: FormDataEntryValue | null): number | null {
  const value = Number(input);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.floor(value);
}

function revalidateContentPaths() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/content");
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
  const href = String(formData.get("href") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const position = parsePosition(formData.get("position"));

  if (!title || !description || !href || !image || position === null) {
    return { error: "Completá todos los campos." };
  }

  try {
    db.prepare(
      "INSERT INTO product_styles (title, description, href, image, position) VALUES (?, ?, ?, ?, ?)",
    ).run(title, description, href, image, position);
    revalidateContentPaths();
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
