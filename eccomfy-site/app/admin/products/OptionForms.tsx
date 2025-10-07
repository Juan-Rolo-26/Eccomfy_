"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  type FormState,
  createSizeAction,
  deleteSizeAction,
  updateSizeAction,
  createMaterialAction,
  deleteMaterialAction,
  updateMaterialAction,
  createFinishAction,
  deleteFinishAction,
  updateFinishAction,
  createPrintSideAction,
  deletePrintSideAction,
  updatePrintSideAction,
  createSpeedAction,
  deleteSpeedAction,
  updateSpeedAction,
  createQuantityAction,
  deleteQuantityAction,
  updateQuantityAction,
} from "./actions";

import type {
  DesignSize,
  DesignMaterial,
  DesignQuantity,
} from "@/lib/designOptions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-4 py-2 text-xs font-semibold text-brand-navy shadow-lg shadow-brand-navy/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Guardando..." : label}
    </button>
  );
}

function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100">
        {state.success}
      </p>
    );
  }
  return null;
}

export function SizeForm({ sizes }: { sizes: DesignSize[] }) {
  const [state, action] = useFormState<FormState, FormData>(createSizeAction, {});
  return (
    <section className="space-y-6 rounded-[2.5rem] border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div>
        <h2 className="text-xl font-semibold text-white">Medidas disponibles</h2>
        <p className="text-xs text-white/60">Definí tamaños estándar para cada estilo.</p>
      </div>
      <form action={action} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Nombre
          <input
            name="label"
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Ancho (mm)
          <input
            name="width"
            type="number"
            min={1}
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Alto (mm)
          <input
            name="height"
            type="number"
            min={1}
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Profundidad (mm)
          <input
            name="depth"
            type="number"
            min={1}
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Precio base (USD)
          <input
            name="basePrice"
            type="number"
            step="0.01"
            min={0}
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Posición
          <input
            name="position"
            type="number"
            min={0}
            defaultValue={sizes.length}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FormMessage state={state} />
          <SubmitButton label="Agregar medida" />
        </div>
      </form>

      <ul className="space-y-3 text-sm text-white/80">
        {sizes.length === 0 ? (
          <li className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/60">
            Todavía no hay medidas cargadas.
          </li>
        ) : (
          sizes.map((size) => <SizeListItem key={size.id} size={size} />)
        )}
      </ul>
    </section>
  );
}

