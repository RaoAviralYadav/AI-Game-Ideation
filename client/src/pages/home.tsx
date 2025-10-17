import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { HeroSection } from "@/components/hero-section";
import { GameIdeaCard } from "@/components/game-idea-card";
import { SourceGamesSection } from "@/components/source-games-section";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { useToast } from "@/hooks/use-toast";
import type { GenerateIdeasResponse, SourceGame } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [generatedIdeas, setGeneratedIdeas] = useState<GenerateIdeasResponse | null>(null);
  const { toast } = useToast();
  
  // Fetch source games
  const { data: sourceGames, isLoading: loadingGames } = useQuery<SourceGame[]>({
    queryKey: ["/api/source-games"],
  });
  
  // Validate generated ideas before accepting
  const validateGeneratedIdeas = (data: GenerateIdeasResponse | null | undefined): boolean => {
    // Ensure we have a valid object with an array of ideas
    if (!data || !Array.isArray(data.ideas) || data.ideas.length === 0) return false;

    return data.ideas.every((idea) => {
      if (!idea || typeof idea !== "object") return false;
      if (!idea.name || typeof idea.name !== "string") return false;

      // Ensure each required field is an array with at least one element
      if (!Array.isArray(idea.coreSetup) || idea.coreSetup.length === 0) return false;
      if (!Array.isArray(idea.rules) || idea.rules.length === 0) return false;
      if (!Array.isArray(idea.objective) || idea.objective.length === 0) return false;
      if (!Array.isArray(idea.challengeSource) || idea.challengeSource.length === 0) return false;
      if (!Array.isArray(idea.innovation) || idea.innovation.length === 0) return false;
      if (!Array.isArray(idea.inspiredFrom) || idea.inspiredFrom.length !== 2) return false;

      return true;
    });
  };

  // Generate ideas mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      // apiRequest returns a fetch Response — parse JSON first
      const res = await apiRequest("POST", "/api/generate-ideas", { numberOfIdeas: 5 });
      const data = (await res.json()) as GenerateIdeasResponse;

      // Validate response structure (defensive)
      if (!validateGeneratedIdeas(data)) {
        throw new Error("Generated ideas are incomplete or malformed");
      }

      return data;
    },
    onSuccess: (data) => {
      setGeneratedIdeas(data);
      toast({
        title: "Success!",
        description: `${data.ideas?.length ?? 0} innovative game idea(s) generated successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleGenerate = () => {
    setGeneratedIdeas(null);
    generateMutation.mutate();
  };
  
  return (
    <div className="min-h-screen">
      <HeroSection 
        onGenerate={handleGenerate}
        isGenerating={generateMutation.isPending}
      />
      
      {/* Generated Ideas Section */}
      {generateMutation.isPending && <LoadingState />}
      
      {generateMutation.isError && (
        <ErrorState 
          error={generateMutation.error.message}
          onRetry={handleGenerate}
        />
      )}
      
      {generatedIdeas && !generateMutation.isPending && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-foreground mb-3">
              Generated Game Ideas
            </h2>
            <p className="text-muted-foreground">
              AI-powered concepts merging mechanics from your source games
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-testid="container-generated-ideas">
            {generatedIdeas.ideas.map((idea, index) => (
              <GameIdeaCard key={idea.id} idea={idea} index={index} />
            ))}
          </div>
        </div>
      )}
      
      {/* Source Games Section */}
      {sourceGames && !loadingGames && (
        <SourceGamesSection games={sourceGames} />
      )}
    </div>
  );
}
