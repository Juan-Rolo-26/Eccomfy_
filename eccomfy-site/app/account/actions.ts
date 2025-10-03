"use server";

import { redirect } from "next/navigation";

import { signOut } from "@/lib/auth";

export async function logoutAction(): Promise<void> {
  signOut();
  redirect("/login");
}
