import { SEOHead } from "@/components/SEOHead";
import { NeuroDashLogo } from "@/components/NeuroDashLogo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, BarChart3, TrendingUp, User, LogOut, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
const BlogDigitalWellness = () => {
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
      <SEOHead title="Digital Detox for Your Brain: Why Less Screen Time Means More Brain Power - NeuroDash" description="Digital wellness expert explains how our devices are rewiring our brains and shares practical strategies for healthy tech use." keywords="digital wellness, screen time, brain health, technology addiction, digital detox" canonical="https://neurodash.space/blog/digital-wellness" ogImage="/lovable-uploads/neurodash-brain.png" schemaData={{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Digital Detox for Your Brain: Why Less Screen Time Means More Brain Power",
      "author": {
        "@type": "Person",
        "name": "Dr. Alex Kim"
      },
      "datePublished": "2024-12-28",
      "url": "https://neurodash.space/blog/digital-wellness"
    }} />
      
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
        <Button variant="ghost" onClick={() => navigate("/blog")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        <main className="max-w-4xl mx-auto">
          <article className="prose prose-invert max-w-none">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">Digital Health</span>
                <span>•</span>
                <span>Dr. Alex Kim</span>
                <span>•</span>
                <span>December 28, 2024</span>
                <span>•</span>
                <span>7 min read</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Digital Detox for Your Brain: Why Less Screen Time Means More Brain Power
              </h1>
              
              <p className="text-xl text-muted-foreground">
                As a digital wellness researcher at Berkeley, I study how technology affects our brains. What I've discovered about our relationship with screens will fundamentally change how you use your devices.
              </p>
            </div>

            <Card className="p-6 mb-8">
              <p className="text-foreground">
                Last week, I watched a Stanford student try to read a book for 20 minutes. He checked his phone 47 times. His brain had been hijacked by digital stimulation, and he didn't even realize it. Sound familiar?
              </p>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Great Brain Rewiring: What Screens Do to Your Mind</h2>
            
            <p className="text-foreground mb-4">
              Your brain is not the same as it was 10 years ago. Constant digital stimulation has literally rewired your neural pathways, creating what I call "the distracted brain syndrome."
            </p>

            <p className="text-foreground mb-4">
              <strong>The harsh reality:</strong> The average person checks their phone 96 times per day that's once every 10 minutes during waking hours. Each interruption fragments your attention and reduces cognitive capacity.
            </p>

            <p className="text-foreground mb-6">
              <strong>Brain imaging reveals:</strong> Heavy digital media users show reduced gray matter in areas controlling focus, decision-making, and impulse control. We're literally shrinking the parts of our brain that make us most human.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Attention Apocalypse: How We Lost Our Superpower</h2>
            
            <p className="text-foreground mb-4">
              Sustained attention used to be humanity's cognitive superpower. It's how we built civilizations, created art, and solved complex problems. Now, the average person can focus for just 8 seconds before feeling the urge to check their device.
            </p>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold text-foreground mb-4">The Digital Distraction Checklist</h3>
              <p className="text-foreground mb-2">You know your brain is hijacked when you:</p>
              <ul className="list-disc list-inside text-foreground space-y-1">
                <li>Feel phantom phone vibrations</li>
                <li>Can't read for more than 10 minutes without checking devices</li>
                <li>Immediately reach for your phone when bored or waiting</li>
                <li>Experience anxiety when your phone battery is low</li>
                <li>Multitask constantly but accomplish less</li>
              </ul>
            </Card>

            <p className="text-foreground mb-6">
              <strong>The neuroscience:</strong> Digital devices trigger dopamine release in the same reward pathways as addictive substances. Your brain becomes dependent on the constant stimulation, making normal activities feel unbearably boring.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Cognitive Costs: What You're Really Paying</h2>
            
            <p className="text-foreground mb-4">
              Every hour of excessive screen time extracts a hidden cognitive tax. My research with knowledge workers revealed the true price:
            </p>

            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li><strong>Attention residue:</strong> After checking your phone, it takes 23 minutes to fully refocus</li>
              <li><strong>Memory degradation:</strong> Constant external stimulation impairs memory consolidation</li>
              <li><strong>Creativity collapse:</strong> Digital overstimulation suppresses the default mode network where innovation happens</li>
              <li><strong>Emotional dysregulation:</strong> Screen addiction correlates with increased anxiety and depression</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">The RESET Protocol: Reclaiming Your Brain</h2>
            
            <p className="text-foreground mb-4">
              The good news? Your brain is remarkably plastic. With the right approach, you can restore your cognitive abilities within weeks. Here's my evidence-based protocol:
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">R - Remove Triggers</h3>
            <p className="text-foreground mb-4">
              Your environment shapes your behavior more than willpower. Remove digital triggers from your physical space.
            </p>

            <p className="text-foreground mb-4">
              <strong>My setup:</strong> Phone charges in another room overnight. No social media apps on my home screen. All notifications disabled except calls and texts.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">E - Establish Sacred Spaces</h3>
            <p className="text-foreground mb-4">
              Create device-free zones where your brain can operate in its natural state.
            </p>

            <p className="text-foreground mb-4">
              <strong>My boundaries:</strong> Bedroom is device-free. No screens during meals. First hour of the day is analog only reading, journaling, or walking.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">S - Schedule Digital Windows</h3>
            <p className="text-foreground mb-4">
              Instead of constant access, batch your digital activities into specific time blocks.
            </p>

            <p className="text-foreground mb-4">
              <strong>My schedule:</strong> Check email 3x daily at set times. Social media for 20 minutes after lunch. News consumption limited to 15 minutes before dinner.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">E - Engage in Single-Tasking</h3>
            <p className="text-foreground mb-4">
              Multitasking is a myth. Your brain can only focus on one cognitive task at a time. Single-tasking rebuilds your attention muscle.
            </p>

            <p className="text-foreground mb-4">
              <strong>The practice:</strong> Do one thing at a time with full attention. When writing, write. When talking, listen. When walking, walk.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-3">T - Train Boredom Tolerance</h3>
            <p className="text-foreground mb-6">
              Boredom is not the enemy it's the gateway to creativity and deep thinking. Most people can't tolerate 30 seconds of boredom without reaching for stimulation.
            </p>

            <p className="text-foreground mb-6">
              <strong>The exercise:</strong> Sit quietly for 5 minutes daily without any stimulation. No phone, no music, no book. Just you and your thoughts.
            </p>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">The 30-Day Digital Detox Challenge</h3>
              <div className="space-y-3 text-foreground">
                <p><strong>Week 1:</strong> Remove all non-essential apps from your phone</p>
                <p><strong>Week 2:</strong> Implement device-free meals and bedrooms</p>
                <p><strong>Week 3:</strong> Practice 20-minute focused work sessions without digital interruption</p>
                <p><strong>Week 4:</strong> Add daily boredom tolerance training</p>
              </div>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Analog Renaissance: Rediscovering Deep Work</h2>
            
            <p className="text-foreground mb-4">
              The most successful people I study have one thing in common: they've mastered the ability to do deep, focused work without digital interruption.
            </p>

            <p className="text-foreground mb-4">
              <strong>Deep work defined:</strong> Cognitively demanding activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit.
            </p>

            <p className="text-foreground mb-6">
              <strong>The competitive advantage:</strong> In our hyperconnected world, the ability to focus without distraction is becoming a superpower. It's the new literacy.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Technology as a Tool, Not a Master</h2>
            
            <p className="text-foreground mb-4">
              I'm not anti-technology I'm pro-intentional technology use. The goal isn't to return to the stone age, but to use digital tools deliberately rather than being used by them.
            </p>

            <p className="text-foreground mb-4">
              <strong>The mindset shift:</strong> From "How can I optimize my life with technology?" to "How can I optimize technology to serve my life?"
            </p>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Healthy Tech Use Guidelines</h3>
              <ul className="list-disc list-inside text-foreground space-y-2">
                <li><strong>Purpose-driven:</strong> Use technology for specific goals, not entertainment</li>
                <li><strong>Time-bounded:</strong> Set clear start and stop times</li>
                <li><strong>Environment-specific:</strong> Designate where and when devices are appropriate</li>
                <li><strong>Attention-protective:</strong> Prioritize your ability to focus over digital convenience</li>
              </ul>
            </Card>

            <h2 className="text-2xl font-bold text-foreground mb-4">The Neuroplasticity Advantage</h2>
            
            <p className="text-foreground mb-4">
              Here's the encouraging news: participants in my digital detox studies show measurable brain changes within just 2-3 weeks:
            </p>

            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>Increased gray matter in attention-control regions</li>
              <li>Improved working memory capacity</li>
              <li>Enhanced creativity scores</li>
              <li>Better emotional regulation</li>
              <li>Increased life satisfaction</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">Your Cognitive Liberation Starts Now</h2>
            
            <p className="text-foreground mb-4">
              The choice is yours: continue letting technology fragment your attention and diminish your cognitive potential, or reclaim your brain and unlock the deep thinking that makes us uniquely human.
            </p>

            <p className="text-foreground mb-6">
              Start small. Pick one element of the RESET protocol and implement it for a week. Your future self the one with the restored attention span and creative thinking will thank you.
            </p>

            <Card className="p-6">
              <p className="text-foreground mb-4">
                <strong>Ready to test your cognitive resilience?</strong>
              </p>
              <p className="text-foreground mb-4">
                Measure your attention span and track how digital detox affects your cognitive performance with our scientifically-designed assessments.
              </p>
              <Button onClick={() => navigate("/?view=home")} className="w-full">
                Start Your Cognitive Assessment
              </Button>
            </Card>
          </article>
        </main>
      </div>
    </div>;
};
export default BlogDigitalWellness;