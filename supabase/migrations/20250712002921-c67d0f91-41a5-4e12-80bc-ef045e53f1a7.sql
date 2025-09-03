-- Create test_results table to track user performance
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_type TEXT NOT NULL,
  score INTEGER,
  reaction_time INTEGER, -- in milliseconds
  accuracy DECIMAL(5,2), -- percentage
  level_reached INTEGER,
  duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Create policies for test results
CREATE POLICY "Users can view their own test results" 
ON public.test_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results" 
ON public.test_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test results" 
ON public.test_results 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_test_results_updated_at
BEFORE UPDATE ON public.test_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_stats table for aggregated statistics
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_tests INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_reaction_time INTEGER,
  brain_age INTEGER,
  last_test_date DATE,
  achievements_unlocked TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user stats
CREATE POLICY "Users can view their own stats" 
ON public.user_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
ON public.user_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.user_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_stats_updated_at
BEFORE UPDATE ON public.user_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update user stats after test completion
CREATE OR REPLACE FUNCTION public.update_user_stats_after_test()
RETURNS TRIGGER AS $$
DECLARE
  current_stats RECORD;
  streak_days INTEGER;
BEGIN
  -- Get current stats or create new record
  SELECT * INTO current_stats 
  FROM public.user_stats 
  WHERE user_id = NEW.user_id;
  
  IF current_stats IS NULL THEN
    -- Create new stats record
    INSERT INTO public.user_stats (
      user_id, 
      total_tests, 
      current_streak, 
      best_reaction_time,
      brain_age,
      last_test_date
    ) VALUES (
      NEW.user_id,
      1,
      1,
      COALESCE(NEW.reaction_time, 999),
      CASE 
        WHEN NEW.reaction_time IS NOT NULL THEN 
          GREATEST(18, LEAST(80, 30 + (NEW.reaction_time - 200) / 10))
        ELSE 25
      END,
      CURRENT_DATE
    );
  ELSE
    -- Calculate streak
    IF current_stats.last_test_date = CURRENT_DATE THEN
      streak_days := current_stats.current_streak;
    ELSIF current_stats.last_test_date = CURRENT_DATE - INTERVAL '1 day' THEN
      streak_days := current_stats.current_streak + 1;
    ELSE
      streak_days := 1;
    END IF;
    
    -- Update existing stats
    UPDATE public.user_stats SET
      total_tests = current_stats.total_tests + 1,
      current_streak = streak_days,
      best_reaction_time = CASE 
        WHEN NEW.reaction_time IS NOT NULL AND NEW.reaction_time < COALESCE(current_stats.best_reaction_time, 999)
        THEN NEW.reaction_time
        ELSE current_stats.best_reaction_time
      END,
      brain_age = CASE 
        WHEN NEW.reaction_time IS NOT NULL THEN 
          GREATEST(18, LEAST(80, 25 + (NEW.reaction_time - 180) / 8))
        ELSE current_stats.brain_age
      END,
      last_test_date = CURRENT_DATE,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stats after test insertion
CREATE TRIGGER update_stats_after_test
AFTER INSERT ON public.test_results
FOR EACH ROW
EXECUTE FUNCTION public.update_user_stats_after_test();