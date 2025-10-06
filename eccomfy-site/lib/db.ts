import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "eccomfy.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_staff INTEGER NOT NULL DEFAULT 0,
    email_verified_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    consumed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    consumed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    sizes_json TEXT NOT NULL,
    materials_json TEXT NOT NULL,
    finishes_json TEXT NOT NULL,
    print_sides_json TEXT NOT NULL,
    production_speeds_json TEXT NOT NULL,
    quantities_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    highlight INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    position INTEGER NOT NULL DEFAULT 0
  );

  -- legacy tables kept for backward compatibility are not recreated here
`);

try {
  db.prepare("ALTER TABLE users ADD COLUMN is_staff INTEGER NOT NULL DEFAULT 0").run();
} catch (error) {
  if (
    !(
      error instanceof Error &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("duplicate column name")
    )
  ) {
    throw error;
  }
}

try {
  db.prepare("ALTER TABLE users ADD COLUMN email_verified_at TEXT").run();
  db.prepare(
    "UPDATE users SET email_verified_at = COALESCE(email_verified_at, created_at)",
  ).run();
} catch (error) {
  if (
    !(
      error instanceof Error &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("duplicate column name")
    )
  ) {
    throw error;
  }
}

export type DbUser = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_staff: number;
  email_verified_at: string | null;
  created_at: string;
};

export default db;
