"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { registerAction, type RegisterState } from "./actions";

const INITIAL_STATE: RegisterState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-base font-semibold text-brand-navy shadow-lg shadow-brand-navy/10 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Creando cuenta..." : "Crear cuenta"}
    </button>
  );
}

export default function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, INITIAL_STATE);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label className="text-sm font-medium text-white/80" htmlFor="name">
          Nombre y apellido
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
          placeholder="Tu nombre completo"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white/80" htmlFor="email">
          Email corporativo
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-white/80" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-white/80" htmlFor="confirm">
            Repetir contraseña
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            minLength={8}
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="Repetí tu contraseña"
          />
        </div>
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-3 text-sm text-brand-yellow">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-sm text-white/70">
        ¿Ya tenés cuenta? {""}
        <Link href="/login" className="font-semibold text-brand-yellow hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
}
