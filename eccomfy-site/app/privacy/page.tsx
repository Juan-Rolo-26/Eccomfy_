export const metadata = {
  title: "Política de privacidad — Eccomfy",
  description:
    "Conocé cómo Eccomfy protege tus datos personales, qué información recopilamos y cómo podés ejercer tus derechos.",
};

const SECTIONS = [
  {
    title: "1. Información que recopilamos",
    body: [
      "Datos de contacto (nombre, email, teléfono) que se solicitan al crear una cuenta o completar formularios.",
      "Información comercial de tu empresa y preferencias de packaging cargadas al configurar productos.",
      "Registros de actividad dentro del editor 3D, como medidas guardadas o archivos subidos.",
      "Datos técnicos básicos (dirección IP, navegador y cookies) que nos ayudan a mantener la seguridad del sitio.",
    ],
  },
  {
    title: "2. Cómo usamos tus datos",
    body: [
      "Para habilitar el acceso al configurador y ofrecerte precios acordes a tus parámetros.",
      "Para enviarte comunicaciones operativas sobre pedidos, verificación de cuenta o soporte.",
      "Para mejorar la plataforma a partir de estadísticas agregadas y anónimas.",
      "Nunca vendemos ni cedemos tus datos personales a terceros para fines publicitarios.",
    ],
  },
  {
    title: "3. Base legal y retención",
    body: [
      "Tratamos tus datos porque son necesarios para prestar el servicio contratado y porque contamos con tu consentimiento al registrarte.",
      "Conservamos la información mientras seas cliente activo o hasta que solicites su eliminación, respetando obligaciones fiscales vigentes.",
    ],
  },
  {
    title: "4. Tus derechos",
    body: [
      "Acceder, rectificar o eliminar tus datos personales escribiendo a contacto@eccomfy.com.",
      "Solicitar la portabilidad de la información o limitar ciertos tratamientos.",
      "Presentar un reclamo ante la autoridad de control competente si considerás que vulneramos tus derechos.",
    ],
  },
  {
    title: "5. Seguridad",
    body: [
      "Aplicamos cifrado TLS, controles de acceso por roles y auditorías periódicas para proteger tu información.",
      "En caso de incidentes te notificaremos con prontitud e indicaremos las medidas adoptadas.",
    ],
  },
  {
    title: "6. Cambios a esta política",
    body: [
      "Podemos actualizar estos términos para reflejar nuevas regulaciones o funcionalidades. Avisaremos por email y mostraremos la versión vigente en este sitio.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-xl py-16">
      <div className="rounded-[3rem] border border-white/15 bg-white/5 p-10 backdrop-blur">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          Política de privacidad
        </span>
        <h1 className="mt-4 text-4xl font-semibold text-white">Protegemos los datos de tu marca</h1>
        <p className="mt-3 max-w-3xl text-white/75">
          Esta política describe cómo Eccomfy recolecta, utiliza y resguarda la información personal de clientes y visitantes. Nos comprometemos a operar con transparencia y cumplir con la normativa de protección de datos aplicable en Argentina y Latinoamérica.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title} className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 text-white/80 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed">
              {section.body.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-yellow" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-[2.5rem] border border-white/15 bg-white/10 p-6 text-sm text-white/70">
        <p>
          Si tenés dudas adicionales sobre el tratamiento de datos o querés ejercer tus derechos, escribinos a{' '}
          <a href="mailto:contacto@eccomfy.com" className="font-semibold text-brand-yellow hover:underline">
            contacto@eccomfy.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
