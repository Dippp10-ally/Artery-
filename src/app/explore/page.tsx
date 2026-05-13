"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, RefreshCw, Wand2, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WarliArt } from "@/components/ui/WarliArt";

// ── Safety filters ────────────────────────────────────────────────────────────
// We never display a generation if its prompt contains any of these keywords.
// This blocks personal commissions, family portraits, and private references.
const PERSONAL_KEYWORDS = [
  "my ", "our ", " me ", "i want", "i need",
  "family", "wife", "husband", "sister", "brother",
  "daughter", "son", "father", "mother", "dad", "mom",
  "grandma", "grandpa", "grandfather", "grandmother",
  "wedding", "birthday", "anniversary", "funeral",
  "baby", "infant", "newborn",
  "pet", " dog", " cat",
  "house", "home", "apartment", "flat",
  "profile", "portrait of me", "selfie",
];

const MAX_PROMPT_LENGTH = 90; // characters — keeps cards scannable and hides long detailed briefs

function isSafe(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  if (lower.length > MAX_PROMPT_LENGTH) return false;
  return !PERSONAL_KEYWORDS.some((kw) => lower.includes(kw));
}

// ── Style filter options ──────────────────────────────────────────────────────
const STYLE_FILTERS = [
  { id: "all",          label: "All Styles" },
  { id: "madhubani",    label: "Madhubani" },
  { id: "gond",         label: "Gond Art" },
  { id: "warli",        label: "Warli" },
  { id: "watercolor",   label: "Watercolor" },
  { id: "oil-painting", label: "Oil Painting" },
  { id: "tanjore",      label: "Tanjore" },
  { id: "pichwai",      label: "Pichwai" },
  { id: "kalamkari",    label: "Kalamkari" },
];

// ── Curated starter prompts (shown at the top as clickable chips) ─────────────
const STARTER_PROMPTS = [
  { prompt: "Peacock in monsoon rain",           style: "pichwai" },
  { prompt: "Gond forest with dancing tigers",   style: "gond" },
  { prompt: "Madhubani lotus pond at sunrise",   style: "madhubani" },
  { prompt: "Warli harvest festival",            style: "warli" },
  { prompt: "Tanjore Ganesha gold border",       style: "tanjore" },
  { prompt: "Varanasi ghat at dusk watercolour", style: "watercolor" },
  { prompt: "Rajasthani camel caravan at night", style: "oil-painting" },
  { prompt: "Kalamkari goddess with jasmine",    style: "kalamkari" },
];

// ── Mock community generations ────────────────────────────────────────────────
// Used when Supabase returns nothing or the table doesn't exist yet.
// All prompts pass the isSafe() filter — short, impersonal, themed.
const MOCK_GENERATIONS = [
  {
    id: "g_001",
    prompt: "Madhubani lotus pond at sunrise",
    style: "madhubani",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600",
    createdAt: "2025-05-10T08:00:00Z",
  },
  {
    id: "g_002",
    prompt: "Gond forest with dancing tigers",
    style: "gond",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600",
    createdAt: "2025-05-09T14:30:00Z",
  },
  {
    id: "g_003",
    prompt: "Warli harvest festival",
    style: "warli",
    imageUrl: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=600",
    createdAt: "2025-05-09T11:00:00Z",
  },
  {
    id: "g_004",
    prompt: "Peacock in monsoon rain, Pichwai",
    style: "pichwai",
    imageUrl: "https://images.unsplash.com/photo-1605634288001-c8c3e8774775?q=80&w=600",
    createdAt: "2025-05-08T16:00:00Z",
  },
  {
    id: "g_005",
    prompt: "Abstract Mumbai skyline oil painting",
    style: "oil-painting",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600",
    createdAt: "2025-05-08T09:15:00Z",
  },
  {
    id: "g_006",
    prompt: "Tanjore Ganesha with gold leaf border",
    style: "tanjore",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600",
    createdAt: "2025-05-07T13:00:00Z",
  },
  {
    id: "g_007",
    prompt: "Kalamkari temple goddess flowers",
    style: "kalamkari",
    imageUrl: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=600",
    createdAt: "2025-05-07T10:30:00Z",
  },
  {
    id: "g_008",
    prompt: "Varanasi ghat at dusk watercolour",
    style: "watercolor",
    imageUrl: "https://images.unsplash.com/photo-1605634288001-c8c3e8774775?q=80&w=600",
    createdAt: "2025-05-06T18:00:00Z",
  },
  {
    id: "g_009",
    prompt: "Gond tree of life vibrant colours",
    style: "gond",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600",
    createdAt: "2025-05-06T11:00:00Z",
  },
  {
    id: "g_010",
    prompt: "Madhubani fish and lotus motifs",
    style: "madhubani",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600",
    createdAt: "2025-05-05T15:00:00Z",
  },
  {
    id: "g_011",
    prompt: "Rajasthani camel caravan at dusk",
    style: "oil-painting",
    imageUrl: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=600",
    createdAt: "2025-05-05T12:00:00Z",
  },
  {
    id: "g_012",
    prompt: "Warli wedding procession midnight",
    style: "warli",
    imageUrl: "https://images.unsplash.com/photo-1605634288001-c8c3e8774775?q=80&w=600",
    createdAt: "2025-05-04T20:00:00Z",
  },
  {
    id: "g_013",
    prompt: "Kerala mural elephant procession",
    style: "oil-painting",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600",
    createdAt: "2025-05-04T09:00:00Z",
  },
  {
    id: "g_014",
    prompt: "Pattachitra Jagannath chariot scene",
    style: "kalamkari",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600",
    createdAt: "2025-05-03T14:00:00Z",
  },
  {
    id: "g_015",
    prompt: "Abstract Diwali diyas warm palette",
    style: "watercolor",
    imageUrl: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=600",
    createdAt: "2025-05-03T10:00:00Z",
  },
  {
    id: "g_016",
    prompt: "Pichwai Krishna with lotus lake",
    style: "pichwai",
    imageUrl: "https://images.unsplash.com/photo-1605634288001-c8c3e8774775?q=80&w=600",
    createdAt: "2025-05-02T16:00:00Z",
  },
];

