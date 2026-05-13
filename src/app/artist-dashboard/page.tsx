"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, LayoutGrid, ShoppingBag, BarChart2, LogIn, Star, Clock, ChevronRight, BadgeCheck, Ban, Upload, Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

// Mock marketplace commissions (replace with DB data later)
const MARKETPLACE_ITEMS = [
  {
    id: "m1",
    type: "COMMISSION",
    title: "Mughal Style Garden Scene",
    desc: "I need a 24×36 painting of a traditional Mughal garden scene to go above my fireplace. I love the intricate borders typical of Jaipur miniatures but want the color palette to be slightly muted to fit a modern living room.",
    budget: "₹800 – ₹1,200",
    postedBy: "Sarah Jenkins",
    postedAt: "2 hours ago",
  },
  {
    id: "m2",
    type: "COMMISSION",
    title: "Large Scale Peacock Mural Design",
    desc: "We are looking for a design for a feature wall in our lobby. Theme is 'Peacocks in Rain'. We need a digital design first that can be created and painted by local artisans. Needs to be extremely high resolution.",
    budget: "₹2,500",
    postedBy: "Hotel Raipur Palace",
    postedAt: "5 hours ago",
  },
  {
    id: "m3",
    type: "COMMISSION",
    title: "Traditional Madhubani Portrait",
    desc: "Looking for a Madhubani style portrait of my family — 5 people including two children and our dog. Need it done in authentic Bihar Madhubani style with natural pigments.",
    budget: "₹600",
    postedBy: "Amit Sharma",
    postedAt: "1 day ago",
  },
  {
    id: "m4",
    type: "COMMISSION",
    title: "Gond Art Print Series — 4 Panels",
    desc: "Seeking an original Gond art series for our office reception. Four panels, each 18×24 inches. Theme: the four seasons through Gond lens. Digital-ready files needed for high-quality print.",
    budget: "₹1,800",
    postedBy: "Techcorp India",
    postedAt: "2 days ago",
  },
];

const MY_PORTFOLIO = [
  { id: "p1", title: "Lotus Mandala", style: "Madhubani", img: "/images/aarav-work-1.jpg" },
  { id: "p2", title: "Pink City Gate", style: "Miniature", img: "/images/aarav-work-2.png" },
  { id: "p3", title: "Durbar Procession", style: "Folk Art", img: "/images/aarav-work-3.png" },
];

type Tab = "marketplace" | "catalogue" | "profile" | "sales";

export default function ArtistDashboardPage() {
  return <Suspense><ArtistDashboardInner /></Suspense>;
}

function ArtistDashboardInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user }     = useAuthStore();

  const initialTab = (searchParams.get("tab") as Tab) ?? "marketplace";
  const [tab, setTab] = useState<Tab>(initialTab);

  const NAV_ITEMS: { tab: Tab; label: string; icon: any }[] = [
    { tab: "marketplace", label: "Market Place",   icon: ShoppingBag },
    { tab: "catalogue",   label: "Your Catalogue", icon: LayoutGrid },
    { tab: "profile",     label: "Your Profile",   icon: User },
    { tab: "sales",       label: "Sales",           icon: BarChart2 },
  ];

  return (
    <div className="bg-cream min-h-screen flex">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-52 flex-shrink-0 border-r border-cream-dark bg-cream-card flex flex-col py-8 px-4 gap-1 sticky top-16 h-[calc(100vh-4rem)] hidden md:flex">

        {!user ? (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-ink-soft hover:text-ink hover:bg-cream-dark/50 transition-colors"
          >
            <LogIn size={15} /> Login
          </button>
        ) : (
          <div className="px-3 pb-4 mb-2 border-b border-cream-dark">
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center font-serif text-lg text-accent mb-2">
              {(user.name ?? user.phone ?? "A")[0].toUpperCase()}
            </div>
            <p className="text-sm font-medium text-ink truncate">{user.name ?? "Artist"}</p>
            <p className="text-xs text-ink-faint truncate">{user.phone}</p>
          </div>
        )}

        {NAV_ITEMS.map(({ tab: t, label, icon: Icon }) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors text-left",
              tab === t
                ? "bg-accent/10 text-accent font-medium"
                : "text-ink-soft hover:text-ink hover:bg-cream-dark/50"
            )}
          >
            <Icon size={15} /> {label}
          </button>
        ))}

        <div className="mt-auto px-3">
          <div className="p-3 bg-accent/8 border border-accent/20 rounded-lg">
            <p className="text-xs font-medium text-ink mb-1">Get more leads</p>
            <p className="text-[11px] text-ink-soft mb-2">Promote your listing in Recommender Lens.</p>
            <button className="text-[11px] text-accent font-medium hover:underline">
              Upgrade →
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="flex-1 px-6 md:px-10 py-10 overflow-y-auto">

        {/* Mobile tab row */}
        <div className="flex gap-2 mb-8 overflow-x-auto md:hidden pb-2">
          {NAV_ITEMS.map(({ tab: t, label }) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors",
                tab === t ? "bg-accent text-cream border-accent" : "border-cream-dark text-ink-soft"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── MARKET PLACE tab ── */}
        {tab === "marketplace" && (
          <div>
            <div className="mb-8">
              <p className="section-label mb-1">Market Place</p>
              <h2 className="font-serif text-3xl text-ink">Open Commissions</h2>
              <p className="text-ink-soft text-sm mt-1">
                Requests from patrons seeking your craftsmanship.
              </p>
            </div>

            <div className="space-y-4">
              {MARKETPLACE_ITEMS.map((item) => (
                <div key={item.id} className="bg-cream-card border border-cream-dark rounded-xl p-6 hover:border-accent/30 transition-colors group">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full font-medium">
                          {item.type}
                        </span>
                        <span className="text-xs text-ink-faint">{item.postedAt}</span>
                      </div>
                      <h3 className="font-serif text-xl text-ink mb-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-ink-soft text-sm leading-relaxed max-w-2xl">
                        {item.desc}
                      </p>
                      <p className="text-xs text-ink-faint mt-3">Posted by {item.postedBy}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-serif text-xl text-ink">{item.budget}</p>
                      <p className="text-xs text-ink-faint mb-3">Budget</p>
                      <button className="btn-accent text-sm flex items-center gap-1.5">
                        View Details <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rules reminder */}
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <Ban size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ink-soft">
                <span className="font-medium text-ink">Reminder:</span> All pricing and communication must stay on-platform until the commission is complete.
                Offering lower prices directly to patrons results in immediate and permanent account deletion. <a href="/about" className="text-accent hover:underline">Read our rules →</a>
              </p>
            </div>
          </div>
        )}

        {/* ── CATALOGUE tab ── */}
        {tab === "catalogue" && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label mb-1">Your Catalogue</p>
                <h2 className="font-serif text-3xl text-ink">Your Portfolio</h2>
              </div>
              <button className="btn-accent flex items-center gap-2 text-sm">
                <Plus size={14} /> Add Work
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MY_PORTFOLIO.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-sm overflow-hidden bg-cream-dark shadow-warm">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors flex items-end p-3">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-cream text-sm font-medium">{item.title}</p>
                      <p className="text-cream/70 text-xs">{item.style}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Upload placeholder */}
              <div className="aspect-square rounded-sm border-2 border-dashed border-cream-dark flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-colors">
                <Upload size={20} className="text-ink-faint" />
                <span className="text-xs text-ink-faint">Upload Work</span>
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE tab ── */}
        {tab === "profile" && (
          <div className="max-w-lg">
            <p className="section-label mb-1">Your Profile</p>
            <h2 className="font-serif text-3xl text-ink mb-8">Artist Profile</h2>
            <div className="space-y-4">
              {[
                { label: "Display Name", placeholder: "Your artist name" },
                { label: "Bio", placeholder: "Tell patrons about your craft…" },
                { label: "Studio City", placeholder: "e.g. Jaipur, Rajasthan" },
                { label: "Instagram Handle", placeholder: "@yourhandle" },
                { label: "Starting Price (₹)", placeholder: "e.g. 2500" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="section-label block mb-1.5">{label}</label>
                  {label === "Bio" ? (
                    <textarea placeholder={placeholder} rows={3} className="input-warm w-full resize-none" />
                  ) : (
                    <input placeholder={placeholder} className="input-warm w-full" />
                  )}
                </div>
              ))}
              <button className="btn-accent">Save Profile</button>
            </div>
          </div>
        )}

        {/* ── SALES tab ── */}
        {tab === "sales" && (
          <div>
            <p className="section-label mb-1">Sales</p>
            <h2 className="font-serif text-3xl text-ink mb-8">Earnings Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Earnings", value: "₹34,200", sub: "All time" },
                { label: "This Month", value: "₹4,500", sub: "March 2026" },
                { label: "Pending Payout", value: "₹1,800", sub: "Processing" },
                { label: "Commissions Done", value: "63", sub: "Total orders" },
                { label: "Avg. Rating", value: "4.7 ★", sub: "Based on 38 reviews" },
                { label: "Profile Visits", value: "1,240", sub: "Last 30 days" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-cream-card border border-cream-dark rounded-xl p-5">
                  <p className="text-xs text-ink-faint mb-1">{label}</p>
                  <p className="font-serif text-2xl text-ink">{value}</p>
                  <p className="text-xs text-ink-faint mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
            <div className="bg-accent/8 border border-accent/20 rounded-xl p-5 flex items-start gap-4">
              <Star size={18} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-ink text-sm mb-1">Get featured in Recommender Lens</p>
                <p className="text-xs text-ink-soft mb-3">
                  Promoted artists appear at the top of patron search results, with a highlighted badge.
                  Starting at ₹499/month.
                </p>
                <button className="btn-accent text-sm">Promote My Listing</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
