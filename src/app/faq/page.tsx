"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, Sparkles, ShoppingBag, CreditCard, Package, MessageCircle, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { WarliArt } from "@/components/ui/WarliArt";

// ── FAQ Data ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "commissions",
    label: "Commissions",
    icon: Star,
    questions: [
      {
        q: "How does commissioning an artist work?",
        a: "There are two ways to commission on ARTERY. You can either (1) post a request to the public marketplace — describe your vision, set a budget, and let artists send you quotes — or (2) browse our Artist Directory, find someone whose style you love, unlock their contact details with a small one-time fee, and reach out directly. Either path is fully tracked on the platform.",
      },
      {
        q: "What is the commission fee and who pays it?",
        a: "ARTERY charges a one-time contact-unlock fee paid by the patron: ₹299 for Basic members, ₹149 for Pro members, and ₹0 for Premium members. This fee is separate from the artwork price you agree with the artist. The artwork payment is handled directly between you and the artist.",
      },
      {
        q: "Can I generate an AI concept first and then commission a human artist?",
        a: "Yes — that is exactly what our Generate tool is for. Use it to create a visual reference of your idea, then hit \"Post to Marketplace\" or \"Find an Artist\" to turn your concept into a real commissioned piece by a verified Indian artist.",
      },
      {
        q: "What art styles are available?",
        a: "Our current roster of artists covers Madhubani, Warli, Gond, Pattachitra, Tanjore, Miniature, Kalamkari, Phad, Pichwai, Watercolour, Oil, Acrylic, and Pencil sketch. Use the style filter on the Artist Directory page to find the right match.",
      },
      {
        q: "Can I commission a large commercial or institutional project?",
        a: "Absolutely. Several artists on ARTERY have delivered large mural designs, digital print series, and hotel lobby installations. Simply post a commission request with your full brief. Artists with relevant experience will submit quotes.",
      },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "Payments for contact unlocks are processed via Razorpay and accept all major UPI apps (GPay, PhonePe, Paytm), net banking, credit and debit cards, and EMI. Artwork payments are agreed directly with the artist and can be made by whatever method you both prefer.",
      },
      {
        q: "Is my payment secure?",
        a: "Yes. All payments on ARTERY go through Razorpay, which is PCI DSS Level 1 certified. We never store your card details on our servers. Every transaction is encrypted end-to-end.",
      },
      {
        q: "Do you offer refunds on the commission fee?",
        a: "The contact-unlock fee is non-refundable once the artist's details have been revealed to you. If an artist is unresponsive after you've paid to unlock, contact us within 7 days and we will either facilitate a connection or issue a credit towards another unlock.",
      },
      {
        q: "What subscription plans are available?",
        a: "We offer three tiers: Basic (free, ₹299 per unlock), Pro (₹499/month, ₹149 per unlock + 20% off cart purchases), and Premium (₹999/month, free unlocks + 35% off cart purchases + priority artist matching). You can upgrade from your Patron Dashboard.",
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery & Shipping",
    icon: Package,
    questions: [
      {
        q: "How is artwork delivered?",
        a: "Physical artwork is shipped via Ekart Logistics. Artists pack and dispatch the piece; you receive a tracking number on the platform once it is shipped. Digital artwork (illustrations, print-ready files) is delivered by download link through the platform.",
      },
      {
        q: "What are the typical delivery timelines?",
        a: "Turnaround depends on the artist and the complexity of the piece — it is displayed on each artist's profile (typically 14–60 days). Shipping within India takes an additional 3–7 business days after dispatch. International shipping is not currently supported.",
      },
      {
        q: "What if my artwork arrives damaged?",
        a: "Please photograph the damage immediately and contact us at support@artery.art within 48 hours of delivery. We will work with the artist and Ekart to arrange a replacement or refund. Artists are advised to use rigid cardboard tubes or reinforced flat-pack boxes.",
      },
      {
        q: "Do you ship outside India?",
        a: "Not yet. International shipping is on our roadmap. If you are based abroad and wish to commission, the artwork can be shipped to an Indian address of your choice.",
      },
    ],
  },
  {
    id: "artists",
    label: "For Artists",
    icon: Sparkles,
    questions: [
      {
        q: "How do I join ARTERY as an artist?",
        a: "Apply through the \"Join as Artist\" link in the footer. Our team reviews every application within 5 business days. We look for original portfolio work, a defined art style, and a track record of completing commissions. Verified artists receive a blue badge on their profile.",
      },
      {
        q: "What does ARTERY charge artists?",
        a: "Artists pay no listing fee and no commission on artwork sales. The platform fee is borne by the patron (the contact-unlock fee). We make money when patrons upgrade their subscription, not by taking a cut of your artwork.",
      },
      {
        q: "How do I receive commission requests?",
        a: "When you are logged in as an artist, the Commissions Marketplace shows all open patron requests. You can browse, filter by style and budget, and submit a quote directly. Accepted quotes move to active orders with a full messaging thread.",
      },
      {
        q: "Can I set my own prices?",
        a: "Yes, completely. Your profile shows a starting price and turnaround time that you control. When you quote on a commission request, you propose the price for that specific piece. The patron accepts or negotiates.",
      },
    ],
  },
  {
    id: "platform",
    label: "Platform & Safety",
    icon: Shield,
    questions: [
      {
        q: "What stops artists or patrons from taking deals off-platform?",
        a: "Our Terms of Service prohibit off-platform transactions arranged through contacts revealed on ARTERY. Violations — sharing contacts with third parties or soliciting side deals — result in permanent bans for both parties. The contact-unlock fee is what sustains the platform that brings them together.",
      },
      {
        q: "How are disputes handled?",
        a: "If a commission goes wrong — late delivery, artwork not matching brief, non-payment — either party can raise a dispute through the order detail page. Our support team mediates within 48 hours. Escalated cases may result in partial refunds, account suspension, or both.",
      },
      {
        q: "Is my personal data safe?",
        a: "All data is stored in Supabase (PostgreSQL) hosted on AWS, with row-level security policies ensuring users can only read their own records. Contact details revealed after payment are visible only to the patron who paid. We never sell user data to third parties.",
      },
      {
        q: "I found a bug or a security issue. Who do I tell?",
        a: "Please email security@artery.art immediately. Security issues are treated as P0 and addressed within 24 hours. We do not currently run a public bug bounty but we deeply appreciate responsible disclosure.",
      },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("border border-cream-dark rounded-xl overflow-hidden transition-all", open && "border-accent/30 shadow-warm")}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left"
      >
        <span className={cn("font-medium text-sm leading-snug transition-colors", open ? "text-accent" : "text-ink")}>
          {q}
        </span>
        <ChevronDown size={16} className={cn("text-ink-faint flex-shrink-0 mt-0.5 transition-transform duration-200", open && "rotate-180 text-accent")} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-ink-soft leading-relaxed border-t border-cream-dark pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [search,      setSearch]      = useState("");
  const [activeTab,   setActiveTab]   = useState("commissions");

  const activeCategory = CATEGORIES.find((c) => c.id === activeTab)!;
  const filteredQuestions = search
    ? CATEGORIES.flatMap((c) =>
        c.questions
          .filter((q) => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase()))
          .map((q) => ({ ...q, category: c.label }))
      )
    : activeCategory.questions.map((q) => ({ ...q, category: activeCategory.label }));

  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative border-b border-cream-dark py-16 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.045} className="w-full h-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label mb-3">Help Centre</p>
          <h1 className="font-serif text-5xl text-ink mb-4">Frequently Asked Questions</h1>
          <p className="text-ink-soft text-base mb-8">
            Everything you need to know about commissioning art, payments, delivery, and the platform.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="input-warm w-full pl-11 py-3 text-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row gap-10">

        {/* Sidebar tabs — hidden when searching */}
        {!search && (
          <nav className="md:w-52 flex-shrink-0">
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveTab(cat.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all",
                        activeTab === cat.id
                          ? "bg-accent text-cream"
                          : "text-ink-soft hover:bg-cream-card hover:text-ink"
                      )}
                    >
                      <Icon size={14} />
                      {cat.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Questions */}
        <div className="flex-1 min-w-0">
          {search && (
            <p className="text-sm text-ink-faint mb-5">
              {filteredQuestions.length} result{filteredQuestions.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
          )}
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-xl text-ink-soft mb-2">No results found</p>
              <p className="text-sm text-ink-faint mb-6">Try different keywords, or contact us directly.</p>
              <Link href="/support" className="btn-accent inline-flex items-center gap-2">
                <MessageCircle size={14} /> Contact Support
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((item, i) => (
                <div key={i}>
                  {search && (
                    <p className="text-[10px] uppercase tracking-wider text-accent font-medium mb-1.5 ml-1">{item.category}</p>
                  )}
                  <Accordion q={item.q} a={item.a} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Still need help CTA ─────────────────────────────────── */}
      <section className="border-t border-cream-dark bg-cream-card py-14 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-2xl text-ink mb-2">Still have questions?</p>
          <p className="text-ink-soft text-sm mb-6">
            Our support team is available Monday–Saturday, 10 am – 7 pm IST.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/support" className="btn-accent flex items-center gap-2">
              <MessageCircle size={14} /> Contact Support
            </Link>
            <Link href="/commissions" className="btn-outline flex items-center gap-2 text-sm">
              <ShoppingBag size={14} /> Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
