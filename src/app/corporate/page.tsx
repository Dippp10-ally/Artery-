import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Building2, CheckCircle, Palette, Package, Shield,
  ArrowRight, Mail, Phone, Star, Globe, BadgeCheck,
} from "lucide-react";
import { WarliArt } from "@/components/ui/WarliArt";

export const metadata: Metadata = {
  title: "Corporate Art Solutions | ARTERY",
  description:
    "Commission original Indian artwork for offices, hotels, and institutions. Bulk ordering, account management, and priority artist matching for corporate clients.",
};

const SOLUTIONS = [
  {
    icon: Building2,
    title: "Office & Workplace",
    desc: "Reception statement pieces, corridor series, boardroom focal walls. Elevate your workspace with original Indian art that tells your brand story.",
    examples: ["Lobby installations", "Series commissions", "Department-themed art"],
  },
  {
    icon: Globe,
    title: "Hotels & Hospitality",
    desc: "Room-specific art, restaurant feature walls, spa environments. Region-specific styles that connect guests to local culture.",
    examples: ["Room art at scale", "Lobby murals", "Restaurant feature walls"],
  },
  {
    icon: Package,
    title: "Gifts & Events",
    desc: "Premium corporate gifting — limited-edition prints, custom miniatures, branded Warli illustrations for conferences and milestones.",
    examples: ["Conference gifts", "Award pieces", "Festival hampers"],
  },
];

const BENEFITS = [
  { label: "Dedicated account manager" },
  { label: "Bulk pricing from 5+ pieces" },
  { label: "Priority artist matching" },
  { label: "Invoice & GST billing" },
  { label: "Consolidated Ekart delivery" },
  { label: "Certificate of Authenticity for every piece" },
  { label: "Artwork insurance during transit" },
  { label: "Post-delivery installation guidance" },
];

const CASE_STUDIES = [
  {
    company: "Hotel Raipur Palace",
    desc: "12 room panels + 1 lobby mural. 4-week delivery. Peacock-themed Pichwai series across all executive suites.",
    style: "Pichwai",
    pieces: 13,
    image: "https://images.unsplash.com/photo-1605634288001-c8c3e8774775?q=80&w=600",
  },
  {
    company: "TechCorp India HQ",
    desc: "Reception Gond series — four seasons in four panels. High-res digital files + giclée prints, framed and installed.",
    style: "Gond Art",
    pieces: 4,
    image: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=600",
  },
  {
    company: "Apex Law Associates",
    desc: "Madhubani triptych for boardroom. Custom brief, 3-week turnaround, national courier with padded packaging.",
    style: "Madhubani",
    pieces: 3,
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600",
  },
];

