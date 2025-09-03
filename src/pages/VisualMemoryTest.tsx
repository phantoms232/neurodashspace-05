import { VisualMemoryTest } from "@/components/VisualMemoryTest";
import { SEOHead } from "@/components/SEOHead";

const VisualMemoryTestPage = () => {
  return (
    <>
      <SEOHead
        title="Free Visual Memory Test Online - Test Your Spatial Memory | NeuroDash"
        description="Take the free visual memory test online. Challenge your spatial memory and visual processing by remembering tile patterns. Improve your visual-spatial intelligence and pattern recognition skills."
        canonical="https://neurodash.space/visualmemory"
        keywords="visual memory test, free visual memory test online, spatial memory test, tile pattern test, visual processing, pattern recognition test, cognitive assessment, visual spatial intelligence, photographic memory test"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Free Visual Memory Test",
              "description": "Test your visual memory and spatial processing by remembering increasingly complex tile patterns",
              "url": "https://neurodash.space/visualmemory",
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
                  "name": "What is visual memory?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Visual memory is your ability to remember and recall visual information like shapes, patterns, colors, and spatial relationships."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I improve my visual memory?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Practice with visual memory games, use visualization techniques, pay attention to details, and engage in activities that require spatial thinking."
                  }
                }
              ]
            }
          ]
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <VisualMemoryTest />
      </div>
    </>
  );
};

export default VisualMemoryTestPage;