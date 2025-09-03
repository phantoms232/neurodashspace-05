
import { SEOHead } from "@/components/SEOHead";
import { NeuroDashLogo } from "@/components/NeuroDashLogo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, BarChart3, TrendingUp, User, LogOut, Package, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const BlogMentalClarity = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen neural-grid bg-background">
      <SEOHead
        title="The Mental Clarity Blueprint: How Elite Athletes Train Their Minds - NeuroDash"
        description="Discover the mental training techniques used by Olympic athletes to achieve peak cognitive performance under pressure."
        keywords="mental clarity, cognitive performance, athlete mindset, peak performance, sports psychology"
        canonical="https://neurodash.space/blog/mental-clarity"
        ogImage="/lovable-uploads/neurodash-brain.png"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "The Mental Clarity Blueprint: How Elite Athletes Train Their Minds",
          "author": {
            "@type": "Person",
            "name": "Prof. Michael Torres"
          },
          "datePublished": "2025-01-08",
          "url": "https://neurodash.space/blog/mental-clarity"
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
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Mindset</span>
                <span>•</span>
                <span>Prof. Michael Torres</span>
                <span>•</span>
                <span>January 8, 2025</span>
                <span>•</span>
                <span>11 min read</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                The Mental Clarity Blueprint: How Elite Athletes Train Their Minds
              </h1>
              
              <p className="text-xl text-muted-foreground">
                After 15 years working with Olympic athletes, Navy SEALs, and Fortune 500 CEOs, I've identified the exact mental training protocols that separate peak performers from everyone else.
              </p>
            </div>

            <Card className="p-6 mb-8">
              <p className="text-foreground">
                "Professor, how do you stay so calm under pressure?" That's the question I get asked most. The truth? I wasn't born with ice in my veins. I learned it from studying the world's most mentally tough individuals and you can too.
              </p>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Pressure Laboratory</h2>
            
            <p className="text-foreground mb-4">
              Last month, I watched Simone Biles nail a perfect routine at the World Championships. What you didn't see was the 2-year mental training program that made that moment possible.
            </p>

            <p className="text-foreground mb-4">
              Elite athletes don't just train their bodies they systematically train their minds to perform under crushing pressure. Here's their playbook.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Protocol 1: Cognitive Load Training</h2>
            
            <p className="text-foreground mb-4">
              Navy SEALs use a technique called "stress inoculation." They practice critical skills while under physical and mental stress, building what I call "cognitive resilience."
            </p>

            <p className="text-foreground mb-4">
              <strong>The technique:</strong> Practice your most important skills while experiencing controlled stress. Athletes might practice free throws while loud music plays and people scream in their ears.
            </p>

            <p className="text-foreground mb-6">
              <strong>For daily life:</strong> Practice presentations while doing jumping jacks, or rehearse difficult conversations while holding a wall sit. Your brain learns to maintain clarity despite distraction.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Protocol 2: Attention Anchoring</h2>
            
            <p className="text-foreground mb-4">
              Michael Jordan was famous for his "tunnel vision" during clutch moments. This isn't natural talent it's a trainable skill called attention anchoring.
            </p>

            <p className="text-foreground mb-4">
              <strong>The practice:</strong> Choose one specific focal point during high-pressure situations. Jordan focused on the back of the rim. Surgeons focus on their breathing. CEOs focus on their hands.
            </p>

            <p className="text-foreground mb-6">
              <strong>Why it works:</strong> When your attention has a specific anchor, it can't spiral into anxiety or distraction. Your nervous system literally calms down.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Protocol 3: The Champion's Pre-Game Ritual</h2>
            
            <p className="text-foreground mb-4">
              Every elite performer I've worked with has the same thing: an unshakeable pre-performance routine. Not superstition neuroscience.
            </p>

            <p className="text-foreground mb-4">
              <strong>Serena Williams' routine:</strong> Same warm-up sequence, same visualization, same breathing pattern, same positive self-talk. Every. Single. Time.
            </p>

            <p className="text-foreground mb-6">
              <strong>The science:</strong> Consistent routines trigger the parasympathetic nervous system, moving you from fight-or-flight into a calm, focused state. Your brain recognizes the pattern and automatically shifts into performance mode.
            </p>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Your 5-Minute Champion Routine</h3>
              <div className="space-y-2 text-foreground">
                <p><strong>Minute 1:</strong> Deep breathing (4 counts in, 6 counts out)</p>
                <p><strong>Minute 2:</strong> Body scan and tension release</p>
                <p><strong>Minute 3:</strong> Positive self-talk or affirmations</p>
                <p><strong>Minute 4:</strong> Visualization of successful performance</p>
                <p><strong>Minute 5:</strong> Set your attention anchor</p>
              </div>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">Protocol 4: Mental Rehearsal Mastery</h2>
            
            <p className="text-foreground mb-4">
              Olympic ski racers never see the course before they compete. So they do something that seems impossible: they mentally ski the entire run, gate by gate, turn by turn.
            </p>

            <p className="text-foreground mb-4">
              Brain imaging shows that vivid mental rehearsal activates the same neural pathways as physical practice. You're literally training your brain without moving your body.
            </p>

            <p className="text-foreground mb-6">
              <strong>The technique:</strong> Close your eyes and rehearse your performance in as much detail as possible. Include not just what you'll do, but what you'll see, hear, and feel. Make it real in your mind first.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Protocol 5: Failure Recovery Training</h2>
            
            <p className="text-foreground mb-4">
              Here's what separates champions from everyone else: they train for failure. Not to fail, but to recover quickly when things go wrong.
            </p>

            <p className="text-foreground mb-4">
              <strong>The method:</strong> During practice, elite athletes intentionally introduce mistakes or setbacks, then practice their recovery response. A tennis player might practice losing the first set, then coming back to win.
            </p>

            <p className="text-foreground mb-6">
              <strong>For you:</strong> Mentally rehearse potential obstacles and your response. What if your presentation technology fails? What if you get interrupted during an important conversation? Plan your comeback.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Neuroscience of Clutch Performance</h2>
            
            <p className="text-foreground mb-4">
              What happens in your brain during pressure? fMRI studies show that anxiety floods the prefrontal cortex your thinking brain with stress hormones, essentially hijacking your ability to think clearly.
            </p>

            <p className="text-foreground mb-4">
              Elite performers train their brains to downregulate this stress response. They've literally rewired their neural pathways to stay calm under pressure.
            </p>

            <p className="text-foreground mb-6">
              <strong>The key insight:</strong> Mental clarity isn't about eliminating pressure it's about performing excellently despite it.
            </p>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">The Champion's Mindset Shift</h3>
              <p className="text-foreground mb-4">
                Instead of: "I hope I don't mess up"<br/>
                Think: "I've trained for this moment"
              </p>
              <p className="text-foreground mb-4">
                Instead of: "Everyone's watching me"<br/>
                Think: "This is my time to shine"
              </p>
              <p className="text-foreground">
                Instead of: "What if I fail?"<br/>
                Think: "I trust my preparation"
              </p>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">Your Mental Training Program</h2>
            
            <p className="text-foreground mb-4">
              Start with protocol 3 develop your pre-performance routine. Use it before every important task for 2 weeks. Once that becomes automatic, add mental rehearsal.
            </p>

            <p className="text-foreground mb-6">
              Remember: champions aren't born with superior mental clarity. They build it through deliberate practice, just like any other skill.
            </p>

            <Card className="p-6">
              <p className="text-foreground mb-4">
                <strong>Ready to train like a champion?</strong>
              </p>
              <p className="text-foreground mb-4">
                Test your mental clarity and cognitive performance under pressure with our scientifically-designed assessments.
              </p>
              <Button onClick={() => navigate("/?view=home")} className="w-full">
                Start Your Mental Training
              </Button>
            </Card>
          </article>
        </main>
      </div>
    </div>
  );
};

export default BlogMentalClarity;
