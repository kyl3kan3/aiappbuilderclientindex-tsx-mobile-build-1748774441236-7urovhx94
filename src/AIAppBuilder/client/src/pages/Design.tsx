import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/hooks/useAppState";
import StepIndicator from "@/components/StepIndicator";
import { Palette, Layout, Smartphone, ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function Design() {
  const navigate = useNavigate();
  const { appState, updateAppState } = useAppState();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const steps = [
    { id: 1, name: "Requirements", status: "complete" as const },
    { id: 2, name: "App Design", status: "current" as const },
    { id: 3, name: "Code Generation", status: "upcoming" as const },
    { id: 4, name: "Finalize", status: "upcoming" as const },
  ];

  const designTemplates = [
    {
      name: "Modern Minimal",
      description: "Clean, simple design with plenty of white space",
      colors: ["#FFFFFF", "#F8F9FA", "#007AFF", "#333333"],
      icon: Layout
    },
    {
      name: "Bold & Vibrant",
      description: "Eye-catching colors and dynamic layouts",
      colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFFFFF"],
      icon: Palette
    },
    {
      name: "Professional Dark",
      description: "Sleek dark theme for business apps",
      colors: ["#1A1A1A", "#2D2D2D", "#007AFF", "#FFFFFF"],
      icon: Smartphone
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Workflow Progress */}
      <StepIndicator steps={steps} currentStep={2} />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Design Your App</h1>
          <p className="text-lg text-gray-600">
            Choose a design template for "{appState.appName || 'your app'}"
          </p>
        </div>

        {/* Design Templates */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {designTemplates.map((template, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-lg transition-all border-2 relative ${
                selectedTemplate === template.name 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => {
                setSelectedTemplate(template.name);
                // Save the selected template for later use
              }}
            >
              {selectedTemplate === template.name && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <CardHeader className="text-center">
                <template.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex gap-2 justify-center">
                  {template.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* App Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Live App Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              {selectedTemplate ? (
                <div className="max-w-xs mx-auto">
                  {/* Phone Frame */}
                  <div className="bg-black rounded-3xl p-2 shadow-2xl">
                    <div className="bg-white rounded-2xl overflow-hidden" style={{
                      height: '600px',
                      backgroundColor: selectedTemplate === 'Professional Dark' ? '#1A1A1A' : '#FFFFFF'
                    }}>
                      {/* Status Bar */}
                      <div className={`h-8 flex items-center justify-between px-4 text-xs ${
                        selectedTemplate === 'Professional Dark' ? 'text-white' : 'text-black'
                      }`}>
                        <span>9:41</span>
                        <span>●●●●● WiFi 100%</span>
                      </div>
                      
                      {/* App Header */}
                      <div className={`p-4 border-b ${
                        selectedTemplate === 'Professional Dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <h1 className={`text-lg font-bold ${
                          selectedTemplate === 'Professional Dark' ? 'text-white' : 
                          selectedTemplate === 'Bold & Vibrant' ? 'text-purple-600' : 'text-gray-900'
                        }`}>
                          {appState.appName || 'Your App'}
                        </h1>
                      </div>
                      
                      {/* Content Area */}
                      <div className="p-4 space-y-4">
                        {/* Feature Cards */}
                        {[1, 2, 3].map((item) => (
                          <div key={item} className={`p-3 rounded-lg ${
                            selectedTemplate === 'Professional Dark' ? 'bg-gray-800' :
                            selectedTemplate === 'Bold & Vibrant' ? 'bg-gradient-to-r from-pink-50 to-purple-50' :
                            'bg-gray-50'
                          }`}>
                            <div className={`h-3 rounded mb-2 ${
                              selectedTemplate === 'Professional Dark' ? 'bg-gray-600' :
                              selectedTemplate === 'Bold & Vibrant' ? 'bg-gradient-to-r from-pink-400 to-purple-400' :
                              'bg-blue-500'
                            }`} style={{ width: `${80 - item * 10}%` }}></div>
                            <div className={`h-2 rounded ${
                              selectedTemplate === 'Professional Dark' ? 'bg-gray-700' :
                              selectedTemplate === 'Bold & Vibrant' ? 'bg-purple-200' :
                              'bg-gray-200'
                            }`} style={{ width: `${60 + item * 5}%` }}></div>
                          </div>
                        ))}
                        
                        {/* Action Button */}
                        <button className={`w-full py-3 rounded-lg font-semibold ${
                          selectedTemplate === 'Professional Dark' ? 'bg-blue-600 text-white' :
                          selectedTemplate === 'Bold & Vibrant' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Preview of "{selectedTemplate}" theme
                  </p>
                </div>
              ) : (
                <div className="max-w-xs mx-auto text-gray-500">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a design template above to see the live preview</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/requirements")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Requirements
          </Button>
          <Button 
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={!selectedTemplate}
          >
            Generate Code
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}