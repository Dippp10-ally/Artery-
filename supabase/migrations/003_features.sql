-- Artery — additional features schema
-- support tickets, certificates of authenticity, public generations feed
-- Run after 002_commissions.sql

-- SUPPORT TICKETS

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  email       TEXT        NOT NULL,
  issue_type  TEXT        NOT NULL,
  subject     TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  order_id    TEXT,
  status      TEXT        NOT NULL DEFAULT 'open',
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support_tickets: public insert"
  ON public.support_tickets FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "support_tickets: owner read"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);


-- CERTIFICATES OF AUTHENTICITY
-- Auto-issued when a commission order is marked complete

CREATE TABLE IF NOT EXISTS public.certificates (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID        NOT NULL REFERENCES public.commission_orders(id) ON DELETE CASCADE,
  unique_code   TEXT        NOT NULL UNIQUE,
  artwork_title TEXT        NOT NULL,
  artist_name   TEXT        NOT NULL,
  patron_name   TEXT        NOT NULL,
  style         TEXT,
  medium        TEXT,
  dimensions    TEXT,
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates: public read"
  ON public.certificates FOR SELECT USING (TRUE);

CREATE OR REPLACE FUNCTION public.issue_certificate()
RETURNS TRIGGER AS $$
DECLARE
  v_artist_name TEXT;
  v_patron_name TEXT;
  v_title       TEXT;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    SELECT display_name INTO v_artist_name FROM public.artists WHERE id = NEW.artist_id;
    SELECT name INTO v_patron_name FROM public.profiles WHERE id = NEW.patron_id;
    SELECT title INTO v_title FROM public.commission_requests WHERE id = NEW.request_id;

    INSERT INTO public.certificates (
      order_id, unique_code, artwork_title, artist_name, patron_name
    ) VALUES (
      NEW.id,
      'ART-' || to_char(NOW(), 'YYYY') || '-' || upper(left(replace(gen_random_uuid()::text, '-', ''), 6)),
      COALESCE(v_title, 'Original Artwork'),
      COALESCE(v_artist_name, 'Unknown Artist'),
      COALESCE(v_patron_name, 'Valued Patron')
    )
    ON CONFLICT (order_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_completed ON public.commission_orders;
CREATE TRIGGER on_order_completed
  AFTER UPDATE OF status ON public.commission_orders
  FOR EACH ROW EXECUTE FUNCTION public.issue_certificate();


-- GENERATIONS
-- Powers the /explore community feed

CREATE TABLE IF NOT EXISTS public.generations (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  prompt     TEXT        NOT NULL,
  style      TEXT,
  image_urls TEXT[]      NOT NULL DEFAULT '{}',
  is_saved   BOOLEAN     NOT NULL DEFAULT FALSE,
  is_private BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "generations: public read"
  ON public.generations FOR SELECT
  USING (is_private = FALSE);

CREATE POLICY "generations: owner access"
  ON public.generations FOR ALL
  USING (auth.uid() = user_id);


-- INDEXES

CREATE INDEX IF NOT EXISTS idx_generations_feed
  ON public.generations (created_at DESC)
  WHERE is_private = FALSE;

CREATE INDEX IF NOT EXISTS idx_support_tickets_user
  ON public.support_tickets (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_commission_requests_open
  ON public.commission_requests (created_at DESC)
  WHERE status = 'open';
