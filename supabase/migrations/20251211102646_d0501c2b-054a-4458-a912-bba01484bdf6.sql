-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('owner', 'agency', 'admin');

-- Create plan_type enum
CREATE TYPE public.plan_type AS ENUM ('trial', 'starter', 'pro', 'agency');

-- Create subscription_status enum
CREATE TYPE public.subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'incomplete');

-- Create review_source enum
CREATE TYPE public.review_source AS ENUM ('google', 'yelp', 'facebook', 'manual');

-- Create sentiment enum
CREATE TYPE public.sentiment_type AS ENUM ('positive', 'neutral', 'negative');

-- Create review_status enum
CREATE TYPE public.review_status AS ENUM ('pending', 'replied', 'escalated');

-- Create urgency enum
CREATE TYPE public.urgency_level AS ENUM ('low', 'medium', 'high');

-- Create tone enum
CREATE TYPE public.tone_type AS ENUM ('friendly', 'formal', 'apologetic');

-- Create reply_creator enum
CREATE TYPE public.reply_creator AS ENUM ('system_ai', 'user');

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan_type public.plan_type DEFAULT 'trial' NOT NULL,
  stripe_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'owner',
  UNIQUE(user_id, role)
);

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  default_tone public.tone_type DEFAULT 'friendly' NOT NULL,
  facts JSONB DEFAULT '[]'::jsonb,
  primary_location TEXT,
  opening_hours TEXT,
  refund_policy TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create reviews table (without foreign key to replies yet)
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  source public.review_source DEFAULT 'manual' NOT NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  review_date TIMESTAMPTZ DEFAULT now() NOT NULL,
  sentiment public.sentiment_type,
  status public.review_status DEFAULT 'pending' NOT NULL,
  analysis_summary TEXT,
  analysis_category TEXT,
  analysis_urgency public.urgency_level,
  missing_info_required BOOLEAN DEFAULT false NOT NULL,
  missing_info_fields JSONB DEFAULT '[]'::jsonb,
  approved_reply_id UUID,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create replies table
CREATE TABLE public.replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  tone public.tone_type NOT NULL,
  text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false NOT NULL,
  created_by public.reply_creator DEFAULT 'system_ai' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add foreign key for approved_reply_id after replies table exists
ALTER TABLE public.reviews ADD CONSTRAINT reviews_approved_reply_id_fkey 
  FOREIGN KEY (approved_reply_id) REFERENCES public.replies(id) ON DELETE SET NULL;

-- Create reply_templates table
CREATE TABLE public.reply_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  tone public.tone_type NOT NULL,
  template_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type public.plan_type DEFAULT 'trial' NOT NULL,
  status public.subscription_status DEFAULT 'trialing' NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create usage_metrics table
CREATE TABLE public.usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  reviews_created INTEGER DEFAULT 0 NOT NULL,
  ai_calls_used INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, period_start, period_end)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get current user's businesses
CREATE OR REPLACE FUNCTION public.user_owns_business(_business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.businesses
    WHERE id = _business_id
      AND owner_user_id = auth.uid()
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for businesses
CREATE POLICY "Users can view own businesses" ON public.businesses
  FOR SELECT USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can create own businesses" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update own businesses" ON public.businesses
  FOR UPDATE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete own businesses" ON public.businesses
  FOR DELETE USING (auth.uid() = owner_user_id);

-- RLS Policies for reviews (via business ownership)
CREATE POLICY "Users can view reviews of own businesses" ON public.reviews
  FOR SELECT USING (public.user_owns_business(business_id));

CREATE POLICY "Users can create reviews for own businesses" ON public.reviews
  FOR INSERT WITH CHECK (public.user_owns_business(business_id));

CREATE POLICY "Users can update reviews of own businesses" ON public.reviews
  FOR UPDATE USING (public.user_owns_business(business_id));

CREATE POLICY "Users can delete reviews of own businesses" ON public.reviews
  FOR DELETE USING (public.user_owns_business(business_id));

-- RLS Policies for replies (via review -> business ownership)
CREATE POLICY "Users can view replies of own reviews" ON public.replies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.reviews r
      WHERE r.id = review_id AND public.user_owns_business(r.business_id)
    )
  );

CREATE POLICY "Users can create replies for own reviews" ON public.replies
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reviews r
      WHERE r.id = review_id AND public.user_owns_business(r.business_id)
    )
  );

CREATE POLICY "Users can update replies of own reviews" ON public.replies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.reviews r
      WHERE r.id = review_id AND public.user_owns_business(r.business_id)
    )
  );

CREATE POLICY "Users can delete replies of own reviews" ON public.replies
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.reviews r
      WHERE r.id = review_id AND public.user_owns_business(r.business_id)
    )
  );

-- RLS Policies for reply_templates
CREATE POLICY "Users can view own templates" ON public.reply_templates
  FOR SELECT USING (public.user_owns_business(business_id));

CREATE POLICY "Users can create templates for own businesses" ON public.reply_templates
  FOR INSERT WITH CHECK (public.user_owns_business(business_id));

CREATE POLICY "Users can update own templates" ON public.reply_templates
  FOR UPDATE USING (public.user_owns_business(business_id));

CREATE POLICY "Users can delete own templates" ON public.reply_templates
  FOR DELETE USING (public.user_owns_business(business_id));

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for usage_metrics
CREATE POLICY "Users can view own usage" ON public.usage_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.usage_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.usage_metrics
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, name, email, plan_type, onboarding_completed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'),
    NEW.email,
    'trial',
    false
  );
  
  -- Create default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'owner');
  
  -- Create trial subscription (14 days)
  INSERT INTO public.subscriptions (user_id, plan_type, status, current_period_end)
  VALUES (NEW.id, 'trial', 'trialing', NOW() + INTERVAL '14 days');
  
  -- Create initial usage metrics for current month
  INSERT INTO public.usage_metrics (user_id, period_start, period_end, reviews_created, ai_calls_used)
  VALUES (
    NEW.id,
    DATE_TRUNC('month', NOW())::DATE,
    (DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day')::DATE,
    0,
    0
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers for all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_replies_updated_at BEFORE UPDATE ON public.replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reply_templates_updated_at BEFORE UPDATE ON public.reply_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_metrics_updated_at BEFORE UPDATE ON public.usage_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_businesses_owner ON public.businesses(owner_user_id);
CREATE INDEX idx_reviews_business ON public.reviews(business_id);
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_reviews_sentiment ON public.reviews(sentiment);
CREATE INDEX idx_reviews_date ON public.reviews(review_date);
CREATE INDEX idx_replies_review ON public.replies(review_id);
CREATE INDEX idx_reply_templates_business ON public.reply_templates(business_id);
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_usage_metrics_user_period ON public.usage_metrics(user_id, period_start, period_end);