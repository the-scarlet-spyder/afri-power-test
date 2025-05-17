
CREATE OR REPLACE FUNCTION public.verify_access_code(_code character varying, _user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result JSONB;
  code_id UUID;
BEGIN
  -- Check if user already has a valid code
  IF (SELECT public.has_valid_access_code(_user_id)) THEN
    result := jsonb_build_object(
      'success', true,
      'message', 'User already has a valid access code',
      'code_id', NULL
    );
    RETURN result;
  END IF;

  -- Check if the code exists and is not used
  UPDATE public.access_codes
  SET used = true,
      assigned_to = _user_id,
      used_at = NOW()
  WHERE code = _code
    AND used = false
  RETURNING id INTO code_id;
  
  IF code_id IS NULL THEN
    result := jsonb_build_object(
      'success', false,
      'message', 'Invalid or already used access code',
      'code_id', NULL
    );
  ELSE
    result := jsonb_build_object(
      'success', true,
      'message', 'Access code verified successfully',
      'code_id', code_id
    );
  END IF;
  
  RETURN result;
END;
$function$;

-- Helper function to check if a user already has a valid access code
CREATE OR REPLACE FUNCTION public.has_valid_access_code(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.access_codes
    WHERE assigned_to = _user_id
    AND used = true
  );
$function$;
