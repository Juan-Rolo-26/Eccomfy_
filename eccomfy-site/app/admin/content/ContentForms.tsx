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
            placeholder="Mailer"
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          URL destino
          <input
            name="href"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="/design/mailer"
            required
          />
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
            placeholder="/box-mailer.svg"
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
