import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { logoutAction } from "./actions";

function formatCreatedAt(value: string): string {
  const normalized = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function AccountPage() {
  const user = await requireUser();
  const createdAtLabel = formatCreatedAt(user.created_at);
  const isStaff = user.is_staff;

  return (
    <div className="container-xl py-20">
      <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-10 shadow-card backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Cuenta</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">Hola, {user.name.split(" ")[0] || user.name}</h1>
              <p className="mt-3 text-white/75">
                Gestión de pedidos, diseños guardados y acceso a nuestro equipo de soporte.
              </p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Cerrar sesión
              </button>
            </form>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-white/70">Email</p>
              <p className="mt-1 text-lg font-semibold text-white">{user.email}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-white/70">Miembro desde</p>
              <p className="mt-1 text-lg font-semibold text-white">{createdAtLabel}</p>
            </div>
          </div>

          {isStaff ? (
            <div className="mt-10 rounded-3xl border border-brand-yellow/30 bg-brand-yellow/10 p-8 text-white">
              <h2 className="text-2xl font-semibold">Accesos rápidos de staff</h2>
              <p className="mt-2 text-white/80">
                Gestioná el contenido público y mantené la landing actualizada en pocos segundos.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin/content"
                  className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-5 py-3 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-navy/10 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Abrir panel de contenidos
                </Link>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Administrar usuarios
                </Link>
                <Link
                  href="/admin/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Crear producto
                </Link>
                <Link
                  href="/design"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Ir al configurador 3D
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-brand-yellow/30 bg-brand-yellow/10 p-8 text-white">
              <h2 className="text-2xl font-semibold">Próximos pasos sugeridos</h2>
              <p className="mt-2 text-white/80">
                Comenzá un nuevo diseño o revisá las opciones de materiales recomendadas para tu próximo lanzamiento.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/design"
                  className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-5 py-3 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-navy/10 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Diseñar un mailer
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Ver catálogo completo
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-white/15 bg-white text-brand-navy p-8 shadow-card">
            <h2 className="text-xl font-semibold">Soporte prioritario</h2>
            <p className="mt-2 text-sm text-brand-navy/70">
              Escribí a nuestro equipo o coordiná un onboarding express para tus diseños de packaging.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href="mailto:contacto@eccomfy.com" className="block font-semibold text-brand-navy">
                contacto@eccomfy.com
              </a>
              <a href="https://wa.me/5490000000000" target="_blank" className="block font-semibold text-brand-blue">
                WhatsApp directo →
              </a>
            </div>
          </div>

          {isStaff ? (
            <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-8 text-white">
              <h2 className="text-xl font-semibold">Operaciones rápidas</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>
                  <Link href="/admin/content" className="font-semibold text-brand-yellow hover:underline">
                    Administrar contenidos de la landing
                  </Link>
                </li>
                <li>
                  <Link href="/admin/products" className="font-semibold text-brand-yellow hover:underline">
                    Crear nuevos productos
                  </Link>
                </li>
                <li>
                  <Link href="/admin/users" className="font-semibold text-brand-yellow hover:underline">
                    Gestionar permisos de usuarios
                  </Link>
                </li>
                <li>
                  <Link href="/design" className="font-semibold text-brand-yellow hover:underline">
                    Probar el configurador como cliente
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="font-semibold text-brand-yellow hover:underline">
                    Coordinar con el equipo comercial
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-8 text-white">
              <h2 className="text-xl font-semibold">¿Buscás algo puntual?</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>
                  <Link href="/design" className="font-semibold text-brand-yellow hover:underline">
                    Crear un nuevo diseño desde cero
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="font-semibold text-brand-yellow hover:underline">
                    Revisar materiales y acabados disponibles
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="font-semibold text-brand-yellow hover:underline">
                    Hablar con un especialista en packaging
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
