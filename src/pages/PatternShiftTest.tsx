import { PatternShiftTest } from "@/components/PatternShiftTest";
import { SEOHead } from "@/components/SEOHead";

const PatternShiftTestPage = () => {
  return (
    <>
      <SEOHead
        title="Pattern Shift Test - Test Your Cognitive Flexibility | NeuroDash"
        description="Test your ability to adapt to changing patterns and rules. Measure your cognitive flexibility and mental agility. Free pattern recognition test."
        canonical="https://neurodash.space/patternshift"
        keywords="pattern recognition, cognitive flexibility, mental agility, rule adaptation, pattern shift, brain training"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Pattern Shift Test",
          "description": "Test your cognitive flexibility and pattern recognition abilities with changing rule sets",
          "url": "https://neurodash.space/patternshift",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <PatternShiftTest />
      </div>
    </>
  );
};

export default PatternShiftTestPage;