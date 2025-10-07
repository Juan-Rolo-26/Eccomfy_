import StyleCard from "../../components/StyleCard";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getProductStyles } from "@/lib/content";

export default async function Products() {
  const user = await getCurrentUser();
  if (user?.is_staff) {
    redirect("/admin/content");
  }

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
    </div>
  );
}
