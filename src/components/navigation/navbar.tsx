"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import LocaleLink from "@/components/LocaleLink";
import type { SidebarNavItem, NavLink } from "@/types/nav-types";

type Variant = "light" | "dark";

interface DashboardNavProps {
  items: SidebarNavItem[];
  className?: string;
  variant?: Variant; // ✅ new
}

export default function DashboardNav({ items, className, variant = "light" }: DashboardNavProps) {
  const pathname = usePathname();
  if (!items?.length) return null;

  const styles =
    variant === "dark"
      ? {
          base: "text-white/80 hover:text-white hover:bg-white/10",
          active: "bg-white/10 text-white",
          section: "text-white/60",
        }
      : {
          base: "text-gray-700 hover:text-[var(--brand-orange-500)] hover:bg-orange-50",
          active: "bg-orange-50 text-[var(--brand-orange-500)]",
          section: "text-gray-500",
        };

  return (
    <nav className={cn("space-y-1", className)}>
      {items.map((item, i) => (
        <NavEntry key={i} item={item} pathname={pathname} styles={styles} depth={0} />
      ))}
    </nav>
  );
}

function NavEntry({
  item,
  pathname,
  styles,
  depth,
}: {
  item: SidebarNavItem;
  pathname: string | null;
  styles: { base: string; active: string; section: string };
  depth: number;
}) {
  if (item.href) {
    const Icon = item.icon ? Icons[item.icon] ?? Icons.list : Icons.list;
    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

    return (
      <LocaleLink
        href={item.href}
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
          styles.base,
          isActive && styles.active,
          item.disabled && "pointer-events-none opacity-60",
          depth > 0 && "ml-4"
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        <span>{item.title}</span>
      </LocaleLink>
    );
  }

  if (item.items?.length) {
    return (
      <div className={cn(depth > 0 && "ml-2")}>
        <div className={cn("px-3 py-2 text-xs uppercase tracking-wide", styles.section)}>
          {item.title}
        </div>
        <div className="space-y-1">
          {item.items.map((child: NavLink, idx: number) => {
            const isActive = pathname === child.href || pathname?.startsWith(child.href + "/");
            return (
              <LocaleLink
                key={idx}
                href={child.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  styles.base,
                  isActive && styles.active,
                  child.disabled && "pointer-events-none opacity-60",
                  "ml-4"
                )}
              >
                <span className="truncate">{child.title}</span>
              </LocaleLink>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
