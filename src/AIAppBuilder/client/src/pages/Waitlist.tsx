import React from "react";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  Mail,
  Star,
  Zap,
  Shield,
  Rocket,
  Users,
  Brain,
} from 'lucide-react';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to join the waitlist.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Welcome to the Waitlist!",
          description: "You'll be the first to know about Pro features and exclusive updates.",
        });
      } else {
        throw new Error('Failed to join waitlist');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">You're on the list! 🎉</h1>
            
            <p className="text-gray-600 mb-6">
              Thanks for joining the AI App Builder Pro waitlist. You'll be among the first to access 
              advanced features, exclusive templates, and special pricing when we launch.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>What's next?</strong> Check your email for a confirmation and exclusive updates 
                about our development progress.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.href = '/'}>
                Start Building Free
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                Explore Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Coming Soon: AI App Builder Pro
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Get Early Access to Pro Features
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join 1,000+ developers on the waitlist for advanced AI models, custom components, 
            team collaboration, and exclusive pricing.
          </p>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Mail className="h-5 w-5 mr-2" />
                Join the Waitlist
              </CardTitle>
              <CardDescription>
                Be first to access Pro features and special launch pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </Button>
                <p className="text-xs text-gray-500">
                  We'll never spam you. Unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Features */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What's Coming in Pro</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced features designed for professional developers and teams building production apps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced AI Models</h3>
                <p className="text-gray-600">
                  Access to GPT-5, Claude 3.5, and specialized mobile development models for even better code generation.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Custom Components</h3>
                <p className="text-gray-600">
                  Build and share reusable UI components across projects. Create your own component library.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                <p className="text-gray-600">
                  Enhanced real-time collaboration with role-based permissions and team workspaces.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
                <p className="text-gray-600">
                  SOC 2 compliance, SSO integration, and enterprise-grade security features.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Rocket className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">App Store Automation</h3>
                <p className="text-gray-600">
                  Automated app store submissions, review management, and release scheduling.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Priority Support</h3>
                <p className="text-gray-600">
                  24/7 support, dedicated account manager, and direct access to the development team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Early Bird Pricing</h2>
          <p className="text-gray-600 mb-8">
            Waitlist members get exclusive access to launch pricing
          </p>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">50% Off Launch Pricing</h3>
            <p className="text-blue-100 mb-4">
              Pro features starting at $29/month for waitlist members
            </p>
            <p className="text-sm text-blue-200">
              Regular price $59/month after launch
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Join the Community</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1,000+</div>
              <div className="text-gray-600">Developers on waitlist</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Apps already built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">10+</div>
              <div className="text-gray-600">TestFlight deployments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}