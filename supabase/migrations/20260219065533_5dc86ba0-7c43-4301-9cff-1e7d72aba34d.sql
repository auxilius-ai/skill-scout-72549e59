
-- Assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Skill ratings table
CREATE TABLE public.skill_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_code TEXT NOT NULL REFERENCES public.assessments(code) ON DELETE CASCADE,
  skill_key TEXT NOT NULL,
  rating TEXT NOT NULL DEFAULT 'none' CHECK (rating IN ('none', 'basic', 'intermediate', 'advanced', 'expert')),
  last_used TEXT CHECK (last_used IN ('currently', 'within_past_year', '1_3_years', '3_plus_years')),
  UNIQUE(assessment_code, skill_key)
);

-- Capability selections table
CREATE TABLE public.capability_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_code TEXT NOT NULL REFERENCES public.assessments(code) ON DELETE CASCADE,
  skill_key TEXT NOT NULL,
  capability_index INTEGER NOT NULL,
  selected BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(assessment_code, skill_key, capability_index)
);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_selections ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth - anyone with the code can read/write)
CREATE POLICY "Anyone can create assessments" ON public.assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Anyone can update assessments" ON public.assessments FOR UPDATE USING (true);

CREATE POLICY "Anyone can create skill ratings" ON public.skill_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read skill ratings" ON public.skill_ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can update skill ratings" ON public.skill_ratings FOR UPDATE USING (true);

CREATE POLICY "Anyone can create capability selections" ON public.capability_selections FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read capability selections" ON public.capability_selections FOR SELECT USING (true);
CREATE POLICY "Anyone can update capability selections" ON public.capability_selections FOR UPDATE USING (true);
