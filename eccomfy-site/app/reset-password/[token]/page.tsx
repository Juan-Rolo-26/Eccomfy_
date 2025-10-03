import Link from "next/link";

import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const { token } = params;

  return (
    <div className="container-xl py-20">
      <div className="rounded-[3rem] border border-white/15 bg-white/5 p-12 shadow-card backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Crear nueva contraseña</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
          Elegí una contraseña segura para seguir usando Eccomfy
        </h1>
        <p className="mt-4 max-w-2xl text-white/75">
          El enlace que abriste expira a los 60 minutos. Una vez guardados los cambios vamos a cerrar todas las sesiones activas por seguridad.
        </p>

        <ResetPasswordForm token={token} />

        <div className="mt-10 flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-white/70">
          <span>
            ¿No pediste este cambio? {""}
            <a href="mailto:contacto@eccomfy.com" className="font-semibold text-brand-yellow hover:underline">
              Escribinos al soporte
            </a>
            .
          </span>
          <Link href="/forgot-password" className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-semibold text-white transition hover:bg-white/10">
            Solicitar otro enlace
          </Link>
        </div>
      </div>
    </div>
  );
}
