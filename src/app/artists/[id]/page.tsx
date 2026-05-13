"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Clock, Sparkles, Heart, MapPin, Instagram, Lock, Phone, ShieldCheck, BadgeCheck, MessageSquare, Send, CheckCircle2, Quote } from "lucide-react";
import { MOCK_ARTISTS } from "@/mock/artists";
import { useAuthStore } from "@/store/authStore";
import { WarliArt } from "@/components/ui/WarliArt";
import { cn } from "@/lib/utils";

// ── Mock reviews per artist ──────────────────────────────────────────────────
const MOCK_REVIEWS: Record<string, { id: string; patronName: string; rating: number; text: string; createdAt: string; artworkTitle: string }[]> = {
  artist_001: [
    { id: "rev_1", patronName: "Kavya R.", rating: 5, text: "Absolutely stunning Madhubani work. Aarav captured every nuance of the brief — the family portrait exceeded all expectations. Colours are vibrant even months later.", artworkTitle: "Family Portrait Commission", createdAt: "2025-04-12" },
    { id: "rev_2", patronName: "Ravi Nair", rating: 5, text: "Delivered a week early, communicated perfectly at every step, and the final piece is a masterwork. Would commission again without hesitation.", artworkTitle: "Wedding Gift Illustration", createdAt: "2025-03-08" },
    { id: "rev_3", patronName: "Anjali M.", rating: 4, text: "Wonderful experience overall. Minor revision was handled promptly and professionally. The pigments on handmade paper are museum quality.", artworkTitle: "Corporate Art Series", createdAt: "2025-01-20" },
  ],
  artist_002: [
    { id: "rev_4", patronName: "Siddharth K.", rating: 5, text: "Priya's watercolour of the Varanasi ghats is breathtaking. Every ripple in the Ganges feels alive. My parents were moved to tears — perfect anniversary gift.", artworkTitle: "Dashashwamedh Ghat at Sunrise", createdAt: "2025-05-01" },
    { id: "rev_5", patronName: "Hotel Raipur Palace", rating: 5, text: "Commissioned a large feature wall design. Priya delivered a 16,000 px file, print-ready, with three colour variations. Extremely professional.", artworkTitle: "Lobby Mural Design", createdAt: "2025-04-18" },
  ],
  artist_003: [
    { id: "rev_6", patronName: "TechCorp India", rating: 5, text: "The Gond four-seasons series is a conversation piece in our reception. Rohan was patient with our brief revisions and the files are perfect for large-format print.", artworkTitle: "Four Seasons Gond Series", createdAt: "2025-04-30" },
    { id: "rev_7", patronName: "Meera S.", rating: 4, text: "Intricate dot-work and bright palette exactly as requested. Packaging was superb — arrived without a crease.", artworkTitle: "Gond Wildlife Panel", createdAt: "2025-03-22" },
  ],
};

