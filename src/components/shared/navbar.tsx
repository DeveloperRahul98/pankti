"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NAV_LINKS } from "@/lib/site";
import { usePlate } from "@/lib/plate-store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const itemCount = usePlate((s) => s.lines.reduce((a, l) => a + l.qty, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-[var(--bg)]/85 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/menu"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-4 py-2 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Build Plate
            {itemCount > 0 && (
              <span className="ml-1 rounded-full bg-[var(--primary-fg)]/15 px-2 py-0.5 text-xs font-bold tabular-nums">
                {itemCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)]"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
          <div className="flex flex-col px-5 py-4 gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                    active
                      ? "bg-[var(--bg-elev)] text-primary"
                      : "text-fg-muted hover:bg-[var(--bg-elev)] hover:text-fg",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/menu"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-fg px-4 py-3 text-sm font-semibold"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Build Your Plate
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
