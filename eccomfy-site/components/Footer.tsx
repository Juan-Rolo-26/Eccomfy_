import Link from "next/link";

export default function Footer() {
  return (
    // 👇 Footer en blanco para contraste sobre fondo azul
    <footer className="mt-24 border-t border-brand-blue/20 bg-white">
      <div className="container-xl py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-semibold text-slate-900">Eccomfy</p>
          <p className="text-slate-600 mt-1">Packaging a tu medida con vista 3D y precios al instante.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-slate-900">Productos</p>
            <ul className="mt-2 space-y-1 text-slate-600">
              <li><Link href="/products" className="hover:text-brand-blue">Mailer</Link></li>
              <li><Link href="/products" className="hover:text-brand-blue">Shipping Box</Link></li>
              <li><Link href="/products" className="hover:text-brand-blue">Product Box</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Compañía</p>
            <ul className="mt-2 space-y-1 text-slate-600">
              <li><Link href="/about" className="hover:text-brand-blue">Nosotros</Link></li>
              <li><Link href="/contact" className="hover:text-brand-blue">Contacto</Link></li>
              <li><Link href="/account" className="hover:text-brand-blue">Cuenta</Link></li>
            </ul>
          </div>
        </div>
        <div className="md:text-right text-slate-600">
          &copy; {new Date().getFullYear()} Eccomfy.
        </div>
      </div>
    </footer>
  );
}
