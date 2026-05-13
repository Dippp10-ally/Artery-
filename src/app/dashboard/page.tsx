"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard, Bookmark, ShoppingBag, Users, Sparkles,
  BadgeCheck, Clock, Truck, CheckCircle, XCircle, Star,
  Phone, Instagram, MapPin, Crown, ChevronRight, Scan
} from "lucide-react";
import { cn, formatCurrency, timeAgo } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { MOCK_ARTISTS } from "@/mock/artists";
import { MOCK_ORDERS, MOCK_GENERATED_IMAGES } from "@/mock/orders";

const ORDER_STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-400/10", icon: Clock },
  ACCEPTED: { label: "Accepted", color: "text-blue-400", bg: "bg-blue-400/10", icon: BadgeCheck },
  IN_PROGRESS: { label: "In Progress", color: "text-purple-400", bg: "bg-purple-400/10", icon: Sparkles },
  COMPLETED: { label: "Completed", color: "text-sage", bg: "bg-sage/10", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "text-crimson", bg: "bg-crimson/10", icon: XCircle },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<"overview" | "saved" | "orders" | "artists">("overview");

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-bg-base">
        <div className="card-surface p-10 text-center max-w-sm w-full">
          <LayoutDashboard className="w-12 h-12 text-ink-muted mx-auto mb-4" />
          <p className="text-ink-primary font-semibold mb-2">Sign in to access your dashboard</p>
          <Link href="/login" className="btn-gold inline-flex items-center gap-2 mt-4">
            Sign In with Phone
          </Link>
        </div>
      </div>
    );
  }

  const connectedArtists = MOCK_ARTISTS.filter((a) => user.connectedArtists.includes(a.id));
  const savedImages = MOCK_GENERATED_IMAGES.filter((img) => user.savedImages.includes(img.id));
  const orders = MOCK_ORDERS.filter((o) => o.customerId === user.id);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "saved", label: `Saved (${savedImages.length})`, icon: Bookmark },
    { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
    { id: "artists", label: `Connected (${connectedArtists.length})`, icon: Users },
  ] as const;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-base">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display text-4xl font-light text-ink-primary">
              Welcome, <span className="gradient-text-gold italic">{user.name ?? "Art Lover"}</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-ink-muted text-sm">{user.phone}</span>
              <span className={cn(
                "inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize",
                user.subscription === "premium" ? "bg-gold/10 border-gold/40 text-gold" :
                user.subscription === "pro" ? "bg-blue-400/10 border-blue-400/40 text-blue-400" :
                "bg-border text-ink-muted"
              )}>
                {user.subscription === "premium" && <Crown className="w-3 h-3" />}
                {user.subscription === "pro" && <Star className="w-3 h-3" />}
                {user.subscription} plan
              </span>
            </div>
          </div>
          <Link href="/subscription" className="btn-outline-gold text-sm flex items-center gap-2">
            <Star className="w-3.5 h-3.5" /> Upgrade
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Saved Images", value: savedImages.length, icon: Bookmark, color: "text-gold" },
            { label: "Orders Placed", value: orders.length, icon: ShoppingBag, color: "text-purple-400" },
            { label: "Connected Artists", value: connectedArtists.length, icon: Users, color: "text-sage" },
            { label: "Subscription", value: user.subscription, icon: Crown, color: "text-blue-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card-surface p-5">
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <p className="text-2xl font-bold text-ink-primary capitalize">{value}</p>
              <p className="text-ink-muted text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-bg-elevated border border-border mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as typeof tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                tab === id
                  ? "bg-gold text-bg-base shadow-gold"
                  : "text-ink-secondary hover:text-ink-primary"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent order */}
              {orders[0] && (() => {
                const order = orders[0];
                const artist = MOCK_ARTISTS.find((a) => a.id === order.artistId);
                const cfg = ORDER_STATUS_CONFIG[order.status];
                const StatusIcon = cfg.icon;
                return (
                  <div className="card-surface p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-ink-primary font-semibold">Latest Order</p>
                      <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" />{cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0">
                        <Image src={`https://picsum.photos/seed/${order.generatedImageId}/200/200`} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-ink-primary font-medium text-sm">{artist?.businessName}</p>
                        <p className="text-ink-muted text-xs">{artist?.contact.studioCity}</p>
                        <p className="text-gold font-mono text-sm mt-1">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                    {order.deliveryInfo && (
                      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-ink-secondary">
                        <Truck className="w-3.5 h-3.5 text-blue-400" />
                        Tracking: {order.deliveryInfo.trackingId ?? "Pending"}
                        <span className="ml-auto">{order.deliveryInfo.status}</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Quick actions */}
              <div className="card-surface p-6">
                <p className="text-ink-primary font-semibold mb-4">Quick Actions</p>
                <div className="space-y-3">
                  <Link href="/generate" className="flex items-center gap-3 p-3 rounded-xl bg-bg-base border border-border hover:border-gold/30 transition-all group">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-ink-primary text-sm font-medium group-hover:text-gold transition-colors">Generate New Art</p>
                      <p className="text-ink-muted text-xs">Free · unlimited</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-muted ml-auto" />
                  </Link>
                  <Link href="/lens" className="flex items-center gap-3 p-3 rounded-xl bg-bg-base border border-border hover:border-gold/30 transition-all group">
                    <Scan className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-ink-primary text-sm font-medium group-hover:text-gold transition-colors">Find New Artists</p>
                      <p className="text-ink-muted text-xs">200+ verified artists</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-muted ml-auto" />
                  </Link>
                  <Link href="/subscription" className="flex items-center gap-3 p-3 rounded-xl bg-bg-base border border-border hover:border-gold/30 transition-all group">
                    <Crown className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-ink-primary text-sm font-medium group-hover:text-gold transition-colors">Upgrade Plan</p>
                      <p className="text-ink-muted text-xs">Save up to 35% on commissions</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-muted ml-auto" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved images */}
        {tab === "saved" && (
          <div>
            {savedImages.length === 0 ? (
              <div className="card-surface py-16 text-center">
                <Bookmark className="w-10 h-10 text-ink-muted mx-auto mb-4" />
                <p className="text-ink-secondary mb-4">No saved images yet</p>
                <Link href="/generate" className="btn-gold text-sm inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Generate & Save
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedImages.map((img) => (
                  <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-gold/40 transition-all">
                    <Image src={img.url} alt={img.prompt} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-base to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-xs text-ink-secondary line-clamp-2">{img.prompt}</p>
                        <div className="flex gap-2 mt-2">
                          <Link href="/lens" className="flex-1 text-xs text-center py-1.5 rounded-lg bg-gold text-bg-base font-semibold">
                            Find Artists
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="card-surface py-16 text-center">
                <ShoppingBag className="w-10 h-10 text-ink-muted mx-auto mb-4" />
                <p className="text-ink-secondary mb-4">No orders placed yet</p>
                <Link href="/lens" className="btn-gold text-sm inline-flex items-center gap-2">Find Artists</Link>
              </div>
            ) : orders.map((order) => {
              const artist = MOCK_ARTISTS.find((a) => a.id === order.artistId);
              const cfg = ORDER_STATUS_CONFIG[order.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={order.id} className="card-surface p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-ink-primary font-semibold">{artist?.businessName}</p>
                      <p className="text-ink-muted text-xs">{timeAgo(order.createdAt)}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />{cfg.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-ink-muted text-xs">Commission</p>
                      <p className="text-ink-primary font-mono">{formatCurrency(order.commissionFee)}</p>
                    </div>
                    <div>
                      <p className="text-ink-muted text-xs">Delivery</p>
                      <p className="text-ink-primary font-mono">{formatCurrency(order.deliveryCharge)}</p>
                    </div>
                    <div>
                      <p className="text-ink-muted text-xs">Total</p>
                      <p className="text-gold font-bold font-mono">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                  {order.deliveryInfo && (
                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-ink-secondary">
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                      Tracking: {order.deliveryInfo.trackingId}
                      <span className="ml-auto text-ink-primary">{order.deliveryInfo.status}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Connected artists */}
        {tab === "artists" && (
          <div>
            {connectedArtists.length === 0 ? (
              <div className="card-surface py-16 text-center">
                <Users className="w-10 h-10 text-ink-muted mx-auto mb-4" />
                <p className="text-ink-secondary mb-4">No connected artists yet</p>
                <Link href="/lens" className="btn-gold text-sm inline-flex items-center gap-2">
                  <Scan className="w-4 h-4" /> Find Artists
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {connectedArtists.map((artist) => (
                  <div key={artist.id} className="card-surface p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold/30">
                        <Image src={artist.avatar ?? `https://picsum.photos/seed/${artist.id}/200/200`} alt={artist.displayName} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-ink-primary font-semibold">{artist.businessName}</p>
                        <div className="flex items-center gap-1 text-ink-muted text-xs">
                          <MapPin className="w-3 h-3" />{artist.contact.studioCity}
                        </div>
                      </div>
                      <BadgeCheck className="w-4 h-4 text-sage ml-auto" />
                    </div>

                    {/* Unlocked contact — always visible after connection */}
                    <div className="space-y-1.5 bg-bg-base rounded-lg p-3 border border-border">
                      <p className="text-xs text-ink-muted font-medium flex items-center gap-1.5 mb-2">
                        <BadgeCheck className="w-3.5 h-3.5 text-sage" /> Contact Unlocked
                      </p>
                      <p className="text-sm text-ink-primary flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gold" />{artist.contact.phone}
                      </p>
                      {artist.contact.instagram && (
                        <p className="text-sm text-ink-primary flex items-center gap-2">
                          <Instagram className="w-3.5 h-3.5 text-gold" />{artist.contact.instagram}
                        </p>
                      )}
                    </div>

                    <Link href={`/artists/${artist.id}`} className="mt-4 flex items-center justify-center gap-2 text-sm btn-outline-gold w-full h-9">
                      View Profile <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
