"use client";

import { useEffect, useMemo } from "react";
import { useFormState } from "react-dom";

import type { ProductStyle } from "@/lib/content";

import {
  updateProductStyleAction,
  type ContentFormState,
} from "../../admin/content/actions";
import {
  FormMessage,
  ProductFormFields,
  SubmitButton,
  productToFormDefaults,
} from "../../admin/products/ProductStyleForm";

const INITIAL_STATE: ContentFormState = {};

type Props = {
  product: ProductStyle;
};

export function ProductStaffEditor({ product }: Props) {
  const [state, action] = useFormState(updateProductStyleAction, INITIAL_STATE);
  const defaults = useMemo(() => productToFormDefaults(product), [product]);

  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.success]);

  return (
    <div className="space-y-6 rounded-[3rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
      <div className="space-y-2 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
          Edición rápida
        </p>
        <h2 className="text-2xl font-semibold">Actualizar {product.title}</h2>
        <p className="text-sm text-white/70">
          Modificá la ficha técnica y comercial del producto sin salir de la vista de diseño. Los cambios se reflejan en el
          catálogo y en el editor 3D luego de guardar.
        </p>
      </div>

      <form action={action} className="space-y-6 rounded-[2.5rem] border border-white/15 bg-white/5 p-6">
        <input type="hidden" name="id" value={product.id} />
        <ProductFormFields defaults={defaults} hideHeader />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FormMessage state={state} />
          <SubmitButton label="Guardar cambios" />
        </div>
      </form>
    </div>
  );
}
