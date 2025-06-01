import React from "react";
import { MessageSquare, Wand2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function FeatureHighlights() {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Describe Your App",
      description: "Simply tell us what you want to build. Our AI understands natural language requirements and turns them into specifications.",
      bgColor: "bg-primary-100",
      textColor: "text-primary"
    },
    {
      icon: <Wand2 className="h-6 w-6" />,
      title: "AI Generation",
      description: "Our AI engine analyzes your requirements and generates real, production-ready code for both iOS and Android platforms.",
      bgColor: "bg-accent-100",
      textColor: "text-accent"
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Deploy & Publish",
      description: "Get ready-to-submit app builds for both App Store and Play Store, with all the necessary configurations.",
      bgColor: "bg-secondary-100",
      textColor: "text-secondary-600"
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How AppCraft AI Works</h2>
          <p className="text-lg text-gray-600">Our AI-powered platform transforms your ideas into fully functional native mobile apps in minutes, not months.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center ${feature.textColor} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/requirements">
            <Button size="lg" className="px-6 py-6 h-auto">
              Start Building Your App <Rocket className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
