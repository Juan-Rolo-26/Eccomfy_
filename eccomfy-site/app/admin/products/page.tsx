import Link from "next/link";

import { requireStaff } from "@/lib/auth";
import { getProductStyles } from "@/lib/content";
import { ProductStyleForm } from "./ProductStyleForm";
import { ProductLibrary } from "./ProductLibrary";

export default async function ProductsAdminPage() {
  const user = await requireStaff();
  const productStyles = await getProductStyles();

  return (
    <div className="container-xl py-16 space-y-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Administrar productos</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Hola, {user.name.split(" ")[0] || user.name}</h1>
          <p className="mt-2 max-w-3xl text-white/70">
            Creá nuevas fichas de producto con medidas, tipos, colores, precios y stock para mantener el catálogo siempre actualizado.
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
          <ProductStyleForm defaultPosition={productStyles.length} />
        </div>

        <ProductLibrary products={productStyles} />
      </div>
    </div>
  );
}
