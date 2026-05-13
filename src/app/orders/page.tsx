"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, ChevronRight, Clock, CheckCircle, AlertCircle, Loader2, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { WarliArt } from "@/components/ui/WarliArt";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  contacted:   { label: "Contacted",   color: "text-blue-600 bg-blue-50 border-blue-200",   icon: Clock },
  quoted:      { label: "Quote Received", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  accepted:    { label: "Accepted",    color: "text-purple-600 bg-purple-50 border-purple-200", icon: CheckCircle },
  in_progress: { label: "In Progress", color: "text-accent bg-accent/10 border-accent/20",   icon: Loader2 },
  review:      { label: "Under Review",color: "text-orange-600 bg-orange-50 border-orange-200", icon: Star },
  completed:   { label: "Completed",   color: "text-green-700 bg-green-50 border-green-200",  icon: CheckCircle },
  cancelled:   { label: "Cancelled",   color: "text-ink-faint bg-cream border-cream-dark",   icon: AlertCircle },
  disputed:    { label: "Disputed",    color: "text-red-600 bg-red-50 border-red-200",        icon: AlertCircle },
};

const MOCK_ORDERS = [
  {
    id: "ord_001",
    title: "Madhubani Family Portrait",
    artistName: "Aarav Patel",
    artistId: "artist_001",
    artistAvatar: "/images/aarav-patel.jpg",
    agreedPrice: 4500,
    status: "in_progress",
    estimatedDelivery: "2025-06-02",
    artworkThumbnail: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=200",
    createdAt: "2025-05-10T10:00:00Z",
    lastUpdate: "Artist has begun the outline sketches",
  },
  {
    id: "ord_002",
    title: "Watercolor Ghat Scene",
    artistName: "Priya Singh",
    artistId: "artist_002",
    artistAvatar: "/images/priya-singh.png",
    agreedPrice: 3200,
    status: "review",
    estimatedDelivery: "2025-05-28",
    artworkThumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200",
    createdAt: "2025-04-28T09:00:00Z",
    lastUpdate: "Artist has submitted the finished work for your review",
  },
  {
    id: "ord_003",
    title: "Oil Abstract — Mumbai Skyline",
    artistName: "Rohan Gupta",
    artistId: "artist_003",
    artistAvatar: "/images/rohan-profile.png",
    agreedPrice: 7200,
    status: "completed",
    estimatedDelivery: "2025-04-15",
    artworkThumbnail: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=200",
    createdAt: "2025-03-20T08:00:00Z",
    lastUpdate: "Delivered via Ekart. Enjoy your artwork!",
  },
];

export default function OrdersPage() {
  const { user } = useAuthStore();
  const router   = useRouter();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);
  if (!user) return null;

  const active    = MOCK_ORDERS.filter((o) => !["completed","cancelled"].includes(o.status));
  const past      = MOCK_ORDERS.filter((o) =>  ["completed","cancelled"].includes(o.status));

  return (
    <div className="bg-cream min-h-screen">

      {/* Header */}
      <section className="relative border-b border-cream-dark py-12 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.045} className="w-full h-full" />
        </div>
        <div className="max-w-5xl mx-auto">
          <p className="section-label mb-2">Your Account</p>
          <h1 className="font-serif text-4xl text-ink">Order History</h1>
          <p className="text-ink-soft text-sm mt-1">Track your active commissions and view past orders.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 space-y-10">

        {/* Active orders */}
        {active.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-ink mb-4">Active Commissions</h2>
            <div className="space-y-3">
              {active.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Past orders */}
        {past.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-ink mb-4">Past Orders</h2>
            <div className="space-y-3">
              {past.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {MOCK_ORDERS.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto opacity-20 mb-4">
              <WarliArt variant="scatter" opacity={1} className="w-full h-full" />
            </div>
            <p className="font-serif text-xl text-ink-soft mb-2">No orders yet</p>
            <p className="text-sm text-ink-faint mb-6">Commission an artist or post a request to get started.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/generate" className="btn-outline flex items-center gap-2 text-sm">
                <Sparkles size={14} /> Generate Artwork
              </Link>
              <Link href="/lens" className="btn-accent flex items-center gap-2">
                <ShoppingBag size={14} /> Browse Artists
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: typeof MOCK_ORDERS[0] }) {
  const cfg    = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.contacted;
  const Icon   = cfg.icon;
  const isActive = !["completed","cancelled"].includes(order.status);

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group flex gap-4 bg-cream-card border border-cream-dark rounded-xl p-5 hover:border-accent/30 hover:shadow-warm transition-all"
    >
      {/* Artwork thumb */}
      <div className="relative w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 border border-cream-dark">
        <Image src={order.artworkThumbnail} alt={order.title} fill className="object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg text-ink group-hover:text-accent transition-colors leading-tight">
              {order.title}
            </h3>
            <p className="text-xs text-ink-faint mt-0.5">with {order.artistName} · ₹{order.agreedPrice.toLocaleString()}</p>
          </div>
          <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0", cfg.color)}>
            <Icon size={11} className={order.status === "in_progress" ? "animate-spin" : ""} />
            {cfg.label}
          </span>
        </div>
        <p className="text-sm text-ink-soft mt-2 line-clamp-1">{order.lastUpdate}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-ink-faint flex items-center gap-1">
            <Clock size={11} />
            Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
          </span>
          <span className="text-accent text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            {order.status === "review" ? "Review & Approve" : "View Details"}
            <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
