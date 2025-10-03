import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import db, { DbUser } from "./db";
import { getAppUrl } from "./env";
import { sendMail } from "./mailer";

const SESSION_COOKIE = "eccomfy_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días
const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 30; // 30 minutos
const PASSWORD_RESET_TTL_MS = 1000 * 60 * 60; // 60 minutos

export class EmailNotVerifiedError extends Error {
  constructor() {
    super("EMAIL_NOT_VERIFIED");
    this.name = "EmailNotVerifiedError";
  }
}

export type EmailVerificationErrorCode =
  | "EMAIL_NOT_FOUND"
  | "EMAIL_ALREADY_VERIFIED"
  | "VERIFICATION_CODE_INVALID";

export class EmailVerificationError extends Error {
  readonly code: EmailVerificationErrorCode;

  constructor(code: EmailVerificationErrorCode) {
    super(code);
    this.code = code;
    this.name = "EmailVerificationError";
  }
}

export type PasswordResetErrorCode = "TOKEN_INVALID" | "TOKEN_EXPIRED";

export class PasswordResetError extends Error {
  readonly code: PasswordResetErrorCode;

  constructor(code: PasswordResetErrorCode) {
    super(code);
    this.code = code;
    this.name = "PasswordResetError";
  }
}

export type SafeUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_staff: boolean;
  email_verified: boolean;
};

type SessionRow = {
  session_id: number;
  session_token: string;
  session_expires_at: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_created_at: string;
  user_is_staff: number;
  user_email_verified_at: string | null;
};

type EmailVerificationTokenRow = {
  id: number;
  user_id: number;
  code_hash: string;
  expires_at: string;
  consumed_at: string | null;
};

