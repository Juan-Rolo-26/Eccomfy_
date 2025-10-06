import type { Metadata } from "next";

const TERMS_SECTIONS = [
  {
    title: "1. Aceptación de los términos",
    body: [
      "Al acceder y utilizar Eccomfy aceptás estos términos y condiciones. Si no estás de acuerdo con alguna parte, te pedimos que no continúes utilizando la plataforma.",
      "Podemos actualizar estos términos cuando sea necesario. En ese caso, publicaremos la nueva versión e indicaremos la fecha de la última actualización para que estés al tanto de los cambios.",
    ],
  },
  {
    title: "2. Servicios",
    body: [
      "Ofrecemos herramientas para diseñar packaging personalizado, solicitar presupuestos y coordinar producciones. Nos reservamos el derecho de modificar, suspender o interrumpir cualquier servicio cuando sea necesario para mantener la calidad de la experiencia.",
      "En caso de cambios relevantes, te avisaremos con antelación razonable por los canales de comunicación registrados.",
    ],
  },
  {
    title: "3. Cuentas de usuario",
    body: [
      "Para acceder a funciones avanzadas necesitás crear una cuenta con datos válidos y mantenerlos actualizados.",
      "Sos responsable de la confidencialidad de tus credenciales y de todas las acciones realizadas con tu cuenta. Avisanos de inmediato ante cualquier uso no autorizado para ayudarte a protegerla.",
    ],
  },
  {
    title: "4. Pagos y presupuestos",
    body: [
      "Los valores calculados en el configurador son estimaciones. El precio final puede variar según la revisión técnica, tiradas mínimas, acabados y tiempos de producción definitivos.",
      "Confirmaremos cada presupuesto por correo electrónico antes de avanzar con la producción. Cualquier importe abonado no es reembolsable una vez iniciado el proceso productivo.",
    ],
  },
  {
    title: "5. Propiedad intelectual",
    body: [
      "Todos los contenidos del sitio (diseños, gráficos, textos y software) son propiedad de Eccomfy o de sus licenciantes y están protegidos por leyes de propiedad intelectual.",
      "Los archivos que subas para personalizar tus piezas seguirán siendo tuyos, pero nos otorgás una licencia limitada para utilizarlos con el objetivo de brindar el servicio contratado.",
    ],
  },
  {
    title: "6. Limitación de responsabilidad",
    body: [
      "Nos esforzamos por ofrecer una plataforma disponible y segura. Sin embargo, no podemos garantizar el acceso ininterrumpido y no seremos responsables por daños derivados del uso o imposibilidad de uso del servicio más allá de lo permitido por la ley.",
    ],
  },
  {
    title: "7. Legislación aplicable",
    body: [
      "Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa deberá resolverse en los tribunales de la Ciudad Autónoma de Buenos Aires.",
    ],
  },
  {
    title: "8. Contacto",
    body: [
      "Si tenés dudas o comentarios sobre estos términos, escribinos a hola@eccomfy.com y te responderemos a la brevedad.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones de uso de Eccomfy, la plataforma para diseñar y producir packaging personalizado de manera responsable.",
};

export default function TermsPage() {
  return (
    <div className="container-xl space-y-12 py-16">
      <header className="space-y-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Legal</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Términos y condiciones</h1>
        <p className="max-w-3xl text-base text-white/70">
          Gracias por confiar en Eccomfy. En este documento vas a encontrar las reglas que aplican cuando usás nuestras
          herramientas de diseño, nuestros servicios y cualquier canal de contacto.
        </p>
      </header>

      <div className="space-y-10">
        {TERMS_SECTIONS.map((section) => (
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
