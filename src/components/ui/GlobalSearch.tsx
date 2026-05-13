"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Sparkles, User, Star, Globe } from "lucide-react";
import { MOCK_ARTISTS } from "@/mock/artists";
import { cn } from "@/lib/utils";

interface Result {
  type: "artist" | "commission" | "generate" | "page";
  label: string;
  sublabel?: string;
  href: string;
  icon: React.ElementType;
}

// Static page results always available
const PAGE_RESULTS: Result[] = [
  { type: "page", label: "Generate Artwork",     sublabel: "Create AI art",              href: "/generate",    icon: Sparkles },
  { type: "page", label: "Browse Marketplace",   sublabel: "Open commissions",           href: "/commissions", icon: Globe },
  { type: "page", label: "Explore Community",    sublabel: "Community generations",      href: "/explore",     icon: Star },
  { type: "page", label: "Artist Directory",     sublabel: "Find a verified artist",     href: "/lens",        icon: User },
  { type: "page", label: "FAQ",                  sublabel: "Help & answers",             href: "/faq",         icon: Star },
  { type: "page", label: "Contact Support",      sublabel: "Get help",                   href: "/support",     icon: Star },
];

function search(query: string): Result[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();

  const artistResults: Result[] = (MOCK_ARTISTS as any[])
    .filter((a) =>
      a.displayName?.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q) ||
      a.mediums?.some((m: string) => m.toLowerCase().includes(q)) ||
      a.styles?.some((s: string) => s.toLowerCase().includes(q))
    )
    .slice(0, 4)
    .map((a) => ({
      type: "artist" as const,
      label: a.displayName,
      sublabel: `${a.location ?? ""} · ${a.mediums?.[0] ?? ""}`.replace(/^ · /, ""),
      href: `/artists/${a.id}`,
      icon: User,
    }));

  const pageResults = PAGE_RESULTS.filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      (p.sublabel?.toLowerCase().includes(q) ?? false)
  );

  // Add a "generate this" result if query looks like a prompt
  const generateResult: Result[] = query.length > 4
    ? [{ type: "generate", label: `Generate "${query}"`, sublabel: "Open in AI generator", href: `/generate?prompt=${encodeURIComponent(query)}`, icon: Sparkles }]
    : [];

  return [...generateResult, ...artistResults, ...pageResults].slice(0, 8);
}

export function GlobalSearch() {
  const router = useRouter();
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [active,  setActive]  = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    setResults(search(query));
    setActive(0);
  }, [query]);

  const handleSelect = useCallback((result: Result) => {
    router.push(result.href);
    setOpen(false);
    setQuery("");
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter" && results[active]) handleSelect(results[active]);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-ink-faint border border-cream-dark rounded-lg hover:border-accent/30 hover:text-ink-soft transition-all bg-cream"
      >
        <Search size={12} />
        <span>Search…</span>
        <kbd className="ml-2 text-[10px] bg-cream-dark px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={() => { setOpen(false); setQuery(""); }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-cream rounded-2xl shadow-warm-lg border border-cream-dark overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cream-dark">
          <Search size={16} className="text-ink-faint flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search artists, styles, or type a prompt to generate…"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
          />
          <button onClick={() => { setOpen(false); setQuery(""); }} className="text-ink-faint hover:text-ink">
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {results.map((r, i) => {
              const Icon = r.icon;
              return (
                <li key={r.href + i}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => handleSelect(r)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      active === i ? "bg-accent/8 text-accent" : "text-ink hover:bg-cream-card"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      r.type === "generate" ? "bg-accent/15" : "bg-cream-dark"
                    )}>
                      <Icon size={14} className={r.type === "generate" ? "text-accent" : "text-ink-soft"} />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">{r.label}</p>
                      {r.sublabel && <p className="text-xs text-ink-faint mt-0.5">{r.sublabel}</p>}
                    </div>
                    <span className={cn(
                      "ml-auto text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium flex-shrink-0",
                      r.type === "artist"     && "bg-accent/10 text-accent",
                      r.type === "generate"   && "bg-accent/20 text-accent",
                      r.type === "commission" && "bg-green-50 text-green-700",
                      r.type === "page"       && "bg-cream-dark text-ink-faint",
                    )}>
                      {r.type === "generate" ? "AI" : r.type}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : query ? (
          <div className="py-10 text-center text-sm text-ink-faint">
            No results for &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="py-4 px-4">
            <p className="text-xs text-ink-faint uppercase tracking-wider mb-2">Quick links</p>
            <div className="grid grid-cols-2 gap-1">
              {PAGE_RESULTS.slice(0, 4).map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.href}
                    onClick={() => handleSelect(p)}
                    className="flex items-center gap-2 p-2.5 rounded-lg text-left hover:bg-cream-card transition-colors"
                  >
                    <Icon size={13} className="text-accent flex-shrink-0" />
                    <span className="text-xs text-ink-soft">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="border-t border-cream-dark px-4 py-2 flex items-center gap-3 text-[10px] text-ink-faint">
          <span><kbd className="font-mono bg-cream-dark px-1 py-0.5 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono bg-cream-dark px-1 py-0.5 rounded">↵</kbd> select</span>
          <span><kbd className="font-mono bg-cream-dark px-1 py-0.5 rounded">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
