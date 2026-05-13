-- ============================================================
-- ARTERY — Schema v2 (Commission Flow + Messaging + Reviews)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ── COMMISSION REQUESTS ───────────────────────────────────────────────────────
-- A patron posts a request to the public marketplace.
-- Any matching artist can see it and submit a quote.
CREATE TABLE IF NOT EXISTS public.commission_requests (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  patron_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL,
  description     TEXT        NOT NULL,
  style           TEXT,
  budget_min      INT,                        -- INR
  budget_max      INT,                        -- INR
  deadline_days   INT,                        -- patron's preferred turnaround
  generated_image_url TEXT,                   -- attached AI-generated image
  generated_prompt    TEXT,
  status          TEXT        NOT NULL DEFAULT 'open'
                              CHECK (status IN ('open','in_progress','completed','cancelled')),
  visibility      TEXT        NOT NULL DEFAULT 'public'
                              CHECK (visibility IN ('public','direct')),
  -- if direct, routed to a specific artist
  target_artist_id TEXT       REFERENCES public.artists(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_commission_requests_updated_at
  BEFORE UPDATE ON public.commission_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── COMMISSION ORDERS ─────────────────────────────────────────────────────────
-- Created when an artist quotes a request AND the patron accepts.
-- Also created directly when a patron unlocks an artist via the paywall.
CREATE TABLE IF NOT EXISTS public.commission_orders (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id      UUID        REFERENCES public.commission_requests(id) ON DELETE SET NULL,
  patron_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id       TEXT        NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL DEFAULT 'Custom Commission',
  description     TEXT,
  agreed_price    INT,                        -- INR, agreed after contact
  advance_paid    INT         DEFAULT 0,
  status          TEXT        NOT NULL DEFAULT 'contacted'
                              CHECK (status IN (
                                'contacted',   -- patron unlocked artist, not yet started
                                'quoted',      -- artist sent price quote
                                'accepted',    -- patron accepted quote
                                'in_progress', -- artist is working
                                'review',      -- artist submitted for patron review
                                'completed',   -- patron approved, complete
                                'cancelled',   -- cancelled by either party
                                'disputed'     -- in dispute resolution
                              )),
  milestone_notes TEXT,
  estimated_delivery_date DATE,
  artwork_url     TEXT,                       -- final artwork uploaded by artist
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_commission_orders_updated_at
  BEFORE UPDATE ON public.commission_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── MESSAGES ──────────────────────────────────────────────────────────────────
-- Threaded messages between patron and artist, scoped to a commission order or request.
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID        REFERENCES public.commission_orders(id) ON DELETE CASCADE,
  request_id      UUID        REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  sender_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_role     TEXT        NOT NULL CHECK (sender_role IN ('patron','artist','system')),
  body            TEXT        NOT NULL,
  attachment_url  TEXT,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (order_id IS NOT NULL OR request_id IS NOT NULL)
);


-- ── REVIEWS ───────────────────────────────────────────────────────────────────
-- Patrons can leave a review after an order is completed.
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID        NOT NULL REFERENCES public.commission_orders(id) ON DELETE CASCADE,
  patron_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id   TEXT        NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  rating      INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(order_id, patron_id)   -- one review per order
);

-- Auto-update artist rating average when a review is added/updated
CREATE OR REPLACE FUNCTION public.update_artist_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.artists
  SET rating = (
    SELECT ROUND(AVG(rating)::NUMERIC, 1)
    FROM public.reviews
    WHERE artist_id = NEW.artist_id
  )
  WHERE id = NEW.artist_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_upsert
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_artist_rating();


-- ── QUOTE RESPONSES ───────────────────────────────────────────────────────────
-- Artists respond to public commission requests with a quote.
CREATE TABLE IF NOT EXISTS public.quotes (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id      UUID        NOT NULL REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  artist_id       TEXT        NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  price           INT         NOT NULL,    -- quoted price in INR
  turnaround_days INT         NOT NULL,
  note            TEXT,
  status          TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','accepted','declined')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(request_id, artist_id)    -- one quote per artist per request
);


-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
ALTER TABLE public.commission_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes              ENABLE ROW LEVEL SECURITY;

-- commission_requests: public open requests visible to all; patron can manage their own
CREATE POLICY "requests: public read" ON public.commission_requests
  FOR SELECT USING (status = 'open' OR auth.uid() = patron_id);

CREATE POLICY "requests: patron write" ON public.commission_requests
  FOR ALL USING (auth.uid() = patron_id);

-- commission_orders: only patron and involved artist can see
CREATE POLICY "orders: parties read" ON public.commission_orders
  FOR SELECT USING (
    auth.uid() = patron_id OR
    auth.uid() IN (SELECT user_id FROM public.artists WHERE id = artist_id)
  );

-- messages: only parties to the order/request can see
CREATE POLICY "messages: parties read" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR
    auth.uid() IN (
      SELECT patron_id FROM public.commission_orders WHERE id = messages.order_id
      UNION
      SELECT patron_id FROM public.commission_requests WHERE id = messages.request_id
    )
  );

CREATE POLICY "messages: authenticated insert" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- reviews: public read, patron who completed order writes
CREATE POLICY "reviews: public read" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "reviews: patron write" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = patron_id);

-- quotes: artists write their own; patrons read quotes on their requests
CREATE POLICY "quotes: read" ON public.quotes
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.artists WHERE id = artist_id) OR
    auth.uid() IN (SELECT patron_id FROM public.commission_requests WHERE id = request_id)
  );

CREATE POLICY "quotes: artist insert" ON public.quotes
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.artists WHERE id = artist_id)
  );
