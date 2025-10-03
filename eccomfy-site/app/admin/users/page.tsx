import Link from "next/link";

import { requireStaff } from "@/lib/auth";
import { getAllUsers, getStaffCount } from "@/lib/users";
import UserRow from "./UserRow";

export default async function UsersAdminPage() {
  const user = await requireStaff();
  const [users, staffCount] = await Promise.all([getAllUsers(), getStaffCount()]);

  return (
    <div className="container-xl py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Gestión de usuarios</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Hola, {user.name.split(" ")[0] || user.name}</h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Administrá los permisos de staff. El primer usuario registrado se convierte automáticamente en staff, y siempre debe quedar al menos un staff activo.
          </p>
        </div>
        <Link
          href="/admin/content"
          className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Volver al panel de contenidos
        </Link>
      </div>

      <div className="mt-10 rounded-[2.5rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Usuarios registrados</h2>
            <p className="text-sm text-white/70">Staff activos: {staffCount}</p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            Crear nueva cuenta
          </Link>
        </div>
        <ul className="mt-6 space-y-4">
          {users.length === 0 ? (
            <li className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/60">
              Todavía no hay usuarios registrados.
            </li>
          ) : (
            users.map((entry) => (
              <UserRow key={entry.id} user={entry} isLastStaff={entry.is_staff && staffCount <= 1} />
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
