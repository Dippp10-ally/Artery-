# Contributing to Artery

First off — thank you for being here. Artery is built on the belief that technology should lift human artists, not replace them. Every contribution to this codebase, no matter how small, is a step toward that.

This guide will get you from zero to your first pull request.

---

## Table of contents

- [Who should contribute](#who-should-contribute)
- [Getting started](#getting-started)
- [How to pick an issue](#how-to-pick-an-issue)
- [Good first issues](#good-first-issues)
- [Project structure](#project-structure)
- [Making a pull request](#making-a-pull-request)
- [Code style](#code-style)
- [Commit messages](#commit-messages)
- [Need help?](#need-help)

---

## Who should contribute

You don't need to be a senior developer. If you can do any of the following, there's a place for you here:

- Write React/Next.js — most of the work is here
- Write SQL — the Supabase migrations need expansion
- Write CSS/Tailwind — plenty of UI polish and mobile fixes needed
- Care about Indian art, culture, or artisan communities — your perspective shapes the product decisions
- Find bugs — open an issue, that's a contribution too

---

## Getting started

### 1. Fork and clone

```bash
git clone https://github.com/YOUR_USERNAME/Artery-.git
cd Artery-
npm install
cp .env.example .env.local
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000) with mock data. You don't need real API keys to see and work on most of the UI.

### 2. Set up your branch

Always branch off `main`:

```bash
git checkout -b your-branch-name
```

Branch naming convention:
- `fix/` — for bug fixes (`fix/mobile-navbar-overlap`)
- `feat/` — for new features (`feat/artist-onboarding-flow`)
- `docs/` — for documentation (`docs/update-setup-guide`)
- `chore/` — for cleanup, refactoring, dependency updates

### 3. Make your changes, then open a PR

Open a pull request against `main`. Fill in the PR description — what you changed and why.

---

## How to pick an issue

1. Go to the [Issues tab](https://github.com/Swayam-Kumaarr/Artery-/issues)
2. Filter by `good first issue` if you're new, or `help wanted` if you're comfortable
3. Comment on the issue saying you'd like to work on it — we'll assign it to you
4. Don't start work without being assigned. Multiple people picking the same issue wastes everyone's time.

If you have an idea that doesn't have an issue yet, open one first and describe what you want to build. We'll discuss it before you spend time on it.

---

## Good first issues

These are real gaps in the codebase that need fixing. Pick any one:

### UI & Frontend
- **Replace mock artist data** — `src/mock/artists.ts` has hardcoded artists. Connect `src/app/lens/page.tsx` to the real Supabase `artists` table
- **Empty states** — Several pages (orders, saved images, commissions) show nothing when there's no data. Add a helpful illustration and CTA button for each
- **Mobile polish** — Audit any page on 375px width. Fix overflows, text truncation, touch targets that are too small
- **Loading skeletons** — Some pages fetch data but show nothing while loading. Add a skeleton component matching the page layout
- **Terms of Service page** — Create `/app/terms/page.tsx`. It's linked in the footer but doesn't exist
- **Privacy Policy page** — Same as above, create `/app/privacy/page.tsx`
- **404 page improvement** — `src/app/not-found.tsx` exists but could have better navigation back into the site

### Features
- **Artist onboarding flow** — There's no way for a new artist to actually sign up. Build `/app/artist-onboarding/page.tsx` with a multi-step form: basic info → portfolio upload → pricing → submit for review
- **Commission request form** — `/app/commissions/new/page.tsx` is a stub. Build the actual form that writes to Supabase `commission_requests`
- **Review submission** — The review UI exists on artist profile pages but doesn't write to Supabase. Wire up the `reviews` table insert
- **Search and filter on /lens** — The artist directory has no filter. Add style filters (Madhubani, Gond, etc.), city filter, and price range
- **Notification system** — There's no way for users to know when something happens (order update, new quote). Design and build a basic notification bell

### Backend & Data
- **Real order tracking** — `/app/orders/page.tsx` reads from mock data. Connect it to Supabase `commission_orders`
- **Patron dashboard real data** — `src/app/patron-dashboard/page.tsx` uses mock orders and saved images. Replace with real Supabase queries
- **Artist profile save** — The profile form in the artist dashboard submits but doesn't write to the database. Wire it up to the `artists` table update
- **Sitemap expansion** — `src/app/sitemap.ts` only has static routes. Dynamically add artist profile URLs from the database

### 3D & Visual (Intermediate)
- **GLB model on landing page** — We want a rotating 3D Indian art object (pot, sculpture, mandala) in the hero. Set up `@react-three/fiber` and `@react-three/drei` and drop in a GLB from [Poly Pizza](https://polypizza.xyz) or [Sketchfab](https://sketchfab.com/features/free-3d-models)
- **Warli art animation** — `src/components/ui/WarliArt.tsx` renders static SVG Warli patterns. Make them animate subtly on scroll

---

## Project structure

Understanding this will save you time:

```
src/app/[route]/page.tsx     — the actual page component
src/app/[route]/layout.tsx   — metadata + layout wrapper (SEO)
src/app/[route]/loading.tsx  — skeleton shown while page loads
src/app/api/[route]/route.ts — API endpoint (server-side)
src/components/layout/       — Navbar and Footer (on every page)
src/components/ui/           — Reusable components
src/lib/supabase.ts          — Supabase client (use this, don't create new ones)
src/lib/rateLimit.ts         — In-memory rate limiter for API routes
src/store/authStore.ts       — Zustand auth state (user, login, logout)
src/mock/                    — Placeholder data — the goal is to replace all of this
supabase/migrations/         — SQL files, run in order (001 → 002 → 003)
```

**Key patterns to follow:**

- Pages that use `useSearchParams()` must be wrapped in `<Suspense>` — see `src/app/generate/page.tsx` for the pattern
- All Supabase reads use the anon client from `src/lib/supabase.ts`
- All Supabase writes that need elevated access use `SUPABASE_SERVICE_ROLE_KEY` in API routes only — never expose this on the client
- New API routes go in `src/app/api/[name]/route.ts` following the existing pattern

---

## Making a pull request

- Keep PRs focused — one feature or fix per PR. Easier to review, easier to merge
- Add a short description of what you changed and why
- If your PR touches the UI, include a screenshot or screen recording
- If your PR touches a database table, include the migration SQL needed
- Don't bump version numbers or modify `package-lock.json` manually

PR title format: `type: short description`
Examples:
- `feat: add filter sidebar to artist lens`
- `fix: mobile navbar overflow on 375px`
- `docs: add artist onboarding section to contributing guide`

---

## Code style

We don't have a formal style guide, but follow what you see:

- **TypeScript** — type everything, avoid `any`. Use the types in `src/types/index.ts`
- **Tailwind** — use the design tokens defined in `tailwind.config.ts` and `globals.css`. The palette is warm cream/ink/accent — don't introduce new colours without discussion
- **Components** — keep them small and single-purpose. If a component is over 200 lines, it probably wants to be split
- **Server vs client** — default to server components. Only add `"use client"` when you need interactivity, browser APIs, or React hooks

Run `npm run lint` before pushing. Fix all ESLint warnings.

---

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add artist filter to lens directory
fix: resolve hooks violation in Navbar
docs: update setup instructions in README
chore: replace mock orders with Supabase query
```

Keep the subject line under 72 characters. If you need to explain more, add a blank line and a body.

---

## Need help?

- Open a [GitHub Discussion](https://github.com/Swayam-Kumaarr/Artery-/discussions) if you're stuck or want to talk through an idea
- Comment on the issue you're working on — maintainers check regularly
- If something in this guide is confusing or wrong, open a PR to fix it. Documentation contributions are just as valuable as code

---

*Artery is part of GSSoC. We're committed to making this a welcoming project for contributors of all experience levels. Be kind, be patient, and let's build something that matters for Indian artists.*
