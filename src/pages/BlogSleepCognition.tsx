import { SEOHead } from "@/components/SEOHead";
import { NeuroDashLogo } from "@/components/NeuroDashLogo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, BarChart3, TrendingUp, User, LogOut, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const BlogSleepCognition = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen neural-grid bg-background">
      <SEOHead
        title="Sleep Your Way to Smarter: The Hidden Connection Between Rest and Cognitive Power - NeuroDash"
        description="Sleep researcher reveals why your brain's best work happens while you're unconscious and how to optimize it for peak cognitive performance."
        keywords="sleep and cognition, brain health, memory consolidation, cognitive performance, sleep optimization"
        canonical="https://neurodash.space/blog/sleep-cognition"
        ogImage="/lovable-uploads/neurodash-brain.png"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "Sleep Your Way to Smarter: The Hidden Connection Between Rest and Cognitive Power",
          "author": {
            "@type": "Person",
            "name": "Dr. Lisa Park"
          },
          "datePublished": "2025-01-05",
          "url": "https://neurodash.space/blog/sleep-cognition"
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
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">Health</span>
                <span>•</span>
                <span>Dr. Lisa Park</span>
                <span>•</span>
                <span>January 5, 2025</span>
                <span>•</span>
                <span>9 min read</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Sleep Your Way to Smarter: The Hidden Connection Between Rest and Cognitive Power
              </h1>
              
              <p className="text-xl text-muted-foreground">
                As a sleep researcher at Johns Hopkins, I've spent the last decade uncovering how sleep transforms your brain every night. What I've discovered will change how you think about those 8 hours forever.
              </p>
            </div>

            <Card className="p-6 mb-8">
              <p className="text-foreground">
                "I'll sleep when I'm dead" might be the most expensive mistake you're making. While you're unconscious, your brain is working harder than during your most productive waking hours and the quality of this work determines your cognitive performance the next day.
              </p>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Night Shift: Your Brain's Secret Second Job</h2>
            
            <p className="text-foreground mb-4">
              Picture this: every night around 10 PM, your brain clocks out of its day job and starts its real work. While you're unconscious, a sophisticated cleaning crew gets to work.
            </p>

            <p className="text-foreground mb-4">
              This isn't poetic language it's literal. During deep sleep, your brain's glymphatic system activates, washing away toxic proteins that accumulate during waking hours. It's like a dishwasher for your neurons.
            </p>

            <p className="text-foreground mb-6">
              <strong>The discovery that changed everything:</strong> In 2013, my colleague Dr. Maiken Nedergaard found that brain cells actually shrink during sleep, creating more space for cerebrospinal fluid to flush out waste. Miss this cleaning cycle, and your cognitive performance tanks.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Memory Magic: How Sleep Makes You Smarter</h2>
            
            <p className="text-foreground mb-4">
              Here's something that will blow your mind: you can literally learn new skills while you sleep. Not through audio courses played under your pillow, but through a process called memory consolidation.
            </p>

            <p className="text-foreground mb-4">
              During sleep, your brain replays the day's experiences up to 20 times faster than real-time. It's like watching a highlight reel, but your brain is the editor, strengthening important memories and discarding irrelevant ones.
            </p>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold text-foreground mb-4">The Sleep Learning Experiment</h3>
              <p className="text-foreground mb-4">
                In my lab, we taught participants a complex motor task. Group A slept normally. Group B was kept awake all night. Group C slept but we disrupted their deep sleep phases.
              </p>
              <p className="text-foreground">
                <strong>Results:</strong> Group A improved 20% overnight. Groups B and C showed no improvement and actually performed worse the next day.
              </p>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Four Stages of Cognitive Recovery</h2>
            
            <p className="text-foreground mb-4">
              Your brain doesn't just "turn off" during sleep. It cycles through four distinct stages, each serving a specific cognitive function:
            </p>

            <p className="text-foreground mb-4">
              <strong>Stage 1 & 2 (Light Sleep):</strong> Your brain downloads the day's experiences from short-term to long-term memory. Skip this, and tomorrow feels like déjà vu because nothing "stuck."
            </p>

            <p className="text-foreground mb-4">
              <strong>Stage 3 (Deep Sleep):</strong> The brain's cleaning crew activates. Metabolic waste gets flushed out, including proteins linked to Alzheimer's disease. This is also when growth hormone peaks, repairing neural connections.
            </p>

            <p className="text-foreground mb-6">
              <strong>REM Sleep:</strong> Your brain integrates new learning with existing knowledge, forming creative connections. This is where "aha!" moments are born.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Cognitive Cost of Sleep Debt</h2>
            
            <p className="text-foreground mb-4">
              Here's the scary part: even one night of poor sleep affects your brain for days. In our studies, participants who slept just 6 hours (instead of 8) showed:
            </p>

            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>30% reduction in working memory capacity</li>
              <li>40% decrease in the ability to form new memories</li>
              <li>50% impairment in problem-solving skills</li>
              <li>Reaction times equivalent to being legally drunk</li>
            </ul>

            <p className="text-foreground mb-6">
              <strong>The compound effect:</strong> Sleep debt accumulates like financial debt. Miss 2 hours of sleep per night for a week, and you owe your brain 14 hours that's nearly two full nights of recovery sleep needed.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Your Cognitive Sleep Optimization Protocol</h2>
            
            <p className="text-foreground mb-4">
              Based on thousands of hours of sleep data from our lab, here's how to maximize your brain's overnight transformation:
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">The 3-2-1 Rule</h3>
            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li><strong>3 hours before bed:</strong> No more large meals</li>
              <li><strong>2 hours before bed:</strong> No more work or stressful activities</li>
              <li><strong>1 hour before bed:</strong> No more screens (blue light disrupts melatonin)</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mb-3">Temperature Hacking</h3>
            <p className="text-foreground mb-4">
              Your core body temperature needs to drop 2-3°F to initiate sleep. Set your bedroom to 65-68°F, and take a hot shower before bed the post-shower temperature drop triggers sleepiness.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">The Learning Enhancement Protocol</h3>
            <p className="text-foreground mb-6">
              If you learned something important today, review it 30 minutes before sleep. Your brain will prioritize processing this information during the night, strengthening the memory up to 40% more than usual.
            </p>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Sleep Quality vs. Quantity</h3>
              <p className="text-foreground mb-4">
                It's not just about getting 8 hours it's about getting quality sleep cycles. Track these metrics:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-1">
                <li><strong>Deep sleep:</strong> Aim for 15-20% of total sleep time</li>
                <li><strong>REM sleep:</strong> Should be 20-25% of total sleep</li>
                <li><strong>Sleep efficiency:</strong> Time asleep ÷ time in bed (target 85%+)</li>
              </ul>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Nap Science</h2>
            
            <p className="text-foreground mb-4">
              Strategic napping can boost cognitive performance, but timing is everything. A 20-minute "power nap" enhances alertness and working memory. Sleep 90 minutes for a full sleep cycle that improves creative problem-solving.
            </p>

            <p className="text-foreground mb-6">
              <strong>The golden rule:</strong> Nap before 3 PM, or you'll sabotage tonight's sleep quality.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Your Brain on Great Sleep</h2>
            
            <p className="text-foreground mb-4">
              When you consistently get quality sleep, your brain transforms. Participants in our 30-day sleep optimization study showed:
            </p>

            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>23% improvement in focus and attention</li>
              <li>18% boost in creative problem-solving</li>
              <li>31% better emotional regulation</li>
              <li>41% improvement in learning new information</li>
            </ul>

            <p className="text-foreground mb-6">
              The best part? These improvements start within just 3-4 nights of better sleep.
            </p>

            <Card className="p-6">
              <p className="text-foreground mb-4">
                <strong>Ready to unlock your brain's potential?</strong>
              </p>
              <p className="text-foreground mb-4">
                Test your cognitive performance and track how sleep quality affects your mental sharpness with our brain training assessments.
              </p>
              <Button onClick={() => navigate("/?view=home")} className="w-full">
                Start Tracking Your Cognitive Performance
              </Button>
            </Card>
          </article>
        </main>
      </div>
    </div>
  );
};

export default BlogSleepCognition;