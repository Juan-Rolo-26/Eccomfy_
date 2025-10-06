import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  desc: string;
  href: string;
  img: string;
  badges?: string[];
  highlights?: string[];
};

export default function StyleCard({ title, desc, href, img, badges = [], highlights = [] }: Props) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[2rem] border border-white/20 bg-white text-brand-navy shadow-card transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <span className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-brand-yellow via-brand-yellow/60 to-brand-blue/70" />
      <span className="absolute inset-0 bg-gradient-to-br from-brand-yellow/0 via-white/0 to-brand-yellow/0 transition-opacity duration-300 group-hover:from-brand-yellow/10 group-hover:via-white/20 group-hover:to-brand-blue/10" />

      <div className="relative flex flex-col gap-6 p-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-sky/40">
          <Image
            src={img}
            alt={title}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-brand-sky/50 to-transparent" />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 4).map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border border-brand-blue/20 bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue"
              >
                {badge}
              </span>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-brand-navy/70">{desc}</p>
          </div>
          {highlights.length > 0 ? (
            <ul className="space-y-1 text-sm text-brand-navy/70">
              {highlights.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-yellow" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition-all duration-300 group-hover:gap-3">
          Diseñar ahora
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
            <path d="M13.172 12l-4.95 4.95 1.414 1.414L16 12l-6.364-6.364-1.414 1.414z" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
