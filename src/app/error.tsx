"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error tracking service here (e.g. Sentry)
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">

        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={24} className="text-red-500" />
        </div>

        <h1 className="font-serif text-3xl text-ink mb-3">Something went wrong</h1>
        <p className="text-ink-soft text-sm leading-relaxed mb-2">
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-xs text-ink-faint mb-8 font-mono bg-cream-card border border-cream-dark rounded px-3 py-1.5 inline-block">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={reset}
            className="btn-accent flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> Try Again
          </button>
          <Link href="/" className="btn-outline flex items-center justify-center gap-2 text-sm">
            <Home size={14} /> Go Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-ink-faint">
          If this keeps happening,{" "}
          <Link href="/support" className="underline hover:text-accent">contact support</Link>.
        </p>
      </div>
    </div>
  );
}
