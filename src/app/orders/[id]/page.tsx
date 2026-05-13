"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle, Clock, Star, Send, Loader2,
  Shield, Truck, Package, Paintbrush, MessageSquare, ThumbsUp,
  BadgeCheck, Phone, Instagram, ShieldCheck, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const ORDER = {
  id: "ord_001",
  title: "Madhubani Family Portrait",
  description: "Authentic Madhubani family portrait, 24×18 inches, with natural pigments on Khadi paper. 5 people + dog. Traditional Bihar borders and motifs.",
  artistName: "Aarav Patel",
  artistId: "artist_001",
  artistAvatar: "/images/aarav-patel.jpg",
  artistVerified: true,
  artistPhone: "+91 98765 43210",
  artistInstagram: "@aarav.miniatures",
  agreedPrice: 4500,
  status: "in_progress",
  estimatedDelivery: "2025-06-02",
  createdAt: "2025-05-10T10:00:00Z",
  artworkThumbnail: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600",
};

// Timeline milestones — progress tracker
const MILESTONES = [
  { id: "contacted",   label: "Artist Contacted",   desc: "You connected with the artist",           done: true,  date: "May 10" },
  { id: "accepted",    label: "Quote Accepted",     desc: "Price agreed — ₹4,500",                  done: true,  date: "May 11" },
  { id: "in_progress", label: "Work in Progress",   desc: "Artist has begun the portrait",            done: true,  date: "May 13" },
  { id: "review",      label: "Patron Review",      desc: "Artist submits for your approval",         done: false, date: "" },
  { id: "shipped",     label: "Shipped",            desc: "Handed to Ekart courier",                  done: false, date: "" },
  { id: "completed",   label: "Delivered",          desc: "Artwork arrives at your door",             done: false, date: "Est. Jun 2" },
];

interface Msg { id: string; role: "patron" | "artist" | "system"; name: string; body: string; time: string; }

const INIT_MSGS: Msg[] = [
  { id: "1", role: "system",  name: "System",      body: "Commission order created. Artist notified.", time: "May 11, 10:00" },
  { id: "2", role: "artist",  name: "Aarav Patel", body: "Namaste! Received the order — I'll start with the pencil sketches. Could you share a family photo for reference?", time: "May 11, 11:30" },
  { id: "3", role: "patron",  name: "You",         body: "Thank you Aarav! Photo sent over WhatsApp as per the contact details.", time: "May 11, 12:00" },
  { id: "4", role: "artist",  name: "Aarav Patel", body: "Perfect — received the photo. The composition is lovely. I'll share the sketch outline in 2-3 days for your feedback before I begin the colours.", time: "May 11, 12:30" },
  { id: "5", role: "system",  name: "System",      body: "Milestone update: Artist has begun the outline sketches (May 13)", time: "May 13, 09:00" },
];

