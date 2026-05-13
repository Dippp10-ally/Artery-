import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://artery.art";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/generate`,        lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/explore`,         lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/lens`,            lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/commissions`,     lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/about`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/faq`,             lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/support`,         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/subscription`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Artist profile pages (using mock IDs — replace with DB fetch in production)
  const artistIds = ["artist_001", "artist_002", "artist_003"];
  const artistRoutes: MetadataRoute.Sitemap = artistIds.map((id) => ({
    url: `${BASE}/artists/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...artistRoutes];
}
