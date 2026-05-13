import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Help Centre | ARTERY",
  description:
    "Answers to common questions about commissioning art, payments, delivery, subscriptions, and the ARTERY platform. Find what you need instantly.",
  openGraph: {
    title: "ARTERY Help Centre & FAQ",
    description: "Everything you need to know about commissioning, payments and delivery on ARTERY.",
    type: "website",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
