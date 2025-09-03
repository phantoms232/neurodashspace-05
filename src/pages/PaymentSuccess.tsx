import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeuroDashLogo } from "@/components/NeuroDashLogo";
const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return <div className="min-h-screen neural-grid bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your purchase...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen neural-grid bg-black">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <NeuroDashLogo />
          <Button variant="ghost" onClick={() => navigate("/?view=home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your subscription. You now have access to premium cognitive tests.
            </p>
          </div>

          {sessionId && <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">Transaction ID:</p>
              <code className="text-sm bg-muted px-3 py-1 rounded font-mono">
                {sessionId}
              </code>
            </div>}

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/20">
              <Download className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Access Premium Tests</h3>
              <p className="text-muted-foreground mb-4">
                Your premium cognitive tests are now unlocked. Start testing your mind today!
              </p>
              <Button onClick={() => navigate("/")} className="bg-purple-600 hover:bg-purple-700">
                Start Testing
              </Button>
            </div>

            
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Need help? Contact our support team
            </p>
            <Button variant="link">neurodashspace@gmail.com</Button>
          </div>
        </div>
      </div>
    </div>;
};
export default PaymentSuccess;