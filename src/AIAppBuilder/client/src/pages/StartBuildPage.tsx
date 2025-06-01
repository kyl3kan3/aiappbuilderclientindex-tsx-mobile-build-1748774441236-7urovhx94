import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Sparkles, 
  Upload, 
  Smartphone, 
  Code, 
  Download,
  FileText,
  Zap
} from "lucide-react";

export function StartBuildPage() {
  const [idea, setIdea] = useState("");
  const [platform, setPlatform] = useState("iOS");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string> | null>(null);

  const handleSubmit = async () => {
    if (!idea.trim()) {
      alert("Please describe your app idea first!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("idea", idea);
      formData.append("platform", platform);
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/build/generate", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      
      if (result.code) {
        setGeneratedCode(result.code);
      } else {
        alert(result.message || "App generated successfully!");
      }
    } catch (error) {
      alert("Failed to generate app. Please try again.");
    }
    setLoading(false);
  };

  const downloadCode = () => {
    if (!generatedCode) return;
    
    const zip = new Blob([JSON.stringify(generatedCode, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(zip);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${platform.toLowerCase()}-app-code.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">AI App Builder</h1>
          </div>
          <p className="text-gray-600">
            Describe your app idea and watch AI transform it into real native code
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Build Your App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="idea">Describe Your App Idea</Label>
                <Textarea
                  id="idea"
                  placeholder="Example: A fitness tracking app with workout plans, progress charts, and social sharing features..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Target Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iOS">📱 iOS (Swift)</SelectItem>
                    <SelectItem value="Android">🤖 Android (Kotlin)</SelectItem>
                    <SelectItem value="React Native">⚛️ React Native</SelectItem>
                    <SelectItem value="Flutter">🦋 Flutter (Dart)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Upload Reference Files (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                    Click to upload wireframes, designs, or documentation
                  </label>
                  {files.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {files.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={loading || !idea.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Your App...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generated Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
                  <h3 className="text-lg font-medium mb-2">AI is crafting your app...</h3>
                  <p className="text-gray-500">This may take a moment</p>
                </div>
              ) : generatedCode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Your {platform} App is Ready!</h3>
                    <Button onClick={downloadCode} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-auto">
                    {Object.entries(generatedCode).map(([filename, code]) => (
                      <div key={filename} className="border rounded-lg">
                        <div className="bg-gray-50 px-3 py-2 border-b">
                          <span className="font-mono text-sm">{filename}</span>
                        </div>
                        <pre className="p-3 text-xs bg-gray-900 text-green-400 overflow-auto">
                          <code>{code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your generated app code will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Example Prompts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Example App Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setIdea("A recipe sharing app where users can upload photos of their dishes, share cooking instructions, and rate other people's recipes. Include search and filtering by ingredients.")}
              >
                <h4 className="font-medium mb-2">🍳 Recipe Sharing App</h4>
                <p className="text-sm text-gray-600">Photo uploads, cooking instructions, ratings system</p>
              </div>
              
              <div 
                className="p-4 border rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                onClick={() => setIdea("A meditation and mindfulness app with guided sessions, progress tracking, mood journal, and calming background sounds. Include daily reminders and achievement badges.")}
              >
                <h4 className="font-medium mb-2">🧘 Meditation App</h4>
                <p className="text-sm text-gray-600">Guided sessions, mood tracking, progress badges</p>
              </div>
              
              <div 
                className="p-4 border rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
                onClick={() => setIdea("A plant care companion app that helps users track watering schedules, identify plant diseases from photos, and get personalized care tips based on plant species and local weather.")}
              >
                <h4 className="font-medium mb-2">🌱 Plant Care App</h4>
                <p className="text-sm text-gray-600">Care schedules, plant identification, weather integration</p>
              </div>
              
              <div 
                className="p-4 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors"
                onClick={() => setIdea("A local events discovery app that shows nearby concerts, workshops, and community gatherings. Include ticket booking, event creation, and social features to connect with other attendees.")}
              >
                <h4 className="font-medium mb-2">🎉 Events Discovery</h4>
                <p className="text-sm text-gray-600">Location-based events, ticketing, social features</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}