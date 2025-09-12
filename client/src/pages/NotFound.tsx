import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" data-testid="page-not-found">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8 space-y-6">
          <div className="text-8xl font-bold text-muted-foreground/50" data-testid="text-error-code">
            404
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold" data-testid="text-error-title">
              Page Not Found
            </h1>
            <p className="text-muted-foreground" data-testid="text-error-description">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild data-testid="button-go-home">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} data-testid="button-go-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}