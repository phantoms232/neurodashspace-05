import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Twitter, Facebook, Linkedin, Copy, Heart, Brain, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title?: string;
  description?: string;
  url?: string;
  variant?: "minimal" | "full" | "floating";
  className?: string;
  showTestIcons?: boolean;
}

export const ShareButtons = ({ 
  title = "Check out NeuroDash - Train Your Brain!", 
  description = "I just tested my cognitive abilities on NeuroDash. Challenge yourself with unique brain training tests!",
  url = "https://neurodash.space",
  variant = "minimal",
  className = "",
  showTestIcons = false
}: ShareButtonsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const shareData = {
    title,
    text: description,
    url
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Thanks for sharing! ❤️",
          description: "You're helping others discover brain training!",
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${title} - ${url}`);
      toast({
        title: "Link copied! 📋",
        description: "Ready to paste and share with friends!",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNativeShare}
          className="text-xs px-2 py-1 h-auto text-primary hover:text-primary/80"
        >
          <Heart className="w-3 h-3 mr-1" />
          Share
        </Button>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <div className="flex flex-col gap-2">
          {isExpanded && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); window.open(shareUrls.twitter, '_blank'); }}
                className="shadow-lg bg-card/95 backdrop-blur-sm"
              >
                <Twitter className="w-4 h-4 text-blue-500" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); window.open(shareUrls.facebook, '_blank'); }}
                className="shadow-lg bg-card/95 backdrop-blur-sm"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shadow-lg bg-card/95 backdrop-blur-sm"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Button
            variant="neural"
            size="sm"
            onClick={handleNativeShare}
            className="shadow-lg"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showTestIcons && (
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <Trophy className="w-4 h-4 text-accent" />
            </div>
          )}
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">Ready to challenge your brain?</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); window.open(shareUrls.twitter, '_blank'); }}
            className="text-primary hover:text-primary/80"
          >
            <Twitter className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); window.open(shareUrls.facebook, '_blank'); }}
            className="text-primary hover:text-primary/80"
          >
            <Facebook className="w-4 h-4" />
          </Button>
          <Button
            variant="neural"
            size="sm"
            onClick={handleNativeShare}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
};