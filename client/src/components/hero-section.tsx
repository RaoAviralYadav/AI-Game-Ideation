import { Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

export function HeroSection({ onGenerate, isGenerating }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-background to-card">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-ui font-medium text-accent">AI-Powered Game Ideation</span>
        </div>
        
        <h1 className="font-display text-5xl lg:text-7xl font-bold text-foreground mb-4 tracking-tight">
          AI Games
          <span className="block text-primary mt-2">Idea Generator</span>
        </h1>
        
        <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          Intelligently merge mechanics from 7 mobile puzzle games to generate innovative game concepts with professional-quality screenshots
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>7 Source Games</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>AI-Powered Merging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Professional Screenshots</span>
          </div>
        </div>
        
        <Button 
          size="lg"
          onClick={onGenerate}
          disabled={isGenerating}
          className="text-lg px-8 py-6 font-ui font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          data-testid="button-generate-ideas"
        >
          {isGenerating ? (
            <>
              <Zap className="w-5 h-5 mr-2 animate-spin" />
              Generating Ideas...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Generate A Game Idea
            </>
          )}
        </Button>
        
        {isGenerating && (
          <p className="mt-6 text-sm text-accent animate-pulse">
            Creating innovative game concepts with reference-based screenshots...
          </p>
        )}
      </div>
    </div>
  );
}
