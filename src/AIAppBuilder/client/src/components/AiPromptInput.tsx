import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useAppState } from "@/hooks/useAppState";

interface PromptAnalysisResponse {
  appName: string;
  appDescription: string;
  appType: string;
  features: string[];
  platforms: string[];
}

export default function AiPromptInput() {
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
      // First analyze the prompt to get app details
      const response = await apiRequest<PromptAnalysisResponse>("POST", "/api/ai/analyze-prompt", { prompt });
      
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
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the text input change
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Describe Your App Idea</h2>
      <p className="text-gray-600 mb-4">Our AI will understand your requirements and create a native app for you.</p>
      
      <input 
        type="text"
        value={prompt} 
        onChange={handleInputChange}
        placeholder="Describe your app idea in detail..."
        className="w-full px-3 py-2 text-gray-800 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      
      <Button 
        className="w-full flex items-center justify-center gap-2" 
        onClick={handleGenerateApp}
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating Your App...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate My App
          </>
        )}
      </Button>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Our AI will extract your app type, features, and platforms, then generate the code.</p>
      </div>
    </div>
  );
}