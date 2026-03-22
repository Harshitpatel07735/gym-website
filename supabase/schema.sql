-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- PROFILES
CREATE TABLE public.profiles (
  id               UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name        TEXT,
  email            TEXT UNIQUE,
  whatsapp_number  TEXT,
  date_of_birth    DATE,
  avatar_url       TEXT,
  role             TEXT NOT NULL DEFAULT 'member'
                     CHECK (role IN ('member', 'admin')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- MEMBERSHIPS
CREATE TABLE public.memberships (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan                  TEXT NOT NULL CHECK (plan IN ('basic', 'pro', 'elite')),
  status                TEXT NOT NULL DEFAULT 'inactive'
                          CHECK (status IN ('active','inactive','expired','cancelled')),
  price_paid            INTEGER NOT NULL,
  razorpay_order_id     TEXT,
  razorpay_payment_id   TEXT,
  razorpay_signature    TEXT,
  start_date            TIMESTAMPTZ,
  expiry_date           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- LEADS (Free Trial + Walk-in enquiries)
CREATE TABLE public.leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  source      TEXT DEFAULT 'free_trial'
                CHECK (source IN ('free_trial','walk_in','instagram','google','referral','website')),
  interest    TEXT,
  status      TEXT DEFAULT 'new'
                CHECK (status IN ('new','contacted','converted','dropped')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ENQUIRIES (Contact form)
CREATE TABLE public.enquiries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      TEXT DEFAULT 'unread'
                CHECK (status IN ('unread','read','replied')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- NEWSLETTER SUBSCRIBERS
CREATE TABLE public.newsletter_subscribers (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  status         TEXT DEFAULT 'active'
                   CHECK (status IN ('active','unsubscribed')),
  subscribed_at  TIMESTAMPTZ DEFAULT NOW()
);

-- TRAINERS
CREATE TABLE public.trainers (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT NOT NULL,
  role           TEXT NOT NULL,
  bio            TEXT,
  image_url      TEXT,
  instagram_url  TEXT,
  twitter_url    TEXT,
  display_order  INTEGER DEFAULT 0,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- WORKOUT CHECKINS
CREATE TABLE public.workout_checkins (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  checked_in_at  TIMESTAMPTZ DEFAULT NOW(),
  notes          TEXT
);

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  trainer_id      UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
  scheduled_at    TIMESTAMPTZ NOT NULL,
  duration_mins   INTEGER DEFAULT 60,
  status          TEXT DEFAULT 'upcoming'
                    CHECK (status IN ('upcoming','completed','cancelled','no_show')),
  notes           TEXT,
  reminder_sent   BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- BODY STATS
CREATE TABLE public.body_stats (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  weight_kg       DECIMAL(5,2),
  height_cm       DECIMAL(5,2),
  body_fat_pct    DECIMAL(4,2),
  bmi             DECIMAL(4,2) GENERATED ALWAYS AS
                    (weight_kg / ((height_cm / 100) * (height_cm / 100))) STORED,
  recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type    TEXT NOT NULL
                  CHECK (badge_type IN (
                    'first_checkin','streak_7','streak_30','streak_100',
                    'one_year_member','first_booking','referred_friend'
                  )),
  earned_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- MONTHLY PROGRESS REPORTS
CREATE TABLE public.monthly_progress_reports (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  report_month        DATE NOT NULL,
  checkin_count       INTEGER DEFAULT 0,
  longest_streak      INTEGER DEFAULT 0,
  days_remaining      INTEGER DEFAULT 0,
  current_plan        TEXT,
  avg_weekly_visits   DECIMAL(3,1) DEFAULT 0,
  generated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, report_month)
);

-- WHATSAPP NOTIFICATION LOG
CREATE TABLE public.whatsapp_notification_log (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  whatsapp_number   TEXT NOT NULL,
  message_type      TEXT NOT NULL
                      CHECK (message_type IN (
                        'welcome','renewal_confirmation','expiry_reminder',
                        'membership_expired','absence_alert','appointment_confirmation',
                        'appointment_reminder','monthly_progress','gym_closed',
                        'holiday_announcement','custom_broadcast'
                      )),
  message_content   TEXT,
  status            TEXT DEFAULT 'sent'
                      CHECK (status IN ('sent','failed','delivered')),
  sent_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY
ALTER TABLE public.profiles                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_checkins          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_stats                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_progress_reports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_notification_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins manage all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Memberships policies
CREATE POLICY "Users view own membership" ON public.memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage memberships" ON public.memberships FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leads — admin only
CREATE POLICY "Admins manage leads" ON public.leads FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Allow anonymous insert for free trial form
CREATE POLICY "Anyone can submit lead" ON public.leads FOR INSERT WITH CHECK (TRUE);

-- Enquiries — admin only
CREATE POLICY "Admins manage enquiries" ON public.enquiries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Allow anonymous insert for contact form
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (TRUE);

-- Newsletter
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage subscribers" ON public.newsletter_subscribers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trainers — public read
CREATE POLICY "Public view active trainers" ON public.trainers FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage trainers" ON public.trainers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Workout checkins
CREATE POLICY "Users manage own checkins" ON public.workout_checkins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins view all checkins" ON public.workout_checkins FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Appointments
CREATE POLICY "Users manage own appointments" ON public.appointments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all appointments" ON public.appointments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Body stats
CREATE POLICY "Users manage own body stats" ON public.body_stats FOR ALL USING (auth.uid() = user_id);

-- Achievements
CREATE POLICY "Users view own achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage achievements" ON public.achievements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Monthly progress reports
CREATE POLICY "Users view own reports" ON public.monthly_progress_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage reports" ON public.monthly_progress_reports FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- WhatsApp log — admin only
CREATE POLICY "Admins manage whatsapp log" ON public.whatsapp_notification_log FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Auto updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER memberships_updated_at BEFORE UPDATE ON public.memberships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();