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
  Bot, 
  Send, 
  Code2, 
  Sparkles,
  Download,
  Copy,
  Play,
  Wand2,
  MessageCircle,
  User,
  Cpu,
  Lightbulb,
  FileText,
  Smartphone,
  Globe,
  Zap,
  Settings,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippets?: CodeSnippet[];
  suggestions?: string[];
  attachments?: Attachment[];
}

interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  description: string;
  filename?: string;
  platform?: 'ios' | 'android' | 'react-native' | 'flutter';
}

interface Attachment {
  id: string;
  type: 'project' | 'component' | 'file';
  name: string;
  description: string;
  content?: string;
}

interface CodeGeneration {
  id: string;
  prompt: string;
  platform: 'ios' | 'android' | 'react-native' | 'flutter';
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  result?: {
    projectName: string;
    description: string;
    files: GeneratedFile[];
    features: string[];
    dependencies: string[];
  };
  timestamp: string;
}

interface GeneratedFile {
  path: string;
  content: string;
  description: string;
  type: 'component' | 'screen' | 'service' | 'config' | 'style';
}

interface AIContext {
  currentProject?: string;
  platform?: string;
  recentFiles?: string[];
  userPreferences?: {
    codeStyle: string;
    framework: string;
    designPattern: string;
  };
}

export default function AIAssistant() {
  const [message, setMessage] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('react-native');
  const [isGenerating, setIsGenerating] = useState(false);
  const [context, setContext] = useState<AIContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat history
  const { data: messages, isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/ai/chat/history'],
    refetchInterval: 5000,
  });

  // Fetch code generations
  const { data: generations, isLoading: generationsLoading } = useQuery<CodeGeneration[]>({
    queryKey: ['/api/ai/generations'],
    refetchInterval: 10000,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, context }: { message: string; context: AIContext }) => {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chat'] });
    },
    onError: (error: any) => {
      toast({
        title: "Message Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate code mutation
  const generateCodeMutation = useMutation({
    mutationFn: async ({ prompt, platform }: { prompt: string; platform: string }) => {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, context }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate code');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setIsGenerating(false);
      toast({
        title: "Code Generation Started",
        description: `Generating ${data.platform} app: "${data.projectName}"`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/generations'] });
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({ message, context });
  };

  const handleGenerateCode = () => {
    if (!message.trim()) return;
    
    setIsGenerating(true);
    generateCodeMutation.mutate({ prompt: message, platform: selectedPlatform });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Code has been copied to your clipboard.",
    });
  };

  const downloadCode = (snippet: CodeSnippet) => {
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = snippet.filename || `code.${snippet.language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return '🍎';
      case 'android': return '🤖';
      case 'react-native': return '⚛️';
      case 'flutter': return '🐦';
      default: return '📱';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'generating': 'bg-blue-500 text-white',
      'completed': 'bg-green-500 text-white',
      'failed': 'bg-red-500 text-white'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-gray-600">Natural language code generation and intelligent development assistance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure AI
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
            <Sparkles className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <CardTitle>AI Code Assistant</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ios">🍎 iOS (Swift)</SelectItem>
                      <SelectItem value="android">🤖 Android (Kotlin)</SelectItem>
                      <SelectItem value="react-native">⚛️ React Native</SelectItem>
                      <SelectItem value="flutter">🐦 Flutter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>
                Ask questions, request code, or describe the app you want to build
              </CardDescription>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                          msg.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            {msg.type === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4 text-blue-500" />
                            )}
                            <span className="text-sm font-medium">
                              {msg.type === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <span className="text-xs opacity-70">
                              {formatRelativeTime(msg.timestamp)}
                            </span>
                          </div>
                          
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                          
                          {/* Code Snippets */}
                          {msg.codeSnippets && msg.codeSnippets.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {msg.codeSnippets.map((snippet) => (
                                <div key={snippet.id} className="bg-gray-900 rounded-md p-3 text-white">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <Code2 className="h-4 w-4" />
                                      <span className="text-sm">{snippet.language}</span>
                                      {snippet.filename && (
                                        <span className="text-xs text-gray-400">{snippet.filename}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(snippet.code)}
                                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => downloadCode(snippet)}
                                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <pre className="text-sm overflow-x-auto">
                                    <code>{snippet.code}</code>
                                  </pre>
                                  {snippet.description && (
                                    <div className="mt-2 text-xs text-gray-400">
                                      {snippet.description}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Suggestions */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {msg.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => setMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                      <p className="text-gray-600 mb-4">Ask me to generate code, explain concepts, or build an entire app</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {[
                          "Create a todo app with React Native",
                          "Build a login screen for iOS",
                          "Explain SwiftUI navigation",
                          "Generate a Flutter shopping cart"
                        ].map((example, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            onClick={() => setMessage(example)}
                          >
                            {example}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="mt-4 space-y-3">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe the app you want to build or ask a coding question..."
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Cpu className="h-4 w-4" />
                    <span>AI is ready to help</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleGenerateCode}
                      disabled={!message.trim() || isGenerating}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate App'}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Recent Generations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Recent Generations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {generationsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : generations && generations.length > 0 ? (
                  <div className="space-y-3">
                    {generations.map((gen) => (
                      <div key={gen.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span>{getPlatformIcon(gen.platform)}</span>
                            <span className="text-sm font-medium truncate">
                              {gen.result?.projectName || 'Generating...'}
                            </span>
                          </div>
                          {getStatusBadge(gen.status)}
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {gen.prompt}
                        </div>
                        
                        {gen.status === 'generating' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${gen.progress}%` }}
                            />
                          </div>
                        )}
                        
                        {gen.status === 'completed' && gen.result && (
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {gen.result.files.length} files
                            </span>
                            <Button size="sm" variant="outline" className="h-6 text-xs">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-400 mt-1">
                          {formatRelativeTime(gen.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No generations yet</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Smartphone className="h-4 w-4 mr-2" />
                Generate Login Screen
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Create API Service
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Build Chat Interface
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Documentation
              </Button>
            </CardContent>
          </Card>

          {/* AI Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>AI Context</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium mb-1">Current Platform</div>
                <div className="text-gray-600">{getPlatformIcon(selectedPlatform)} {selectedPlatform}</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium mb-1">Code Style</div>
                <div className="text-gray-600">Modern & Clean</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium mb-1">Design Pattern</div>
                <div className="text-gray-600">Component-based</div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Update Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}