type PasswordResetTokenRow = {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  consumed_at: string | null;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const normalizeTimestamp = (value: string): string => {
  const candidate = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const date = new Date(candidate);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString();
};

const mapUser = (row: DbUser): SafeUser => ({
  id: row.id,
  name: row.name,
  email: row.email,
  created_at: normalizeTimestamp(row.created_at),
  is_staff: Boolean(row.is_staff),
  email_verified: Boolean(row.email_verified_at),
});

const hasAnyStaff = (): boolean => {
  const result = db
    .prepare<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE is_staff = 1")
    .get();
  return (result?.count ?? 0) > 0;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const generateVerificationCode = (): string => {
  return String(100000 + Math.floor(Math.random() * 900000));
};

async function createEmailVerificationToken(userId: number): Promise<{ code: string; expiresAt: Date }> {
  db.prepare("DELETE FROM email_verification_tokens WHERE user_id = ?").run(userId);

  const code = generateVerificationCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAtIso = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS).toISOString();

  db.prepare(
    "INSERT INTO email_verification_tokens (user_id, code_hash, expires_at) VALUES (?, ?, ?)",
  ).run(userId, codeHash, expiresAtIso);

  return { code, expiresAt: new Date(expiresAtIso) };
}

function getLatestEmailVerificationToken(userId: number): EmailVerificationTokenRow | undefined {
  const row = db
    .prepare<EmailVerificationTokenRow>(
      "SELECT id, user_id, code_hash, expires_at, consumed_at FROM email_verification_tokens WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    )
    .get(userId);
  return row;
}

function markVerificationTokenConsumed(tokenId: number): void {
  db.prepare("UPDATE email_verification_tokens SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?").run(tokenId);
}

function getUserByIdInternal(id: number): DbUser | undefined {
  return db
    .prepare(
      "SELECT id, name, email, password_hash, created_at, is_staff, email_verified_at FROM users WHERE id = ?",
    )
    .get(id) as DbUser | undefined;
}

function markUserEmailVerified(userId: number): DbUser {
  db.prepare("UPDATE users SET email_verified_at = CURRENT_TIMESTAMP WHERE id = ?").run(userId);
  const updated = getUserByIdInternal(userId);
  if (!updated) {
    throw new Error("USER_NOT_FOUND");
  }
  return updated;
}

export async function sendEmailVerificationEmail(user: {
  id: number;
  email: string;
  name: string;
}): Promise<Date> {
  const { code, expiresAt } = await createEmailVerificationToken(user.id);
  const appUrl = getAppUrl();
  const verifyUrl = `${appUrl}/verify-email?email=${encodeURIComponent(user.email)}`;
  const minutes = Math.round(EMAIL_VERIFICATION_TTL_MS / (1000 * 60));
  const displayName = user.name?.trim() || user.email;
  const subject = "Verificá tu cuenta en Eccomfy";

  const html = `
    <p>Hola ${escapeHtml(displayName)},</p>
    <p>Usá este código para verificar tu cuenta de Eccomfy:</p>
    <p style="font-size:32px;font-weight:700;letter-spacing:6px;margin:24px 0;">${code}</p>
    <p>El código vence en ${minutes} minutos.</p>
    <p>Si preferís, también podés verificar tu email haciendo clic en este enlace:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>Si no creaste una cuenta, podés ignorar este mensaje.</p>
  `;

  const text = `Hola ${displayName},\n\nTu código de verificación es: ${code}.\nVence en ${minutes} minutos.\nIngresá el código en ${verifyUrl} para activar tu cuenta.\n\nSi no creaste una cuenta, ignorá este email.`;

  await sendMail({ to: user.email, subject, html, text });

  return expiresAt;
}

export async function verifyEmailWithCode(email: string, code: string): Promise<SafeUser> {
  const user = findUserByEmail(email);
  if (!user) {
    throw new EmailVerificationError("EMAIL_NOT_FOUND");
  }

  if (user.email_verified_at) {
    throw new EmailVerificationError("EMAIL_ALREADY_VERIFIED");
  }

  const token = getLatestEmailVerificationToken(user.id);
  if (!token) {
    throw new EmailVerificationError("VERIFICATION_CODE_INVALID");
  }

  if (token.consumed_at) {
    throw new EmailVerificationError("VERIFICATION_CODE_INVALID");
  }

  const expiresAt = new Date(token.expires_at);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
    db.prepare("DELETE FROM email_verification_tokens WHERE id = ?").run(token.id);
    throw new EmailVerificationError("VERIFICATION_CODE_INVALID");
  }

  const isMatch = await bcrypt.compare(code, token.code_hash);
  if (!isMatch) {
    throw new EmailVerificationError("VERIFICATION_CODE_INVALID");
  }

  markVerificationTokenConsumed(token.id);
  const updatedUser = markUserEmailVerified(user.id);

  if (!updatedUser.is_staff && !hasAnyStaff()) {
    db.prepare("UPDATE users SET is_staff = 1 WHERE id = ?").run(updatedUser.id);
    updatedUser.is_staff = 1;
  }

  return mapUser(updatedUser);
}

export async function resendEmailVerification(email: string): Promise<Date> {
  const user = findUserByEmail(email);
  if (!user) {
    throw new EmailVerificationError("EMAIL_NOT_FOUND");
  }

  if (user.email_verified_at) {
    throw new EmailVerificationError("EMAIL_ALREADY_VERIFIED");
  }

  return sendEmailVerificationEmail(user);
}

async function createPasswordResetToken(userId: number): Promise<{ token: string; expiresAt: Date }> {
  db.prepare("DELETE FROM password_reset_tokens WHERE user_id = ?").run(userId);

  const token = randomBytes(48).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAtIso = new Date(Date.now() + PASSWORD_RESET_TTL_MS).toISOString();

  db.prepare(
    "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
  ).run(userId, tokenHash, expiresAtIso);

  return { token, expiresAt: new Date(expiresAtIso) };
}

const revokeSessionsForUser = (userId: number): void => {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
};

export async function requestPasswordReset(email: string): Promise<void> {
  const user = findUserByEmail(email);
  if (!user || !user.email_verified_at) {
    return;
  }

  const { token } = await createPasswordResetToken(user.id);
  const appUrl = getAppUrl();
  const resetUrl = `${appUrl}/reset-password/${token}`;
  const minutes = Math.round(PASSWORD_RESET_TTL_MS / (1000 * 60));
  const displayName = user.name?.trim() || user.email;
  const subject = "Restablecé tu contraseña en Eccomfy";

  const html = `
    <p>Hola ${escapeHtml(displayName)},</p>
    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
    <p>Hacé clic en el siguiente botón para crear una nueva contraseña. Este enlace vence en ${minutes} minutos.</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>Si no solicitaste el cambio, ignorá este mensaje.</p>
  `;

  const text = `Hola ${displayName},\n\nUsá este enlace para crear una nueva contraseña (vence en ${minutes} minutos): ${resetUrl}\n\nSi no solicitaste el cambio, podés ignorar este correo.`;

  await sendMail({ to: user.email, subject, html, text });
}

export async function resetPasswordWithToken(token: string, newPassword: string): Promise<SafeUser> {
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const row = db
    .prepare<PasswordResetTokenRow>(
      "SELECT id, user_id, token_hash, expires_at, consumed_at FROM password_reset_tokens WHERE token_hash = ?",
    )
    .get(tokenHash);

  if (!row) {
    throw new PasswordResetError("TOKEN_INVALID");
  }

  if (row.consumed_at) {
    throw new PasswordResetError("TOKEN_INVALID");
  }

  const expiresAt = new Date(row.expires_at);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
    db.prepare("DELETE FROM password_reset_tokens WHERE id = ?").run(row.id);
    throw new PasswordResetError("TOKEN_EXPIRED");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, row.user_id);
  db.prepare("UPDATE password_reset_tokens SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?").run(row.id);
  db.prepare("DELETE FROM password_reset_tokens WHERE user_id = ? AND id != ?").run(row.user_id, row.id);
  revokeSessionsForUser(row.user_id);

  const updated = getUserByIdInternal(row.user_id);
  if (!updated) {
    throw new PasswordResetError("TOKEN_INVALID");
  }

  return mapUser(updated);
}

