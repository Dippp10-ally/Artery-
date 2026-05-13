"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Scan, Shield, Truck } from "lucide-react";
import { MOCK_ARTISTS } from "@/mock/artists";
import { WarliArt } from "@/components/ui/WarliArt";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Sparkles,
    title: "Generate Your Vision",
    desc: "Describe your dream artwork in words. Our AI renders it instantly — watercolor, oil, Madhubani, Gond, any style.",
  },
  {
    step: "02",
    icon: Scan,
    title: "Lens Matches Artists",
    desc: "Recommender Lens scans 200+ verified artisans and surfaces those whose hand-style best matches your generated image.",
  },
  {
    step: "03",
    icon: Shield,
    title: "Pay to Connect",
    desc: "Pay a small commission fee. The artist's contact details unlock instantly — your privacy and theirs, always protected.",
  },
  {
    step: "04",
    icon: Truck,
    title: "Receive Your Masterpiece",
    desc: "The artisan creates your piece by hand. Ekart delivers it to your door with real-time tracking.",
  },
];

const SPOTLIGHT = MOCK_ARTISTS.filter(
  (a: any) => a.promotionLevel === "spotlight" || a.promotionLevel === "featured"
).slice(0, 3);

export default function HomePage() {
  return (
    <div className="bg-cream min-h-screen">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6 md:px-12">
        {/* Warli band across the top of hero */}
        <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none opacity-[0.045]">
          <WarliArt variant="band" className="w-full h-full" opacity={1} />
        </div>

        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <p className="section-label mb-5">Curated Intelligence</p>
          <h2 className="font-serif text-5xl md:text-7xl text-ink leading-[1.08] mb-8 max-w-3xl mx-auto">
            Where imagination meets{" "}
            <span className="italic text-ink-soft">craftsmanship.</span>
          </h2>
          <p className="section-body max-w-xl mx-auto mb-12">
            A curated space to generate unique imagery and connect with India's
            master artisans — who bring it to life by hand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate" className="btn-accent inline-flex items-center gap-2">
              <Sparkles size={16} />
              Generate Your Artwork
            </Link>
            <Link href="/lens" className="btn-outline inline-flex items-center gap-2">
              Explore Artists
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Warli art floating top-right corner */}
        <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.05} className="w-full h-full" />
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════= */}
      <section className="relative py-24 px-6 md:px-12 bg-cream-card border-t border-cream-dark">
        {/* Warli bottom-right decoration */}
        <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none">
          <WarliArt variant="corner-br" opacity={0.05} className="w-full h-full" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">The Process</p>
            <h3 className="section-title">How Artery works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl text-accent/30 leading-none font-light">
                    {step}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon size={16} className="text-accent" />
                  </div>
                </div>
                <h4 className="font-serif text-lg text-ink">{title}</h4>
                <p className="text-ink-soft text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ARTIST SPOTLIGHT ════════════════════════════════════= */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 border-b border-cream-dark pb-6">
            <div>
              <p className="section-label mb-2">Featured Artisans</p>
              <h3 className="section-title">Meet the makers</h3>
            </div>
            <Link
              href="/lens"
              className="hidden sm:flex items-center gap-1.5 text-sm text-accent hover:text-accent-dark transition-colors font-medium"
            >
              View all artists <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SPOTLIGHT.map((artist: any) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.id}`}
                className="group flex flex-col cursor-pointer"
              >
                {/* Artwork card */}
                <div className="relative overflow-hidden rounded-sm mb-5 shadow-warm">
                  <div className="aspect-[4/5] bg-cream-dark">
                    <Image
                      src={artist.coverImage || artist.portfolio[0]?.url}
                      alt={artist.displayName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-cream/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium tracking-wide text-ink opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    View Portfolio →
                  </div>
                </div>

                {/* Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl text-ink group-hover:text-accent transition-colors">
                      {artist.displayName}
                    </h3>
                    <p className="text-ink-soft text-sm mt-0.5">{(artist as any).location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-ink-faint">from</span>
                    <p className="text-sm font-medium text-ink">
                      ₹{artist.pricing.commissionBase.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {(artist as any).tags?.map((tag: string) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link href="/lens" className="btn-outline inline-flex items-center gap-2">
              View all artists <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CTA STRIP ═══════════════════════════════════════════= */}
      <section className="relative py-20 px-6 md:px-12 bg-ink overflow-hidden">
        {/* Warli art over dark bg — light colored */}
        <div className="absolute inset-0 pointer-events-none">
          <WarliArt variant="scatter" opacity={0.07} color="#F7F5F0" className="w-full h-full" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-accent text-xs uppercase tracking-[0.2em] font-sans mb-4">
            Start Creating
          </p>
          <h3 className="font-serif text-4xl text-cream leading-tight mb-6">
            Your vision deserves to be painted by human hands.
          </h3>
          <p className="text-ink-faint text-base mb-10 leading-relaxed">
            Generate an artwork concept in seconds, then commission an artisan
            who will bring it to life — in pigment, oil, or clay.
          </p>
          <Link href="/generate" className="btn-accent inline-flex items-center gap-2">
            <Sparkles size={16} />
            Begin with AI Generation
          </Link>
        </div>
      </section>

    </div>
  );
}
