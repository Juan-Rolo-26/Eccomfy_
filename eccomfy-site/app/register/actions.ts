"use server";

import { redirect } from "next/navigation";

import { createUser, sendEmailVerificationEmail } from "@/lib/auth";
import { MailerNotConfiguredError } from "@/lib/mailer";
import { deleteUserById } from "@/lib/users";

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

    try {
      await sendEmailVerificationEmail(user);
    } catch (error) {
      deleteUserById(user.id);
      if (error instanceof MailerNotConfiguredError) {
        return {
          error:
            "No pudimos enviar el email de verificación porque falta configurar el servicio de correo. Avisá al administrador.",
        };
      }
      console.error("sendEmailVerificationEmail", error);
      return {
        error: "No pudimos enviar el correo de verificación. Intentá nuevamente más tarde.",
      };
    }
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_IN_USE") {
      return { error: "Ya existe una cuenta con ese email." };
    }
    console.error("registerAction", error);
    return { error: "No pudimos crear tu cuenta. Intentá de nuevo." };
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}
