import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eccomfy — Packaging personalizado",
  description: "Diseñá cajas personalizadas con vista 3D y cotización instantánea.",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="es">
      <body className={font.className + " bg-brand-blue text-white"}>
        <Header user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
