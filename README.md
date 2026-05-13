# Artery

A platform for discovering and commissioning India's traditional artisans — powered by AI-assisted art generation and a curated artist marketplace.

## What it does

Patrons describe the artwork they want, generate a visual concept using AI, and then commission a verified Indian artisan to recreate it by hand. Artists get a dedicated marketplace to showcase their work and manage commissions.

**Core flows:**
- AI art generation (DALL·E 3) with Indian art style presets — Madhubani, Gond, Warli, Miniature, etc.
- Artist discovery via Recommender Lens — matches your generated image to artisans whose style fits
- Commission marketplace — patrons post open briefs, artists submit quotes
- Order management with Ekart delivery tracking
- Certificate of Authenticity — auto-issued for each completed commission
- Subscription tiers (Basic / Pro / Premium) with Razorpay payments

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** Razorpay
- **AI:** OpenAI DALL·E 3
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting started

```bash
npm install
cp .env.example .env.local
# fill in your keys — see .env.example for what's needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database setup

Run the SQL files in order from the Supabase dashboard (SQL Editor → New Query):

1. `supabase/migrations/001_core.sql` — profiles, artists, orders, generated images
2. `supabase/migrations/002_commissions.sql` — commission requests, messages, reviews, quotes
3. `supabase/migrations/003_features.sql` — support tickets, certificates, generations

## Environment variables

See `.env.example` for the full list. Required before running:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings |
| `OPENAI_API_KEY` | platform.openai.com |
| `RAZORPAY_KEY_ID` | Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard |

## Project structure

```
src/
  app/          # Next.js App Router pages
  components/   # Shared UI components (Navbar, Footer, etc.)
  lib/          # Supabase client, utilities, rate limiting
  store/        # Zustand state (auth, cart)
  mock/         # Local mock data for artists and orders
  types/        # TypeScript types
supabase/
  migrations/   # SQL migration files (run in order)
public/
  images/       # Artist portfolio images
```
