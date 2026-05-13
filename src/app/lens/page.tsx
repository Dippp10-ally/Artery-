"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Grid, Map as MapIcon, Search, Star } from "lucide-react";
import { MOCK_ARTISTS } from "@/mock/artists";
import { WarliArt } from "@/components/ui/WarliArt";
import { cn } from "@/lib/utils";

const MEDIUMS = ["All Mediums", "Watercolor", "Oil Paint", "Natural Pigments", "Digital", "Sculpture"];

export default function LensPage() {
  const [viewMode, setViewMode]   = useState<"grid" | "map">("grid");
  const [mapStyle, setMapStyle]   = useState<"parchment" | "midnight" | "clean">("parchment");
  const [medium, setMedium]       = useState("All Mediums");
  const [search, setSearch]       = useState("");

  const filtered = MOCK_ARTISTS.filter((a: any) => {
    const matchesMedium =
      medium === "All Mediums" ||
      a.mediums?.some((m: string) => m.toLowerCase().includes(medium.toLowerCase()));
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      a.displayName.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q) ||
      a.tags?.some((t: string) => t.toLowerCase().includes(q));
    return matchesMedium && matchesSearch;
  });

  return (
    <div className="bg-cream min-h-screen py-12 px-6 md:px-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-cream-dark pb-8 gap-6">
          <div>
            <p className="section-label mb-2">Recommender Lens</p>
            <h2 className="font-serif text-4xl text-ink">Artisan Directory</h2>
            <p className="text-ink-soft mt-1 font-sans text-sm">
              Connect with masters of their craft.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search artists, styles…"
                className="input-warm pl-9 pr-4 w-48"
              />
            </div>

            {/* Medium filter */}
            <select
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="input-warm pr-8 appearance-none cursor-pointer"
            >
              {MEDIUMS.map((m) => <option key={m}>{m}</option>)}
            </select>

            {/* View toggle */}
            <div className="bg-cream-card border border-cream-dark rounded-md p-1 flex">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-sm transition-all",
                  viewMode === "grid" ? "bg-cream text-ink shadow-sm" : "text-ink-soft hover:text-ink"
                )}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "p-2 rounded-sm transition-all",
                  viewMode === "map" ? "bg-cream text-ink shadow-sm" : "text-ink-soft hover:text-ink"
                )}
              >
                <MapIcon size={16} />
              </button>
            </div>

            {viewMode === "map" && (
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value as any)}
                className="input-warm cursor-pointer"
              >
                <option value="parchment">Aesthetic: Parchment</option>
                <option value="midnight">Aesthetic: Midnight</option>
                <option value="clean">Aesthetic: Clean</option>
              </select>
            )}
          </div>
        </div>

        {/* ── Grid View ───────────────────────────────────────── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 animate-fade-in">
            {filtered.map((artist: any) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.id}`}
                className="group flex flex-col cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-sm mb-5 shadow-warm">
                  <div className="aspect-[4/5] bg-cream-dark">
                    <Image
                      src={artist.portfolio[0]?.url || artist.coverImage}
                      alt={artist.displayName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-cream/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium tracking-wide text-ink opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    View Portfolio
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl text-ink group-hover:text-accent transition-colors">
                      {artist.displayName}
                    </h3>
                    <p className="text-ink-soft text-sm mt-0.5">{artist.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-accent mt-1">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-medium text-ink-soft">{artist.rating}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {artist.tags?.map((tag: string) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-3 py-24 text-center">
                <p className="font-serif text-2xl text-ink-soft italic">No artisans found.</p>
                <p className="text-ink-faint text-sm mt-2">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Map View ────────────────────────────────────────── */}
        {viewMode === "map" && (
          <div
            className={cn(
              "relative rounded-md border border-cream-dark overflow-hidden min-h-[600px] animate-fade-in transition-colors duration-500",
              mapStyle === "midnight" ? "bg-[#1a1a1a]" :
              mapStyle === "clean"    ? "bg-[#F9F9F9]" : "bg-[#E6E2D6]"
            )}
          >
            {/* Base map image — India outline */}
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
                alt="India map"
                fill
                className={cn(
                  "object-cover pointer-events-none transition-all duration-500 scale-[2] origin-center",
                  mapStyle === "parchment" ? "opacity-25 sepia mix-blend-multiply" :
                  mapStyle === "midnight"  ? "opacity-15 invert grayscale" :
                  "opacity-10 grayscale contrast-125"
                )}
              />
            </div>

            {/* Map aesthetic overlays */}
            {mapStyle === "parchment" && (
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
                <WarliArt variant="corner-tl" opacity={1} className="absolute top-0 left-0 w-64 h-64" />
                <WarliArt variant="corner-br" opacity={1} className="absolute bottom-0 right-0 w-64 h-64" />
              </div>
            )}
            {mapStyle === "midnight" && (
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle, #A38A6D 1px, transparent 1px)", backgroundSize: "40px 40px" }}
              />
            )}

            {/* Map label card */}
            <div className={cn(
              "absolute top-8 left-8 p-4 rounded-sm shadow-md max-w-xs z-10 backdrop-blur-sm",
              mapStyle === "midnight" ? "bg-[#2C2C2C]/90 text-cream" : "bg-cream/90 text-ink"
            )}>
              <h4 className="font-serif text-lg">Artisans of India</h4>
              <p className={cn("text-xs mt-1", mapStyle === "midnight" ? "text-ink-faint" : "text-ink-soft")}>
                Discover local craftsmanship.
              </p>
            </div>

            {/* Artist pins */}
            {filtered.map((artist: any) => (
              <div
                key={artist.id}
                style={{ top: artist.coords?.top, left: artist.coords?.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/pin"
              >
                <Link href={`/artists/${artist.id}`}>
                  <div className="relative">
                    <div className={cn(
                      "w-4 h-4 rounded-full shadow-lg animate-pulse",
                      mapStyle === "midnight"
                        ? "bg-accent ring-4 ring-[#2C2C2C]/50"
                        : "bg-accent ring-4 ring-cream/60"
                    )} />
                    <div className="w-10 h-10 bg-accent/20 rounded-full absolute -top-3 -left-3 animate-ping" />

                    {/* Hover tooltip */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-44 bg-cream rounded-sm shadow-warm-lg opacity-0 group-hover/pin:opacity-100 transition-all duration-300 -translate-y-1 group-hover/pin:translate-y-0 pointer-events-none z-30 overflow-hidden">
                      <div className="aspect-video bg-cream-dark relative">
                        <Image src={artist.portfolio[0]?.url} alt="" fill className="object-cover" />
                      </div>
                      <div className="p-2 text-center">
                        <div className="font-serif text-sm text-ink">{artist.displayName}</div>
                        <div className="text-[10px] text-ink-soft">{artist.location}</div>
                      </div>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-cream rotate-45 shadow-sm" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
