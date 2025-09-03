import { SpatialReasoningTest } from "@/components/SpatialReasoningTest";
import { SEOHead } from "@/components/SEOHead";

const SpatialReasoningTestPage = () => {
  return (
    <>
      <SEOHead
        title="Spatial Reasoning Test - Test Your 3D Thinking | NeuroDash"
        description="Test your spatial intelligence and 3D visualization abilities. Challenge your mental rotation and spatial reasoning skills. Free spatial test."
        canonical="https://neurodash.space/spatialreasoning"
        keywords="spatial reasoning, 3D thinking, spatial intelligence, mental rotation, visual-spatial skills, geometry test"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Spatial Reasoning Test",
          "description": "Test your spatial intelligence and 3D visualization abilities with mental rotation challenges",
          "url": "https://neurodash.space/spatialreasoning",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
        <SpatialReasoningTest />
      </div>
    </>
  );
};

export default SpatialReasoningTestPage;