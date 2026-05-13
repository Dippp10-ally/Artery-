-- Artery — commission flow schema
-- commission requests, orders, messaging, reviews, quotes
-- Run after 001_core.sql

-- COMMISSION REQUESTS
-- Patrons post open briefs to the marketplace; artists submit quotes

CREATE TABLE IF NOT EXISTS public.commission_requests (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  patron_id           UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title               TEXT        NOT NULL,
  description         TEXT        NOT NULL,
  style               TEXT,
  budget_min          INT,
  budget_max          INT,
  deadline_days       INT,
  generated_image_url TEXT,
  generated_prompt    TEXT,
  status              TEXT        NOT NULL DEFAULT 'open'
                                  CHECK (status IN ('open','in_progress','completed','cancelled')),
  visibility          TEXT        NOT NULL DEFAULT 'public'
                                  CHECK (visibility IN ('public','direct')),
  target_artist_id    TEXT        REFERENCES public.artists(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_commission_requests_updated_at
  BEFORE UPDATE ON public.commission_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- COMMISSION ORDERS
-- Created when a patron accepts a quote, or unlocks an artist directly

CREATE TABLE IF NOT EXISTS public.commission_orders (
  id                      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id              UUID        REFERENCES public.commission_requests(id) ON DELETE SET NULL,
  patron_id               UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id               TEXT        NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title                   TEXT        NOT NULL DEFAULT 'Custom Commission',
  description             TEXT,
  agreed_price            INT,
  advance_paid            INT         DEFAULT 0,
  status                  TEXT        NOT NULL DEFAULT 'contacted'
                                      CHECK (status IN (
                                        'contacted',
                                        'quoted',
                                        'accepted',
                                        'in_progress',
                                        'review',
                                        'completed',
                                        'cancelled',
                                        'disputed'
                                      )),
  milestone_notes         TEXT,
  estimated_delivery_date DATE,
  artwork_url             TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_commission_orders_updated_at
  BEFORE UPDATE ON public.commission_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- MESSAGES
-- Threaded conversation between patron and artist, scoped to an order or request

CREATE TABLE IF NOT EXISTS public.messages (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id       UUID        REFERENCES public.commission_orders(id) ON DELETE CASCADE,
  request_id     UUID        REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  sender_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_role    TEXT        NOT NULL CHECK (sender_role IN ('patron','artist','system')),
  body           TEXT        NOT NULL,
  attachment_url TEXT,
  read_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (order_id IS NOT NULL OR request_id IS NOT NULL)
);


-- REVIEWS
-- Left by patrons after a commission order is completed

CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID        NOT NULL REFERENCES public.commission_orders(id) ON DELETE CASCADE,
  patron_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id   TEXT        NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  rating      INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(order_id, patron_id)
);

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


-- QUOTES
-- Artists respond to public commission requests with a price quote

CREATE TABLE IF NOT EXISTS public.quotes (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id      UUID        NOT NULL REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  artist_id       TEXT        NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  price           INT         NOT NULL,
  turnaround_days INT         NOT NULL,
  note            TEXT,
  status          TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','accepted','declined')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(request_id, artist_id)
);


-- ROW LEVEL SECURITY

ALTER TABLE public.commission_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes              ENABLE ROW LEVEL SECURITY;

CREATE POLICY "requests: public read" ON public.commission_requests
  FOR SELECT USING (status = 'open' OR auth.uid() = patron_id);

CREATE POLICY "requests: patron write" ON public.commission_requests
  FOR ALL USING (auth.uid() = patron_id);

CREATE POLICY "orders: parties read" ON public.commission_orders
  FOR SELECT USING (
    auth.uid() = patron_id OR
    auth.uid() IN (SELECT user_id FROM public.artists WHERE id = artist_id)
  );

CREATE POLICY "messages: parties read" ON public.messages
  FOR SELECT USING (
    auth.uid() = sender_id OR
    auth.uid() IN (
      SELECT patron_id FROM public.commission_orders WHERE id = messages.order_id
      UNION
      SELECT patron_id FROM public.commission_requests WHERE id = messages.request_id
    )
  );

CREATE POLICY "messages: authenticated insert" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "reviews: public read" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "reviews: patron write" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = patron_id);

CREATE POLICY "quotes: read" ON public.quotes
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.artists WHERE id = artist_id) OR
    auth.uid() IN (SELECT patron_id FROM public.commission_requests WHERE id = request_id)
  );

CREATE POLICY "quotes: artist insert" ON public.quotes
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.artists WHERE id = artist_id)
  );
