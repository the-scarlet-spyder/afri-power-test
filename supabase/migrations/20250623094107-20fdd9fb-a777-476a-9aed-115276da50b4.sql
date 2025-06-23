
-- Create discount_codes table
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage INTEGER,
  discount_amount INTEGER, -- amount in kobo/cents
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on discount_codes table
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active discount codes
CREATE POLICY "Anyone can view active discount codes" 
  ON public.discount_codes 
  FOR SELECT 
  USING (is_active = true);

-- Create policy for admin insert/update (will need admin role)
CREATE POLICY "Admins can manage discount codes" 
  ON public.discount_codes 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Insert the initial discount code
INSERT INTO public.discount_codes (code, discount_percentage, is_active, usage_limit, valid_until)
VALUES ('STRENGTH2024', 20, true, 100, '2024-12-31 23:59:59+00');

-- Update payment tracking in test_results to include discount information
ALTER TABLE public.test_results 
ADD COLUMN discount_code_used VARCHAR(50),
ADD COLUMN original_amount INTEGER,
ADD COLUMN discount_amount INTEGER,
ADD COLUMN final_amount INTEGER;
