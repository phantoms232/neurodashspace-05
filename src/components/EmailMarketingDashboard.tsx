import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Users, TrendingUp, Clock, Send, Target, Brain, Award } from "lucide-react";

interface EmailCampaign {
  id: string;
  type: 'welcome' | 'achievement' | 'weekly-tips' | 're-engagement' | 'referral-invite';
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
}

export const EmailMarketingDashboard = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [customData, setCustomData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock campaign data - in real app, this would come from database
  const campaigns: EmailCampaign[] = [
    {
      id: "1",
      type: "welcome",
      subject: "Welcome to NeuroDash - Start Your Brain Training!",
      status: "sent",
      recipients: 1250,
      openRate: 68,
      clickRate: 24,
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      type: "weekly-tips",
      subject: "Weekly Brain Training Tips",
      status: "scheduled",
      recipients: 3200,
      createdAt: "2024-01-20"
    },
    {
      id: "3",
      type: "achievement",
      subject: "New Achievement Unlocked!",
      status: "sent",
      recipients: 890,
      openRate: 72,
      clickRate: 31,
      createdAt: "2024-01-18"
    }
  ];

  const emailTypes = [
    { value: "welcome", label: "Welcome Email", icon: Mail, description: "Send to new users" },
    { value: "achievement", label: "Achievement Email", icon: Award, description: "Celebrate user milestones" },
    { value: "weekly-tips", label: "Weekly Tips", icon: Brain, description: "Educational content" },
    { value: "re-engagement", label: "Re-engagement", icon: Target, description: "Win back inactive users" },
    { value: "referral-invite", label: "Referral Invite", icon: Users, description: "Invite friends campaign" }
  ];

  const sendEmail = async () => {
    if (!selectedType || !recipientEmail) {
      toast({
        title: "Missing Information",
        description: "Please select email type and recipient email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      let emailData = {};
      if (customData) {
        try {
          emailData = JSON.parse(customData);
        } catch (e) {
          toast({
            title: "Invalid JSON",
            description: "Please check your custom data format",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.functions.invoke('send-marketing-email', {
        body: {
          type: selectedType,
          recipientEmail,
          recipientName: recipientName || undefined,
          data: emailData
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent Successfully!",
        description: `${emailTypes.find(t => t.value === selectedType)?.label} sent to ${recipientEmail}`,
      });

      // Reset form
      setRecipientEmail("");
      setRecipientName("");
      setCustomData("");
      setSelectedType("");

    } catch (error: any) {
      console.error('Email sending error:', error);
      toast({
        title: "Failed to Send Email",
        description: error.message || "Please check your configuration and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      scheduled: "outline", 
      sent: "default"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Email Marketing Dashboard</h1>
          <p className="text-muted-foreground">Manage your email campaigns and drive user engagement</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,340</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67.2%</div>
            <p className="text-xs text-muted-foreground">+5.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.1%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Email Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Marketing Email</CardTitle>
            <CardDescription>
              Send targeted emails to engage users and drive conversions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-type">Email Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent>
                  {emailTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        <div>
                          <div>{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient-email">Recipient Email</Label>
              <Input
                id="recipient-email"
                type="email"
                placeholder="user@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient-name">Recipient Name (Optional)</Label>
              <Input
                id="recipient-name"
                placeholder="John Doe"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-data">Custom Data (JSON, Optional)</Label>
              <Textarea
                id="custom-data"
                placeholder='{"achievement": "Speed Demon", "score": 95}'
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Provide additional data for email personalization
              </p>
            </div>

            <Button 
              onClick={sendEmail} 
              disabled={isLoading || !selectedType || !recipientEmail}
              className="w-full"
            >
              {isLoading ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send Email
            </Button>
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>
              Your latest email marketing campaigns and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{campaign.subject}</h4>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.recipients} recipients • {campaign.createdAt}
                    </div>
                    {campaign.openRate && campaign.clickRate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Open: {campaign.openRate}% • Click: {campaign.clickRate}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Templates Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Available Email Templates</CardTitle>
          <CardDescription>
            High-converting email templates designed to drive engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emailTypes.map((type) => (
              <div key={type.value} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <type.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{type.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};