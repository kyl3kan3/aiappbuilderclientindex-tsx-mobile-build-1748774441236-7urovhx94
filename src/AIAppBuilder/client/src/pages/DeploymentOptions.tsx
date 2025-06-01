import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Server, Database, GitBranch, Cog, Cloud, FileCode, Globe, 
  RotateCw, CheckCircle2, AlertCircle, PlusCircle, Trash2, 
  Mail, Download, Loader2, Layers, Copy, Settings
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

// Environment types
const environmentTypes = [
  { value: 'development', label: 'Development' },
  { value: 'staging', label: 'Staging' },
  { value: 'uat', label: 'User Acceptance Testing' },
  { value: 'production', label: 'Production' },
  { value: 'custom', label: 'Custom' }
];

// Deployment strategies
const deploymentStrategies = [
  { value: 'all_at_once', label: 'All at Once', description: 'Deploy to all instances simultaneously. Fast but risky.' },
  { value: 'rolling', label: 'Rolling Update', description: 'Update instances one at a time or in small batches.' },
  { value: 'blue_green', label: 'Blue/Green', description: 'Create a new environment and switch traffic once ready.' },
  { value: 'canary', label: 'Canary', description: 'Route a small percentage of traffic to the new version first.' },
  { value: 'feature_toggle', label: 'Feature Toggle', description: 'Deploy behind feature flags for gradual rollout.' }
];

// Target platforms
const targetPlatforms = [
  { value: 'aws', label: 'Amazon Web Services (AWS)', icon: <Cloud className="h-5 w-5 text-[#FF9900]" /> },
  { value: 'azure', label: 'Microsoft Azure', icon: <Cloud className="h-5 w-5 text-[#0078D4]" /> },
  { value: 'google_cloud', label: 'Google Cloud Platform', icon: <Cloud className="h-5 w-5 text-[#4285F4]" /> },
  { value: 'firebase', label: 'Firebase', icon: <Cloud className="h-5 w-5 text-[#FFCA28]" /> },
  { value: 'heroku', label: 'Heroku', icon: <Cloud className="h-5 w-5 text-[#430098]" /> },
  { value: 'cloud_foundry', label: 'Cloud Foundry', icon: <Cloud className="h-5 w-5 text-[#0C9ED5]" /> },
  { value: 'kubernetes', label: 'Kubernetes', icon: <Cloud className="h-5 w-5 text-[#326CE5]" /> },
  { value: 'openshift', label: 'OpenShift', icon: <Cloud className="h-5 w-5 text-[#EE0000]" /> },
  { value: 'self_hosted', label: 'Self-Hosted', icon: <Server className="h-5 w-5 text-gray-600" /> },
  { value: 'enterprise_server', label: 'Enterprise Server', icon: <Server className="h-5 w-5 text-gray-600" /> }
];

// Sample deployment configurations
const sampleDeploymentConfigs = [
  {
    id: 1,
    name: 'Development Environment',
    description: 'Development environment for feature testing',
    environmentType: 'development',
    deploymentStrategy: 'all_at_once',
    targetPlatform: 'aws',
    repositoryOwner: 'myorg',
    repositoryName: 'my-app',
    deploymentBranch: 'develop',
    autoDeployOnCommit: true,
    requireApproval: false,
    rollbackEnabled: true,
    backupBeforeDeployment: false,
    isActive: true,
    createdById: 1
  },
  {
    id: 2,
    name: 'Production Environment',
    description: 'Main production deployment',
    environmentType: 'production',
    deploymentStrategy: 'blue_green',
    targetPlatform: 'aws',
    repositoryOwner: 'myorg',
    repositoryName: 'my-app',
    deploymentBranch: 'main',
    autoDeployOnCommit: false,
    requireApproval: true,
    approvers: ['user1', 'user2'],
    rollbackEnabled: true,
    backupBeforeDeployment: true,
    customDomain: 'app.example.com',
    isActive: true,
    createdById: 1
  },
  {
    id: 3,
    name: 'Staging Environment',
    description: 'Staging for QA and testing',
    environmentType: 'staging',
    deploymentStrategy: 'canary',
    targetPlatform: 'kubernetes',
    repositoryOwner: 'myorg',
    repositoryName: 'my-app',
    deploymentBranch: 'staging',
    autoDeployOnCommit: true,
    requireApproval: true,
    rollbackEnabled: true,
    backupBeforeDeployment: true,
    healthCheckUrl: 'https://staging.example.com/health',
    isActive: true,
    createdById: 1
  }
];

