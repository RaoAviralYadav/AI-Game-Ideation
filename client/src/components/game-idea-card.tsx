// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Lightbulb, Target, Puzzle, Sparkles } from "lucide-react";
// import type { GeneratedIdea } from "@shared/schema";

// interface GameIdeaCardProps {
//   idea: GeneratedIdea;
//   index: number;
// }

// export function GameIdeaCard({ idea, index }: GameIdeaCardProps) {
//   return (
//     <Card className="overflow-hidden hover-elevate group" data-testid={`card-idea-${index}`}>
//       {/* Screenshot */}
//       {idea.screenshotUrl ? (
//         <div className="relative aspect-video overflow-hidden bg-muted">
//           <img 
//             src={idea.screenshotUrl} 
//             alt={`${idea.name} screenshot`}
//             className="w-full h-full object-cover"
//             data-testid={`img-screenshot-${index}`}
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//         </div>
//       ) : (
//         <div className="aspect-video bg-muted flex items-center justify-center">
//           <div className="text-center text-muted-foreground">
//             <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50 animate-pulse" />
//             <p className="text-sm">Generating screenshot...</p>
//           </div>
//         </div>
//       )}
      
//       <CardHeader className="space-y-3 pb-4">
//         <div className="flex flex-wrap items-start justify-between gap-2">
//           <CardTitle className="font-ui text-2xl text-foreground flex-1" data-testid={`text-game-name-${index}`}>
//             {idea.name}
//           </CardTitle>
//           <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-ui text-xs">
//             Idea {index + 1}
//           </Badge>
//         </div>
        
//         <div className="flex flex-wrap gap-2">
//           <span className="text-sm text-muted-foreground">Inspired from:</span>
//           {idea.inspiredFrom.map((game, i) => (
//             <Badge 
//               key={i} 
//               variant="secondary" 
//               className="font-sans text-xs"
//               data-testid={`badge-source-${index}-${i}`}
//             >
//               {game}
//             </Badge>
//           ))}
//         </div>
//       </CardHeader>
      
//       <CardContent className="space-y-6 pt-0">
//         {/* Core Setup */}
//         <div className="space-y-2">
//           <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
//             <Puzzle className="w-4 h-4" />
//             Core Setup
//           </div>
//           <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
//             {idea.coreSetup.map((item, i) => (
//               <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         {/* Rules */}
//         <div className="space-y-2">
//           <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
//             <Target className="w-4 h-4" />
//             Rules
//           </div>
//           <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
//             {idea.rules.map((item, i) => (
//               <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         {/* Objective */}
//         <div className="space-y-2">
//           <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
//             <Target className="w-4 h-4" />
//             Objective
//           </div>
//           <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
//             {idea.objective.map((item, i) => (
//               <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         {/* Challenge Source */}
//         <div className="space-y-2">
//           <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
//             <Puzzle className="w-4 h-4" />
//             Challenge Source
//           </div>
//           <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
//             {idea.challengeSource.map((item, i) => (
//               <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         {/* Innovation */}
//         <div className="space-y-2">
//           <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
//             <Lightbulb className="w-4 h-4" />
//             Innovation
//           </div>
//           <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
//             {idea.innovation.map((item, i) => (
//               <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, Puzzle, Sparkles } from "lucide-react";
import type { GeneratedIdea } from "@shared/schema";
import { useState } from "react";

interface GameIdeaCardProps {
  idea: GeneratedIdea;
  index: number;
}

export function GameIdeaCard({ idea, index }: GameIdeaCardProps) {
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover-elevate group" data-testid={`card-idea-${index}`}>
        {/* Screenshot */}
        {idea.screenshotUrl ? (
          <div 
            className="relative aspect-video overflow-hidden bg-muted cursor-pointer"
            onClick={() => setShowLightbox(true)}
          >
            <img 
              src={idea.screenshotUrl} 
              alt={`${idea.name} screenshot`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              data-testid={`img-screenshot-${index}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-background/90 px-4 py-2 rounded-lg text-sm font-ui font-medium">
                Click to expand
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50 animate-pulse" />
              <p className="text-sm">Generating screenshot...</p>
            </div>
          </div>
        )}
        
        <CardHeader className="space-y-3 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="font-ui text-2xl text-foreground flex-1" data-testid={`text-game-name-${index}`}>
              {idea.name}
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-ui text-xs">
              Idea {index + 1}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Inspired from:</span>
            {idea.inspiredFrom.map((game, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className="font-sans text-xs"
                data-testid={`badge-source-${index}-${i}`}
              >
                {game}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-0">
          {/* Core Setup */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
              <Puzzle className="w-4 h-4" />
              Core Setup
            </div>
            <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
              {idea.coreSetup.map((item, i) => (
                <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Rules */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
              <Target className="w-4 h-4" />
              Rules
            </div>
            <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
              {idea.rules.map((item, i) => (
                <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Objective */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
              <Target className="w-4 h-4" />
              Objective
            </div>
            <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
              {idea.objective.map((item, i) => (
                <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Challenge Source */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
              <Puzzle className="w-4 h-4" />
              Challenge Source
            </div>
            <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
              {idea.challengeSource.map((item, i) => (
                <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Innovation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-ui font-semibold text-sm">
              <Lightbulb className="w-4 h-4" />
              Innovation
            </div>
            <ul className="space-y-1 text-sm text-card-foreground leading-relaxed">
              {idea.innovation.map((item, i) => (
                <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            <img 
              src={idea.screenshotUrl} 
              alt={`${idea.name} screenshot expanded`}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 bg-background/90 hover:bg-background text-foreground rounded-full p-2 shadow-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}