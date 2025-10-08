"use client";
import Link from "next/link";
import type { Route } from "next";
import Logo from "./Logo";
import { usePathname } from "next/navigation";

const LinkItem = ({ href, children }: { href: Route; children: React.ReactNode }) => {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? "text-brand-yellow" : "text-white/80 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
};

type HeaderProps = {
  user?: {
    name: string;
    is_staff: boolean;
  } | null;
};

export default function Header({ user }: HeaderProps) {
  const navLinks: Array<{ href: Route; label: string }> = user?.is_staff
    ? [
        { href: "/products", label: "Productos" },
        { href: "/design", label: "Diseñar" },
        { href: "/admin/products", label: "Crear producto" },
        { href: "/admin/users", label: "Usuarios" },
        { href: "/admin/content", label: "Contenido" },
        { href: "/account", label: "Mi cuenta" },
      ]
    : [
        { href: "/products", label: "Productos" },
        { href: "/design", label: "Diseñar" },
        {
          href: (user ? "/account" : "/login") as Route,
          label: user ? "Mi cuenta" : "Ingresar",
        },
      ];

  const ctaHref: Route = user ? (user.is_staff ? "/admin/products" : "/design") : "/register";

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-brand-blue/80 backdrop-blur">
      <div className="container-xl flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <LinkItem key={link.href} href={link.href}>
              {link.label}
            </LinkItem>
          ))}
        </nav>
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg bg-brand-yellow text-brand-navy px-4 py-2 font-semibold hover:opacity-95"
        >
          {user ? (user.is_staff ? "Panel admin" : "Nuevo diseño") : "Crear cuenta"}
        </Link>
      </div>
    </header>
  );
}
