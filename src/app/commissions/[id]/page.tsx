"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Send, IndianRupee, Clock, CheckCircle,
  Star, Shield, ChevronRight, Loader2, BadgeCheck, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { MOCK_ARTISTS } from "@/mock/artists";

// Mock data for the commission detail
const MOCK_REQUEST = {
  id: "req_001",
  title: "Madhubani Family Portrait — 5 people + dog",
  description: "Looking for an authentic Madhubani style portrait of my family — 5 people including two children and our dog. Need it done in Bihar Madhubani style with natural pigments on handmade paper. The painting should be approximately 24×18 inches. The reference photo will be provided. Please include traditional Madhubani borders and motifs.",
  style: "madhubani",
  budgetMin: 3000,
  budgetMax: 6000,
  deadlineDays: 30,
  patronName: "Amit Sharma",
  postedAt: "2025-05-10T10:00:00Z",
  imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600",
  status: "open",
  quotesCount: 3,
};

const MOCK_QUOTES = [
  {
    id: "q_001",
    artistId: "artist_001",
    artistName: "Aarav Patel",
    artistLocation: "Jaipur, Rajasthan",
    artistRating: 4.9,
    artistVerified: true,
    price: 4500,
    turnaroundDays: 25,
    note: "I would be honoured to paint your family in the Madhubani tradition. I use hand-ground mineral pigments on thick Khadi paper — the colours will last generations. I've done 12 family portraits in this style.",
    avatar: "/images/aarav-patel.jpg",
    status: "pending",
  },
  {
    id: "q_002",
    artistId: "artist_002",
    artistName: "Priya Singh",
    artistLocation: "Varanasi, UP",
    artistRating: 4.8,
    artistVerified: true,
    price: 3800,
    turnaroundDays: 28,
    note: "Beautiful commission! While my speciality is watercolour, I trained in Madhubani under Master Sita Devi's lineage. I can deliver the authentic Bihar style you're looking for, with natural pigments and the intricate line work the tradition demands.",
    avatar: "/images/priya-singh.png",
    status: "pending",
  },
];

interface Message {
  id: string;
  senderName: string;
  senderRole: "patron" | "artist" | "system";
  body: string;
  createdAt: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "m_001",
    senderName: "System",
    senderRole: "system",
    body: "Commission request posted to the marketplace. Artists can now view and submit quotes.",
    createdAt: "2025-05-10T10:00:00Z",
  },
  {
    id: "m_002",
    senderName: "Aarav Patel",
    senderRole: "artist",
    body: "Namaste! I've submitted my quote. Happy to share portfolio of similar Madhubani family portraits I've done if you'd like to see before deciding.",
    createdAt: "2025-05-10T11:30:00Z",
  },
  {
    id: "m_003",
    senderName: "Amit Sharma",
    senderRole: "patron",
    body: "Thank you Aarav! Yes please share the portfolio — that would help a lot in deciding.",
    createdAt: "2025-05-10T12:00:00Z",
  },
];

