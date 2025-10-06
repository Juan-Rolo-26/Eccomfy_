import Link from "next/link";
import Image from "next/image";

import type { SafeUser } from "@/lib/auth";
import type { Product } from "@/lib/content";

type Props = {
  product: Product;
  user: SafeUser;
};

export default function DesignStaffBlock({ product, user }: Props) {
  const optionSummary = [
    { label: "Medidas", count: product.options.sizes.length },
    { label: "Materiales", count: product.options.materials.length },
    { label: "Acabados", count: product.options.finishes.length },
    { label: "Caras impresas", count: product.options.printSides.length },
    { label: "Velocidades", count: product.options.productionSpeeds.length },
    { label: "Cantidades", count: product.options.quantities.length },
  ];
  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <div className="container-xl py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-[3rem] border border-white/15 bg-white/5 p-10 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Acceso restringido</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Hola, {firstName}</h1>
          <p className="mt-4 text-white/70">
            El editor interactivo está pensado para clientes finales. Como integrante del equipo Eccomfy, completá o actualizá
            la información de {product.title} desde el panel de contenidos para habilitarlo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/content"
              className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-5 py-3 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-navy/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Administrar productos
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
            <Image src={product.image} alt={product.title} width={640} height={480} className="h-auto w-full" />
          </div>
          <p className="mt-6 text-sm text-white/60">Resumen actual de opciones cargadas:</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {optionSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-semibold text-white/70"
              >
                <p className="text-white text-base">{item.count}</p>
                <p className="text-white/60">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/60">
            Recordá que todas las secciones deben tener al menos una opción cargada para habilitar el configurador.
          </p>
        </div>
      </div>
    </div>
  );
}
