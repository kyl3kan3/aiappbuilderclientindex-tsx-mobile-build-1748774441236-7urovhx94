import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  PlayCircle, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Smartphone, 
  Globe,
  Package,
  Settings,
  Eye,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeploymentConfig {
  id?: string;
  appName: string;
  bundleId: string;
  version: string;
  buildNumber: string;
  platform: 'ios' | 'android' | 'both';
  deploymentType: 'internal' | 'alpha' | 'beta' | 'production';
  releaseNotes: string;
  autoPublish: boolean;
  testGroups?: string[];
  rolloutPercentage?: number;
}

interface DeploymentStatus {
  id: string;
  status: 'pending' | 'uploading' | 'processing' | 'review' | 'approved' | 'published' | 'failed';
  platform: string;
  progress: number;
  lastUpdate: string;
  reviewNotes?: string;
}

export default function AppStoreDeployment() {
  const [activeTab, setActiveTab] = useState('configure');
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    appName: '',
    bundleId: '',
    version: '1.0.0',
    buildNumber: '1',
    platform: 'both',
    deploymentType: 'internal',
    releaseNotes: '',
    autoPublish: false,
    rolloutPercentage: 100
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch deployment configurations
  const { data: configs, isLoading: configsLoading } = useQuery({
    queryKey: ['/api/phoenix/deployment/configs'],
  });

  // Fetch deployment status
  const { data: deployments, isLoading: deploymentsLoading } = useQuery({
    queryKey: ['/api/phoenix/deployment/status'],
    refetchInterval: 5000, // Refresh every 5 seconds for live updates
  });

  // Create deployment mutation
  const createDeploymentMutation = useMutation({
    mutationFn: async (config: DeploymentConfig) => {
      const response = await fetch('/api/phoenix/deployment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create deployment');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Deployment Started",
        description: "Your app deployment has been initiated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/phoenix/deployment'] });
      setActiveTab('status');
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeploy = () => {
    if (!deploymentConfig.appName || !deploymentConfig.bundleId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    createDeploymentMutation.mutate(deploymentConfig);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'uploading': return <Upload className="h-4 w-4 text-blue-500" />;
      case 'processing': return <Package className="h-4 w-4 text-blue-500" />;
      case 'review': return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'published': return <Globe className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'pending': 'outline',
      'uploading': 'secondary',
      'processing': 'secondary',
      'review': 'default',
      'approved': 'default',
      'published': 'default',
      'failed': 'destructive'
    };

    const colors: Record<string, string> = {
      'pending': 'bg-gray-500',
      'uploading': 'bg-blue-500',
      'processing': 'bg-blue-500',
      'review': 'bg-yellow-500',
      'approved': 'bg-green-500',
      'published': 'bg-green-600',
      'failed': 'bg-red-500'
    };

    return (
      <Badge variant={variants[status]} className={status !== 'failed' ? colors[status] + ' text-white' : ''}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'ios': return '🍎';
      case 'android': return '🤖';
      default: return '📱';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">App Store Deployment</h1>
          <p className="text-gray-600">Deploy your apps to Apple App Store and Google Play Store</p>
        </div>
        <Button 
          onClick={handleDeploy}
          disabled={createDeploymentMutation.isPending}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          {createDeploymentMutation.isPending ? 'Deploying...' : 'Deploy App'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="status">Deployment Status</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Store Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* App Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  App Information
                </CardTitle>
                <CardDescription>
                  Basic information about your mobile application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="appName">App Name *</Label>
                  <Input
                    id="appName"
                    value={deploymentConfig.appName}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, appName: e.target.value })}
                    placeholder="My Awesome App"
                  />
                </div>

                <div>
                  <Label htmlFor="bundleId">Bundle/Package ID *</Label>
                  <Input
                    id="bundleId"
                    value={deploymentConfig.bundleId}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, bundleId: e.target.value })}
                    placeholder="com.company.myapp"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={deploymentConfig.version}
                      onChange={(e) => setDeploymentConfig({ ...deploymentConfig, version: e.target.value })}
                      placeholder="1.0.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buildNumber">Build Number</Label>
                    <Input
                      id="buildNumber"
                      value={deploymentConfig.buildNumber}
                      onChange={(e) => setDeploymentConfig({ ...deploymentConfig, buildNumber: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="platform">Target Platform</Label>
                  <Select
                    value={deploymentConfig.platform}
                    onValueChange={(value: 'ios' | 'android' | 'both') => 
                      setDeploymentConfig({ ...deploymentConfig, platform: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ios">🍎 iOS (App Store)</SelectItem>
                      <SelectItem value="android">🤖 Android (Play Store)</SelectItem>
                      <SelectItem value="both">📱 Both Platforms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Deployment Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Deployment Settings
                </CardTitle>
                <CardDescription>
                  Configure how your app will be released
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deploymentType">Deployment Type</Label>
                  <Select
                    value={deploymentConfig.deploymentType}
                    onValueChange={(value: 'internal' | 'alpha' | 'beta' | 'production') => 
                      setDeploymentConfig({ ...deploymentConfig, deploymentType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal Testing</SelectItem>
                      <SelectItem value="alpha">Alpha Testing</SelectItem>
                      <SelectItem value="beta">Beta Testing</SelectItem>
                      <SelectItem value="production">Production Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {deploymentConfig.deploymentType === 'production' && (
                  <div>
                    <Label htmlFor="rollout">Rollout Percentage</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={deploymentConfig.rolloutPercentage}
                        onChange={(e) => setDeploymentConfig({ 
                          ...deploymentConfig, 
                          rolloutPercentage: parseInt(e.target.value) || 100 
                        })}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-600">% of users</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Gradually release to a percentage of users
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoPublish"
                    checked={deploymentConfig.autoPublish}
                    onCheckedChange={(checked) => 
                      setDeploymentConfig({ ...deploymentConfig, autoPublish: checked })
                    }
                  />
                  <Label htmlFor="autoPublish">Auto-publish after review</Label>
                </div>

                <div>
                  <Label htmlFor="releaseNotes">Release Notes</Label>
                  <Textarea
                    id="releaseNotes"
                    value={deploymentConfig.releaseNotes}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, releaseNotes: e.target.value })}
                    placeholder="What's new in this version..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>Store Credentials Required:</strong> Make sure you have configured your Apple App Store Connect API key and Google Play Console service account in the Settings tab.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Deployments */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Active Deployments</CardTitle>
                <CardDescription>
                  Real-time status of ongoing deployments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {deploymentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : deployments && deployments.length > 0 ? (
                    <div className="space-y-4">
                      {deployments.map((deployment: DeploymentStatus) => (
                        <div key={deployment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{getPlatformIcon(deployment.platform)}</span>
                              <div>
                                <h4 className="font-medium">{deployment.platform} Deployment</h4>
                                <p className="text-sm text-gray-500">
                                  Last updated: {new Date(deployment.lastUpdate).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(deployment.status)}
                              {getStatusBadge(deployment.status)}
                            </div>
                          </div>
                          
                          <Progress value={deployment.progress} className="h-2 mb-2" />
                          <p className="text-sm text-gray-600">
                            {deployment.progress}% complete
                          </p>

                          {deployment.reviewNotes && (
                            <Alert className="mt-3">
                              <Eye className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Review Notes:</strong> {deployment.reviewNotes}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active deployments</p>
                      <p className="text-sm">Your deployments will appear here</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Deployment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {deployments?.filter((d: DeploymentStatus) => d.status === 'published').length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Published Apps</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {deployments?.filter((d: DeploymentStatus) => 
                      ['uploading', 'processing', 'review'].includes(d.status)
                    ).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {deployments?.filter((d: DeploymentStatus) => d.status === 'review').length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Under Review</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment History</CardTitle>
              <CardDescription>
                Complete history of all your app deployments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Deployment history will appear here</p>
                <p className="text-sm">Track all your past deployments and their outcomes</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🍎 Apple App Store Connect
                </CardTitle>
                <CardDescription>
                  Configure your Apple developer credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="appleKeyId">Key ID</Label>
                  <Input
                    id="appleKeyId"
                    placeholder="2X9R4HXF34"
                    type="password"
                  />
                </div>
                <div>
                  <Label htmlFor="appleIssuerId">Issuer ID</Label>
                  <Input
                    id="appleIssuerId"
                    placeholder="57246542-96fe-1a63-e053-0824d011072a"
                    type="password"
                  />
                </div>
                <div>
                  <Label htmlFor="applePrivateKey">Private Key (.p8 file)</Label>
                  <Input
                    id="applePrivateKey"
                    type="file"
                    accept=".p8"
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Apple Credentials
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🤖 Google Play Console
                </CardTitle>
                <CardDescription>
                  Configure your Google Play developer credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="googleServiceAccount">Service Account Email</Label>
                  <Input
                    id="googleServiceAccount"
                    placeholder="deploy@yourproject.iam.gserviceaccount.com"
                  />
                </div>
                <div>
                  <Label htmlFor="googleKeyFile">Service Account Key (JSON)</Label>
                  <Input
                    id="googleKeyFile"
                    type="file"
                    accept=".json"
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Google Credentials
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}