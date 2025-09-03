import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Crown } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

export default function PremiumReports() {
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!subscribed) {
      navigate("/");
      return;
    }
  }, [user, subscribed, navigate]);

  if (!user || !subscribed) {
    return null;
  }

  return (
    <>
      <SEOHead 
        title="Premium Reports - NeuroDash"
        description="Detailed cognitive assessment reports and professional insights"
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <Crown className="w-6 h-6 text-yellow-500" />
              </div>
              <h1 className="text-4xl font-bold text-gradient mb-4">
                Premium Reports
              </h1>
              <p className="text-xl text-muted-foreground">
                Detailed cognitive assessment reports and professional insights
              </p>
            </div>

            <Card className="p-8 text-center">
              <Download className="w-16 h-16 mx-auto text-primary mb-6" />
              <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                We're creating comprehensive reporting features including:
              </p>
              <div className="grid gap-4 md:grid-cols-2 text-left mb-8">
                <div className="space-y-2">
                  <h3 className="font-semibold">Professional Reports</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• PDF cognitive assessments</li>
                    <li>• Detailed performance analysis</li>
                    <li>• Professional recommendations</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Export Options</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Data export to Excel</li>
                    <li>• Share with healthcare providers</li>
                    <li>• Historical trend reports</li>
                  </ul>
                </div>
              </div>
              <Button onClick={() => navigate("/")} variant="neural">
                Back to Tests
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}