import Link from "next/link";
import Image from "next/image";

import type { SafeUser } from "@/lib/auth";

const STYLE_IMAGES: Record<string, string> = {
  shipper: "/box-shipper.svg",
  product: "/box-product.svg",
  mailer: "/box-mailer.svg",
};

type Props = {
  style: string;
  user: SafeUser;
};

export default function DesignStaffBlock({ style, user }: Props) {
  const prettyLabel =
    style === "shipper"
      ? "shipping box"
      : style === "product"
      ? "product box"
      : "mailer";

  const image = STYLE_IMAGES[style] ?? STYLE_IMAGES.mailer;

  return (
    <div className="container-xl py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-[3rem] border border-white/15 bg-white/5 p-10 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Acceso restringido</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Hola, {user.name.split(" ")[0] || user.name}</h1>
          <p className="mt-4 text-white/70">
            El editor interactivo está pensado para clientes finales. Como integrante del equipo Eccomfy, gestioná las opciones disponibles desde el panel de administración.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/design-options"
              className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-5 py-3 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-navy/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Configurar opciones de diseño
            </Link>
            <Link
              href="/admin/content"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Volver al panel
            </Link>
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-6">
            <Image src={image} alt={prettyLabel} width={640} height={480} className="h-auto w-full" />
          </div>
          <p className="mt-6 text-sm text-white/60">
            Recordá cargar tamaños, materiales, acabados, cantidades y velocidades desde el panel para que tus clientes puedan usarlos al diseñar.
          </p>
        </div>
      </div>
    </div>
  );
}
