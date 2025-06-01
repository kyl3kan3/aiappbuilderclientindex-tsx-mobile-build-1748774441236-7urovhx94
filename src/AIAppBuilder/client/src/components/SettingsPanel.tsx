import React from "react";
import { useState } from 'react';
import { usePreferences, useTheme } from '@/lib/usePreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Settings,
  Monitor,
  Code,
  Layout,
  Bell,
  Palette,
  Download,
  Upload,
  RotateCcw,
  Save,
} from 'lucide-react';

export function SettingsPanel() {
  const preferences = usePreferences();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('appearance');

  const handleExportSettings = () => {
    try {
      const settingsJson = preferences.exportPreferences();
      const blob = new Blob([settingsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ai-app-builder-settings.json';
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Settings Exported",
        description: "Your preferences have been downloaded as a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          const success = preferences.importPreferences(jsonString);
          
          if (success) {
            toast({
              title: "Settings Imported",
              description: "Your preferences have been successfully imported.",
            });
          } else {
            throw new Error('Invalid format');
          }
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid settings file. Please check the format and try again.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleResetSettings = () => {
    preferences.resetToDefaults();
    toast({
      title: "Settings Reset",
      description: "All preferences have been reset to default values.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            Workspace Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Customize your AI App Builder experience to match your preferences
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImportSettings}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center space-x-2">
            <Layout className="h-4 w-4" />
            <span>Layout</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span>Features</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Visual Settings</CardTitle>
              <CardDescription>
                Customize the visual appearance of your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <div className="text-sm text-gray-500">
                    Enable smooth transitions and animations
                  </div>
                </div>
                <Switch
                  checked={preferences.animations}
                  onCheckedChange={(checked) => preferences.updatePreference('animations', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Editor Settings</CardTitle>
              <CardDescription>
                Configure your code editing experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Font Size: {preferences.fontSize}px</Label>
                <Slider
                  value={[preferences.fontSize]}
                  onValueChange={([value]) => preferences.updatePreference('fontSize', value)}
                  min={10}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select value={preferences.fontFamily} onValueChange={(value: any) => preferences.updatePreference('fontFamily', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mono">Monospace</SelectItem>
                    <SelectItem value="sans">Sans Serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tab Size: {preferences.tabSize} spaces</Label>
                <Slider
                  value={[preferences.tabSize]}
                  onValueChange={([value]) => preferences.updatePreference('tabSize', value)}
                  min={2}
                  max={8}
                  step={2}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-formatting</Label>
                  <div className="text-sm text-gray-500">
                    Automatically format code on save
                  </div>
                </div>
                <Switch
                  checked={preferences.codeFormatting}
                  onCheckedChange={(checked) => preferences.updatePreference('codeFormatting', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-complete</Label>
                  <div className="text-sm text-gray-500">
                    Enable intelligent code suggestions
                  </div>
                </div>
                <Switch
                  checked={preferences.autoComplete}
                  onCheckedChange={(checked) => preferences.updatePreference('autoComplete', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Layout</CardTitle>
              <CardDescription>
                Organize your development environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Layout Style</Label>
                <Select value={preferences.layout} onValueChange={(value: any) => preferences.updatePreference('layout', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="split">Split View</SelectItem>
                    <SelectItem value="stacked">Stacked View</SelectItem>
                    <SelectItem value="sidebar">Sidebar Layout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Panel Position</Label>
                <Select value={preferences.panelPosition} onValueChange={(value: any) => preferences.updatePreference('panelPosition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom">Bottom Panel</SelectItem>
                    <SelectItem value="right">Right Panel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sidebar Collapsed</Label>
                  <div className="text-sm text-gray-500">
                    Start with sidebar collapsed
                  </div>
                </div>
                <Switch
                  checked={preferences.sidebarCollapsed}
                  onCheckedChange={(checked) => preferences.updatePreference('sidebarCollapsed', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI & Development Features</CardTitle>
              <CardDescription>
                Configure AI assistance and development tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Platform</Label>
                <Select value={preferences.defaultPlatform} onValueChange={(value: any) => preferences.updatePreference('defaultPlatform', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ios">iOS (Swift)</SelectItem>
                    <SelectItem value="android">Android (Kotlin)</SelectItem>
                    <SelectItem value="react-native">React Native</SelectItem>
                    <SelectItem value="flutter">Flutter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Code Style</Label>
                <Select value={preferences.codeStyle} onValueChange={(value: any) => preferences.updatePreference('codeStyle', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI Hints</Label>
                  <div className="text-sm text-gray-500">
                    Show intelligent suggestions while coding
                  </div>
                </div>
                <Switch
                  checked={preferences.aiHints}
                  onCheckedChange={(checked) => preferences.updatePreference('aiHints', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Live Preview</Label>
                  <div className="text-sm text-gray-500">
                    Real-time preview of your app
                  </div>
                </div>
                <Switch
                  checked={preferences.livePreview}
                  onCheckedChange={(checked) => preferences.updatePreference('livePreview', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Save</Label>
                  <div className="text-sm text-gray-500">
                    Automatically save your work
                  </div>
                </div>
                <Switch
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => preferences.updatePreference('autoSave', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Developer Skill Level</Label>
                <Select value={preferences.skillLevel} onValueChange={(value: any) => preferences.updatePreference('skillLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - Detailed explanations</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Balanced approach</SelectItem>
                    <SelectItem value="advanced">Advanced - Optimized code only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Include Comments</Label>
                  <div className="text-sm text-gray-500">
                    Add explanatory comments to generated code
                  </div>
                </div>
                <Switch
                  checked={preferences.includeComments}
                  onCheckedChange={(checked) => preferences.updatePreference('includeComments', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications & Tips</CardTitle>
              <CardDescription>
                Control how the app communicates with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Notifications</Label>
                  <div className="text-sm text-gray-500">
                    Display system notifications
                  </div>
                </div>
                <Switch
                  checked={preferences.showNotifications}
                  onCheckedChange={(checked) => preferences.updatePreference('showNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound Effects</Label>
                  <div className="text-sm text-gray-500">
                    Play sounds for actions and notifications
                  </div>
                </div>
                <Switch
                  checked={preferences.soundEnabled}
                  onCheckedChange={(checked) => preferences.updatePreference('soundEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Tips</Label>
                  <div className="text-sm text-gray-500">
                    Display helpful tips and tutorials
                  </div>
                </div>
                <Switch
                  checked={preferences.showTips}
                  onCheckedChange={(checked) => preferences.updatePreference('showTips', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Keyboard Shortcuts</Label>
                  <div className="text-sm text-gray-500">
                    Show keyboard shortcut hints
                  </div>
                </div>
                <Switch
                  checked={preferences.showShortcuts}
                  onCheckedChange={(checked) => preferences.updatePreference('showShortcuts', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Quick Actions</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage your workspace settings
              </p>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline">
                {Object.keys(preferences).length - 4} settings configured
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}