"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { forgotPasswordAction, type ForgotPasswordState } from "./actions";

const INITIAL_STATE: ForgotPasswordState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-base font-semibold text-brand-navy shadow-lg shadow-brand-navy/10 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Enviando..." : "Enviar enlace"}
    </button>
  );
}

export default function ForgotPasswordForm() {
  const [state, formAction] = useFormState(forgotPasswordAction, INITIAL_STATE);

  return (
    <form action={formAction} className="mt-10 rounded-[2.5rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
      <div>
        <label className="text-sm font-medium text-white/80" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder="nombre@empresa.com"
        />
      </div>

      {state.error ? (
        <p className="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">{state.error}</p>
      ) : null}

      {state.success ? (
        <p className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {state.success}
        </p>
      ) : null}

      <SubmitButton />

      <p className="mt-6 text-sm text-white/70">
        ¿Recordaste tu contraseña? {""}
        <Link href="/login" className="font-semibold text-brand-yellow hover:underline">
          Volvé al login
        </Link>
        .
      </p>
    </form>
  );
}
