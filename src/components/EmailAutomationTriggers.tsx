import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface EmailTriggerData {
  type: 'welcome' | 'achievement' | 'weekly-tips' | 're-engagement' | 'referral-invite';
  recipientEmail: string;
  recipientName?: string;
  data?: any;
}

// Email automation service
class EmailAutomationService {
  private static instance: EmailAutomationService;
  private triggers: Set<string> = new Set();

  static getInstance(): EmailAutomationService {
    if (!EmailAutomationService.instance) {
      EmailAutomationService.instance = new EmailAutomationService();
    }
    return EmailAutomationService.instance;
  }

  async sendEmail(emailData: EmailTriggerData) {
    try {
      const response = await supabase.functions.invoke('send-marketing-email', {
        body: emailData
      });

      if (response.error) {
        console.error('Email trigger failed:', response.error);
        return false;
      }

      console.log('Email triggered successfully:', emailData.type);
      return true;
    } catch (error) {
      console.error('Email automation error:', error);
      return false;
    }
  }

  // Welcome email trigger
  async triggerWelcomeEmail(userEmail: string, userName?: string) {
    const triggerId = `welcome-${userEmail}`;
    if (this.triggers.has(triggerId)) return;
    
    this.triggers.add(triggerId);
    
    await this.sendEmail({
      type: 'welcome',
      recipientEmail: userEmail,
      recipientName: userName,
      data: {
        signupDate: new Date().toISOString()
      }
    });
  }

  // Achievement email trigger
  async triggerAchievementEmail(userEmail: string, userName: string, achievement: string, score?: number, testType?: string) {
    await this.sendEmail({
      type: 'achievement',
      recipientEmail: userEmail,
      recipientName: userName,
      data: {
        achievement,
        score,
        testType,
        achievedAt: new Date().toISOString()
      }
    });
  }

  // Re-engagement email trigger (for users inactive for 7+ days)
  async triggerReEngagementEmail(userEmail: string, userName: string, lastActiveDate: string, personalBest?: any) {
    await this.sendEmail({
      type: 're-engagement',
      recipientEmail: userEmail,
      recipientName: userName,
      data: {
        lastActiveDate,
        personalBest,
        inactiveDays: Math.floor((Date.now() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60 * 24))
      }
    });
  }

  // Weekly tips email trigger
  async triggerWeeklyTipsEmail(userEmail: string, userName: string) {
    const tips = [
      {
        title: "Consistency Beats Intensity",
        description: "Regular 5-minute sessions are more effective than sporadic hour-long training."
      },
      {
        title: "Challenge Your Weak Areas",
        description: "Focus extra attention on your lowest-scoring cognitive domains."
      },
      {
        title: "Track Your Progress",
        description: "Use the analytics dashboard to identify patterns and improvements."
      }
    ];

    await this.sendEmail({
      type: 'weekly-tips',
      recipientEmail: userEmail,
      recipientName: userName,
      data: {
        tips,
        featuredTest: "Reaction Time Test",
        weekNumber: Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24 * 7))
      }
    });
  }

  // Referral invite trigger
  async triggerReferralInvite(recipientEmail: string, recipientName: string, referralCode: string, referrerName: string) {
    await this.sendEmail({
      type: 'referral-invite',
      recipientEmail,
      recipientName,
      data: {
        referralCode,
        referrerName,
        inviteDate: new Date().toISOString()
      }
    });
  }
}

// Hook to set up email automation triggers
export const EmailAutomationTriggers = () => {
  const { user } = useAuth();
  const emailService = EmailAutomationService.getInstance();

  useEffect(() => {
    if (!user) return;

    // Trigger welcome email for new users (with delay to ensure they're fully set up)
    const welcomeTimeout = setTimeout(() => {
      emailService.triggerWelcomeEmail(
        user.email || '',
        user.user_metadata?.full_name || user.email?.split('@')[0]
      );
    }, 5000); // 5 second delay

    // Set up real-time listeners for achievements and other triggers
    const setupTriggers = async () => {
      // Listen for new test results to trigger achievement emails
      const testResultsSubscription = supabase
        .channel('test-results-trigger')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'test_results',
            filter: `user_id=eq.${user.id}`
          },
          async (payload) => {
            const result = payload.new;
            
            // Check for achievements based on score/performance
            if (result.score && result.score > 90) {
              await emailService.triggerAchievementEmail(
                user.email || '',
                user.user_metadata?.full_name || 'Brain Trainer',
                'High Achiever',
                result.score,
                result.test_type
              );
            }
            
            // Check for personal best
            const { data: userStats } = await supabase
              .from('user_stats')
              .select('*')
              .eq('user_id', user.id)
              .single();
              
            if (userStats?.total_tests === 1) {
              await emailService.triggerAchievementEmail(
                user.email || '',
                user.user_metadata?.full_name || 'Brain Trainer',
                'First Test Completed',
                result.score,
                result.test_type
              );
            }
          }
        )
        .subscribe();

      // Set up weekly tips email (every Monday)
      const setupWeeklyTips = () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
        const msUntilMonday = daysUntilMonday * 24 * 60 * 60 * 1000;
        
        setTimeout(() => {
          emailService.triggerWeeklyTipsEmail(
            user.email || '',
            user.user_metadata?.full_name || 'Brain Trainer'
          );
          
          // Then repeat every week
          setInterval(() => {
            emailService.triggerWeeklyTipsEmail(
              user.email || '',
              user.user_metadata?.full_name || 'Brain Trainer'
            );
          }, 7 * 24 * 60 * 60 * 1000);
        }, msUntilMonday);
      };

      setupWeeklyTips();

      return () => {
        testResultsSubscription.unsubscribe();
      };
    };

    setupTriggers();

    return () => {
      clearTimeout(welcomeTimeout);
    };
  }, [user]);

  // This component doesn't render anything, it just sets up triggers
  return null;
};

// Export the service for manual use
export { EmailAutomationService };