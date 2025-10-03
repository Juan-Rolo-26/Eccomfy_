"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { loginAction, type LoginState } from "./actions";

const INITIAL_STATE: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-base font-semibold text-brand-navy shadow-lg shadow-brand-navy/10 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Ingresando..." : "Ingresar"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, INITIAL_STATE);
  const verificationUrl = state.needsVerification
    ? `/verify-email?email=${encodeURIComponent(state.email ?? "")}`
    : "/verify-email";

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label className="text-sm font-medium text-white/80" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={state.email}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder="nombre@empresa.com"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white/80" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder="Tu contraseña"
        />
      </div>

      {state.error ? (
        <div className="space-y-3 rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-3 text-sm text-brand-yellow">
          <p>{state.error}</p>
          {state.needsVerification ? (
            <p>
              Completá la verificación desde {""}
              <Link href={verificationUrl} className="font-semibold underline">
                esta página
              </Link>{" "}
              para poder ingresar.
            </p>
          ) : null}
        </div>
      ) : null}

      <SubmitButton />

      <p className="text-sm text-white/70">
        ¿Olvidaste tu contraseña? {""}
        <Link href="/forgot-password" className="font-semibold text-brand-yellow hover:underline">
          Restablecela acá
        </Link>
      </p>

      <p className="text-sm text-white/70">
        ¿No tenés cuenta? {""}
        <Link href="/register" className="font-semibold text-brand-yellow hover:underline">
          Creá una gratis
        </Link>
      </p>
    </form>
  );
}
