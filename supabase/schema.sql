# InternShield AI - Database Schema for Supabase
# Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_verified BOOLEAN DEFAULT false,
  scan_count INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);

-- ============================================
-- SCAN REPORTS TABLE
-- ============================================
CREATE TABLE public.scan_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  scan_type TEXT NOT NULL CHECK (scan_type IN ('text', 'image', 'offer_letter', 'screenshot')),
  input_text TEXT,
  input_image_url TEXT,
  scam_score INTEGER NOT NULL DEFAULT 0 CHECK (scam_score >= 0 AND scam_score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('safe', 'low', 'medium', 'high', 'critical')),
  red_flags JSONB DEFAULT '[]'::jsonb,
  ai_explanation TEXT,
  recommendations JSONB DEFAULT '[]'::jsonb,
  extracted_text TEXT,
  raw_ai_response JSONB,
  company_name TEXT,
  recruiter_name TEXT,
  recruiter_email TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scan_reports_user_id ON public.scan_reports(user_id);
CREATE INDEX idx_scan_reports_created_at ON public.scan_reports(created_at DESC);
CREATE INDEX idx_scan_reports_risk_level ON public.scan_reports(risk_level);
CREATE INDEX idx_scan_reports_scam_score ON public.scan_reports(scam_score);

-- ============================================
-- COMMUNITY REPORTS TABLE
-- ============================================
CREATE TABLE public.community_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fake_company', 'fake_recruiter', 'fake_internship', 'payment_scam', 'other')),
  company_name TEXT,
  recruiter_name TEXT,
  recruiter_contact TEXT,
  evidence_urls JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'under_review')),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES public.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_community_reports_user_id ON public.community_reports(user_id);
CREATE INDEX idx_community_reports_category ON public.community_reports(category);
CREATE INDEX idx_community_reports_status ON public.community_reports(status);
CREATE INDEX idx_community_reports_created_at ON public.community_reports(created_at DESC);
CREATE INDEX idx_community_reports_company_name ON public.community_reports(company_name);
CREATE INDEX idx_community_reports_upvotes ON public.community_reports(upvotes DESC);

-- ============================================
-- REPORTED COMPANIES TABLE
-- ============================================
CREATE TABLE public.reported_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  scam_score INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  is_verified_scam BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reported_companies_name ON public.reported_companies(name);
CREATE INDEX idx_reported_companies_scam_score ON public.reported_companies(scam_score DESC);

-- ============================================
-- REPORTED RECRUITERS TABLE
-- ============================================
CREATE TABLE public.reported_recruiters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_id UUID REFERENCES public.reported_companies(id) ON DELETE SET NULL,
  platform TEXT,
  description TEXT,
  report_count INTEGER DEFAULT 0,
  is_verified_scammer BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reported_recruiters_name ON public.reported_recruiters(name);
CREATE INDEX idx_reported_recruiters_email ON public.reported_recruiters(email);

-- ============================================
-- REPORTED ADS TABLE
-- ============================================
CREATE TABLE public.reported_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.reported_companies(id) ON DELETE SET NULL,
  recruiter_id UUID REFERENCES public.reported_recruiters(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'telegram', 'linkedin', 'email', 'instagram', 'twitter', 'other')),
  ad_content TEXT,
  screenshot_url TEXT,
  scam_indicators JSONB DEFAULT '[]'::jsonb,
  risk_level TEXT CHECK (risk_level IN ('safe', 'low', 'medium', 'high', 'critical')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reported_ads_user_id ON public.reported_ads(user_id);
CREATE INDEX idx_reported_ads_platform ON public.reported_ads(platform);
CREATE INDEX idx_reported_ads_created_at ON public.reported_ads(created_at DESC);

-- ============================================
-- VOTES TABLE (for community report upvotes/downvotes)
-- ============================================
CREATE TABLE public.report_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.community_reports(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, report_id)
);

CREATE INDEX idx_report_votes_user_id ON public.report_votes(user_id);
CREATE INDEX idx_report_votes_report_id ON public.report_votes(report_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_votes ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

-- SCAN REPORTS policies
CREATE POLICY "Users can view their own scan reports"
  ON public.scan_reports FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own scan reports"
  ON public.scan_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scan reports"
  ON public.scan_reports FOR DELETE
  USING (auth.uid() = user_id);

-- COMMUNITY REPORTS policies
CREATE POLICY "Anyone can view community reports"
  ON public.community_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create community reports"
  ON public.community_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community reports"
  ON public.community_reports FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community reports"
  ON public.community_reports FOR DELETE
  USING (auth.uid() = user_id);

-- REPORTED COMPANIES policies
CREATE POLICY "Anyone can view reported companies"
  ON public.reported_companies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reported companies"
  ON public.reported_companies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update reported companies"
  ON public.reported_companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- REPORTED RECRUITERS policies
CREATE POLICY "Anyone can view reported recruiters"
  ON public.reported_recruiters FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reported recruiters"
  ON public.reported_recruiters FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- REPORTED ADS policies
CREATE POLICY "Anyone can view reported ads"
  ON public.reported_ads FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reported ads"
  ON public.reported_ads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- REPORT VOTES policies
CREATE POLICY "Anyone can view votes"
  ON public.report_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create votes"
  ON public.report_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.report_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_reports_updated_at
  BEFORE UPDATE ON public.community_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reported_companies_updated_at
  BEFORE UPDATE ON public.reported_companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reported_recruiters_updated_at
  BEFORE UPDATE ON public.reported_recruiters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment report count on company
CREATE OR REPLACE FUNCTION increment_company_report_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.company_id IS NOT NULL THEN
    UPDATE public.reported_companies
    SET report_count = report_count + 1
    WHERE id = NEW.company_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_community_report_created
  AFTER INSERT ON public.community_reports
  FOR EACH ROW EXECUTE FUNCTION increment_company_report_count();