export function findUserByEmail(email: string): DbUser | undefined {
  const row = db
    .prepare(
      "SELECT id, name, email, password_hash, created_at, is_staff, email_verified_at FROM users WHERE email = ?",
    )
    .get(normalizeEmail(email)) as DbUser | undefined;
  return row;
}

export async function createUser(name: string, email: string, password: string): Promise<SafeUser> {
  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const makeStaff = !hasAnyStaff();
    const insert = db.prepare(
      "INSERT INTO users (name, email, password_hash, is_staff) VALUES (?, ?, ?, ?)",
    );
    const info = insert.run(cleanName, cleanEmail, passwordHash, makeStaff ? 1 : 0);
    const userRow = db
      .prepare(
        "SELECT id, name, email, password_hash, created_at, is_staff, email_verified_at FROM users WHERE id = ?",
      )
      .get(Number(info.lastInsertRowid)) as DbUser | undefined;

    if (!userRow) {
      throw new Error("USER_CREATE_FAILED");
    }

    return mapUser(userRow);
  } catch (error: unknown) {
    if (typeof error === "object" && error && "code" in error) {
      const code = (error as { code?: string }).code;
      if (code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("EMAIL_IN_USE");
      }
    }
    throw error;
  }
}

export async function verifyUser(email: string, password: string): Promise<SafeUser | null> {
  const user = findUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;

  if (!user.email_verified_at) {
    throw new EmailNotVerifiedError();
  }

  let record = user;
  if (!record.is_staff && !hasAnyStaff()) {
    db.prepare("UPDATE users SET is_staff = 1 WHERE id = ?").run(record.id);
    record = { ...record, is_staff: 1 };
  }

  return mapUser(record);
}

export function createSession(userId: number): { token: string; expiresAt: string } {
  const token = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  db.prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)").run(
    userId,
    token,
    expiresAt
  );

  return { token, expiresAt };
}

function mapSessionRow(row: SessionRow | undefined): { user: SafeUser; expiresAt: Date } | null {
  if (!row) return null;

  const expiresAt = new Date(row.session_expires_at);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(row.session_id);
    return null;
  }

  return {
    user: {
      id: row.user_id,
      name: row.user_name,
      email: row.user_email,
      created_at: normalizeTimestamp(row.user_created_at),
      is_staff: Boolean(row.user_is_staff),
      email_verified: Boolean(row.user_email_verified_at),
    },
    expiresAt,
  };
}

export function getSessionByToken(token: string): { user: SafeUser; expiresAt: Date } | null {
  const row = db
    .prepare(`
      SELECT
        s.id as session_id,
        s.token as session_token,
        s.expires_at as session_expires_at,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.created_at as user_created_at,
        u.is_staff as user_is_staff,
        u.email_verified_at as user_email_verified_at
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ?
    `)
    .get(token) as SessionRow | undefined;

  return mapSessionRow(row);
}

export function deleteSession(token: string): void {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  noStore();
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = getSessionByToken(token);
  if (!session) {
    cookies().delete(SESSION_COOKIE);
    return null;
  }

  return session.user;
}

export async function requireUser(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireStaff(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!user.is_staff) {
    redirect("/account");
  }
  return user;
}

export async function signIn(user: SafeUser): Promise<void> {
  const { token, expiresAt } = createSession(user.id);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export function signOut(): void {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    deleteSession(token);
  }
  cookies().delete(SESSION_COOKIE);
}
