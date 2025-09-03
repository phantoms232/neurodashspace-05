import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
interface TestCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty?: "Easy" | "Medium" | "Hard";
  isNew?: boolean;
  onClick?: () => void;
  className?: string;
}
export const TestCard = ({
  title,
  description,
  icon: Icon,
  difficulty = "Medium",
  isNew = false,
  onClick,
  className
}: TestCardProps) => {
  const difficultyColors = {
    Easy: "text-success",
    Medium: "text-warning",
    Hard: "text-destructive"
  };
  return <Card className={`relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-card via-card to-card/50 border border-primary/20 hover:border-primary/40 ${className || ""}`} onClick={onClick}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-none bg-black" />
      
      {/* Content */}
      <div className="relative p-6 space-y-4 bg-black rounded-none">
        {/* Header with icon and title */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 rounded-xl blur-sm group-hover:opacity-40 transition-opacity" />
            <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/25 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg">
              <Icon className="w-7 h-7 text-primary group-hover:text-primary-glow transition-colors" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                {title}
              </h3>
              {isNew && <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-accent to-primary text-primary-foreground rounded-full shadow-md animate-pulse">
                  NEW
                </span>}
            </div>
            
            <p className="text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-foreground/80 transition-colors">
              {description}
            </p>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
              <span className={`text-sm font-semibold ${difficultyColors[difficulty]}`}>
                {difficulty}
              </span>
            </div>
            <div className="hidden sm:block">
              <ShareButtons title={`Check out the ${title} on NeuroDash!`} description={`${description} Test your cognitive abilities!`} variant="minimal" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="sm:hidden flex-1">
              <ShareButtons title={`Check out the ${title} on NeuroDash!`} description={`${description} Test your cognitive abilities!`} variant="minimal" />
            </div>
            <Button variant="brain" size="sm" className="shrink-0 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent text-primary-foreground font-semibold">
              Start Test
            </Button>
          </div>
        </div>
      </div>
    </Card>;
};