type Generation = typeof MOCK_GENERATIONS[number];

// ── Generation card ───────────────────────────────────────────────────────────
function GenerationCard({ item, onTryThis }: { item: Generation; onTryThis: (item: Generation) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden border border-cream-dark shadow-warm cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onTryThis(item)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-cream-dark">
        <Image
          src={item.imageUrl}
          alt={item.prompt}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            hovered && "scale-105"
          )}
        />

        {/* Hover overlay */}
        <div className={cn(
          "absolute inset-0 bg-ink/60 flex flex-col justify-end p-4 transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-cream text-sm font-medium leading-snug mb-3 line-clamp-2">
            &ldquo;{item.prompt}&rdquo;
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onTryThis(item); }}
            className="self-start flex items-center gap-1.5 bg-accent text-cream text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-accent/90 transition-colors"
          >
            <Wand2 size={11} /> Try this prompt
          </button>
        </div>
      </div>

      {/* Footer bar */}
      <div className="bg-cream-card px-3 py-2 flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full font-medium truncate">
          {item.style}
        </span>
        <ArrowRight size={11} className="text-ink-faint flex-shrink-0 group-hover:text-accent transition-colors group-hover:translate-x-0.5 transition-transform duration-150" />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const router = useRouter();

  const [styleFilter, setStyleFilter] = useState("all");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [usingMock,   setUsingMock]   = useState(false);

  // Fetch from Supabase, apply safety filters, fall back to mock
  const loadGenerations = useCallback(async () => {
    setLoading(true);
    try {
      const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supaUrl && supaKey) {
        // Fetch recent 100 generations — we'll filter client-side for prompt length
        // because Supabase REST API can't filter by string length natively
        const res = await fetch(
          `${supaUrl}/rest/v1/generations?select=id,prompt,style,image_urls,created_at&order=created_at.desc&limit=100`,
          {
            headers: {
              apikey: supaKey,
              Authorization: `Bearer ${supaKey}`,
            },
          }
        );

        if (res.ok) {
          const rows: any[] = await res.json();

          const safe = rows
            .filter((r) => {
              // Must have at least one image URL
              const urls: string[] = r.image_urls ?? [];
              if (!urls.length) return false;
              // Apply prompt safety filter
              return isSafe(r.prompt ?? "");
            })
            .map((r) => ({
              id:         r.id,
              prompt:     r.prompt,
              style:      r.style ?? "watercolor",
              // Use the first image URL from the array
              imageUrl:   Array.isArray(r.image_urls) ? r.image_urls[0] : r.image_urls,
              createdAt:  r.created_at,
            }));

          if (safe.length > 0) {
            setGenerations(safe);
            setUsingMock(false);
            setLoading(false);
            return;
          }
        }
      }
    } catch { /* silent */ }

    // Fall back to mock data (also run through the safety filter for correctness)
    setGenerations(MOCK_GENERATIONS.filter((g) => isSafe(g.prompt)));
    setUsingMock(true);
    setLoading(false);
  }, []);

  useEffect(() => { loadGenerations(); }, [loadGenerations]);

  const filtered = styleFilter === "all"
    ? generations
    : generations.filter((g) => g.style === styleFilter);

  const handleTryThis = (item: Generation) => {
    const params = new URLSearchParams({ prompt: item.prompt, style: item.style });
    router.push(`/generate?${params.toString()}`);
  };

  const handleStarterPrompt = (p: { prompt: string; style: string }) => {
    const params = new URLSearchParams({ prompt: p.prompt, style: p.style });
    router.push(`/generate?${params.toString()}`);
  };

  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative border-b border-cream-dark py-14 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.045} className="w-full h-full" />
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-2">Community</p>
          <h1 className="font-serif text-5xl text-ink leading-tight">Get Inspired</h1>
          <p className="text-ink-soft text-sm mt-2 max-w-xl">
            Generations from the ARTERY community — browse, find an idea you love, and make it your own.
            All images shown are short, public, impersonal prompts.
          </p>
        </div>
      </section>

      {/* ── Starter prompts ──────────────────────────────────────── */}
      <section className="border-b border-cream-dark px-6 md:px-12 py-6 bg-cream-card">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-ink-faint uppercase tracking-wider mb-3">Jump-start your imagination</p>
          <div className="flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((sp) => (
              <button
                key={sp.prompt}
                onClick={() => handleStarterPrompt(sp)}
                className="group flex items-center gap-1.5 px-3.5 py-2 bg-cream border border-cream-dark rounded-full text-xs font-medium text-ink-soft hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all"
              >
                <Sparkles size={10} className="text-accent opacity-60 group-hover:opacity-100" />
                {sp.prompt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Style filter ─────────────────────────────────────────── */}
      <section className="border-b border-cream-dark px-6 md:px-12 py-3 sticky top-16 z-20 bg-cream/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
          {STYLE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStyleFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                styleFilter === f.id
                  ? "bg-accent text-cream border-accent"
                  : "border-cream-dark text-ink-soft hover:border-accent/30"
              )}
            >
              {f.label}
            </button>
          ))}

          <button
            onClick={loadGenerations}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-cream-dark text-ink-soft hover:border-accent/30 hover:text-accent transition-all"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-10">
        <div className="max-w-6xl mx-auto">

          {loading ? (
            <div className="flex items-center justify-center py-32 gap-3 text-ink-soft">
              <Loader2 size={20} className="animate-spin text-accent" />
              <span className="text-sm">Loading community generations…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-xl text-ink-soft mb-2">No generations for this style yet</p>
              <p className="text-sm text-ink-faint mb-6">Be the first to create one.</p>
              <button
                onClick={() => router.push(`/generate?style=${styleFilter}`)}
                className="btn-accent inline-flex items-center gap-2"
              >
                <Sparkles size={14} /> Generate in {STYLE_FILTERS.find((f) => f.id === styleFilter)?.label}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-ink-faint">
                  {filtered.length} generation{filtered.length !== 1 ? "s" : ""}
                  {usingMock && (
                    <span className="ml-2 text-ink-faint/60">(example data — real generations appear once users start creating)</span>
                  )}
                </p>
                <button
                  onClick={() => router.push("/generate")}
                  className="btn-accent flex items-center gap-1.5 text-sm"
                >
                  <Sparkles size={13} /> Create Yours
                </button>
              </div>

              {/* Masonry layout via CSS columns */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {filtered.map((item) => (
                  <GenerationCard key={item.id} item={item} onTryThis={handleTryThis} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <section className="border-t border-cream-dark bg-cream-card py-14 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl text-ink mb-1">Like what you see?</h3>
              <p className="text-ink-soft text-sm">
                Generate your own variation, or commission a real artist to paint it by hand.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/generate")}
                className="btn-accent flex items-center gap-2"
              >
                <Sparkles size={14} /> Generate Artwork
              </button>
              <button
                onClick={() => router.push("/lens")}
                className="btn-outline flex items-center gap-2 text-sm"
              >
                Find an Artist
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
