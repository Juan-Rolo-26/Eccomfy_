import Image from "next/image";
import Link from "next/link";

import type { SafeUser } from "@/lib/auth";
import type { ProductStyle } from "@/lib/content";

type Props = {
  product: ProductStyle;
  user: SafeUser | null;
};

export default function DesignUpsell({ product, user }: Props) {
  const { configuration } = product;
  const heroImage = product.image || "/box-mailer.svg";
  const prettyLabel = product.title;

  const sizeSummary = configuration.sizes.map(
    (size) => `${size.label} (${size.width_mm}×${size.height_mm}×${size.depth_mm} mm)`,
  );
  const materialSummary = configuration.materials.map((material) => material.label);
  const baseColors = configuration.base_colors;
  const serigraphyColors = configuration.serigraphy_colors;
  const possibilities = configuration.possibilities;

  const userName = user?.name.split(" ")[0] || user?.name;
  const headline = user
    ? `Hola ${userName}, recordá que la producción se coordina con el equipo comercial.`
    : "Necesitás iniciar sesión para solicitar un pedido personalizado.";

  const basePrice = configuration.unit_price ?? configuration.sizes[0]?.base_price ?? null;
  const stockLabel =
    typeof configuration.stock === "number" ? `${configuration.stock.toLocaleString("es-AR")} unidades disponibles` : "—";
  const minPurchase =
    typeof configuration.min_quantity === "number" ? `${configuration.min_quantity.toLocaleString("es-AR")} u.` : "No especificado";
  const maxPurchase =
    typeof configuration.max_quantity === "number" ? `${configuration.max_quantity.toLocaleString("es-AR")} u.` : "Consultar";

  const detailItems = [
    { label: "Tipo de producto", value: configuration.product_type ?? "—" },
    { label: "Medidas", value: sizeSummary.length ? sizeSummary.join(" · ") : "Definí dimensiones en tu pedido" },
    { label: "Posibilidades", value: possibilities.length ? possibilities.join(" · ") : "Agregalas desde el panel" },
    { label: "Materiales", value: materialSummary.length ? materialSummary.join(" · ") : "Pendiente" },
    { label: "Colores base", value: baseColors.length ? baseColors.join(", ") : "Consultar" },
    {
      label: "Serigrafía",
      value: serigraphyColors.length ? serigraphyColors.join(", ") : "Disponible a medida",
    },
    { label: "Stock", value: stockLabel },
    { label: "Compra mínima", value: minPurchase },
    { label: "Compra máxima", value: maxPurchase },
  ];

  return (
    <div className="container-xl py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="relative overflow-hidden rounded-[3rem] bg-[#E6D8FF] p-10 text-brand-navy">
          <div className="absolute inset-x-10 bottom-10 h-40 rounded-full bg-white/40 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-navy/80">
                Preview exclusivo
              </p>
              <h1 className="text-4xl font-semibold">Previsualización {prettyLabel}</h1>
              <p className="text-brand-navy/70">
                Ingresá con tu cuenta para coordinar precios finales, tiempos de producción y confirmar la disponibilidad junto al equipo de Eccomfy.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {user ? (
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full border border-brand-navy px-5 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/10"
                  >
                    Volver a productos
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A1E3D]"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center rounded-full border border-brand-navy px-5 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/10"
                    >
                      Crear cuenta
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative flex-1">
              <div className="overflow-hidden rounded-3xl border border-white/60 bg-white p-6 shadow-xl">
                <Image src={heroImage} alt={prettyLabel} width={640} height={480} className="h-auto w-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Gestión comercial</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Ingresá para solicitar una cotización</h2>
          <p className="mt-3 text-white/70">
            Toda la información comercial y técnica se actualiza desde tu panel de administración. Revisá los detalles antes de enviar una cotización.
          </p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-yellow">Ficha del producto</span>
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60">Actualizable</span>
            </div>
            <ul className="mt-4 space-y-3">
              {detailItems.map((detail) => (
                <li key={detail.label} className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                  <span className="text-xs uppercase tracking-[0.25em] text-white/50">{detail.label}</span>
                  <span className="font-medium text-white">{detail.value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-baseline gap-2 text-white">
              <span className="text-sm text-white/60">Precio unitario de referencia</span>
              <span className="text-3xl font-semibold text-brand-yellow">
                {basePrice ? `$${basePrice.toFixed(2)}` : "—"}
              </span>
              <span className="text-xs text-emerald-300">Confirmar con comercial</span>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-5 py-2 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-navy/20"
              >
                Charlar con un especialista
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explorar más estilos
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">{headline}</div>
        </div>
      </div>
    </div>
  );
}
