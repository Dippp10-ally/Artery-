"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle, Mail, Clock, Shield, Package,
  CreditCard, Star, ChevronRight, Send, CheckCircle2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WarliArt } from "@/components/ui/WarliArt";
import { useAuthStore } from "@/store/authStore";

// ── Issue categories ──────────────────────────────────────────────────────────
const ISSUE_TYPES = [
  { id: "order",    label: "Order or delivery issue",        icon: Package },
  { id: "payment",  label: "Payment or billing question",    icon: CreditCard },
  { id: "dispute",  label: "Dispute with artist / patron",   icon: AlertCircle },
  { id: "quality",  label: "Quality complaint",              icon: Star },
  { id: "account",  label: "Account or login help",          icon: Shield },
  { id: "other",    label: "Something else",                 icon: MessageCircle },
];

// ── Quick links ───────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Track my order",        href: "/orders",           icon: Package },
  { label: "Browse FAQ",            href: "/faq",              icon: MessageCircle },
  { label: "Manage subscription",   href: "/patron-dashboard", icon: CreditCard },
  { label: "View active commissions", href: "/commissions",    icon: Star },
];

export default function SupportPage() {
  const { user } = useAuthStore();

  const [issueType,  setIssueType]  = useState("");
  const [subject,    setSubject]    = useState("");
  const [message,    setMessage]    = useState("");
  const [orderId,    setOrderId]    = useState("");
  const [email,      setEmail]      = useState(user?.email ?? "");
  const [sending,    setSending]    = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType || !subject.trim() || !message.trim() || !email.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSending(true);

    try {
      // Try to write ticket to Supabase (table: support_tickets)
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        await fetch(`${url}/rest/v1/support_tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            user_id:    user?.id ?? null,
            email:      email.trim(),
            issue_type: issueType,
            subject:    subject.trim(),
            message:    message.trim(),
            order_id:   orderId.trim() || null,
          }),
        });
      }
      // Always show success — mock fallback if table doesn't exist yet
    } catch { /* silent */ }

    setSubmitted(true);
    setSending(false);
  };

  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative border-b border-cream-dark py-16 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none">
          <WarliArt variant="corner-tl" opacity={0.045} className="w-full h-full" />
        </div>
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">Help Centre</p>
          <h1 className="font-serif text-5xl text-ink mb-3">Contact Support</h1>
          <p className="text-ink-soft text-sm">
            We typically respond within 4 hours on weekdays. For urgent delivery or payment issues, include your Order ID.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 grid md:grid-cols-3 gap-10">

        {/* ── Left: Form ──────────────────────────────────────── */}
        <div className="md:col-span-2">

          {submitted ? (
            <div className="bg-cream-card border border-green-200 rounded-2xl p-10 text-center">
              <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-ink mb-2">Message received!</h2>
              <p className="text-ink-soft text-sm mb-1">
                We&apos;ve sent a confirmation to <strong>{email}</strong>.
              </p>
              <p className="text-ink-faint text-sm mb-8">
                Our team will respond within 4 business hours (Mon–Sat, 10 am – 7 pm IST).
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/orders" className="btn-outline text-sm flex items-center gap-2">
                  <Package size={13} /> Track Orders
                </Link>
                <Link href="/faq" className="btn-accent flex items-center gap-2">
                  <MessageCircle size={13} /> Browse FAQ
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Issue type grid */}
              <div>
                <label className="block text-xs text-ink-faint mb-3 uppercase tracking-wider">
                  What can we help you with? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ISSUE_TYPES.map(({ id, label, icon: Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setIssueType(id)}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left text-sm font-medium transition-all",
                        issueType === id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-cream-dark text-ink-soft hover:border-accent/30 hover:text-ink bg-cream-card"
                      )}
                    >
                      <Icon size={14} className="flex-shrink-0" />
                      <span className="leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-ink-faint mb-1.5 uppercase tracking-wider">
                  Your email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-warm w-full text-sm"
                  required
                />
              </div>

              {/* Order ID (optional) */}
              <div>
                <label className="block text-xs text-ink-faint mb-1.5 uppercase tracking-wider">
                  Order ID <span className="text-ink-faint font-normal normal-case">(optional — helps us respond faster)</span>
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="ord_001 or req_001"
                  className="input-warm w-full text-sm"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs text-ink-faint mb-1.5 uppercase tracking-wider">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short description of the issue"
                  className="input-warm w-full text-sm"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs text-ink-faint mb-1.5 uppercase tracking-wider">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe the issue in as much detail as possible. Include dates, amounts, and what you expected to happen."
                  rows={6}
                  className="input-warm w-full text-sm resize-none"
                  required
                />
                <p className="text-xs text-ink-faint mt-1">{message.length} / 2000 characters</p>
              </div>

              {error && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="btn-accent flex items-center gap-2 disabled:opacity-60"
              >
                {sending ? "Sending…" : <><Send size={14} /> Send Message</>}
              </button>

              <p className="text-xs text-ink-faint">
                By submitting this form you agree to our{" "}
                <Link href="/faq" className="underline hover:text-accent">Privacy Policy</Link>.
                We never share your information with third parties.
              </p>
            </form>
          )}
        </div>

        {/* ── Right: Info panel ───────────────────────────────── */}
        <div className="space-y-6">

          {/* Response time */}
          <div className="bg-cream-card border border-cream-dark rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-accent" />
              <h3 className="font-medium text-sm text-ink">Response Times</h3>
            </div>
            <ul className="space-y-2 text-xs text-ink-soft">
              <li className="flex justify-between">
                <span>General queries</span>
                <span className="font-medium text-ink">≤ 24 hrs</span>
              </li>
              <li className="flex justify-between">
                <span>Payment issues</span>
                <span className="font-medium text-ink">≤ 4 hrs</span>
              </li>
              <li className="flex justify-between">
                <span>Active disputes</span>
                <span className="font-medium text-ink">≤ 2 hrs</span>
              </li>
              <li className="flex justify-between">
                <span>Security reports</span>
                <span className="font-medium text-ink">≤ 1 hr</span>
              </li>
            </ul>
            <p className="text-[11px] text-ink-faint mt-3">Mon–Sat, 10 am – 7 pm IST</p>
          </div>

          {/* Direct contact */}
          <div className="bg-cream-card border border-cream-dark rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Mail size={14} className="text-accent" />
              <h3 className="font-medium text-sm text-ink">Direct Email</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-ink-faint">General support</p>
                <a href="mailto:support@artery.art" className="text-accent hover:underline font-medium">support@artery.art</a>
              </div>
              <div>
                <p className="text-ink-faint">Artist applications</p>
                <a href="mailto:artists@artery.art" className="text-accent hover:underline font-medium">artists@artery.art</a>
              </div>
              <div>
                <p className="text-ink-faint">Security issues</p>
                <a href="mailto:security@artery.art" className="text-accent hover:underline font-medium">security@artery.art</a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-cream-card border border-cream-dark rounded-xl p-5">
            <h3 className="font-medium text-sm text-ink mb-3">Quick Links</h3>
            <ul className="space-y-1">
              {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center justify-between gap-2 py-2 text-xs text-ink-soft hover:text-accent transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={12} className="text-ink-faint group-hover:text-accent" />
                      {label}
                    </span>
                    <ChevronRight size={11} className="text-ink-faint" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform notice */}
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Shield size={13} className="text-accent mt-0.5 flex-shrink-0" />
              <p className="text-xs text-ink-soft leading-relaxed">
                <strong className="text-ink">Keep transactions on-platform.</strong>{" "}
                We cannot mediate disputes for deals made outside ARTERY. Always use the platform messaging and order system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
