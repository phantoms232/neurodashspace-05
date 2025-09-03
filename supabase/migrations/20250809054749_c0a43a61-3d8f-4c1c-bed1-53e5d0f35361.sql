-- Create discount_codes table to manage Stripe promotion codes pool
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  coupon_id TEXT NOT NULL,
  promotion_code_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','issued','redeemed','expired')),
  issued_to_email TEXT,
  issued_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and restrict access to service role only
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role manage discount codes"
ON public.discount_codes
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_discount_codes_status ON public.discount_codes (status);
CREATE INDEX IF NOT EXISTS idx_discount_codes_created_at ON public.discount_codes (created_at);

-- updated_at trigger
CREATE TRIGGER update_discount_codes_updated_at
BEFORE UPDATE ON public.discount_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();