import { useState, useEffect, useRef } from 'react';
import { X, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailCapturePopupProps {
  isInTest: boolean;
}

export const EmailCapturePopup = ({ isInTest }: EmailCapturePopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [showSuccessView, setShowSuccessView] = useState(false);
  const { toast } = useToast();
  
  const wasInTestRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('neurodash-email-popup-seen');
    const savedDiscountCode = localStorage.getItem('neurodash-discount-code');
    
    if (savedDiscountCode) {
      setDiscountCode(savedDiscountCode);
    }
    
    if (!hasSeenPopup) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (isInTest) {
        // User is in test, mark it and don't show popup yet
        wasInTestRef.current = true;
      } else if (wasInTestRef.current) {
        // User was in test and now exited, show popup after 2 seconds
        timerRef.current = setTimeout(() => {
          setIsVisible(true);
        }, 2000);
      } else {
        // User not in test, show popup after 1 minute
        timerRef.current = setTimeout(() => {
          setIsVisible(true);
        }, 60000);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isInTest]);

  // Track when user exits test
  useEffect(() => {
    if (!isInTest && wasInTestRef.current) {
      const hasSeenPopup = localStorage.getItem('neurodash-email-popup-seen');
      if (!hasSeenPopup) {
        // User just exited test, show popup after 2 seconds
        timerRef.current = setTimeout(() => {
          setIsVisible(true);
        }, 2000);
      }
      wasInTestRef.current = false;
    } else if (isInTest) {
      wasInTestRef.current = true;
    }
  }, [isInTest]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('neurodash-email-popup-seen', 'true');
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      toast({
        title: "Copied!",
        description: "Discount code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate discount code via Stripe
      const { data, error } = await supabase.functions.invoke('issue-discount-code', {
        body: { email }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Store discount code for the user
      localStorage.setItem('neurodash-discount-code', data.code);
      localStorage.setItem('neurodash-email-subscriber', email);
      localStorage.setItem('neurodash-email-popup-seen', 'true');
      
      setDiscountCode(data.code);
      setShowSuccessView(true);
      
      toast({
        title: "Success!",
        description: `You've got 10% off! Your discount code: ${data.code}`,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 relative bg-background border-primary/20 shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="text-center space-y-4">
          {!showSuccessView ? (
            <>
              <h2 className="text-2xl font-bold text-foreground">
                GET 10% OFF
              </h2>
              <p className="text-muted-foreground">
                Get 10% off all premium brain training products and features!
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center"
                  disabled={isLoading}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating Code..." : "GET 10% OFF CODE"}
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground">
                * One-time offer for new subscribers
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground">
                Your 10% Off Code
              </h2>
              <p className="text-muted-foreground">
                Use this code at checkout to get 10% off!
              </p>
              
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="text-lg font-mono font-bold text-foreground">
                  {discountCode}
                </div>
                <Button 
                  onClick={handleCopyCode}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
              
              <Button 
                onClick={handleClose}
                className="w-full"
              >
                Got it!
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};