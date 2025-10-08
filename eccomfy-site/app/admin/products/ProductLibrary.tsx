"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";

import type { ProductStyle } from "@/lib/content";

import {
  deleteProductStyleAction,
  updateProductStyleAction,
  type ContentFormState,
} from "../content/actions";
import { FormMessage, ProductFormFields, SubmitButton, productToFormDefaults } from "./ProductStyleForm";

const INITIAL_STATE: ContentFormState = {};

type ProductLibraryProps = {
  products: ProductStyle[];
};

export function ProductLibrary({ products }: ProductLibraryProps) {
  return (
    <div className="space-y-6 rounded-[2.5rem] border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Productos en catálogo</h2>
          <p className="text-xs text-white/55">
            Editá o eliminá fichas existentes para mantener actualizado el catálogo público y el editor de diseño.
          </p>
        </div>
        <span className="inline-flex h-7 items-center justify-center rounded-full bg-white/10 px-3 text-xs font-semibold text-white/70">
          {products.length}
        </span>
      </div>

      {products.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-8 text-center text-sm text-white/60">
          Todavía no hay productos cargados. Cuando crees uno aparecerá acá para editarlo o eliminarlo.
        </p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
}

type ProductCardProps = {
  product: ProductStyle;
};

function ProductCard({ product }: ProductCardProps) {
  const [editing, setEditing] = useState(false);
  const details = useMemo(() => buildProductBadges(product), [product]);
  const position = Number.isFinite(product.position) ? product.position : 0;

  return (
    <li className="space-y-5 rounded-[2.25rem] border border-white/12 bg-white/5 p-6 text-white shadow-lg shadow-brand-navy/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
              #{position}
            </span>
            <h3 className="text-lg font-semibold text-white">{product.title}</h3>
          </div>
          <p className="text-sm text-white/70">{product.description}</p>
          <div className="flex flex-wrap gap-2">
            {details.map((detail) => (
              <span
                key={detail}
                className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/70"
              >
                {detail}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span className="rounded-full bg-white/5 px-3 py-1">Slug: {product.slug}</span>
            <span className="rounded-full bg-white/5 px-3 py-1">Imagen: {product.image}</span>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <Link
            href={product.href}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            Ver en catálogo
          </Link>
          <button
            type="button"
            onClick={() => setEditing((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border border-brand-yellow/60 bg-brand-yellow/10 px-4 py-2 text-xs font-semibold text-brand-yellow transition hover:bg-brand-yellow/20"
          >
            {editing ? "Cerrar edición" : "Editar"}
          </button>
          <form action={deleteProductStyleAction} className="inline-flex">
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Eliminar
            </button>
          </form>
        </div>
      </div>

      {editing ? <EditProductForm key={product.id} product={product} onClose={() => setEditing(false)} /> : null}
    </li>
  );
}

type EditProductFormProps = {
  product: ProductStyle;
  onClose: () => void;
};

function EditProductForm({ product, onClose }: EditProductFormProps) {
  const [state, action] = useFormState(updateProductStyleAction, INITIAL_STATE);
  const defaults = useMemo(() => productToFormDefaults(product), [product]);

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="space-y-6 rounded-[2rem] border border-white/15 bg-white/5 p-6"
    >
      <input type="hidden" name="id" value={product.id} />
      <ProductFormFields defaults={defaults} hideHeader />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormMessage state={state} />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Cancelar
          </button>
          <SubmitButton label="Actualizar producto" />
        </div>
      </div>
    </form>
  );
}

function buildProductBadges(product: ProductStyle): string[] {
  const badges: string[] = [];
  const { configuration } = product;

  if (configuration.product_type) {
    badges.push(configuration.product_type);
  }
  if (configuration.sizes.length > 0) {
    badges.push(`${configuration.sizes.length} medidas`);
  }
  if (configuration.possibilities.length > 0) {
    badges.push(`${configuration.possibilities.length} variantes`);
  }
  if (configuration.base_colors.length > 0) {
    badges.push(`${configuration.base_colors.length} colores base`);
  }
  if (configuration.serigraphy_colors.length > 0) {
    badges.push(`${configuration.serigraphy_colors.length} serigrafía`);
  }
  if (configuration.stock !== null && configuration.stock !== undefined) {
    badges.push(`Stock ${configuration.stock}`);
  }
  if (configuration.unit_price !== null && configuration.unit_price !== undefined) {
    badges.push(`USD ${Number(configuration.unit_price).toFixed(2)}`);
  }

  return Array.from(new Set(badges));
}
