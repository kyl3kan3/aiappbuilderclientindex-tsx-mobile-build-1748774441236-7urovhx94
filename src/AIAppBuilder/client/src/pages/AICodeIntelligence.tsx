import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Code2, 
  Search, 
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Wand2,
  Cpu,
  FileText,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeSuggestion {
  id: string;
  type: 'optimization' | 'bug_fix' | 'security' | 'performance' | 'best_practice';
  title: string;
  description: string;
  code: string;
  suggestedCode: string;
  file: string;
  line: number;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  reasoning: string;
  tags: string[];
}

interface CodeReview {
  id: string;
  projectId: string;
  projectName: string;
  status: 'analyzing' | 'completed' | 'failed';
  timestamp: string;
  summary: {
    totalIssues: number;
    criticalIssues: number;
    suggestions: number;
    codeQuality: number;
    maintainability: number;
    performance: number;
    security: number;
  };
  issues: CodeIssue[];
}

interface CodeIssue {
  id: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  category: 'bug' | 'security' | 'performance' | 'maintainability' | 'style';
  message: string;
  file: string;
  line: number;
  suggestion?: string;
  fixCode?: string;
}

interface AIInsight {
  id: string;
  type: 'pattern' | 'trend' | 'recommendation' | 'warning';
  title: string;
  description: string;
  metric: string;
  value: number;
  change: number;
  timestamp: string;
  actionable: boolean;
}

