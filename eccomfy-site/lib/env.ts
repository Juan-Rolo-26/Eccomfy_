export function getAppUrl(): string {
  const envUrl = process.env.APP_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const prefix = vercelUrl.startsWith("http") ? "" : "https://";
    return `${prefix}${vercelUrl.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}
