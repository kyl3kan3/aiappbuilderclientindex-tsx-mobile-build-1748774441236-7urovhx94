import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/hooks/useAppState";
import StepIndicator from "@/components/StepIndicator";
import { 
  Code, 
  Download, 
  Smartphone, 
  ArrowLeft, 
  CheckCircle, 
  Loader2,
  FileCode,
  Package
} from "lucide-react";

export default function Generate() {
  const navigate = useNavigate();
  const { appState } = useAppState();
  const [generationStep, setGenerationStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { id: 1, name: "Requirements", status: "complete" as const },
    { id: 2, name: "App Design", status: "complete" as const },
    { id: 3, name: "Code Generation", status: "current" as const },
    { id: 4, name: "Finalize", status: "upcoming" as const },
  ];

  const generationSteps = [
    { name: "Analyzing Requirements", icon: Code, completed: generationStep > 0 },
    { name: "Creating App Structure", icon: Package, completed: generationStep > 1 },
    { name: "Generating UI Components", icon: Smartphone, completed: generationStep > 2 },
    { name: "Building Native Code", icon: FileCode, completed: generationStep > 3 },
    { name: "Package Assembly", icon: Download, completed: generationStep > 4 },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Step 1: Analyzing Requirements
      setGenerationStep(1);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 2: Creating App Structure
      setGenerationStep(2);
      
      // Call production API to generate real code
      const response = await fetch('/api/generate-production-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appName: appState.appName,
          appDescription: appState.appDescription,
          appType: appState.appType,
          features: appState.features,
          platforms: appState.platforms,
          designTemplate: appState.designTemplate
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate app');
      }
      
      const result = await response.json();
      
      // Step 3: Generating UI Components
      setGenerationStep(3);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 4: Building Native Code
      setGenerationStep(4);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 5: Package Assembly
      setGenerationStep(5);
      
      // Store the generated project data
      sessionStorage.setItem('generatedProject', JSON.stringify(result));
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate app. Please try again.');
      setGenerationStep(0);
    }
    
    setIsGenerating(false);
  };

  const platforms = appState.platforms || ["ios", "android"];
  const progressPercentage = (generationStep / 5) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Workflow Progress */}
      <StepIndicator steps={steps} currentStep={3} />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Generate Your App</h1>
          <p className="text-lg text-gray-600">
            Creating native code for "{appState.appName || 'your app'}"
          </p>
        </div>

        {/* App Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>App Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">App Details</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Name:</strong> {appState.appName || "FitTrack Pro"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Type:</strong> {appState.appType || "Fitness"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Platforms:</strong> {platforms.map(p => p.toUpperCase()).join(", ")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {(appState.features || ["authentication", "tracking", "analytics"]).map((feature) => (
                    <span key={feature} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {feature.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              AI Code Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isGenerating && generationStep === 0 ? (
              <div className="text-center py-8">
                <Code className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-4">Ready to Generate</h3>
                <p className="text-gray-600 mb-6">
                  AI will create complete native apps with your specifications
                </p>
                <Button 
                  onClick={handleGenerate}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                >
                  Start Generation
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {isGenerating ? "Generating..." : "Complete!"}
                    </span>
                    <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Generation Steps */}
                <div className="space-y-3">
                  {generationSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : generationStep === index && isGenerating ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : (
                        <step.icon className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={`${step.completed ? 'text-green-700' : 'text-gray-600'}`}>
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Download Options - Show when complete */}
                {generationStep === 5 && !isGenerating && (
                  <div className="mt-8 p-6 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Generation Complete!
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {platforms.map((platform) => (
                        <div key={platform} className="bg-white p-4 rounded-lg border">
                          <h4 className="font-semibold mb-2 capitalize">{platform} App</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Complete {platform === 'ios' ? 'Xcode' : 'Android Studio'} project
                          </p>
                          <Button className="w-full" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download {platform.toUpperCase()}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/design")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Design
          </Button>
          {generationStep === 5 && !isGenerating && (
            <Button 
              onClick={() => navigate("/finalize")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              Finalize App
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}