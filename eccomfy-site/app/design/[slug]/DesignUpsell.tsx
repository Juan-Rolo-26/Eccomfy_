import Image from "next/image";
import Link from "next/link";

import type { SafeUser } from "@/lib/auth";
import type { ProductStyle } from "@/lib/content";

type Props = {
  product: ProductStyle;
  user: SafeUser | null;
};

function formatOptionList(values: string[]): string {
  return values.filter(Boolean).join(" · ") || "Consultá con tu ejecutivo";
}

export default function DesignUpsell({ product, user }: Props) {
  const { configuration } = product;
  const heroImage = product.image || "/box-mailer.svg";
  const prettyLabel = product.title;

  const sizeSummary = formatOptionList(
    configuration.sizes.slice(0, 3).map((size) => `${size.label} (${size.width_mm}×${size.height_mm}×${size.depth_mm} mm)`),
  );
  const materialSummary = formatOptionList(configuration.materials.slice(0, 3).map((material) => material.label));
  const finishSummary = formatOptionList(configuration.finishes.slice(0, 3).map((finish) => finish.label));
  const quantitySummary = formatOptionList(configuration.quantities.slice(0, 4).map((quantity) => `${quantity.quantity} u.`));
  const speedSummary = configuration.productionSpeeds
    .map((speed) => (speed.description ? `${speed.label}: ${speed.description}` : speed.label))
    .join(" · ");

  const optionSets = [
    { label: "Medidas", value: sizeSummary },
    { label: "Materiales", value: materialSummary },
    { label: "Acabados", value: finishSummary },
    { label: "Tiradas", value: quantitySummary },
  ];

  const userName = user?.name.split(" ")[0] || user?.name;
  const headline = user
    ? `Hola ${userName}, por favor iniciá sesión con una cuenta válida para continuar.`
    : "Necesitás iniciar sesión para diseñar tu caja.";

  const basePrice = configuration.sizes[0]?.base_price ?? null;

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
                Ingresá con tu cuenta para desbloquear el editor interactivo. Ahí vas a poder elegir medidas, materiales, colores y tiradas cargadas por el equipo de Eccomfy.
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Próximamente disponible</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Ingresá para activar el editor</h2>
          <p className="mt-3 text-white/70">
            Las medidas, materiales y acabados disponibles se cargan desde tu panel de administración. Iniciá sesión para usarlos y obtener precios en tiempo real.
          </p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-yellow">Configuración Eccomfy</span>
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60">Actualizable</span>
            </div>
            <ul className="mt-4 space-y-3">
              {optionSets.map((option) => (
                <li key={option.label} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-white/60">{option.label}</span>
                  <span className="font-medium text-white text-right">{option.value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-baseline gap-2 text-white">
              <span className="text-sm text-white/60">Precio unitario estimado desde</span>
              <span className="text-3xl font-semibold text-brand-yellow">
                {basePrice ? `$${basePrice.toFixed(2)}` : "—"}
              </span>
              <span className="text-xs text-emerald-300">Sujeto a validación</span>
            </div>
            <div className="mt-4 space-y-2 text-xs text-white/60">
              {speedSummary ? (
                speedSummary.split(" · ").map((item) => <p key={item}>{item}</p>)
              ) : (
                <p>Definí la velocidad junto a tu ejecutivo.</p>
              )}
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
