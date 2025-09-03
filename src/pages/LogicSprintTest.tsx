import { LogicSprintTest } from "@/components/LogicSprintTest";
import { SEOHead } from "@/components/SEOHead";

const LogicSprintTestPage = () => {
  return (
    <>
      <SEOHead
        title="Logic Sprint Test - Test Your Logical Reasoning | NeuroDash"
        description="Challenge your logical thinking with rapid-fire reasoning problems. Test your analytical skills and problem-solving speed. Free logic test."
        canonical="https://neurodash.space/logicsprint"
        keywords="logic test, logical reasoning, problem solving, analytical thinking, deductive reasoning, cognitive assessment"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Logic Sprint Test",
          "description": "Test your logical reasoning and analytical thinking with rapid-fire problem-solving challenges",
          "url": "https://neurodash.space/logicsprint",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <LogicSprintTest />
      </div>
    </>
  );
};

export default LogicSprintTestPage;