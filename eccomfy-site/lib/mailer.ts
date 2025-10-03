export class MailerNotConfiguredError extends Error {
  constructor() {
    super(
      "El servicio de correo no está configurado. Definí RESEND_API_KEY y MAIL_FROM en las variables de entorno.",
    );
    this.name = "MailerNotConfiguredError";
  }
}

export type MailerChannel = "default" | "staff";

export type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  channel?: MailerChannel;
};

const RESEND_ENDPOINT = process.env.RESEND_API_URL?.trim() || "https://api.resend.com/emails";

type MailerConfig = {
  apiKey: string;
  from: string;
};

const resolveMailerConfig = (channel: MailerChannel): MailerConfig | null => {
  const normalizedChannel = channel === "staff" ? "staff" : "default";

  if (normalizedChannel === "staff") {
    const apiKey = process.env.RESEND_STAFF_API_KEY?.trim();
    const from = process.env.MAIL_FROM_STAFF?.trim();
    if (apiKey && from) {
      return { apiKey, from };
    }
  }

  const fallbackKey = process.env.RESEND_API_KEY?.trim();
  const fallbackFrom = process.env.MAIL_FROM?.trim();
  if (fallbackKey && fallbackFrom) {
    return { apiKey: fallbackKey, from: fallbackFrom };
  }

  return null;
};

export async function sendMail({ to, subject, html, text, channel = "default" }: SendMailInput): Promise<void> {
  const config = resolveMailerConfig(channel);

  if (!config) {
    throw new MailerNotConfiguredError();
  }

  const payload = {
    from: config.from,
    to: [to],
    subject,
    html,
    text: text ?? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  };

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
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
