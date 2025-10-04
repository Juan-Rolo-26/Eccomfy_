import Link from "next/link";

const CTA_LINKS = [
  { href: "/design/mailer", label: "Abrir configurador" },
  { href: "/contact", label: "Hablar con un especialista" },
];

const FOOTER_LINK_GROUPS = [
  {
    title: "Explorá",
    links: [
      { href: "/products", label: "Productos" },
      { href: "/design/mailer", label: "Demostración 3D" },
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
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="rounded-[2.5rem] border border-white/15 bg-white/10 p-10 shadow-card backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">¿Listo para crear?</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Diseñamos experiencias de unboxing memorables
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/75">
              Explorá materiales responsables, simulaciones 3D y acompañamiento experto para que cada envío sorprenda. Nuestro equipo está listo para ayudarte en cada iteración.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {CTA_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-navy/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-8 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Seguinos</p>
              <p className="mt-2 text-lg font-semibold">Eccomfy</p>
              <p className="mt-2 text-sm text-white/70">
                Packaging a medida, tiradas flexibles y resultados premium sin sorpresas.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FOOTER_LINK_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-sm font-semibold text-white/80">{group.title}</p>
                  <ul className="mt-3 space-y-2 text-sm text-white/60">
                    {group.links.map((link) => {
                      const isExternal = link.href.startsWith("http");
                      const isMailTo = link.href.startsWith("mailto:");
                      return (
                        <li key={link.href}>
                          {isExternal || isMailTo ? (
                            <a
                              href={link.href}
                              className="transition hover:text-brand-yellow"
                              target={isExternal ? "_blank" : undefined}
                              rel={isExternal ? "noreferrer" : undefined}
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link href={link.href} className="transition hover:text-brand-yellow">
                              {link.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
              <span>&copy; {year} Eccomfy</span>
              <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden />
              <span>Hecho en Buenos Aires · Operamos en LATAM</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
