"use client";

import { useMemo, type ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";

import type { ProductStyle } from "@/lib/content";

import { createProductStyleAction, type ContentFormState } from "../content/actions";

const INITIAL_STATE: ContentFormState = {};

export type ProductFormDefaults = {
  title: string;
  slug: string;
  description: string;
  image: string;
  position: string;
  sizes: string;
  productType: string;
  possibilities: string;
  stock: string;
  baseColors: string;
  serigraphyColors: string;
  unitPrice: string;
  minPurchase: string;
  maxPurchase: string;
  materials: string;
};

export function buildEmptyProductDefaults(position = 0): ProductFormDefaults {
  return {
    title: "",
    slug: "",
    description: "",
    image: "",
    position: String(position ?? 0),
    sizes: "",
    productType: "",
    possibilities: "",
    stock: "",
    baseColors: "",
    serigraphyColors: "",
    unitPrice: "",
    minPurchase: "",
    maxPurchase: "",
    materials: "",
  };
}

export function productToFormDefaults(product: ProductStyle): ProductFormDefaults {
  const { configuration } = product;
  const formatSizeLine = (size: (typeof configuration)["sizes"][number]): string => {
    const baseParts = [size.label, size.width_mm, size.height_mm, size.depth_mm]
      .map((value) => String(value ?? ""))
      .filter((value) => value.length > 0);
    if (typeof size.base_price === "number" && Number.isFinite(size.base_price)) {
      baseParts.push(Number(size.base_price).toFixed(2));
    }
    return baseParts.join("|");
  };

  const formatMaterialLine = (material: (typeof configuration)["materials"][number]): string => {
    const parts = [material.label];
    if (material.description) {
      parts.push(material.description);
    }
    if (typeof material.price_modifier === "number" && material.price_modifier !== 1) {
      parts.push(Number(material.price_modifier).toFixed(4));
    }
    return parts.join("|");
  };

  return {
    title: product.title ?? "",
    slug: product.slug ?? "",
    description: product.description ?? "",
    image: product.image ?? "",
    position: String(product.position ?? 0),
    sizes: configuration.sizes.map(formatSizeLine).join("\n"),
    productType: configuration.product_type ?? "",
    possibilities: configuration.possibilities.join("\n"),
    stock:
      configuration.stock !== null && configuration.stock !== undefined ? String(configuration.stock) : "",
    baseColors: configuration.base_colors.join("\n"),
    serigraphyColors: configuration.serigraphy_colors.join("\n"),
    unitPrice:
      configuration.unit_price !== null && configuration.unit_price !== undefined
        ? Number(configuration.unit_price).toFixed(2)
        : "",
    minPurchase:
      configuration.min_quantity !== null && configuration.min_quantity !== undefined
        ? String(configuration.min_quantity)
        : "",
    maxPurchase:
      configuration.max_quantity !== null && configuration.max_quantity !== undefined
        ? String(configuration.max_quantity)
        : "",
    materials: configuration.materials.map(formatMaterialLine).join("\n"),
  };
}

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-5 py-2 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-navy/10 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Guardando..." : label}
    </button>
  );
}

export function FormMessage({ state }: { state: ContentFormState }) {
  if (state.error) {
    return (
      <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-200">
        {state.success}
      </p>
    );
  }
  return null;
}

type FieldSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function FieldSection({ title, description, children }: FieldSectionProps) {
  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Crear producto</h3>
          <p className="text-xs text-white/60">
            Cargá toda la información comercial y técnica para que aparezca en el catálogo y el editor 3D.
          </p>
        </div>
      )}

      <FieldSection title="Identidad" description="Nombre comercial, identificador y presentación básica del producto.">
        <Field label="Título" hint="Elegí un nombre comercial fácil de reconocer.">
          <TextInput name="title" placeholder="Caja para botellas" defaultValue={defaults.title} required />
        </Field>
        <Field
          label="Identificador (slug)"
          hint="Se usa para la URL: /design/&lt;slug&gt;. Se completa automáticamente si lo dejás vacío."
        >
          <TextInput name="slug" placeholder="caja-botella" defaultValue={defaults.slug} />
        </Field>
        <Field label="Descripción breve" className="md:col-span-2">
          <TextInput
            name="description"
            placeholder="Firme, premium y perfecto para e-commerce."
            defaultValue={defaults.description}
            required
          />
          <p className="mt-1 text-[11px] text-white/50">Podés cargar una ruta existente o subir una imagen debajo.</p>
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Posición en el listado
          <input
            name="position"
            type="number"
            min={0}
            placeholder="0"
            defaultValue={defaults.position}
            required
          />
        </Field>
      </FieldSection>

      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Imagen desde tu computadora
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          className="mt-2 block w-full text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-brand-yellow file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-navy hover:file:bg-brand-yellow/90"
        />
        <p className="mt-1 text-[11px] text-white/50">La imagen se guardará en /public/productos/&lt;slug&gt;.</p>
      </label>

      <FieldSection title="Imagen" description="Podés vincular una imagen existente o subir un archivo desde tu computadora.">
        <Field label="Ruta de imagen pública" hint="Se usará si no cargás un archivo nuevo.">
          <TextInput
            name="image"
            placeholder="/uploads/products/caja-botella.png"
            defaultValue={defaults.image}
          />
        </Field>
        <Field
          label="Subir archivo"
          hint="La imagen se guardará automáticamente en /public/uploads/products/."
          className="md:col-span-2"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="file"
              name="imageFile"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageFileChange}
              className="block w-full rounded-2xl border border-dashed border-white/25 bg-white/5 px-4 py-5 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white/90 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-brand-navy hover:border-white/40"
            />
            {imagePreview ? (
              <div className="relative h-20 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:w-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Vista previa de la imagen" className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>
        </Field>
      </FieldSection>

      <FieldSection title="Medidas y variantes" description="Definí el tipo de producto, medidas y variantes comerciales disponibles.">
        <Field
          label="Medidas disponibles"
          hint="Formato: Nombre|Ancho|Alto|Profundidad|Precio base (mm y USD)."
          className="md:col-span-2"
        >
          <TextArea
            name="sizes"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Caja chica|120|80|40|1.85\nCaja grande|200|120|50|2.5"}
            required
          />
          <p className="mt-1 text-[11px] text-white/50">Formato: Nombre|Ancho|Alto|Profundidad|Precio base (mm y USD).</p>
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Tipo de producto
          <input
            name="productType"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="Caja"
            required
          />
          <p className="mt-1 text-[11px] text-white/50">Por ejemplo: Caja, Bolsa, Tubo, etc.</p>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Posibilidades (una por línea)
          <textarea
            name="possibilities"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Caja kraft\nCaja reforzada\nBolsa de poliéster"}
          />
          <p className="mt-1 text-[11px] text-white/50">Se mostrará como variantes sugeridas dentro del producto.</p>
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Stock disponible
          <input
            name="stock"
            type="number"
            min={0}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="250"
            required
          />
          <p className="mt-1 text-[11px] text-white/50">Ingresá las unidades actualmente disponibles.</p>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Colores base de las cajas
          <textarea
            name="baseColors"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Blanco\nKraft\nNegro"}
          />
          <p className="mt-1 text-[11px] text-white/50">Cargá un color por línea.</p>
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Colores disponibles para serigrafía
          <textarea
            name="serigraphyColors"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Azul Eccomfy\nRojo Pantone 485\nVerde institucional"}
          />
          <p className="mt-1 text-[11px] text-white/50">Un color por línea, se suman al selector general.</p>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Precio unitario de la caja (USD)
          <input
            name="unitPrice"
            type="number"
            step="0.01"
            min={0}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="5.90"
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Compra mínima
            <input
              name="minPurchase"
              type="number"
              min={0}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
              placeholder="100"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Compra máxima
            <input
              name="maxPurchase"
              type="number"
              min={0}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
              placeholder="5000"
            />
          </label>
        </div>
      </div>

      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Materiales (uno por línea)
        <textarea
          name="materials"
          rows={4}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder={"Cartón kraft|Textura natural\nCartón reforzado|Doble pared"}
          required
        />
        <p className="mt-1 text-[11px] text-white/50">Podés agregar una descripción opcional usando el formato Nombre|Descripción.</p>
      </label>

      <FormMessage state={state} />
    </form>
  );
}
