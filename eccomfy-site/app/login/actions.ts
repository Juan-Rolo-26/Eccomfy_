"use server";

import { redirect } from "next/navigation";

import { signIn, verifyUser } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresá tu email y contraseña." };
  }

  const user = await verifyUser(email, password);
  if (!user) {
    return { error: "Credenciales incorrectas." };
  }

  await signIn(user);
  redirect("/account");
}