function SizeListItem({ size }: { size: DesignSize }) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, action] = useFormState<FormState, FormData>(updateSizeAction, {});

  useEffect(() => {
    if (state.success) {
      setIsEditing(false);
    }
  }, [state.success]);

  return (
    <li className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/80">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-white">{size.label}</p>
          <p className="text-xs text-white/60">
            {size.width_mm} × {size.height_mm} × {size.depth_mm} mm • Precio base ${size.base_price.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            {isEditing ? "Cerrar" : "Editar"}
          </button>
          <form action={deleteSizeAction}>
            <input type="hidden" name="id" value={size.id} />
            <button
              type="submit"
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Eliminar
            </button>
          </form>
        </div>
      </div>

      {isEditing ? (
        <form action={action} className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input type="hidden" name="id" value={size.id} />
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Nombre
            <input
              name="label"
              defaultValue={size.label}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Ancho (mm)
            <input
              name="width"
              type="number"
              min={1}
              defaultValue={size.width_mm}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Alto (mm)
            <input
              name="height"
              type="number"
              min={1}
              defaultValue={size.height_mm}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Profundidad (mm)
            <input
              name="depth"
              type="number"
              min={1}
              defaultValue={size.depth_mm}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Precio base (USD)
            <input
              name="basePrice"
              type="number"
              step="0.01"
              min={0}
              defaultValue={size.base_price}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Posición
            <input
              name="position"
              type="number"
              min={0}
              defaultValue={size.position}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FormMessage state={state} />
            <div className="flex flex-wrap gap-2">
              <SubmitButton label="Guardar cambios" />
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {!isEditing && state.success ? (
        <p className="mt-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100">
          {state.success}
        </p>
      ) : null}
    </li>
  );
}

function GenericForm({
  title,
  subtitle,
  submitLabel,
  action,
  deleteAction,
  updateAction,
  items,
  showDescription,
  showModifier,
}: {
  title: string;
  subtitle: string;
  submitLabel: string;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (formData: FormData) => Promise<void>;
  updateAction: (prev: FormState, formData: FormData) => Promise<FormState>;
  items: Array<DesignMaterial>;
  showDescription?: boolean;
  showModifier?: boolean;
}) {
  const [state, formAction] = useFormState<FormState, FormData>(action, {});

  return (
    <section className="space-y-6 rounded-[2.5rem] border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-xs text-white/60">{subtitle}</p>
      </div>
      <form action={formAction} className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Nombre
          <input
            name="label"
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        {showDescription ? (
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 md:col-span-2">
            Descripción (opcional)
            <input
              name="description"
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
        ) : null}
        {showModifier ? (
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Multiplicador de precio
            <input
              name="priceModifier"
              type="number"
              step="0.01"
              min={0}
              defaultValue={1}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
        ) : null}
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Posición
          <input
            name="position"
            type="number"
            min={0}
            defaultValue={items.length}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FormMessage state={state} />
          <SubmitButton label={submitLabel} />
        </div>
      </form>

      <ul className="space-y-3 text-sm text-white/80">
        {items.length === 0 ? (
          <li className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/60">
            Todavía no hay registros.
          </li>
        ) : (
          items.map((item) => (
            <GenericListItem
              key={item.id}
              item={item}
              deleteAction={deleteAction}
              updateAction={updateAction}
              showDescription={showDescription}
              showModifier={showModifier}
            />
          ))
        )}
      </ul>
    </section>
  );
}

function GenericListItem({
  item,
  deleteAction,
  updateAction,
  showDescription,
  showModifier,
}: {
  item: DesignMaterial;
  deleteAction: (formData: FormData) => Promise<void>;
  updateAction: (prev: FormState, formData: FormData) => Promise<FormState>;
  showDescription?: boolean;
  showModifier?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, action] = useFormState<FormState, FormData>(updateAction, {});

  useEffect(() => {
    if (state.success) {
      setIsEditing(false);
    }
  }, [state.success]);

  return (
    <li className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/80">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-white">{item.label}</p>
          {showDescription && item.description ? (
            <p className="text-xs text-white/60">{item.description}</p>
          ) : null}
          {showModifier ? (
            <p className="text-xs text-white/60">Multiplicador: ×{item.price_modifier}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            {isEditing ? "Cerrar" : "Editar"}
          </button>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Eliminar
            </button>
          </form>
        </div>
      </div>

      {isEditing ? (
        <form action={action} className="mt-4 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={item.id} />
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Nombre
            <input
              name="label"
              defaultValue={item.label}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          {showModifier ? (
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Multiplicador de precio
              <input
                name="priceModifier"
                type="number"
                step="0.01"
                min={0}
                defaultValue={item.price_modifier}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
              />
            </label>
          ) : null}
          {showDescription ? (
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 md:col-span-2">
              Descripción (opcional)
              <input
                name="description"
                defaultValue={item.description ?? ""}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
              />
            </label>
          ) : null}
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Posición
            <input
              name="position"
              type="number"
              min={0}
              defaultValue={item.position}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FormMessage state={state} />
            <div className="flex flex-wrap gap-2">
              <SubmitButton label="Guardar cambios" />
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {!isEditing && state.success ? (
        <p className="mt-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100">
          {state.success}
        </p>
      ) : null}
    </li>
  );
}

export function QuantityForm({ quantities }: { quantities: DesignQuantity[] }) {
  const [state, action] = useFormState<FormState, FormData>(createQuantityAction, {});

  return (
    <section className="space-y-6 rounded-[2.5rem] border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div>
        <h2 className="text-xl font-semibold text-white">Stock disponible</h2>
        <p className="text-xs text-white/60">Cargá el stock máximo que cada cliente puede pedir y su multiplicador de precio.</p>
      </div>
      <form action={action} className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Etiqueta
          <input
            name="label"
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Stock máximo
          <input
            name="quantity"
            type="number"
            min={1}
            required
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Multiplicador de precio
          <input
            name="priceModifier"
            type="number"
            step="0.01"
            min={0}
            defaultValue={1}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Posición
          <input
            name="position"
            type="number"
            min={0}
            defaultValue={quantities.length}
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          />
        </label>
        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FormMessage state={state} />
          <SubmitButton label="Agregar cantidad" />
        </div>
      </form>

      <ul className="space-y-3 text-sm text-white/80">
        {quantities.length === 0 ? (
          <li className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/60">
            Todavía no hay stock cargado.
          </li>
        ) : (
          quantities.map((item) => <QuantityListItem key={item.id} quantity={item} />)
        )}
      </ul>
    </section>
  );
}

function QuantityListItem({ quantity }: { quantity: DesignQuantity }) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, action] = useFormState<FormState, FormData>(updateQuantityAction, {});

  useEffect(() => {
    if (state.success) {
      setIsEditing(false);
    }
  }, [state.success]);

  return (
    <li className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/80">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-white">{quantity.label}</p>
          <p className="text-xs text-white/60">
            Stock: {quantity.quantity} unidades • Multiplicador ×{quantity.price_modifier}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            {isEditing ? "Cerrar" : "Editar"}
          </button>
          <form action={deleteQuantityAction}>
            <input type="hidden" name="id" value={quantity.id} />
            <button
              type="submit"
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Eliminar
            </button>
          </form>
        </div>
      </div>

      {isEditing ? (
        <form action={action} className="mt-4 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={quantity.id} />
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Etiqueta
            <input
              name="label"
              defaultValue={quantity.label}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Stock máximo
            <input
              name="quantity"
              type="number"
              min={1}
              defaultValue={quantity.quantity}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Multiplicador de precio
            <input
              name="priceModifier"
              type="number"
              step="0.01"
              min={0}
              defaultValue={quantity.price_modifier}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Posición
            <input
              name="position"
              type="number"
              min={0}
              defaultValue={quantity.position}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            />
          </label>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FormMessage state={state} />
            <div className="flex flex-wrap gap-2">
              <SubmitButton label="Guardar cambios" />
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {!isEditing && state.success ? (
        <p className="mt-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100">
          {state.success}
        </p>
      ) : null}
    </li>
  );
}

export const MaterialForm = (props: { items: DesignMaterial[]; title: string; subtitle: string }) => (
  <GenericForm
    title={props.title}
    subtitle={props.subtitle}
    submitLabel="Agregar"
    action={createMaterialAction}
    deleteAction={deleteMaterialAction}
    updateAction={updateMaterialAction}
    items={props.items}
    showDescription
    showModifier
  />
);

export const FinishForm = (props: { items: DesignMaterial[]; title: string; subtitle: string }) => (
  <GenericForm
    title={props.title}
    subtitle={props.subtitle}
    submitLabel="Agregar"
    action={createFinishAction}
    deleteAction={deleteFinishAction}
    updateAction={updateFinishAction}
    items={props.items}
    showDescription
    showModifier
  />
);

export const PrintSideForm = (props: { items: DesignMaterial[]; title: string; subtitle: string }) => (
  <GenericForm
    title={props.title}
    subtitle={props.subtitle}
    submitLabel="Agregar"
    action={createPrintSideAction}
    deleteAction={deletePrintSideAction}
    updateAction={updatePrintSideAction}
    items={props.items}
    showDescription
    showModifier
  />
);

export const SpeedForm = (props: { items: DesignMaterial[]; title: string; subtitle: string }) => (
  <GenericForm
    title={props.title}
    subtitle={props.subtitle}
    submitLabel="Agregar"
    action={createSpeedAction}
    deleteAction={deleteSpeedAction}
    updateAction={updateSpeedAction}
    items={props.items}
    showDescription
    showModifier
  />
);
