import db from "./db";

export type UserSummary = {
  id: number;
  name: string;
  email: string;
  is_staff: boolean;
  created_at: string;
  email_verified: boolean;
};

const mapRow = (row: {
  id: number;
  name: string;
  email: string;
  is_staff: number;
  created_at: string;
  email_verified_at: string | null;
}): UserSummary => ({
  id: row.id,
  name: row.name,
  email: row.email,
  is_staff: Boolean(row.is_staff),
  created_at: row.created_at,
  email_verified: Boolean(row.email_verified_at),
});

export function getAllUsers(): UserSummary[] {
  const rows = db
    .prepare<{
      id: number;
      name: string;
      email: string;
      is_staff: number;
      created_at: string;
    }>(
      "SELECT id, name, email, is_staff, created_at, email_verified_at FROM users ORDER BY created_at DESC",
    )
    .all();
  return rows.map(mapRow);
}

export function getUserById(id: number): UserSummary | undefined {
  const row = db
    .prepare<{
      id: number;
      name: string;
      email: string;
      is_staff: number;
      created_at: string;
      email_verified_at: string | null;
    }>("SELECT id, name, email, is_staff, created_at, email_verified_at FROM users WHERE id = ?")
    .get(id);
  return row ? mapRow(row) : undefined;
}

export function setUserStaff(id: number, isStaff: boolean): void {
  db.prepare("UPDATE users SET is_staff = ? WHERE id = ?").run(isStaff ? 1 : 0, id);
}

export function getStaffCount(): number {
  const row = db.prepare<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE is_staff = 1").get();
  return row?.count ?? 0;
}

export function deleteUserById(id: number): void {
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
}

export function markUserEmailVerified(id: number): void {
  db.prepare("UPDATE users SET email_verified_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
}
