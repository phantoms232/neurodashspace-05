import { NeuroDashLogo } from "@/components/NeuroDashLogo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShareButtons } from "@/components/ShareButtons";
import { SEOHead } from "@/components/SEOHead";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="About NeuroDash - Science-Based Brain Training Platform"
        description="Learn about NeuroDash's mission to improve cognitive abilities through scientifically-designed brain training games. Discover our comprehensive cognitive test suite."
        canonical="https://neurodash.space/about"
        keywords="about neurodash, brain training platform, cognitive tests, mental fitness, neuroscience, brain games"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About NeuroDash",
          "description": "NeuroDash is dedicated to helping people improve their cognitive abilities through scientifically-designed brain training games",
          "url": "https://neurodash.space/about",
          "mainEntity": {
            "@type": "Organization",
            "name": "NeuroDash",
            "description": "Science-based brain training platform with comprehensive cognitive assessments",
            "url": "https://neurodash.space"
          }
        }}
      />
      <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card/80 text-foreground backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <NeuroDashLogo className="scale-75" />
          </div>
          
          <nav className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </Button>
          </nav>
        </div>
      </header>

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">About NeuroDash</h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="mb-4">
                  NeuroDash is dedicated to helping people improve their cognitive abilities through scientifically-designed brain training games. We believe that mental fitness is just as important as physical fitness, and our platform provides engaging ways to exercise your mind.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                <p className="mb-4">Our comprehensive suite of cognitive tests includes:</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li><strong>Memory Tests:</strong> Visual, verbal, sequence, and number memory challenges</li>
                  <li><strong>Reaction Time:</strong> Test and improve your response speed</li>
                  <li><strong>Attention & Focus:</strong> Chimp test, distraction control, and multitasking</li>
                  <li><strong>Problem Solving:</strong> Logic sprints and pattern recognition</li>
                  <li><strong>Skills Assessment:</strong> Typing speed and emotion recognition</li>
                  <li><strong>Multiplayer Mode:</strong> Compete with friends and other users</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Science-Based Approach</h2>
                <p className="mb-4">
                  Our tests are based on established cognitive research and neuropsychological assessments. We track your performance over time to help you understand your cognitive strengths and areas for improvement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Personalized brain age calculations</li>
                  <li>Detailed performance analytics</li>
                  <li>Progress tracking and streak counters</li>
                  <li>Competitive multiplayer games</li>
                  <li>Mobile-responsive design</li>
                  <li>Free and premium tiers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
                <p className="mb-4">
                  Ready to challenge your mind? Create an account and start your cognitive fitness journey today. Track your progress, compete with others, and unlock your brain's potential with NeuroDash.
                </p>
              </section>

              {/* Share Section */}
              <div className="mt-12">
                <ShareButtons 
                  title="Discover NeuroDash - Brain Training Platform"
                  description="I found this amazing brain training platform! Test your cognitive abilities with scientifically-designed games and track your progress."
                  variant="full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default About;