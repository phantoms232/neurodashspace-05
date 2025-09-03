import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if already installed
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    // Don't show if already installed
    if (isStandalone) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 8 seconds if on mobile and not already dismissed
      setTimeout(() => {
        if (isMobile && 
            !sessionStorage.getItem('installPromptDismissed') &&
            !window.matchMedia('(display-mode: standalone)').matches) {
          setShowPrompt(true);
        }
      }, 8000); // Increased delay to 8 seconds
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also show for iOS Safari users after delay
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    const isSafari = /safari/i.test(navigator.userAgent.toLowerCase()) && !/chrome/i.test(navigator.userAgent.toLowerCase());
    
    if (isIOS && isSafari && isMobile && !sessionStorage.getItem('installPromptDismissed')) {
      setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          setShowPrompt(true);
        }
      }, 8000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [isMobile]);

  const handleInstall = async () => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    const isSafari = /safari/i.test(navigator.userAgent.toLowerCase()) && !/chrome/i.test(navigator.userAgent.toLowerCase());

    if (deferredPrompt && !isIOS) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch (error) {
        console.error('Error during installation:', error);
      }
    } else if (isIOS && isSafari) {
      // For iOS Safari, we can't trigger the install programmatically
      // The prompt will show instructions
    }
    
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already dismissed this session or if already installed
  if (!showPrompt || 
      sessionStorage.getItem('installPromptDismissed') ||
      window.matchMedia('(display-mode: standalone)').matches) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="p-4 bg-background/95 backdrop-blur-sm border shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/92547e9c-22c3-4aab-ae1f-46223bd5de1b.png" 
              alt="NeuroDash app icon" 
              className="w-10 h-10 rounded-lg"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">Install NeuroDash</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Add to your home screen for quick access to cognitive tests
            </p>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleInstall}
                className="flex-1 h-8 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}