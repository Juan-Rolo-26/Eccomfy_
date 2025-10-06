import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import StyleCard from "@/components/StyleCard";
import ContactForm from "@/components/ContactForm";
import { getProducts, getMetrics, getTestimonials, getBrands } from "@/lib/content";

type IconName = "sparkles" | "layers" | "support" | "leaf" | "grid" | "puzzle" | "check";

const ICONS: Record<IconName, ReactElement> = {
  sparkles: (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M6.322 2.281a.75.75 0 011.356 0l.877 2.528a.75.75 0 00.474.474l2.528.877a.75.75 0 010 1.356l-2.528.877a.75.75 0 00-.474.474l-.877 2.528a.75.75 0 01-1.356 0l-.877-2.528a.75.75 0 00-.474-.474l-2.528-.877a.75.75 0 010-1.356l2.528-.877a.75.75 0 00.474-.474l.877-2.528z"
        clipRule="evenodd"
      />
      <path d="M14.25 2.75a.75.75 0 011.447-.281l.303.909a.75.75 0 00.45.45l.909.303a.75.75 0 010 1.447l-.909.303a.75.75 0 00-.45.45l-.303.909a.75.75 0 01-1.447 0l-.303-.909a.75.75 0 00-.45-.45l-.909-.303a.75.75 0 010-1.447l.909-.303a.75.75 0 00.45-.45l.303-.909z" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 7v2l10 5 10-5V7l-10 4zm0 4L2 12v2l10 5 10-5v-2l-10 3z" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 3a9 9 0 00-9 9v2a3 3 0 003 3h1v-6H6a6 6 0 0112 0h-1a1 1 0 00-1 1v5a3 3 0 003 3h1a1 1 0 001-1v-6a9 9 0 00-9-9z" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M20.742 3.337A1 1 0 0019.7 3.3C9.12 4.621 3.21 12.364 2.328 20.544a1 1 0 001.149 1.096c4.48-.627 8.145-2.413 10.999-5.455a8.3 8.3 0 002.112-6.86 1 1 0 011.095-1.149 8.3 8.3 0 006.86-2.112 1 1 0 00-.801-1.727z" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-10h6v6h-6V4zm0 10h6v6h-6v-6z" />
    </svg>
  ),
  puzzle: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M20 11h-2V9a1 1 0 00-1-1h-2V6a1 1 0 00-1-1h-1.17a2.83 2.83 0 00-5.66 0H6a1 1 0 00-1 1v2H3a1 1 0 00-1 1v2h2v1.17a2.83 2.83 0 000 5.66V20a1 1 0 001 1h2v-2h1.17a2.83 2.83 0 005.66 0H15a1 1 0 001-1v-2h2a1 1 0 001-1v-2h2v-2z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M9.707 17.293a1 1 0 01-1.414 0l-3.586-3.586 1.414-1.414L9 14.586l8.879-8.88 1.414 1.415-9.586 9.586z" />
    </svg>
  ),
};

const HERO_HIGHLIGHTS = [
  {
    title: "Configurador 3D",
    description: "Visualizá cada cara de tus cajas en tiempo real y guardá versiones ilimitadas.",
    icon: "sparkles" as const,
  },
  {
    title: "Producción flexible",
    description: "Pedí tiradas cortas o escalá sin mínimos ocultos ni costos sorpresa.",
    icon: "layers" as const,
  },
  {
    title: "Equipo que acompaña",
    description: "Especialistas en packaging te ayudan a validar materiales y preprensa.",
    icon: "support" as const,
  },
];

const FEATURE_TILES = [
  {
    title: "Materiales premium responsables",
    description: "Cartulinas recicladas, corrugados micro y acabados especiales que elevan tu marca.",
    icon: "leaf" as const,
  },
  {
    title: "Dielines validados en segundos",
    description: "Consulta con nuestros especialistas y recibe feedback en tiempo real.",
    icon: "grid" as const,
  },
  {
    title: "Colaboración sin fricción",
    description: "Compartí diseños, comentarios y aprobaciones en un panel centralizado.",
    icon: "puzzle" as const,
  },
];

const PROCESS_STEPS = [
  {
    title: "Elegí un estilo base",
    description: "Partí de un mailer, shipping o product box y definí medidas exactas en segundos.",
  },
  {
    title: "Diseñá con vista 3D",
    description: "Subí tu branding, ajustá colores, agregá acabados y guardá versiones ilimitadas.",
  },
  {
    title: "Producción sin sorpresas",
    description: "Cotizá online, validá preprensa con nuestro equipo y recibí tus cajas cuando las necesitás.",
  },
];

const BENEFITS = [
  "Cotización instantánea y transparente.",
  "Tiradas flexibles con lead time corto.",
  "Mockups y archivos listos para imprenta.",
  "Acompañamiento de especialistas en packaging.",
];

function Icon({ name }: { name: IconName }) {
  return ICONS[name];
}

