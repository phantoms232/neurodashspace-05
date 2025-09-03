import { useAuth } from './useAuth';
import { useSecurity } from './useSecurity';
import { supabase } from '@/integrations/supabase/client';

export interface TestResultData {
  test_type: string;
  score?: number;
  accuracy?: number;
  reaction_time?: number;
  level_reached?: number;
  duration?: number;
}

export const useTestResults = () => {
  const { user } = useAuth();
  const security = useSecurity();

  const submitTestResult = async (testData: TestResultData): Promise<boolean> => {
    if (!user) {
      console.warn('Cannot submit test result: User not authenticated');
      return false;
    }

    // Check rate limit using database function
    const { data: rateLimitOk, error: rateLimitError } = await supabase.rpc('check_test_rate_limit', {
      user_id: user.id,
      test_type: testData.test_type
    });

    if (rateLimitError) {
      console.error('Error checking rate limit:', rateLimitError);
      return false;
    }

    if (!rateLimitOk) {
      security.logSecurityEvent('test_rate_limit_exceeded', {
        test_type: testData.test_type,
        user_id: user.id
      });
      return false;
    }

    // Check client-side rate limit as additional protection
    if (!security.checkTestRateLimit(user.id)) {
      return false;
    }

    // Sanitize test data but ensure test_type is preserved
    const sanitizedData = security.sanitizeTestData(testData);

    try {
      const { error } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          test_type: testData.test_type, // Ensure test_type is always included
          score: sanitizedData.score,
          accuracy: sanitizedData.accuracy,
          reaction_time: sanitizedData.reaction_time,
          level_reached: sanitizedData.level_reached,
          duration: sanitizedData.duration
        });

      if (error) {
        console.error('Error saving test result:', error);
        security.logSecurityEvent('test_result_submission_error', {
          test_type: testData.test_type,
          error: error.message
        });
        return false;
      }

      // Log successful submission for security audit
      security.logSecurityEvent('test_result_submitted', {
        test_type: testData.test_type,
        score: sanitizedData.score
      });

      return true;
    } catch (error) {
      console.error('Error submitting test result:', error);
      security.logSecurityEvent('test_result_submission_error', {
        test_type: testData.test_type,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

  return { submitTestResult };
};