export default function CommissionDetailPage() {
  const { id }     = useParams() as { id: string };
  const router     = useRouter();
  const { user }   = useAuthStore();
  const bottomRef  = useRef<HTMLDivElement>(null);

  const [messages,     setMessages]     = useState<Message[]>(MOCK_MESSAGES);
  const [newMsg,       setNewMsg]       = useState("");
  const [sending,      setSending]      = useState(false);
  const [acceptingId,  setAcceptingId]  = useState("");
  const [accepted,     setAccepted]     = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const req    = MOCK_REQUEST;
  const quotes = MOCK_QUOTES;
  const isOwner = true; // In production: check user.id === req.patron_id

  const sendMessage = async () => {
    if (!newMsg.trim() || sending) return;
    const body = newMsg.trim();
    setNewMsg("");
    setSending(true);
    // Optimistic update
    setMessages((prev) => [...prev, {
      id:         `m_${Date.now()}`,
      senderName: user?.name ?? "You",
      senderRole: "patron",
      body,
      createdAt:  new Date().toISOString(),
    }]);
    // TODO: POST to /api/messages with Supabase
    await new Promise((r) => setTimeout(r, 300));
    setSending(false);
  };

  const acceptQuote = async (quoteId: string, artistId: string) => {
    setAcceptingId(quoteId);
    await new Promise((r) => setTimeout(r, 1000));
    setAccepted(quoteId);
    setAcceptingId("");
    setMessages((prev) => [...prev, {
      id:         `m_sys_${Date.now()}`,
      senderName: "System",
      senderRole: "system",
      body:       "Quote accepted! A commission order has been created. The artist has been notified and will begin work shortly.",
      createdAt:  new Date().toISOString(),
    }]);
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">

        {/* Back */}
        <Link href="/commissions" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent transition-colors mb-6">
          <ArrowLeft size={14} /> Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* ── Left: Request + Messages ─────────────────────────── */}
          <div className="space-y-6">

            {/* Request card */}
            <div className="bg-cream-card border border-cream-dark rounded-xl p-6">
              <div className="flex gap-4 items-start">
                {req.imageUrl && (
                  <div className="relative w-24 h-24 rounded-sm overflow-hidden flex-shrink-0 border border-cream-dark">
                    <Image src={req.imageUrl} alt={req.title} fill className="object-cover" />
                    <div className="absolute bottom-1 left-1 right-1 text-center">
                      <span className="text-[9px] bg-ink/60 text-cream px-1.5 py-0.5 rounded-full">AI Generated</span>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full font-medium">
                      {req.style}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Open
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl text-ink mb-2">{req.title}</h1>
                  <p className="text-ink-soft text-sm leading-relaxed">{req.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-ink-soft">
                      <IndianRupee size={13} />
                      ₹{req.budgetMin.toLocaleString()} – ₹{req.budgetMax.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-ink-soft">
                      <Clock size={13} /> {req.deadlineDays}-day deadline
                    </span>
                    <span className="flex items-center gap-1 text-ink-soft">
                      <Globe size={13} /> Posted by {req.patronName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quotes from artists */}
            {isOwner && quotes.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-ink mb-3">
                  Artist Quotes <span className="text-ink-faint text-base font-sans">({quotes.length})</span>
                </h2>
                <div className="space-y-3">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className={cn(
                        "bg-cream-card border rounded-xl p-5 transition-all",
                        accepted === q.id
                          ? "border-accent bg-accent/5"
                          : "border-cream-dark"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-cream-dark">
                          <Image src={q.avatar} alt={q.artistName} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-ink text-sm">{q.artistName}</p>
                                {q.artistVerified && <BadgeCheck size={13} className="text-accent" />}
                              </div>
                              <p className="text-xs text-ink-faint">{q.artistLocation}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-serif text-lg text-ink">₹{q.price.toLocaleString()}</p>
                              <p className="text-xs text-ink-faint">{q.turnaroundDays} days</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-1 mb-3">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} size={11} className={s <= Math.round(q.artistRating) ? "fill-accent text-accent" : "text-cream-dark"} />
                            ))}
                            <span className="text-xs text-ink-faint ml-1">{q.artistRating}</span>
                          </div>
                          <p className="text-sm text-ink-soft leading-relaxed italic mb-3">"{q.note}"</p>
                          <div className="flex gap-2">
                            <Link href={`/artists/${q.artistId}`} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1">
                              View Profile <ChevronRight size={11} />
                            </Link>
                            {accepted !== q.id ? (
                              <button
                                onClick={() => acceptQuote(q.id, q.artistId)}
                                disabled={!!accepted || !!acceptingId}
                                className="btn-accent text-xs px-3 py-1.5 flex items-center gap-1 disabled:opacity-50"
                              >
                                {acceptingId === q.id
                                  ? <><Loader2 size={11} className="animate-spin" /> Accepting…</>
                                  : <><CheckCircle size={11} /> Accept Quote</>
                                }
                              </button>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs text-accent font-medium">
                                <CheckCircle size={13} /> Quote Accepted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Messaging thread ─────────────────────────────── */}
            <div>
              <h2 className="font-serif text-xl text-ink mb-3">Messages</h2>
              <div className="bg-cream-card border border-cream-dark rounded-xl overflow-hidden">
                <div className="h-72 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.senderRole === "system"  ? "justify-center" :
                        msg.senderRole === "patron"  ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.senderRole === "system" ? (
                        <div className="flex items-center gap-2 bg-cream border border-cream-dark rounded-full px-4 py-1.5 text-xs text-ink-faint">
                          <Shield size={10} className="text-accent" />
                          {msg.body}
                        </div>
                      ) : (
                        <div className={cn(
                          "max-w-[80%] rounded-xl px-4 py-3",
                          msg.senderRole === "patron"
                            ? "bg-accent text-cream rounded-br-none"
                            : "bg-cream border border-cream-dark text-ink rounded-bl-none shadow-warm"
                        )}>
                          <p className={cn(
                            "text-[10px] font-medium mb-1",
                            msg.senderRole === "patron" ? "text-cream/70" : "text-ink-faint"
                          )}>
                            {msg.senderName}
                          </p>
                          <p className="text-sm leading-relaxed">{msg.body}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="border-t border-cream-dark p-3 flex gap-2 bg-cream">
                  <input
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder={user ? "Type a message…" : "Sign in to message"}
                    disabled={!user}
                    className="flex-1 input-warm text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMsg.trim() || sending || !user}
                    className="p-2 bg-ink text-cream rounded-md disabled:opacity-40 hover:bg-ink/80 transition-colors"
                  >
                    {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  </button>
                </div>
              </div>
              {!user && (
                <p className="text-xs text-center text-ink-faint mt-2">
                  <Link href="/login" className="text-accent hover:underline">Sign in</Link> to message the patron
                </p>
              )}
            </div>
          </div>

          {/* ── Right: Sidebar ────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Submit quote (for artists) */}
            {!isOwner && (
              <div className="bg-cream-card border border-cream-dark rounded-xl p-5">
                <h3 className="font-serif text-lg text-ink mb-4">Submit Your Quote</h3>
                <div className="space-y-3">
                  <div>
                    <label className="section-label block mb-1.5">Your Price (₹)</label>
                    <input type="number" placeholder="e.g. 4500" className="input-warm w-full" />
                  </div>
                  <div>
                    <label className="section-label block mb-1.5">Turnaround (days)</label>
                    <input type="number" placeholder="e.g. 21" className="input-warm w-full" />
                  </div>
                  <div>
                    <label className="section-label block mb-1.5">Note to patron</label>
                    <textarea rows={3} placeholder="Introduce yourself, mention relevant experience…" className="input-warm w-full resize-none text-sm" />
                  </div>
                  <button className="btn-accent w-full flex items-center justify-center gap-2">
                    <IndianRupee size={14} /> Submit Quote
                  </button>
                </div>
              </div>
            )}

            {/* Budget & deadline summary */}
            <div className="bg-cream-card border border-cream-dark rounded-xl p-5 space-y-3">
              <h3 className="font-serif text-base text-ink">Commission Details</h3>
              {[
                { label: "Budget", value: `₹${req.budgetMin.toLocaleString()} – ₹${req.budgetMax.toLocaleString()}` },
                { label: "Deadline", value: `${req.deadlineDays} days from acceptance` },
                { label: "Style", value: req.style.replace("-", " ") },
                { label: "Quotes", value: `${req.quotesCount} received` },
                { label: "Status", value: "Open" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm border-b border-cream-dark pb-2 last:border-0 last:pb-0">
                  <span className="text-ink-soft">{label}</span>
                  <span className="font-medium text-ink capitalize">{value}</span>
                </div>
              ))}
            </div>

            {/* Platform protection */}
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Shield size={14} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-ink mb-1">Platform Protection</p>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    All negotiations happen here. Never share contact or take payments off-platform before the commission begins — violations result in permanent bans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
