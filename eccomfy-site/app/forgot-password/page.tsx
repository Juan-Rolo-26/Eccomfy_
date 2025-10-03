import Link from "next/link";

import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="container-xl py-20">
      <div className="rounded-[3rem] border border-white/15 bg-white/5 p-12 shadow-card backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Recuperar acceso</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
          Te enviamos un enlace para restablecer tu contraseña
        </h1>
        <p className="mt-4 max-w-2xl text-white/75">
          Ingresá tu email y te mandaremos un enlace temporal para que elijas una nueva contraseña. Por seguridad, el enlace expira a los 60 minutos.
        </p>

        <ForgotPasswordForm />

        <div className="mt-10 flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-white/70">
          <span>
            ¿No tenés cuenta todavía? {""}
            <Link href="/register" className="font-semibold text-brand-yellow hover:underline">
              Creá una gratis
            </Link>
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
