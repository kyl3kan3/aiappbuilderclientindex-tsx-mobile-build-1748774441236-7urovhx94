import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/useAppState";
import StepIndicator from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { codeExamples } from "@/lib/codeExamples";
import { apiRequest } from "@/lib/queryClient";
import { CodeSnippetShare } from "@/components/CodeSnippetShare";
import { CollaborativeCodeEditor } from "@/components/CollaborativeCodeEditor";
import { usePreferences } from "@/lib/usePreferences";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  Clock,
  Maximize,
  Download,
  FileCode,
  Star,
  Layers,
  Code,
} from "lucide-react";

export default function CodeGeneration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { appState, updateAppState } = useAppState();
  const [generating, setGenerating] = useState(true);
  const [codeGenProgress, setCodeGenProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("code");
  const [aiGeneratedCode, setAiGeneratedCode] = useState({
    swift: "",
    kotlin: ""
  });
  
  // Track generation steps
  const [genSteps, setGenSteps] = useState([
    { id: 'requirements', name: 'Analyzing Requirements', status: 'complete' },
    { id: 'ui', name: 'Generating UI Components', status: 'inProgress' },
    { id: 'backend', name: 'Building Back-End', status: 'queued' },
  ]);
  
  const steps = [
    { id: 1, name: "Requirements", status: "complete" as const },
    { id: 2, name: "App Design", status: "complete" as const },
    { id: 3, name: "Code Generation", status: "current" as const },
    { id: 4, name: "Finalize", status: "upcoming" as const },
  ];

  const logEntries = [
    { time: "12:45:32", message: "Analyzing app requirements..." },
    { time: "12:45:35", message: "Processing fitness app template..." },
    { time: "12:45:38", message: "✓ Requirements analysis completed" },
    { time: "12:45:40", message: "Generating React Native components..." },
    { time: "12:45:45", message: "Creating authentication screens..." },
    { time: "12:45:48", message: "✓ Authentication screens completed" },
    { time: "12:45:50", message: "Building workout tracking interface..." },
    { time: "12:45:55", message: "Implementing progress analytics views..." },
  ];

  useEffect(() => {
    // If no app name is set, redirect to requirements
    if (!appState.appName || !appState.mockupGenerated) {
      toast({
        title: "Missing app configuration",
        description: "Please complete the previous steps first.",
        variant: "destructive",
      });
      navigate("/requirements");
      return;
    }
    
    // Real AI code generation
    const generateCode = async () => {
      try {
        setCodeGenProgress(10);
        
        // Complete UI components step first
        setTimeout(() => {
          setGenSteps(prevSteps => 
            prevSteps.map(step => 
              step.id === 'ui' 
                ? { ...step, status: 'complete' } 
                : step.id === 'backend' 
                  ? { ...step, status: 'inProgress' } 
                  : step
            )
          );
        }, 1500);
        
        // Generate iOS/Swift code
        const iosResponse = await apiRequest("POST", "/api/ai/generate-code", {
          appDetails: {
            appName: appState.appName || "MyApp",
            appDescription: appState.appDescription || "A new mobile application",
            appType: appState.appType || "fitness",
            features: appState.features || ["authentication", "workout_tracking"],
            platforms: appState.platforms || ["ios", "android"]
          },
          platform: "ios"
        });
        
        setCodeGenProgress(50);
        setAiGeneratedCode(prev => ({
          ...prev,
          swift: iosResponse?.code || "// Error generating Swift code"
        }));
        
        // Generate Android/Kotlin code
        const androidResponse = await apiRequest("POST", "/api/ai/generate-code", {
          appDetails: {
            appName: appState.appName || "MyApp",
            appDescription: appState.appDescription || "A new mobile application",
            appType: appState.appType || "fitness",
            features: appState.features || ["authentication", "workout_tracking"],
            platforms: appState.platforms || ["ios", "android"]
          },
          platform: "android"
        });
        
        // Complete backend building step
        setTimeout(() => {
          setGenSteps(prevSteps => 
            prevSteps.map(step => 
              step.id === 'backend' 
                ? { ...step, status: 'complete' } 
                : step
            )
          );
        }, 1000);

        setCodeGenProgress(100);
        setAiGeneratedCode(prev => ({
          ...prev,
          kotlin: androidResponse?.code || "// Error generating Kotlin code"
        }));
        
        setGenerating(false);
        setCompleted(true);
        
        toast({
          title: "Code generated successfully",
          description: "Your native iOS and Android code is ready for download"
        });
      } catch (error) {
        console.error("Error generating code:", error);
        setGenerating(false);
        setCodeGenProgress(0);
        
        toast({
          title: "Error generating code",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive"
        });
      }
    };
    
    // Start code generation
    generateCode();
    
    // Cleanup function
    return () => {};
  }, []);

  const handleContinue = () => {
    updateAppState({ codeGenerated: true });
    navigate("/finalize");
  };

  // Download function for complete app projects
  const downloadCompleteApp = async (content: string, platform: string) => {
    try {
      if (platform === 'ios') {
        // Import the iOS project splitter
        const { downloadSplitIosProject } = await import('@/lib/XcodeProjectSplitter.js');
        
        // Generate a properly split Xcode project
        await downloadSplitIosProject(appState.appName || "MyApp", content);
        
        toast({
          title: "Download started",
          description: "Your iOS project has been downloaded as a complete Xcode project structure - just open in Xcode!",
        });
      } else {
        // Import the Android project splitter
        const { downloadSplitAndroidProject } = await import('@/lib/XcodeProjectSplitter.js');
        
        // Generate a properly split Android Studio project
        await downloadSplitAndroidProject(appState.appName || "MyApp", content);
        
        toast({
          title: "Download started",
          description: "Your Android project has been downloaded as a complete Android Studio project structure - just open in Android Studio!",
        });
      }
      
      console.log(`Download initiated for ${platform} project`);
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback to simple download if the project packaging fails
      try {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = `${appState.appName || "MyApp"}-${platform}.${platform === 'ios' ? 'swift' : 'kt'}`;
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
        
        toast({
          title: "Download started (simple mode)",
          description: `Your ${platform.toUpperCase()} code has been downloaded as a single file.`,
        });
      } catch (fallbackError) {
        toast({
          title: "Download failed",
          description: "There was a problem downloading your project. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Workflow Progress */}
      <StepIndicator steps={steps} currentStep={3} />

      <div className="text-center max-w-2xl mx-auto mb-8 mt-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center">
            <div className={`w-12 h-12 rounded-full ${generating ? 'bg-gradient-to-r from-primary to-accent animate-pulse' : 'bg-green-500'} flex items-center justify-center`}>
              {!generating && <CheckCircle className="h-6 w-6 text-white" />}
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {generating ? "AI is working on your app" : "Code Generation Complete"}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          {generating 
            ? "Our AI is analyzing your requirements and generating code for your native mobile application." 
            : `Your ${appState.appName} app has been successfully generated and is ready for review.`}
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {genSteps.map((step) => (
            <div 
              key={step.id}
              className="flex-1 bg-white rounded-xl shadow-sm p-4 text-left"
            >
              <div className="font-medium text-gray-900 mb-2">{step.name}</div>
              {step.status === 'complete' && (
                <div className="text-green-600 flex items-center text-sm">
                  <CheckCircle className="mr-1 h-4 w-4" /> Completed
                </div>
              )}
              {step.status === 'inProgress' && (
                <div className="text-primary flex items-center text-sm">
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> In Progress {codeGenProgress > 40 && codeGenProgress < 100 ? `(${codeGenProgress}%)` : ''}
                </div>
              )}
              {step.status === 'queued' && (
                <div className="text-gray-400 flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4" /> Queued
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-8">
        <Card>
          <CardContent className="p-0">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Code Generation Log</h3>
              <Button variant="ghost" size="sm">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 h-40 overflow-y-auto font-mono text-sm text-green-400 bg-gray-900">
              {logEntries.map((entry, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">[{entry.time}]</span> {entry.message}
                </div>
              ))}
              {generating && (
                <div className="animate-pulse">
                  <span className="text-gray-500">[12:45:58]</span> Processing code...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {completed && (
        <div className="max-w-3xl mx-auto mb-8">
          <Card>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="code">Generated Code</TabsTrigger>
                  <TabsTrigger value="architecture">Architecture</TabsTrigger>
                  <TabsTrigger value="files">Files & Structure</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="code" className="p-0">
                <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="text-xs h-8">React Native</Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8">Swift</Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8">Kotlin</Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadCompleteApp(
                        aiGeneratedCode.swift || codeExamples.swift,
                        "ios"
                      )}
                    >
                      <Download className="h-4 w-4 mr-1" /> Download iOS App
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadCompleteApp(
                        aiGeneratedCode.kotlin || codeExamples.kotlin,
                        "android"
                      )}
                    >
                      <Download className="h-4 w-4 mr-1" /> Download Android App
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {!generating && (aiGeneratedCode.swift || codeExamples.swift) ? (
                    <CollaborativeCodeEditor
                      code={aiGeneratedCode.swift || codeExamples.swift}
                      language="swift"
                      onCodeChange={(newCode) => setAiGeneratedCode(prev => ({ ...prev, swift: newCode }))}
                    />
                  ) : (
                    <div className="p-4 max-h-80 overflow-y-auto bg-gray-900 text-gray-100 font-mono text-sm">
                      <pre>{generating ? "Generating adaptive code..." : "No code generated yet"}</pre>
                    </div>
                  )}
                  
                  {!generating && (aiGeneratedCode.swift || codeExamples.swift) && (
                    <div className="px-4 pb-4">
                      <CodeSnippetShare
                        code={aiGeneratedCode.swift || codeExamples.swift}
                        language="swift"
                        title={`${appState.appName || 'MyApp'} - iOS App`}
                        platform="iOS"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="architecture" className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Application Architecture</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex gap-3 mb-3">
                        <div className="flex-1 border border-gray-300 p-3 rounded-lg text-center bg-white">
                          <div className="font-medium text-sm mb-1">UI Layer</div>
                          <div className="text-xs text-gray-500">React Native Components</div>
                        </div>
                        <div className="flex-1 border border-gray-300 p-3 rounded-lg text-center bg-white">
                          <div className="font-medium text-sm mb-1">State Management</div>
                          <div className="text-xs text-gray-500">Redux + Hooks</div>
                        </div>
                        <div className="flex-1 border border-gray-300 p-3 rounded-lg text-center bg-white">
                          <div className="font-medium text-sm mb-1">API Layer</div>
                          <div className="text-xs text-gray-500">Firebase SDK</div>
                        </div>
                      </div>
                      <div className="border-t border-gray-300 pt-3 mt-3">
                        <div className="border border-gray-300 p-3 rounded-lg text-center bg-white">
                          <div className="font-medium text-sm mb-1">Cloud Services</div>
                          <div className="text-xs text-gray-500">Authentication, Storage, Functions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Data Flow</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-col gap-2">
                        <div className="border border-gray-300 p-3 rounded-lg bg-white flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">User Actions</div>
                            <div className="text-xs text-gray-500">Interactions, Form Inputs</div>
                          </div>
                          <div className="text-gray-400">
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="border border-gray-300 p-3 rounded-lg bg-white flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">Redux Actions</div>
                            <div className="text-xs text-gray-500">Dispatch State Changes</div>
                          </div>
                          <div className="text-gray-400">
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="border border-gray-300 p-3 rounded-lg bg-white flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">Firebase API</div>
                            <div className="text-xs text-gray-500">Data Persistence, Cloud Functions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Project Structure</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadCompleteApp(
                          aiGeneratedCode.swift || codeExamples.swift,
                          "ios"
                        )}
                      >
                        <Download className="h-4 w-4 mr-1" /> Export iOS Project
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadCompleteApp(
                          aiGeneratedCode.kotlin || codeExamples.kotlin,
                          "android"
                        )}
                      >
                        <Download className="h-4 w-4 mr-1" /> Export Android Project
                      </Button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg">
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <span className="text-sm font-medium">iOS Project</span>
                    </div>
                    <div className="p-3 text-sm font-mono">
                      <div className="pl-5 border-l border-gray-200">
                        <div className="mb-1">📁 {appState.appName || "MyApp"}/</div>
                        <div className="pl-5 border-l border-gray-200">
                          <div className="mb-1">📄 AppDelegate.swift</div>
                          <div className="mb-1">📄 SceneDelegate.swift</div>
                          <div className="mb-1">📁 Views/</div>
                          <div className="pl-5 border-l border-gray-200">
                            <div className="mb-1">📄 HomeView.swift</div>
                            <div className="mb-1">📄 WorkoutView.swift</div>
                            <div className="mb-1">📄 ProfileView.swift</div>
                          </div>
                          <div className="mb-1">📁 Models/</div>
                          <div className="pl-5 border-l border-gray-200">
                            <div className="mb-1">📄 Workout.swift</div>
                            <div className="mb-1">📄 Exercise.swift</div>
                            <div className="mb-1">📄 User.swift</div>
                          </div>
                          <div className="mb-1">📁 Services/</div>
                          <div className="pl-5 border-l border-gray-200">
                            <div className="mb-1">📄 AuthService.swift</div>
                            <div className="mb-1">📄 WorkoutService.swift</div>
                            <div className="mb-1">📄 AnalyticsService.swift</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}

      <div className="max-w-3xl mx-auto flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/design")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Design
        </Button>
        <Button
          disabled={generating || !completed}
          onClick={handleContinue}
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              Continue <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
