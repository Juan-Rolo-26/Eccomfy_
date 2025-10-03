"use server";

import { redirect } from "next/navigation";

import { PasswordResetError, resetPasswordWithToken, signIn } from "@/lib/auth";

export type ResetPasswordState = {
  error?: string;
};

export async function resetPasswordAction(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) {
    return { error: "El enlace no es válido. Solicitá uno nuevo." };
  }

  if (!password || !confirm) {
    return { error: "Completá los dos campos de contraseña." };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  if (password !== confirm) {
    return { error: "Las contraseñas no coinciden." };
  }

  try {
    const user = await resetPasswordWithToken(token, password);
    await signIn(user);
  } catch (error) {
    if (error instanceof PasswordResetError) {
      if (error.code === "TOKEN_EXPIRED") {
        return { error: "El enlace expiró. Solicitá uno nuevo desde la página de recuperar contraseña." };
      }
      return { error: "El enlace no es válido. Pedí otro e intentá nuevamente." };
    }
    console.error("resetPasswordAction", error);
    return { error: "No pudimos actualizar tu contraseña. Intentá nuevamente." };
  }

  redirect("/account");
}
