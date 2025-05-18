
-- Function to create a single access code (bypassing RLS)
CREATE OR REPLACE FUNCTION public.create_access_code(
  _code TEXT,
  _created_by UUID,
  _batch_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.access_codes(code, created_by, batch_name)
  VALUES (_code, _created_by, _batch_name);
END;
$$;

-- Function to generate multiple access codes at once (bypassing RLS)
CREATE OR REPLACE FUNCTION public.generate_access_codes(
  _codes TEXT[],
  _created_by UUID,
  _batch_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _code TEXT;
BEGIN
  FOREACH _code IN ARRAY _codes
  LOOP
    INSERT INTO public.access_codes(code, created_by, batch_name)
    VALUES (_code, _created_by, _batch_name);
  END LOOP;
END;
$$;

-- Function to delete an access code by ID (bypassing RLS)
CREATE OR REPLACE FUNCTION public.delete_access_code(
  _code_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.access_codes WHERE id = _code_id;
END;
$$;
