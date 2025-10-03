export class MailerNotConfiguredError extends Error {
  constructor() {
    super(
      "El servicio de correo no está configurado. Definí RESEND_API_KEY y MAIL_FROM en las variables de entorno.",
    );
    this.name = "MailerNotConfiguredError";
  }
}

export type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const RESEND_ENDPOINT = process.env.RESEND_API_URL?.trim() || "https://api.resend.com/emails";

export async function sendMail({ to, subject, html, text }: SendMailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.MAIL_FROM?.trim();

  if (!apiKey || !from) {
    throw new MailerNotConfiguredError();
  }

  const payload = {
    from,
    to: [to],
    subject,
    html,
    text: text ?? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  };

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const data = (await response.json()) as { message?: string } | undefined;
      if (data?.message) {
        message = data.message;
      }
    } catch (error) {
      // ignore JSON parse errors
    }
    throw new Error(`MAIL_SEND_FAILED:${message}`);
  }
}
