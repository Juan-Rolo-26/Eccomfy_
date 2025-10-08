"use client";

import { useFormState, useFormStatus } from "react-dom";

import { createProductStyleAction, type ContentFormState } from "../content/actions";

const INITIAL_STATE: ContentFormState = {};

function SubmitButton({ label }: { label: string }) {
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

function FormMessage({ state }: { state: ContentFormState }) {
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

export function ProductStyleForm() {
  const [state, formAction] = useFormState(createProductStyleAction, INITIAL_STATE);

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
        <SubmitButton label="Guardar producto" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Título
          <input
            name="title"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="Caja para botellas"
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Identificador (slug)
          <input
            name="slug"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="caja-botella"
          />
          <p className="mt-1 text-[11px] text-white/50">
            Se usa para la URL: /design/&lt;slug&gt;. Se completa automáticamente si lo dejás vacío.
          </p>
        </label>
      </div>
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Descripción breve
        <input
          name="description"
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder="Firme, premium y perfecto para e-commerce."
          required
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Imagen (ruta)
          <input
            name="image"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="/productos/caja-botella.png"
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
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="0"
            required
          />
        </label>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Medidas disponibles
          <textarea
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
