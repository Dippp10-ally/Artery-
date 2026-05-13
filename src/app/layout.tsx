import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FabriChat } from "@/components/ui/FabriChat";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://artery.art";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ARTERY — Helping you pump that art in your blood",
    template: "%s | ARTERY",
  },
  description:
    "Discover and commission India's finest artists. Generate AI artwork in Madhubani, Gond, Warli and more — then have it painted, drawn, or sculpted into reality.",
  keywords: [
    "Indian art", "artisan commission", "AI art India", "Madhubani painting",
    "Gond art", "Warli art", "Tanjore painting", "Pichwai art",
    "commission artist", "buy Indian art", "folk art India",
  ],
  authors: [{ name: "ARTERY" }],
  creator: "ARTERY",
  publisher: "ARTERY",
  openGraph: {
    title: "ARTERY — Helping you pump that art in your blood",
    description: "Generate AI artwork and commission India's finest artists to make it real.",
    url: APP_URL,
    siteName: "ARTERY",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${APP_URL}/images/og-default.png`,
        width: 1200,
        height: 630,
        alt: "ARTERY — Indian art platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARTERY — Helping you pump that art in your blood",
    description: "Generate AI artwork and commission India's finest artists to make it real.",
    images: [`${APP_URL}/images/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-cream text-ink font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FabriChat />
      </body>
    </html>
  );
}
