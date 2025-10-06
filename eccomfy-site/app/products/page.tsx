import StyleCard from "../../components/StyleCard";
import { getProductStyles } from "@/lib/content";

export default async function Products() {
  const productStyles = await getProductStyles();

  return (
    <div className="container-xl py-12">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>
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
    </div>
  );
}
