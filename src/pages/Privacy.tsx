import { NeuroDashLogo } from "@/components/NeuroDashLogo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Privacy = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card/80 text-foreground backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <NeuroDashLogo className="scale-75" />
          </div>
          
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/about")}>
              About
            </Button>
          </nav>
        </div>
      </header>

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">
                  NeuroDash collects information to provide and improve our brain training services. This includes:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Account information (email, username)</li>
                  <li>Test scores and performance data</li>
                  <li>Usage analytics and app interactions</li>
                  <li>Device information and browser data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="mb-4">We use collected information to:</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Provide personalized brain training experiences</li>
                  <li>Track your progress and improvement over time</li>
                  <li>Improve our services and develop new features</li>
                  <li>Send important updates about your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at neurodashspace@gmail.com</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Privacy;