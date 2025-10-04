"use client";

import type { FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";

import type { UserSummary } from "@/lib/users";
import { type ManageUserState, deleteUserAction, updateStaffStatusAction } from "./actions";

const INITIAL_STATE: ManageUserState = {};

function DeleteButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded-full border border-red-400/60 px-3 py-1 text-xs font-semibold text-red-100 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending || disabled}
    >
      {pending ? "Eliminando..." : "Eliminar usuario"}
    </button>
  );
}

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
  const [statusState, statusAction] = useFormState(updateStaffStatusAction, INITIAL_STATE);
  const [deleteState, deleteAction] = useFormState(deleteUserAction, INITIAL_STATE);

  const handleDeleteSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (
      !window.confirm(
        `¿Eliminar la cuenta de ${user.name || user.email}? Esta acción no se puede deshacer.`,
      )
    ) {
      event.preventDefault();
    }
  };

  const message = deleteState.error || statusState.error || deleteState.success || statusState.success;
  const isError = Boolean(deleteState.error || statusState.error);

  return (
    <li className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/80">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <form action={statusAction} className="flex justify-end">
            <input type="hidden" name="id" value={user.id} />
            <ActionButtons isStaff={user.is_staff} disableDemote={isLastStaff} />
          </form>
          <form action={deleteAction} onSubmit={handleDeleteSubmit} className="flex justify-end">
            <input type="hidden" name="id" value={user.id} />
            <DeleteButton disabled={isLastStaff} />
          </form>
        </div>
      </div>
      {message ? (
        <p
          className={`mt-3 rounded-xl border px-3 py-2 text-xs ${
            isError
              ? "border-red-400/40 bg-red-500/10 text-red-100"
              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
          }`}
        >
          {message}
        </p>
      ) : null}
    </li>
  );
}
