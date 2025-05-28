import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
  progress?: number;
}

export function LoadingState({ 
  title = "Processing...", 
  description = "Please wait while we process your request",
  progress 
}: LoadingStateProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-8 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {progress !== undefined && (
        <div className="mt-4 bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
