"use client";

import { useState } from "react";
import { Check, Sparkles, Star, Zap, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WarliArt } from "@/components/ui/WarliArt";

const PATRON_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    billing: "Free forever",
    features: [
      "Unlimited AI image generation",
      "Browse artisan directory",
      "₹299 commission fee per connection",
      "Standard delivery tracking",
    ],
    highlight: false,
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro Collector",
    price: 499,
    billing: "per month",
    features: [
      "Everything in Basic",
      "Commission fee reduced to ₹149",
      "Priority Recommender Lens matching",
      "Save up to 50 generated images",
      "3 artist connections per month included",
      "Dedicated support",
    ],
    highlight: true,
    cta: "Start Pro",
  },
  {
    id: "premium",
    name: "Premium Patron",
    price: 999,
    billing: "per month",
    features: [
      "Everything in Pro",
      "Zero commission fees",
      "Unlimited saved images",
      "Unlimited artist connections",
      "First access to new artisans",
      "Concierge commission assistance",
    ],
    highlight: false,
    cta: "Go Premium",
  },
];

const ARTIST_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    billing: "Free forever",
    features: [
      "List up to 10 portfolio pieces",
      "Appear in standard Recommender Lens",
      "Receive commission requests",
      "Basic sales dashboard",
    ],
    highlight: false,
    cta: "Join Free",
  },
  {
    id: "pro-artist",
    name: "Pro Artist",
    price: 499,
    billing: "per month",
    features: [
      "Everything in Starter",
      "Upload up to 50 portfolio pieces",
      "Featured badge on your profile",
      "Promoted placement in Lens results",
      "Advanced sales analytics",
      "Priority support for disputes",
    ],
    highlight: true,
    cta: "Go Pro",
  },
];

export default function SubscriptionPage() {
  const [view, setView] = useState<"patron" | "artist">("patron");

  return (
    <div className="bg-cream min-h-screen">

      {/* Header */}
      <section className="relative py-16 px-6 md:px-12 border-b border-cream-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.05} className="w-full h-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label mb-3">Plans & Pricing</p>
          <h1 className="font-serif text-5xl text-ink mb-4">Simple, honest pricing</h1>
          <p className="section-body mx-auto">
            Image generation is always free. Pay only when you connect with an artist — or subscribe to save more.
          </p>

          {/* Toggle */}
          <div className="inline-flex mt-8 bg-cream-card border border-cream-dark rounded-lg p-1">
            <button
              onClick={() => setView("patron")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                view === "patron" ? "bg-accent text-cream shadow-sm" : "text-ink-soft hover:text-ink"
              )}
            >
              For Patrons
            </button>
            <button
              onClick={() => setView("artist")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                view === "artist" ? "bg-accent text-cream shadow-sm" : "text-ink-soft hover:text-ink"
              )}
            >
              For Artists
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "grid gap-6",
            view === "patron" ? "md:grid-cols-3" : "md:grid-cols-2 max-w-2xl mx-auto"
          )}>
            {(view === "patron" ? PATRON_PLANS : ARTIST_PLANS).map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "rounded-xl border p-7 flex flex-col relative",
                  plan.highlight
                    ? "border-accent bg-cream-card shadow-accent"
                    : "border-cream-dark bg-cream shadow-warm"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-cream text-[11px] font-semibold uppercase tracking-wider px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-serif text-2xl text-ink mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-4xl text-ink">
                      {plan.price === 0 ? "Free" : `₹${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-ink-soft text-sm">{plan.billing}</span>
                    )}
                  </div>
                  {plan.price === 0 && (
                    <p className="text-ink-faint text-xs mt-1">{plan.billing}</p>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                      <Check size={14} className="text-accent flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={cn(
                    "w-full text-center py-3 rounded-md text-sm font-medium transition-all",
                    plan.highlight
                      ? "btn-accent"
                      : "btn-outline"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ note */}
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "No hidden fees", desc: "Every charge is shown upfront before you confirm. Commission fees are fixed and transparent." },
              { icon: Zap, title: "Cancel anytime", desc: "Monthly plans can be cancelled at any time. You keep access until the end of the billing period." },
              { icon: Truck, title: "Delivery always included", desc: "Delivery charges are shown at checkout and cover Ekart logistics + packaging materials." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={15} className="text-accent" />
                </div>
                <div>
                  <p className="font-medium text-ink text-sm mb-1">{title}</p>
                  <p className="text-ink-soft text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
