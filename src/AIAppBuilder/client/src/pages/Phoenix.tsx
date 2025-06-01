import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, Code, Download, Image, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiRequest } from '@/lib/queryClient';

const platforms = [
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'react-native', label: 'React Native' },
  { value: 'flutter', label: 'Flutter' }
];

const assetTypes = [
  { value: 'app_icon', label: 'App Icon' },
  { value: 'splash_screen', label: 'Splash Screen' },
  { value: 'background', label: 'Background' },
  { value: 'button', label: 'Button' },
  { value: 'icon', label: 'Icon' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'logo', label: 'Logo' }
];

const styles = [
  { value: 'flat', label: 'Flat' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'outlined', label: 'Outlined' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'skeuomorphic', label: 'Skeuomorphic' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'abstract', label: 'Abstract' }
];

const customizationTypes = [
  { value: 'add_feature', label: 'Add Feature' },
  { value: 'modify_feature', label: 'Modify Feature' },
  { value: 'remove_feature', label: 'Remove Feature' },
  { value: 'refactor', label: 'Refactor' },
  { value: 'optimize', label: 'Optimize' },
  { value: 'change_style', label: 'Change Style' },
  { value: 'fix_issue', label: 'Fix Issue' },
  { value: 'add_documentation', label: 'Add Documentation' },
  { value: 'change_ui', label: 'Change UI' },
  { value: 'add_test', label: 'Add Test' }
];

// Sample code for the code customizer
const sampleSwiftCode = `import SwiftUI

struct WeatherView: View {
    @State private var temperature: Double = 72.0
    @State private var condition: String = "Sunny"
    @State private var location: String = "San Francisco"
    
    var body: some View {
        VStack(spacing: 20) {
            Text(location)
                .font(.largeTitle)
                .bold()
            
            Text("\\(Int(temperature))°F")
                .font(.system(size: 70))
                .fontWeight(.thin)
            
            Text(condition)
                .font(.title)
                .foregroundColor(.secondary)
        }
        .padding()
    }
}
`;

const sampleKotlinCode = `package com.example.weatherapp

import androidx.compose.foundation.layout.*
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun WeatherScreen() {
    val temperature = remember { mutableStateOf(72.0) }
    val condition = remember { mutableStateOf("Sunny") }
    val location = remember { mutableStateOf("San Francisco") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = location.value,
            fontSize = 30.sp,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = "\${temperature.value.toInt()}°F",
            fontSize = 70.sp,
            fontWeight = FontWeight.Light
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = condition.value,
            fontSize = 24.sp,
            fontWeight = FontWeight.Normal
        )
    }
}
`;

const sampleReactCode = `import React, { useState } from 'react';


const WeatherScreen = () => {
  const [temperature, setTemperature] = useState(72.0);
  const [condition, setCondition] = useState('Sunny');
  const [location, setLocation] = useState('San Francisco');

  return (
    <div className="mobile-converted">
      <span className="mobile-converted">{location}</span>
      <span className="mobile-converted">{Math.round(temperature)}°F</span>
      <span className="mobile-converted">{condition}</span>
    </div>
  );
};

export default WeatherScreen;
`;

const sampleFlutterCode = `import 'package:flutter/material.dart';

class WeatherScreen extends StatefulWidget {
  const WeatherScreen({Key? key}) : super(key: key);

  @override
  _WeatherScreenState createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  double temperature = 72.0;
  String condition = 'Sunny';
  String location = 'San Francisco';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              location,
              style: const TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              '${temperature.round()}°F',
              style: const TextStyle(
                fontSize: 70,
                fontWeight: FontWeight.w200,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              condition,
              style: const TextStyle(
                fontSize: 24,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`;

