"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import {
  ResendVerificationState,
  VerifyEmailState,
  resendVerificationAction,
  verifyEmailAction,
} from "./actions";

const VERIFY_INITIAL_STATE: VerifyEmailState = {};
const RESEND_INITIAL_STATE: ResendVerificationState = {};

function VerifyButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-base font-semibold text-brand-navy shadow-lg shadow-brand-navy/10 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Verificando..." : "Confirmar email"}
    </button>
  );
}

function ResendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Enviando..." : "Reenviar código"}
    </button>
  );
}

export default function VerifyEmailForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [verifyState, verifyAction] = useFormState(verifyEmailAction, VERIFY_INITIAL_STATE);
  const [resendState, resendAction] = useFormState(resendVerificationAction, RESEND_INITIAL_STATE);
  const emailValue = verifyState.email ?? defaultEmail;
  const resendEmailValue = emailValue || defaultEmail;

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]">
      <form action={verifyAction} className="rounded-[2.5rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Paso obligatorio</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Verificá tu email</h2>
        <p className="mt-3 text-sm text-white/70">
          Te enviamos un código de seis dígitos al correo con el que te registraste. Ingresalo a continuación para activar tu cuenta.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-white/80" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={emailValue}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
              placeholder="nombre@empresa.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white/80" htmlFor="code">
              Código de verificación
            </label>
            <input
              id="code"
              name="code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
              placeholder="000000"
            />
            <p className="mt-2 text-xs text-white/60">El código vence a los 30 minutos.</p>
          </div>
        </div>

        {verifyState.error ? (
          <p className="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {verifyState.error}
          </p>
        ) : null}

        <VerifyButton />

        <p className="mt-4 text-xs text-white/60">
          Si ya verificaste tu email, podés {""}
          <Link href="/login" className="font-semibold text-brand-yellow hover:underline">
            iniciar sesión
          </Link>
          .
        </p>
      </form>

      <form action={resendAction} className="rounded-[2.5rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
        <h3 className="text-xl font-semibold text-white">¿No recibiste el código?</h3>
        <p className="mt-3 text-sm text-white/70">
          Enviá nuevamente el correo de verificación. Revisá la carpeta de spam o promociones si no aparece en tu bandeja principal.
        </p>

        <div className="mt-6">
          <label className="text-sm font-medium text-white/80" htmlFor="resend-email">
            Email
          </label>
          <input
            id="resend-email"
            name="email"
            type="email"
            required
            defaultValue={resendEmailValue}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="nombre@empresa.com"
          />
        </div>

        {resendState.error ? (
          <p className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-xs text-red-100">
            {resendState.error}
          </p>
        ) : null}

        {resendState.success ? (
          <p className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
            {resendState.success}
          </p>
        ) : null}

        <div className="mt-6">
          <ResendButton />
        </div>

        <p className="mt-4 text-xs text-white/60">
          ¿Te equivocaste de email al registrarte? {""}
          <Link href="/register" className="font-semibold text-brand-yellow hover:underline">
            Creá una cuenta nueva
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
