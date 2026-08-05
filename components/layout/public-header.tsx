"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/session-provider";
import { useState } from "react";
import { Bell, Briefcase, Menu, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/jobs", label: "Lowongan" },
  { href: "/#how-it-works", label: "Cara Kerja" },
  { href: "/#companies", label: "Perusahaan" },
  { href: "/#contact", label: "Kontak" },
];

export function PublicHeader() {
  const { user: sessionUser, signOut } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-card-hover">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Career<span className="text-gradient">System</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-600 transition hover:bg-brand-50 hover:text-brand-700",
                pathname === link.href && "bg-brand-50 text-brand-700"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {sessionUser ? (
            <>
              <Link
                href="/dashboard"
                className="btn-ghost"
              >
                <Sparkles className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/dashboard/notifications" className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-100">
                <Bell className="h-5 w-5" />
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Avatar name={sessionUser.name ?? "User"} src={sessionUser.image} />
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Masuk
              </Link>
              <Link href="/register" className="btn-primary">
                Daftar Gratis
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-zinc-100 pt-3">
              {sessionUser ? (
                <button onClick={() => signOut()} className="btn-secondary w-full">
                  Keluar
                </button>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary w-full">
                    Masuk
                  </Link>
                  <Link href="/register" className="btn-primary w-full">
                    Daftar Gratis
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
