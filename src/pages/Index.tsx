import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NeuroDashLogo } from "@/components/NeuroDashLogo";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { TestCategories } from "@/components/TestCategories";
import { StatsOverview } from "@/components/StatsOverview";
import { ReactionTimeTest } from "@/components/ReactionTimeTest";
import { AimTrainerTest } from "@/components/AimTrainerTest";
import { NumberMemoryTest } from "@/components/NumberMemoryTest";
import { TypingSpeedTest } from "@/components/TypingSpeedTest";
import { VisualMemoryTest } from "@/components/VisualMemoryTest";
import { ChimpTest } from "@/components/ChimpTest";
import { VerbalMemoryTest } from "@/components/VerbalMemoryTest";
import { EmotionRecognitionTest } from "@/components/EmotionRecognitionTest";
import { AudioMemoryTest } from "@/components/AudioMemoryTest";
import { PatternShiftTest } from "@/components/PatternShiftTest";
import { DistractionControlTest } from "@/components/DistractionControlTest";
import { LogicSprintTest } from "@/components/LogicSprintTest";
import { MultiTaskerTest } from "@/components/MultiTaskerTest";
import { IntuitionGuessTest } from "@/components/IntuitionGuessTest";
import { SequenceMemoryTest } from "@/components/SequenceMemoryTest";
import { SpatialReasoningTest } from "@/components/SpatialReasoningTest";
import { BarChart3, Home, User, LogOut, TrendingUp, Users, Crown, Package, Menu } from "lucide-react";
import { MobileAd } from "@/components/MobileAd";
import { DesktopAd } from "@/components/DesktopAd";
import { ReferralShare } from "@/components/ReferralShare";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { ShareButtons } from "@/components/ShareButtons";
import { MultiplayerSection } from "@/components/MultiplayerSection";
import { EmailAutomationTriggers } from "@/components/EmailAutomationTriggers";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { SEOHead } from "@/components/SEOHead";
import { PremiumPromoBanner } from "@/components/PremiumPromoBanner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
type View = "home" | "tests" | "stats" | "test-active";
type ActiveTest = string | null;
const Index = () => {
  const [currentView, setCurrentView] = useState<View>("tests");
  const [activeTest, setActiveTest] = useState<ActiveTest>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const {
    subscribed
  } = useSubscription();
  const navigate = useNavigate();

  // Authentication is now optional - no forced redirect
  const handleTestSelect = (testId: string) => {
    console.log("Test selected:", testId);
    setActiveTest(testId);
    setCurrentView("test-active");
    localStorage.setItem('currentTestActive', 'true');
  };
  const handleBackToTests = () => {
    setActiveTest(null);
    setCurrentView("tests");
    localStorage.setItem('currentTestActive', 'false');
  };
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };
  const handlePurchase = async (productName: string) => {
    if (!user) {
      toast.error('Please sign in to purchase products');
      navigate('/auth');
      return;
    }
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        body: {
          productName
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      if (error) throw error;
      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout. Please try again.');
    }
  };
  if (loading) {
    return <div className="min-h-screen neural-grid bg-indigo-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <NeuroDashLogo />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }
  const renderCurrentView = () => {
    switch (currentView) {
      case "stats":
        return <div className="space-y-6">
            <StatsOverview />
            <MobileAd slot="0987654321" format="auto" />
          </div>;
      case "tests":
        return <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Cognitive Tests
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Challenge your mind with our comprehensive suite of brain training tests
              </p>
              <div className="flex justify-center">
                <PWAInstallButton />
              </div>
            </div>
            <TestCategories onTestSelect={handleTestSelect} />
            <MobileAd slot="1234567890" format="auto" />
          </div>;
      case "test-active":
        console.log("Active test:", activeTest);
        let testComponent;
        if (activeTest === "reaction-time") testComponent = <ReactionTimeTest />;else if (activeTest === "aim-trainer") testComponent = <AimTrainerTest />;else if (activeTest === "number-memory") testComponent = <NumberMemoryTest />;else if (activeTest === "typing-speed") testComponent = <TypingSpeedTest />;else if (activeTest === "visual-memory") testComponent = <VisualMemoryTest />;else if (activeTest === "chimp-test") testComponent = <ChimpTest />;else if (activeTest === "verbal-memory") testComponent = <VerbalMemoryTest />;else if (activeTest === "emotion-recognition") testComponent = <EmotionRecognitionTest />;else if (activeTest === "audio-memory") testComponent = <AudioMemoryTest />;else if (activeTest === "pattern-shift") testComponent = <PatternShiftTest />;else if (activeTest === "distraction-control") testComponent = <DistractionControlTest />;else if (activeTest === "logic-sprint") testComponent = <LogicSprintTest />;else if (activeTest === "multi-tasker") testComponent = <MultiTaskerTest />;else if (activeTest === "intuition-guess") testComponent = <IntuitionGuessTest />;else if (activeTest === "sequence-memory") testComponent = <SequenceMemoryTest />;else if (activeTest === "spatial-reasoning") testComponent = <SpatialReasoningTest />;else {
          testComponent = <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gradient">Coming Soon!</h2>
              <p className="text-muted-foreground">This test is under development.</p>
              <Button variant="brain" onClick={handleBackToTests}>
                Back to Tests
              </Button>
            </div>;
        }
        return <div className="min-h-[calc(100vh-200px)] flex flex-col relative">
            <div className="flex-1 mx-[5px] my-0 px-0">
              {testComponent}
            </div>
            {/* Floating PWA Install Button */}
            <div className="fixed bottom-4 right-4 z-40">
              <PWAInstallButton />
            </div>
          </div>;
      default:
        // home
        return <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gradient">
                  Train Your Brain
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  Challenge your mind with cognitive tests, track your progress, and unlock your brain's potential
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="neural" size="lg" onClick={() => setCurrentView("tests")}>
                  Start Testing
                </Button>
                
                <Button variant="brain" size="lg" onClick={() => setCurrentView("stats")}>
                  {user ? "View Progress" : "View Demo Progress"}
                </Button>
                {!user && <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
                    Sign In to Save Progress
                  </Button>}
                <PWAInstallButton />
              </div>
            </div>

            {/* Multiplayer Section */}
            <MultiplayerSection />

            {/* Pricing Section */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gradient">
                  Choose Your Plan
                </h2>
                <p className="text-xl text-muted-foreground">
                  Unlock advanced cognitive training and premium features
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="group relative overflow-hidden rounded-2xl bg-black border border-zinc-800 p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">Free</h3>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-600 flex items-center justify-center">
                        <span className="text-white font-bold">F</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gradient mb-2">$0</div>
                      <p className="text-zinc-400">Perfect for getting started</p>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-emerald-400 text-xs">✓</span>
                        </div>
                        <span className="text-zinc-300 group-hover/item:text-white transition-colors">8 Core cognitive tests</span>
                      </div>
                      <div className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-emerald-400 text-xs">✓</span>
                        </div>
                        <span className="text-zinc-300 group-hover/item:text-white transition-colors">Basic progress tracking</span>
                      </div>
                      <div className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-emerald-400 text-xs">✓</span>
                        </div>
                        <span className="text-zinc-300 group-hover/item:text-white transition-colors">Global leaderboards</span>
                      </div>
                      <div className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-emerald-400 text-xs">✓</span>
                        </div>
                        <span className="text-zinc-300 group-hover/item:text-white transition-colors">Multiplayer challenges</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="lg" className="w-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:scale-105" onClick={() => setCurrentView("tests")}>
                      Start Free
                    </Button>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="group relative overflow-hidden rounded-2xl bg-black border-2 border-gradient-to-r from-blue-500 to-purple-500 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 animate-fade-in" style={{
                animationDelay: '0.2s'
              }}>
                  {/* Popular Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
                      Most Popular
                    </div>
                  </div>
                  
                  {/* Animated Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-75 animate-pulse"></div>
                  <div className="absolute inset-[2px] bg-black rounded-2xl"></div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
                      <h3 className="text-2xl font-bold text-white">Premium</h3>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-gradient mb-2">$2.10</div>
                      <p className="text-zinc-400">per week</p>
                    </div>
                    
                    <p className="text-center text-zinc-300 mb-6">Everything in Free, plus:</p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-zinc-300 group-hover/item:text-white transition-colors">7 Unique premium tests</span>
                      </div>
                      <div className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-zinc-300 group-hover/item:text-white transition-colors">Advanced analytics & insights</span>
                      </div>
                      <div className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-zinc-300 group-hover/item:text-white transition-colors">Personalized training programs</span>
                      </div>
                      <div className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-zinc-300 group-hover/item:text-white transition-colors">Detailed performance reports</span>
                      </div>
                      <div className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-zinc-300 group-hover/item:text-white transition-colors">Priority support</span>
                      </div>
                    </div>
                    
                    <Button variant="neural" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25" onClick={() => setShowSubscriptionModal(true)}>
                      Upgrade to Premium
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                
              </div>
            </div>

            {/* Products Section */}
            <div className="max-w-6xl mx-auto">
              

              {/* Books Products Section - Coming Soon */}
              

              {/* Blog Product Section */}
              <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden mb-8">
                <div className="relative p-8 lg:p-12">
                  <div className="absolute inset-0 bg-black/[0.61]"></div>
                  <div className="relative flex flex-col lg:flex-row items-center">
                    <div className="flex-1 text-white lg:pr-8">
                      <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-4">
                        KNOWLEDGE & INSIGHTS
                      </div>
                      <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                        NeuroDash<br />
                        <span className="text-cyan-300">Blog</span>
                      </h2>
                      <p className="text-lg lg:text-xl mb-6 text-white/90 leading-relaxed">
                        Dive deep into the science of cognitive enhancement, habit formation, and peak performance with our expert insights and research-backed articles.
                      </p>
                      <ul className="space-y-3 mb-8 text-white/80">
                        
                        
                        
                      </ul>
                      <button className="bg-white text-violet-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg" onClick={() => navigate("/blog")}>
                        Read Articles
                      </button>
                    </div>
                    <div className="flex-1 flex justify-center mt-8 lg:mt-0">
                      <div className="relative">
                        <div className="absolute -inset-4 bg-white/20 rounded-2xl blur-xl"></div>
                        <img src="/lovable-uploads/92547e9c-22c3-4aab-ae1f-46223bd5de1b.png" alt="NeuroDash Blog hero image" loading="lazy" decoding="async" className="relative max-w-sm w-full h-auto rounded-xl shadow-2xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center py-16 border-t border-border">
                <div className="backdrop-blur-sm rounded-lg p-8 bg-zinc-950">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Ready to test your brain?</h2>
                  <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Looking to improve concentration and memory? Try 10+ science-backed brain tests that make mental training easy and fun.</p>
                  <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-colors" onClick={() => setCurrentView("tests")}>
                    Get Started Today
                  </button>
                </div>
              </div>
            </div>

            {/* Unlock Premium Tests Section */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              
              
            </div>

            {/* Mobile Ad */}
            <MobileAd slot="1111222233" format="auto" />

            {/* Share Section */}
            <ShareButtons title="NeuroDash - Train Your Brain!" description="I'm training my brain with NeuroDash's cognitive tests. Join me and see how sharp your mind is!" variant="full" className="max-w-md mx-auto" />

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-neural text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your cognitive improvements with detailed analytics and performance graphs
                </p>
              </div>

              <div className="card-neural text-center space-y-4 bg-zinc-950 rounded-none">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Global Competition</h3>
                <p className="text-sm text-muted-foreground">
                  Compete with users worldwide and climb the leaderboards in various cognitive challenges
                </p>
              </div>

              <div className="card-neural text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Unique Tests</h3>
                <p className="text-sm text-muted-foreground">
                  Experience innovative cognitive tests you won't find anywhere else
                </p>
              </div>
            </div>
          </div>;
    }
  };
  return <div className="min-h-screen neural-grid bg-stone-800">
      <SEOHead title="NeuroDash: Free Brain Training & Cognitive Tests" description="Test your memory, attention, and reaction speed with 15+ science-based brain training games. Track progress and compare scores." canonical="https://neurodash.space/" ogImage="https://neurodash.space/lovable-uploads/92547e9c-22c3-4aab-ae1f-46223bd5de1b.png" schemaData={{
      "@context": "https://schema.org",
      "@graph": [{
        "@type": "WebSite",
        "url": "https://neurodash.space/",
        "name": "NeuroDash"
      }, {
        "@type": "Organization",
        "url": "https://neurodash.space/",
        "name": "NeuroDash",
        "logo": "https://neurodash.space/lovable-uploads/92547e9c-22c3-4aab-ae1f-46223bd5de1b.png"
      }, {
        "@type": "WebApplication",
        "name": "NeuroDash",
        "url": "https://neurodash.space/",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web Browser"
      }]
    }} />
      {/* Navigation Header */}
      <header className="border-b border-border text-foreground backdrop-blur-sm sticky top-0 z-50 bg-[#030303]">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <NeuroDashLogo className="scale-75 sm:scale-100" />
          
          <nav className="flex items-center gap-2">
            {/* Primary Navigation Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("home")} className={currentView === "home" ? "bg-primary/20" : ""}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("tests")} className={currentView === "tests" ? "bg-primary/20" : ""}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Tests
              </Button>
              
            </div>

            {/* Mobile Navigation Buttons */}
            <div className="flex sm:hidden items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("home")} className={currentView === "home" ? "bg-primary/20" : ""}>
                <Home className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("tests")} className={currentView === "tests" ? "bg-primary/20" : ""}>
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/create")}>
                <Users className="w-4 h-4" />
              </Button>
            </div>

            {/* Secondary Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-3 bg-[#9a31ff]">
                  <Menu className="w-4 h-4" />
                  <span className="ml-2 hidden sm:inline">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border z-50">
                <DropdownMenuItem onClick={() => setCurrentView("stats")} className="cursor-pointer">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Progress
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user ? <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem> : <DropdownMenuItem onClick={() => navigate("/auth")} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>

      {/* Premium Promo Banner */}
      <PremiumPromoBanner />

      {/* Desktop Side Rail Ads */}
      <DesktopAd slot="2222333344" position="left" />
      <DesktopAd slot="4444555566" position="right" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>

      {/* Back Button for Active Tests */}
      {currentView === "test-active" && <div className="fixed bottom-6 left-6">
          <Button variant="brain" onClick={handleBackToTests} className="text-[#fefaf8] bg-[#fd1206]">
            ← Back to Tests
          </Button>
        </div>}

      {/* Floating Share Button */}
      {currentView !== "test-active" && <ShareButtons variant="floating" title="NeuroDash - Train Your Brain!" description="I'm improving my cognitive abilities with NeuroDash! Join me and test your brainpower with scientifically-designed challenges." />}

      {/* Subscription Modal */}
      <SubscriptionModal open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal} />
    </div>;
};
export default Index;