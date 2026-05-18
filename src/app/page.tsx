"use client";

import { useRouter } from "next/navigation";
import { WarliArt } from "@/components/ui/WarliArt";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-cream flex flex-col justify-center select-none cursor-default">

      {/* ── Grain texture overlay ───────────────────────────────── */}
      <div className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none mix-blend-multiply bg-noise animate-grain" />

      {/* ── Paper texture (very faint — just adds tactile warmth) ── */}
      <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none bg-paper" />

      {/* ── Ambient radial drifts (very subtle warmth) ─────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -bottom-1/3 -right-1/4 w-[70vw] h-[70vw] rounded-full blur-3xl opacity-[0.06] animate-drift"
          style={{ background: "radial-gradient(circle, #A38A6D 0%, transparent 70%)" }}
        />
        <div
          className="absolute -top-1/3 -left-1/4 w-[60vw] h-[60vw] rounded-full blur-3xl opacity-[0.04] animate-drift"
          style={{ background: "radial-gradient(circle, #787065 0%, transparent 70%)", animationDirection: "alternate-reverse" }}
        />
      </div>

      {/* ── Warli corner art — top right ───────────────────────── */}
      <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none z-0 animate-warli-float">
        <WarliArt variant="corner-tl" opacity={0.06} className="w-full h-full" />
      </div>

      {/* ── Warli corner art — bottom left ─────────────────────── */}
      <div
        className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none z-0 animate-warli-float"
        style={{ animationDelay: "3s" }}
      >
        <WarliArt variant="corner-br" opacity={0.055} className="w-full h-full" />
      </div>

      {/* ── Side strip — right ──────────────────────────────────── */}
      <div className="absolute top-0 right-12 h-full w-20 pointer-events-none z-0 hidden lg:block">
        <WarliArt variant="side-right" className="h-full w-full" opacity={0.035} />
      </div>

      {/* ── Vignette ────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(234,230,222,0.5)_100%)]" />

      {/* ══════════ Main Content ════════════════════════════════ */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-8 md:px-20 h-full flex flex-col justify-center items-center md:items-start">

        {/* Brand mark */}
        <div className="animate-fade-in" style={{ animationDuration: "1.2s" }}>
          <h1
            className="font-serif text-[clamp(72px,14vw,180px)] leading-none text-ink tracking-[-0.02em]"
            style={{ textShadow: "0px 2px 6px rgba(44,44,44,0.04)" }}
          >
            ARTERY
          </h1>
        </div>

        {/* Tagline */}
        <p
          className="font-serif italic text-[clamp(14px,2vw,26px)] text-ink-soft mt-3 tracking-wide animate-fade-in font-light"
          style={{ animationDelay: "350ms", letterSpacing: "0.04em" }}
        >
          helping you pump that art in your blood
        </p>

        {/* Divider */}
        <div
          className="w-16 h-px bg-accent/40 mt-10 animate-fade-in"
          style={{ animationDelay: "500ms" }}
        />

        {/* ── Entry buttons ───────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row gap-10 sm:gap-20 mt-12 animate-fade-in"
          style={{ animationDelay: "650ms" }}
        >
          {/* PATRON */}
          <div className="group flex flex-col items-center gap-3">
            <button
              onClick={() => router.push("/home")}
              className="px-12 py-4 rounded-full border border-cream-dark bg-cream-card text-ink font-serif text-base tracking-[0.22em] font-medium transition-all duration-300 hover:bg-[#DCD8D0] hover:border-[#C4B49E] hover:-translate-y-0.5 hover:shadow-warm"
            >
              PATRON
            </button>
            <span className="text-[10px] uppercase tracking-[0.22em] text-ink-faint font-sans transition-colors duration-300 group-hover:text-accent">
              Commission · Collect · Discover
            </span>
          </div>

          {/* ARTIST */}
          <div className="group flex flex-col items-center gap-3">
            <button
              onClick={() => router.push("/artist-dashboard")}
              className="px-12 py-4 rounded-full border border-cream-dark bg-cream-card text-ink font-serif text-base tracking-[0.22em] font-medium transition-all duration-300 hover:bg-[#DCD8D0] hover:border-[#C4B49E] hover:-translate-y-0.5 hover:shadow-warm"
            >
              ARTIST
            </button>
            <span className="text-[10px] uppercase tracking-[0.22em] text-ink-faint font-sans transition-colors duration-300 group-hover:text-accent">
              Create · Sell · Collaborate
            </span>
          </div>
        </div>

        {/* Footer tag */}
        <div
          className="absolute bottom-10 left-8 md:left-20 animate-fade-in"
          style={{ animationDelay: "900ms" }}
        >
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink-faint/60 font-sans">
            ARTERY &nbsp;·&nbsp; Curated Intelligence
          </p>
        </div>
      </div>

      {/* ── Organic ink-stain shape (right side depth) ──────────── */}
      <div
        className="absolute top-1/2 right-[-4%] w-[420px] h-[420px] bg-accent opacity-[0.05] mix-blend-multiply pointer-events-none rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] animate-drift"
        style={{ transform: "translateY(-50%) rotate(12deg)", filter: "blur(50px)" }}
      />
    </div>
  );
}
