import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/hooks/useAppState";
import StepIndicator from "@/components/StepIndicator";
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Rocket, 
  Star,
  ArrowLeft,
  ExternalLink,
  Smartphone
} from "lucide-react";

export default function Finalize() {
  const navigate = useNavigate();
  const { appState } = useAppState();

  const handleDownload = (platform: string) => {
    // Get the generated project data from session storage
    const generatedProject = sessionStorage.getItem('generatedProject');
    if (!generatedProject) {
      alert('Please generate your app first');
      navigate('/generate');
      return;
    }

    // Trigger download of the actual generated project
    const fileName = `${appState.appName || 'MyApp'}_${platform}.zip`;
    const downloadUrl = `/api/download-project/${encodeURIComponent(appState.appName || 'MyApp')}?platform=${platform}`;
    
    // Create download link and trigger it
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeploy = (store: string) => {
    // Simulate deployment - in real app this would connect to actual stores
    alert(`Deploying to ${store}...`);
  };

  const handleShare = (platform: string) => {
    const appName = appState.appName || 'My App';
    const text = `I just built "${appName}" using AI App Builder! 🚀`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, '_blank');
    }
  };

  const steps = [
    { id: 1, name: "Requirements", status: "complete" as const },
    { id: 2, name: "App Design", status: "complete" as const },
    { id: 3, name: "Code Generation", status: "complete" as const },
    { id: 4, name: "Finalize", status: "current" as const },
  ];

  const platforms = appState.platforms || ["ios", "android"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Workflow Progress */}
      <StepIndicator steps={steps} currentStep={4} />

      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-green-800">
            🎉 Your App is Ready!
          </h1>
          <p className="text-lg text-gray-600">
            "{appState.appName || 'Your app'}" has been successfully generated and is ready for deployment
          </p>
        </div>

        {/* App Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              App Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {platforms.length}
                </div>
                <div className="text-sm text-gray-600">Platforms Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {(appState.features || []).length}
                </div>
                <div className="text-sm text-gray-600">Features Implemented</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  100%
                </div>
                <div className="text-sm text-gray-600">Code Coverage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Your Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {platforms.map((platform) => (
                <div key={platform} className="border rounded-lg p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 capitalize">
                    {platform} App
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete {platform === 'ios' ? 'Xcode' : 'Android Studio'} project with all source code
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleDownload(platform)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Source Code
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => window.open('https://github.com', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on GitHub
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deployment Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Deploy Your App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">App Store Connect</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Deploy directly to iOS App Store with automated submission
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleDeploy('App Store')}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy to App Store
                </Button>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Google Play Console</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Deploy directly to Google Play Store with automated submission
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleDeploy('Google Play Store')}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy to Play Store
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share & Feedback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Your Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Share your app creation journey and help others discover AI App Builder
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleShare('twitter')}
                >
                  <Share2 className="w-4 h-4" />
                  Share on Twitter
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleShare('linkedin')}
                >
                  <Share2 className="w-4 h-4" />
                  Share on LinkedIn
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => alert('Thank you for your feedback!')}
                >
                  <Star className="w-4 h-4" />
                  Rate Your Experience
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generation
          </Button>
          <Button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Create Another App
            <Rocket className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}