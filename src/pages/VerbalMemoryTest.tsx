import { VerbalMemoryTest } from "@/components/VerbalMemoryTest";
import { SEOHead } from "@/components/SEOHead";

const VerbalMemoryTestPage = () => {
  return (
    <>
      <SEOHead
        title="Verbal Memory Test - Test Your Word Recognition | NeuroDash"
        description="Challenge your verbal memory by identifying words you've seen before. Test your language processing and word recognition abilities."
        canonical="https://neurodash.space/verbalmemory"
        keywords="verbal memory test, word recognition, language processing, vocabulary memory, cognitive assessment, verbal abilities"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Verbal Memory Test",
          "description": "Test your verbal memory and word recognition abilities with this language processing assessment",
          "url": "https://neurodash.space/verbalmemory",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <VerbalMemoryTest />
      </div>
    </>
  );
};

export default VerbalMemoryTestPage;