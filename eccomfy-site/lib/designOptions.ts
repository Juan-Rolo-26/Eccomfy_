import db from "./db";

export type DesignSize = {
  id: number;
  label: string;
  width_mm: number;
  height_mm: number;
  depth_mm: number;
  base_price: number;
  position: number;
};

export type DesignMaterial = {
  id: number;
  label: string;
  description: string | null;
  price_modifier: number;
  position: number;
};

export type DesignFinish = DesignMaterial;
export type DesignPrintSides = DesignMaterial;
export type DesignProductionSpeed = DesignMaterial;

export type DesignQuantity = {
  id: number;
  label: string;
  quantity: number;
  price_modifier: number;
  position: number;
};

export type DesignOptions = {
  sizes: DesignSize[];
  materials: DesignMaterial[];
  finishes: DesignFinish[];
  printSides: DesignPrintSides[];
  productionSpeeds: DesignProductionSpeed[];
  quantities: DesignQuantity[];
};

function mapRows<T>(rows: T[]): T[] {
  return rows.map((row: T) => row);
}

export function getDesignSizes(): DesignSize[] {
  const rows = db
    .prepare<DesignSize>(
      "SELECT id, label, width_mm, height_mm, depth_mm, base_price, position FROM design_sizes ORDER BY position ASC"
    )
    .all();
  return mapRows(rows);
}

function getGenericOptions(table: string): DesignMaterial[] {
  const rows = db
    .prepare<DesignMaterial>(
      `SELECT id, label, COALESCE(description, '') as description, price_modifier, position FROM ${table} ORDER BY position ASC`
    )
    .all();
  return rows.map((row: DesignMaterial) => ({
    id: row.id,
    label: row.label,
    description: row.description ? row.description : null,
    price_modifier: row.price_modifier,
    position: row.position,
  }));
}

export function getDesignMaterials(): DesignMaterial[] {
  return getGenericOptions("design_materials");
}

export function getDesignFinishes(): DesignFinish[] {
  return getGenericOptions("design_finishes");
}

export function getDesignPrintSides(): DesignPrintSides[] {
  return getGenericOptions("design_print_sides");
}

export function getDesignProductionSpeeds(): DesignProductionSpeed[] {
  return getGenericOptions("design_production_speeds");
}

export function getDesignQuantities(): DesignQuantity[] {
  const rows = db
    .prepare<DesignQuantity>(
      "SELECT id, label, quantity, price_modifier, position FROM design_quantities ORDER BY position ASC"
    )
    .all();
  return mapRows(rows);
}

export function getAllDesignOptions(): DesignOptions {
  return {
    sizes: getDesignSizes(),
    materials: getDesignMaterials(),
    finishes: getDesignFinishes(),
    printSides: getDesignPrintSides(),
    productionSpeeds: getDesignProductionSpeeds(),
    quantities: getDesignQuantities(),
  };
}
