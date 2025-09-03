import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DesktopAdProps {
  slot: string;
  position?: 'left' | 'right';
  className?: string;
}

export const DesktopAd = ({ slot, position = 'right', className = '' }: DesktopAdProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile || !adRef.current) return;
    
    // Wait for element to be properly sized
    const timer = setTimeout(() => {
      try {
        const element = adRef.current;
        if (element && element.offsetWidth > 0) {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isMobile]);

  // Only show ads on desktop
  if (isMobile) return null;

  const positionClasses = position === 'left' ? 'left-4' : 'right-4';

  return (
    <div className={`fixed top-20 ${positionClasses} w-40 z-10 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6486386641041930"
        data-ad-slot={slot}
        data-ad-format="vertical"
        data-full-width-responsive="false"
      />
    </div>
  );
};