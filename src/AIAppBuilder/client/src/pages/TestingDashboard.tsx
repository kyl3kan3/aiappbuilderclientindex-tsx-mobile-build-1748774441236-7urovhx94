import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Square, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Smartphone, 
  Monitor, 
  Zap,
  Bug,
  Shield,
  TrendingUp,
  AlertTriangle,
  Target,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestSuite {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'ui' | 'performance' | 'security';
  platform: 'ios' | 'android' | 'both';
  status: 'idle' | 'running' | 'passed' | 'failed' | 'cancelled';
  duration: number;
  testCount: number;
  passedTests: number;
  failedTests: number;
  lastRun: string;
}

interface TestDevice {
  id: string;
  name: string;
  platform: 'ios' | 'android';
  version: string;
  type: 'simulator' | 'physical';
  status: 'available' | 'busy' | 'offline';
  location: string;
}

interface TestResult {
  id: string;
  suiteName: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  errorMessage?: string;
  screenshots?: string[];
  logs?: string[];
}

export default function TestingDashboard() {
  const [selectedSuite, setSelectedSuite] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('both');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch test suites
  const { data: testSuites, isLoading: suitesLoading } = useQuery<TestSuite[]>({
    queryKey: ['/api/phoenix/testing/suites'],
    refetchInterval: 5000,
  });

  // Fetch test devices
  const { data: testDevices, isLoading: devicesLoading } = useQuery<TestDevice[]>({
    queryKey: ['/api/phoenix/testing/devices'],
    refetchInterval: 10000,
  });

  // Fetch test results
  const { data: testResults, isLoading: resultsLoading } = useQuery<TestResult[]>({
    queryKey: ['/api/phoenix/testing/results', selectedSuite],
    refetchInterval: 3000,
  });

  // Run test suite mutation
  const runTestsMutation = useMutation({
    mutationFn: async ({ suiteId, deviceId }: { suiteId: string; deviceId?: string }) => {
      const response = await fetch('/api/phoenix/testing/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suiteId, deviceId, platform: selectedPlatform }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start test run');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tests Started",
        description: "Test suite execution has been initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/phoenix/testing'] });
    },
    onError: (error: any) => {
      toast({
        title: "Test Failed to Start",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled': return <Square className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'idle': 'outline',
      'running': 'secondary',
      'passed': 'default',
      'failed': 'destructive',
      'cancelled': 'outline'
    } as const;

    const colors = {
      'idle': 'bg-gray-500',
      'running': 'bg-blue-500',
      'passed': 'bg-green-500',
      'failed': 'bg-red-500',
      'cancelled': 'bg-gray-500'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} 
             className={status !== 'failed' ? colors[status as keyof typeof colors] + ' text-white' : ''}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case 'unit': return <Target className="h-4 w-4 text-blue-500" />;
      case 'integration': return <Activity className="h-4 w-4 text-purple-500" />;
      case 'ui': return <Monitor className="h-4 w-4 text-green-500" />;
      case 'performance': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'security': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <Bug className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return '🍎';
      case 'android': return '🤖';
      case 'both': return '📱';
      default: return '📱';
    }
  };

  const getDeviceStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-yellow-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const calculateSuccessRate = (suite: TestSuite) => {
    if (suite.testCount === 0) return 0;
    return (suite.passedTests / suite.testCount) * 100;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testing Dashboard</h1>
          <p className="text-gray-600">Automated testing and quality assurance for your mobile apps</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">All Platforms</SelectItem>
              <SelectItem value="ios">iOS Only</SelectItem>
              <SelectItem value="android">Android Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={() => runTestsMutation.mutate({ suiteId: 'all' })}
            disabled={runTestsMutation.isPending}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {runTestsMutation.isPending ? 'Starting...' : 'Run All Tests'}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Test Suites</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testSuites?.length || 0}</div>
            <div className="text-xs text-muted-foreground">
              {testSuites?.filter(s => s.status === 'running').length || 0} currently running
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testSuites?.length ? 
                Math.round(testSuites.reduce((acc, suite) => acc + calculateSuccessRate(suite), 0) / testSuites.length) 
                : 0}%
            </div>
            <div className="text-xs text-muted-foreground">
              Average across all suites
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testDevices?.filter(d => d.status === 'available').length || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              {testDevices?.length || 0} total devices
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testSuites?.reduce((acc, suite) => acc + suite.failedTests, 0) || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Across all test suites
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suites" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suites">Test Suites</TabsTrigger>
          <TabsTrigger value="devices">Test Devices</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="quality">Quality Gates</TabsTrigger>
        </TabsList>

        <TabsContent value="suites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {suitesLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              testSuites?.map((suite) => (
                <Card key={suite.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTestTypeIcon(suite.type)}
                        <CardTitle className="text-lg">{suite.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPlatformIcon(suite.platform)}</span>
                        {getStatusBadge(suite.status)}
                      </div>
                    </div>
                    <CardDescription>
                      {suite.type.charAt(0).toUpperCase() + suite.type.slice(1)} tests • 
                      Last run: {new Date(suite.lastRun).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Total Tests</div>
                        <div className="text-2xl font-bold">{suite.testCount}</div>
                      </div>
                      <div>
                        <div className="font-medium">Passed</div>
                        <div className="text-2xl font-bold text-green-600">{suite.passedTests}</div>
                      </div>
                      <div>
                        <div className="font-medium">Failed</div>
                        <div className="text-2xl font-bold text-red-600">{suite.failedTests}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Success Rate</span>
                        <span>{Math.round(calculateSuccessRate(suite))}%</span>
                      </div>
                      <Progress value={calculateSuccessRate(suite)} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Duration: {formatDuration(suite.duration)}
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => runTestsMutation.mutate({ suiteId: suite.id })}
                        disabled={suite.status === 'running' || runTestsMutation.isPending}
                      >
                        {suite.status === 'running' ? (
                          <>
                            <Square className="h-4 w-4 mr-2" />
                            Running
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Run Tests
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devicesLoading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              testDevices?.map((device) => (
                <Card key={device.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPlatformIcon(device.platform)}</span>
                        <CardTitle className="text-base">{device.name}</CardTitle>
                      </div>
                      <Badge variant={device.type === 'physical' ? 'default' : 'outline'}>
                        {device.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Version:</span> {device.version}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Location:</span> {device.location}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-1 font-medium ${getDeviceStatusColor(device.status)}`}>
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
              <CardDescription>
                Detailed results from the latest test runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {resultsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : testResults && testResults.length > 0 ? (
                  <div className="space-y-3">
                    {testResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <div className="font-medium">{result.testName}</div>
                            <div className="text-sm text-gray-500">
                              {result.suiteName} • {formatDuration(result.duration)}
                            </div>
                            {result.errorMessage && (
                              <div className="text-sm text-red-600 mt-1">
                                {result.errorMessage}
                              </div>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bug className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No test results available</p>
                    <p className="text-sm">Run some tests to see results here</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Gates</CardTitle>
                <CardDescription>
                  Automated quality thresholds that must pass before deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Unit Test Coverage</div>
                    <div className="text-sm text-gray-500">Minimum 80% coverage required</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Performance Tests</div>
                    <div className="text-sm text-gray-500">App startup &lt; 3 seconds</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">2.1s</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Security Scan</div>
                    <div className="text-sm text-gray-500">No critical vulnerabilities</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">1 Medium</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">UI Tests</div>
                    <div className="text-sm text-gray-500">Critical user flows passing</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Automation</CardTitle>
                <CardDescription>
                  Automated testing configuration and scheduling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Auto-testing enabled:</strong> Tests run automatically on every build and before deployment to app stores.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Test Schedule</div>
                  <div className="text-sm text-gray-600">
                    • Unit tests: On every commit<br/>
                    • Integration tests: Daily at 2 AM<br/>
                    • UI tests: Before every deployment<br/>
                    • Performance tests: Weekly
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Failure Notifications</div>
                  <div className="text-sm text-gray-600">
                    Team will be notified via email and Slack when critical tests fail.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}