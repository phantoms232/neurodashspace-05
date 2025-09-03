import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Crown, Zap } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { ReferralShare } from "@/components/ReferralShare";
interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const SubscriptionModal = ({
  open,
  onOpenChange
}: SubscriptionModalProps) => {
  const {
    createCheckout,
    subscribed,
    subscriptionTier
  } = useSubscription();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const handleSubscribe = async (plan: 'weekly' | 'monthly' | 'yearly') => {
    if (!user) {
      onOpenChange(false);
      navigate("/auth");
      return;
    }
    setLoading(plan);
    await createCheckout(plan, promoCode);
    setLoading(null);
  };
  const plans = [{
    id: 'weekly' as const,
    name: 'Weekly',
    price: '$2.10',
    period: 'per week',
    description: 'Try premium features',
    icon: Zap,
    popular: false
  }, {
    id: 'monthly' as const,
    name: 'Monthly',
    price: '$7.95',
    period: 'per month',
    description: 'Most popular choice',
    icon: Crown,
    popular: true
  }, {
    id: 'yearly' as const,
    name: 'Yearly',
    price: '$85.55',
    period: 'per year',
    description: 'Best value save $9.85',
    icon: Crown,
    popular: false
  }];
  const features = ["Emotion Recognition Test", "Audio Memory Challenge", "Pattern Shift Detection", "Distraction Control Test", "Logic Sprint Puzzles", "Multi-Tasker Challenge", "Intuition Guess Game", "Advanced analytics", "Progress tracking", "No advertisements"];
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">
            🧠 Unlock Unique Cognitive Tests
          </DialogTitle>
          <DialogDescription>
            Access innovative cognitive challenges you won't find anywhere else
          </DialogDescription>
        </DialogHeader>

        

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          {plans.map(plan => {
          const Icon = plan.icon;
          const isCurrentPlan = subscribed && subscriptionTier?.toLowerCase() === plan.name.toLowerCase();
          return <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
                {plan.popular && <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>}
                {isCurrentPlan && <Badge className="absolute -top-2 right-4 bg-green-500">
                    Current Plan
                  </Badge>}
                
                <CardHeader className="text-center">
                  <Icon className="w-8 h-8 mx-auto text-primary" />
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> {plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Button className="w-full mb-4" variant={plan.popular ? "neural" : "outline"} onClick={() => handleSubscribe(plan.id)} disabled={loading === plan.id || isCurrentPlan}>
                    {loading === plan.id ? "Processing..." : isCurrentPlan ? "Current Plan" : "Subscribe"}
                  </Button>
                  
                  <div className="space-y-2">
                    {features.slice(0, 5).map((feature, index) => <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>)}
                    {plan.id === 'yearly' && <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-primary font-semibold">Save $9.85 annually</span>
                      </div>}
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>

        {user && <ReferralShare />}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">What you get with Premium:</h4>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, index) => <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </div>)}
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};