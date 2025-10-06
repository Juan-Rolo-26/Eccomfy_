import Link from "next/link";

const CTA_LINKS = [
  { href: "/products", label: "Ver catálogo" },
  { href: "/contact", label: "Hablar con un especialista" },
];

const FOOTER_LINK_GROUPS = [
  {
    title: "Explorá",
    links: [
      { href: "/products", label: "Productos" },
      { href: "/products", label: "Catálogo completo" },
      { href: "/admin/content", label: "Panel staff" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { href: "/forgot-password", label: "Recuperar contraseña" },
      { href: "/verify-email", label: "Verificar cuenta" },
      { href: "mailto:contacto@eccomfy.com", label: "Escribir a soporte" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { href: "https://www.linkedin.com", label: "LinkedIn" },
      { href: "https://www.instagram.com", label: "Instagram" },
      { href: "https://www.behance.net", label: "Behance" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Política de privacidad" },
      { href: "/terms", label: "Términos y condiciones" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 bg-brand-navy text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-brand-blue/40 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-72 w-72 rounded-full bg-brand-yellow/30 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
      </div>

      <div className="container-xl relative py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Eccomfy</p>
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Packaging sostenible para marcas que quieren dejar huella
            </h2>
            <p className="max-w-xl text-base text-white/75">
              Diseñamos experiencias de unboxing que combinan creatividad, impacto visual y procesos responsables. Sumate y construyamos una identidad que se sienta desde el primer contacto.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-navy/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Empezar un proyecto
            </Link>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur">
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Explorá</p>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition hover:text-brand-yellow">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-px w-full bg-white/10" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Redes</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-brand-yellow/60 hover:bg-white/10 hover:text-brand-yellow"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                <span>&copy; {year} Eccomfy</span>
                <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden />
                <span>Hecho en Buenos Aires</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
