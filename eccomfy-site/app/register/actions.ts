"use server";

import { redirect } from "next/navigation";

import { createUser, signIn } from "@/lib/auth";

export type RegisterState = {
  error?: string;
};

export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!name || !email || !password || !confirm) {
    return { error: "Completá todos los campos." };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  if (password !== confirm) {
    return { error: "Las contraseñas no coinciden." };
  }

  try {
    const user = await createUser(name, email, password);
    await signIn(user);
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_IN_USE") {
      return { error: "Ya existe una cuenta con ese email." };
    }
    console.error("registerAction", error);
    return { error: "No pudimos crear tu cuenta. Intentá de nuevo." };
  }

  redirect("/account");
}
