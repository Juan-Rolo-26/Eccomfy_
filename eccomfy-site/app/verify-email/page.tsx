import Link from "next/link";

import VerifyEmailForm from "./VerifyEmailForm";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const rawEmail = searchParams?.email;
  const email = typeof rawEmail === "string" ? rawEmail : "";

  return (
    <div className="container-xl py-20">
      <div className="rounded-[3rem] border border-white/15 bg-white/5 p-12 shadow-card backdrop-blur-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Activación de cuenta</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
          Confirmá tu email para empezar a diseñar tus cajas personalizadas
        </h1>
        <p className="mt-4 max-w-2xl text-white/75">
          Para proteger tu cuenta necesitamos validar que el correo ingresado existe. El proceso demora segundos y habilita el acceso a las herramientas de Eccomfy.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/60">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-brand-yellow" aria-hidden />
            Paso 1: verificá tu email
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-white/40" aria-hidden />
            Paso 2: accedé al panel y comenzá a diseñar
          </div>
        </div>

        <VerifyEmailForm defaultEmail={email} />

        <div className="mt-12 flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-white/70">
          <span className="font-semibold text-white">¿Necesitás ayuda?</span>
          <span>
            Escribinos a {""}
            <a href="mailto:contacto@eccomfy.com" className="font-semibold text-brand-yellow hover:underline">
              contacto@eccomfy.com
            </a>{" "}
            o hablá con el equipo por {""}
            <a href="https://wa.me/5490000000000" target="_blank" className="font-semibold text-brand-yellow hover:underline">
              WhatsApp
            </a>
            .
          </span>
          <Link href="/login" className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-semibold text-white transition hover:bg-white/10">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
