import { useState } from "react";
import { X, Crown, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionModal } from "@/components/SubscriptionModal";

export const PremiumPromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { user } = useAuth();
  const { subscribed } = useSubscription();

  // Don't show if already subscribed or banner is dismissed
  if (!isVisible || subscribed) {
    return null;
  }

  const handleUpgrade = () => {
    setShowSubscriptionModal(true);
  };

  return (
    <>
      <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-yellow-300" />
              <Crown className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="text-sm md:text-base font-medium">
              <span className="hidden sm:inline">🧠 </span>
              <strong>Unlock Premium Tests!</strong> 
              <span className="ml-2 hidden md:inline">
                Access exclusive cognitive challenges and advanced analytics
              </span>
              <span className="ml-2 md:hidden">
                Get exclusive brain training tests
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleUpgrade}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-semibold text-xs md:text-sm px-3 md:px-4"
            >
              View Premium
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <SubscriptionModal 
        open={showSubscriptionModal} 
        onOpenChange={setShowSubscriptionModal} 
      />
    </>
  );
};