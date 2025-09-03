import { AimTrainerTest } from "@/components/AimTrainerTest";
import { SEOHead } from "@/components/SEOHead";

const AimTrainerTestPage = () => {
  return (
    <>
      <SEOHead
        title="Free Aim Trainer Online - Improve Your Mouse Precision | NeuroDash"
        description="Play the free aim trainer online. Improve your mouse precision, hand-eye coordination, and gaming accuracy. Perfect for FPS games, CSGO, Valorant, and Overwatch players."
        canonical="https://neurodash.space/aimtrainer"
        keywords="aim trainer, free aim trainer online, mouse precision test, hand eye coordination, gaming skills, accuracy test, targeting practice, FPS aim trainer, CSGO aim training, Valorant aim practice"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Free Aim Trainer Online",
              "description": "Improve your mouse precision and hand-eye coordination with this free aim training tool",
              "url": "https://neurodash.space/aimtrainer",
              "applicationCategory": "GameApplication",
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
                  "name": "How often should I use aim trainers?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Practice 15-30 minutes daily with aim trainers for best results. Consistency is more important than long sessions."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do aim trainers really improve gaming performance?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, regular aim training can significantly improve your mouse precision, reaction time, and accuracy in FPS games."
                  }
                }
              ]
            }
          ]
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <AimTrainerTest />
      </div>
    </>
  );
};

export default AimTrainerTestPage;