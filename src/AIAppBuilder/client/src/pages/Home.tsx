import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/useAppState";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import FeatureHighlights from "@/components/FeatureHighlights";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Sparkles, Loader2 } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { updateAppState } = useAppState();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateApp = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe your app idea to get started",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Analyze the prompt to get app details
      const response = await apiRequest("POST", "/api/ai/analyze-prompt", { prompt });
      
      if (!response) {
        throw new Error("Failed to analyze prompt");
      }

      // Store the app details in app state
      updateAppState({
        appName: response.appName,
        appDescription: response.appDescription,
        appType: response.appType,
        platforms: response.platforms,
        features: response.features
      });

      // Show success message
      toast({
        title: "App generated successfully!",
        description: `Created ${response.appName}: ${response.appType} app`,
      });

      // Navigate to the requirements page
      navigate("/requirements");
    } catch (error) {
      console.error("Error generating app:", error);
      toast({
        title: "Failed to generate app",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Build Native Mobile Apps with AI
            </h1>
            <p className="text-xl text-gray-600">
              Transform your app ideas into reality without writing code
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md mb-12">
            <h2 className="text-xl font-semibold mb-4">Describe Your App Idea</h2>
            <p className="text-gray-600 mb-6">
              Our AI will understand your requirements and create a native app for you.
            </p>
            
            <div className="space-y-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your app idea in detail..."
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              
              <Button 
                className="w-full" 
                onClick={handleGenerateApp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Your App...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate My App
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link href="/requirements">
              <Button variant="outline" className="gap-2">
                Step-by-Step Process <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <FeatureHighlights />
    </div>
  );
}
