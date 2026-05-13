import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, IndianRupee, Sparkles } from "lucide-react";
import { WarliArt } from "@/components/ui/WarliArt";

export const metadata: Metadata = {
  title: "Indian Art Styles Guide | ARTERY",
  description:
    "A visual guide to India's traditional art styles — Madhubani, Gond, Warli, Pichwai, Tanjore, Kalamkari and more. Learn what makes each style unique before you commission.",
};

const ART_STYLES = [
  {
    id: "madhubani",
    name: "Madhubani",
    region: "Mithila, Bihar",
    also: "Also called Mithila painting",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800",
    description:
      "One of India's oldest living art traditions, Madhubani painting originates from the Mithila region of Bihar. Characterised by bold black outlines, intricate geometric borders, and vivid natural pigments, it traditionally depicts scenes from Hindu mythology, nature, and daily village life. Originally painted on freshly plastered mud walls during festivals and weddings, the art form now thrives on handmade paper and cloth.",
    characteristics: [
      "Bold, unbroken black outlines",
      "No empty space — every gap is filled with patterns",
      "Bright natural pigments: turmeric, indigo, lamp black",
      "Geometric borders framing every composition",
      "Themes: Ramayana, Mahabharata, nature, fertility",
    ],
    priceRange: "₹2,000 – ₹25,000",
    turnaround: "14–30 days",
    bestFor: ["Family portraits", "Wedding gifts", "Wall murals", "Festive décor"],
    color: "text-rose-700 bg-rose-50 border-rose-200",
  },
  {
    id: "gond",
    name: "Gond Art",
    region: "Madhya Pradesh",
    also: "Gondi tribal tradition",
    image: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=800",
    description:
      "Gond art is a tribal tradition from the Gondi people of Madhya Pradesh, one of India's largest Adivasi communities. What makes it instantly recognisable is its intricate texture — every shape is filled with patterns of dots, dashes, and lines rather than flat colour. Trees, animals, and mythological figures are the most common subjects, rendered in vibrant complementary colours that make the work pulse with energy.",
    characteristics: [
      "Intricate dot-and-line texture fills every shape",
      "Vivid, high-contrast colour combinations",
      "Subjects: trees, animals, birds, folk deities",
      "No perspective — flat, graphic compositions",
      "Often depicts the Gond cosmological worldview",
    ],
    priceRange: "₹1,500 – ₹20,000",
    turnaround: "10–21 days",
    bestFor: ["Office art", "Children's rooms", "Print series", "Corporate gifts"],
    color: "text-green-700 bg-green-50 border-green-200",
  },
  {
    id: "warli",
    name: "Warli",
    region: "Maharashtra / Gujarat border",
    also: "One of the oldest Indian art forms",
    image: "https://images.unsplash.com/photo-1605634288001-c8c3e8774775?q=80&w=800",
    description:
      "Warli art is one of India's oldest art forms, estimated to be over 2,500 years old. Originating among the Warli tribe of Maharashtra, it uses only the simplest geometric shapes — circles, triangles, and squares — to depict entire village scenes: harvests, dances, hunts, and celebrations. Traditionally painted in white rice paste on a red mud wall, today's Warli artists work on paper and canvas while preserving the monochrome simplicity that gives it its timeless power.",
    characteristics: [
      "Geometric vocabulary: circles, triangles, squares only",
      "White on dark ochre/red or black background",
      "Monochromatic — rarely uses colour",
      "Narrative style — tells a story across the canvas",
      "Community scenes: dances, harvests, wildlife",
    ],
    priceRange: "₹800 – ₹12,000",
    turnaround: "7–21 days",
    bestFor: ["Minimalist interiors", "Café walls", "Brand illustrations", "Gift art"],
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    id: "pichwai",
    name: "Pichwai",
    region: "Nathdwara, Rajasthan",
    also: "Sacred temple art",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
    description:
      "Pichwai (from Sanskrit: 'pichh' = back, 'waa' = hanging) is a sacred art form from Nathdwara, Rajasthan, created as devotional backdrops for the idol of Shrinathji — a form of Krishna. Each painting depicts a specific festival or season in Krishna's life. The defining features are the eternal lotus, intricate peacock motifs, and a palette dominated by deep indigo, gold leaf, and rich greens. Authentic Pichwais are painted on fine cloth with natural mineral pigments and can take months to complete.",
    characteristics: [
      "Painted on fine cotton or silk cloth",
      "Gold leaf accents on deity and ornaments",
      "Deep indigo and rich jewel-tone palette",
      "Subjects: Krishna leelas, the 24 festivals of Nathdwara",
      "Intricate detailing in flowers, peacocks, cows",
    ],
    priceRange: "₹5,000 – ₹80,000",
    turnaround: "21–60 days",
    bestFor: ["Puja rooms", "Luxury interiors", "Statement pieces", "Temple décor"],
    color: "text-indigo-700 bg-indigo-50 border-indigo-200",
  },
  {
    id: "tanjore",
    name: "Tanjore",
    region: "Thanjavur, Tamil Nadu",
    also: "Thanjavur painting",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800",
    description:
      "Tanjore painting is the classical South Indian tradition of Thanjavur (Tanjore), Tamil Nadu. It is one of the most lavish art forms in India — characterised by the application of genuine 22-karat gold foil, semi-precious stones, and glass beads on raised stucco relief work. Subjects are exclusively devotional: Hindu deities, saints, and scenes from the Puranas. A single large Tanjore piece can take an artist three months to complete.",
    characteristics: [
      "22-karat gold foil applied on raised gesso relief",
      "Semi-precious stones and glass beads for jewels",
      "Rich red, green, and blue lacquer base colours",
      "Exclusively devotional — deities and saints only",
      "Subject surrounded by intricate gold arch frames",
    ],
    priceRange: "₹4,000 – ₹1,50,000",
    turnaround: "21–90 days",
    bestFor: ["Puja rooms", "Luxury gifting", "Heritage interiors", "Wedding mandaps"],
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
  },
  {
    id: "kalamkari",
    name: "Kalamkari",
    region: "Andhra Pradesh & Telangana",
    also: "Hand-painted resist-dyed fabric art",
    image: "https://images.unsplash.com/photo-1582560475093-6d4b0dc5e7e0?q=80&w=800",
    description:
      "Kalamkari (kalam = pen, kari = work) is the art of hand-painting or block-printing on cotton or silk using natural dyes. It has two distinct schools: the Srikalahasti style, which is entirely hand-drawn with a bamboo pen, and the Machilipatnam style, which uses carved wooden blocks. Both use only natural dyes — indigo, pomegranate rind, iron rust — resulting in a characteristic earthy palette. Subjects are Hindu mythological narratives, most often from the Ramayana.",
    characteristics: [
      "Natural dyes only: indigo, turmeric, iron, pomegranate",
      "Painted on pre-treated cotton with a tamarind pen",
      "Rich narrative scenes from Hindu epics",
      "Fluid, confident line work with no corrections",
      "Characteristic earthy palette: rust, indigo, black",
    ],
    priceRange: "₹1,200 – ₹30,000",
    turnaround: "14–45 days",
    bestFor: ["Textile art", "Wall hangings", "Saree borders", "Hospitality décor"],
    color: "text-orange-700 bg-orange-50 border-orange-200",
  },
  {
    id: "pattachitra",
    name: "Pattachitra",
    region: "Odisha & West Bengal",
    also: "Cloth-based scroll painting",
    image: "https://images.unsplash.com/photo-1605634288001-c8c3e8774775?q=80&w=800",
    description:
      "Pattachitra (patta = cloth, chitra = picture) is a classical art tradition of Odisha, closely associated with the Jagannath temple cult of Puri. The paintings are done on a specially prepared cloth coated with a mixture of chalk and gum, giving it a smooth, board-like surface. Every Pattachitra is outlined in black, filled with rich natural colours, and finished with a white border of creeper-flower patterns. The artists — called Chitrakars — are hereditary craftspeople who learn the art from childhood.",
    characteristics: [
      "Painted on cloth coated with chalk-gum mixture",
      "Characteristic creeper-flower white border",
      "Rich, opaque natural colour fills",
      "Subjects: Jagannath, Ramayana, Mahabharata",
      "Intricate detail work in face and ornament",
    ],
    priceRange: "₹1,500 – ₹35,000",
    turnaround: "14–30 days",
    bestFor: ["Temple souvenirs", "Heritage collectors", "Mythology series", "Cultural gifts"],
    color: "text-red-700 bg-red-50 border-red-200",
  },
  {
    id: "watercolor",
    name: "Indian Watercolour",
    region: "Pan-India",
    also: "Contemporary & traditional styles",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
    description:
      "Contemporary Indian watercolour artists blend Western techniques with distinctly Indian subject matter — ghats at dawn, monsoon landscapes, village markets, textile patterns. The medium allows for soft atmospheric effects that other Indian styles cannot achieve: mist over the Ganges, dusk light on the Thar Desert, the translucence of a silk sari. Many artists working in this style trained at J.J. School of Art (Mumbai) or Santiniketan and have developed a distinctly Indian watercolour idiom.",
    characteristics: [
      "Transparent, layered washes of pigment",
      "Wet-on-wet techniques for soft atmospheric effects",
      "Subjects: landscapes, portraits, street scenes, nature",
      "Contemporary Indian aesthetic sensibility",
      "Works on 300gsm cold-pressed cotton paper",
    ],
    priceRange: "₹1,500 – ₹40,000",
    turnaround: "7–21 days",
    bestFor: ["Landscapes", "Portrait gifts", "Architecture", "Wedding scenes"],
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
];

export default function StylesPage() {
  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative border-b border-cream-dark py-16 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.045} className="w-full h-full" />
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-2">Education</p>
          <h1 className="font-serif text-5xl text-ink mb-4">Indian Art Style Guide</h1>
          <p className="text-ink-soft text-base leading-relaxed max-w-2xl mb-8">
            Before you commission, understand what you&apos;re asking for. Each of India&apos;s
            traditional art forms has a distinct visual language, regional origin, and cultural
            context — this guide helps you find the right match for your brief.
          </p>
          <div className="flex flex-wrap gap-2">
            {ART_STYLES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 text-xs font-medium border border-cream-dark rounded-full text-ink-soft hover:border-accent/40 hover:text-accent transition-all"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Styles ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 space-y-24">
        {ART_STYLES.map((style, i) => (
          <section key={style.id} id={style.id} className="scroll-mt-24">
            <div className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-start`}>

              {/* Image */}
              <div className="w-full md:w-2/5 flex-shrink-0">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-warm border border-cream-dark">
                  <Image src={style.image} alt={style.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${style.color}`}>
                      <MapPin size={10} /> {style.region}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-xs text-ink-faint uppercase tracking-wider mb-1">{style.also}</p>
                <h2 className="font-serif text-4xl text-ink mb-4">{style.name}</h2>
                <p className="text-ink-soft text-sm leading-relaxed mb-6">{style.description}</p>

                {/* Characteristics */}
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wider text-ink-faint mb-3">Defining characteristics</p>
                  <ul className="space-y-1.5">
                    {style.characteristics.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-ink-soft">
                        <span className="text-accent mt-1 flex-shrink-0">◆</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-1.5 text-ink-soft">
                    <IndianRupee size={13} className="text-accent" />
                    <span>{style.priceRange}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-ink-soft">
                    <Clock size={13} className="text-accent" />
                    <span>{style.turnaround}</span>
                  </div>
                </div>

                {/* Best for */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {style.bestFor.map((b) => (
                    <span key={b} className="tag-pill">{b}</span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href={`/generate?style=${style.id}`}
                    className="btn-accent flex items-center gap-2 text-sm"
                  >
                    <Sparkles size={13} /> Generate {style.name}
                  </Link>
                  <Link
                    href={`/lens?style=${style.id}`}
                    className="btn-outline flex items-center gap-2 text-sm"
                  >
                    Find Artists <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Divider between styles */}
            {i < ART_STYLES.length - 1 && (
              <div className="mt-16 flex items-center gap-4">
                <div className="flex-1 h-px bg-cream-dark" />
                <span className="text-accent/30 text-lg font-serif">◆</span>
                <div className="flex-1 h-px bg-cream-dark" />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="border-t border-cream-dark bg-cream-card py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-3xl text-ink mb-3">Found your style?</p>
          <p className="text-ink-soft text-sm mb-8">
            Generate an AI concept to visualise your idea, then commission a verified artist to make it real.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/generate" className="btn-accent flex items-center gap-2">
              <Sparkles size={14} /> Generate Artwork
            </Link>
            <Link href="/lens" className="btn-outline flex items-center gap-2 text-sm">
              Browse Artists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
