import { NextRequest, NextResponse } from "next/server";
import { MOCK_ARTISTS } from "@/mock/artists";

/**
 * GET /api/artists
 * Query params: style, city, minRating, maxPrice, sort, q
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const style = searchParams.get("style");
  const city = searchParams.get("city");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") ?? "promoted";
  const q = searchParams.get("q")?.toLowerCase();

  const PROMOTION_ORDER: Record<string, number> = {
    spotlight: 4, featured: 3, standard: 2, none: 1,
  };

  let artists = MOCK_ARTISTS.filter((a) => !a.banned);

  if (q) {
    artists = artists.filter(
      (a) =>
        a.businessName.toLowerCase().includes(q) ||
        a.bio.toLowerCase().includes(q) ||
        a.styles.some((s) => s.includes(q))
    );
  }

  if (style) {
    artists = artists.filter((a) => a.styles.includes(style as never));
  }

  if (city) {
    artists = artists.filter((a) =>
      a.contact.studioCity.toLowerCase().includes(city.toLowerCase())
    );
  }

  if (maxPrice) {
    artists = artists.filter((a) => a.pricing.commissionBase <= Number(maxPrice));
  }

  artists.sort((a, b) => {
    if (sort === "promoted") return (PROMOTION_ORDER[b.promotionLevel] ?? 0) - (PROMOTION_ORDER[a.promotionLevel] ?? 0);
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "price_asc") return a.pricing.commissionBase - b.pricing.commissionBase;
    if (sort === "price_desc") return b.pricing.commissionBase - a.pricing.commissionBase;
    return 0;
  });

  // Strip contact info from response — only reveal to paying customers (enforced server-side in production)
  const sanitized = artists.map((a) => ({
    ...a,
    contact: {
      studioCity: a.contact.studioCity,
      // phone and instagram are excluded until payment verified
    },
  }));

  return NextResponse.json({ artists: sanitized, total: sanitized.length });
}
