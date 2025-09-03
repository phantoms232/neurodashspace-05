import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TestCard } from "./TestCard";
import { SubscriptionModal } from "./SubscriptionModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { Timer, Target, Hash, Type, Eye, Users, Keyboard, Heart, Volume2, Shuffle, Zap, Brain, GitBranch, Lightbulb, Crown, Settings, Compass } from "lucide-react";
interface TestCategoriesProps {
  onTestSelect: (testId: string) => void;
}
export const TestCategories = ({
  onTestSelect
}: TestCategoriesProps) => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    subscribed,
    subscriptionTier,
    openCustomerPortal
  } = useSubscription();
  const handleUniqueTestSelect = (testId: string) => {
    if (!user) {
      setShowSubscriptionModal(true);
      return;
    }
    if (!subscribed) {
      setShowSubscriptionModal(true);
      return;
    }
    onTestSelect(testId);
  };
  const coreTests = [{
    id: "reaction-time",
    title: "Reaction Time",
    description: "Test your reflexes and response speed to visual stimuli",
    icon: Timer,
    difficulty: "Easy" as const
  }, {
    id: "aim-trainer",
    title: "Aim Trainer",
    description: "Improve your mouse precision and clicking accuracy",
    icon: Target,
    difficulty: "Medium" as const
  }, {
    id: "number-memory",
    title: "Number Memory",
    description: "Remember and recall sequences of numbers",
    icon: Hash,
    difficulty: "Medium" as const
  }, {
    id: "verbal-memory",
    title: "Verbal Memory",
    description: "Test your ability to remember words and avoid repetition",
    icon: Type,
    difficulty: "Hard" as const
  }, {
    id: "visual-memory",
    title: "Visual Memory",
    description: "Remember patterns and spatial arrangements",
    icon: Eye,
    difficulty: "Medium" as const
  }, {
    id: "chimp-test",
    title: "Chimp Test",
    description: "Remember number sequences like a chimpanzee",
    icon: Users,
    difficulty: "Hard" as const
  }, {
    id: "typing-speed",
    title: "Typing Speed",
    description: "Test your words per minute and typing accuracy",
    icon: Keyboard,
    difficulty: "Easy" as const
  }, {
    id: "sequence-memory",
    title: "Sequence Memory",
    description: "Watch and repeat color sequences",
    icon: Shuffle,
    difficulty: "Medium" as const
  }];
  const uniqueTests = [{
    id: "emotion-recognition",
    title: "Emotion Recognition",
    description: "Identify emotions from facial expressions and body language",
    icon: Heart,
    difficulty: "Medium" as const,
    isNew: true
  }, {
    id: "audio-memory",
    title: "Audio Memory",
    description: "Match and sequence tones, beats, or spoken words",
    icon: Volume2,
    difficulty: "Medium" as const,
    isNew: true
  }, {
    id: "pattern-shift",
    title: "Pattern Shift",
    description: "Spot pattern anomalies and changes in real-time",
    icon: Shuffle,
    difficulty: "Hard" as const,
    isNew: true
  }, {
    id: "distraction-control",
    title: "Distraction Control",
    description: "Solve tasks while being distracted by noise and motion",
    icon: Zap,
    difficulty: "Hard" as const,
    isNew: true
  }, {
    id: "logic-sprint",
    title: "Logic Sprint",
    description: "Timed logic puzzles and pattern recognition challenges",
    icon: Brain,
    difficulty: "Medium" as const,
    isNew: true
  }, {
    id: "multi-tasker",
    title: "Multi-Tasker",
    description: "Juggle 2-3 mini tasks simultaneously on screen",
    icon: GitBranch,
    difficulty: "Hard" as const,
    isNew: true
  }, {
    id: "spatial-reasoning",
    title: "Spatial Reasoning & Prediction",
    description: "Predict the target's location from patterned visual cues",
    icon: Compass,
    difficulty: "Medium" as const,
    isNew: true
  }];
  return <div className="space-y-8">
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gradient mb-2">
            🧪 Core Tests
          </h2>
          <p className="text-muted-foreground">
            Essential cognitive tests to measure your mental performance
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coreTests.map(test => <TestCard key={test.id} title={test.title} description={test.description} icon={test.icon} difficulty={test.difficulty} onClick={() => onTestSelect(test.id)} />)}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gradient">
                🧠 New & Unique Tests
              </h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Innovative cognitive challenges you won't find elsewhere
            </p>
          </div>
          
          {user && subscribed && <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✓ {subscriptionTier} Subscriber
              </Badge>
              <Button variant="outline" size="sm" onClick={openCustomerPortal} className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Plan
              </Button>
            </div>}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {uniqueTests.map(test => <TestCard key={test.id} title={test.title} description={test.description} icon={test.icon} difficulty={test.difficulty} isNew={test.isNew} onClick={() => handleUniqueTestSelect(test.id)} />)}
        </div>

        {!user && <div className="mt-6 p-6 rounded-lg border border-primary/20 bg-primary/5 text-center">
            <Crown className="w-12 h-12 mx-auto text-primary mb-3" />
            <h3 className="text-lg font-semibold mb-2">Unlock Premium Tests</h3>
            <div className="mb-4">
              <div className="text-2xl font-bold text-gradient mb-1">$2.10/week</div>
              
            </div>
            <p className="text-muted-foreground mb-4">
              Get access to 7 unique cognitive challenges + advanced features
            </p>
            <Button variant="neural" onClick={() => setShowSubscriptionModal(true)}>Start Now</Button>
          </div>}

        {user && !subscribed && <div className="mt-6 p-6 rounded-lg border border-primary/20 bg-primary/5 text-center">
            <Crown className="w-12 h-12 mx-auto text-primary mb-3" />
            <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
            <div className="mb-4">
              <div className="text-2xl font-bold text-gradient mb-1">$2.10/week</div>
              <p className="text-sm text-muted-foreground">Cancel anytime</p>
            </div>
            <p className="text-muted-foreground mb-4">
              Unlock 7 premium tests + advanced analytics & training programs
            </p>
            <Button variant="neural" onClick={() => setShowSubscriptionModal(true)}>
              Subscribe Now
            </Button>
          </div>}
      </section>

      <SubscriptionModal open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal} />
    </div>;
};