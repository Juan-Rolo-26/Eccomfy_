import StyleCard from "../../components/StyleCard";
import { getProducts } from "@/lib/content";

export default async function Products() {
  const products = await getProducts();

  return (
    <div className="container-xl space-y-16 py-12">
      <section>
        <h1 className="mb-8 text-3xl font-bold">Productos</h1>
        {products.length === 0 ? (
          <p className="text-white/70">Todavía no hay productos cargados.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <StyleCard
                key={product.id}
                title={product.title}
                desc={product.description}
                href={product.href}
                img={product.image}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
