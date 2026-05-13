-- Artery — core schema
-- profiles, artists, commissions (contact unlocks), generated images
-- Run first in Supabase Dashboard → SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- PROFILES
-- One row per user, mirroring auth.users

CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone             TEXT        NOT NULL,
  name              TEXT,
  subscription      TEXT        NOT NULL DEFAULT 'basic'
                                CHECK (subscription IN ('basic','pro','premium')),
  connected_artists TEXT[]      NOT NULL DEFAULT '{}',
  saved_images      TEXT[]      NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone)
  VALUES (NEW.id, NEW.phone)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ARTISTS

CREATE TABLE IF NOT EXISTS public.artists (
  id                TEXT        PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  user_id           UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name      TEXT        NOT NULL,
  business_name     TEXT        NOT NULL DEFAULT '',
  bio               TEXT        NOT NULL DEFAULT '',
  location          TEXT        NOT NULL DEFAULT '',
  avatar_url        TEXT,
  mediums           TEXT[]      NOT NULL DEFAULT '{}',
  styles            TEXT[]      NOT NULL DEFAULT '{}',
  rating            NUMERIC     NOT NULL DEFAULT 0,
  total_orders      INT         NOT NULL DEFAULT 0,
  commission_base   INT         NOT NULL DEFAULT 1000,
  turnaround_days   INT         NOT NULL DEFAULT 14,
  contact_phone     TEXT        NOT NULL DEFAULT '',
  contact_instagram TEXT,
  studio_address    TEXT,
  studio_city       TEXT        NOT NULL DEFAULT '',
  verified          BOOLEAN     NOT NULL DEFAULT FALSE,
  banned            BOOLEAN     NOT NULL DEFAULT FALSE,
  promotion_level   TEXT        NOT NULL DEFAULT 'standard'
                                CHECK (promotion_level IN ('standard','featured','spotlight')),
  subscription_tier TEXT        NOT NULL DEFAULT 'starter'
                                CHECK (subscription_tier IN ('starter','pro')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- COMMISSIONS
-- Tracks each time a patron pays to unlock an artist's contact details

CREATE TABLE IF NOT EXISTS public.commissions (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  patron_id           UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id           TEXT        NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  amount              INT         NOT NULL,
  status              TEXT        NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending','paid','refunded')),
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(patron_id, artist_id)
);

CREATE OR REPLACE FUNCTION public.unlock_artist_contact()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status <> 'paid' THEN
    UPDATE public.profiles
    SET connected_artists = array_append(connected_artists, NEW.artist_id)
    WHERE id = NEW.patron_id
      AND NOT (NEW.artist_id = ANY(connected_artists));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_commission_paid
  AFTER UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.unlock_artist_contact();


-- GENERATED IMAGES

CREATE TABLE IF NOT EXISTS public.generated_images (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  prompt     TEXT        NOT NULL,
  style      TEXT,
  image_url  TEXT        NOT NULL,
  is_saved   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ROW LEVEL SECURITY

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: own row" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "artists: public read" ON public.artists
  FOR SELECT USING (NOT banned);

CREATE POLICY "artists: owner write" ON public.artists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "commissions: own read" ON public.commissions
  FOR SELECT USING (auth.uid() = patron_id);

CREATE POLICY "images: insert" ON public.generated_images
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "images: own read" ON public.generated_images
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);


-- SEED DATA — demo artists (safe to re-run, uses ON CONFLICT DO NOTHING)

INSERT INTO public.artists (
  id, display_name, business_name, bio, location, avatar_url,
  mediums, styles, rating, total_orders, commission_base, turnaround_days,
  contact_phone, contact_instagram, studio_address, studio_city,
  verified, promotion_level, subscription_tier
) VALUES
  (
    'artist_001', 'Aarav Patel', 'Aarav Patel Fine Art',
    'Distilling the heritage of the Pink City into lapis and gold.',
    'Jaipur, Rajasthan', '/images/aarav-patel.jpg',
    ARRAY['natural pigments','hand-ground minerals','mica','gold leaf'],
    ARRAY['madhubani','folk-art','portrait'],
    4.9, 87, 3500, 21,
    '+919876543210', '@aarav.miniatures',
    'Old City, Near Hawa Mahal', 'Jaipur',
    TRUE, 'spotlight', 'pro'
  ),
  (
    'artist_002', 'Priya Singh', 'Priya Singh Watercolors',
    'Born on the ghats of Varanasi, Priya''s watercolors breathe the spiritual light of Banaras.',
    'Varanasi, UP', '/images/priya-singh.png',
    ARRAY['watercolor','ink wash','natural dyes'],
    ARRAY['watercolor','landscape','abstract'],
    4.8, 142, 2200, 14,
    '+918765432109', '@priya.ghats',
    'Dashashwamedh Ghat Road', 'Varanasi',
    TRUE, 'featured', 'pro'
  ),
  (
    'artist_003', 'Rohan Gupta', 'Rohan Gupta Contemporary',
    'Mumbai born and bred, Rohan''s oil paintings are a dialogue between the city''s relentless energy and the quietness one finds within it.',
    'Mumbai, Maharashtra', '/images/rohan-profile.png',
    ARRAY['oil on linen','acrylic','charcoal'],
    ARRAY['oil-painting','abstract','landscape'],
    4.7, 63, 4500, 28,
    '+917654321098', '@rohan.oilworks',
    'Bandra West, Hill Road Studio', 'Mumbai',
    TRUE, 'featured', 'pro'
  ),
  (
    'artist_004', 'Ananya Iyer', 'Ananya Iyer Natural Art',
    'Working from a coastal studio in Kochi, Ananya grinds her own pigments from river clay, turmeric, and indigo.',
    'Kochi, Kerala', NULL,
    ARRAY['natural pigments','river clay','indigo','turmeric'],
    ARRAY['watercolor','folk-art','abstract'],
    4.6, 51, 1800, 18,
    '+916543210987', '@ananya.natureart',
    'Fort Kochi, Bastian Street', 'Kochi',
    TRUE, 'standard', 'starter'
  )
ON CONFLICT (id) DO NOTHING;
