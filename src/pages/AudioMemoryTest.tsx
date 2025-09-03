import { AudioMemoryTest } from "@/components/AudioMemoryTest";
import { SEOHead } from "@/components/SEOHead";

const AudioMemoryTestPage = () => {
  return (
    <>
      <SEOHead
        title="Audio Memory Test - Test Your Sound Memory | NeuroDash"
        description="Challenge your auditory memory by memorizing sound sequences. Test your audio processing and recall abilities. Free hearing memory test."
        canonical="https://neurodash.space/audiomemory"
        keywords="audio memory test, sound memory, auditory processing, hearing test, sound sequences, audio recall"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Audio Memory Test",
          "description": "Test your auditory memory and sound processing abilities with sequential audio challenges",
          "url": "https://neurodash.space/audiomemory",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <AudioMemoryTest />
      </div>
    </>
  );
};

export default AudioMemoryTestPage;