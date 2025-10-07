import Link from "next/link";

import { requireStaff } from "@/lib/auth";
import { getProductStyles } from "@/lib/content";
import {
  getDesignSizes,
  getDesignMaterials,
  getDesignFinishes,
  getDesignPrintSides,
  getDesignProductionSpeeds,
  getDesignQuantities,
} from "@/lib/designOptions";
import { deleteProductStyleAction } from "../content/actions";
import { ProductStyleForm } from "./ProductStyleForm";
import { SizeForm, MaterialForm, FinishForm, PrintSideForm, SpeedForm, QuantityForm } from "./OptionForms";

export default async function ProductsAdminPage() {
  const user = await requireStaff();
  const [productStyles, sizes, materials, finishes, printSides, speeds, quantities] = await Promise.all([
    getProductStyles(),
    getDesignSizes(),
    getDesignMaterials(),
    getDesignFinishes(),
    getDesignPrintSides(),
    getDesignProductionSpeeds(),
    getDesignQuantities(),
  ]);

  return (
    <div className="container-xl py-16 space-y-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Administrar productos</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Hola, {user.name.split(" ")[0] || user.name}</h1>
          <p className="mt-2 max-w-3xl text-white/70">
            Creá nuevos estilos para el catálogo e integrá todas las opciones disponibles del editor 3D desde un único lugar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/content"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Contenidos
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Usuarios
          </Link>
          <Link
            href="/design"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ver editor
          </Link>
        </div>
      </div>

      <div className="grid gap-10 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-10">
          <ProductStyleForm />

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Opciones del editor</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/60">
                Gestioná tamaños, materiales, acabados y parámetros globales que estarán disponibles para todos los productos del catálogo.
              </p>
            </div>

            <SizeForm sizes={sizes} />

            <MaterialForm
              title="Materiales"
              subtitle="Define cartulinas, corrugados y sus multiplicadores de precio."
              items={materials}
            />

            <FinishForm
              title="Acabados"
              subtitle="Agrega laminados, barnices y terminaciones especiales."
              items={finishes}
            />

            <PrintSideForm
              title="Caras impresas"
              subtitle="Controla si ofrecemos impresión exterior, interior o ambas."
              items={printSides}
            />

            <SpeedForm
              title="Velocidades de producción"
              subtitle="Define plazos estándar y express con su impacto en precio."
              items={speeds}
            />

            <QuantityForm quantities={quantities} />
          </div>
        </div>

        <ProductList
          items={productStyles.map((item) => ({
            id: item.id,
            primary: item.title,
            secondary: `${item.description} · slug: ${item.slug} · ${item.configuration.sizes.length} medidas · ${item.configuration.materials.length} materiales`,
            href: item.href,
          }))}
        />
      </div>
    </div>
  );
}

type ProductListProps = {
  items: Array<{
    id: number;
    primary: string;
    secondary: string;
    href: string;
  }>;
};

function ProductList({ items }: ProductListProps) {
  return (
    <div className="space-y-6 rounded-[2.5rem] border border-white/15 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Productos en catálogo</h2>
          <p className="mt-1 text-xs text-white/60">Gestioná las variantes destacadas y eliminá las que ya no estén activas.</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/60">
          Todavía no hay productos cargados. Cuando crees uno aparecerá aquí.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80"
            >
              <div>
                <p className="font-semibold text-white">{item.primary}</p>
                <p className="text-xs text-white/60">{item.secondary}</p>
                <Link
                  href={item.href}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-yellow transition hover:text-brand-yellow/80"
                >
                  Ver en catálogo
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden className="fill-current">
                    <path d="M13.172 12l-4.95 4.95 1.414 1.414L16 12 9.636 5.636 8.222 7.05z" />
                  </svg>
                </Link>
              </div>
              <form action={deleteProductStyleAction}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  Eliminar
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
