# Eccomfy — Packaging personalizado (Next.js + Tailwind)

Inspirado en el flujo de Packlane: catálogo → configuración → precio al instante → checkout.
Este repo trae **home**, **listado de productos** y una **pantalla inicial de diseño** (placeholder con cálculo simulado).

## Arranque
```bash
npm install
npm run dev
# abre http://localhost:3000
```

## Estructura
- `app/page.tsx` — Home (hero, estilos, banda de valor)
- `app/products/page.tsx` — Listado de estilos
- `app/design/[style]/page.tsx` — Placeholder del diseñador (parámetros + precio simulado)
- `components/*` — Header, Footer, Cards
- `public/*` — logos y SVGs de cajas

## Próximos pasos
- Integrar **editor 3D** (react-three-fiber) + **edición 2D** por cara.
- Backend de precios (Django/DRF o una API Next) y **autenticación**.
- Exportar **dieline PDF**.
