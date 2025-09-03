-- Grant free premium access to user gasingasin2@gmail.com
INSERT INTO public.subscribers (
  email, 
  subscribed, 
  subscription_tier, 
  subscription_end,
  updated_at
) VALUES (
  'gasingasin2@gmail.com',
  TRUE,
  'Premium Lifetime',
  '2099-12-31 23:59:59'::timestamptz,
  now()
) 
ON CONFLICT (email) 
DO UPDATE SET
  subscribed = TRUE,
  subscription_tier = 'Premium Lifetime',
  subscription_end = '2099-12-31 23:59:59'::timestamptz,
  updated_at = now();