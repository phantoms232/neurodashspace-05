import { IntuitionGuessTest } from "@/components/IntuitionGuessTest";
import { SEOHead } from "@/components/SEOHead";

const IntuitionGuessTestPage = () => {
  return (
    <>
      <SEOHead
        title="Intuition Guess Test - Test Your Gut Instincts | NeuroDash"
        description="Test your intuitive abilities and gut instincts. Measure your subconscious pattern recognition and intuitive decision-making. Free intuition test."
        canonical="https://neurodash.space/intuitionguess"
        keywords="intuition test, gut instincts, subconscious patterns, intuitive thinking, sixth sense, pattern recognition"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Intuition Guess Test",
          "description": "Test your intuitive abilities and subconscious pattern recognition skills",
          "url": "https://neurodash.space/intuitionguess",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <IntuitionGuessTest />
      </div>
    </>
  );
};

export default IntuitionGuessTestPage;