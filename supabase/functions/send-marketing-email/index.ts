import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";

// Email Templates
import { WelcomeEmail } from "./_templates/welcome.tsx";
import { AchievementEmail } from "./_templates/achievement.tsx";
import { WeeklyTipsEmail } from "./_templates/weekly-tips.tsx";
import { ReEngagementEmail } from "./_templates/re-engagement.tsx";
import { ReferralInviteEmail } from "./_templates/referral-invite.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'welcome' | 'achievement' | 'weekly-tips' | 're-engagement' | 'referral-invite';
  recipientEmail: string;
  recipientName?: string;
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, recipientEmail, recipientName, data }: EmailRequest = await req.json();

    let emailHtml: string;
    let subject: string;

    switch (type) {
      case 'welcome':
        emailHtml = await renderAsync(
          React.createElement(WelcomeEmail, {
            recipientName: recipientName || 'Brain Trainer',
            ...data
          })
        );
        subject = '🧠 Welcome to NeuroDash - Start Your Brain Training Journey!';
        break;

      case 'achievement':
        emailHtml = await renderAsync(
          React.createElement(AchievementEmail, {
            recipientName: recipientName || 'Brain Trainer',
            achievement: data?.achievement || 'First Test Completed',
            score: data?.score,
            testType: data?.testType,
            ...data
          })
        );
        subject = `🎉 New Achievement Unlocked: ${data?.achievement || 'Great Progress'}!`;
        break;

      case 'weekly-tips':
        emailHtml = await renderAsync(
          React.createElement(WeeklyTipsEmail, {
            recipientName: recipientName || 'Brain Trainer',
            tips: data?.tips || [],
            featuredTest: data?.featuredTest,
            ...data
          })
        );
        subject = '🧠 Weekly Brain Training Tips & Featured Test';
        break;

      case 're-engagement':
        emailHtml = await renderAsync(
          React.createElement(ReEngagementEmail, {
            recipientName: recipientName || 'Brain Trainer',
            lastActiveDate: data?.lastActiveDate,
            personalBest: data?.personalBest,
            ...data
          })
        );
        subject = '🔥 We Miss You! Your Brain Training Awaits...';
        break;

      case 'referral-invite':
        emailHtml = await renderAsync(
          React.createElement(ReferralInviteEmail, {
            recipientName: recipientName || 'Brain Trainer',
            referralCode: data?.referralCode,
            referrerName: data?.referrerName,
            ...data
          })
        );
        subject = `🎁 ${data?.referrerName || 'Your friend'} invited you to NeuroDash - Get Free Premium!`;
        break;

      default:
        throw new Error(`Unsupported email type: ${type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "NeuroDash <brain@neurodash.app>",
      to: [recipientEmail],
      subject,
      html: emailHtml,
    });

    console.log(`Email sent successfully: ${type} to ${recipientEmail}`, emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-marketing-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);