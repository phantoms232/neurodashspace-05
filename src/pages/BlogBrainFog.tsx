
import { SEOHead } from "@/components/SEOHead";
import { NeuroDashLogo } from "@/components/NeuroDashLogo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, BarChart3, TrendingUp, User, LogOut, Package, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const BlogBrainFog = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen neural-grid bg-background">
      <SEOHead
        title="Brain Fog in 2025: Why So Many People Are Struggling and How to Clear It - NeuroDash"
        description="Understand the causes of brain fog in our digital age and discover evidence-based strategies to restore mental clarity and cognitive sharpness."
        keywords="brain fog, mental clarity, cognitive fatigue, focus problems, mental exhaustion"
        canonical="https://neurodash.space/blog/brain-fog-2025"
        ogImage="/lovable-uploads/neurodash-brain.png"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "Brain Fog in 2025: Why So Many People Are Struggling and How to Clear It",
          "author": {
            "@type": "Person",
            "name": "Dr. Maya Patel"
          },
          "datePublished": "2025-01-15",
          "url": "https://neurodash.space/blog/brain-fog-2025"
        }}
      />
      
      {/* Navigation Header */}
      <header className="border-b border-border bg-card/80 text-foreground backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <NeuroDashLogo className="scale-75 sm:scale-100" />
          
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/?view=home")}>
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/?view=tests")}>
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Tests</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/multiplayer")}>
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Multiplayer</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/product")}>
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Products</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/?view=stats")}>
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Progress</span>
            </Button>
            
            {user ? (
              <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/auth")}>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign In</span>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/blog")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        <main className="max-w-4xl mx-auto">
          <article className="prose prose-invert max-w-none">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full">Featured</span>
                <span>•</span>
                <span>Dr. Maya Patel</span>
                <span>•</span>
                <span>January 15, 2025</span>
                <span>•</span>
                <span>8 min read</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Brain Fog in 2025: Why So Many People Are Struggling and How to Clear It
              </h1>
              
              <p className="text-xl text-muted-foreground">
                As a neurologist specializing in cognitive health, I've seen a 400% increase in brain fog complaints since 2020. Here's what's really happening to our minds and how to fight back.
              </p>
            </div>

            <Card className="p-6 mb-8">
              <p className="text-foreground">
                "Doctor, I feel like I'm thinking through molasses. I can't find words, I forget what I was doing mid-task, and everything feels harder than it should be." I hear some variation of this every single day in my clinic. Brain fog has become the signature symptom of our era.
              </p>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Brain Fog Epidemic: Why Now?</h2>

            <p className="text-foreground mb-4">
              Brain fog isn't a new phenomenon, but its prevalence has exploded in recent years. Several factors are converging to create a perfect storm of cognitive dysfunction:
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">1. Information Overload</h3>
            <p className="text-foreground mb-4">
              We're bombarded with more information in a single day than our ancestors processed in a lifetime. This constant influx overwhelms our attentional systems, leading to mental fatigue and reduced cognitive capacity.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">2. Chronic Stress</h3>
            <p className="text-foreground mb-4">
              The always-on, hyper-connected nature of modern life keeps us in a perpetual state of low-grade stress. This chronic stress elevates cortisol levels, which impairs memory, focus, and decision-making.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">3. Sleep Deprivation</h3>
            <p className="text-foreground mb-4">
              Sleep is essential for cognitive restoration and memory consolidation. Yet, millions of people are chronically sleep-deprived, leaving their brains unable to function optimally.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">4. Digital Distractions</h3>
            <p className="text-foreground mb-6">
              Our brains are wired to seek novelty, and digital devices provide an endless stream of it. This constant distraction fragments our attention, making it difficult to sustain focus on any one task.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Neuroscience of Brain Fog</h2>

            <p className="text-foreground mb-4">
              Brain fog isn't just a feeling; it's a measurable neurological state. Studies show that people experiencing brain fog have:
            </p>

            <ul className="list-disc list-inside text-foreground space-y-2 mb-6">
              <li><strong>Reduced blood flow to the brain:</strong> This impairs the delivery of oxygen and nutrients, slowing down cognitive processes.</li>
              <li><strong>Decreased activity in the prefrontal cortex:</strong> This area is responsible for executive functions like planning, decision-making, and working memory.</li>
              <li><strong>Increased inflammation in the brain:</strong> Inflammation disrupts neural communication and can damage brain cells over time.</li>
              <li><strong>Imbalances in neurotransmitters:</strong> Neurotransmitters like dopamine and serotonin play a crucial role in focus, motivation, and mood.</li>
            </ul>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">The Cognitive Impact</h3>
              <p className="text-foreground mb-4">
                Brain fog manifests in a variety of ways, including:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-2">
                <li>Difficulty concentrating or focusing</li>
                <li>Memory problems and forgetfulness</li>
                <li>Mental fatigue and exhaustion</li>
                <li>Trouble finding the right words</li>
                <li>Slowed thinking and processing speed</li>
                <li>Lack of mental clarity</li>
                <li>Feeling overwhelmed or confused</li>
              </ul>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">Evidence-Based Strategies to Clear the Fog</h2>

            <p className="text-foreground mb-4">
              The good news is that brain fog is often reversible with the right interventions. Here are some of the most effective strategies:
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">1. Optimize Sleep</h3>
            <p className="text-foreground mb-4">
              Prioritize 7-9 hours of quality sleep per night. Establish a consistent sleep schedule, create a relaxing bedtime routine, and optimize your sleep environment.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">2. Manage Stress</h3>
            <p className="text-foreground mb-4">
              Practice stress-reduction techniques like meditation, yoga, or deep breathing exercises. Identify and address the root causes of your stress.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">3. Limit Digital Distractions</h3>
            <p className="text-foreground mb-4">
              Set boundaries with technology. Turn off notifications, schedule dedicated time for focused work, and take regular breaks from screens.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">4. Nourish Your Brain</h3>
            <p className="text-foreground mb-4">
              Eat a balanced diet rich in brain-boosting nutrients like omega-3 fatty acids, antioxidants, and B vitamins. Limit processed foods, sugar, and caffeine.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">5. Exercise Regularly</h3>
            <p className="text-foreground mb-4">
              Physical activity increases blood flow to the brain, reduces inflammation, and improves cognitive function. Aim for at least 30 minutes of moderate-intensity exercise most days of the week.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">6. Cognitive Training</h3>
            <p className="text-foreground mb-6">
              Engage in mentally stimulating activities that challenge your brain and improve cognitive skills like memory, attention, and processing speed.
            </p>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">The Power of Neuroplasticity</h3>
              <p className="text-foreground mb-4">
                Your brain has an incredible ability to adapt and change throughout your life. By implementing these strategies, you can rewire your brain to overcome brain fog and restore mental clarity.
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-foreground mb-4">
                <strong>Ready to clear the fog?</strong>
              </p>
              <p className="text-foreground mb-4">
                Test your cognitive clarity and track your progress with our brain training assessments designed by neuroscientists.
              </p>
              <Button onClick={() => navigate("/?view=home")} className="w-full">
                Start Your Cognitive Assessment
              </Button>
            </Card>
          </article>
        </main>
      </div>
    </div>
  );
};

export default BlogBrainFog;
