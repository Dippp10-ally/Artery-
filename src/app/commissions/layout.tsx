import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Commissions Marketplace | ARTERY",
  description:
    "Browse open art commission requests from patrons across India. Submit a quote, accept a brief, and get paid for your craft. Madhubani, Gond, Watercolour, Oil and more.",
  openGraph: {
    title: "Art Commissions Marketplace | ARTERY",
    description: "Browse open art commissions and submit quotes to patrons across India.",
    type: "website",
  },
};

export default function CommissionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
