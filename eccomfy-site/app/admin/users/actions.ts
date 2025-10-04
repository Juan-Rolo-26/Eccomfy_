"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/auth";
import { deleteUserById, getStaffCount, getUserById, setUserStaff } from "@/lib/users";

export type ManageUserState = {
  error?: string;
  success?: string;
};

const INITIAL_ERROR = "Ocurrió un error. Intentá nuevamente.";

function parseId(value: FormDataEntryValue | null): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.floor(parsed);
}

export async function updateStaffStatusAction(
  _prevState: ManageUserState,
  formData: FormData,
): Promise<ManageUserState> {
  await requireStaff();

  const id = parseId(formData.get("id"));
  const makeStaff = String(formData.get("makeStaff")) === "true";

  if (!id) {
    return { error: INITIAL_ERROR };
  }

  const user = getUserById(id);
  if (!user) {
    return { error: "El usuario no existe." };
  }

  if (!makeStaff && user.is_staff) {
    const staffCount = getStaffCount();
    if (staffCount <= 1) {
      return { error: "No podés quitar el último usuario staff." };
    }
  }

  setUserStaff(id, makeStaff);
  revalidatePath("/admin/users");
  revalidatePath("/account");
  revalidatePath("/admin/content");

  return {
    success: makeStaff ? "Usuario actualizado como staff." : "Permiso de staff removido.",
  };
}

export async function deleteUserAction(
  _prevState: ManageUserState,
  formData: FormData,
): Promise<ManageUserState> {
  const currentUser = await requireStaff();

  const id = parseId(formData.get("id"));
  if (!id) {
    return { error: INITIAL_ERROR };
  }

  if (id === currentUser.id) {
    return { error: "No podés eliminar tu propia cuenta." };
  }

  const user = getUserById(id);
  if (!user) {
    return { error: "El usuario no existe." };
  }

  if (user.is_staff) {
    const staffCount = getStaffCount();
    if (staffCount <= 1) {
      return { error: "No podés eliminar al último usuario staff." };
    }
  }

  deleteUserById(id);
  revalidatePath("/admin/users");
  revalidatePath("/account");
  revalidatePath("/admin/content");

  return {
    success: "Usuario eliminado correctamente.",
  };
}
