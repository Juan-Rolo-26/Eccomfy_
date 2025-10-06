import StyleCard from "../../components/StyleCard";
import { getProductStyles, summarizeProductStyle } from "@/lib/content";

export default function Products() {
  const styles = getProductStyles();

  return (
    <div className="container-xl py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Catálogo de productos Eccomfy</h1>
        <p className="text-brand-navy/70">
          Elegí un formato para ver medidas, materiales, colores disponibles y configurar tu caja en el editor 3D.
        </p>
      </div>
      {styles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {styles.map((style) => {
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
      ) : (
        <p className="text-brand-navy/70">Aún no hay productos en el catálogo.</p>
      )}
    </div>
  );
}
