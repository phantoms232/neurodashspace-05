import { ReactionTimeTest } from "@/components/ReactionTimeTest";
import { SEOHead } from "@/components/SEOHead";

const ReactionTimeTestPage = () => {
  return (
    <>
      <SEOHead
        title="Free Reaction Time Test Online - Measure Your Reflexes Speed | NeuroDash"
        description="Take the best free reaction time test online. Measure your reflexes, response speed, and hand-eye coordination. Compare your results with others. Perfect for gamers, athletes, and cognitive training."
        canonical="https://neurodash.space/reactiontime"
        keywords="reaction time test, free reaction time test online, reflexes test, response speed test, hand eye coordination test, cognitive assessment, brain training, neural reaction, gaming reflexes, athlete reaction time"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Free Reaction Time Test",
              "description": "Test your reaction time and response speed with this free cognitive assessment tool",
              "url": "https://neurodash.space/reactiontime",
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
                  "name": "What is a good reaction time?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Average reaction time is around 200-250ms. Gamers and athletes typically have faster reaction times of 150-200ms."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "How can I improve my reaction time?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Practice regularly with reaction time tests, get adequate sleep, exercise, and maintain focus during training."
                  }
                }
              ]
            }
          ]
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <ReactionTimeTest />
      </div>
    </>
  );
};

export default ReactionTimeTestPage;