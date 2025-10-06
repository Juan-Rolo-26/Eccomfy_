import type { Metadata } from "next";

const PRIVACY_SECTIONS = [
  {
    title: "1. Qué datos recopilamos",
    body: [
      "Registramos los datos que completás al crear una cuenta, como nombre, correo electrónico y contraseña.",
      "Si solicitás presupuestos o producciones, almacenamos la información necesaria para coordinar entregas, facturación y comunicación.",
      "También recopilamos datos técnicos mínimos (logs, IP, tipo de dispositivo) para mantener la seguridad y mejorar la experiencia.",
    ],
  },
  {
    title: "2. Cómo usamos tus datos",
    body: [
      "Utilizamos tus datos para brindarte acceso al configurador, enviar confirmaciones, coordinar proyectos y responder consultas.",
      "Podemos enviarte novedades y contenido relevante si aceptás recibir comunicaciones. Podés darte de baja cuando quieras.",
    ],
  },
  {
    title: "3. Almacenamiento y seguridad",
    body: [
      "Guardamos la información en servidores protegidos con medidas de seguridad razonables. Aunque trabajamos para prevenir incidentes, ningún sistema es infalible.",
      "En caso de detectar un evento de seguridad, te avisaremos con la mayor rapidez posible y tomaremos las medidas necesarias.",
    ],
  },
  {
    title: "4. Compartir información",
    body: [
      "Sólo compartimos tus datos con proveedores necesarios para prestar el servicio (logística, impresión, soporte técnico) y siempre bajo acuerdos de confidencialidad.",
      "No vendemos ni alquilamos tu información personal.",
    ],
  },
  {
    title: "5. Tus derechos",
    body: [
      "Podés solicitar acceso, actualización o eliminación de tus datos personales enviando un correo a hola@eccomfy.com.",
      "Si eliminás tu cuenta, conservaremos la información estrictamente necesaria para cumplir obligaciones legales o contables.",
    ],
  },
  {
    title: "6. Cookies y tecnologías similares",
    body: [
      "Usamos cookies para recordar tus preferencias y analizar el uso del sitio. Podés ajustar tu navegador para rechazarlas, aunque algunas funciones podrían verse afectadas.",
    ],
  },
  {
    title: "7. Actualizaciones de esta política",
    body: [
      "Podemos modificar esta política para reflejar cambios legales o en nuestros procesos. Publicaremos la nueva versión indicando la fecha de actualización.",
    ],
  },
  {
    title: "8. Contacto",
    body: [
      "Para cualquier consulta sobre privacidad, escribinos a hola@eccomfy.com y te responderemos a la brevedad.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Conocé cómo Eccomfy protege y utiliza tus datos personales mientras diseñás y producís packaging personalizado.",
};

export default function PrivacyPage() {
  return (
    <div className="container-xl space-y-12 py-16">
      <header className="space-y-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Legal</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Política de privacidad</h1>
        <p className="max-w-3xl text-base text-white/70">
          En Eccomfy respetamos tu privacidad y tratamos tus datos personales con responsabilidad. Acá encontrarás cómo los recolectamos,
          para qué los usamos y qué opciones tenés sobre ellos.
        </p>
      </header>

      <div className="space-y-10">
        {PRIVACY_SECTIONS.map((section) => (
          <section key={section.title} className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/75">
              {section.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
