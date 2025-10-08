"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
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
    <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-brand-navy/5">
      <header>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="mt-1 text-xs text-white/60">{description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
};

function Field({ label, children, hint, className }: FieldProps) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <label className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">{label}</span>
        {children}
      </label>
      {hint ? <p className="text-[11px] text-white/50">{hint}</p> : null}
    </div>
  );
}

type TextInputProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  min?: number;
  step?: number | string;
};

function TextInput({ name, placeholder, defaultValue, type = "text", required, min, step }: TextInputProps) {
  return (
    <input
      name={name}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      required={required}
      min={min}
      step={step}
      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
    />
  );
}

type TextAreaProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
};

function TextArea({ name, placeholder, defaultValue, required, rows = 4 }: TextAreaProps) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
    />
  );
}

type ProductFormFieldsProps = {
  defaults: ProductFormDefaults;
  hideHeader?: boolean;
};

export function ProductFormFields({ defaults, hideHeader = false }: ProductFormFieldsProps) {
  const materialsPlaceholder = useMemo(
    () => "Cartón kraft|Textura natural\nCartón reforzado|Doble pared",
    [],
  );
  const [imagePreview, setImagePreview] = useState(defaults.image);
  const objectUrlRef = useRef<string>();

  useEffect(() => {
    setImagePreview(defaults.image);
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = undefined;
      }
    };
  }, [defaults.image]);

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    if (!file) {
      setImagePreview(defaults.image);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = undefined;
      }
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = undefined;
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setImagePreview(url);
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="rounded-3xl border border-white/15 bg-brand-navy/40 p-5 text-white shadow-inner shadow-brand-navy/30">
          <h3 className="text-xl font-semibold">Crear un nuevo producto</h3>
          <p className="mt-1 text-sm text-white/60">
            Reuní toda la información comercial y técnica para publicarla automáticamente en el catálogo y en el editor 3D.
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
        </Field>
        <Field label="Posición en el listado">
          <TextInput
            name="position"
            type="number"
            min={0}
            placeholder="0"
            defaultValue={defaults.position}
            required
          />
        </Field>
      </FieldSection>

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
            placeholder={"Caja chica|120|80|40|1.85\nCaja grande|200|120|50|2.5"}
            defaultValue={defaults.sizes}
            required
          />
        </Field>
        <Field label="Tipo de producto" hint="Por ejemplo: Caja, Bolsa, Tubo, etc.">
          <TextInput name="productType" placeholder="Caja" defaultValue={defaults.productType} required />
        </Field>
        <Field label="Posibilidades (una por línea)" hint="Se mostrará como variantes sugeridas dentro del producto.">
          <TextArea
            name="possibilities"
            placeholder={"Caja kraft\nCaja reforzada\nBolsa de poliéster"}
            defaultValue={defaults.possibilities}
          />
        </Field>
        <Field label="Stock disponible" hint="Ingresá las unidades actualmente disponibles.">
          <TextInput
            name="stock"
            type="number"
            min={0}
            placeholder="250"
            defaultValue={defaults.stock}
            required
          />
        </Field>
      </FieldSection>

      <FieldSection title="Colores y materiales" description="Configura opciones base y alternativas para serigrafía y materiales.">
        <Field label="Colores base de las cajas" hint="Cargá un color por línea.">
          <TextArea name="baseColors" placeholder={"Blanco\nKraft\nNegro"} defaultValue={defaults.baseColors} />
        </Field>
        <Field label="Colores disponibles para serigrafía" hint="Un color por línea, se suman al selector general.">
          <TextArea
            name="serigraphyColors"
            placeholder={"Azul Eccomfy\nRojo Pantone 485\nVerde institucional"}
            defaultValue={defaults.serigraphyColors}
          />
        </Field>
        <Field
          label="Materiales (uno por línea)"
          hint="Podés agregar descripción y multiplicador con el formato Nombre|Descripción|Multiplicador."
          className="md:col-span-2"
        >
          <TextArea
            name="materials"
            placeholder={materialsPlaceholder}
            defaultValue={defaults.materials}
            required
          />
        </Field>
      </FieldSection>

      <FieldSection title="Precios y cantidades" description="Cargá precios de referencia y límites de compra para el producto.">
        <Field label="Precio unitario de la caja (USD)">
          <TextInput
            name="unitPrice"
            type="number"
            step="0.01"
            min={0}
            placeholder="5.90"
            defaultValue={defaults.unitPrice}
            required
          />
        </Field>
        <Field label="Compra mínima">
          <TextInput
            name="minPurchase"
            type="number"
            min={0}
            placeholder="100"
            defaultValue={defaults.minPurchase}
          />
        </Field>
        <Field label="Compra máxima">
          <TextInput
            name="maxPurchase"
            type="number"
            min={0}
            placeholder="5000"
            defaultValue={defaults.maxPurchase}
          />
        </Field>
      </FieldSection>
    </div>
  );
}

export function ProductStyleForm({ defaultPosition }: { defaultPosition: number }) {
  const [state, formAction] = useFormState(createProductStyleAction, INITIAL_STATE);
  const defaults = useMemo(() => buildEmptyProductDefaults(defaultPosition), [defaultPosition]);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="space-y-6 rounded-[2.75rem] border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-8 shadow-xl shadow-brand-navy/20 backdrop-blur"
    >
      <ProductFormFields defaults={defaults} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormMessage state={state} />
        <SubmitButton label="Guardar producto" />
      </div>
    </form>
  );
}
