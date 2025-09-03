import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Brain, Target, BarChart3, Clock, Eye, Zap } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
const TestMethodology = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen neural-grid bg-stone-800">
      <SEOHead title="Test Methodology - How NeuroDash Tests Work | NeuroDash" description="Learn about the scientific methodology behind NeuroDash cognitive tests. Understand how our brain training tests are designed and validated for optimal cognitive assessment." keywords="cognitive test methodology, brain test validation, neuropsychological assessment, cognitive measurement, test reliability" />
      
      {/* Header */}
      <header className="border-b border-border bg-card/80 text-foreground backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/?view=home")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-lg font-semibold text-gradient">Test Methodology</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Scientific Methodology</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Test Methodology & Design
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understanding the scientific principles and research-based design behind NeuroDash cognitive assessments
            </p>
          </div>

          {/* Overview */}
          <Card className="card-neural p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Scientific Approach</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Every NeuroDash test is designed based on established psychological research and cognitive science principles. Our methodology ensures reliable, valid, and meaningful assessments of cognitive abilities that translate to real-world performance.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Research-Based</h3>
                <p className="text-sm text-muted-foreground">Grounded in peer-reviewed cognitive science</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center mb-3">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Validated</h3>
                <p className="text-sm text-muted-foreground">Tested for reliability and validity</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center mb-3">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Adaptive</h3>
                <p className="text-sm text-muted-foreground">Difficulty adjusts to your ability level</p>
              </div>
            </div>
          </Card>

          {/* Core Tests Methodology */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gradient">Core Test Methodologies</h2>
            
            <Card className="card-neural p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Reaction Time Test</h3>
                  <p className="text-muted-foreground mb-4">
                    Measures simple reaction time - the speed at which you can respond to a visual stimulus. Based on Donders' classical reaction time paradigm.
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Methodology:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Random interval generation (2-5 seconds) to prevent anticipation</li>
                      <li>• Multiple trials (minimum 10) for statistical reliability</li>
                      <li>• Outlier detection and removal for accurate measurement</li>
                      <li>• Millisecond precision timing using high-resolution APIs</li>
                    </ul>
                    <h4 className="font-semibold text-foreground mt-4">Cognitive Domain:</h4>
                    <p className="text-muted-foreground">Processing speed, motor response, attention</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="card-neural p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Number Memory Test</h3>
                  <p className="text-muted-foreground mb-4">
                    Assesses working memory capacity using digit span methodology, similar to the Wechsler Memory Scale.
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Methodology:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Progressive difficulty increase (starting at 3 digits)</li>
                      <li>• Randomized number sequences to prevent memorization</li>
                      <li>• Adaptive termination when performance drops significantly</li>
                      <li>• Standardized presentation timing (1 second per digit)</li>
                    </ul>
                    <h4 className="font-semibold text-foreground mt-4">Cognitive Domain:</h4>
                    <p className="text-muted-foreground">Working memory, attention, short-term memory</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="card-neural p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Visual Memory Test</h3>
                  <p className="text-muted-foreground mb-4">
                    Tests visuospatial working memory using a spatial span task adapted from the Corsi Block Test.
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Methodology:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Grid-based spatial memory assessment</li>
                      <li>• Progressive sequence length increase</li>
                      <li>• Randomized pattern generation</li>
                      <li>• Controlled timing for encoding and recall phases</li>
                    </ul>
                    <h4 className="font-semibold text-foreground mt-4">Cognitive Domain:</h4>
                    <p className="text-muted-foreground">Visuospatial memory, pattern recognition, spatial attention</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="card-neural p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Aim Trainer Test</h3>
                  <p className="text-muted-foreground mb-4">
                    Evaluates hand-eye coordination and fine motor control through precision targeting tasks.
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Methodology:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Random target positioning to prevent pattern learning</li>
                      <li>• Variable target sizes for difficulty scaling</li>
                      <li>• Accuracy and speed dual measurement</li>
                      <li>• Time pressure constraints for performance optimization</li>
                    </ul>
                    <h4 className="font-semibold text-foreground mt-4">Cognitive Domain:</h4>
                    <p className="text-muted-foreground">Motor control, visual attention, hand-eye coordination</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="card-neural p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Chimp Test</h3>
                  <p className="text-muted-foreground mb-4">
                    Based on research by Matsuzawa on chimpanzee numerical cognition, testing rapid number sequence memory.
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Methodology:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Brief exposure followed by masked recall</li>
                      <li>• Progressive sequence length increase</li>
                      <li>• Random positioning to eliminate spatial patterns</li>
                      <li>• Controlled viewing time (typically 650ms)</li>
                    </ul>
                    <h4 className="font-semibold text-foreground mt-4">Cognitive Domain:</h4>
                    <p className="text-muted-foreground">Photographic memory, rapid processing, numerical cognition</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Scoring and Validation */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gradient">Scoring & Validation</h2>
            
            <Card className="card-neural p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Standardized Scoring</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Our scoring system provides meaningful, comparable results across different cognitive domains:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Raw Scores</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Millisecond precision for reaction times</li>
                      <li>• Accuracy percentages for precision tasks</li>
                      <li>• Span lengths for memory tests</li>
                      <li>• Speed metrics (WPM, targets/minute)</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Normalized Scores</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Percentile rankings vs. population</li>
                      <li>• Age-adjusted z-scores</li>
                      <li>• Difficulty-weighted performance</li>
                      <li>• Composite cognitive indices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="card-neural p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Quality Assurance</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Reliability Measures</h4>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Test-retest reliability analysis</li>
                    <li>• Internal consistency evaluation</li>
                    <li>• Cross-platform validation</li>
                    <li>• Performance stability tracking</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Validity Evidence</h4>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Correlation with established tests</li>
                    <li>• Construct validity verification</li>
                    <li>• Predictive validity studies</li>
                    <li>• Convergent validity analysis</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Adaptive System */}
          <Card className="card-neural p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Adaptive Testing System</h2>
            <p className="text-muted-foreground mb-6">
              Our adaptive algorithms ensure optimal challenge levels for accurate assessment and effective training:
            </p>
            <div className="space-y-4">
              <div className="bg-muted/20 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Real-time Difficulty Adjustment</h4>
                <p className="text-muted-foreground">
                  Tests automatically adapt based on your performance, maintaining optimal difficulty for accurate measurement and engagement.
                </p>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Bayesian Estimation</h4>
                <p className="text-muted-foreground">
                  Statistical models continuously update ability estimates, providing more accurate scores with fewer trials.
                </p>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Personalized Progression</h4>
                <p className="text-muted-foreground">
                  Individual learning curves guide training recommendations and difficulty adjustments for optimal improvement.
                </p>
              </div>
            </div>
          </Card>

          {/* Conclusion */}
          <Card className="card-neural p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Experience Science-Based Assessment</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our rigorous methodology ensures that every test provides meaningful insights into your cognitive abilities. Start your assessment journey with confidence in our scientific approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="neural" size="lg" onClick={() => navigate("/?view=tests")}>
                Take Validated Tests
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/blog")}>
                Learn More
              </Button>
            </div>
          </Card>
        </article>
      </main>
    </div>;
};
export default TestMethodology;