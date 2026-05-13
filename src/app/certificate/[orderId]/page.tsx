"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Download, BadgeCheck, Printer } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

// Mock order data — replace with Supabase fetch
const MOCK_CERTS: Record<string, {
  orderId: string; artworkTitle: string; artistName: string; patronName: string;
  style: string; dimensions: string; medium: string; completedAt: string;
  uniqueId: string;
}> = {
  ord_003: {
    orderId: "ord_003",
    artworkTitle: "Oil Abstract — Mumbai Skyline",
    artistName: "Rohan Gupta",
    patronName: "Art Enthusiast",
    style: "Oil on Canvas",
    dimensions: "24 × 36 inches",
    medium: "Oil paint on stretched canvas",
    completedAt: "2025-04-15",
    uniqueId: "ART-2025-003-RG",
  },
};

export default function CertificatePage({ params }: { params: { orderId: string } }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [cert, setCert] = useState<typeof MOCK_CERTS[string] | null>(null);

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    // Try Supabase first, fall back to mock
    const mockCert = MOCK_CERTS[params.orderId];
    if (mockCert) {
      // Personalise with logged-in user's name
      setCert({ ...mockCert, patronName: user.name ?? mockCert.patronName });
    }
  }, [params.orderId, user, router]);

  if (!cert) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <p className="text-ink-soft text-sm">Certificate not found or not yet issued.</p>
      </div>
    );
  }

  const handlePrint = () => window.print();
  const handleDownload = () => {
    // In production, generate a PDF server-side using puppeteer or @react-pdf/renderer
    handlePrint();
  };

  return (
    <div className="bg-cream min-h-screen py-10 px-6 md:px-12 print:py-0 print:px-0 print:bg-white">
      <div className="max-w-2xl mx-auto">

        {/* Action bar — hidden when printing */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button onClick={() => router.back()} className="text-sm text-ink-soft hover:text-accent transition-colors">
            ← Back to order
          </button>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="btn-outline flex items-center gap-2 text-sm">
              <Printer size={13} /> Print
            </button>
            <button onClick={handleDownload} className="btn-accent flex items-center gap-2">
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>

        {/* Certificate document */}
        <div className="bg-white border-4 border-double border-accent/40 rounded-2xl p-10 shadow-warm-lg print:shadow-none print:border-gray-400 print:rounded-none">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-accent text-xl font-serif">◆</span>
              <span className="font-serif text-2xl text-ink tracking-tight">ARTERY</span>
              <span className="text-accent text-xl font-serif">◆</span>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-faint mb-2">Certificate of Authenticity</p>
            <div className="w-24 h-0.5 bg-accent/30 mx-auto" />
          </div>

          {/* Body text */}
          <div className="text-center space-y-4 mb-8">
            <p className="text-ink-soft text-sm">This certifies that the original artwork</p>
            <h1 className="font-serif text-3xl text-ink leading-tight">&ldquo;{cert.artworkTitle}&rdquo;</h1>
            <p className="text-ink-soft text-sm">was created by</p>
            <p className="font-serif text-2xl text-accent">{cert.artistName}</p>
            <p className="text-ink-soft text-sm">and commissioned by</p>
            <p className="font-serif text-xl text-ink">{cert.patronName}</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-cream-dark" />
            <Shield size={16} className="text-accent/40" />
            <div className="flex-1 h-px bg-cream-dark" />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-8">
            <div className="bg-cream-card rounded-lg p-3">
              <p className="text-xs text-ink-faint mb-1 uppercase tracking-wider">Style</p>
              <p className="text-ink font-medium">{cert.style}</p>
            </div>
            <div className="bg-cream-card rounded-lg p-3">
              <p className="text-xs text-ink-faint mb-1 uppercase tracking-wider">Medium</p>
              <p className="text-ink font-medium">{cert.medium}</p>
            </div>
            <div className="bg-cream-card rounded-lg p-3">
              <p className="text-xs text-ink-faint mb-1 uppercase tracking-wider">Dimensions</p>
              <p className="text-ink font-medium">{cert.dimensions}</p>
            </div>
            <div className="bg-cream-card rounded-lg p-3">
              <p className="text-xs text-ink-faint mb-1 uppercase tracking-wider">Completed</p>
              <p className="text-ink font-medium">
                {new Date(cert.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Unique ID + verification */}
          <div className="border border-cream-dark rounded-lg p-4 flex items-center gap-3 mb-8 bg-cream-card">
            <BadgeCheck size={18} className="text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-ink-faint">Unique Certificate ID</p>
              <p className="font-mono text-sm text-ink font-semibold">{cert.uniqueId}</p>
            </div>
            <p className="ml-auto text-xs text-ink-faint text-right max-w-[140px] leading-snug">
              Verify at artery.art/verify/{cert.uniqueId}
            </p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end mt-4">
            <div className="text-center">
              <div className="w-32 border-t border-ink/30 pt-2">
                <p className="text-xs text-ink-soft">{cert.artistName}</p>
                <p className="text-[10px] text-ink-faint">Artist Signature</p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 border-t border-ink/30 pt-2">
                <p className="text-xs text-ink-soft">ARTERY Platform</p>
                <p className="text-[10px] text-ink-faint">Verified & Authenticated</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-ink-faint mt-8">
            This certificate was issued on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} by ARTERY — artery.art
          </p>
        </div>
      </div>
    </div>
  );
}
