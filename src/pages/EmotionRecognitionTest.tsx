import { EmotionRecognitionTest } from "@/components/EmotionRecognitionTest";
import { SEOHead } from "@/components/SEOHead";

const EmotionRecognitionTestPage = () => {
  return (
    <>
      <SEOHead
        title="Emotion Recognition Test - Test Your EQ | NeuroDash"
        description="Test your emotional intelligence by identifying facial expressions and emotions. Improve your social cognition and empathy skills."
        canonical="https://neurodash.space/emotionrecognition"
        keywords="emotion recognition, emotional intelligence, EQ test, facial expressions, empathy test, social cognition"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Emotion Recognition Test",
          "description": "Test your emotional intelligence and ability to recognize facial expressions and emotions",
          "url": "https://neurodash.space/emotionrecognition",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <EmotionRecognitionTest />
      </div>
    </>
  );
};

export default EmotionRecognitionTestPage;