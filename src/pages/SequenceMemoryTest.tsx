import { SequenceMemoryTest } from "@/components/SequenceMemoryTest";
import { SEOHead } from "@/components/SEOHead";

const SequenceMemoryTestPage = () => {
  return (
    <>
      <SEOHead
        title="Sequence Memory Test - Test Your Sequential Memory | NeuroDash"
        description="Test your ability to remember sequences and patterns. Challenge your sequential memory and pattern recognition skills. Free sequence test."
        canonical="https://neurodash.space/sequencememory"
        keywords="sequence memory, sequential memory, pattern memory, order recall, memory sequences, cognitive assessment"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Sequence Memory Test",
          "description": "Test your sequential memory and pattern recognition with increasingly complex sequences",
          "url": "https://neurodash.space/sequencememory",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <SequenceMemoryTest />
      </div>
    </>
  );
};

export default SequenceMemoryTestPage;