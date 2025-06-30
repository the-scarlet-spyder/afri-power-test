
-- Insert the discount code "STRENGTHS2025" that makes the test free
INSERT INTO discount_codes (
  code,
  discount_percentage,
  discount_amount,
  is_active,
  usage_limit,
  times_used,
  valid_from,
  valid_until
) VALUES (
  'STRENGTHS2025',
  100, -- 100% discount (makes it free)
  NULL, -- no fixed amount discount since we're using percentage
  true, -- active
  100, -- can be used 100 times
  0, -- hasn't been used yet
  NOW(), -- valid from now
  NULL -- no expiration date
);
