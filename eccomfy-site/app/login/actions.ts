"use server";

import { redirect } from "next/navigation";

import { EmailNotVerifiedError, signIn, verifyUser } from "@/lib/auth";

export type LoginState = {
  error?: string;
  needsVerification?: boolean;
  email?: string;
};

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresá tu email y contraseña." };
  }

  try {
    const user = await verifyUser(email, password);
    if (!user) {
      return { error: "Credenciales incorrectas.", email };
    }

    await signIn(user);
  } catch (error) {
    if (error instanceof EmailNotVerifiedError) {
      return {
        error: "Necesitás verificar tu email antes de ingresar.",
        needsVerification: true,
        email,
      };
    }
    console.error("loginAction", error);
    return { error: "No pudimos iniciar sesión. Intentá de nuevo.", email };
  }

  redirect("/account");
}
