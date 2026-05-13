import Link from "next/link";
import { Sparkles, Home, Search } from "lucide-react";
import { WarliArt } from "@/components/ui/WarliArt";

export default function NotFound() {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center relative">

        <div className="absolute -top-16 -right-8 w-40 h-40 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.05} className="w-full h-full" />
        </div>

        {/* Giant 404 */}
        <p className="font-serif text-[8rem] leading-none text-accent/10 select-none font-bold">
          404
        </p>

        <div className="-mt-6 relative">
          <div className="w-14 h-14 mx-auto mb-5 opacity-25">
            <WarliArt variant="scatter" opacity={1} className="w-full h-full" />
          </div>

          <h1 className="font-serif text-3xl text-ink mb-3">This canvas is blank</h1>
          <p className="text-ink-soft text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist, was moved, or the link has expired.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-accent flex items-center justify-center gap-2">
              <Home size={14} /> Back to Home
            </Link>
            <Link href="/explore" className="btn-outline flex items-center justify-center gap-2 text-sm">
              <Search size={14} /> Browse Explore
            </Link>
            <Link href="/generate" className="btn-outline flex items-center justify-center gap-2 text-sm">
              <Sparkles size={14} /> Generate Art
            </Link>
          </div>

          <p className="mt-8 text-xs text-ink-faint">
            Need help?{" "}
            <Link href="/support" className="underline hover:text-accent transition-colors">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
