// src/components/LanguageSwitcher.tsx
"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

const LOCALES = ["fr", "en", "pl"] as const;
type Locale = (typeof LOCALES)[number];

function detectLocale(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return (["en", "fr", "pl"] as const).includes(first as any) ? (first as Locale) : "en";
}

function stripLocale(pathname: string): string {
  const parts = pathname.split("/");
  if (["en", "fr", "pl"].includes(parts[1])) parts.splice(1, 1);
  const stripped = parts.join("/");
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const active = detectLocale(pathname);
  const withoutLocale = stripLocale(pathname) || "/";

  return (
    <div className="hidden md:flex items-center gap-3 text-sm font-semibold">
      {LOCALES.map((l) => (
        <NextLink
          key={l}
          href={`/${l}${withoutLocale}`}
          className={
            l === active
              ? "text-[var(--brand-orange-500)]"
              : "opacity-80 hover:opacity-100"
          }
          prefetch={false}
        >
          {l.toUpperCase()}
        </NextLink>
      ))}
    </div>
  );
}
