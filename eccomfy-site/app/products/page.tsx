import StyleCard from "../../components/StyleCard";
import { getProductStyles } from "@/lib/content";

export default function Products() {
  const styles = getProductStyles();

  return (
    <div className="container-xl py-12">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>
      {styles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {styles.map((style) => (
            <StyleCard
              key={style.id}
              title={style.title}
              desc={style.description}
              href={style.href}
              img={style.image}
            />
          ))}
        </div>
      ) : (
        <p className="text-brand-navy/70">Aún no hay productos en el catálogo.</p>
      )}
    </div>
  );
}
