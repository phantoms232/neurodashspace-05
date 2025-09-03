
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { SubscriptionProvider } from "./hooks/useSubscription";
import { Footer } from "@/components/Footer";
import { InstallAppPrompt } from "@/components/InstallAppPrompt";
import { EmailCapturePopup } from "@/components/EmailCapturePopup";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateGame from "./pages/CreateGame";
import JoinGame from "./pages/JoinGame";
import GameRoom from "./pages/GameRoom";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import PremiumAnalytics from "./pages/PremiumAnalytics";
import PremiumTraining from "./pages/PremiumTraining";
import PremiumReports from "./pages/PremiumReports";

import Blog from "./pages/Blog";
import BlogBrainFog from "./pages/BlogBrainFog";
import BlogScience from "./pages/BlogScience";
import BlogMemoryImprovement from "./pages/BlogMemoryImprovement";
import BlogFocusHabits from "./pages/BlogFocusHabits";
import BlogMentalClarity from "./pages/BlogMentalClarity";
import BlogSleepCognition from "./pages/BlogSleepCognition";
import BlogStressManagement from "./pages/BlogStressManagement";
import BlogNutritionBrain from "./pages/BlogNutritionBrain";
import BlogDigitalWellness from "./pages/BlogDigitalWellness";
import TestMethodology from "./pages/TestMethodology";
import UserGuide from "./pages/UserGuide";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

// Test Pages
import ReactionTimeTestPage from "./pages/ReactionTimeTest";
import AimTrainerTestPage from "./pages/AimTrainerTest";
import NumberMemoryTestPage from "./pages/NumberMemoryTest";
import TypingSpeedTestPage from "./pages/TypingSpeedTest";
import VisualMemoryTestPage from "./pages/VisualMemoryTest";
import ChimpTestPage from "./pages/ChimpTest";
import VerbalMemoryTestPage from "./pages/VerbalMemoryTest";
import EmotionRecognitionTestPage from "./pages/EmotionRecognitionTest";
import AudioMemoryTestPage from "./pages/AudioMemoryTest";
import PatternShiftTestPage from "./pages/PatternShiftTest";
import DistractionControlTestPage from "./pages/DistractionControlTest";
import LogicSprintTestPage from "./pages/LogicSprintTest";
import MultiTaskerTestPage from "./pages/MultiTaskerTest";
import IntuitionGuessTestPage from "./pages/IntuitionGuessTest";
import SequenceMemoryTestPage from "./pages/SequenceMemoryTest";
import SpatialReasoningTestPage from "./pages/SpatialReasoningTest";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

    useLayoutEffect(() => {
      // Ensure top on route change
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Also ensure after any potential re-renders
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();

  // Remove any Omnisend-injected elements/scripts if present
  useEffect(() => {
    const removeOmnisend = () => {
      try {
        document
          .querySelectorAll(
            '#omnisend-dynamic-container, #omnisend-forms-wrapper, [id^="omnisend"], [class^="omnisend"], script[src*="omnisend"]'
          )
          .forEach((el) => el.parentElement?.removeChild(el));
      } catch {}
    };

    removeOmnisend();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const hasOmniId = node.id?.startsWith('omnisend');
            const hasOmniClass = Array.from(node.classList || []).some((c) => c.startsWith('omnisend'));
            if (hasOmniId || hasOmniClass) {
              node.remove();
            }
          }
          if (node instanceof HTMLScriptElement && node.src && node.src.includes('omnisend')) {
            node.remove();
          }
        });
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Ensure browser does not restore previous scroll positions
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // Additional scroll to top on any route change
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  // Check if user is in a test by checking localStorage state
  const isInTest = localStorage.getItem('currentTestActive') === 'true';

  return (
    <>
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create" element={<CreateGame />} />
          <Route path="/join" element={<JoinGame />} />
          <Route path="/game/:roomCode" element={<GameRoom />} />
          <Route path="/premium-analytics" element={<PremiumAnalytics />} />
          <Route path="/premium-training" element={<PremiumTraining />} />
          <Route path="/premium-reports" element={<PremiumReports />} />
          
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/science" element={<BlogScience />} />
          <Route path="/blog/memory-improvement" element={<BlogMemoryImprovement />} />
          <Route path="/blog/brain-fog-2025" element={<BlogBrainFog />} />
          <Route path="/blog/focus-habits" element={<BlogFocusHabits />} />
          <Route path="/blog/mental-clarity" element={<BlogMentalClarity />} />
          <Route path="/blog/sleep-cognition" element={<BlogSleepCognition />} />
          <Route path="/blog/stress-management" element={<BlogStressManagement />} />
          <Route path="/blog/nutrition-brain" element={<BlogNutritionBrain />} />
          <Route path="/blog/digital-wellness" element={<BlogDigitalWellness />} />
          <Route path="/test-methodology" element={<TestMethodology />} />
          <Route path="/user-guide" element={<UserGuide />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          
          {/* Test Routes */}
          <Route path="/reactiontime" element={<ReactionTimeTestPage />} />
          <Route path="/aimtrainer" element={<AimTrainerTestPage />} />
          <Route path="/numbermemory" element={<NumberMemoryTestPage />} />
          <Route path="/typingspeed" element={<TypingSpeedTestPage />} />
          <Route path="/visualmemory" element={<VisualMemoryTestPage />} />
          <Route path="/chimptest" element={<ChimpTestPage />} />
          <Route path="/verbalmemory" element={<VerbalMemoryTestPage />} />
          <Route path="/emotionrecognition" element={<EmotionRecognitionTestPage />} />
          <Route path="/audiomemory" element={<AudioMemoryTestPage />} />
          <Route path="/patternshift" element={<PatternShiftTestPage />} />
          <Route path="/distractioncontrol" element={<DistractionControlTestPage />} />
          <Route path="/logicsprint" element={<LogicSprintTestPage />} />
          <Route path="/multitasker" element={<MultiTaskerTestPage />} />
          <Route path="/intuitionguess" element={<IntuitionGuessTestPage />} />
          <Route path="/sequencememory" element={<SequenceMemoryTestPage />} />
          <Route path="/spatialreasoning" element={<SpatialReasoningTestPage />} />
          
          {/* Static files like ads.txt should be served by the server, not React */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <InstallAppPrompt />
      <EmailCapturePopup isInTest={isInTest} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Toaster />
            <Sonner />
            <AppContent />
          </div>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
