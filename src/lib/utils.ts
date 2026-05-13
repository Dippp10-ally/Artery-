import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\+\d{2})(\d{5})(\d{5})/, "$1 $2 $3");
}

export function blurPhone(phone: string): string {
  return phone.replace(/(\+\d{2})(\d{5})(\d{5})/, "$1 XXXXX $3");
}

export function blurEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}***@${domain}`;
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function getStyleColor(style: string): string {
  const colors: Record<string, string> = {
    watercolor: "bg-blue-900/40 text-blue-300 border-blue-700/40",
    "oil-painting": "bg-amber-900/40 text-amber-300 border-amber-700/40",
    "digital-illustration": "bg-purple-900/40 text-purple-300 border-purple-700/40",
    "folk-art": "bg-orange-900/40 text-orange-300 border-orange-700/40",
    madhubani: "bg-pink-900/40 text-pink-300 border-pink-700/40",
    geometric: "bg-cyan-900/40 text-cyan-300 border-cyan-700/40",
    minimalist: "bg-gray-800/60 text-gray-300 border-gray-600/40",
    abstract: "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
    portrait: "bg-rose-900/40 text-rose-300 border-rose-700/40",
    landscape: "bg-green-900/40 text-green-300 border-green-700/40",
    "pen-ink": "bg-neutral-800/60 text-neutral-300 border-neutral-600/40",
    surrealism: "bg-violet-900/40 text-violet-300 border-violet-700/40",
    "pop-art": "bg-yellow-900/40 text-yellow-300 border-yellow-700/40",
    sculpture: "bg-stone-800/60 text-stone-300 border-stone-600/40",
  };
  return colors[style] ?? "bg-zinc-800/60 text-zinc-300 border-zinc-600/40";
}