const Phoenix = () => {
  // Asset Generator state
  const [assetForm, setAssetForm] = useState({
    appName: 'WeatherApp',
    platform: 'ios',
    assetType: 'app_icon',
    description: 'A modern weather app icon with blue sky and cloud elements',
    style: 'flat',
    primaryColor: '#4A90E2',
    secondaryColor: '#F5A623',
    accentColor: '#50E3C2',
    variations: 1,
    transparentBackground: false
  });
  
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetResult, setAssetResult] = useState<any>(null);
  const [assetError, setAssetError] = useState<string | null>(null);
  
  // Code Customizer state
  const [codeForm, setCodeForm] = useState({
    platform: 'ios',
    customizationType: 'add_feature',
    description: 'Add a weather forecast section below the current conditions that shows the next 5 days',
    code: sampleSwiftCode,
    fileName: 'WeatherView.swift'
  });
  
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeResult, setCodeResult] = useState<any>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  
  // Handle asset form changes
  const handleAssetFormChange = (field: string, value: any) => {
    setAssetForm(prev => ({ ...prev, [field]: value }));
    
    // Update code sample when platform changes
    if (field === 'platform') {
      switch (value) {
        case 'ios':
          setCodeForm(prev => ({ ...prev, code: sampleSwiftCode, fileName: 'WeatherView.swift' }));
          break;
        case 'android':
          setCodeForm(prev => ({ ...prev, code: sampleKotlinCode, fileName: 'WeatherScreen.kt' }));
          break;
        case 'react-native':
          setCodeForm(prev => ({ ...prev, code: sampleReactCode, fileName: 'WeatherScreen.jsx' }));
          break;
        case 'flutter':
          setCodeForm(prev => ({ ...prev, code: sampleFlutterCode, fileName: 'weather_screen.dart' }));
          break;
      }
      setCodeForm(prev => ({ ...prev, platform: value }));
    }
  };
  
  // Handle code form changes
  const handleCodeFormChange = (field: string, value: any) => {
    setCodeForm(prev => ({ ...prev, [field]: value }));
  };
  
  // Generate asset
  const generateAsset = async () => {
    setAssetLoading(true);
    setAssetError(null);
    setAssetResult(null);
    
    try {
      const response = await apiRequest('/api/phoenix/api/v3/assets/generate', {
        method: 'POST',
        data: {
          appName: assetForm.appName,
          platform: assetForm.platform,
          assetType: assetForm.assetType,
          description: assetForm.description,
          style: assetForm.style,
          colorScheme: {
            primary: assetForm.primaryColor,
            secondary: assetForm.secondaryColor,
            accent: assetForm.accentColor
          },
          variations: assetForm.variations,
          transparentBackground: assetForm.transparentBackground
        }
      });
      
      setAssetResult(response.result);
    } catch (error) {
      console.error('Error generating asset:', error);
      setAssetError(error instanceof Error ? error.message : 'Failed to generate asset');
    } finally {
      setAssetLoading(false);
    }
  };
  
  // Customize code
  const customizeCode = async () => {
    setCodeLoading(true);
    setCodeError(null);
    setCodeResult(null);
    
    try {
      const response = await apiRequest('/api/phoenix/api/v3/customize/customize', {
        method: 'POST',
        data: {
          code: codeForm.code,
          platform: codeForm.platform,
          customizationType: codeForm.customizationType,
          description: codeForm.description,
          fileName: codeForm.fileName
        }
      });
      
      setCodeResult(response.result);
    } catch (error) {
      console.error('Error customizing code:', error);
      setCodeError(error instanceof Error ? error.message : 'Failed to customize code');
    } finally {
      setCodeLoading(false);
    }
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-2">Project Phoenix</h1>
      <p className="text-xl text-muted-foreground mb-8">AI-Powered Mobile App Generation Platform</p>
      
      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Asset Generator
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code Customizer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Generate App Assets</CardTitle>
                <CardDescription>
                  Create custom assets for your mobile app using AI
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">App Name</Label>
                  <Input 
                    id="appName" 
                    value={assetForm.appName} 
                    onChange={(e) => handleAssetFormChange('appName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select 
                    value={assetForm.platform} 
                    onValueChange={(value) => handleAssetFormChange('platform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assetType">Asset Type</Label>
                  <Select 
                    value={assetForm.assetType} 
                    onValueChange={(value) => handleAssetFormChange('assetType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={assetForm.description} 
                    onChange={(e) => handleAssetFormChange('description', e.target.value)}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Describe what you want the asset to look like
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select 
                    value={assetForm.style} 
                    onValueChange={(value) => handleAssetFormChange('style', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {"mobile-converted"((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="primaryColor" 
                        value={assetForm.primaryColor} 
                        onChange={(e) => handleAssetFormChange('primaryColor', e.target.value)}
                      />
                      <div 
                        className="w-10 h-10 rounded-md border" 
                        style={{ backgroundColor: assetForm.primaryColor }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="secondaryColor" 
                        value={assetForm.secondaryColor} 
                        onChange={(e) => handleAssetFormChange('secondaryColor', e.target.value)}
                      />
                      <div 
                        className="w-10 h-10 rounded-md border" 
                        style={{ backgroundColor: assetForm.secondaryColor }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="accentColor" 
                        value={assetForm.accentColor} 
                        onChange={(e) => handleAssetFormChange('accentColor', e.target.value)}
                      />
                      <div 
                        className="w-10 h-10 rounded-md border" 
                        style={{ backgroundColor: assetForm.accentColor }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="transparentBg" 
                    checked={assetForm.transparentBackground} 
                    onCheckedChange={(checked) => handleAssetFormChange('transparentBackground', checked)}
                  />
                  <Label htmlFor="transparentBg">Transparent Background</Label>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={generateAsset} 
                  disabled={assetLoading} 
                  className="w-full"
                >
                  {assetLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>Generate Asset</>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Generated Asset</CardTitle>
                <CardDescription>
                  Preview of your AI-generated asset
                </CardDescription>
              </CardHeader>
              
              <CardContent className="min-h-[400px] flex flex-col items-center justify-center">
                {assetLoading && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                    <p className="text-lg font-medium">Generating your asset...</p>
                    <p className="text-sm text-muted-foreground mt-2">This may take up to a minute</p>
                  </div>
                )}
                
                {assetError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{assetError}</AlertDescription>
                  </Alert>
                )}
                
                {assetResult && (
                  <div className="flex flex-col items-center">
                    {assetResult.base64Content && (
                      <div className="mb-4 border rounded-lg p-4 bg-muted/20">
                        <img 
                          src={`data:image/png;base64,${assetResult.base64Content}`} 
                          alt="Generated Asset" 
                          className="max-w-full max-h-[300px] object-contain"
                        />
                      </div>
                    )}
                    
                    {assetResult.svgContent && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">SVG Version</h3>
                        <div className="bg-muted p-4 rounded-md overflow-auto max-h-[200px]">
                          <pre className="text-xs">{assetResult.svgContent}</pre>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 w-full">
                      <h3 className="font-medium mb-2">Asset Details</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="font-medium">Type:</dt>
                        <dd>{assetResult.metadata?.assetType}</dd>
                        
                        <dt className="font-medium">Platform:</dt>
                        <dd>{assetResult.metadata?.platform}</dd>
                        
                        <dt className="font-medium">Style:</dt>
                        <dd>{assetResult.metadata?.style}</dd>
                        
                        <dt className="font-medium">Dimensions:</dt>
                        <dd>{assetResult.metadata?.dimensions.width}x{assetResult.metadata?.dimensions.height}</dd>
                      </dl>
                    </div>
                    
                    {assetResult.filePath && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.open(assetResult.filePath, '_blank')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Asset
                      </Button>
                    )}
                  </div>
                )}
                
                {!assetLoading && !assetResult && !assetError && (
                  <div className="text-center text-muted-foreground">
                    <Image className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Your generated asset will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="code">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Customize Code</CardTitle>
                <CardDescription>
                  Enhance, modify, or fix your code using AI
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codePlatform">Platform</Label>
                  <Select 
                    value={codeForm.platform} 
                    onValueChange={(value) => handleCodeFormChange('platform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customizationType">Customization Type</Label>
                  <Select 
                    value={codeForm.customizationType} 
                    onValueChange={(value) => handleCodeFormChange('customizationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customization type" />
                    </SelectTrigger>
                    <SelectContent>
                      {customizationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="codeDescription">Description</Label>
                  <Textarea 
                    id="codeDescription" 
                    value={codeForm.description} 
                    onChange={(e) => handleCodeFormChange('description', e.target.value)}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Describe what changes you want to make to the code
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fileName">File Name</Label>
                  <Input 
                    id="fileName" 
                    value={codeForm.fileName} 
                    onChange={(e) => handleCodeFormChange('fileName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">Source Code</Label>
                  <div className="relative">
                    <Textarea 
                      id="code" 
                      value={codeForm.code} 
                      onChange={(e) => handleCodeFormChange('code', e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Paste the code you want to customize
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={customizeCode} 
                  disabled={codeLoading} 
                  className="w-full"
                >
                  {codeLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Customizing...
                    </>
                  ) : (
                    <>Customize Code</>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customized Code</CardTitle>
                <CardDescription>
                  Results of AI code customization
                </CardDescription>
              </CardHeader>
              
              <CardContent className="min-h-[400px]">
                {codeLoading && (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                    <p className="text-lg font-medium">Customizing your code...</p>
                    <p className="text-sm text-muted-foreground mt-2">This may take up to a minute</p>
                  </div>
                )}
                
                {codeError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{codeError}</AlertDescription>
                  </Alert>
                )}
                
                {codeResult && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Customized Code</h3>
                      <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                        <pre className="text-xs font-mono whitespace-pre-wrap">{codeResult.customizedCode}</pre>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Explanation</h3>
                      <div className="text-sm">
                        {codeResult.explanation.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                    
                    {codeResult.impactedAreas && codeResult.impactedAreas.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Impacted Areas</h3>
                        <ul className="list-disc pl-5 text-sm">
                          {codeResult.impactedAreas.map((area, i) => (
                            <li key={i}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {codeResult.suggestedAdditionalChanges && codeResult.suggestedAdditionalChanges.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Suggested Additional Changes</h3>
                        <ul className="list-disc pl-5 text-sm">
                          {codeResult.suggestedAdditionalChanges.map((change, i) => (
                            <li key={i}>
                              <strong>{change.fileName}</strong>: {change.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {!codeLoading && !codeResult && !codeError && (
                  <div className="text-center text-muted-foreground py-12">
                    <Code className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Your customized code will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Phoenix;