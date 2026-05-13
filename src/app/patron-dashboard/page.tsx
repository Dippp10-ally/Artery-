"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles, Image as ImageIcon, Users, ShoppingBag, Settings,
  ChevronRight, Star, Clock, Download, Trash2, BadgeCheck,
  Phone, Instagram, MapPin, CheckCircle, Loader2, LogOut,
  Crown, Save, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { MOCK_ARTISTS } from "@/mock/artists";
import { WarliArt } from "@/components/ui/WarliArt";

type Tab = "images" | "artists" | "orders" | "settings";

// Mock generated image history
const MOCK_IMAGES = [
  { id: "img_001", prompt: "Mughal garden at dusk with diyas", style: "madhubani", url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=400", createdAt: "May 10", saved: true },
  { id: "img_002", prompt: "Varanasi ghat at sunrise, soft watercolour", style: "watercolor", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400", createdAt: "May 8", saved: true },
  { id: "img_003", prompt: "Abstract Mumbai skyline oil painting", style: "oil-painting", url: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=400", createdAt: "May 5", saved: false },
  { id: "img_004", prompt: "Kerala backwaters with coconut trees", style: "watercolor", url: "https://images.unsplash.com/photo-1605634288001-c8c3e8774775?q=80&w=400", createdAt: "May 2", saved: false },
  { id: "img_005", prompt: "Gond art forest with animals at night", style: "gond", url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=400", createdAt: "Apr 29", saved: true },
  { id: "img_006", prompt: "Geometric Rangoli pattern in gold", style: "geometric", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400", createdAt: "Apr 25", saved: false },
];

const MOCK_ORDERS = [
  { id: "ord_001", title: "Madhubani Family Portrait", artistName: "Aarav Patel", artistId: "artist_001", status: "in_progress", agreedPrice: 4500, estimatedDelivery: "Jun 2" },
  { id: "ord_002", title: "Watercolor Ghat Scene", artistName: "Priya Singh", artistId: "artist_002", status: "review", agreedPrice: 3200, estimatedDelivery: "May 28" },
  { id: "ord_003", title: "Oil Abstract — Mumbai", artistName: "Rohan Gupta", artistId: "artist_003", status: "completed", agreedPrice: 7200, estimatedDelivery: "Apr 15" },
];

const STATUS_COLORS: Record<string, string> = {
  contacted:   "text-blue-600 bg-blue-50 border-blue-200",
  in_progress: "text-accent bg-accent/10 border-accent/20",
  review:      "text-orange-600 bg-orange-50 border-orange-200",
  completed:   "text-green-700 bg-green-50 border-green-200",
  cancelled:   "text-ink-faint bg-cream border-cream-dark",
};

export default function PatronDashboard() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const searchParams = useSearchParams();

  const initTab = (searchParams.get("tab") as Tab) ?? "images";
  const [tab,     setTab]     = useState<Tab>(initTab);
  const [images,  setImages]  = useState(MOCK_IMAGES);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  // Settings form state
  const [name,     setName]     = useState(user?.name ?? "");
  const [phone,    setPhone]    = useState(user?.phone ?? "");

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);
  if (!user) return null;

  const connectedArtists = (MOCK_ARTISTS as any[]).filter((a) =>
    user.connectedArtists?.includes(a.id)
  );

  const savedImages = images.filter((img) => img.saved);
  const allImages   = images;

  const toggleSave = (id: string) => {
    setImages((prev) => prev.map((img) => img.id === id ? { ...img, saved: !img.saved } : img));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setUser({ ...user!, name });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const NAV: { tab: Tab; label: string; icon: any; badge?: number }[] = [
    { tab: "images",   label: "Generated Images",   icon: ImageIcon, badge: savedImages.length },
    { tab: "artists",  label: "Connected Artists",  icon: Users,     badge: connectedArtists.length },
    { tab: "orders",   label: "My Orders",          icon: ShoppingBag, badge: MOCK_ORDERS.filter((o) => o.status !== "completed").length },
    { tab: "settings", label: "Account Settings",   icon: Settings },
  ];

  return (
    <div className="bg-cream min-h-screen flex">

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 border-r border-cream-dark bg-cream-card flex flex-col py-8 px-4 gap-1 sticky top-16 h-[calc(100vh-4rem)] hidden md:flex">

        {/* Avatar + name */}
        <div className="px-3 pb-5 mb-2 border-b border-cream-dark">
          <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center font-serif text-xl text-accent mb-3">
            {(user.name ?? user.phone ?? "P")[0].toUpperCase()}
          </div>
          <p className="font-medium text-sm text-ink truncate">{user.name ?? "Patron"}</p>
          <p className="text-xs text-ink-faint truncate">{user.phone}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Crown size={11} className="text-accent" />
            <span className="text-xs text-accent capitalize font-medium">{user.subscription ?? "basic"} plan</span>
          </div>
        </div>

        {NAV.map(({ tab: t, label, icon: Icon, badge }) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors text-left w-full",
              tab === t
                ? "bg-accent/10 text-accent font-medium"
                : "text-ink-soft hover:text-ink hover:bg-cream-dark/50"
            )}
          >
            <Icon size={15} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {badge !== undefined && badge > 0 && (
              <span className="text-[10px] bg-accent text-cream rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {badge}
              </span>
            )}
          </button>
        ))}

        <div className="mt-auto px-3">
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-2 text-sm text-ink-faint hover:text-red-500 transition-colors w-full"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────── */}
      <main className="flex-1 px-6 md:px-10 py-10 overflow-y-auto">

        {/* Mobile tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto md:hidden pb-2">
          {NAV.map(({ tab: t, label }) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors",
                tab === t ? "bg-accent text-cream border-accent" : "border-cream-dark text-ink-soft"
              )}>
              {label}
            </button>
          ))}
        </div>

        {/* ── IMAGES TAB ─────────────────────────────────────────── */}
        {tab === "images" && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="section-label mb-1">AI Studio</p>
                <h2 className="font-serif text-3xl text-ink">Generated Images</h2>
                <p className="text-ink-soft text-sm mt-1">{allImages.length} total · {savedImages.length} saved</p>
              </div>
              <Link href="/generate" className="btn-accent flex items-center gap-2 text-sm">
                <Sparkles size={14} /> Generate More
              </Link>
            </div>

            {allImages.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-xl text-ink-soft mb-4">No images yet</p>
                <Link href="/generate" className="btn-accent inline-flex items-center gap-2">
                  <Sparkles size={14} /> Generate Your First Image
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allImages.map((img) => (
                  <div key={img.id} className="group relative aspect-square rounded-sm overflow-hidden border border-cream-dark shadow-warm">
                    <Image src={img.url} alt={img.prompt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-cream text-xs font-medium line-clamp-2 mb-2">{img.prompt}</p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => toggleSave(img.id)}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium transition-all",
                            img.saved
                              ? "bg-accent text-cream"
                              : "bg-cream/20 text-cream hover:bg-cream/30"
                          )}
                        >
                          <Save size={11} /> {img.saved ? "Saved" : "Save"}
                        </button>
                        <a
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center p-1.5 rounded bg-cream/20 text-cream hover:bg-cream/30 transition-all"
                        >
                          <Download size={11} />
                        </a>
                        <Link
                          href={`/commissions/new?mode=post&imageUrl=${encodeURIComponent(img.url)}&prompt=${encodeURIComponent(img.prompt)}&style=${img.style}`}
                          className="flex items-center justify-center p-1.5 rounded bg-cream/20 text-cream hover:bg-cream/30 transition-all"
                        >
                          <Globe size={11} />
                        </Link>
                      </div>
                    </div>
                    {img.saved && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-cream" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] bg-ink/60 text-cream px-1.5 py-0.5 rounded-full">{img.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ARTISTS TAB ────────────────────────────────────────── */}
        {tab === "artists" && (
          <div>
            <div className="mb-6">
              <p className="section-label mb-1">Network</p>
              <h2 className="font-serif text-3xl text-ink">Connected Artists</h2>
              <p className="text-ink-soft text-sm mt-1">
                Artists whose contact details you've unlocked.
              </p>
            </div>

            {connectedArtists.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-xl text-ink-soft mb-2">No connections yet</p>
                <p className="text-sm text-ink-faint mb-6">Browse the directory and unlock an artist's contact to commission them.</p>
                <Link href="/lens" className="btn-accent inline-flex items-center gap-2">
                  <Users size={14} /> Browse Artists
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {connectedArtists.map((artist: any) => (
                  <div key={artist.id} className="bg-cream-card border border-cream-dark rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-cream-dark">
                        {artist.avatar
                          ? <Image src={artist.avatar} alt={artist.displayName} fill className="object-cover" />
                          : <div className="w-full h-full bg-accent/15 flex items-center justify-center font-serif text-accent text-xl">{artist.displayName[0]}</div>
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="font-serif text-lg text-ink">{artist.displayName}</p>
                          {artist.verified && <BadgeCheck size={14} className="text-accent" />}
                        </div>
                        <p className="text-xs text-ink-faint flex items-center gap-1 mb-3">
                          <MapPin size={10} /> {artist.location}
                        </p>
                        <div className="space-y-1.5 border-t border-cream-dark pt-3">
                          {artist.contact?.phone && (
                            <p className="flex items-center gap-2 text-sm text-ink">
                              <Phone size={12} className="text-accent" /> {artist.contact.phone}
                            </p>
                          )}
                          {artist.contact?.instagram && (
                            <p className="flex items-center gap-2 text-sm text-ink">
                              <Instagram size={12} className="text-accent" /> {artist.contact.instagram}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-cream-dark">
                      <Link href={`/artists/${artist.id}`} className="flex-1 btn-outline text-xs py-2 text-center">
                        View Profile
                      </Link>
                      <Link
                        href={`/commissions/new?mode=find&style=${artist.styles?.[0] ?? ""}`}
                        className="flex-1 btn-accent text-xs py-2 text-center"
                      >
                        Commission
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ─────────────────────────────────────────── */}
        {tab === "orders" && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="section-label mb-1">Your Commissions</p>
                <h2 className="font-serif text-3xl text-ink">My Orders</h2>
              </div>
              <Link href="/commissions/new?mode=post" className="btn-accent text-sm flex items-center gap-2">
                <Globe size={14} /> Post Commission
              </Link>
            </div>

            {MOCK_ORDERS.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-xl text-ink-soft mb-4">No orders yet</p>
                <Link href="/generate" className="btn-accent inline-flex items-center gap-2">
                  <Sparkles size={14} /> Start with Generate
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {MOCK_ORDERS.map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`}
                    className="group flex items-center gap-4 bg-cream-card border border-cream-dark rounded-xl p-5 hover:border-accent/30 hover:shadow-warm transition-all">
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-serif text-lg text-ink group-hover:text-accent transition-colors">{order.title}</h3>
                          <p className="text-xs text-ink-faint mt-0.5">with {order.artistName} · ₹{order.agreedPrice.toLocaleString()}</p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border",
                          STATUS_COLORS[order.status] ?? STATUS_COLORS.contacted
                        )}>
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-ink-faint flex items-center gap-1">
                          <Clock size={10} /> Est. {order.estimatedDelivery}
                        </span>
                        <span className="text-accent text-xs flex items-center gap-1 group-hover:gap-2 transition-all font-medium">
                          {order.status === "review" ? "Review Artwork" : "Track Order"} <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ───────────────────────────────────────── */}
        {tab === "settings" && (
          <div className="max-w-lg">
            <p className="section-label mb-1">Account</p>
            <h2 className="font-serif text-3xl text-ink mb-8">Account Settings</h2>

            <div className="space-y-5">
              {/* Profile */}
              <div className="bg-cream-card border border-cream-dark rounded-xl p-6 space-y-4">
                <h3 className="font-serif text-lg text-ink">Profile</h3>
                <div>
                  <label className="section-label block mb-1.5">Display Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input-warm w-full" />
                </div>
                <div>
                  <label className="section-label block mb-1.5">Phone Number</label>
                  <input value={phone} disabled className="input-warm w-full opacity-60 cursor-not-allowed" />
                  <p className="text-xs text-ink-faint mt-1">Phone number cannot be changed. It's your login identity.</p>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="btn-accent flex items-center gap-2 disabled:opacity-60"
                >
                  {saving
                    ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                    : saved
                      ? <><CheckCircle size={14} /> Saved!</>
                      : <><Save size={14} /> Save Changes</>
                  }
                </button>
              </div>

              {/* Subscription */}
              <div className="bg-cream-card border border-cream-dark rounded-xl p-6">
                <h3 className="font-serif text-lg text-ink mb-1">Subscription</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Crown size={14} className="text-accent" />
                  <span className="text-sm font-medium text-ink capitalize">{user.subscription ?? "basic"} plan</span>
                </div>
                {[
                  { plan: "basic",   label: "Basic",           desc: "Free forever · ₹299 per connection", price: 0 },
                  { plan: "pro",     label: "Pro Collector",   desc: "₹149 per connection · 3 free/month", price: 499 },
                  { plan: "premium", label: "Premium Patron",  desc: "Zero commission fees · unlimited",    price: 999 },
                ].map((p) => (
                  <div key={p.plan} className={cn(
                    "flex items-center justify-between p-3 rounded-lg border mb-2 last:mb-0",
                    user.subscription === p.plan
                      ? "border-accent bg-accent/5"
                      : "border-cream-dark"
                  )}>
                    <div>
                      <p className="text-sm font-medium text-ink">{p.label}</p>
                      <p className="text-xs text-ink-faint">{p.desc}</p>
                    </div>
                    {user.subscription === p.plan ? (
                      <span className="text-xs text-accent font-medium flex items-center gap-1"><CheckCircle size={11} /> Current</span>
                    ) : (
                      <Link href="/subscription" className="text-xs btn-outline px-3 py-1.5">Upgrade</Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-serif text-lg text-ink mb-1">Danger Zone</h3>
                <p className="text-sm text-ink-soft mb-4">These actions are permanent and cannot be undone.</p>
                <button
                  onClick={() => { logout(); router.push("/"); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
