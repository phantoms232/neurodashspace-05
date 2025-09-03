import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Share2, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const ReferralShare = () => {
  const [referralUrl, setReferralUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const generateReferralLink = async () => {
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate a referral link",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-referral', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setReferralUrl(data.referral_url);
        toast({
          title: "Referral link generated!",
          description: "Share this link so friends get 1 week free premium when they sign up",
        });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate referral link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Try NeuroDash Premium for FREE!",
          text: "I'm using NeuroDash to train my brain. Sign up with my link and get 1 week premium for free!",
          url: referralUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="card-neural">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-gradient" />
          Invite Friends
        </CardTitle>
        <CardDescription>
          Share NeuroDash so your friends get 1 week free premium when they sign up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!referralUrl ? (
          <Button 
            onClick={generateReferralLink} 
            disabled={loading}
            className="w-full"
            variant="neural"
          >
            {loading ? "Generating..." : "Generate Referral Link"}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input 
                value={referralUrl} 
                readOnly 
                className="flex-1 text-sm"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={shareLink}
                variant="neural"
                size="icon"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              When someone signs up with your link, they get 1 week free premium!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};