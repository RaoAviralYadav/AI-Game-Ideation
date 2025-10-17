import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">
            Generation Failed
          </h3>
          
          <p className="text-muted-foreground mb-6" data-testid="text-error-message">
            {error}
          </p>
          
          <Button 
            onClick={onRetry} 
            variant="outline"
            className="font-ui"
            data-testid="button-retry"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
