import { DistractionControlTest } from "@/components/DistractionControlTest";
import { SEOHead } from "@/components/SEOHead";

const DistractionControlTestPage = () => {
  return (
    <>
      <SEOHead
        title="Distraction Control Test - Test Your Focus | NeuroDash"
        description="Test your ability to maintain focus while ignoring distractions. Measure your attention control and concentration skills. Free focus test."
        canonical="https://neurodash.space/distractioncontrol"
        keywords="focus test, attention control, concentration, distraction resistance, mental focus, attention span"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Distraction Control Test",
          "description": "Test your ability to maintain focus and resist distractions with this attention control assessment",
          "url": "https://neurodash.space/distractioncontrol",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <DistractionControlTest />
      </div>
    </>
  );
};

export default DistractionControlTestPage;