import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Smartphone,
  Zap,
  Code,
  Rocket,
  CheckCircle,
  Star,
  Play,
  ArrowRight,
  Github,
  Apple,
  Globe,
  Clock,
  Shield,
  Users
} from 'lucide-react';

export default function SplashPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email subscription
    setIsSubscribed(true);
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Generation",
      description: "Describe your app idea and watch AI create complete native code in seconds"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "No Code Required",
      description: "Build professional iOS and Android apps without writing a single line of code"
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Instant Deployment",
      description: "Automatically deploy to TestFlight and Play Store with one click"
    },
    {
      icon: <Github className="h-6 w-6" />,
      title: "GitHub Integration",
      description: "Full source code generated and stored in your GitHub repository"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security with zero-trust architecture and compliance"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Platform",
      description: "Generate for iOS, Android, React Native, and Flutter simultaneously"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Describe Your App",
      description: "Answer a few guided questions about your app idea, features, and target audience.",
      icon: <Users className="h-8 w-8" />
    },
    {
      number: "2",
      title: "Generate & Customize",
      description: "AI builds your screens, logic, and assets in seconds. Preview and customize as needed.",
      icon: <Zap className="h-8 w-8" />
    },
    {
      number: "3",
      title: "Ship to App Store",
      description: "Signed IPAs pushed to TestFlight via GitHub Actions — no Mac or Xcode needed.",
      icon: <Rocket className="h-8 w-8" />
    }
  ];

  const testimonials = [
    {
      quote: "I built and published a working TestFlight app from a coffee shop — in 12 minutes.",
      author: "Sarah Chen",
      role: "Startup Founder",
      avatar: "👩‍💻"
    },
    {
      quote: "Finally, a tool that actually delivers on the 'no-code' promise for mobile apps.",
      author: "Marcus Rodriguez",
      role: "Product Manager",
      avatar: "👨‍💼"
    },
    {
      quote: "The GitHub Actions integration is genius. Real CI/CD for mobile without the hassle.",
      author: "Alex Kim",
      role: "Tech Lead",
      avatar: "👨‍💻"
    }
  ];

  const platforms = [
    { name: "iOS", icon: <Apple className="h-8 w-8" />, description: "Native Swift & SwiftUI" },
    { name: "Android", icon: "🤖", description: "Kotlin & Jetpack Compose" },
    { name: "React Native", icon: "⚛️", description: "Cross-platform JavaScript" },
    { name: "Flutter", icon: "🦋", description: "Dart & Material Design" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI App Builder
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/requirements">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/requirements">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Building
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
            🚀 No Mac Required • No Xcode Needed • No Code Writing
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            Build & Launch iOS/Android Apps with AI
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI App Builder auto-generates, signs, and delivers production-ready mobile apps 
            straight to TestFlight — all from your browser. No code, no Mac, no problem.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/requirements">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
                <Rocket className="h-5 w-5 mr-2" />
                Start Building Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Real App Store Apps
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Apple Code Signed
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Production Ready
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Enterprise Grade
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">From idea to App Store in minutes, not months</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {step.icon}
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-3xl mx-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Supported Platforms</h2>
          <p className="text-gray-600 text-lg">Build once, deploy everywhere</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {platforms.map((platform, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3 flex justify-center">
                {typeof platform.icon === 'string' ? platform.icon : platform.icon}
              </div>
              <h3 className="font-semibold mb-2">{platform.name}</h3>
              <p className="text-sm text-gray-600">{platform.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-600 text-lg">Powerful features that make mobile development effortless</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mx-4 text-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Developers</h2>
          <p className="text-blue-100 text-lg">See what creators are saying about AI App Builder</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-white/10 border-white/20 text-white">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg mb-4">"{testimonial.quote}"</blockquote>
              <div className="flex items-center">
                <div className="text-2xl mr-3">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-blue-200 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Your App?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators who are building the future of mobile apps with AI
          </p>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Early Access
              </Button>
            </form>
          ) : (
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-lg font-medium text-green-600">Thanks! You're on the list.</span>
              </div>
            </div>
          )}

          <Link to="/requirements">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
              <Rocket className="h-5 w-5 mr-2" />
              Start Building Now
            </Button>
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">AI App Builder</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Support</a>
            <a href="#" className="hover:text-gray-900">Docs</a>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          © 2024 AI App Builder. Made with ❤️ for developers who want to build amazing mobile apps faster.
        </div>
      </footer>
    </div>
  );
}