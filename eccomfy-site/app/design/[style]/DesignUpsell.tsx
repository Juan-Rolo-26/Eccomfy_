import Image from "next/image";
import Link from "next/link";

import type { SafeUser } from "@/lib/auth";
import type { Product } from "@/lib/content";

type Props = {
  product: Product;
  user: SafeUser | null;
};

export default function DesignUpsell({ product, user }: Props) {
  const firstSize = product.options.sizes[0] ?? null;
  const firstMaterial = product.options.materials[0] ?? null;
  const firstFinish = product.options.finishes[0] ?? null;
  const firstPrint = product.options.printSides[0] ?? null;
  const firstSpeed = product.options.productionSpeeds[0] ?? null;
  const firstQuantity = product.options.quantities[0] ?? null;

  const previewOptions = [
    {
      label: "Tamaño",
      value: firstSize
        ? `${firstSize.width_mm} × ${firstSize.height_mm} × ${firstSize.depth_mm} mm`
        : "Definilo desde el panel",
    },
    { label: "Material", value: firstMaterial?.label ?? "Completar" },
    { label: "Terminación", value: firstFinish?.label ?? "Completar" },
    { label: "Caras impresas", value: firstPrint?.label ?? "Completar" },
    { label: "Cantidad", value: firstQuantity ? `${firstQuantity.quantity} unidades` : "Configurable" },
  ];

  const basePrice = firstSize?.base_price ?? 0;
  const modifier =
    (firstMaterial?.price_modifier ?? 1) *
    (firstFinish?.price_modifier ?? 1) *
    (firstPrint?.price_modifier ?? 1) *
    (firstSpeed?.price_modifier ?? 1) *
    (firstQuantity?.price_modifier ?? 1);
  const previewPrice = basePrice > 0 ? Number((basePrice * modifier).toFixed(2)) : null;

  const userName = user?.name.split(" ")[0] || user?.name;
  const headline = user
    ? `Hola ${userName}, por favor iniciá sesión con una cuenta válida para continuar.`
    : "Necesitás iniciar sesión para diseñar tu caja.";

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
              <h1 className="text-4xl font-semibold">Previsualización {product.title}</h1>
              <p className="text-brand-navy/70">
                Ingresá con tu cuenta para desbloquear el editor interactivo. Ahí vas a poder elegir las medidas, materiales y
                tiradas configuradas por el equipo de Eccomfy.
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
                <Image src={product.image} alt={product.title} width={640} height={480} className="h-auto w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Próximamente disponible</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Ingresá para activar el editor</h2>
          <p className="mt-3 text-white/70">
            Las medidas, materiales y acabados disponibles se cargan desde tu panel de administración. Iniciá sesión para usarlos y obtener precios en tiempo real.
          </p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-yellow">Configuración base</span>
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60">Editable</span>
            </div>
            <ul className="mt-4 space-y-3">
              {previewOptions.map((option) => (
                <li key={option.label} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-white/60">{option.label}</span>
                  <span className="font-medium text-white">{option.value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-baseline gap-2 text-white">
              <span className="text-sm text-white/60">Precio unitario desde</span>
              <span className="text-3xl font-semibold text-brand-yellow">
                {previewPrice ? `$${previewPrice.toFixed(2)}` : "—"}
              </span>
              {firstQuantity ? (
                <span className="text-xs text-emerald-300">Lote inicial de {firstQuantity.quantity}</span>
              ) : null}
            </div>
            <div className="mt-4 space-y-2 text-xs text-white/60">
              {firstSpeed ? <p>{firstSpeed.label}</p> : <p>Definí velocidades de producción en el panel.</p>}
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
                Explorar catálogo
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">{headline}</div>
        </div>
      </div>
    </div>
  );
}
