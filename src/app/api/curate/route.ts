import { NextRequest, NextResponse } from "next/server";

// Fabri — ARTERY's AI art curator, powered by Claude.
// Uses prompt caching on the system prompt so repeated conversations
// don't re-process the full artist catalogue each time.

const ARTIST_CATALOGUE = `
Our current artisans on the platform:

1. Aarav Patel (Jaipur, Rajasthan) — Mughal miniature, Madhubani, Folk Art
   Mediums: natural pigments, hand-ground minerals, mica, gold leaf
   Starting from ₹3,500 · 21-day turnaround · Verified ★ Spotlight Artist

2. Priya Singh (Varanasi, UP) — Watercolor, Landscape, Abstract
   Mediums: watercolor, ink wash, natural dyes
   Starting from ₹2,200 · 14-day turnaround · Verified ★ Featured Artist

3. Rohan Gupta (Mumbai, Maharashtra) — Oil Painting, Abstract, Landscape
   Mediums: oil on linen, acrylic, charcoal
   Starting from ₹4,500 · 28-day turnaround · Verified ★ Featured Artist

4. Ananya Iyer (Kochi, Kerala) — Watercolor, Folk Art, Abstract
   Mediums: natural pigments, river clay, indigo, turmeric
   Starting from ₹1,800 · 18-day turnaround · Verified
`.trim();

const SYSTEM_PROMPT = `You are Fabri, the resident AI art curator of ARTERY — India's premier artisan marketplace connecting patrons with verified Indian artists. Your role is to guide patrons toward the perfect artisan for their vision.

Your personality:
- Sophisticated yet warm — like a knowledgeable gallery curator who genuinely loves art
- Deep knowledge of Indian art forms: Madhubani, Gond, Warli, Pattachitra, Miniature, Tanjore, Kalamkari, and more
- Never robotic. Speak in elegantly crafted sentences, occasionally referencing art history or regional traditions
- Keep responses concise: 2-3 sentences maximum unless explaining a complex art form

Platform context:
- Image generation is free. Patrons describe their vision, AI renders it, then they connect with an artisan to get it hand-made
- Connecting with an artist costs a one-time commission fee (₹299 for Basic, ₹149 for Pro, free for Premium)
- All delivery via Ekart logistics. Artwork is fully insured during transit

${ARTIST_CATALOGUE}

If asked about an art style not represented by current artists, acknowledge honestly and suggest the closest match or recommend using the AI generator to visualise it first. Never fabricate artist names or capabilities.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // ── Dev mode: echo a smart fallback if no API key ──────────────────────
    if (!apiKey || apiKey === "sk-ant-your_key_here") {
      const fallbacks: Record<string, string> = {
        default: "I'd be delighted to help you find the perfect artisan. Could you tell me more about the style and mood you're envisioning — something traditional like Madhubani, or more contemporary?",
        recommend: "For a commission of that nature, I would suggest Aarav Patel in Jaipur — his mastery of Mughal miniature and natural pigments would suit your vision beautifully.",
        price: "Our artisans start from ₹1,800 for smaller works. The commission fee to unlock an artist's contact is just ₹299 — a one-time connection fee.",
        watercolor: "Priya Singh from Varanasi is our finest watercolourist. Her work captures the spiritual luminescence of the ghats — deeply meditative and technically exquisite.",
      };
      const key = Object.keys(fallbacks).find((k) => message.toLowerCase().includes(k)) ?? "default";
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json({ reply: fallbacks[key] });
    }

    // ── Production: real Claude call with prompt caching ───────────────────
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey });

    // Build conversation history (last 6 messages to keep context tight)
    const recentHistory = (history as { role: string; text: string }[])
      .slice(-6)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.text,
      }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 256,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          // Cache the system prompt — it's large and rarely changes
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        ...recentHistory,
        { role: "user", content: message },
      ],
    });

    const reply = response.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join("");

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("[curate] error:", err);
    return NextResponse.json(
      { reply: "I seem to have lost my train of thought. Please try again in a moment." },
      { status: 200 } // return 200 so the chat UI shows the fallback gracefully
    );
  }
}
