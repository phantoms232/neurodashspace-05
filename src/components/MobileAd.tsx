import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export const MobileAd = ({ slot, format = 'auto', className = '' }: MobileAdProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile || !adRef.current) return;
    
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

  // Only show ads on mobile
  if (!isMobile) return null;

  return (
    <div className={`w-full flex justify-center my-6 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6486386641041930"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};