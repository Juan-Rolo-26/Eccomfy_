import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import db, { DbUser } from "./db";

const SESSION_COOKIE = "eccomfy_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

export type SafeUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_staff: boolean;
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
});

const hasAnyStaff = (): boolean => {
  const result = db
    .prepare<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE is_staff = 1")
    .get();
  return (result?.count ?? 0) > 0;
};

export function findUserByEmail(email: string): DbUser | undefined {
  const row = db
    .prepare(
      "SELECT id, name, email, password_hash, created_at, is_staff FROM users WHERE email = ?",
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
        "SELECT id, name, email, password_hash, created_at, is_staff FROM users WHERE id = ?",
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
        u.is_staff as user_is_staff
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
