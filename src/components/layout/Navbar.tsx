"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown, Sparkles, Scan, Info, LogIn, Store, LayoutDashboard, HelpCircle, Compass } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/ui/GlobalSearch";

// ── Patron nav links ──────────────────────────────────────────────
const PATRON_LINKS = [
  { href: "/generate",    label: "Generate",     icon: Sparkles,  highlight: true },
  { href: "/explore",     label: "Explore",      icon: Compass },
  { href: "/lens",        label: "Artists",      icon: Scan },
  { href: "/commissions", label: "Marketplace",  icon: Store },
];

// ── Artist nav links (artist dashboard) ──────────────────────────
const ARTIST_LINKS = [
  { href: "/artist-dashboard",             label: "Market Place",   icon: Store },
  { href: "/artist-dashboard?tab=orders",  label: "Pending Orders", icon: null },
  { href: "/about",                         label: "About Us",       icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { totalItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const cartCount = totalItems();

  const isArtistPath = pathname.startsWith("/artist-dashboard");
  const navLinks     = isArtistPath ? ARTIST_LINKS : PATRON_LINKS;

  // Hidden on the landing page — it has its own full-screen standalone design
  if (pathname === "/") return null;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300 bg-cream/96 backdrop-blur-sm border-b border-cream-dark",
      scrolled && "shadow-warm"
    )}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

        {/* ── Logo ──────────────────────────────────────────────── */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 group flex-shrink-0"
        >
          <span className="text-accent text-lg group-hover:rotate-45 transition-transform duration-500 font-serif leading-none">◆</span>
          <span className="font-serif text-xl text-ink tracking-tight font-medium group-hover:text-accent transition-colors duration-200">
            Artisan AI
          </span>
        </button>

        {/* ── Desktop nav ───────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map(({ href, label, highlight }: any) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href.split("?")[0]));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md whitespace-nowrap",
                  highlight
                    ? "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
                    : active
                      ? "text-accent"
                      : "text-ink-soft hover:text-ink hover:bg-cream-dark/50"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* ── Right side: search + login / user menu ────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Global search — desktop only */}
          <GlobalSearch />

          {/* Cart badge (desktop — already listed in nav, but small icon for quick access) */}
          {!isArtistPath && cartCount > 0 && (
            <Link
              href="/cart"
              className="relative p-2 text-ink-soft hover:text-accent transition-colors hidden md:flex"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-cream text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cream-dark hover:border-accent/40 transition-colors duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center font-serif text-xs text-accent font-medium">
                  {(user.email ?? user.phone ?? "U")[0].toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm text-ink font-medium max-w-[100px] truncate">
                  {user.name ?? user.email?.split("@")[0] ?? "You"}
                </span>
                <ChevronDown size={13} className="text-ink-soft" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-cream border border-cream-dark rounded-lg shadow-warm-lg overflow-hidden z-50">
                  <Link
                    href="/patron-dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-ink hover:bg-cream-dark/50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LayoutDashboard size={13} className="text-ink-soft" /> My Dashboard
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-ink hover:bg-cream-dark/50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <ShoppingBag size={13} className="text-ink-soft" /> My Orders
                  </Link>
                  <Link
                    href="/support"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-ink hover:bg-cream-dark/50 transition-colors border-t border-cream-dark"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <HelpCircle size={13} className="text-ink-soft" /> Help & Support
                  </Link>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-ink hover:bg-cream-dark/50 transition-colors border-t border-cream-dark"
                  >
                    <LogOut size={13} className="text-ink-soft" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-ink border border-cream-dark px-4 py-2 rounded-md hover:border-accent/40 hover:text-accent transition-all duration-200"
            >
              <LogIn size={13} /> Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-ink-soft hover:text-ink transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-cream-dark bg-cream px-6 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label, highlight }: any) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                highlight
                  ? "text-accent bg-accent/5 border border-accent/15"
                  : pathname === href
                    ? "text-accent bg-cream-dark/40"
                    : "text-ink-soft hover:text-ink hover:bg-cream-dark/40"
              )}
            >
              {label}
            </Link>
          ))}
          {!user && (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center gap-2 px-4 py-3 text-sm font-medium text-accent border border-accent/25 rounded-md hover:bg-accent/5 transition-colors"
            >
              <LogIn size={13} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