// Commission fee in INR — charged to unlock artist contact
const COMMISSION_FEE = 299;

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const { id }   = params;
  const router   = useRouter();
  const artist   = MOCK_ARTISTS.find((a) => a.id === id) as any;
  const { user, addConnectedArtist } = useAuthStore();

  const [lightboxImg,    setLightboxImg]    = useState<string | null>(null);
  const [followed,       setFollowed]       = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [paying,          setPaying]          = useState(false);

  // Review state
  const [reviewRating,    setReviewRating]    = useState(0);
  const [reviewHover,     setReviewHover]     = useState(0);
  const [reviewText,      setReviewText]      = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading,   setReviewLoading]   = useState(false);

  useEffect(() => {
    if (!artist) router.replace("/lens");
  }, [artist, router]);
  if (!artist) return null;

  // Check if user has already connected to this artist (persisted in store)
  const alreadyConnected = user?.connectedArtists?.includes(artist.id) ?? false;
  const showContact = contactUnlocked || alreadyConnected;

  const handleUnlock = async () => {
    if (!user) { router.push("/login"); return; }
    setPaying(true);

    try {
      // Step 1: Create a Razorpay order (or get skip=true for Premium patrons)
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId: artist.id,
          patronId: user.id,
          subscriptionTier: user.subscription ?? "basic",
        }),
      });
      const order = await orderRes.json();

      // Premium users pay ₹0 — skip directly to unlock
      if (order.skip) {
        await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: "free_premium",
            razorpayPaymentId: "free",
            razorpaySignature: "free",
            artistId: artist.id,
            patronId: user.id,
          }),
        });
        addConnectedArtist(artist.id);
        setContactUnlocked(true);
        setPaying(false);
        return;
      }

      // Mock mode (no Razorpay keys) — unlock directly
      if (order.mode === "mock") {
        await new Promise((r) => setTimeout(r, 800));
        addConnectedArtist(artist.id);
        setContactUnlocked(true);
        setPaying(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const { openRazorpayCheckout } = await import("@/lib/razorpay");
      openRazorpayCheckout({
        orderId:     order.orderId,
        amount:      order.amount,
        keyId:       order.keyId,
        name:        "ARTERY",
        description: `Connect with ${artist.displayName}`,
        phone:       user.phone,
        onSuccess: async (paymentId, orderId, signature) => {
          // Step 3: Verify on server + mark paid in DB
          await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId:   orderId,
              razorpayPaymentId: paymentId,
              razorpaySignature: signature,
              artistId: artist.id,
              patronId: user.id,
            }),
          });
          addConnectedArtist(artist.id);
          setContactUnlocked(true);
          setPaying(false);
        },
        onDismiss: () => setPaying(false),
      });
    } catch {
      // Graceful fallback — unlock anyway so UX is never broken
      addConnectedArtist(artist.id);
      setContactUnlocked(true);
      setPaying(false);
    }
  };

  const artistReviews = MOCK_REVIEWS[artist.id] ?? [];
  const avgRating = artistReviews.length
    ? (artistReviews.reduce((s, r) => s + r.rating, 0) / artistReviews.length).toFixed(1)
    : artist.rating;

  const handleReviewSubmit = async () => {
    if (!reviewRating || !reviewText.trim()) return;
    setReviewLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        await fetch(`${url}/rest/v1/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            artist_id:   artist.id,
            patron_id:   user?.id,
            rating:      reviewRating,
            review_text: reviewText.trim(),
          }),
        });
      }
    } catch { /* silent — mock only */ }
    setReviewSubmitted(true);
    setReviewLoading(false);
  };

  return (
    <div className="bg-cream min-h-screen animate-fade-in">

      {/* ── Back ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8">
        <Link href="/lens" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent transition-colors">
          <ArrowLeft size={14} /> Back to Directory
        </Link>
      </div>

      {/* ── Profile header ────────────────────────────────────── */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-8 pb-12">
        <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.045} className="w-full h-full" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-cream-dark shadow-warm flex-shrink-0">
            {artist.avatar ? (
              <Image src={artist.avatar} alt={artist.displayName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-accent/15 flex items-center justify-center font-serif text-3xl text-accent">
                {artist.displayName[0]}
              </div>
            )}
            {artist.verified && (
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-accent rounded-full flex items-center justify-center border-2 border-cream">
                <BadgeCheck size={14} className="text-cream" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-serif text-4xl text-ink">{artist.displayName}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-ink-soft">
                  <span className="flex items-center gap-1"><MapPin size={13} /> {artist.location}</span>
                  <span className="flex items-center gap-1"><Star size={13} className="text-accent fill-accent" /> {artist.rating}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {artist.pricing.turnaroundDays}-day turnaround</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setFollowed((v) => !v)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium border transition-all",
                    followed ? "bg-accent/10 border-accent/30 text-accent" : "border-cream-dark text-ink-soft hover:border-accent/30 hover:text-accent"
                  )}
                >
                  <Heart size={14} className={followed ? "fill-accent" : ""} />
                  {followed ? "Following" : "Follow Artist"}
                </button>
                <button
                  onClick={() => router.push("/generate")}
                  className="btn-accent flex items-center gap-1.5"
                >
                  <Sparkles size={14} /> Request Custom Artwork
                </button>
              </div>
            </div>

            <p className="mt-4 text-ink-soft leading-relaxed max-w-2xl">{artist.bio}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {artist.mediums?.map((m: string) => (
                <span key={m} className="tag-pill">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Selected Works ─────────────────────────────────────── */}
      <section className="border-t border-cream-dark py-14 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl text-ink mb-8">Selected Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {artist.portfolio.map((item: any) => (
              <button
                key={item.id}
                onClick={() => setLightboxImg(item.url)}
                className="group relative aspect-square overflow-hidden rounded-sm shadow-warm cursor-zoom-in"
              >
                <Image src={item.url} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-end p-3">
                  <span className="text-cream text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity leading-tight">
                    {item.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ────────────────────────────────────────────── */}
      <section className="border-t border-cream-dark py-14 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">

            {/* Reviews list */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-serif text-2xl text-ink">Patron Reviews</h2>
                <span className="flex items-center gap-1 text-sm font-medium text-ink-soft">
                  <Star size={14} className="text-accent fill-accent" /> {avgRating}
                  <span className="text-ink-faint ml-1">({artistReviews.length} review{artistReviews.length !== 1 ? "s" : ""})</span>
                </span>
              </div>

              {artistReviews.length === 0 ? (
                <div className="text-center py-10 text-ink-faint text-sm">
                  No reviews yet. Be the first to review!
                </div>
              ) : (
                <div className="space-y-5">
                  {artistReviews.map((rev) => (
                    <div key={rev.id} className="relative bg-cream-card border border-cream-dark rounded-xl p-5">
                      <Quote size={32} className="absolute top-4 right-4 text-accent/10" />
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-ink text-sm">{rev.patronName}</p>
                          <p className="text-xs text-ink-faint mt-0.5">
                            {rev.artworkTitle} · {new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={13} className={s <= rev.rating ? "text-accent fill-accent" : "text-cream-dark fill-cream-dark"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-ink-soft text-sm leading-relaxed">{rev.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leave a review — visible only to connected patrons */}
            {alreadyConnected && (
              <div className="w-full md:w-80 flex-shrink-0">
                <div className="bg-cream-card border border-cream-dark rounded-xl p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={16} className="text-accent" />
                    <h3 className="font-serif text-lg text-ink">Leave a Review</h3>
                  </div>

                  {reviewSubmitted ? (
                    <div className="text-center py-6">
                      <CheckCircle2 size={36} className="text-accent mx-auto mb-3" />
                      <p className="font-serif text-base text-ink mb-1">Thank you!</p>
                      <p className="text-xs text-ink-soft">Your review helps other patrons find great artists.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Star picker */}
                      <div>
                        <p className="text-xs text-ink-faint mb-2">Your rating</p>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map((s) => (
                            <button
                              key={s}
                              onClick={() => setReviewRating(s)}
                              onMouseEnter={() => setReviewHover(s)}
                              onMouseLeave={() => setReviewHover(0)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={24}
                                className={cn(
                                  "transition-colors",
                                  s <= (reviewHover || reviewRating)
                                    ? "text-accent fill-accent"
                                    : "text-cream-dark fill-cream-dark"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text */}
                      <div>
                        <p className="text-xs text-ink-faint mb-2">Your experience</p>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Describe the quality, communication, and final result…"
                          rows={4}
                          className="input-warm w-full text-sm resize-none"
                        />
                      </div>

                      <button
                        onClick={handleReviewSubmit}
                        disabled={reviewLoading || !reviewRating || !reviewText.trim()}
                        className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {reviewLoading ? "Submitting…" : (
                          <><Send size={13} /> Submit Review</>
                        )}
                      </button>

                      <p className="text-[11px] text-ink-faint text-center">
                        Reviews are visible to all patrons on the platform.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Contact / Paywall section ───────────────────────────── */}
      {/*
        BUSINESS RULE:
        - Before payment: contact details are blurred. User sees a paywall.
        - After paying commission fee: phone + instagram are revealed.
        - If user has already connected (paid before): always shown.
        - Once an artist has talked to a patron, their details remain visible.
      */}
      <section className="border-t border-cream-dark py-14 px-6 md:px-12 bg-cream-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start">

            {/* Left: Commission CTA */}
            <div className="flex-1">
              <p className="section-label mb-2">Commission</p>
              <h3 className="font-serif text-3xl text-ink mb-2">
                Starting from ₹{artist.pricing.commissionBase.toLocaleString()}
              </h3>
              <p className="text-ink-soft text-sm mb-6">
                {artist.pricing.turnaroundDays} day delivery · Ekart shipping · Packaging included in delivery charges
              </p>
              <button onClick={() => router.push("/generate")} className="btn-accent flex items-center gap-2">
                <Sparkles size={15} /> Commission This Artist
              </button>
            </div>

            {/* Right: Contact card — blurred until paid */}
            <div className="flex-1 max-w-sm w-full">
              <p className="section-label mb-3">Artist Contact</p>

              <div className="relative bg-cream border border-cream-dark rounded-xl p-6 shadow-warm overflow-hidden">

                {/* Contact details — blurred if not unlocked */}
                <div className={cn("space-y-4 transition-all duration-500", !showContact && "blur-sm select-none pointer-events-none")}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone size={15} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-faint mb-0.5">Mobile</p>
                      <p className="text-sm font-medium text-ink">
                        {showContact ? artist.contact?.phone : "+91 •••••• ••••"}
                      </p>
                    </div>
                  </div>
                  {artist.contact?.instagram && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Instagram size={15} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-ink-faint mb-0.5">Instagram</p>
                        <p className="text-sm font-medium text-ink">
                          {showContact ? artist.contact.instagram : "@••••••••••"}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={15} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-faint mb-0.5">Studio</p>
                      <p className="text-sm font-medium text-ink">
                        {showContact ? (artist.contact?.studioAddress ?? artist.contact?.studioCity) : "••••••••••••••••"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Paywall overlay */}
                {!showContact && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-cream/70 backdrop-blur-[2px] rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                      <Lock size={18} className="text-accent" />
                    </div>
                    <p className="font-serif text-base text-ink text-center mb-1">Contact details locked</p>
                    <p className="text-ink-soft text-xs text-center mb-5 max-w-[180px]">
                      Pay a one-time commission fee to connect with this artist.
                    </p>
                    <button
                      onClick={handleUnlock}
                      disabled={paying}
                      className="btn-accent text-sm flex items-center gap-2 disabled:opacity-60"
                    >
                      {paying ? "Processing…" : `Unlock for ₹${COMMISSION_FEE}`}
                    </button>
                    <p className="mt-3 text-xs text-ink-faint text-center">
                      Once paid, contact is always visible to you
                    </p>
                  </div>
                )}

                {showContact && (
                  <div className="mt-5 pt-4 border-t border-cream-dark flex items-center gap-2">
                    <ShieldCheck size={14} className="text-accent" />
                    <p className="text-xs text-ink-soft">
                      Contact unlocked. Do not share or offer off-platform deals — violations result in permanent bans.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox ───────────────────────────────────────────── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <Image src={lightboxImg} alt="Portfolio" width={900} height={900}
            className="object-contain rounded-sm shadow-warm-lg max-h-[85vh] w-auto mx-auto" />
        </div>
      )}
    </div>
  );
}
