import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, BarChart3, Target, Settings, Trophy, Users, Crown } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
const UserGuide = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen neural-grid bg-stone-800">
      <SEOHead title="User Guide - How to Use NeuroDash Effectively | NeuroDash" description="Complete guide to using NeuroDash brain training platform. Learn how to take tests, track progress, and optimize your cognitive training for best results." keywords="NeuroDash guide, brain training tutorial, cognitive test instructions, how to use NeuroDash, brain training tips" />
      
      {/* Header */}
      <header className="border-b border-border bg-card/80 text-foreground backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/?view=home")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-lg font-semibold text-gradient">User Guide</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Getting Started</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              How to Use NeuroDash
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your complete guide to maximizing your brain training experience and achieving optimal cognitive improvement
            </p>
          </div>

          {/* Quick Start */}
          <Card className="card-neural p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Start Guide</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Get started with NeuroDash in just a few minutes. No sign-up required to begin testing your cognitive abilities.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold text-foreground">Choose a Test</h3>
                <p className="text-sm text-muted-foreground">Browse our test categories and select one that interests you</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold text-foreground">Take the Test</h3>
                <p className="text-sm text-muted-foreground">Follow the instructions and do your best</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold text-foreground">View Results</h3>
                <p className="text-sm text-muted-foreground">See your score and compare with others</p>
              </div>
            </div>
          </Card>

          {/* Test Categories */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gradient">Understanding Test Categories</h2>
            
            <Card className="card-neural p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Core Tests (Free)</h3>
                  <p className="text-muted-foreground mb-4">
                    Essential cognitive assessments available to all users. Perfect for establishing baseline abilities and regular training.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Speed & Reaction</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Reaction Time Test</li>
                        <li>• Typing Speed Test</li>
                        <li>• Aim Trainer Test</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Memory & Cognition</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Number Memory Test</li>
                        <li>• Visual Memory Test</li>
                        <li>• Chimp Test</li>
                        <li>• Verbal Memory Test</li>
                        <li>• Sequence Memory Test</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="card-neural p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Premium Tests</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced cognitive challenges designed to push your abilities further. Unlock with premium subscription.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Advanced Cognition</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Emotion Recognition Test</li>
                        <li>• Audio Memory Test</li>
                        <li>• Pattern Shift Test</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Executive Function</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Distraction Control Test</li>
                        <li>• Logic Sprint Test</li>
                        <li>• Multi-Tasker Test</li>
                        <li>• Intuition Guess Test</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Test Taking Tips */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gradient">Test Taking Tips</h2>
            
            <Card className="card-neural p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Before You Start</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Environment Setup</h4>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Find a quiet, distraction-free space</li>
                    <li>• Use a computer or tablet for best results</li>
                    <li>• Ensure stable internet connection</li>
                    <li>• Close unnecessary browser tabs</li>
                    <li>• Adjust screen brightness for comfort</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Mental Preparation</h4>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Take the test when you're alert</li>
                    <li>• Avoid testing when tired or stressed</li>
                    <li>• Stay hydrated and well-rested</li>
                    <li>• Do a brief warm-up (practice test)</li>
                    <li>• Set aside adequate time (10-15 minutes)</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="card-neural p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">During the Test</h3>
              <div className="space-y-4">
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Stay Focused</h4>
                  <p className="text-muted-foreground">
                    Maintain concentration throughout the test. Avoid checking your phone or other distractions.
                  </p>
                </div>
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Follow Instructions</h4>
                  <p className="text-muted-foreground">
                    Read all instructions carefully before starting. Each test has specific requirements for optimal performance.
                  </p>
                </div>
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Do Your Best</h4>
                  <p className="text-muted-foreground">
                    Try your hardest but don't stress about perfection. The test adapts to your ability level.
                  </p>
                </div>
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Stay Calm</h4>
                  <p className="text-muted-foreground">
                    If you make mistakes, don't worry. The scoring system accounts for natural variation in performance.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Understanding Results */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gradient">Understanding Your Results</h2>
            
            <Card className="card-neural p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Score Interpretation</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Raw Score</h4>
                      <p className="text-muted-foreground">
                        Your actual performance (reaction time in ms, memory span, accuracy percentage, etc.)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Percentile Ranking</h4>
                      <p className="text-muted-foreground">
                        How you compare to other users. 50th percentile means you scored better than 50% of test-takers.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Performance Level</h4>
                      <p className="text-muted-foreground">
                        Qualitative assessment ranging from "Needs Practice" to "Exceptional" based on your percentile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="card-neural p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Score Ranges Guide</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="font-medium text-foreground">Needs Practice (0-25th percentile)</span>
                  <span className="text-red-400">Room for improvement</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <span className="font-medium text-foreground">Below Average (25-40th percentile)</span>
                  <span className="text-yellow-400">Keep training</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <span className="font-medium text-foreground">Average (40-60th percentile)</span>
                  <span className="text-blue-400">Normal range</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="font-medium text-foreground">Above Average (60-80th percentile)</span>
                  <span className="text-green-400">Good performance</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <span className="font-medium text-foreground">Excellent (80-95th percentile)</span>
                  <span className="text-purple-400">Great job!</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                  <span className="font-medium text-foreground">Exceptional (95-100th percentile)</span>
                  <span className="text-yellow-400">Outstanding!</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Progress Tracking */}
          <Card className="card-neural p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-3">Tracking Your Progress</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Regular testing helps track improvement over time. We recommend:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Testing Frequency</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Daily: Quick tests (5-10 minutes)</li>
                        <li>• Weekly: Comprehensive assessment</li>
                        <li>• Monthly: Full cognitive profile</li>
                        <li>• Track trends, not daily fluctuations</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Improvement Tips</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Focus on consistent practice</li>
                        <li>• Vary your test selection</li>
                        <li>• Challenge yourself with harder tests</li>
                        <li>• Maintain healthy lifestyle habits</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Benefits */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gradient">Account Benefits</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-neural p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3">Free Account</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• Save your test results</li>
                      <li>• Track progress over time</li>
                      <li>• Access to all core tests</li>
                      <li>• Global leaderboards</li>
                      <li>• Basic performance analytics</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="card-neural p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3">Premium Account</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• All free features included</li>
                      <li>• Access to premium tests</li>
                      <li>• Advanced analytics & insights</li>
                      <li>• Personalized training programs</li>
                      <li>• Detailed performance reports</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Troubleshooting */}
          <Card className="card-neural p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Common Issues</h4>
                <div className="space-y-2">
                  <details className="bg-muted/20 p-3 rounded-lg">
                    <summary className="font-medium text-foreground cursor-pointer">Test not loading or freezing</summary>
                    <p className="text-muted-foreground mt-2">
                      Refresh the page, check your internet connection, and ensure your browser is up to date. Try disabling browser extensions temporarily.
                    </p>
                  </details>
                  <details className="bg-muted/20 p-3 rounded-lg">
                    <summary className="font-medium text-foreground cursor-pointer">Results seem inaccurate</summary>
                    <p className="text-muted-foreground mt-2">
                      Ensure you're in a quiet environment and following instructions carefully. Results can vary based on factors like fatigue, stress, and distractions.
                    </p>
                  </details>
                  <details className="bg-muted/20 p-3 rounded-lg">
                    <summary className="font-medium text-foreground cursor-pointer">Progress not saving</summary>
                    <p className="text-muted-foreground mt-2">
                      Make sure you're logged in to your account. Check that cookies are enabled and you have a stable internet connection.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </Card>

          {/* Conclusion */}
          <Card className="card-neural p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start Training?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Now that you know how to use NeuroDash effectively, it's time to begin your cognitive training journey. Remember, consistency is key to improvement!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="neural" size="lg" onClick={() => navigate("/?view=tests")}>
                Start Testing Now
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
                Create Account
              </Button>
            </div>
          </Card>
        </article>
      </main>
    </div>;
};
export default UserGuide;