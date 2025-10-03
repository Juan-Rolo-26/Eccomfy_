"use server";

import { redirect } from "next/navigation";

import {
  EmailVerificationError,
  resendEmailVerification,
  signIn,
  verifyEmailWithCode,
} from "@/lib/auth";
import { MailerNotConfiguredError } from "@/lib/mailer";

export type VerifyEmailState = {
  error?: string;
  email?: string;
};

export type ResendVerificationState = {
  error?: string;
  success?: string;
};

export async function verifyEmailAction(
  _prev: VerifyEmailState,
  formData: FormData,
): Promise<VerifyEmailState> {
  const email = String(formData.get("email") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();

  if (!email || !code) {
    return { error: "Completá tu email y el código recibido.", email };
  }

  try {
    const user = await verifyEmailWithCode(email, code);
    await signIn(user);
  } catch (error) {
    if (error instanceof EmailVerificationError) {
      if (error.code === "EMAIL_NOT_FOUND") {
        return { error: "No encontramos una cuenta con ese email.", email };
      }
      if (error.code === "EMAIL_ALREADY_VERIFIED") {
        return { error: "Este email ya fue verificado. Iniciá sesión.", email };
      }
      return { error: "El código ingresado no es válido o expiró.", email };
    }
    console.error("verifyEmailAction", error);
    return { error: "No pudimos verificar tu email. Intentá nuevamente.", email };
  }

  redirect("/account");
}

export async function resendVerificationAction(
  _prev: ResendVerificationState,
  formData: FormData,
): Promise<ResendVerificationState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Ingresá el email con el que te registraste." };
  }

  try {
    await resendEmailVerification(email);
  } catch (error) {
    if (error instanceof EmailVerificationError) {
      if (error.code === "EMAIL_NOT_FOUND") {
        return { error: "No encontramos una cuenta con ese email." };
      }
      if (error.code === "EMAIL_ALREADY_VERIFIED") {
        return { error: "Ese email ya está verificado. Iniciá sesión." };
      }
      return { error: "No pudimos generar un nuevo código. Intentá más tarde." };
    }
    if (error instanceof MailerNotConfiguredError) {
      return { error: error.message };
    }
    console.error("resendVerificationAction", error);
    return { error: "No pudimos enviar el código. Intentá más tarde." };
  }

  return { success: "Enviamos un nuevo código a tu casilla. Revisá también la carpeta de spam." };
}