export default function CorporatePage() {
  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative border-b border-cream-dark py-20 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.045} className="w-full h-full" />
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-3">Corporate</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-6 max-w-3xl">
            Art that works as hard as your team does
          </h1>
          <p className="text-ink-soft text-base leading-relaxed max-w-2xl mb-8">
            Original Indian artwork for offices, hotels, and institutions. Bulk commissioning,
            dedicated account management, and GST-compliant invoicing — all on one platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#contact" className="btn-accent flex items-center gap-2">
              <Mail size={14} /> Talk to Our Team
            </a>
            <Link href="/lens" className="btn-outline flex items-center gap-2 text-sm">
              <Palette size={14} /> Browse Artists
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-cream-dark">
            {[
              { num: "50+", label: "Corporate clients" },
              { num: "500+", label: "Pieces delivered" },
              { num: "4.9★", label: "Average rating" },
              { num: "100%", label: "On-time delivery" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl text-accent">{s.num}</p>
                <p className="text-xs text-ink-faint">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solutions ────────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12 border-b border-cream-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-ink mb-10 text-center">What we can do for you</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SOLUTIONS.map((sol) => {
              const Icon = sol.icon;
              return (
                <div key={sol.title} className="bg-cream-card border border-cream-dark rounded-xl p-6">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <h3 className="font-serif text-xl text-ink mb-2">{sol.title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed mb-4">{sol.desc}</p>
                  <ul className="space-y-1.5">
                    {sol.examples.map((ex) => (
                      <li key={ex} className="flex items-center gap-2 text-xs text-ink-soft">
                        <CheckCircle size={11} className="text-accent flex-shrink-0" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Case studies ─────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12 border-b border-cream-dark bg-cream-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-ink mb-10 text-center">Recent corporate commissions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.company} className="bg-cream border border-cream-dark rounded-xl overflow-hidden">
                <div className="relative h-44">
                  <Image src={cs.image} alt={cs.company} fill className="object-cover" />
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] bg-accent text-cream px-2 py-0.5 rounded-full font-medium">
                      {cs.style}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-1">
                    <BadgeCheck size={13} className="text-accent" />
                    <p className="font-medium text-sm text-ink">{cs.company}</p>
                  </div>
                  <p className="text-ink-soft text-xs leading-relaxed mb-3">{cs.desc}</p>
                  <p className="text-xs text-ink-faint">{cs.pieces} piece{cs.pieces !== 1 ? "s" : ""} commissioned</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12 border-b border-cream-dark">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <h2 className="font-serif text-3xl text-ink mb-4">The corporate advantage</h2>
            <p className="text-ink-soft text-sm leading-relaxed mb-8 max-w-md">
              Every corporate account gets white-glove service from brief to installation —
              no chasing artists, no platform confusion, no paperwork headaches.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BENEFITS.map((b) => (
                <div key={b.label} className="flex items-center gap-2.5">
                  <CheckCircle size={14} className="text-accent flex-shrink-0" />
                  <span className="text-sm text-ink-soft">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Pricing note */}
          <div className="w-full md:w-80 bg-cream-card border border-cream-dark rounded-xl p-6 flex-shrink-0">
            <p className="section-label mb-2">Pricing</p>
            <h3 className="font-serif text-2xl text-ink mb-4">Bulk commissions from ₹15,000</h3>
            <ul className="space-y-3 text-sm text-ink-soft mb-6">
              <li className="flex justify-between border-b border-cream-dark pb-2">
                <span>1–4 pieces</span>
                <span className="font-medium text-ink">Standard pricing</span>
              </li>
              <li className="flex justify-between border-b border-cream-dark pb-2">
                <span>5–14 pieces</span>
                <span className="font-medium text-ink">10% bulk discount</span>
              </li>
              <li className="flex justify-between border-b border-cream-dark pb-2">
                <span>15–49 pieces</span>
                <span className="font-medium text-ink">20% bulk discount</span>
              </li>
              <li className="flex justify-between">
                <span>50+ pieces</span>
                <span className="font-medium text-accent">Custom quote</span>
              </li>
            </ul>
            <a href="#contact" className="btn-accent w-full flex items-center justify-center gap-2">
              Request a Quote <ArrowRight size={13} />
            </a>
            <p className="text-[11px] text-ink-faint mt-3 text-center">
              GST invoices · ₹0 platform fee for 20+ pieces
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────── */}
      <section id="contact" className="py-16 px-6 md:px-12 bg-cream-card">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-ink mb-3">Ready to start?</h2>
          <p className="text-ink-soft text-sm mb-8">
            Our corporate team will respond within 2 business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:corporate@artery.art"
              className="btn-accent flex items-center justify-center gap-2"
            >
              <Mail size={14} /> corporate@artery.art
            </a>
            <a
              href="tel:+918000000000"
              className="btn-outline flex items-center justify-center gap-2 text-sm"
            >
              <Phone size={14} /> +91 80000 00000
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-ink-faint">
            <span className="flex items-center gap-1"><Shield size={11} /> GST registered</span>
            <span className="flex items-center gap-1"><Star size={11} /> 4.9 corporate rating</span>
            <span className="flex items-center gap-1"><BadgeCheck size={11} /> Verified artists only</span>
          </div>
        </div>
      </section>
    </div>
  );
}
