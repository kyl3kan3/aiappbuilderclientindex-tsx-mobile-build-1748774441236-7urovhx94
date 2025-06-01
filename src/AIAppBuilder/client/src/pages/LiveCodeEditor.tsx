import React, { useState, useRef, useEffect } from 'react';
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
  Code2, 
  Play, 
  Save, 
  Download,
  Upload,
  Copy,
  Lightbulb,
  Zap,
  Brain,
  Eye,
  Settings,
  FileText,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Info,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeSuggestion {
  id: string;
  text: string;
  insertText: string;
  kind: 'function' | 'variable' | 'class' | 'method' | 'property' | 'keyword' | 'snippet';
  detail: string;
  documentation?: string;
  confidence: number;
  priority: number;
}

interface LiveHint {
  id: string;
  type: 'error' | 'warning' | 'info' | 'suggestion';
  message: string;
  line: number;
  column: number;
  severity: 'critical' | 'major' | 'minor' | 'info';
  quickFix?: string;
  documentation?: string;
}

interface CodeCompletion {
  id: string;
  position: { line: number; column: number };
  suggestions: CodeSuggestion[];
  context: string;
  timestamp: string;
}

interface SmartFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'completion' | 'analysis' | 'formatting' | 'refactoring';
}

export default function LiveCodeEditor() {
  const [code, setCode] = useState(`import React, { useState } from 'react';


const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="mobile-converted">
      <span className="mobile-converted">Counter: {count}</span>
      <button 
        className="mobile-converted"
        onClick={() => setCount(count + 1)}
      >
        <span className="mobile-converted">Increment</span>
      </button>
    </div>
  );
};

export default Counter;`);

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [hints, setHints] = useState<LiveHint[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);

  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch smart features
  const { data: smartFeatures, isLoading: featuresLoading } = useQuery<SmartFeature[]>({
    queryKey: ['/api/ai/editor/features'],
  });

  // Get live code completion
  const getCompletionMutation = useMutation({
    mutationFn: async ({ code, position, language }: { code: string; position: any; language: string }) => {
      const response = await fetch('/api/ai/editor/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, position, language }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get completions');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions || []);
      setShowSuggestions(data.suggestions?.length > 0);
    },
  });

  // Analyze code for hints
  const analyzeCodeMutation = useMutation({
    mutationFn: async ({ code, language }: { code: string; language: string }) => {
      const response = await fetch('/api/ai/editor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setHints(data.hints || []);
      setIsAnalyzing(false);
    },
    onError: () => {
      setIsAnalyzing(false);
    },
  });

  // Format code
  const formatCodeMutation = useMutation({
    mutationFn: async ({ code, language }: { code: string; language: string }) => {
      const response = await fetch('/api/ai/editor/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to format code');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setCode(data.formattedCode);
      toast({
        title: "Code Formatted",
        description: "Your code has been automatically formatted.",
      });
    },
  });

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    
    // Trigger analysis after a delay
    setTimeout(() => {
      if (!isAnalyzing) {
        setIsAnalyzing(true);
        analyzeCodeMutation.mutate({ code: newCode, language: selectedLanguage });
      }
    }, 1000);
  };

  // Handle cursor position changes
  const handleCursorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    const position = textarea.selectionStart;
    const lines = textarea.value.substring(0, position).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    
    setCursorPosition({ line, column });
  };

  // Handle key press for completions
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === ' ' && event.ctrlKey) {
      // Ctrl+Space for manual completion
      event.preventDefault();
      getCompletionMutation.mutate({
        code,
        position: cursorPosition,
        language: selectedLanguage
      });
    } else if (showSuggestions) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedSuggestion(prev => Math.max(prev - 1, 0));
      } else if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        applySuggestion(suggestions[selectedSuggestion]);
      } else if (event.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  // Apply selected suggestion
  const applySuggestion = (suggestion: CodeSuggestion) => {
    const textarea = codeEditorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + suggestion.insertText + code.substring(end);
    
    setCode(newCode);
    setShowSuggestions(false);
    setSelectedSuggestion(0);

    // Move cursor to end of inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + suggestion.insertText.length, start + suggestion.insertText.length);
    }, 0);
  };

  // Apply quick fix
  const applyQuickFix = (hint: LiveHint) => {
    if (hint.quickFix) {
      const lines = code.split('\n');
      lines[hint.line - 1] = hint.quickFix;
      setCode(lines.join('\n'));
      
      // Remove the hint after applying fix
      setHints(hints.filter(h => h.id !== hint.id));
      
      toast({
        title: "Quick Fix Applied",
        description: "The issue has been automatically resolved.",
      });
    }
  };

  const getSuggestionIcon = (kind: string) => {
    switch (kind) {
      case 'function': return '𝑓';
      case 'variable': return '𝑥';
      case 'class': return '𝐶';
      case 'method': return '𝑚';
      case 'property': return '𝑝';
      case 'keyword': return '𝑘';
      case 'snippet': return '◊';
      default: return '•';
    }
  };

  const getHintIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'suggestion': return <Lightbulb className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Code has been copied to your clipboard.",
    });
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${selectedLanguage === 'javascript' ? 'js' : selectedLanguage}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const runCode = () => {
    toast({
      title: "Code Execution",
      description: "Code would be executed in a secure environment.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Code Editor</h1>
          <p className="text-gray-600">Intelligent code completion and real-time AI assistance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={copyCode}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" onClick={downloadCode}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={runCode} className="bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4 mr-2" />
            Run Code
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle>Code Editor</CardTitle>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="swift">Swift</SelectItem>
                      <SelectItem value="kotlin">Kotlin</SelectItem>
                      <SelectItem value="dart">Dart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-500">
                    Line {cursorPosition.line}, Col {cursorPosition.column}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => formatCodeMutation.mutate({ code, language: selectedLanguage })}
                    disabled={formatCodeMutation.isPending}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Format
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col relative">
              <div className="relative flex-1">
                <Textarea
                  ref={codeEditorRef}
                  value={code}
                  onChange={(e) => {
                    handleCodeChange(e.target.value);
                    handleCursorChange(e);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-full font-mono text-sm resize-none"
                  placeholder="Start typing your code... (Ctrl+Space for completions)"
                />
                
                {/* Live Suggestions Popup */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-4 left-4 bg-white border rounded-lg shadow-lg z-10 w-80 max-h-60 overflow-y-auto">
                    <div className="p-2 text-xs text-gray-500 border-b">
                      Code Completions ({suggestions.length})
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.id}
                        className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 ${
                          index === selectedSuggestion ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                        }`}
                        onClick={() => applySuggestion(suggestion)}
                      >
                        <div className="text-blue-600 font-mono text-sm">
                          {getSuggestionIcon(suggestion.kind)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{suggestion.text}</div>
                          <div className="text-xs text-gray-500">{suggestion.detail}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(suggestion.confidence * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Analysis Indicator */}
                {isAnalyzing && (
                  <div className="absolute top-2 right-2 flex items-center space-x-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Live Hints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Live Hints</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {hints.length > 0 ? (
                  <div className="space-y-2">
                    {hints.map((hint) => (
                      <div key={hint.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2">
                            {getHintIcon(hint.type)}
                            <div className="flex-1">
                              <div className="text-sm font-medium">{hint.message}</div>
                              <div className="text-xs text-gray-500">
                                Line {hint.line}, Column {hint.column}
                              </div>
                            </div>
                          </div>
                        </div>
                        {hint.quickFix && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 w-full"
                            onClick={() => applyQuickFix(hint)}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Quick Fix
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No issues found</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Smart Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Smart Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {featuresLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))
                ) : (
                  smartFeatures?.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{feature.name}</div>
                        <div className="text-xs text-gray-500">{feature.description}</div>
                      </div>
                      <Switch defaultChecked={feature.enabled} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Code2 className="h-4 w-4 mr-2" />
                Generate Component
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Add Documentation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Smartphone className="h-4 w-4 mr-2" />
                Preview on Device
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Code Review
              </Button>
            </CardContent>
          </Card>

          {/* Code Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Code Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lines:</span>
                  <span className="font-mono">{code.split('\n').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Characters:</span>
                  <span className="font-mono">{code.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Functions:</span>
                  <span className="font-mono">{(code.match(/function|const.*=>/g) || []).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Components:</span>
                  <span className="font-mono">{(code.match(/const.*=.*=>/g) || []).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}