import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate AI Art | ARTERY",
  description:
    "Generate stunning AI artwork in authentic Indian styles — Madhubani, Gond, Warli, Tanjore, Pichwai, Watercolour and more. Then commission a real artist to paint it by hand.",
  openGraph: {
    title: "Generate Indian AI Art | ARTERY",
    description: "Create AI artwork in Madhubani, Gond, Warli and more. Then commission a real artist.",
    type: "website",
  },
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