export default async function Home() {
  const [products, metrics, testimonials, brands] = await Promise.all([
    getProducts(),
    getMetrics(),
    getTestimonials(),
    getBrands(),
  ]);

  return (
    <div className="pb-24">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-brand-navy via-brand-blue to-[#0E2040]" />
        <div className="absolute -top-24 right-8 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-yellow/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-yellow/20 blur-3xl" />

        <div className="container-xl relative py-20 lg:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold text-white/80">
                <span className="flex h-2 w-2 rounded-full bg-brand-yellow" />
                Editor 3D renovado
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  Packaging pro diseñado, cotizado y listo para producir en minutos.
                </h1>
                <p className="text-lg text-white/80 max-w-xl">
                  Configurá medidas, materiales y acabados en un entorno 3D inmersivo. Guardá variantes, colaborá con tu equipo y pedí producción sin fricción.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/design/mailer"
                  className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-base font-semibold text-brand-navy shadow-lg shadow-brand-navy/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Empezar ahora
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Ver catálogo
                </Link>
              </div>
              <div className="grid gap-6 pt-6 sm:grid-cols-3">
                {HERO_HIGHLIGHTS.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-brand-yellow">
                      <Icon name={item.icon} />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-white/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-white/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 backdrop-blur-2xl shadow-card">
                <div className="flex flex-col gap-6 p-6 sm:p-8">
                  <div className="grid grid-cols-2 gap-4 text-brand-navy">
                    <div className="relative col-span-2 aspect-[5/3] overflow-hidden rounded-2xl bg-white">
                      <Image src="/a.png" alt="Mailer" fill className="object-contain p-6" />
                      <div className="absolute left-4 top-4 rounded-full bg-brand-yellow/20 px-3 py-1 text-xs font-semibold text-brand-navy">
                        Mailer premium
                      </div>
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
                      <Image src="/c.png" alt="Shipper" fill className="object-contain p-4" />
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
                      <Image src="/b.png" alt="Product" fill className="object-contain p-4" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/70 px-5 py-4 text-sm font-semibold text-brand-navy shadow-inner">
                    Compartí vistas 3D con tu equipo o clientes con un sólo enlace.
                  </div>
                </div>
                <div className="absolute -right-10 bottom-10 hidden h-28 w-28 rotate-12 rounded-3xl bg-brand-yellow/30 blur-2xl sm:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-xl mt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Aprendé con nosotros</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">¿Cómo funciona la serigrafía?</h2>
            <p className="text-sm text-white/70 sm:text-base">
              Mirá el paso a paso del proceso de serigrafía para entender cómo logramos impresiones nítidas sobre cada pieza.
              Compartimos consejos sobre tintas, tiempos de secado y controles de calidad para que puedas planificar mejor tus
              proyectos.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/60 shadow-card">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/0iX1xZ9K0wU"
                title="Proceso de serigrafía"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="pointer-events-none absolute inset-0 border border-white/10" aria-hidden />
          </div>
        </div>
      </section>

      {metrics.length > 0 && (
        <section className="container-xl mt-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-3xl font-semibold text-brand-yellow">{metric.value}</p>
                <p className="mt-2 text-sm text-white/70">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="container-xl mt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="text-3xl font-semibold text-white">Elegí un estilo y dale tu impronta</h2>
              <p className="text-white/75">
                Partí de las bases más usadas en e-commerce y retail, personalizá medidas, materiales y acabados en segundos.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver todos los productos
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        </section>
      )}

      <section className="container-xl mt-24">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 sm:p-10">
          <div className="grid gap-8 md:grid-cols-3">
            {FEATURE_TILES.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-yellow">
                  <Icon name={feature.icon} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{feature.title}</p>
                  <p className="mt-2 text-sm text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="container-xl mt-24">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Marcas que confían</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white/70"
                >
                  {brand.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="container-xl mt-24">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold text-white">Lo que dicen las marcas que confían en nosotros</h2>
              <p className="text-white/75">Servicio, calidad y tiempos de producción pensados para equipos modernos.</p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,1fr,1fr]">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`relative overflow-hidden rounded-[2rem] border border-white/10 p-8 shadow-card ${
                  testimonial.highlight
                    ? "bg-gradient-to-br from-white/25 via-white/10 to-brand-blue/20"
                    : "bg-white/5"
                }`}
              >
                <div className="flex items-center gap-1 text-brand-yellow">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg key={index} viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.167L12 18.896l-7.336 3.868 1.402-8.167L.132 9.21l8.2-1.192z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-base text-white">“{testimonial.quote}”</p>
                <p className="mt-6 text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="text-xs text-white/70">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-xl mt-24">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 sm:p-10">
          <div className="grid gap-8 md:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-yellow text-brand-navy font-semibold">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{step.title}</p>
                  <p className="mt-2 text-sm text-white/70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-xl mt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[2.5rem] border border-white/10 bg-white text-brand-navy p-8 sm:p-10 shadow-card">
            <h2 className="text-3xl font-semibold">¿Listos para llevar tu packaging al siguiente nivel?</h2>
            <p className="mt-3 text-base text-brand-navy/80">
              Dejanos tus datos y en menos de 24 horas se comunica alguien del equipo para ayudarte a definir la mejor solución.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-yellow/30 bg-brand-navy p-8 sm:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/20 via-transparent to-brand-yellow/10" />
            <div className="relative">
              <h3 className="text-2xl font-semibold text-white">Beneficios eccomfy</h3>
              <ul className="mt-6 space-y-4 text-white/80">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-yellow">
                      <Icon name="check" />
                    </span>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/5490000000000"
                target="_blank"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-base font-semibold text-brand-navy shadow-lg shadow-brand-navy/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Escribir por WhatsApp
              </a>
              <p className="mt-3 text-xs text-white/60">* Reemplazá el número por el de tu negocio.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-xl mt-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-yellow/40 bg-gradient-to-r from-brand-yellow via-[#FFD976] to-[#FFE8A3] p-8 sm:p-10 text-brand-navy shadow-lg">
          <div className="absolute -right-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-white/40 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h3 className="text-3xl font-semibold">Diseñá, cotizá y producí en un solo flujo.</h3>
              <p className="text-brand-navy/70">
                Sumate a más de 400 marcas que crean experiencias memorables con packaging eccomfy.
              </p>
            </div>
            <Link
              href="/design/mailer"
              className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#07162E]"
            >
              Diseñar ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
