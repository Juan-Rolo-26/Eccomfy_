import StyleCard from "../../components/StyleCard";
import { getProductStyles } from "@/lib/content";

export default async function Products() {
  const productStyles = await getProductStyles();

  return (
    <div className="container-xl space-y-16 py-12">
      <section>
        <h1 className="mb-8 text-3xl font-bold">Productos</h1>
        {productStyles.length === 0 ? (
          <p className="text-white/70">Todavía no hay productos cargados.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productStyles.map((style) => (
              <StyleCard
                key={style.id}
                title={style.title}
                desc={style.description}
                href={style.href}
                img={style.image}
              />
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-card backdrop-blur sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Aprendé con nosotros</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">¿Cómo funciona la serigrafía?</h2>
            <p className="text-sm text-white/70 sm:text-base">
              Mirá el paso a paso del proceso de serigrafía para entender cómo logramos impresiones nítidas sobre cada pieza. Compartimos consejos sobre tintas, tiempos de secado y controles de calidad.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-inner">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/0iX1xZ9K0wU"
                title="Proceso de serigrafía"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
