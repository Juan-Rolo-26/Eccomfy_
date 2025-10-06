"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  type ContentFormState,
  createProductAction,
  createMetricAction,
  createTestimonialAction,
  createBrandAction,
} from "./actions";

const INITIAL_STATE: ContentFormState = {};

type DraftEntry = {
  id: string;
} & Record<string, string>;

type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number";
  min?: number;
  step?: number;
  optional?: boolean;
};

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}

function createSizeDraft(position: number): DraftEntry {
  return {
    id: createId(),
    label: "",
    width: "",
    height: "",
    depth: "",
    basePrice: "",
    position: String(position),
  };
}

function createChoiceDraft(position: number): DraftEntry {
  return {
    id: createId(),
    label: "",
    description: "",
    priceModifier: "1",
    position: String(position),
  };
}

function createQuantityDraft(position: number): DraftEntry {
  return {
    id: createId(),
    label: "",
    quantity: "",
    priceModifier: "1",
    position: String(position),
  };
}

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

type OptionRepeaterProps = {
  title: string;
  description: string;
  items: DraftEntry[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, name: string, value: string) => void;
  addLabel: string;
  fields: FieldConfig[];
};

function OptionRepeater({ title, description, items, onAdd, onRemove, onChange, addLabel, fields }: OptionRepeaterProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          <p className="text-sm text-white/70">{description}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          {addLabel}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="flex items-center justify-between text-sm text-white/70">
              <p className="font-semibold text-white">Opción {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={items.length <= 1}
              >
                Quitar
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  {field.label}
                  <input
                    value={item[field.name] ?? ""}
                    onChange={(event) => onChange(item.id, field.name, event.target.value)}
                    type={field.type === "number" ? "number" : "text"}
                    min={field.min}
                    step={field.step}
                    placeholder={field.placeholder}
                    required={!field.optional}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function mapPayload(items: DraftEntry[], keys: string[]) {
  return items.map((item) => {
    const payload: Record<string, string> = { id: item.id };
    keys.forEach((key) => {
      payload[key] = item[key] ?? "";
    });
    return payload;
  });
}

export function ProductForm() {
  const [state, formAction] = useFormState(createProductAction, INITIAL_STATE);
  const [formKey, setFormKey] = useState(0);
  const [sizes, setSizes] = useState<DraftEntry[]>([createSizeDraft(0)]);
  const [materials, setMaterials] = useState<DraftEntry[]>([createChoiceDraft(0)]);
  const [finishes, setFinishes] = useState<DraftEntry[]>([createChoiceDraft(0)]);
  const [printSides, setPrintSides] = useState<DraftEntry[]>([createChoiceDraft(0)]);
  const [speeds, setSpeeds] = useState<DraftEntry[]>([createChoiceDraft(0)]);
  const [quantities, setQuantities] = useState<DraftEntry[]>([createQuantityDraft(0)]);

  useEffect(() => {
    if (state.success) {
      setFormKey((prev) => prev + 1);
      setSizes([createSizeDraft(0)]);
      setMaterials([createChoiceDraft(0)]);
      setFinishes([createChoiceDraft(0)]);
      setPrintSides([createChoiceDraft(0)]);
      setSpeeds([createChoiceDraft(0)]);
      setQuantities([createQuantityDraft(0)]);
    }
  }, [state.success]);

  const sizesPayload = useMemo(() => JSON.stringify(mapPayload(sizes, ["label", "width", "height", "depth", "basePrice", "position"])), [sizes]);
  const materialsPayload = useMemo(
    () => JSON.stringify(mapPayload(materials, ["label", "description", "priceModifier", "position"])),
    [materials],
  );
  const finishesPayload = useMemo(
    () => JSON.stringify(mapPayload(finishes, ["label", "description", "priceModifier", "position"])),
    [finishes],
  );
  const printSidesPayload = useMemo(
    () => JSON.stringify(mapPayload(printSides, ["label", "description", "priceModifier", "position"])),
    [printSides],
  );
  const speedsPayload = useMemo(
    () => JSON.stringify(mapPayload(speeds, ["label", "description", "priceModifier", "position"])),
    [speeds],
  );
  const quantitiesPayload = useMemo(
    () => JSON.stringify(mapPayload(quantities, ["label", "quantity", "priceModifier", "position"])),
    [quantities],
  );

  function updateItem(setter: (updater: (prev: DraftEntry[]) => DraftEntry[]) => void, id: string, key: string, value: string) {
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }

  function removeItem(setter: (updater: (prev: DraftEntry[]) => DraftEntry[]) => void, id: string) {
    setter((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  }

  function addItem(setter: (updater: (prev: DraftEntry[]) => DraftEntry[]) => void, factory: (position: number) => DraftEntry) {
    setter((prev) => [...prev, factory(prev.length)]);
  }

  return (
    <form key={formKey} action={formAction} className="space-y-6 rounded-[2.5rem] border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Nuevo producto con opciones</h3>
          <p className="text-sm text-white/70">
            Cargá todos los datos comerciales y las opciones del configurador para publicarlo en el catálogo y habilitar su diseño.
          </p>
        </div>
        <SubmitButton label="Agregar producto" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Título
          <input
            name="title"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="Mailer premium"
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Identificador (slug)
          <input
            name="slug"
            pattern="[a-z0-9-]+"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="mailer"
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
          Posición en el catálogo
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

      <OptionRepeater
        title="Medidas disponibles"
        description="Definí las medidas en milímetros y el precio base para cada variante."
        items={sizes}
        onAdd={() => addItem(setSizes, createSizeDraft)}
        onRemove={(id) => removeItem(setSizes, id)}
        onChange={(id, key, value) => updateItem(setSizes, id, key, value)}
        addLabel="Agregar medida"
        fields={[
          { name: "label", label: "Nombre comercial", placeholder: "Caja chica" },
          { name: "width", label: "Ancho (mm)", type: "number", min: 1, placeholder: "220" },
          { name: "height", label: "Alto (mm)", type: "number", min: 1, placeholder: "70" },
          { name: "depth", label: "Profundidad (mm)", type: "number", min: 1, placeholder: "160" },
          { name: "basePrice", label: "Precio base", type: "number", min: 0.01, step: 0.01, placeholder: "2.5" },
          { name: "position", label: "Posición", type: "number", min: 0, placeholder: "0" },
        ]}
      />

      <OptionRepeater
        title="Materiales"
        description="Lista los sustratos disponibles y su multiplicador de precio."
        items={materials}
        onAdd={() => addItem(setMaterials, createChoiceDraft)}
        onRemove={(id) => removeItem(setMaterials, id)}
        onChange={(id, key, value) => updateItem(setMaterials, id, key, value)}
        addLabel="Agregar material"
        fields={[
          { name: "label", label: "Material", placeholder: "Cartulina premium 16 pt" },
          { name: "description", label: "Descripción", placeholder: "Acabado mate, certificado FSC", optional: true },
          { name: "priceModifier", label: "Multiplicador", type: "number", min: 0.01, step: 0.01, placeholder: "1" },
          { name: "position", label: "Posición", type: "number", min: 0, placeholder: "0" },
        ]}
      />

      <OptionRepeater
        title="Acabados"
        description="Añadí laminados, barnices u otras terminaciones."
        items={finishes}
        onAdd={() => addItem(setFinishes, createChoiceDraft)}
        onRemove={(id) => removeItem(setFinishes, id)}
        onChange={(id, key, value) => updateItem(setFinishes, id, key, value)}
        addLabel="Agregar acabado"
        fields={[
          { name: "label", label: "Acabado", placeholder: "Barniz brillante" },
          { name: "description", label: "Descripción", placeholder: "Resalta logos y textos", optional: true },
          { name: "priceModifier", label: "Multiplicador", type: "number", min: 0.01, step: 0.01, placeholder: "1.12" },
          { name: "position", label: "Posición", type: "number", min: 0, placeholder: "0" },
        ]}
      />

      <OptionRepeater
        title="Caras impresas"
        description="Definí qué combinaciones de impresión están disponibles."
        items={printSides}
        onAdd={() => addItem(setPrintSides, createChoiceDraft)}
        onRemove={(id) => removeItem(setPrintSides, id)}
        onChange={(id, key, value) => updateItem(setPrintSides, id, key, value)}
        addLabel="Agregar opción"
        fields={[
          { name: "label", label: "Opción", placeholder: "Exterior e interior" },
          { name: "description", label: "Descripción", placeholder: "Incluye tinta blanca interior", optional: true },
          { name: "priceModifier", label: "Multiplicador", type: "number", min: 0.01, step: 0.01, placeholder: "1.25" },
          { name: "position", label: "Posición", type: "number", min: 0, placeholder: "0" },
        ]}
      />

      <OptionRepeater
        title="Velocidades de producción"
        description="Controlá los plazos estándar y express con su impacto en el precio."
        items={speeds}
        onAdd={() => addItem(setSpeeds, createChoiceDraft)}
        onRemove={(id) => removeItem(setSpeeds, id)}
        onChange={(id, key, value) => updateItem(setSpeeds, id, key, value)}
        addLabel="Agregar velocidad"
        fields={[
          { name: "label", label: "Velocidad", placeholder: "Express 7 días" },
          { name: "description", label: "Descripción", placeholder: "Producción prioritaria", optional: true },
          { name: "priceModifier", label: "Multiplicador", type: "number", min: 0.01, step: 0.01, placeholder: "1.4" },
          { name: "position", label: "Posición", type: "number", min: 0, placeholder: "0" },
        ]}
      />

      <OptionRepeater
        title="Cantidades disponibles"
        description="Ingresá los lotes mínimos y máximos para cotizar."
        items={quantities}
        onAdd={() => addItem(setQuantities, createQuantityDraft)}
        onRemove={(id) => removeItem(setQuantities, id)}
        onChange={(id, key, value) => updateItem(setQuantities, id, key, value)}
        addLabel="Agregar cantidad"
        fields={[
          { name: "label", label: "Etiqueta", placeholder: "Caja x 250" },
          { name: "quantity", label: "Unidades", type: "number", min: 1, placeholder: "250" },
          { name: "priceModifier", label: "Multiplicador", type: "number", min: 0.01, step: 0.01, placeholder: "1" },
          { name: "position", label: "Posición", type: "number", min: 0, placeholder: "0" },
        ]}
      />

      <input type="hidden" name="sizes" value={sizesPayload} />
      <input type="hidden" name="materials" value={materialsPayload} />
      <input type="hidden" name="finishes" value={finishesPayload} />
      <input type="hidden" name="printSides" value={printSidesPayload} />
      <input type="hidden" name="productionSpeeds" value={speedsPayload} />
      <input type="hidden" name="quantities" value={quantitiesPayload} />

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
          placeholder="marcas lanzaron sus cajas con Eccomfy"
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
          Nombre
          <input
            name="name"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="Tienda Verde"
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
