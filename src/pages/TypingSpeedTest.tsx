import { TypingSpeedTest } from "@/components/TypingSpeedTest";
import { SEOHead } from "@/components/SEOHead";

const TypingSpeedTestPage = () => {
  return (
    <>
      <SEOHead
        title="Free Typing Speed Test Online - Measure Your WPM | NeuroDash"
        description="Take the free typing speed test online. Measure your words per minute (WPM), typing accuracy, and improve your keyboard skills. Compare your typing speed with others worldwide."
        canonical="https://neurodash.space/typingspeed"
        keywords="typing speed test, free typing test online, WPM test, words per minute test, typing accuracy test, keyboard skills test, typing assessment, online typing test, fast typing test"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Free Typing Speed Test",
              "description": "Measure your typing speed in words per minute (WPM) and improve your keyboard skills",
              "url": "https://neurodash.space/typingspeed",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is a good typing speed?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Average typing speed is 40 WPM. Professional typists typically type 65-75 WPM, while experts can exceed 120 WPM."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I improve my typing speed?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Practice regularly, use proper finger placement, maintain good posture, and focus on accuracy before speed."
                  }
                }
              ]
            }
          ]
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <TypingSpeedTest />
      </div>
    </>
  );
};

export default TypingSpeedTestPage;