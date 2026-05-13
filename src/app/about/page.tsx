import Link from "next/link";
import { Shield, Ban, BadgeCheck, Truck, Lock, Star, AlertTriangle, Heart, Sparkles } from "lucide-react";
import { WarliArt } from "@/components/ui/WarliArt";

const RULES = [
  {
    icon: Shield,
    title: "Platform-Only Communication (Before Delivery)",
    desc: "All pre-commission communication between patrons and artists must happen through Artery. Sharing personal contact details before payment is strictly prohibited.",
    type: "rule",
  },
  {
    icon: Ban,
    title: "Zero-Tolerance: No Price Undercutting",
    desc: "Artists who offer patrons prices lower than listed on Artery — to bypass platform fees — face immediate account suspension and permanent business deletion. No exceptions.",
    type: "critical",
  },
  {
    icon: BadgeCheck,
    title: "Truthful Portfolio Only",
    desc: "Artists may only upload their own original work. Copying, plagiarism, or misrepresenting your medium or style is grounds for removal.",
    type: "rule",
  },
  {
    icon: Lock,
    title: "Privacy Is Sacred",
    desc: "Customer and artist personal data — phone numbers, addresses, studio locations — remain hidden behind a paywall. Revealed only after the commission fee is paid. Once connected, details stay visible to both parties.",
    type: "rule",
  },
  {
    icon: Truck,
    title: "Delivery via Ekart",
    desc: "Artwork delivery is handled through Ekart or a connected private courier. Delivery charges cover logistics and packaging. The physical cost of creating the artwork is separate and part of the commission fee.",
    type: "info",
  },
  {
    icon: Star,
    title: "Honest Reviews Only",
    desc: "Reviews must reflect genuine experience. Fabricated reviews — positive or negative — will result in account suspension for both parties involved.",
    type: "rule",
  },
];

const HOW_PRICING_WORKS = [
  { label: "Image Generation", value: "Free", note: "Always free, no account needed" },
  { label: "Commission Fee (Patron)", value: "₹299 – ₹999", note: "One-time fee to unlock artist contact" },
  { label: "Artwork Price", value: "Set by artist", note: "Agreed directly after connection" },
  { label: "Delivery Charges", value: "₹80 – ₹300", note: "Ekart / private courier + packaging" },
  { label: "Artist Promotion", value: "₹499/month+", note: "Guaranteed recommendation placement" },
];

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 md:px-12 border-b border-cream-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.05} className="w-full h-full" />
        </div>
        <div className="max-w-3xl">
          <p className="section-label mb-4">About ARTERY</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-6">
            Helping you pump that<br />
            <span className="italic text-ink-soft">art in your blood.</span>
          </h1>
          <p className="section-body max-w-xl">
            Artery bridges the gap between imagination and craftsmanship. You generate a vision using AI.
            We connect you with a verified Indian artisan who paints, sculpts, draws, or moulds it into reality —
            by hand, with soul.
          </p>
        </div>
      </section>

      {/* ── How it works — business model ─────────────────────── */}
      <section className="py-16 px-6 md:px-12 border-b border-cream-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="section-label mb-3">The Model</p>
              <h2 className="section-title mb-4">How Artery makes money — and why it works for you</h2>
              <p className="section-body">
                Image generation is and will always be free. We charge a small commission fee when a
                patron unlocks an artist's contact details. Artists can pay for promoted placement in
                Recommender Lens results. There are no hidden fees and no surprises.
              </p>
              <p className="section-body mt-4">
                Repeat customers benefit from our subscription model — lower commission fees and priority matching.
                Artists get steady, verified leads without chasing clients.
              </p>
              <Link href="/subscription" className="btn-accent inline-flex items-center gap-2 mt-6">
                <Sparkles size={14} /> View Subscription Plans
              </Link>
            </div>

            {/* Pricing table */}
            <div className="bg-cream-card border border-cream-dark rounded-xl overflow-hidden shadow-warm">
              <div className="px-6 py-4 border-b border-cream-dark">
                <p className="font-serif text-lg text-ink">Pricing at a Glance</p>
              </div>
              <div className="divide-y divide-cream-dark">
                {HOW_PRICING_WORKS.map(({ label, value, note }) => (
                  <div key={label} className="px-6 py-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-ink">{label}</p>
                      <p className="text-xs text-ink-faint mt-0.5">{note}</p>
                    </div>
                    <span className="text-sm font-medium text-accent whitespace-nowrap">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community Rules ────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-52 h-52 pointer-events-none">
          <WarliArt variant="corner-br" opacity={0.045} className="w-full h-full" />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Community Rules</p>
            <h2 className="section-title">How we keep this a safe, fair space</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {RULES.map(({ icon: Icon, title, desc, type }) => (
              <div
                key={title}
                className={`p-6 rounded-xl border flex gap-4 ${
                  type === "critical"
                    ? "bg-red-50 border-red-200"
                    : type === "info"
                      ? "bg-accent/5 border-accent/20"
                      : "bg-cream-card border-cream-dark"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  type === "critical" ? "bg-red-100" : "bg-accent/10"
                }`}>
                  <Icon size={18} className={type === "critical" ? "text-red-600" : "text-accent"} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-base text-ink">{title}</h3>
                    {type === "critical" && (
                      <span className="text-[10px] uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-full font-medium">
                        Zero Tolerance
                      </span>
                    )}
                  </div>
                  <p className="text-ink-soft text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ban warning banner */}
          <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-serif text-base text-ink mb-1">Violating our rules has consequences.</p>
              <p className="text-sm text-ink-soft">
                Any artist found to be offering below-platform pricing, sharing contact details before payment,
                or misrepresenting their portfolio will have their account permanently deleted with no possibility of appeal.
                We take the integrity of this marketplace seriously — for the sake of every artist and patron on it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Delivery section ───────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12 bg-cream-card border-t border-cream-dark">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              <p className="section-label mb-3">Delivery</p>
              <h2 className="section-title mb-4">Your art, at your door</h2>
              <p className="section-body">
                Once your commission is complete, the artist hands it to our delivery partner — Ekart, or a
                private courier of similar reliability. Delivery charges cover logistics, tracking, and the
                cost of packaging materials. The creation of the artwork itself is part of your commission fee.
              </p>
              <p className="section-body mt-3">
                You receive real-time tracking updates. All deliveries are insured up to ₹10,000.
              </p>
            </div>
            <div className="flex-1 max-w-sm">
              <div className="bg-cream border border-cream-dark rounded-xl p-6 shadow-warm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Truck size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-ink text-sm">Ekart Logistics</p>
                    <p className="text-xs text-ink-faint">Primary delivery partner</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    ["Delivery time", "4–7 business days"],
                    ["Packaging", "Included in delivery fee"],
                    ["Insurance", "Up to ₹10,000"],
                    ["Tracking", "Real-time updates"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm border-b border-cream-dark pb-2">
                      <span className="text-ink-soft">{k}</span>
                      <span className="font-medium text-ink">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Made with love ─────────────────────────────────────── */}
      <section className="py-12 px-6 text-center border-t border-cream-dark">
        <p className="flex items-center justify-center gap-2 text-sm text-ink-faint font-sans">
          Made with <Heart size={13} className="text-accent fill-accent" /> for Indian art and the people who love it.
        </p>
      </section>
    </div>
  );
}
