"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe, Plus, Clock, IndianRupee, Sparkles,
  ChevronRight, Search, Filter, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { WarliArt } from "@/components/ui/WarliArt";

// Mock commission requests — replaced by Supabase data once schema_v2.sql is run
const MOCK_REQUESTS = [
  {
    id: "req_001",
    title: "Madhubani Family Portrait — 5 people + dog",
    description: "Looking for an authentic Madhubani style portrait of my family — 5 people including two children and our dog. Need it done in Bihar Madhubani style with natural pigments on handmade paper.",
    style: "madhubani",
    budgetMin: 3000,
    budgetMax: 6000,
    deadlineDays: 30,
    patronName: "Amit Sharma",
    postedAt: "2 hours ago",
    quotesCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=400",
    status: "open",
  },
  {
    id: "req_002",
    title: "Mughal Garden Scene — 24×36 canvas for fireplace",
    description: "I need a 24×36 painting of a traditional Mughal garden scene for above my fireplace. Intricate borders typical of Jaipur miniatures but with a muted palette for a modern living room.",
    style: "madhubani",
    budgetMin: 8000,
    budgetMax: 12000,
    deadlineDays: 45,
    patronName: "Sarah Jenkins",
    postedAt: "5 hours ago",
    quotesCount: 1,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400",
    status: "open",
  },
  {
    id: "req_003",
    title: "Large Peacock Mural Design — Hotel Lobby Feature Wall",
    description: "We need a design for a lobby feature wall. Theme is 'Peacocks in Rain'. Digital design first, extremely high resolution, to be painted by local artisans.",
    style: "gond",
    budgetMin: 20000,
    budgetMax: 25000,
    deadlineDays: 60,
    patronName: "Hotel Raipur Palace",
    postedAt: "1 day ago",
    quotesCount: 5,
    imageUrl: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=400",
    status: "open",
  },
  {
    id: "req_004",
    title: "Gond Art Print Series — 4 Panels, Office Reception",
    description: "Seeking an original Gond art series for our office reception. Four panels, 18×24 inches each. Theme: the four seasons through Gond lens. Digital-ready files for high-quality printing.",
    style: "gond",
    budgetMin: 15000,
    budgetMax: 18000,
    deadlineDays: 30,
    patronName: "Techcorp India",
    postedAt: "2 days ago",
    quotesCount: 2,
    imageUrl: "https://images.unsplash.com/photo-1605634288001-c8c3e8774775?q=80&w=400",
    status: "open",
  },
  {
    id: "req_005",
    title: "Watercolor Ghat Scene — Anniversary Gift",
    description: "My parents got married in Varanasi 30 years ago. I'd like a watercolour painting of the Dashashwamedh Ghat at sunrise as an anniversary gift. Soft, nostalgic palette.",
    style: "watercolor",
    budgetMin: 2500,
    budgetMax: 4000,
    deadlineDays: 21,
    patronName: "Preethi R.",
    postedAt: "3 days ago",
    quotesCount: 4,
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=400",
    status: "open",
  },
];

const STYLE_FILTERS = [
  { id: "all",          label: "All Styles" },
  { id: "watercolor",   label: "Watercolor" },
  { id: "madhubani",    label: "Madhubani" },
  { id: "gond",         label: "Gond Art" },
  { id: "oil-painting", label: "Oil Painting" },
  { id: "geometric",    label: "Geometric" },
];

const BUDGET_FILTERS = [
  { id: "all",    label: "Any Budget" },
  { id: "low",    label: "Under ₹5,000" },
  { id: "mid",    label: "₹5,000–₹15,000" },
  { id: "high",   label: "₹15,000+" },
];

