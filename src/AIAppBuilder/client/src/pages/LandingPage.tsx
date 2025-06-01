import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Zap, Code, Rocket } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Smartphone,
      title: "Native Apps",
      description: "Generate real iOS and Android apps, not just web wrappers"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "From idea to app store in minutes, not months"
    },
    {
      icon: Code,
      title: "No Code Required",
      description: "Describe your app in plain English, AI does the coding"
    },
    {
      icon: Rocket,
      title: "Deploy Instantly",
      description: "Direct deployment to TestFlight and Google Play"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            AI App Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Describe your app and let AI build, preview, and deploy it for you.
            No coding experience required — just share your vision and watch it become reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/build")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start New App
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-blue-200 hover:bg-blue-50 px-8 py-4 text-lg rounded-xl"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">10K+</div>
              <div className="text-gray-600">Apps Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">5 Min</div>
              <div className="text-gray-600">Average Build Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Advanced Tools Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Control?</h2>
          <p className="text-lg text-gray-600 mb-8">Access advanced development tools for power users</p>
          
          <details className="max-w-4xl mx-auto">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium mb-6">
              Show Advanced Development Tools
            </summary>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Button 
                onClick={() => navigate("/editor")}
                variant="outline"
                className="px-4 py-3 text-base rounded-xl border-2 hover:bg-purple-50"
              >
                🎨 Visual Designer
              </Button>
              
              <Button 
                onClick={() => navigate("/code")}
                variant="outline"
                className="px-4 py-3 text-base rounded-xl border-2 hover:bg-green-50"
              >
                💻 Live Coding
              </Button>
              
              <Button 
                onClick={() => navigate("/models")}
                variant="outline"
                className="px-4 py-3 text-base rounded-xl border-2 hover:bg-orange-50"
              >
                📊 Data Models
              </Button>
              
              <Button 
                onClick={() => navigate("/deploy")}
                variant="outline"
                className="px-4 py-3 text-base rounded-xl border-2 hover:bg-gray-50"
              >
                🚀 Deploy Only
              </Button>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}