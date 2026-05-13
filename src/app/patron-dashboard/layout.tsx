import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard | ARTERY",
  description: "Manage your generated images, connected artists, active commissions and account settings.",
};

export default function PatronDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