export default function OrderDetailPage() {
  const { id }   = useParams() as { id: string };
  const { user } = useAuthStore();
  const router   = useRouter();

  const [msgs,       setMsgs]       = useState<Msg[]>(INIT_MSGS);
  const [newMsg,     setNewMsg]     = useState("");
  const [sending,    setSending]    = useState(false);
  const [reviewing,  setReviewing]  = useState(false);
  const [approved,   setApproved]   = useState(false);
  const [rating,     setRating]     = useState(0);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewed,   setReviewed]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => { if (!user) router.replace("/login"); }, [user, router]);
  if (!user) return null;

  const send = async () => {
    if (!newMsg.trim() || sending) return;
    const body = newMsg.trim();
    setNewMsg("");
    setSending(true);
    setMsgs((p) => [...p, { id: `m_${Date.now()}`, role: "patron", name: "You", body, time: "Just now" }]);
    await new Promise((r) => setTimeout(r, 300));
    setSending(false);
  };

  const handleApprove = async () => {
    setReviewing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setApproved(true);
    setReviewing(false);
    setMsgs((p) => [...p, {
      id: `m_sys_${Date.now()}`,
      role: "system", name: "System",
      body: "Artwork approved by patron. Commission marked complete. Shipping will begin within 48 hours.",
      time: "Just now",
    }]);
  };

  const handleReview = async () => {
    if (!rating) return;
    setReviewed(true);
    // TODO: POST to /api/reviews
  };

  const order = ORDER;
  const doneCount = MILESTONES.filter((m) => m.done).length;

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8">

        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent transition-colors mb-6">
          <ArrowLeft size={14} /> My Orders
        </Link>

        {/* Order header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="font-serif text-3xl text-ink">{order.title}</h1>
            <p className="text-ink-soft text-sm mt-1">Order #{order.id} · Created May 10, 2025</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl text-ink">₹{order.agreedPrice.toLocaleString()}</p>
            <p className="text-xs text-ink-faint">Agreed price</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">

          {/* ── Left ─────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Progress tracker */}
            <div className="bg-cream-card border border-cream-dark rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-lg text-ink">Progress</h2>
                <span className="text-xs text-ink-faint">{doneCount}/{MILESTONES.length} steps</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-cream-dark rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700"
                  style={{ width: `${(doneCount / MILESTONES.length) * 100}%` }}
                />
              </div>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-cream-dark" />

                <div className="space-y-5">
                  {MILESTONES.map((m, i) => (
                    <div key={m.id} className="flex gap-4 relative">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 relative z-10",
                        m.done
                          ? "bg-accent border-accent"
                          : i === doneCount
                            ? "bg-cream border-accent animate-pulse"
                            : "bg-cream border-cream-dark"
                      )}>
                        {m.done
                          ? <CheckCircle size={13} className="text-cream" />
                          : i === doneCount
                            ? <div className="w-2 h-2 bg-accent rounded-full" />
                            : <div className="w-2 h-2 bg-cream-dark rounded-full" />
                        }
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <p className={cn("text-sm font-medium", m.done ? "text-ink" : "text-ink-faint")}>{m.label}</p>
                          {m.date && <p className="text-xs text-ink-faint">{m.date}</p>}
                        </div>
                        <p className="text-xs text-ink-faint mt-0.5">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Approval panel — shown when artist submits for review */}
            {order.status === "review" && !approved && (
              <div className="bg-accent/5 border-2 border-accent rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Paintbrush size={18} className="text-accent" />
                  <h3 className="font-serif text-lg text-ink">Artwork Ready for Review</h3>
                </div>
                <p className="text-sm text-ink-soft mb-4">
                  Aarav has submitted the finished painting. Review the image carefully. Once you approve, shipping begins.
                </p>
                <div className="relative aspect-video rounded-sm overflow-hidden mb-4 border border-cream-dark">
                  <Image src={order.artworkThumbnail} alt="Submitted artwork" fill className="object-cover" />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={reviewing}
                    className="flex-1 btn-accent flex items-center justify-center gap-2"
                  >
                    {reviewing
                      ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
                      : <><ThumbsUp size={15} /> Approve & Ship</>
                    }
                  </button>
                  <button className="btn-outline flex items-center gap-2 text-sm">
                    Request Changes
                  </button>
                </div>
              </div>
            )}

            {/* Leave a review — shown after completion */}
            {(order.status === "completed" || approved) && !reviewed && (
              <div className="bg-cream-card border border-cream-dark rounded-xl p-6">
                <h3 className="font-serif text-lg text-ink mb-1">Leave a Review</h3>
                <p className="text-sm text-ink-soft mb-4">How was your experience with {order.artistName}?</p>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} onClick={() => setRating(s)}>
                      <Star size={28} className={cn(
                        "transition-colors",
                        s <= rating ? "fill-accent text-accent" : "text-cream-dark hover:text-accent/50"
                      )} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  rows={3}
                  placeholder="Describe the quality, communication, and overall experience…"
                  className="input-warm w-full resize-none text-sm mb-3"
                />
                <button
                  onClick={handleReview}
                  disabled={!rating}
                  className="btn-accent flex items-center gap-2 disabled:opacity-50"
                >
                  <Star size={14} /> Submit Review
                </button>
              </div>
            )}
            {reviewed && (
              <div className="flex items-center gap-2 text-accent text-sm bg-accent/5 border border-accent/20 rounded-xl p-4">
                <CheckCircle size={16} /> Review submitted — thank you!
              </div>
            )}

            {/* Certificate of Authenticity — completed orders */}
            {(order.status === "completed" || approved) && (
              <Link
                href={`/certificate/${order.id}`}
                className="group flex items-center gap-3 bg-cream-card border border-cream-dark rounded-xl p-4 hover:border-accent/30 hover:shadow-warm transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">Certificate of Authenticity</p>
                  <p className="text-xs text-ink-faint">Download or print your official provenance certificate</p>
                </div>
                <ChevronRight size={14} className="text-ink-faint group-hover:text-accent transition-colors" />
              </Link>
            )}

            {/* Messaging */}
            <div>
              <h2 className="font-serif text-xl text-ink mb-3 flex items-center gap-2">
                <MessageSquare size={18} className="text-accent" /> Messages
              </h2>
              <div className="bg-cream-card border border-cream-dark rounded-xl overflow-hidden">
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {msgs.map((msg) => (
                    <div key={msg.id} className={cn(
                      "flex",
                      msg.role === "system" ? "justify-center" :
                      msg.role === "patron" ? "justify-end" : "justify-start"
                    )}>
                      {msg.role === "system" ? (
                        <div className="flex items-center gap-2 bg-cream border border-cream-dark rounded-full px-4 py-1.5 text-xs text-ink-faint">
                          <Shield size={10} className="text-accent" /> {msg.body}
                        </div>
                      ) : (
                        <div className={cn(
                          "max-w-[80%] rounded-xl px-4 py-3",
                          msg.role === "patron"
                            ? "bg-accent text-cream rounded-br-none"
                            : "bg-cream border border-cream-dark text-ink rounded-bl-none shadow-warm"
                        )}>
                          <p className={cn("text-[10px] font-medium mb-1", msg.role === "patron" ? "text-cream/70" : "text-ink-faint")}>
                            {msg.name} · {msg.time}
                          </p>
                          <p className="text-sm leading-relaxed">{msg.body}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div className="border-t border-cream-dark p-3 flex gap-2 bg-cream">
                  <input
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Message the artist…"
                    className="flex-1 input-warm text-sm"
                  />
                  <button
                    onClick={send}
                    disabled={!newMsg.trim() || sending}
                    className="p-2 bg-ink text-cream rounded-md disabled:opacity-40 hover:bg-ink/80 transition-colors"
                  >
                    {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ─────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Artist card */}
            <div className="bg-cream-card border border-cream-dark rounded-xl p-5">
              <p className="section-label mb-3">Your Artist</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-cream-dark">
                  <Image src={order.artistAvatar} alt={order.artistName} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-ink text-sm">{order.artistName}</p>
                    {order.artistVerified && <BadgeCheck size={13} className="text-accent" />}
                  </div>
                  <Link href={`/artists/${order.artistId}`} className="text-xs text-accent hover:underline">View profile</Link>
                </div>
              </div>
              <div className="space-y-2.5 border-t border-cream-dark pt-4">
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone size={13} className="text-accent flex-shrink-0" />
                  <span className="text-ink font-medium">{order.artistPhone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Instagram size={13} className="text-accent flex-shrink-0" />
                  <span className="text-ink font-medium">{order.artistInstagram}</span>
                </div>
              </div>
            </div>

            {/* Order details */}
            <div className="bg-cream-card border border-cream-dark rounded-xl p-5 space-y-3">
              <p className="section-label">Order Details</p>
              {[
                { label: "Agreed Price",  value: `₹${order.agreedPrice.toLocaleString()}` },
                { label: "Est. Delivery", value: new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day:"numeric", month:"long" }) },
                { label: "Status",        value: "In Progress" },
                { label: "Order ID",      value: order.id },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm border-b border-cream-dark pb-2 last:border-0 last:pb-0">
                  <span className="text-ink-soft">{label}</span>
                  <span className="font-medium text-ink text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Delivery info */}
            <div className="bg-cream-card border border-cream-dark rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={14} className="text-accent" />
                <p className="text-sm font-medium text-ink">Delivery via Ekart</p>
              </div>
              <p className="text-xs text-ink-soft">Tracking link will appear here once the artwork is handed to the courier. Insured up to ₹10,000.</p>
              <div className="mt-3 flex items-center gap-2 bg-cream border border-cream-dark rounded-lg p-3">
                <Package size={13} className="text-ink-faint flex-shrink-0" />
                <span className="text-xs text-ink-faint">Awaiting dispatch</span>
              </div>
            </div>

            {/* Platform protection */}
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Shield size={13} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-ink-soft leading-relaxed">
                  Keep all payment and final delivery through ARTERY. Off-platform transactions void your protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
