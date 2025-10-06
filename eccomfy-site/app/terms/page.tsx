export const metadata = {
  title: "Términos y condiciones — Eccomfy",
  description:
    "Revisá las condiciones de uso de Eccomfy, alcance del servicio, responsabilidades y políticas de pago.",
};

const SECTIONS = [
  {
    title: "1. Alcance del servicio",
    body: [
      "Eccomfy brinda una plataforma para diseñar packaging personalizado, cotizar tiradas y coordinar producción con nuestro equipo.",
      "El uso del editor 3D y la carga de configuraciones no constituye una orden de compra hasta que confirmes la producción con un ejecutivo.",
    ],
  },
  {
    title: "2. Registro y cuentas",
    body: [
      "Los usuarios deben proporcionar datos reales y mantener sus credenciales en secreto. Podés solicitar la baja cuando quieras.",
      "Las cuentas marcadas como staff tienen permisos ampliados y deben garantizar el uso responsable de la plataforma.",
    ],
  },
  {
    title: "3. Producción y entregas",
    body: [
      "Los plazos y precios publicados en el editor son estimativos. Las fechas finales se confirman por escrito al aprobar artes y pago inicial.",
      "Los archivos subidos deben respetar especificaciones técnicas. Eccomfy puede rechazar materiales que comprometan la calidad.",
    ],
  },
  {
    title: "4. Pagos",
    body: [
      "Las órdenes confirmadas requieren un adelanto mínimo del 50%. El saldo se abona previo a despacho o según acuerdo comercial.",
      "Los precios se expresan en dólares estadounidenses salvo aclaración y pueden variar frente a cambios impositivos o logísticos.",
    ],
  },
  {
    title: "5. Propiedad intelectual",
    body: [
      "Los contenidos y diseños subidos por cada cliente siguen siendo de su titularidad. Nos autorizás a utilizarlos únicamente para producir el packaging solicitado.",
      "Los recursos gráficos, textos y software de Eccomfy están protegidos por derechos de autor. No se permite su copia o ingeniería inversa.",
    ],
  },
  {
    title: "6. Limitación de responsabilidad",
    body: [
      "No garantizamos disponibilidad ininterrumpida del sitio, aunque haremos esfuerzos razonables para evitar interrupciones.",
      "Eccomfy no será responsable por daños indirectos derivados del uso del servicio, salvo dolo o culpa grave demostrada.",
    ],
  },
  {
    title: "7. Modificaciones",
    body: [
      "Podemos actualizar estos términos en cualquier momento. Te avisaremos con antelación y la versión vigente siempre estará publicada en este enlace.",
    ],
  },
  {
    title: "8. Contacto",
    body: [
      "Para consultas sobre estos términos escribinos a contacto@eccomfy.com o a tu ejecutivo asignado.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="container-xl py-16">
      <div className="rounded-[3rem] border border-white/15 bg-white/5 p-10 backdrop-blur">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          Términos y condiciones
        </span>
        <h1 className="mt-4 text-4xl font-semibold text-white">Condiciones para usar Eccomfy</h1>
        <p className="mt-3 max-w-3xl text-white/75">
          Al acceder a Eccomfy aceptás estos términos. Te recomendamos leerlos con atención para conocer tus responsabilidades y las nuestras.
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
          Al continuar utilizando Eccomfy confirmás que leíste y aceptaste estos términos. Para aclaraciones adicionales, escribinos a{' '}
          <a href="mailto:contacto@eccomfy.com" className="font-semibold text-brand-yellow hover:underline">
            contacto@eccomfy.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
