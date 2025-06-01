import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, Download, ExternalLink, RefreshCw, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BuildRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  workflow_id: number;
  head_branch: string;
  head_sha: string;
}

interface BuildArtifact {
  id: number;
  name: string;
  size_in_bytes: number;
  archive_download_url: string;
  created_at: string;
  expired: boolean;
}

interface BuildMonitorProps {
  owner?: string;
  repo?: string;
}

export default function BuildMonitor({ owner = 'demo-owner', repo = 'demo-repo' }: BuildMonitorProps) {
  const [selectedRun, setSelectedRun] = useState<BuildRun | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const queryClient = useQueryClient();

  // Fetch workflow runs
  const { data: runsData, isLoading: runsLoading, error: runsError } = useQuery({
    queryKey: ['/api/phoenix/github/repos', repo, 'runs'],
    refetchInterval: autoRefresh ? 5000 : false, // Refresh every 5 seconds if auto-refresh is on
  });

  // Fetch artifacts for selected run
  const { data: artifactsData } = useQuery({
    queryKey: ['/api/phoenix/github/repos', repo, 'runs', selectedRun?.id, 'artifacts'],
    enabled: !!selectedRun,
  });

  // Auto-select the first run when data loads
  useEffect(() => {
    if (runsData?.runs && runsData.runs.length > 0 && !selectedRun) {
      setSelectedRun(runsData.runs[0]);
    }
  }, [runsData, selectedRun]);

  const getStatusIcon = (status: string, conclusion: string | null) => {
    if (status === 'completed') {
      if (conclusion === 'success') {
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      } else if (conclusion === 'failure') {
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      }
    }
    if (status === 'in_progress') {
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getStatusBadge = (status: string, conclusion: string | null) => {
    if (status === 'completed') {
      if (conclusion === 'success') {
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      } else if (conclusion === 'failure') {
        return <Badge variant="destructive">Failed</Badge>;
      }
    }
    if (status === 'in_progress') {
      return <Badge variant="secondary" className="bg-blue-500 text-white">Building</Badge>;
    }
    if (status === 'queued') {
      return <Badge variant="outline">Queued</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const getBuildProgress = (status: string) => {
    switch (status) {
      case 'queued': return 10;
      case 'in_progress': return 50;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getPlatformIcon = (artifactName: string) => {
    if (artifactName.toLowerCase().includes('ios') || artifactName.includes('.ipa')) {
      return '🍎';
    } else if (artifactName.toLowerCase().includes('android') || artifactName.includes('.apk')) {
      return '🤖';
    } else if (artifactName.toLowerCase().includes('web')) {
      return '🌐';
    }
    return '📱';
  };

  if (runsError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load build data. Please check your GitHub configuration and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Build Monitor</h1>
          <p className="text-gray-600">Real-time monitoring of mobile app builds</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['/api/phoenix/github/repos'] });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Build Runs List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Recent Builds
            </CardTitle>
            <CardDescription>
              {owner}/{repo}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {runsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {runsData?.runs?.map((run: BuildRun) => (
                    <div
                      key={run.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedRun?.id === run.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedRun(run)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(run.status, run.conclusion)}
                          <div>
                            <p className="font-medium text-sm truncate max-w-[150px]">
                              {run.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(run.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(run.status, run.conclusion)}
                      </div>
                      <Progress 
                        value={getBuildProgress(run.status)} 
                        className="mt-2 h-1" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Build Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Build Details</span>
              {selectedRun && (
                <Button variant="outline" size="sm" asChild>
                  <a href={selectedRun.html_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRun ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="artifacts">Downloads</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Status</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(selectedRun.status, selectedRun.conclusion)}
                        {getStatusBadge(selectedRun.status, selectedRun.conclusion)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Branch</h3>
                      <p className="mt-1">{selectedRun.head_branch}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Started</h3>
                      <p className="mt-1">{new Date(selectedRun.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Commit</h3>
                      <p className="mt-1 font-mono text-sm">{selectedRun.head_sha.substring(0, 8)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Progress</h3>
                    <Progress value={getBuildProgress(selectedRun.status)} className="h-2" />
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedRun.status === 'completed' ? 'Build completed' : 
                       selectedRun.status === 'in_progress' ? 'Build in progress...' : 
                       selectedRun.status === 'queued' ? 'Build queued' : selectedRun.status}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="artifacts" className="space-y-4">
                  {artifactsData?.artifacts && artifactsData.artifacts.length > 0 ? (
                    <div className="space-y-3">
                      {artifactsData.artifacts.map((artifact: BuildArtifact) => (
                        <div key={artifact.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getPlatformIcon(artifact.name)}</span>
                              <div>
                                <h4 className="font-medium">{artifact.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {formatFileSize(artifact.size_in_bytes)} • Created {new Date(artifact.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              disabled={artifact.expired}
                              onClick={() => window.open(artifact.archive_download_url, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {artifact.expired ? 'Expired' : 'Download'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No build artifacts available</p>
                      <p className="text-sm">Build artifacts will appear here once the build completes</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="logs" className="space-y-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div className="space-y-1">
                      <div>🏗️  Build started for {selectedRun.head_branch}</div>
                      <div>📦  Setting up build environment...</div>
                      {selectedRun.status !== 'queued' && (
                        <>
                          <div>⚙️  Installing dependencies...</div>
                          <div>🔧  Configuring build tools...</div>
                        </>
                      )}
                      {selectedRun.status === 'in_progress' && (
                        <div className="animate-pulse">🔄  Building application...</div>
                      )}
                      {selectedRun.status === 'completed' && selectedRun.conclusion === 'success' && (
                        <>
                          <div>✅  Build completed successfully</div>
                          <div>📱  App bundle created</div>
                          <div>⬆️  Uploading artifacts...</div>
                        </>
                      )}
                      {selectedRun.status === 'completed' && selectedRun.conclusion === 'failure' && (
                        <div>❌  Build failed - check GitHub for detailed logs</div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedRun.html_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Logs on GitHub
                    </a>
                  </Button>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a build to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}