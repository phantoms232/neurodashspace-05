
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(true); // Always show for testing
  const [isInstalling, setIsInstalling] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Check if already installed
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    console.log('PWA Debug - isStandalone:', isStandalone);
    setDebugInfo(`Standalone: ${isStandalone}`);

    const handler = (e: Event) => {
      console.log('PWA: beforeinstallprompt fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      setDebugInfo('Install prompt available');
    };

    const onAppInstalled = () => {
      console.log('PWA: App installed');
      setIsInstallable(false);
      setDeferredPrompt(null);
      setDebugInfo('App installed successfully');
      toast.success("NeuroDash installed successfully!");
    };

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', onAppInstalled);

    // Browser detection
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    const isSafari = /safari/i.test(navigator.userAgent.toLowerCase()) && !/chrome/i.test(navigator.userAgent.toLowerCase());
    const isChrome = /chrome/i.test(navigator.userAgent.toLowerCase());
    const isEdge = /edge|edg/i.test(navigator.userAgent.toLowerCase());
    
    console.log('PWA Debug - Browser:', { isIOS, isSafari, isChrome, isEdge, userAgent: navigator.userAgent });
    
    if (isStandalone) {
      setIsInstallable(false);
      setDebugInfo('App already installed');
    } else if (isIOS && isSafari) {
      setIsInstallable(true);
      setDebugInfo('iOS Safari - Manual install');
    } else if (isChrome || isEdge) {
      setIsInstallable(true);
      setDebugInfo('Chrome/Edge - Waiting for prompt');
    } else {
      setIsInstallable(true);
      setDebugInfo('Generic browser');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    const isSafari = /safari/i.test(navigator.userAgent.toLowerCase()) && !/chrome/i.test(navigator.userAgent.toLowerCase());

    if (deferredPrompt && !isIOS) {
      setIsInstalling(true);
      
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setDeferredPrompt(null);
          setIsInstallable(false);
          setDebugInfo('App installed successfully');
        } else {
          console.log('User dismissed the install prompt');
          setDebugInfo('Install dismissed by user');
        }
      } catch (error) {
        console.error('Error during installation:', error);
        toast.error("Installation failed. Please try again.");
        setDebugInfo('Install failed');
      } finally {
        setIsInstalling(false);
      }
      return;
    }

    // iOS Safari instructions
    if (isIOS && isSafari) {
      toast("Install NeuroDash", {
        description: "Tap the Share button (⬆️) and select 'Add to Home Screen'",
        duration: 6000,
      });
      setDebugInfo('iOS install instructions shown');
      return;
    }

    // Chrome/Edge manual install fallback
    if (!deferredPrompt) {
      toast("Install App", {
        description: "Go to Chrome menu (⋮) → 'Install NeuroDash' or look for the install icon in the address bar",
        duration: 8000,
      });
      setDebugInfo('Manual install instructions shown');
      return;
    }

    // Generic fallback
    toast("Install NeuroDash", {
      description: "Look for an install option in your browser menu or address bar",
      duration: 5000,
    });
    setDebugInfo('Generic install help shown');
  };

  // Always show button for now (for debugging)
  return (
    <div className="flex flex-col items-center gap-1">
      <Button 
        onClick={handleInstall} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2" 
        disabled={isInstalling}
      >
        <img 
          src="/lovable-uploads/92547e9c-22c3-4aab-ae1f-46223bd5de1b.png" 
          alt="NeuroDash app icon" 
          className="w-4 h-4"
        />
        <Download className="w-4 h-4" />
        {isInstalling ? "Installing..." : "Install App"}
      </Button>
      <span className="text-xs text-muted-foreground max-w-[120px] text-center truncate" title={debugInfo}>
        {debugInfo}
      </span>
    </div>
  );
}