export default function CommissionsPage() {
  const { user } = useAuthStore();
  const [search,        setSearch]        = useState("");
  const [styleFilter,   setStyleFilter]   = useState("all");
  const [budgetFilter,  setBudgetFilter]  = useState("all");

  const filtered = MOCK_REQUESTS.filter((r) => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchStyle  = styleFilter === "all" || r.style === styleFilter;
    const matchBudget = budgetFilter === "all"
      || (budgetFilter === "low"  && r.budgetMax  <  5000)
      || (budgetFilter === "mid"  && r.budgetMin  >= 5000 && r.budgetMax <= 15000)
      || (budgetFilter === "high" && r.budgetMin  > 15000);
    return matchSearch && matchStyle && matchBudget;
  });

  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative border-b border-cream-dark py-14 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.045} className="w-full h-full" />
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="section-label mb-2">Open Commissions</p>
            <h1 className="font-serif text-4xl text-ink">Artisan Marketplace</h1>
            <p className="text-ink-soft text-sm mt-2 max-w-xl">
              Patrons post their vision. Artists submit quotes. Great art finds the right hands.
            </p>
          </div>
          <Link href="/commissions/new?mode=post" className="btn-accent flex items-center gap-2 whitespace-nowrap">
            <Plus size={15} /> Post a Commission
          </Link>
        </div>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <section className="border-b border-cream-dark px-6 md:px-12 py-4 bg-cream-card sticky top-16 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commissions…"
              className="input-warm w-full pl-9 text-sm"
            />
          </div>
          {/* Style */}
          <div className="flex gap-1.5 flex-wrap">
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
          </div>
          {/* Budget */}
          <div className="flex gap-1.5 flex-wrap">
            {BUDGET_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setBudgetFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                  budgetFilter === f.id
                    ? "bg-ink text-cream border-ink"
                    : "border-cream-dark text-ink-soft hover:border-ink/30"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listings ─────────────────────────────────────────────────── */}
      <section className="py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-ink-faint mb-6">{filtered.length} open request{filtered.length !== 1 ? "s" : ""}</p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-ink-soft mb-2">No matching commissions</p>
              <p className="text-sm text-ink-faint mb-6">Try adjusting your filters, or post your own request.</p>
              <Link href="/commissions/new?mode=post" className="btn-accent inline-flex items-center gap-2">
                <Plus size={14} /> Post a Commission
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((req) => (
                <Link
                  key={req.id}
                  href={`/commissions/${req.id}`}
                  className="group block bg-cream-card border border-cream-dark rounded-xl p-6 hover:border-accent/30 hover:shadow-warm transition-all"
                >
                  <div className="flex gap-5 items-start">
                    {/* Image */}
                    {req.imageUrl && (
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-sm overflow-hidden flex-shrink-0 border border-cream-dark">
                        <Image src={req.imageUrl} alt={req.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-cream/20" />
                        <div className="absolute bottom-1 left-1 right-1 text-center">
                          <span className="text-[9px] bg-ink/60 text-cream px-1.5 py-0.5 rounded-full">AI Generated</span>
                        </div>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full font-medium">
                              {req.style}
                            </span>
                            <span className="text-xs text-ink-faint">{req.postedAt}</span>
                          </div>
                          <h3 className="font-serif text-xl text-ink group-hover:text-accent transition-colors leading-tight">
                            {req.title}
                          </h3>
                          <p className="text-ink-soft text-sm leading-relaxed mt-1.5 line-clamp-2">
                            {req.description}
                          </p>
                          <p className="text-xs text-ink-faint mt-2">Posted by {req.patronName}</p>
                        </div>

                        <div className="text-right flex-shrink-0 space-y-1">
                          <div className="flex items-center gap-1 text-ink font-medium text-sm justify-end">
                            <IndianRupee size={12} />
                            {req.budgetMin.toLocaleString()} – {req.budgetMax.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-ink-faint text-xs justify-end">
                            <Clock size={11} /> {req.deadlineDays}-day deadline
                          </div>
                          <div className="flex items-center gap-1 text-accent text-xs font-medium justify-end">
                            <Star size={11} className="fill-accent" /> {req.quotesCount} quote{req.quotesCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Open
                          </span>
                        </div>
                        <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          {user ? "Submit Quote" : "View Details"} <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA for patrons ──────────────────────────────────────────── */}
      <section className="border-t border-cream-dark bg-cream-card py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl text-ink mb-1">Have a vision you want made?</h3>
            <p className="text-ink-soft text-sm">Generate an AI image of it, then post here for artists to quote.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/generate" className="btn-outline flex items-center gap-2 text-sm">
              <Sparkles size={14} /> Generate First
            </Link>
            <Link href="/commissions/new?mode=post" className="btn-accent flex items-center gap-2">
              <Plus size={14} /> Post Commission
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
