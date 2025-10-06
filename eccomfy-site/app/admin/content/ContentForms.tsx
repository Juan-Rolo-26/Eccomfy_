"use client";

import { useFormState, useFormStatus } from "react-dom";

import {
  type ContentFormState,
  createProductStyleAction,
  createMetricAction,
  createTestimonialAction,
  createBrandAction,
} from "./actions";

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
    <form action={formAction} className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Nuevo producto destacado</h3>
        <SubmitButton label="Agregar producto" />
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
          <p className="mt-1 text-[11px] text-white/50">Se usa para la URL: /design/&lt;slug&gt;. Se completa automáticamente si lo dejás vacío.</p>
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
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Posición
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

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Medidas disponibles
          <textarea
            name="sizes"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Pequeña|120|80|40|1.85\nGrande|200|120|50|2.5"}
            required
          />
          <p className="mt-1 text-[11px] text-white/50">Formato: Nombre|Ancho|Alto|Profundidad|Precio base (mm y USD).</p>
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Materiales
          <textarea
            name="materials"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Cartulina premium|Ideal para retail|1\nKraft reciclado|Textura natural|1.1"}
            required
          />
          <p className="mt-1 text-[11px] text-white/50">Formato: Nombre|Descripción opcional|Multiplicador de precio.</p>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Acabados
          <textarea
            name="finishes"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Mate soft touch||1\nBarniz UV|Resalta logos|1.2"}
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Caras impresas
          <textarea
            name="printSides"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Exterior|Ideal para branding|1\nExterior e interior|Máximo impacto|1.35"}
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Velocidades de producción
          <textarea
            name="productionSpeeds"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Estándar|13-18 días hábiles|1\nRápida|7-9 días hábiles|1.3"}
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Cantidades disponibles
          <textarea
            name="quantities"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Caja de 100|100|1\nCaja de 500|500|0.85"}
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Colores disponibles
          <textarea
            name="colors"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder={"Blanco|#FFFFFF|1\nNegro|#111111|1.05"}
          />
          <p className="mt-1 text-[11px] text-white/50">Formato: Nombre|Hex opcional|Multiplicador.</p>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Pedido mínimo sugerido
            <input
              name="minQuantity"
              type="number"
              min={0}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
              placeholder="100"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Pedido máximo sugerido
            <input
              name="maxQuantity"
              type="number"
              min={0}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
              placeholder="5000"
            />
          </label>
        </div>
      </div>

      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Highlights (separá cada punto en una línea)
        <textarea
          name="highlights"
          rows={3}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder={"Se entrega plegada\nIncluye solapas reforzadas"}
        />
      </label>
      <FormMessage state={state} />
    </form>
  );
}

export function MetricForm() {
  const [state, formAction] = useFormState(createMetricAction, INITIAL_STATE);
  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Nueva métrica</h3>
        <SubmitButton label="Agregar métrica" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Valor
          <input
            name="value"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="450+"
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Posición
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
        Etiqueta
        <input
          name="label"
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder="marcas lanzaron sus cajas con eccomfy"
          required
        />
      </label>
      <FormMessage state={state} />
    </form>
  );
}

export function TestimonialForm() {
  const [state, formAction] = useFormState(createTestimonialAction, INITIAL_STATE);
  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Nuevo testimonio</h3>
        <SubmitButton label="Agregar testimonio" />
      </div>
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Quote
        <textarea
          name="quote"
          rows={3}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder="El precio instantáneo nos ahorró horas..."
          required
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Nombre
          <input
            name="name"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="Valentina R."
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Rol
          <input
            name="role"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="Brand Manager — Tienda Verde"
            required
          />
        </label>
      </div>
      <div className="flex items-center gap-3 text-sm text-white/70">
        <input
          id="highlight"
          name="highlight"
          type="checkbox"
          className="h-4 w-4 rounded border border-white/40 bg-transparent text-brand-yellow focus:ring-2 focus:ring-brand-yellow/60"
        />
        <label htmlFor="highlight">Destacar este testimonio</label>
      </div>
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Posición
        <input
          name="position"
          type="number"
          min={0}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder="0"
          required
        />
      </label>
      <FormMessage state={state} />
    </form>
  );
}

export function BrandForm() {
  const [state, formAction] = useFormState(createBrandAction, INITIAL_STATE);
  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Nueva marca</h3>
        <SubmitButton label="Agregar marca" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Nombre marca
          <input
            name="name"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="Eccomfy"
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Posición
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
      <FormMessage state={state} />
    </form>
  );
}
