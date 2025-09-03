import { useEffect, useRef } from 'react';

interface InFeedAdProps {
  slot?: string;
  layoutKey?: string;
  className?: string;
}

export const InFeedAd = ({ 
  slot = "6351557797", 
  layoutKey = "-h0-8+2c-1x-39",
  className = '' 
}: InFeedAdProps) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!adRef.current) return;
    
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
  }, []);

  return (
    <div className={`w-full flex justify-center my-8 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6486386641041930"
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-ad-layout-key={layoutKey}
      />
    </div>
  );
};