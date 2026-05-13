import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support | ARTERY",
  description:
    "Need help? Contact the ARTERY support team for order issues, payment questions, dispute resolution, or account help. We respond within 4 hours on weekdays.",
  openGraph: {
    title: "Contact ARTERY Support",
    description: "Get help with your order, payment, or account. Our team responds within 4 hours.",
    type: "website",
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
