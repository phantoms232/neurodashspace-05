import { SEOHead } from "@/components/SEOHead";
import { NeuroDashLogo } from "@/components/NeuroDashLogo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, BarChart3, TrendingUp, User, LogOut, Package, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
const Blog = () => {
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  return <div className="min-h-screen neural-grid bg-stone-800">
      <SEOHead title="Blog - NeuroDash" description="Discover the latest insights in neuroscience, habit formation, and cognitive enhancement" canonical="https://neurodash.space/blog" schemaData={{
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "NeuroDash Blog",
      "url": "https://neurodash.space/blog"
    }} />
      
      {/* Navigation Header */}
      <header className="border-b border-border bg-card/80 text-foreground backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <NeuroDashLogo className="scale-75 sm:scale-100" />
          
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/")}>
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/?view=tests")}>
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Tests</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/?view=stats")}>
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Progress</span>
            </Button>
            
            {user ? <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button> : <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/auth")}>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign In</span>
              </Button>}
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/?view=home")} className="mb-6 text-red-50 bg-violet-950 hover:bg-violet-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            NeuroDash Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your source for the latest insights in neuroscience, habit formation, and cognitive enhancement
          </p>
        </div>

        {/* Blog Posts List */}
        <div className="max-w-4xl mx-auto">
          {/* Featured Article Card */}
          <article onClick={() => navigate("/blog/brain-fog-2025")} className="backdrop-blur-sm rounded-lg p-8 mb-8 cursor-pointer transition-colors bg-[#025a48]">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">Featured</span>
              <span>•</span>
              <span>January 2025</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">💭 Brain Fog in 2025: Why So Many People Are Struggling and How to Clear It</h2>
            
            <p className="text-lg text-muted-foreground mb-6">
              In our hyper-connected digital age, brain fog has become an epidemic. Here's what science tells us about this cognitive phenomenon and evidence-based strategies to overcome it.
            </p>
            
            <p className="text-foreground mb-6">
              If you've ever felt like you're thinking through molasses, struggling to find words, or experiencing that frustrating mental cloudiness that makes even simple tasks feel overwhelming, you're not alone. Brain fog has become one of the most common cognitive complaints of 2025...
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Written by the NeuroDash Research Team
              </div>
              <Button variant="outline">
                Read Full Article
              </Button>
            </div>
          </article>

          {/* New Educational Articles */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <article onClick={() => navigate("/blog/science")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">Science</span>
                <span>•</span>
                <span>15 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                The Science Behind Brain Training
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Discover the research and methodology behind cognitive training. Learn how brain training works and its proven benefits.
              </p>
              
              <Button variant="outline" size="sm">
                Read Article
              </Button>
            </article>

            <article onClick={() => navigate("/blog/memory-improvement")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">Memory</span>
                <span>•</span>
                <span>12 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                Memory Improvement Techniques
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Learn proven strategies to enhance your memory power and boost recall ability with science-based methods.
              </p>
              
              <Button variant="outline" size="sm">
                Read Article
              </Button>
            </article>
          </div>

          {/* Educational Resources */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <article onClick={() => navigate("/test-methodology")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Methodology</span>
                <span>•</span>
                <span>18 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                Test Methodology & Design
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Understanding the scientific principles behind NeuroDash cognitive assessments and validation process.
              </p>
              
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </article>

            <article onClick={() => navigate("/user-guide")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">Guide</span>
                <span>•</span>
                <span>10 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                How to Use NeuroDash Effectively
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Complete guide to maximizing your brain training experience and achieving optimal cognitive improvement.
              </p>
              
              <Button variant="outline" size="sm">
                View Guide
              </Button>
            </article>
          </div>

          {/* More Articles */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <article onClick={() => navigate("/blog/focus-habits")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">Habits</span>
                <span>•</span>
                <span>Dr. Sarah Chen</span>
                <span>•</span>
                <span>8 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                Building Laser Focus: 5 Science-Backed Habits That Actually Work
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Our cognitive neuroscientist shares practical strategies used by top performers to maintain deep focus in a distracted world.
              </p>
              
              <Button variant="outline" size="sm">
                Read Article
              </Button>
            </article>

            <article onClick={() => navigate("/blog/mental-clarity")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Mindset</span>
                <span>•</span>
                <span>Prof. Michael Torres</span>
                <span>•</span>
                <span>11 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                The Mental Clarity Blueprint: How Elite Athletes Train Their Minds
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Discover the mental training techniques used by Olympic athletes to achieve peak cognitive performance under pressure.
              </p>
              
              <Button variant="outline" size="sm">
                Read Article
              </Button>
            </article>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <article onClick={() => navigate("/blog/sleep-cognition")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">Health</span>
                <span>•</span>
                <span>Dr. Lisa Park</span>
                <span>•</span>
                <span>9 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                Sleep Your Way to Smarter: The Hidden Connection Between Rest and Cognitive Power
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Sleep researcher reveals why your brain's best work happens while you're unconscious and how to optimize it.
              </p>
              
              <Button variant="outline" size="sm">
                Read Article
              </Button>
            </article>

            <article onClick={() => navigate("/blog/stress-management")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full">Stress</span>
                <span>•</span>
                <span>Dr. James Wilson</span>
                <span>•</span>
                <span>12 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                From Overwhelmed to Optimized: A Neuroscientist's Guide to Stress-Proofing Your Brain
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Learn how chronic stress rewires your brain and discover evidence-based techniques to build resilience.
              </p>
              
              <Button variant="outline" size="sm">
                Read Article
              </Button>
            </article>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <article onClick={() => navigate("/blog/nutrition-brain")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">Nutrition</span>
                <span>•</span>
                <span>Dr. Maria Rodriguez</span>
                <span>•</span>
                <span>10 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                Brain Food Revolution: What Top Neuroscientists Actually Eat
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Nutritional neuroscientist breaks down the real science behind brain-boosting foods and debunks common myths.
              </p>
              
              <Button variant="outline" size="sm">
                Read Article
              </Button>
            </article>

            <article onClick={() => navigate("/blog/digital-wellness")} className="backdrop-blur-sm rounded-lg p-6 cursor-pointer transition-colors bg-card/30 hover:bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">Digital Health</span>
                <span>•</span>
                <span>Dr. Alex Kim</span>
                <span>•</span>
                <span>7 min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                Digital Detox for Your Brain: Why Less Screen Time Means More Brain Power
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Digital wellness expert explains how our devices are rewiring our brains and shares practical strategies for healthy tech use.
              </p>
              
              <Button variant="outline" size="sm">
                Read Article
              </Button>
            </article>
          </div>
        </div>
      </div>
    </div>;
};
export default Blog;