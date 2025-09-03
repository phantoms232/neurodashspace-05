import { MultiTaskerTest } from "@/components/MultiTaskerTest";
import { SEOHead } from "@/components/SEOHead";

const MultiTaskerTestPage = () => {
  return (
    <>
      <SEOHead
        title="Multi-Tasker Test - Test Your Multitasking Skills | NeuroDash"
        description="Test your ability to handle multiple tasks simultaneously. Measure your attention division and task-switching abilities. Free multitasking test."
        canonical="https://neurodash.space/multitasker"
        keywords="multitasking test, task switching, attention division, cognitive flexibility, productivity test, focus management"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Multi-Tasker Test",
          "description": "Test your multitasking abilities and task-switching skills with this cognitive assessment",
          "url": "https://neurodash.space/multitasker",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <MultiTaskerTest />
      </div>
    </>
  );
};

export default MultiTaskerTestPage;