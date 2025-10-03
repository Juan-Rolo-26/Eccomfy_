import Link from "next/link";

import { requireStaff } from "@/lib/auth";
import {
  getDesignSizes,
  getDesignMaterials,
  getDesignFinishes,
  getDesignPrintSides,
  getDesignProductionSpeeds,
  getDesignQuantities,
} from "@/lib/designOptions";
import {
  SizeForm,
  MaterialForm,
  FinishForm,
  PrintSideForm,
  SpeedForm,
  QuantityForm,
} from "./DesignOptionForms";

export default async function DesignOptionsPage() {
  const user = await requireStaff();
  const [sizes, materials, finishes, printSides, speeds, quantities] = await Promise.all([
    getDesignSizes(),
    getDesignMaterials(),
    getDesignFinishes(),
    getDesignPrintSides(),
    getDesignProductionSpeeds(),
    getDesignQuantities(),
  ]);

  return (
    <div className="container-xl py-16 space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Opciones de diseño 3D</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Hola, {user.name.split(" ")[0] || user.name}</h1>
          <p className="mt-2 max-w-3xl text-white/70">
            Configurá tamaños, materiales y parámetros disponibles para el editor de cajas. Solo los datos que cargues acá podrán seleccionar los usuarios al diseñar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/content"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Contenidos
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Usuarios
          </Link>
          <Link
            href="/design/mailer"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ver editor
          </Link>
        </div>
      </div>

      <SizeForm sizes={sizes} />

      <MaterialForm
        title="Materiales"
        subtitle="Define cartulinas, corrugados y sus multiplicadores de precio."
        items={materials}
      />

      <FinishForm
        title="Acabados"
        subtitle="Agrega laminados, barnices y terminaciones especiales."
        items={finishes}
      />

      <PrintSideForm
        title="Caras impresas"
        subtitle="Controla si ofrecemos impresión exterior, interior o ambas."
        items={printSides}
      />

      <SpeedForm
        title="Velocidades de producción"
        subtitle="Define plazos estándar y express con su impacto en precio."
        items={speeds}
      />

      <QuantityForm quantities={quantities} />
    </div>
  );
}
