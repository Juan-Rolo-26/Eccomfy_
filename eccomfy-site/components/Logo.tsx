import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image src="/logo-mark-yellow.png" alt="Eccomfy" width={32} height={32} priority />
      <span className="font-semibold text-lg tracking-tight">Eccomfy</span>
    </Link>
  );
}
