import Link from "next/link";

import { requireStaff } from "@/lib/auth";
import { getProductStyles, getMetrics, getTestimonials, getBrands } from "@/lib/content";
import {
  ProductStyleForm,
  MetricForm,
  TestimonialForm,
  BrandForm,
} from "./ContentForms";
import {
  deleteProductStyleAction,
  deleteMetricAction,
  deleteTestimonialAction,
  deleteBrandAction,
} from "./actions";

export default async function ContentAdminPage() {
  const user = await requireStaff();
  const [productStyles, metrics, testimonials, brands] = await Promise.all([
    getProductStyles(),
    getMetrics(),
    getTestimonials(),
    getBrands(),
  ]);

  return (
    <div className="container-xl py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Panel de contenidos</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Hola, {user.name.split(" ")[0] || user.name}</h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Cargá productos, métricas, testimonios y marcas para que aparezcan automáticamente en la landing. Si una sección no tiene registros, no se mostrará.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/users"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Gestionar usuarios
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ver sitio
          </Link>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-10">
          <ProductStyleForm />
          <MetricForm />
          <TestimonialForm />
          <BrandForm />
        </div>

        <div className="space-y-6">
          <ContentList
            title="Productos cargados"
            items={productStyles.map((item) => ({
              id: item.id,
              primary: item.title,
              secondary: `${item.description} · slug: ${item.slug} · ${item.configuration.sizes.length} medidas · ${item.configuration.materials.length} materiales`,
              href: item.href,
            }))}
            emptyLabel="Todavía no hay productos."
            deleteAction={deleteProductStyleAction}
          />
          <ContentList
            title="Métricas cargadas"
            items={metrics.map((item) => ({
              id: item.id,
              primary: item.value,
              secondary: item.label,
            }))}
            emptyLabel="Todavía no hay métricas."
            deleteAction={deleteMetricAction}
          />
          <ContentList
            title="Testimonios cargados"
            items={testimonials.map((item) => ({
              id: item.id,
              primary: item.name,
              secondary: `${item.quote.slice(0, 80)}${item.quote.length > 80 ? "…" : ""}`,
            }))}
            emptyLabel="Todavía no hay testimonios."
            deleteAction={deleteTestimonialAction}
          />
          <ContentList
            title="Marcas cargadas"
            items={brands.map((item) => ({
              id: item.id,
              primary: item.name,
            }))}
            emptyLabel="Todavía no hay marcas."
            deleteAction={deleteBrandAction}
          />
        </div>
      </div>
    </div>
  );
}

type ContentListProps = {
  title: string;
  emptyLabel: string;
  items: Array<{
    id: number;
    primary: string;
    secondary?: string;
    href?: string;
  }>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

function ContentList({ title, emptyLabel, items, deleteAction }: ContentListProps) {
  return (
    <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-6 backdrop-blur">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-white/60">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80"
            >
              <div>
                <p className="font-semibold text-white">{item.primary}</p>
                {item.secondary ? <p className="text-xs text-white/70">{item.secondary}</p> : null}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-yellow transition hover:text-brand-yellow/80"
                  >
                    Ver en catálogo
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden className="fill-current">
                      <path d="M13.172 12l-4.95 4.95 1.414 1.414L16 12 9.636 5.636 8.222 7.05z" />
                    </svg>
                  </Link>
                ) : null}
              </div>
              {deleteAction ? (
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    Eliminar
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
