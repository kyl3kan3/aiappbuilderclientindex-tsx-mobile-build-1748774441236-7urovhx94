import React, { useState, useRef } from 'react';
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
  Palette, 
  Wand2, 
  Download, 
  Copy,
  Play,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Layers,
  Grid,
  Type,
  Image,
  Square,
  Circle,
  Zap,
  RefreshCw,
  Settings,
  Sparkles,
  Save,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DesignRequest {
  description: string;
  platform: 'ios' | 'android' | 'web' | 'react-native' | 'flutter';
  style: 'modern' | 'minimal' | 'bold' | 'elegant' | 'playful';
  colors?: string[];
  components?: string[];
}

interface GeneratedDesign {
  id: string;
  name: string;
  description: string;
  platform: string;
  style: string;
  components: DesignComponent[];
  colorPalette: ColorPalette;
  layout: LayoutStructure;
  code: string;
  preview: string;
  timestamp: string;
}

interface DesignComponent {
  id: string;
  type: 'button' | 'text' | 'image' | 'container' | 'input' | 'card' | 'list';
  name: string;
  properties: Record<string, any>;
  style: ComponentStyle;
  position: { x: number; y: number; width: number; height: number };
}

interface ComponentStyle {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  padding?: number;
  fontSize?: number;
  fontWeight?: string;
  shadow?: string;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

interface LayoutStructure {
  type: 'stack' | 'grid' | 'flex' | 'absolute';
  direction?: 'vertical' | 'horizontal';
  spacing?: number;
  alignment?: string;
  children: LayoutStructure[];
}

interface DesignSuggestion {
  id: string;
  type: 'color' | 'spacing' | 'typography' | 'layout' | 'accessibility';
  title: string;
  description: string;
  before: string;
  after: string;
  confidence: number;
}

export default function AIDesignStudio() {
  const [designRequest, setDesignRequest] = useState<DesignRequest>({
    description: '',
    platform: 'react-native',
    style: 'modern',
    colors: [],
    components: []
  });
  const [selectedDevice, setSelectedDevice] = useState('mobile');
  const [designMode, setDesignMode] = useState<'generate' | 'edit' | 'preview'>('generate');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch generated designs
  const { data: designs, isLoading: designsLoading } = useQuery<GeneratedDesign[]>({
    queryKey: ['/api/ai/design/generated'],
    refetchInterval: 30000,
  });

  // Fetch design suggestions
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery<DesignSuggestion[]>({
    queryKey: ['/api/ai/design/suggestions'],
  });

  // Generate design mutation
  const generateDesignMutation = useMutation({
    mutationFn: async (request: DesignRequest) => {
      const response = await fetch('/api/ai/design/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate design');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setIsGenerating(false);
      toast({
        title: "Design Generated",
        description: `Created "${data.design.name}" with ${data.design.components.length} components.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/design'] });
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

  // Analyze design mutation
  const analyzeDesignMutation = useMutation({
    mutationFn: async (designId: string) => {
      const response = await fetch('/api/ai/design/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze design');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Design Analyzed",
        description: `Found ${data.suggestions?.length || 0} improvement suggestions.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/design/suggestions'] });
    },
  });

  const handleGenerateDesign = () => {
    if (!designRequest.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe the design you want to create.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    generateDesignMutation.mutate(designRequest);
  };

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'button': return <Square className="h-4 w-4" />;
      case 'text': return <Type className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'container': return <Grid className="h-4 w-4" />;
      case 'input': return <Square className="h-4 w-4" />;
      case 'card': return <Layers className="h-4 w-4" />;
      case 'list': return <Grid className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getSuggestionBadge = (type: string) => {
    const colors = {
      'color': 'bg-pink-500 text-white',
      'spacing': 'bg-blue-500 text-white',
      'typography': 'bg-purple-500 text-white',
      'layout': 'bg-green-500 text-white',
      'accessibility': 'bg-orange-500 text-white'
    };

    return (
      <Badge className={colors[type as keyof typeof colors]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const copyDesignCode = (design: GeneratedDesign) => {
    navigator.clipboard.writeText(design.code);
    toast({
      title: "Code Copied",
      description: "Design code has been copied to your clipboard.",
    });
  };

  const downloadDesign = (design: GeneratedDesign) => {
    const blob = new Blob([design.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${design.name.replace(/\s+/g, '-').toLowerCase()}.${design.platform === 'web' ? 'tsx' : design.platform === 'flutter' ? 'dart' : 'js'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Design Studio</h1>
          <p className="text-gray-600">Generate beautiful UI designs and layouts with artificial intelligence</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 border rounded-lg p-1">
            {['mobile', 'tablet', 'desktop'].map((device) => (
              <Button
                key={device}
                variant={selectedDevice === device ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedDevice(device)}
                className="h-8"
              >
                {getDeviceIcon(device)}
              </Button>
            ))}
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Sparkles className="h-4 w-4 mr-2" />
            New Design
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Design Panel */}
        <div className="lg:col-span-3">
          <Tabs value={designMode} onValueChange={(value) => setDesignMode(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Design Generation</CardTitle>
                  <CardDescription>
                    Describe your design vision and let AI create the perfect interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="description">Design Description</Label>
                    <Textarea
                      id="description"
                      value={designRequest.description}
                      onChange={(e) => setDesignRequest({ ...designRequest, description: e.target.value })}
                      placeholder="Describe your design (e.g., 'Create a modern login screen with a gradient background, clean input fields, and a prominent sign-in button')"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <Select
                        value={designRequest.platform}
                        onValueChange={(value) => setDesignRequest({ ...designRequest, platform: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ios">iOS (SwiftUI)</SelectItem>
                          <SelectItem value="android">Android (Compose)</SelectItem>
                          <SelectItem value="react-native">React Native</SelectItem>
                          <SelectItem value="flutter">Flutter</SelectItem>
                          <SelectItem value="web">Web (React)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="style">Design Style</Label>
                      <Select
                        value={designRequest.style}
                        onValueChange={(value) => setDesignRequest({ ...designRequest, style: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="elegant">Elegant</SelectItem>
                          <SelectItem value="playful">Playful</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Quick Templates</Label>
                      <Select onValueChange={(value) => setDesignRequest({ ...designRequest, description: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Create a modern login screen with social login options">Login Screen</SelectItem>
                          <SelectItem value="Design a dashboard with cards showing statistics and charts">Dashboard</SelectItem>
                          <SelectItem value="Build a profile screen with avatar, settings, and preferences">Profile Screen</SelectItem>
                          <SelectItem value="Create a shopping cart with product list and checkout button">Shopping Cart</SelectItem>
                          <SelectItem value="Design a chat interface with message bubbles and input field">Chat Interface</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateDesign}
                    disabled={!designRequest.description.trim() || isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Design...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Design
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Designs */}
              <Card>
                <CardHeader>
                  <CardTitle>Generated Designs</CardTitle>
                  <CardDescription>Your AI-created designs and layouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    {designsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : designs && designs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {designs.map((design) => (
                          <Card key={design.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{design.name}</CardTitle>
                                <Badge variant="outline">{design.platform}</Badge>
                              </div>
                              <CardDescription className="text-sm">
                                {design.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {/* Design Preview */}
                              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                                <div className="text-gray-500 text-sm">Design Preview</div>
                              </div>

                              {/* Color Palette */}
                              <div className="flex space-x-1 mb-3">
                                {Object.values(design.colorPalette).slice(0, 5).map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-6 h-6 rounded border"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>

                              {/* Components */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {design.components.slice(0, 3).map((component) => (
                                  <Badge key={component.id} variant="outline" className="text-xs">
                                    {getComponentIcon(component.type)}
                                    <span className="ml-1">{component.type}</span>
                                  </Badge>
                                ))}
                                {design.components.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{design.components.length - 3} more
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  {new Date(design.timestamp).toLocaleDateString()}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="outline" onClick={() => copyDesignCode(design)}>
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => downloadDesign(design)}>
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" onClick={() => analyzeDesignMutation.mutate(design.id)}>
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Palette className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold mb-2">No designs yet</h3>
                        <p className="text-gray-600 mb-4">Create your first AI-generated design</p>
                        <Button onClick={() => setDesignRequest({ ...designRequest, description: 'Create a modern login screen with social login options' })}>
                          Try Example Design
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Design Editor</CardTitle>
                  <CardDescription>Modify and customize your generated designs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">Design editor coming soon</p>
                      <p className="text-sm text-gray-500">Drag and drop interface for visual editing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See your design in action across different devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Live preview will show here</p>
                      <p className="text-sm opacity-70">Interactive preview of your generated design</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Design Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>AI Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {suggestionsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : suggestions && suggestions.length > 0 ? (
                  <div className="space-y-3">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">{suggestion.title}</div>
                          {getSuggestionBadge(suggestion.type)}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {suggestion.description}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </div>
                          <Button size="sm" variant="outline" className="text-xs">
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No suggestions yet</p>
                    <p className="text-xs">Generate a design to get AI suggestions</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Design Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Design Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Type className="h-4 w-4 mr-2" />
                Typography Scale
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Palette className="h-4 w-4 mr-2" />
                Color Palette
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Grid className="h-4 w-4 mr-2" />
                Layout Grid
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Square className="h-4 w-4 mr-2" />
                Component Library
              </Button>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Image className="h-4 w-4 mr-2" />
                Export Images
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Design Tokens
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}