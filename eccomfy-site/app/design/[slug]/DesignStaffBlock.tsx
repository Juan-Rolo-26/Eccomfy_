import Link from "next/link";
import Image from "next/image";

import type { SafeUser } from "@/lib/auth";
import type { ProductStyle } from "@/lib/content";

import { ProductStaffEditor } from "./ProductStaffEditor";

type Props = {
  product: ProductStyle;
  user: SafeUser;
};

export default function DesignStaffBlock({ product, user }: Props) {
  const prettyLabel = product.title;

  return (
    <div className="container-xl space-y-12 py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-[3rem] border border-white/15 bg-white/5 p-10 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Acceso restringido</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Hola, {user.name.split(" ")[0] || user.name}</h1>
          <p className="mt-4 text-white/70">
            Esta vista está pensada para clientes finales. Como integrante del equipo Eccomfy, gestioná las fichas técnicas y comerciales de {prettyLabel} directamente desde acá.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/content"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Volver al panel
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver catálogo
            </Link>
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-6">
            <Image src={product.image} alt={prettyLabel} width={640} height={480} className="h-auto w-full object-contain" />
          </div>
          <p className="mt-6 text-sm text-white/60">
            Desde la sección inferior podés actualizar medidas, variantes, precios y materiales en tiempo real para este modelo.
          </p>
        </div>
      </div>

      <ProductStaffEditor product={product} />
    </div>
  );
}
