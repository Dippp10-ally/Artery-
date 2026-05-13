"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles, ChevronDown, Download, Loader2, RefreshCw,
  Globe, UserSearch, ArrowRight, CheckCircle,
} from "lucide-react";
import { WarliArt } from "@/components/ui/WarliArt";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const FORMATS = ["Canvas", "Saree", "Wallpaper", "Tote Bag", "Postcard"] as const;
const STYLES = [
  { id: "watercolor",   label: "Watercolor" },
  { id: "madhubani",    label: "Madhubani" },
  { id: "oil-painting", label: "Oil Painting" },
  { id: "gond",         label: "Gond Art" },
  { id: "geometric",    label: "Geometric" },
  { id: "minimalist",   label: "Minimalist" },
] as const;

// Wrap in Suspense so useSearchParams() doesn't break the build
export default function GeneratePage() {
  return (
    <Suspense>
      <GeneratePageInner />
    </Suspense>
  );
}

function GeneratePageInner() {
  const router = useRouter();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();

  const [prompt,     setPrompt]     = useState(searchParams.get("prompt") ?? "");
  const [format,     setFormat]     = useState<typeof FORMATS[number]>("Canvas");
  const [style,      setStyle]      = useState(searchParams.get("style") ?? "watercolor");
  const [loading,    setLoading]    = useState(false);
  const [generated,  setGenerated]  = useState<string[]>([]);
  const [selected,   setSelected]   = useState<string | null>(null);
  const [formatOpen, setFormatOpen] = useState(false);
  const [error,      setError]      = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setGenerated([]);
    setSelected(null);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, format, userId: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      const urls: string[] = data.images.map((img: { url: string }) => img.url);
      setGenerated(urls);
      setSelected(urls[0] ?? null);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to commission form, passing the generated image + prompt via query params
  const goToCommission = (mode: "post" | "find") => {
    if (!user) { router.push("/login"); return; }
    const params = new URLSearchParams({
      mode,
      imageUrl: selected ?? "",
      prompt: prompt,
      style,
    });
    router.push(`/commissions/new?${params.toString()}`);
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="section-label mb-2">AI Studio</p>
            <h1 className="font-serif text-4xl text-ink">Generate Artwork</h1>
            <p className="text-ink-soft text-sm mt-1">
              Describe your vision. Our AI renders it — then connect with an artisan to bring it to life.
            </p>
          </div>
          <div className="hidden md:block w-32 h-32 pointer-events-none">
            <WarliArt variant="scatter" opacity={0.06} className="w-full h-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10">

          {/* ── Left: Controls ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            <div>
              <label className="section-label block mb-2">Describe the artwork you imagine</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A Mughal-style garden scene at dusk, with intricate floral borders in lapis blue and gold, lit by the warm glow of earthen diyas…"
                rows={5}
                className="w-full input-warm resize-none text-sm leading-relaxed"
              />
            </div>

            <div>
              <label className="section-label block mb-3">Style</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setStyle(id)}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200",
                      style === id
                        ? "bg-accent text-cream border-accent"
                        : "border-cream-dark text-ink-soft hover:border-accent/40 hover:text-ink bg-cream-card"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 items-stretch">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="flex-1 btn-accent flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Generating…</>
                  : <><Sparkles size={16} /> Consult the Muse</>
                }
              </button>

              <div className="relative">
                <button
                  onClick={() => setFormatOpen((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-cream-dark rounded-md text-sm font-medium text-ink-soft hover:border-accent/40 hover:text-ink transition-all bg-cream-card whitespace-nowrap"
                >
                  {format}
                  <ChevronDown size={13} className={cn("transition-transform", formatOpen && "rotate-180")} />
                </button>
                {formatOpen && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-cream border border-cream-dark rounded-md shadow-warm z-20 overflow-hidden">
                    {FORMATS.map((f) => (
                      <button
                        key={f}
                        onClick={() => { setFormat(f); setFormatOpen(false); }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm transition-colors",
                          format === f
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-ink-soft hover:bg-cream-dark/50 hover:text-ink"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* What happens next — shown before generation */}
            {!selected && (
              <div className="border border-cream-dark rounded-xl p-5 bg-cream-card space-y-3">
                <p className="text-xs text-ink-faint uppercase tracking-wider font-medium">After you generate</p>
                {[
                  { icon: Globe,      label: "Post to Marketplace", desc: "Let any artist on ARTERY bid on your vision" },
                  { icon: UserSearch, label: "Connect Directly",    desc: "Choose a specific artist and unlock their contact" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={14} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{label}</p>
                      <p className="text-xs text-ink-soft">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Output ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Main preview canvas */}
            <div className="aspect-square bg-cream-card border border-cream-dark rounded-sm overflow-hidden relative">
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Loader2 size={32} className="animate-spin text-accent" />
                  <p className="font-serif italic text-ink-soft text-sm">Consulting the Muse…</p>
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
                    <WarliArt variant="corner-tl" opacity={1} className="w-64 h-64" />
                  </div>
                </div>
              )}
              {!loading && !selected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="w-20 h-20 opacity-20">
                    <WarliArt variant="scatter" opacity={1} className="w-full h-full" />
                  </div>
                  <p className="font-serif italic text-ink-soft text-lg">Your artwork will appear here</p>
                  <p className="text-ink-faint text-xs">Describe your vision on the left and hit Generate</p>
                </div>
              )}
              {selected && (
                <Image src={selected} alt="Generated artwork" fill className="object-cover" />
              )}
            </div>

            {/* Variation thumbnails */}
            {generated.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {generated.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(url)}
                    className={cn(
                      "aspect-square relative overflow-hidden rounded-sm border-2 transition-all duration-200",
                      selected === url ? "border-accent" : "border-transparent hover:border-cream-dark"
                    )}
                  >
                    <Image src={url} alt={`Variation ${i + 1}`} fill className="object-cover" />
                    {selected === url && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                        <CheckCircle size={10} className="text-cream" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* ── Post-generation CTAs ── */}
            {selected && (
              <>
                {/* Primary: two commission paths */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => goToCommission("post")}
                    className="flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 border-accent bg-accent/5 hover:bg-accent/10 transition-all group"
                  >
                    <Globe size={20} className="text-accent" />
                    <span className="font-medium text-sm text-ink">Post to Marketplace</span>
                    <span className="text-[11px] text-ink-soft text-center leading-tight">
                      Any artist can quote your vision
                    </span>
                    <span className="text-[11px] text-accent font-medium flex items-center gap-0.5 mt-0.5">
                      Free to post <ArrowRight size={10} />
                    </span>
                  </button>

                  <button
                    onClick={() => goToCommission("find")}
                    className="flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 border-cream-dark hover:border-accent/40 hover:bg-accent/5 transition-all group"
                  >
                    <UserSearch size={20} className="text-accent" />
                    <span className="font-medium text-sm text-ink">Find an Artist</span>
                    <span className="text-[11px] text-ink-soft text-center leading-tight">
                      Browse & connect directly
                    </span>
                    <span className="text-[11px] text-ink-faint flex items-center gap-0.5 mt-0.5">
                      From ₹149 <ArrowRight size={10} />
                    </span>
                  </button>
                </div>

                {/* Secondary: utility actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn-outline flex items-center gap-1.5 text-sm px-3 py-2"
                  >
                    <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                    Regenerate
                  </button>
                  <a
                    href={selected}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex items-center gap-1.5 text-sm px-3 py-2"
                  >
                    <Download size={13} />
                    Save Image
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
