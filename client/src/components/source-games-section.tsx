import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SourceGame } from "@shared/schema";
import { Gamepad2 } from "lucide-react";

interface SourceGamesSectionProps {
  games: SourceGame[];
}

export function SourceGamesSection({ games }: SourceGamesSectionProps) {
  return (
    <div className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Gamepad2 className="w-4 h-4 text-accent" />
            <span className="text-sm font-ui font-medium text-accent">Source Material</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-3">
            7 Source Games
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI intelligently merges mechanics from these mobile puzzle games to create innovative concepts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <Card key={game.id} className="hover-elevate" data-testid={`card-source-game-${index}`}>
              <CardHeader className="space-y-2 pb-4">
                <CardTitle className="font-ui text-lg text-foreground">
                  {game.name}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs font-sans">
                    {game.developer}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={game.constraintType === "Time-based" ? "bg-primary/10 text-primary border-primary/20" : "bg-accent/10 text-accent border-accent/20"}
                  >
                    {game.constraintType}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={game.screenshotUrl} 
                    alt={`${game.name} screenshot`}
                    className="w-full h-full object-cover"
                    data-testid={`img-source-${index}`}
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Template:</span>
                    <span className="ml-2 text-card-foreground">{game.templateType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 text-card-foreground">{game.puzzleCategory}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
