import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artist Directory | ARTERY",
  description:
    "Discover and connect with India's finest verified artists. Browse by style — Madhubani, Gond, Warli, Tanjore, Miniature, Watercolour, Oil and more. Commission original artwork.",
  openGraph: {
    title: "Indian Artist Directory | ARTERY",
    description: "Discover and commission India's finest verified artists across all traditional styles.",
    type: "website",
  },
};

export default function LensLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
