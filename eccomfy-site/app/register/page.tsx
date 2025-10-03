import { redirect } from "next/navigation";

import RegisterForm from "./RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/account");
  }

  return (
    <div className="container-xl py-20">
      <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/15 bg-white/5 p-10 shadow-card backdrop-blur">
        <div className="space-y-3 text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Crear cuenta
          </span>
          <h1 className="text-4xl font-semibold text-white">Arrancá con tu cuenta eccomfy</h1>
          <p className="text-white/75">
            Gestioná diseños, guardá variantes y conectate con nuestro equipo en un solo lugar.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
