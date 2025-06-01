import React from "react";
import { useState, useEffect } from 'react';
import { usePreferences } from '@/lib/usePreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  MessageSquare,
  Eye,
  Edit3,
  Shield,
  Star,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Loader2,
  Brain,
} from 'lucide-react';

interface CodeReview {
  overallScore: number;
  suggestions: string[];
  strengths: string[];
  improvements: string[];
}

interface CollaborativeCodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  readonly?: boolean;
}

// Mock collaborative users for demo
const mockCollaborators = [
  { id: 1, name: 'Sarah Chen', role: 'editor', color: '#3b82f6', active: true },
  { id: 2, name: 'Alex Rivera', role: 'reviewer', color: '#10b981', active: false },
  { id: 3, name: 'Jordan Kim', role: 'viewer', color: '#f59e0b', active: true },
];

export function CollaborativeCodeEditor({ code, language, onCodeChange, readonly = false }: CollaborativeCodeEditorProps) {
  const { skillLevel } = usePreferences();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('editor');
  const [review, setReview] = useState<CodeReview | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [collaborators] = useState(mockCollaborators);

  const handleCodeReview = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code to Review",
        description: "Please add some code before requesting a review.",
        variant: "destructive",
      });
      return;
    }

    setIsReviewing(true);
    try {
      const response = await fetch('/api/review-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          skillLevel,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get code review');
      }

      const reviewData = await response.json();
      setReview(reviewData);
      setActiveTab('review');
      
      toast({
        title: "AI Review Complete!",
        description: `Code reviewed with a score of ${reviewData.overallScore}/10`,
      });
    } catch (error) {
      console.error('Error getting code review:', error);
      toast({
        title: "Review Failed",
        description: "Could not generate code review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'editor': return <Edit3 className="h-3 w-3" />;
      case 'reviewer': return <Eye className="h-3 w-3" />;
      case 'viewer': return <Shield className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className="space-y-4">
      {/* Collaborators Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Live Collaboration</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {collaborators.map((user) => (
                  <div key={user.id} className="flex items-center space-x-1">
                    <div 
                      className={`w-3 h-3 rounded-full ${user.active ? 'animate-pulse' : 'opacity-50'}`}
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-sm text-gray-600">{user.name}</span>
                    {getRoleIcon(user.role)}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCodeReview}
                disabled={isReviewing || readonly}
              >
                {isReviewing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                AI Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Editor/Review Interface */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-3">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Code Editor</TabsTrigger>
              <TabsTrigger value="review">AI Review</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="editor" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{language.toUpperCase()}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Mode
                    </Badge>
                  </div>
                  
                  {readonly && (
                    <Badge variant="destructive" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Read Only
                    </Badge>
                  )}
                </div>
                
                <textarea
                  value={code}
                  onChange={(e) => onCodeChange(e.target.value)}
                  readOnly={readonly}
                  className="w-full h-80 p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={readonly ? "Code is read-only in this view..." : "Start typing your code here..."}
                />
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              {review ? (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Star className={`h-8 w-8 ${getScoreColor(review.overallScore)}`} />
                      <span className={`text-3xl font-bold ${getScoreColor(review.overallScore)}`}>
                        {review.overallScore}/10
                      </span>
                    </div>
                    <p className={`text-lg font-medium ${getScoreColor(review.overallScore)}`}>
                      {getScoreLabel(review.overallScore)}
                    </p>
                  </div>

                  {/* Strengths */}
                  {review.strengths.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center text-green-700">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {review.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {review.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center text-blue-700">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        AI Suggestions
                      </h4>
                      <ul className="space-y-1">
                        {review.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {review.improvements.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center text-orange-700">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {review.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Review Yet</h3>
                  <p className="text-sm mb-4">
                    Click "AI Review" to get intelligent feedback on your code
                  </p>
                  <Button onClick={handleCodeReview} disabled={isReviewing || !code.trim()}>
                    {isReviewing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Brain className="h-4 w-4 mr-2" />
                    )}
                    Start AI Review
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <div className="text-center p-8 text-gray-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Team Comments</h3>
                <p className="text-sm mb-4">
                  Collaborative commenting coming soon! Team members will be able to add inline comments and suggestions.
                </p>
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}