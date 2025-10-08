import Link from "next/link";

export const metadata = {
  title: "Contacto | Eccomfy",
  description:
    "Coordiná con el equipo comercial de Eccomfy para resolver cotizaciones, logística y proyectos especiales.",
};

const contacts = [
  {
    title: "Ventas y asesoramiento",
    description: "Solicitá ayuda para elegir materiales, acabados o coordinar una demo en vivo.",
    actions: [
      {
        label: "contacto@eccomfy.com",
        href: "mailto:contacto@eccomfy.com",
        subtle: false,
      },
      {
        label: "Agendar videollamada",
        href: "https://cal.com/eccomfy/30min",
        subtle: true,
      },
    ],
  },
  {
    title: "Soporte logístico",
    description: "Seguimiento de órdenes, gestión de envíos y coordinación con tu centro logístico.",
    actions: [
      {
        label: "Logística en WhatsApp",
        href: "https://wa.me/5490000000000",
        subtle: false,
      },
      {
        label: "Guía de empaquetado",
        href: "/products",
        subtle: true,
      },
    ],
  },
];

export default function ContactPage() {
  return (
    <div className="bg-brand-blue/40 py-16">
      <div className="container-xl space-y-16">
        <header className="text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Estamos para ayudarte</p>
          <h1 className="mt-2 text-4xl font-semibold">Contactá al equipo Eccomfy</h1>
          <p className="mt-3 max-w-2xl text-base text-white/75">
            Podés escribirnos o agendar una reunión y nos encargamos de resolver cotizaciones, entregas y proyectos especiales junto a vos.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {contacts.map((contact) => (
            <section
              key={contact.title}
              className="space-y-6 rounded-[2.5rem] border border-white/15 bg-white/10 p-8 text-white shadow-inner shadow-brand-navy/20"
            >
              <div>
                <h2 className="text-2xl font-semibold">{contact.title}</h2>
                <p className="mt-3 text-sm text-white/70">{contact.description}</p>
              </div>
              <div className="space-y-3">
                {contact.actions.map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    className={`block w-full rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                      action.subtle
                        ? "border border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                        : "bg-brand-yellow text-brand-navy hover:-translate-y-0.5 hover:shadow-xl"
                    }`}
                    target={action.href.startsWith("http") ? "_blank" : undefined}
                    rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="rounded-[2.5rem] border border-white/15 bg-brand-navy/70 p-8 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">¿Querés probar el configurador 3D?</h2>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Elegí un producto, cargá tus medidas y recibí una cotización instantánea. Nuestro equipo puede ayudarte a personalizarlo al detalle.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/design"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Diseñar ahora
              </Link>
              <Link
                href="/account"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                Ver mi cuenta
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
