# Artery

The rise of AI-generated art has created a large problem for artists. It's faster and cheaper than ever to produce visuals, yet human artists are struggling more than ever to find their place and price their work fairly.

Artery bridges this gap instead of widening it.

Rather than replacing artists, Artery uses AI as a communication tool — customers describe what they want, AI generates a reference visual, and artists use that as a brief to create a real, physical, handcrafted piece. This eliminates the biggest friction in commissioned art: the gap between what a customer imagines and what an artist delivers.

Artery gives artists a clearer brief, fairer pricing power, and a platform that positions human creativity where it deserves to be.

**Live demo:** [artery-ppwv8wdt4-mailboxswayam-3742s-projects.vercel.app](https://artery-ppwv8wdt4-mailboxswayam-3742s-projects.vercel.app)

---

![Artery — landing page](public/images/og-default.svg)

---

## How it works

1. **Generate** — Describe your vision. AI renders it instantly in the style of your choice (Madhubani, Gond, Warli, Miniature, and more)
2. **Match** — Recommender Lens finds verified Indian artisans whose hand-style fits your generated reference
3. **Commission** — Connect with the artist, agree on price, and let them create the real thing
4. **Receive** — Your handcrafted piece is delivered to your door with a Certificate of Authenticity

## Tech stack

- **Framework** — Next.js 14 (App Router)
- **Database** — Supabase (Postgres + Auth + Storage)
- **Payments** — Razorpay
- **AI** — OpenAI DALL·E 3
- **Styling** — Tailwind CSS
- **Deployment** — Vercel

## Running locally

```bash
git clone https://github.com/Swayam-Kumaarr/Artery-.git
cd Artery-
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your own keys (see `.env.example` for the full list), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database setup

Run these in order from your Supabase dashboard (SQL Editor → New Query):

1. `supabase/migrations/001_core.sql`
2. `supabase/migrations/002_commissions.sql`
3. `supabase/migrations/003_features.sql`

## Contributing

Contributions are welcome — especially from developers who care about the intersection of technology and traditional craft.

Open an issue before starting significant work so we can align on direction. PRs for bug fixes, accessibility improvements, new Indian art style support, and performance work are particularly appreciated.

## License

MIT
