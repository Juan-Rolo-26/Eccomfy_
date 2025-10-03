"use client";

import { useFormState, useFormStatus } from "react-dom";

import type { UserSummary } from "@/lib/users";
import { type ManageUserState, updateStaffStatusAction } from "./actions";

const INITIAL_STATE: ManageUserState = {};

function ActionButtons({ isStaff, disableDemote }: { isStaff: boolean; disableDemote: boolean }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="submit"
        name="makeStaff"
        value="true"
        className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending || isStaff}
      >
        Marcar como staff
      </button>
      <button
        type="submit"
        name="makeStaff"
        value="false"
        className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending || !isStaff || disableDemote}
      >
        Quitar staff
      </button>
    </div>
  );
}

export default function UserRow({ user, isLastStaff }: { user: UserSummary; isLastStaff: boolean }) {
  const [state, action] = useFormState(updateStaffStatusAction, INITIAL_STATE);

  return (
    <li className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/80">
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={user.id} />
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">{user.name || user.email}</p>
            <p className="text-xs text-white/60">{user.email}</p>
            <p className="text-xs text-white/50">
              Rol actual: {user.is_staff ? "Staff" : "Cliente"}
              {user.is_staff && isLastStaff ? " (último staff)" : ""}
            </p>
            <p className="text-xs text-white/50">
              Estado de email: {user.email_verified ? "Verificado" : "Pendiente"}
            </p>
          </div>
          <ActionButtons isStaff={user.is_staff} disableDemote={isLastStaff} />
        </div>
        {state.error ? (
          <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
            {state.success}
          </p>
        ) : null}
      </form>
    </li>
  );
}
