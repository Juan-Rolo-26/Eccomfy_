"use server";

import { requestPasswordReset } from "@/lib/auth";
import { MailerNotConfiguredError } from "@/lib/mailer";

export type ForgotPasswordState = {
  error?: string;
  success?: string;
};

export async function forgotPasswordAction(
  _prev: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Ingresá el email con el que te registraste." };
  }

  try {
    await requestPasswordReset(email);
  } catch (error) {
    if (error instanceof MailerNotConfiguredError) {
      return { error: error.message };
    }
    console.error("forgotPasswordAction", error);
    return { error: "No pudimos enviar el correo de restablecimiento. Intentá más tarde." };
  }

  return {
    success:
      "Si el email está registrado, vas a recibir un enlace para crear una nueva contraseña en los próximos minutos.",
  };
}
