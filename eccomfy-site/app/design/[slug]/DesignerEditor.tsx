"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import type { DesignOptions, DesignSize, DesignMaterial, DesignQuantity } from "@/lib/designOptions";
import type { ProductStyle, ProductConfigurationColor } from "@/lib/content";

const TOOL_ITEMS = [
  { emoji: "⚙️", label: "Configurar & precio" },
  { emoji: "⤴️", label: "Subir artes" },
  { emoji: "🖼️", label: "Imágenes premium" },
  { emoji: "✍️", label: "Texto" },
  { emoji: "⬜", label: "Formas" },
  { emoji: "🎨", label: "Fondo" },
  { emoji: "🔗", label: "Código QR" },
];

const BoxPreview = dynamic(() => import("@/components/editor/BoxPreview"), { ssr: false });

function priceSummary(
  size: DesignSize,
  material: DesignMaterial,
  finish: DesignMaterial,
  printSide: DesignMaterial,
  speed: DesignMaterial,
  quantityModifier: number,
  colorModifier: number,
  orderQuantity: number,
) {
  const base = size.base_price;
  const modifier =
    material.price_modifier *
    finish.price_modifier *
    printSide.price_modifier *
    speed.price_modifier *
    quantityModifier *
    colorModifier;
  const unit = Number((base * modifier).toFixed(2));
  const subtotal = Number((unit * orderQuantity).toFixed(2));
  return { unit, subtotal };
}

type EditorOptions = DesignOptions & {
  colors: Array<ProductConfigurationColor & { id: number; position: number }>;
};

type Props = {
  product: ProductStyle;
};

function buildEditorOptions(product: ProductStyle): EditorOptions {
  const { configuration } = product;

  const sizes: DesignSize[] = configuration.sizes.map((size, index) => ({
    id: index + 1,
    label: size.label,
    width_mm: size.width_mm,
    height_mm: size.height_mm,
    depth_mm: size.depth_mm,
    base_price: size.base_price,
    position: index,
  }));

  const mapMaterials = (items: typeof configuration.materials): DesignMaterial[] =>
    items.map((item, index) => ({
      id: index + 1,
      label: item.label,
      description: item.description ?? null,
      price_modifier: item.price_modifier,
      position: index,
    }));

  const mapGeneric = mapMaterials;

  const quantities: DesignQuantity[] = configuration.quantities.map((quantity, index) => ({
    id: index + 1,
    label: quantity.label,
    quantity: quantity.quantity,
    price_modifier: quantity.price_modifier,
    position: index,
  }));

  const colors = configuration.colors.map((color, index) => ({
    ...color,
    id: index + 1,
    position: index,
  }));

  return {
    sizes,
    materials: mapMaterials(configuration.materials),
    finishes: mapGeneric(configuration.finishes),
    printSides: mapGeneric(configuration.printSides),
    productionSpeeds: mapGeneric(configuration.productionSpeeds),
    quantities,
    colors,
  };
}

