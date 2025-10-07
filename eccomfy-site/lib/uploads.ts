import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const productImagesDir = path.join(uploadsDir, "products");

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function resolveExtension(fileName: string): string {
  const ext = path.extname(fileName);
  if (ext && /^\.[a-z0-9]+$/i.test(ext)) {
    return ext.toLowerCase();
  }
  return ".png";
}

export async function saveProductImage(file: File, slug: string): Promise<string> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("INVALID_FILE");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length === 0) {
    throw new Error("EMPTY_FILE");
  }

  const safeSlug = sanitizeSlug(slug || "producto");
  const fileName = `${safeSlug || "producto"}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${resolveExtension(file.name)}`;
  await ensureDir(productImagesDir);

  const destination = path.join(productImagesDir, fileName);
  await fs.writeFile(destination, buffer);

  return `/uploads/products/${fileName}`;
}
