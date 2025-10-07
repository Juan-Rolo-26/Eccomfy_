import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import StyleCard from "@/components/StyleCard";
import { getCurrentUser } from "@/lib/auth";
import { getProductStyles, summarizeProductStyle } from "@/lib/content";

export const metadata: Metadata = {
  title: "Diseñá packaging personalizado | Eccomfy",
  description:
    "Explorá el catálogo de packaging Eccomfy y elegí un modelo para personalizarlo en nuestro editor 3D con cotización instantánea.",
};

export default async function DesignCatalogPage() {
  const user = await getCurrentUser();
  if (user?.is_staff) {
    redirect("/admin/content");
  }

  const productStyles = getProductStyles();

  return (
    <div className="container-xl space-y-12 py-12 md:space-y-16 md:py-16">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
          Catálogo interactivo
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Elegí un packaging para empezar a diseñar
        </h1>
        <p className="text-base text-white/70 sm:text-lg">
          Configurá medidas, materiales, acabados y cantidades desde el editor 3D. Cada modelo incluye precios sugeridos y
          opciones listas para producir.
        </p>
      </header>

      {productStyles.length === 0 ? (
        <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-10 text-sm text-white/70 backdrop-blur">
          <p className="text-base font-semibold text-white">
            Todavía no hay productos disponibles en el catálogo.
          </p>
          <p className="mt-3 max-w-2xl">
            Estamos preparando nuevos modelos para que puedas diseñar packaging en minutos. Dejanos tus datos y te avisamos
            cuando estén online.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contactanos
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {productStyles.map((style) => {
            const summary = summarizeProductStyle(style);
            return (
              <StyleCard
                key={style.id}
                title={style.title}
                desc={style.description}
                href={style.href}
                img={style.image}
                badges={summary.badges}
                highlights={summary.highlights}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
