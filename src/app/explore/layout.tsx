import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore — Community Generations | ARTERY",
  description:
    "Browse AI-generated artwork from the ARTERY community. Find inspiration for your next commission — Madhubani, Gond, Warli, Pichwai, Tanjore and more.",
  openGraph: {
    title: "Explore Community Art | ARTERY",
    description: "Browse AI-generated artwork from India's art community and get inspired.",
    type: "website",
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
