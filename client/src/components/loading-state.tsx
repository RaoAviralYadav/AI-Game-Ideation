import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="overflow-hidden animate-pulse" data-testid={`loading-card-${i}`}>
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-4/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-accent/10 border border-accent/20">
          <Loader2 className="w-5 h-5 text-accent animate-spin" />
          <span className="text-accent font-ui font-medium">
            AI is crafting innovative game concepts with professional screenshots...
          </span>
        </div>
      </div>
    </div>
  );
}
