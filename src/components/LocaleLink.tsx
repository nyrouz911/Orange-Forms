// src/components/LocaleLink.tsx
"use client";

import NextLink, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

const LOCALES = ["en", "fr", "pl"] as const;
type Locale = (typeof LOCALES)[number];

function detectLocale(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return (LOCALES as readonly string[]).includes(first) ? (first as Locale) : "en";
}

// Strips the current locale prefix from a pathname: /en/view-forms -> /view-forms
function stripLocale(pathname: string): string {
  const parts = pathname.split("/");
  if ((LOCALES as readonly string[]).includes(parts[1])) {
    parts.splice(1, 1);
  }
  return parts.join("/") || "/";
}

type Props = Omit<React.ComponentProps<typeof NextLink>, "href"> & {
  href: string;
};

export default function LocaleLink({ href, ...rest }: Props) {
  const pathname = usePathname() || "/";
  const activeLocale = detectLocale(pathname);

  // If href is absolute (http...), leave as-is. If it's a path, prefix locale.
  const isAbsolute = /^https?:\/\//i.test(href);
  const finalHref = isAbsolute
    ? href
    : `/${activeLocale}${href.startsWith("/") ? href : `/${href}`}`;

  return <NextLink href={finalHref} {...rest} />;
}
