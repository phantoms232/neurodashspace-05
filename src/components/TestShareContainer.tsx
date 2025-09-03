import { ShareButtons } from "@/components/ShareButtons";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { Card } from "@/components/ui/card";
import { Trophy, Brain } from "lucide-react";
interface TestShareContainerProps {
  testName: string;
  description?: string;
  children: React.ReactNode;
  showShare?: boolean;
}
export const TestShareContainer = ({
  testName,
  description = "Challenge your cognitive abilities with this brain training test!",
  children,
  showShare = true
}: TestShareContainerProps) => {
  const shareMessage = `I just completed the ${testName} test on NeuroDash! 🧠 Think you can beat my score?`;
  return <div className="w-full max-w-4xl mx-auto space-y-6">
      {children}
      {showShare && <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 mx-0 py-[22px] px-[10px] my-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <Trophy className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Ready to challenge your brain?</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
            <ShareButtons variant="minimal" title={`${testName} - NeuroDash Brain Training`} description={shareMessage} />
          </div>
        </Card>}
    </div>;
};