export default function AICodeIntelligence() {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [selectedProject, setSelectedProject] = useState('all');
  const [codeInput, setCodeInput] = useState('');
  const [analysisType, setAnalysisType] = useState('optimization');
  const [reviewInProgress, setReviewInProgress] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch code suggestions
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery<CodeSuggestion[]>({
    queryKey: [`/api/ai/suggestions?project=${selectedProject}`],
    refetchInterval: 30000,
  });

  // Fetch code reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery<CodeReview[]>({
    queryKey: ['/api/ai/reviews'],
    refetchInterval: 30000,
  });

  // Fetch AI insights
  const { data: insights, isLoading: insightsLoading } = useQuery<AIInsight[]>({
    queryKey: ['/api/ai/insights'],
    refetchInterval: 60000,
  });

  // Generate code suggestions mutation
  const generateSuggestionsMutation = useMutation({
    mutationFn: async ({ code, type }: { code: string; type: string }) => {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, analysisType: type }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: `Generated ${data.suggestions?.length || 0} suggestions for your code.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/suggestions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Start code review mutation
  const startReviewMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start code review');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setReviewInProgress(true);
      toast({
        title: "Code Review Started",
        description: "AI is analyzing your project code. This may take a few minutes.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/reviews'] });
    },
    onError: (error: any) => {
      toast({
        title: "Review Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getSuggestionTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'bug_fix': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'security': return <Shield className="h-4 w-4 text-orange-500" />;
      case 'performance': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'best_practice': return <Star className="h-4 w-4 text-purple-500" />;
      default: return <Code2 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSuggestionTypeBadge = (type: string) => {
    const colors = {
      'optimization': 'bg-blue-500 text-white',
      'bug_fix': 'bg-red-500 text-white',
      'security': 'bg-orange-500 text-white',
      'performance': 'bg-green-500 text-white',
      'best_practice': 'bg-purple-500 text-white'
    };

    return (
      <Badge className={colors[type as keyof typeof colors]}>
        {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      'high': 'bg-red-500 text-white',
      'medium': 'bg-yellow-500 text-white',
      'low': 'bg-green-500 text-white'
    };

    return (
      <Badge className={colors[impact as keyof typeof colors]}>
        {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
      </Badge>
    );
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'major': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'minor': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <Target className="h-4 w-4 text-blue-500" />;
      case 'trend': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Code Intelligence</h1>
          <p className="text-gray-600">Advanced AI-powered code analysis, suggestions, and optimization</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => startReviewMutation.mutate('current-project')}>
            <Brain className="h-4 w-4 mr-2" />
            Start AI Review
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
            <Wand2 className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>

      {/* AI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suggestions</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suggestions?.length || 0}</div>
            <div className="text-xs text-muted-foreground">
              AI-generated improvements
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reviews?.length ? Math.round(reviews[0].summary.codeQuality) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">
              Overall quality score
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {reviews?.length ? Math.round(reviews[0].summary.security) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">
              Security analysis
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reviews?.length ? Math.round(reviews[0].summary.performance) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">
              Performance rating
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="reviews">Code Reviews</TabsTrigger>
          <TabsTrigger value="analyzer">Code Analyzer</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="taskmaster-pro">TaskMaster Pro</SelectItem>
                    <SelectItem value="fitness-tracker">Fitness Tracker</SelectItem>
                    <SelectItem value="chat-app">Chat Application</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Filter Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions List */}
          <div className="space-y-4">
            {suggestionsLoading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : suggestions && suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getSuggestionTypeIcon(suggestion.type)}
                        <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                        {getSuggestionTypeBadge(suggestion.type)}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getImpactBadge(suggestion.impact)}
                        <Badge variant="outline">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{suggestion.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <strong>File:</strong> {suggestion.file} (Line {suggestion.line})
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Current Code</Label>
                        <pre className="mt-1 p-3 bg-gray-100 rounded-md text-sm overflow-x-auto">
                          <code>{suggestion.code}</code>
                        </pre>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Suggested Code</Label>
                        <pre className="mt-1 p-3 bg-green-50 rounded-md text-sm overflow-x-auto">
                          <code>{suggestion.suggestedCode}</code>
                        </pre>
                      </div>
                    </div>

                    <div className="text-sm">
                      <strong>AI Reasoning:</strong>
                      <p className="mt-1 text-gray-600">{suggestion.reasoning}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {suggestion.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Diff
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Dismiss
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Apply Suggestion
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">No AI Suggestions</h3>
                <p className="text-gray-600 mb-4">Run an AI analysis to get intelligent code suggestions</p>
                <Button onClick={() => startReviewMutation.mutate('current-project')}>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Code
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {reviewsLoading ? (
              [...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{review.projectName}</CardTitle>
                      <Badge variant={review.status === 'completed' ? 'default' : 'secondary'}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>
                      AI Code Review • {formatRelativeTime(review.timestamp)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Quality Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{review.summary.codeQuality}%</div>
                        <div className="text-sm text-gray-600">Code Quality</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{review.summary.maintainability}%</div>
                        <div className="text-sm text-gray-600">Maintainability</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{review.summary.performance}%</div>
                        <div className="text-sm text-gray-600">Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{review.summary.security}%</div>
                        <div className="text-sm text-gray-600">Security</div>
                      </div>
                    </div>

                    {/* Issues Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-600">{review.summary.criticalIssues}</div>
                        <div className="text-sm text-red-600">Critical Issues</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-600">{review.summary.totalIssues}</div>
                        <div className="text-sm text-gray-600">Total Issues</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{review.summary.suggestions}</div>
                        <div className="text-sm text-blue-600">Suggestions</div>
                      </div>
                    </div>

                    {/* Top Issues */}
                    {review.issues && review.issues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Top Issues</h4>
                        <div className="space-y-2">
                          {review.issues.slice(0, 3).map((issue) => (
                            <div key={issue.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                              {getSeverityIcon(issue.severity)}
                              <div className="flex-1">
                                <div className="font-medium">{issue.message}</div>
                                <div className="text-sm text-gray-600">
                                  {issue.file}:{issue.line} • {issue.category}
                                </div>
                                {issue.suggestion && (
                                  <div className="text-sm text-blue-600 mt-1">
                                    💡 {issue.suggestion}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Full Report
                      </Button>
                      <Button>
                        <Code2 className="h-4 w-4 mr-2" />
                        View Issues
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">No Code Reviews</h3>
                <p className="text-gray-600 mb-4">Start an AI-powered code review to analyze your project</p>
                <Button onClick={() => startReviewMutation.mutate('current-project')}>
                  <Brain className="h-4 w-4 mr-2" />
                  Start Review
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Code Analyzer</CardTitle>
              <CardDescription>
                Paste your code below for instant AI-powered analysis and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="analysisType">Analysis Type</Label>
                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optimization">Code Optimization</SelectItem>
                    <SelectItem value="security">Security Analysis</SelectItem>
                    <SelectItem value="performance">Performance Review</SelectItem>
                    <SelectItem value="bugs">Bug Detection</SelectItem>
                    <SelectItem value="best_practices">Best Practices</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="codeInput">Code to Analyze</Label>
                <Textarea
                  id="codeInput"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Paste your code here for AI analysis..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <Button
                onClick={() => generateSuggestionsMutation.mutate({ code: codeInput, type: analysisType })}
                disabled={!codeInput.trim() || generateSuggestionsMutation.isPending}
                className="w-full"
              >
                <Brain className="h-4 w-4 mr-2" />
                {generateSuggestionsMutation.isPending ? 'Analyzing...' : 'Analyze Code'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insightsLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : insights && insights.length > 0 ? (
              insights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getInsightTypeIcon(insight.type)}
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>{insight.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold">{insight.value}</div>
                        <div className="text-sm text-gray-600">{insight.metric}</div>
                      </div>
                      <div className={`text-sm font-medium ${insight.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {insight.change >= 0 ? '+' : ''}{insight.change}%
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      {formatRelativeTime(insight.timestamp)}
                    </div>

                    {insight.actionable && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Target className="h-4 w-4 mr-2" />
                        Take Action
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Cpu className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">No AI Insights</h3>
                <p className="text-gray-600">AI insights will appear as you use the platform</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Code Intelligence Settings</CardTitle>
              <CardDescription>Configure AI analysis preferences and thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto Code Analysis</Label>
                    <div className="text-sm text-gray-500">Automatically analyze code on save</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Real-time Suggestions</Label>
                    <div className="text-sm text-gray-500">Show AI suggestions as you type</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Security Scanning</Label>
                    <div className="text-sm text-gray-500">Enable continuous security analysis</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Performance Monitoring</Label>
                    <div className="text-sm text-gray-500">Monitor code performance patterns</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Suggestion Confidence Threshold</Label>
                <div className="text-sm text-gray-500 mb-2">Minimum confidence for showing suggestions</div>
                <Select defaultValue="75">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50% - Show more suggestions</SelectItem>
                    <SelectItem value="75">75% - Balanced (recommended)</SelectItem>
                    <SelectItem value="90">90% - Only high confidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Analysis Scope</Label>
                <div className="text-sm text-gray-500 mb-2">What code should AI analyze</div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All project files</SelectItem>
                    <SelectItem value="modified">Only modified files</SelectItem>
                    <SelectItem value="critical">Critical files only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}