// Sample deployment releases
const sampleDeploymentReleases = [
  {
    id: 1,
    deploymentConfigId: 1,
    version: 'v1.0.0',
    commitSha: 'abc123',
    status: 'success',
    deployedAt: new Date('2023-05-10T10:30:00Z'),
    deployedById: 1,
    logs: 'Deployment completed successfully',
    isActive: true
  },
  {
    id: 2,
    deploymentConfigId: 1,
    version: 'v1.1.0',
    commitSha: 'def456',
    status: 'failed',
    deployedAt: new Date('2023-05-15T14:20:00Z'),
    deployedById: 1,
    logs: 'Deployment failed due to build error',
    isActive: false
  },
  {
    id: 3,
    deploymentConfigId: 2,
    version: 'v1.0.0',
    commitSha: 'ghi789',
    status: 'success',
    deployedAt: new Date('2023-05-12T09:00:00Z'),
    deployedById: 1,
    approvedById: 2,
    logs: 'Production deployment successful',
    isActive: true
  }
];

const DeploymentOptions = () => {
  // State for configuration list and active configuration
  const [deploymentConfigs, setDeploymentConfigs] = useState(sampleDeploymentConfigs);
  const [deploymentReleases, setDeploymentReleases] = useState(sampleDeploymentReleases);
  const [activeConfig, setActiveConfig] = useState<number | null>(null);
  
  // State for showing dialogs
  const [showNewConfigDialog, setShowNewConfigDialog] = useState(false);
  const [showGenerateFilesDialog, setShowGenerateFilesDialog] = useState(false);
  
  // New configuration state
  const [newConfig, setNewConfig] = useState({
    name: '',
    description: '',
    environmentType: 'development',
    deploymentStrategy: 'all_at_once',
    targetPlatform: 'aws',
    repositoryOwner: '',
    repositoryName: '',
    deploymentBranch: 'main',
    buildCommand: 'npm run build',
    deployCommand: '',
    healthCheckUrl: '',
    autoDeployOnCommit: true,
    requireApproval: false,
    approvers: '',
    variables: '',
    secrets: '',
    customDomain: '',
    rollbackEnabled: true,
    backupBeforeDeployment: true
  });
  
  // Generate files state
  const [generateFilesConfig, setGenerateFilesConfig] = useState({
    configId: '',
    outputPath: '/deployment',
    includeWorkflows: true,
    includeManifests: true,
    includeScripts: true
  });
  
  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Get active configuration
  const activeConfigData = deploymentConfigs.find(config => config.id === activeConfig);
  
  // Get releases for active configuration
  const activeConfigReleases = deploymentReleases.filter(
    release => release.deploymentConfigId === activeConfig
  );
  
  // Handle new config change
  const handleNewConfigChange = (field: string, value: any) => {
    setNewConfig(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle generate files change
  const handleGenerateFilesChange = (field: string, value: any) => {
    setGenerateFilesConfig(prev => ({ ...prev, [field]: value }));
  };
  
  // Create new deployment configuration
  const createDeploymentConfig = () => {
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create new config
      const newDeploymentConfig = {
        id: deploymentConfigs.length + 1,
        ...newConfig,
        approvers: newConfig.approvers ? newConfig.approvers.split(',').map(a => a.trim()) : [],
        variables: newConfig.variables ? JSON.parse(`{${newConfig.variables}}`) : {},
        secrets: newConfig.secrets ? newConfig.secrets.split(',').map(s => s.trim()) : [],
        isActive: true,
        createdById: 1
      };
      
      setDeploymentConfigs([...deploymentConfigs, newDeploymentConfig]);
      setShowNewConfigDialog(false);
      setIsCreating(false);
      
      toast({
        title: "Deployment Configuration Created",
        description: `${newConfig.name} has been created successfully.`,
      });
      
      // Reset new config
      setNewConfig({
        name: '',
        description: '',
        environmentType: 'development',
        deploymentStrategy: 'all_at_once',
        targetPlatform: 'aws',
        repositoryOwner: '',
        repositoryName: '',
        deploymentBranch: 'main',
        buildCommand: 'npm run build',
        deployCommand: '',
        healthCheckUrl: '',
        autoDeployOnCommit: true,
        requireApproval: false,
        approvers: '',
        variables: '',
        secrets: '',
        customDomain: '',
        rollbackEnabled: true,
        backupBeforeDeployment: true
      });
    }, 1500);
  };
  
  // Generate deployment files
  const generateDeploymentFiles = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setShowGenerateFilesDialog(false);
      setIsGenerating(false);
      
      toast({
        title: "Deployment Files Generated",
        description: "Deployment files have been generated successfully.",
      });
    }, 2000);
  };
  
  // Deploy configuration
  const deployConfiguration = (configId: number) => {
    setIsDeploying(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create new release
      const newRelease = {
        id: deploymentReleases.length + 1,
        deploymentConfigId: configId,
        version: `v1.${deploymentReleases.length + 1}.0`,
        commitSha: Math.random().toString(36).substring(2, 8),
        status: 'success',
        deployedAt: new Date(),
        deployedById: 1,
        logs: 'Deployment completed successfully',
        isActive: true
      };
      
      setDeploymentReleases([...deploymentReleases, newRelease]);
      setIsDeploying(false);
      
      toast({
        title: "Deployment Successful",
        description: `Version ${newRelease.version} has been deployed.`,
      });
    }, 3000);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'building':
      case 'deploying':
        return 'text-blue-500';
      case 'queued':
        return 'text-yellow-500';
      case 'rolledback':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className={`h-5 w-5 ${getStatusColor(status)}`} />;
      case 'failed':
        return <AlertCircle className={`h-5 w-5 ${getStatusColor(status)}`} />;
      case 'building':
      case 'deploying':
        return <Loader2 className={`h-5 w-5 ${getStatusColor(status)} animate-spin`} />;
      case 'queued':
        return <Clock className={`h-5 w-5 ${getStatusColor(status)}`} />;
      case 'rolledback':
        return <RotateCw className={`h-5 w-5 ${getStatusColor(status)}`} />;
      default:
        return <Circle className={`h-5 w-5 ${getStatusColor(status)}`} />;
    }
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold">Deployment Options</h1>
        <p className="text-xl text-muted-foreground">
          Configure and manage deployments across all environments
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Deployment Configurations Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Server className="mr-2 h-5 w-5" />
                  Configurations
                </CardTitle>
                <Dialog open={showNewConfigDialog} onOpenChange={setShowNewConfigDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Create New Deployment Configuration</DialogTitle>
                      <DialogDescription>
                        Configure how your application will be deployed to a specific environment.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Configuration Name</Label>
                          <Input
                            id="name"
                            placeholder="Production Environment"
                            value={newConfig.name}
                            onChange={(e) => handleNewConfigChange('name', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description (Optional)</Label>
                          <Textarea
                            id="description"
                            placeholder="Main production deployment for customer-facing app"
                            value={newConfig.description}
                            onChange={(e) => handleNewConfigChange('description', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="environmentType">Environment Type</Label>
                          <Select 
                            value={newConfig.environmentType} 
                            onValueChange={(value) => handleNewConfigChange('environmentType', value)}
                          >
                            <SelectTrigger id="environmentType">
                              <SelectValue placeholder="Select environment type" />
                            </SelectTrigger>
                            <SelectContent>
                              {environmentTypes.map((env) => (
                                <SelectItem key={env.value} value={env.value}>
                                  {env.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="deploymentStrategy">Deployment Strategy</Label>
                          <Select 
                            value={newConfig.deploymentStrategy} 
                            onValueChange={(value) => handleNewConfigChange('deploymentStrategy', value)}
                          >
                            <SelectTrigger id="deploymentStrategy">
                              <SelectValue placeholder="Select deployment strategy" />
                            </SelectTrigger>
                            <SelectContent>
                              {deploymentStrategies.map((strategy) => (
                                <SelectItem key={strategy.value} value={strategy.value}>
                                  {strategy.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {deploymentStrategies.find(s => s.value === newConfig.deploymentStrategy)?.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="targetPlatform">Target Platform</Label>
                          <Select 
                            value={newConfig.targetPlatform} 
                            onValueChange={(value) => handleNewConfigChange('targetPlatform', value)}
                          >
                            <SelectTrigger id="targetPlatform">
                              <SelectValue placeholder="Select target platform" />
                            </SelectTrigger>
                            <SelectContent>
                              {targetPlatforms.map((platform) => (
                                <SelectItem key={platform.value} value={platform.value}>
                                  <div className="flex items-center">
                                    {platform.icon}
                                    <span className="ml-2">{platform.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="repositoryOwner">Repository Owner</Label>
                          <Input
                            id="repositoryOwner"
                            placeholder="organization-name"
                            value={newConfig.repositoryOwner}
                            onChange={(e) => handleNewConfigChange('repositoryOwner', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="repositoryName">Repository Name</Label>
                          <Input
                            id="repositoryName"
                            placeholder="project-name"
                            value={newConfig.repositoryName}
                            onChange={(e) => handleNewConfigChange('repositoryName', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="deploymentBranch">Deployment Branch</Label>
                          <Input
                            id="deploymentBranch"
                            placeholder="main"
                            value={newConfig.deploymentBranch}
                            onChange={(e) => handleNewConfigChange('deploymentBranch', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="buildCommand">Build Command (Optional)</Label>
                          <Input
                            id="buildCommand"
                            placeholder="npm run build"
                            value={newConfig.buildCommand}
                            onChange={(e) => handleNewConfigChange('buildCommand', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="healthCheckUrl">Health Check URL (Optional)</Label>
                          <Input
                            id="healthCheckUrl"
                            placeholder="https://example.com/health"
                            value={newConfig.healthCheckUrl}
                            onChange={(e) => handleNewConfigChange('healthCheckUrl', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                          <Input
                            id="customDomain"
                            placeholder="app.example.com"
                            value={newConfig.customDomain}
                            onChange={(e) => handleNewConfigChange('customDomain', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="autoDeployOnCommit" 
                            checked={newConfig.autoDeployOnCommit}
                            onCheckedChange={(checked) => handleNewConfigChange('autoDeployOnCommit', checked)}
                          />
                          <Label htmlFor="autoDeployOnCommit">Auto-deploy on commit</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="requireApproval" 
                            checked={newConfig.requireApproval}
                            onCheckedChange={(checked) => handleNewConfigChange('requireApproval', checked)}
                          />
                          <Label htmlFor="requireApproval">Require approval before deployment</Label>
                        </div>
                        
                        {newConfig.requireApproval && (
                          <div className="space-y-2">
                            <Label htmlFor="approvers">Approvers (comma-separated)</Label>
                            <Input
                              id="approvers"
                              placeholder="user1, user2"
                              value={newConfig.approvers}
                              onChange={(e) => handleNewConfigChange('approvers', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="rollbackEnabled" 
                            checked={newConfig.rollbackEnabled}
                            onCheckedChange={(checked) => handleNewConfigChange('rollbackEnabled', checked)}
                          />
                          <Label htmlFor="rollbackEnabled">Enable automatic rollback on failure</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="backupBeforeDeployment" 
                            checked={newConfig.backupBeforeDeployment}
                            onCheckedChange={(checked) => handleNewConfigChange('backupBeforeDeployment', checked)}
                          />
                          <Label htmlFor="backupBeforeDeployment">Create backup before deployment</Label>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="secrets">Secrets (comma-separated)</Label>
                          <Input
                            id="secrets"
                            placeholder="API_KEY, DATABASE_URL"
                            value={newConfig.secrets}
                            onChange={(e) => handleNewConfigChange('secrets', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="variables">Environment Variables (key: value pairs)</Label>
                          <Textarea
                            id="variables"
                            placeholder='"NODE_ENV": "production", "DEBUG": "false"'
                            value={newConfig.variables}
                            onChange={(e) => handleNewConfigChange('variables', e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Format as "KEY": "VALUE", "KEY2": "VALUE2"
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter className="mt-6">
                      <Button
                        type="submit"
                        onClick={createDeploymentConfig}
                        disabled={isCreating || !newConfig.name || !newConfig.repositoryOwner || !newConfig.repositoryName}
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>Create Configuration</>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                {deploymentConfigs.map((config) => (
                  <div
                    key={config.id}
                    className={`p-3 rounded-md cursor-pointer hover:bg-slate-100 transition-colors ${
                      activeConfig === config.id ? 'bg-slate-100' : ''
                    }`}
                    onClick={() => setActiveConfig(config.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{config.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                          {targetPlatforms.find(p => p.value === config.targetPlatform)?.icon}
                          <span className="ml-1 capitalize">{config.environmentType}</span>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        config.environmentType === 'production' 
                          ? 'bg-red-100 text-red-800' 
                          : config.environmentType === 'staging'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {config.environmentType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Deployment Configuration Details */}
        <div className="md:col-span-3">
          {activeConfig ? (
            activeConfigData ? (
              <Tabs defaultValue="overview">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{activeConfigData.name}</h2>
                    {activeConfigData.description && (
                      <p className="text-muted-foreground mt-1">{activeConfigData.description}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog open={showGenerateFilesDialog} onOpenChange={setShowGenerateFilesDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <FileCode className="h-4 w-4" />
                          Generate Files
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Generate Deployment Files</DialogTitle>
                          <DialogDescription>
                            Generate configuration files, workflows, and scripts for this deployment.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="outputPath">Output Path</Label>
                            <Input
                              id="outputPath"
                              placeholder="/deployment"
                              value={generateFilesConfig.outputPath}
                              onChange={(e) => handleGenerateFilesChange('outputPath', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Where to save the generated files
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="includeWorkflows" 
                                checked={generateFilesConfig.includeWorkflows}
                                onCheckedChange={(checked) => handleGenerateFilesChange('includeWorkflows', checked)}
                              />
                              <Label htmlFor="includeWorkflows">Include GitHub Workflows</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="includeManifests" 
                                checked={generateFilesConfig.includeManifests}
                                onCheckedChange={(checked) => handleGenerateFilesChange('includeManifests', checked)}
                              />
                              <Label htmlFor="includeManifests">Include Deployment Manifests</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="includeScripts" 
                                checked={generateFilesConfig.includeScripts}
                                onCheckedChange={(checked) => handleGenerateFilesChange('includeScripts', checked)}
                              />
                              <Label htmlFor="includeScripts">Include Deployment Scripts</Label>
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button
                            onClick={generateDeploymentFiles}
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>Generate Files</>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="default" 
                      className="flex items-center gap-2"
                      onClick={() => deployConfiguration(activeConfigData.id)}
                      disabled={isDeploying}
                    >
                      {isDeploying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Cloud className="h-4 w-4" />
                          Deploy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <TabsList className="mb-6">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="releases" className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Releases
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deployment Configuration</CardTitle>
                      <CardDescription>
                        Details of your deployment configuration
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                          
                          <dl className="space-y-4">
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Environment Type</dt>
                              <dd className="mt-1">
                                <span className={`text-sm px-2 py-1 rounded-full ${
                                  activeConfigData.environmentType === 'production' 
                                    ? 'bg-red-100 text-red-800' 
                                    : activeConfigData.environmentType === 'staging'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {activeConfigData.environmentType.charAt(0).toUpperCase() + activeConfigData.environmentType.slice(1)}
                                </span>
                              </dd>
                            </div>
                            
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Deployment Strategy</dt>
                              <dd className="mt-1">{deploymentStrategies.find(s => s.value === activeConfigData.deploymentStrategy)?.label}</dd>
                              <dd className="mt-1 text-sm text-muted-foreground">
                                {deploymentStrategies.find(s => s.value === activeConfigData.deploymentStrategy)?.description}
                              </dd>
                            </div>
                            
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Target Platform</dt>
                              <dd className="mt-1 flex items-center">
                                {targetPlatforms.find(p => p.value === activeConfigData.targetPlatform)?.icon}
                                <span className="ml-2">{targetPlatforms.find(p => p.value === activeConfigData.targetPlatform)?.label}</span>
                              </dd>
                            </div>
                            
                            {activeConfigData.customDomain && (
                              <div className="flex flex-col">
                                <dt className="text-sm font-medium text-muted-foreground">Custom Domain</dt>
                                <dd className="mt-1 flex items-center">
                                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {activeConfigData.customDomain}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Deployment Configuration</h3>
                          
                          <dl className="space-y-4">
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Repository</dt>
                              <dd className="mt-1">{activeConfigData.repositoryOwner}/{activeConfigData.repositoryName}</dd>
                            </div>
                            
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Deployment Branch</dt>
                              <dd className="mt-1 flex items-center">
                                <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                                {activeConfigData.deploymentBranch}
                              </dd>
                            </div>
                            
                            <div className="flex flex-col">
                              <dt className="text-sm font-medium text-muted-foreground">Deployment Options</dt>
                              <dd className="mt-1">
                                <ul className="list-disc pl-5 text-sm">
                                  <li className={activeConfigData.autoDeployOnCommit ? 'text-green-600' : 'text-muted-foreground'}>
                                    {activeConfigData.autoDeployOnCommit ? 'Automatic deployment on commit' : 'Manual deployment only'}
                                  </li>
                                  <li className={activeConfigData.requireApproval ? 'text-yellow-600' : 'text-muted-foreground'}>
                                    {activeConfigData.requireApproval ? 'Requires approval before deployment' : 'No approval required'}
                                  </li>
                                  <li className={activeConfigData.rollbackEnabled ? 'text-green-600' : 'text-muted-foreground'}>
                                    {activeConfigData.rollbackEnabled ? 'Automatic rollback on failure' : 'Manual rollback only'}
                                  </li>
                                  <li className={activeConfigData.backupBeforeDeployment ? 'text-green-600' : 'text-muted-foreground'}>
                                    {activeConfigData.backupBeforeDeployment ? 'Creates backup before deployment' : 'No backup before deployment'}
                                  </li>
                                </ul>
                              </dd>
                            </div>
                            
                            {activeConfigData.approvers && (
                              <div className="flex flex-col">
                                <dt className="text-sm font-medium text-muted-foreground">Approvers</dt>
                                <dd className="mt-1">
                                  {activeConfigData.approvers.join(', ')}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>
                    </CardContent>
                    
                    {activeConfigReleases.length > 0 && (
                      <>
                        <Separator />
                        
                        <CardHeader>
                          <CardTitle>Recent Deployments</CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-4">
                            {activeConfigReleases.slice(0, 3).map((release) => (
                              <div key={release.id} className="flex items-center justify-between p-3 rounded-md border">
                                <div className="flex items-center">
                                  {getStatusIcon(release.status)}
                                  <div className="ml-3">
                                    <div className="font-medium">{release.version}</div>
                                    <div className="text-xs text-muted-foreground">
                                      Deployed on {formatDate(release.deployedAt)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <Copy className="h-3.5 w-3.5 mr-1" />
                                    Commit: {release.commitSha}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </>
                    )}
                  </Card>
                </TabsContent>
                
                <TabsContent value="releases">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deployment Releases</CardTitle>
                      <CardDescription>
                        History of all deployments for this configuration
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      {activeConfigReleases.length === 0 ? (
                        <div className="text-center py-8">
                          <GitBranch className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                          <p className="text-muted-foreground">No releases yet</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => deployConfiguration(activeConfigData.id)}
                          >
                            <Cloud className="mr-2 h-4 w-4" />
                            Deploy First Release
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {activeConfigReleases.map((release) => (
                            <div key={release.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  {getStatusIcon(release.status)}
                                  <h3 className="text-lg font-medium ml-2">{release.version}</h3>
                                  <div className={`ml-3 text-xs px-2 py-0.5 rounded-full ${getStatusColor(release.status)} bg-opacity-10`}>
                                    {release.status}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <RotateCw className="h-3.5 w-3.5 mr-1" />
                                    Rollback
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-3.5 w-3.5 mr-1" />
                                    Download Logs
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <dl className="space-y-1">
                                    <div className="flex">
                                      <dt className="text-sm font-medium text-muted-foreground w-24">Commit:</dt>
                                      <dd className="text-sm">{release.commitSha}</dd>
                                    </div>
                                    <div className="flex">
                                      <dt className="text-sm font-medium text-muted-foreground w-24">Deployed:</dt>
                                      <dd className="text-sm">{formatDate(release.deployedAt)}</dd>
                                    </div>
                                    <div className="flex">
                                      <dt className="text-sm font-medium text-muted-foreground w-24">Deployed by:</dt>
                                      <dd className="text-sm">User {release.deployedById}</dd>
                                    </div>
                                  </dl>
                                </div>
                                
                                {release.approvedById && (
                                  <div>
                                    <dl className="space-y-1">
                                      <div className="flex">
                                        <dt className="text-sm font-medium text-muted-foreground w-24">Approved by:</dt>
                                        <dd className="text-sm">User {release.approvedById}</dd>
                                      </div>
                                    </dl>
                                  </div>
                                )}
                              </div>
                              
                              {release.logs && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Deployment Logs</h4>
                                  <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                    {release.logs}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deployment Settings</CardTitle>
                      <CardDescription>
                        Manage deployment configuration settings
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Deployment Options</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="autoDeployOnCommit">Auto-deploy on commit</Label>
                                <p className="text-sm text-muted-foreground">
                                  Automatically deploy when changes are pushed to the deployment branch
                                </p>
                              </div>
                              <Switch 
                                id="autoDeployOnCommit" 
                                checked={activeConfigData.autoDeployOnCommit}
                                // In a real app, this would update the config
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="requireApproval">Require approval before deployment</Label>
                                <p className="text-sm text-muted-foreground">
                                  Require explicit approval before deployment proceeds
                                </p>
                              </div>
                              <Switch 
                                id="requireApproval" 
                                checked={activeConfigData.requireApproval}
                                // In a real app, this would update the config
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="rollbackEnabled">Enable automatic rollback</Label>
                                <p className="text-sm text-muted-foreground">
                                  Automatically roll back to the previous version if deployment fails
                                </p>
                              </div>
                              <Switch 
                                id="rollbackEnabled" 
                                checked={activeConfigData.rollbackEnabled}
                                // In a real app, this would update the config
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="backupBeforeDeployment">Create backup before deployment</Label>
                                <p className="text-sm text-muted-foreground">
                                  Create a backup of the current deployment before updating
                                </p>
                              </div>
                              <Switch 
                                id="backupBeforeDeployment" 
                                checked={activeConfigData.backupBeforeDeployment}
                                // In a real app, this would update the config
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="emailNotifications">Email notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                  Send email notifications for deployment events
                                </p>
                              </div>
                              <Switch 
                                id="emailNotifications" 
                                checked={true}
                                // In a real app, this would update the config
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="slackNotifications">Slack notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                  Send Slack notifications for deployment events
                                </p>
                              </div>
                              <Switch 
                                id="slackNotifications" 
                                checked={false}
                                // In a real app, this would update the config
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border border-red-200 p-4 rounded-md">
                              <div>
                                <Label className="text-red-600">Delete this configuration</Label>
                                <p className="text-sm text-muted-foreground">
                                  Permanently delete this deployment configuration
                                </p>
                              </div>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Configuration not found</h3>
                  <p className="text-muted-foreground">The selected deployment configuration could not be found.</p>
                </div>
              </div>
            )
          ) : (
            <Card className="h-[500px]">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <Server className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h2 className="text-2xl font-bold mb-2">Deployment Options</h2>
                  <p className="text-muted-foreground mb-6">
                    Configure how your applications are deployed to various environments. 
                    Set up development, staging, and production deployments with different 
                    strategies and configurations.
                  </p>
                  <Button onClick={() => setShowNewConfigDialog(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeploymentOptions;