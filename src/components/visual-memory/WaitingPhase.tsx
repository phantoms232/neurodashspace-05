import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Play } from "lucide-react";

interface WaitingPhaseProps {
  onStart: () => void;
}

export const WaitingPhase = ({ onStart }: WaitingPhaseProps) => {
  return (
    <Card className="text-center space-y-4 p-8 bg-black">
      <Eye className="w-12 h-12 mx-auto text-primary" />
      <h3 className="text-xl font-semibold">Ready to test your visual memory?</h3>
      <p className="text-muted-foreground">
        Watch the pattern, then click the squares that were highlighted.
      </p>
      <Button variant="neural" size="lg" onClick={onStart}>
        <Play className="w-5 h-5" />
        Start Level 1
      </Button>
    </Card>
  );
};