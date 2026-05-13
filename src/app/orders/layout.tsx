import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | ARTERY",
  description: "Track your active art commissions and view your order history on ARTERY.",
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