export default function DesignerEditor({ product }: Props) {
  const options = useMemo(() => buildEditorOptions(product), [product]);

  const hasAllOptions =
    options.sizes.length > 0 &&
    options.materials.length > 0 &&
    options.finishes.length > 0 &&
    options.printSides.length > 0 &&
    options.productionSpeeds.length > 0 &&
    options.quantities.length > 0;

  if (!hasAllOptions) {
    return (
      <div className="container-xl py-16">
        <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-10 text-white">
          <h1 className="text-3xl font-semibold">Faltan opciones de diseño</h1>
          <p className="mt-3 text-white/70">
            Aún no hay medidas ni parámetros configurados para este producto. Contactá a tu equipo de Eccomfy para cargarlos y habilitar el editor.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    );
  }

  const [sizeId, setSizeId] = useState(options.sizes[0]?.id ?? 0);
  const [materialId, setMaterialId] = useState(options.materials[0]?.id ?? 0);
  const [finishId, setFinishId] = useState(options.finishes[0]?.id ?? 0);
  const [printId, setPrintId] = useState(options.printSides[0]?.id ?? 0);
  const [speedId, setSpeedId] = useState(options.productionSpeeds[0]?.id ?? 0);
  const [quantityId, setQuantityId] = useState(options.quantities[0]?.id ?? 0);
  const [colorId, setColorId] = useState(options.colors[0]?.id ?? 0);
  const [orderQuantity, setOrderQuantity] = useState(() => {
    const firstStock = options.quantities[0]?.quantity ?? 0;
    if (firstStock <= 0) return 0;
    return 1;
  });
  const [activeTool, setActiveTool] = useState(TOOL_ITEMS[0]?.label ?? "");
  const [viewMode, setViewMode] = useState<"flat" | "3d">("flat");
  const [hasInteriorPrint, setHasInteriorPrint] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [showCanvasMenu, setShowCanvasMenu] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selected = useMemo(() => {
    const size = options.sizes.find((item) => item.id === sizeId) ?? options.sizes[0];
    const material = options.materials.find((item) => item.id === materialId) ?? options.materials[0];
    const finish = options.finishes.find((item) => item.id === finishId) ?? options.finishes[0];
    const printSide = options.printSides.find((item) => item.id === printId) ?? options.printSides[0];
    const speed = options.productionSpeeds.find((item) => item.id === speedId) ?? options.productionSpeeds[0];
    const quantity = options.quantities.find((item) => item.id === quantityId) ?? options.quantities[0];
    const color = options.colors.find((item) => item.id === colorId) ?? options.colors[0] ?? null;
    return { size, material, finish, printSide, speed, quantity, color };
  }, [sizeId, materialId, finishId, printId, speedId, quantityId, colorId, options]);

  const { unit, subtotal } = useMemo(
    () =>
      priceSummary(
        selected.size,
        selected.material,
        selected.finish,
        selected.printSide,
        selected.speed,
        selected.quantity?.price_modifier ?? 1,
        selected.color?.price_modifier ?? 1,
        orderQuantity,
      ),
    [selected, orderQuantity],
  );

  useEffect(() => {
    const maxStock = selected.quantity?.quantity ?? 0;
    if (maxStock <= 0) {
      setOrderQuantity(0);
      return;
    }
    setOrderQuantity((prev) => {
      if (!Number.isFinite(prev) || prev <= 0) {
        return 1;
      }
      if (prev > maxStock) {
        return maxStock;
      }
      return prev;
    });
  }, [selected.quantity?.id, selected.quantity?.quantity]);

  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const maxStock = selected.quantity?.quantity ?? 0;
  const stockExhausted = maxStock <= 0;

  function handleQuantityInput(rawValue: string) {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
      setOrderQuantity(0);
      return;
    }
    const normalized = Math.max(0, Math.floor(parsed));
    if (maxStock > 0) {
      setOrderQuantity(Math.min(normalized, maxStock));
    } else {
      setOrderQuantity(normalized);
    }
  }

  function cycleView(mode: "flat" | "3d") {
    setViewMode(mode);
    setFeedback(mode === "flat" ? "Vista plana activada." : "Vista 3D activada.");
  }

  function toggleInteriorPrint() {
    setHasInteriorPrint((prev) => {
      const next = !prev;
      setFeedback(next ? "Impresión interior añadida." : "Impresión interior desactivada.");
      return next;
    });
  }

  function rotateCanvas(direction: "left" | "right") {
    setRotation((prev) => {
      const delta = direction === "right" ? 15 : -15;
      const next = (prev + delta + 360) % 360;
      setFeedback(`Rotación ajustada a ${next}°.`);
      return next;
    });
  }

  function resetZoom() {
    handleZoomChange(100, "Zoom restablecido al 100%.");
  }

  function handleDownload() {
    setFeedback("Preparamos tu dieline y te avisaremos por mail.");
  }

  function handleShare() {
    setFeedback("Generamos un enlace compartible de tu diseño.");
  }

  function toggleCanvasMenu() {
    setShowCanvasMenu((prev) => !prev);
  }

  function handleRotationChange(value: number) {
    setRotation(value);
  }

  function handleZoomChange(value: number, customMessage?: string) {
    const normalized = Math.max(40, Math.min(220, Math.round(value)));
    if (normalized === zoom) {
      if (customMessage) {
        setFeedback(customMessage);
      }
      return;
    }
    setZoom(normalized);
    setFeedback(customMessage ?? `Zoom ajustado a ${normalized}%.`);
  }

  useEffect(() => {
    if (options.colors.length === 0) {
      setColorId(0);
      return;
    }
    const exists = options.colors.some((item) => item.id === colorId);
    if (!exists) {
      setColorId(options.colors[0]?.id ?? 0);
    }
  }, [colorId, options.colors]);

  return (
    <div className="min-h-screen bg-[#f5f6ff] text-brand-navy">
      <header className="sticky top-0 z-30 flex flex-wrap items-center gap-4 border-b border-[#dfe3fc] bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-navy font-semibold">
            3D
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-blue">Editor Eccomfy</p>
            <p className="text-sm font-semibold">{product.title}</p>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3 text-sm">
          <button
            onClick={handleDownload}
            className="rounded-full border border-[#dfe3fc] px-4 py-2 text-brand-blue transition hover:bg-brand-blue/10"
          >
            Descargar dieline
          </button>
          <button
            onClick={handleShare}
            className="rounded-full border border-[#dfe3fc] px-4 py-2 text-brand-blue transition hover:bg-brand-blue/10"
          >
            Compartir
          </button>
          <span className="rounded-full bg-brand-yellow/30 px-3 py-1 text-xs font-semibold text-brand-navy">
            Guardado automático
          </span>
        </div>
        {feedback ? (
          <div className="basis-full text-sm text-brand-blue/80">
            {feedback}
          </div>
        ) : null}
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-56 border-r border-[#dfe3fc] bg-white pb-10 pt-6 lg:flex lg:flex-col">
          {TOOL_ITEMS.map((tool) => (
            <button
              key={tool.label}
              onClick={() => {
                setActiveTool(tool.label);
                setFeedback(`Herramienta "${tool.label}" seleccionada.`);
              }}
              className={`flex w-full items-center gap-3 px-6 py-3 text-left text-sm font-medium transition hover:bg-brand-blue/10 ${
                tool.label === activeTool
                  ? "border-l-4 border-brand-yellow bg-brand-yellow/10 text-brand-navy"
                  : "text-brand-blue"
              }`}
            >
              <span className="text-lg">{tool.emoji}</span>
              <span>{tool.label}</span>
            </button>
          ))}
        </aside>

        <main className="flex-1 overflow-auto px-4 py-6 lg:px-10">
          <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-brand-blue">
            <span>Herramienta activa: {activeTool}</span>
            <span>Vista {viewMode === "flat" ? "Plano" : "3D"}</span>
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <section className="flex-1 space-y-6">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">
                <span>Outside</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => cycleView("flat")}
                    className={`rounded-full border border-brand-blue/30 px-3 py-1 transition ${
                      viewMode === "flat" ? "bg-brand-blue/10 text-brand-navy" : "text-brand-blue hover:bg-brand-blue/10"
                    }`}
                  >
                    Plano
                  </button>
                  <button
                    onClick={() => cycleView("3d")}
                    className={`rounded-full border border-brand-blue/30 px-3 py-1 transition ${
                      viewMode === "3d" ? "bg-brand-blue/10 text-brand-navy" : "text-brand-blue hover:bg-brand-blue/10"
                    }`}
                  >
                    3D
                  </button>
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-[#e5e7ff] bg-white p-8 shadow-inner">
                <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                  <div className="flex-1">
                    <div className="relative h-[440px] w-full">
                      <BoxPreview
                        style={product.slug}
                        viewMode={viewMode}
                        rotation={rotation}
                        zoom={zoom}
                        onRotationChange={handleRotationChange}
                        onZoomChange={(value) => handleZoomChange(value)}
                        hasInteriorPrint={hasInteriorPrint}
                      />
                      <div className="pointer-events-none absolute left-6 top-6 rounded-full border border-white/50 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/80">
                        Arrastrá tus artes aquí
                      </div>
                      <div className="pointer-events-none absolute left-6 bottom-6 rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-xs text-brand-blue/70">
                        Simplificá la carga de frente, laterales y tapa para verlos al instante en 3D.
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-full border border-[#dfe3fc] bg-white px-4 py-2 text-xs text-brand-blue">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={toggleInteriorPrint}
                          className={`rounded-full border border-[#dfe3fc] px-3 py-1 transition ${
                            hasInteriorPrint ? "bg-brand-blue/10 text-brand-navy" : "hover:bg-brand-blue/10"
                          }`}
                        >
                          {hasInteriorPrint ? "⬛ Quitar impresión interior" : "⬛ Añadir impresión interior"}
                        </button>
                        <button
                          onClick={() => rotateCanvas("right")}
                          className="rounded-full border border-[#dfe3fc] px-3 py-1 transition hover:bg-brand-blue/10"
                        >
                          ↻
                        </button>
                        <button
                          onClick={() => rotateCanvas("left")}
                          className="rounded-full border border-[#dfe3fc] px-3 py-1 transition hover:bg-brand-blue/10"
                        >
                          ↺
                        </button>
                        <button
                          onClick={resetZoom}
                          className="rounded-full border border-[#dfe3fc] px-3 py-1 transition hover:bg-brand-blue/10"
                        >
                          {zoom}%
                        </button>
                      </div>
                      <div className="relative">
                        <button
                          onClick={toggleCanvasMenu}
                          className="rounded-full border border-[#dfe3fc] px-3 py-1 transition hover:bg-brand-blue/10"
                        >
                          ⋮
                        </button>
                        {showCanvasMenu ? (
                          <div className="absolute right-0 top-10 z-10 w-44 rounded-xl border border-[#dfe3fc] bg-white p-3 text-left shadow-lg">
                            <button
                              onClick={() => {
                                setShowCanvasMenu(false);
                                setFeedback("Duplicamos tu diseño en una nueva variación.");
                              }}
                              className="w-full rounded-lg px-2 py-1 text-left text-sm text-brand-blue transition hover:bg-brand-blue/10"
                            >
                              Duplicar diseño
                            </button>
                            <button
                              onClick={() => {
                                setShowCanvasMenu(false);
                                setRotation(0);
                                resetZoom();
                                setFeedback("Vista restablecida a valores por defecto.");
                              }}
                              className="mt-2 w-full rounded-lg px-2 py-1 text-left text-sm text-brand-blue transition hover:bg-brand-blue/10"
                            >
                              Restablecer vista
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full max-w-[280px] flex-col gap-4 rounded-[2rem] border border-[#dfe3fc] bg-[#f7f8ff] p-4 shadow">
                    <div className="space-y-3 text-sm text-brand-blue">
                      <p>
                        <span className="font-semibold text-brand-navy">Tamaño:</span> {selected.size.label}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-navy">Material:</span> {selected.material.label}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-navy">Acabado:</span> {selected.finish.label}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-navy">Impresión:</span> {selected.printSide.label}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-navy">Stock:</span> {selected.quantity?.quantity ?? 0} u.
                      </p>
                      {selected.color ? (
                        <p>
                          <span className="font-semibold text-brand-navy">Color base:</span> {selected.color.label}
                        </p>
                      ) : null}
                      <p>
                        <span className="font-semibold text-brand-navy">Pedido:</span> {orderQuantity} u.
                      </p>
                      <p>
                        <span className="font-semibold text-brand-navy">Producción:</span> {selected.speed.label}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/60 bg-white p-4 text-sm">
                      <p className="text-brand-blue">Precio unitario</p>
                      <p className="text-3xl font-semibold text-brand-navy">${unit.toFixed(2)}</p>
                      <p className="mt-2 text-xs text-brand-blue/70">Subtotal estimado ${subtotal.toFixed(2)}</p>
                      <p className="mt-2 text-xs text-brand-blue/60">
                        Rotación: {rotation}° • Vista: {viewMode === "flat" ? "Plano" : "3D"}
                      </p>
                      {hasInteriorPrint ? (
                        <p className="mt-1 text-xs text-brand-blue/60">Incluye impresión interior.</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="w-full max-w-[360px] space-y-6 rounded-[2.5rem] border border-[#dfe3fc] bg-white p-6 shadow-lg">
              <div>
                <h2 className="text-lg font-semibold text-brand-navy">Configurar & precio</h2>
                <p className="text-xs text-brand-blue/70">
                  Ajustá los parámetros definidos por Eccomfy para este estilo. Los precios se actualizan automáticamente.
                </p>
              </div>

              <div className="space-y-5 text-sm text-brand-navy">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">Tamaño</label>
                  <select
                    value={sizeId}
                    onChange={(event) => setSizeId(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-[#dfe3fc] bg-[#f6f7ff] px-3 py-2 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  >
                    {options.sizes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label} • {item.width_mm}×{item.height_mm}×{item.depth_mm} mm
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">Material</label>
                  <select
                    value={materialId}
                    onChange={(event) => setMaterialId(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-[#dfe3fc] bg-[#f6f7ff] px-3 py-2 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  >
                    {options.materials.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {selected.material.description ? (
                    <p className="mt-1 text-xs text-brand-blue/70">{selected.material.description}</p>
                  ) : null}
                </div>

                {options.colors.length > 0 ? (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">Color base</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {options.colors.map((color) => {
                        const isActive = color.id === colorId;
                        return (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => setColorId(color.id)}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                              isActive
                                ? "border-brand-blue bg-brand-blue/10 text-brand-navy"
                                : "border-[#dfe3fc] bg-white text-brand-blue hover:bg-brand-blue/10"
                            }`}
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-black/10"
                              style={{ backgroundColor: color.hex ?? "#f8fafc" }}
                              aria-hidden
                            />
                            {color.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">Acabado</label>
                  <select
                    value={finishId}
                    onChange={(event) => setFinishId(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-[#dfe3fc] bg-[#f6f7ff] px-3 py-2 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  >
                    {options.finishes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {selected.finish.description ? (
                    <p className="mt-1 text-xs text-brand-blue/70">{selected.finish.description}</p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">Caras impresas</label>
                  <select
                    value={printId}
                    onChange={(event) => setPrintId(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-[#dfe3fc] bg-[#f6f7ff] px-3 py-2 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  >
                    {options.printSides.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {selected.printSide.description ? (
                    <p className="mt-1 text-xs text-brand-blue/70">{selected.printSide.description}</p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">Stock</label>
                  <select
                    value={quantityId}
                    onChange={(event) => setQuantityId(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-[#dfe3fc] bg-[#f6f7ff] px-3 py-2 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  >
                    {options.quantities.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label} — {item.quantity} u. disponibles
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-brand-blue/70">Pedí hasta {maxStock} unidades.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">Cantidad solicitada</label>
                  <input
                    type="number"
                    min={stockExhausted ? 0 : 1}
                    max={maxStock || undefined}
                    value={orderQuantity}
                    onChange={(event) => handleQuantityInput(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#dfe3fc] bg-[#f6f7ff] px-3 py-2 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                  {stockExhausted ? (
                    <p className="mt-1 text-xs font-semibold text-red-500">No hay stock disponible para este modelo.</p>
                  ) : orderQuantity === maxStock ? (
                    <p className="mt-1 text-xs text-brand-blue/70">Alcanzaste el límite disponible.</p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">Producción</label>
                  <select
                    value={speedId}
                    onChange={(event) => setSpeedId(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-[#dfe3fc] bg-[#f6f7ff] px-3 py-2 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  >
                    {options.productionSpeeds.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {selected.speed.description ? (
                    <p className="mt-1 text-xs text-brand-blue/70">{selected.speed.description}</p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-[#dfe3fc] bg-[#f6f7ff] p-4 text-xs text-brand-blue/70">
                Guardamos tus cambios automáticamente. Cuando estés listo, podés descargar la dieline o compartir el enlace con tu equipo.
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
