import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Activity,
  Users,
  Smartphone,
  Code,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  Target,
  Zap,
  Globe,
  Clock,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsMetrics {
  overview: {
    totalProjects: number;
    activeUsers: number;
    totalBuilds: number;
    successRate: number;
  };
  usage: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    avgSessionDuration: number;
  };
  performance: {
    avgBuildTime: number;
    codeGenerationSpeed: number;
    apiResponseTime: number;
    systemUptime: number;
  };
  revenue: {
    monthlyRevenue: number;
    growth: number;
    avgRevenuePerUser: number;
    churnRate: number;
  };
}

interface ProjectAnalytics {
  id: string;
  name: string;
  platform: 'ios' | 'android' | 'react_native' | 'flutter';
  createdAt: string;
  builds: number;
  deployments: number;
  codeQuality: number;
  userEngagement: number;
  performanceScore: number;
  lastActivity: string;
}

interface UserBehavior {
  feature: string;
  usage: number;
  growth: number;
  category: 'core' | 'advanced' | 'premium';
  retention: number;
  satisfaction: number;
}

interface TrendData {
  period: string;
  projects: number;
  users: number;
  builds: number;
  revenue: number;
}

interface GeographicData {
  country: string;
  users: number;
  projects: number;
  revenue: number;
  growth: number;
}

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery<AnalyticsMetrics>({
    queryKey: ['/api/analytics/metrics', timeRange],
    refetchInterval: 60000,
  });

  // Fetch project analytics
  const { data: projects, isLoading: projectsLoading } = useQuery<ProjectAnalytics[]>({
    queryKey: ['/api/analytics/projects', timeRange, filterPlatform],
    refetchInterval: 120000,
  });

  // Fetch user behavior data
  const { data: userBehavior, isLoading: behaviorLoading } = useQuery<UserBehavior[]>({
    queryKey: ['/api/analytics/behavior', timeRange],
    refetchInterval: 300000,
  });

  // Fetch trend data
  const { data: trends, isLoading: trendsLoading } = useQuery<TrendData[]>({
    queryKey: ['/api/analytics/trends', timeRange],
    refetchInterval: 300000,
  });

  // Fetch geographic data
  const { data: geographic, isLoading: geoLoading } = useQuery<GeographicData[]>({
    queryKey: ['/api/analytics/geographic', timeRange],
    refetchInterval: 600000,
  });

  // Export analytics data
  const exportMutation = useMutation({
    mutationFn: async ({ format, timeRange }: { format: string; timeRange: string }) => {
      const response = await fetch(`/api/analytics/export?format=${format}&timeRange=${timeRange}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to export analytics data');
      }
      
      return response.blob();
    },
    onSuccess: (data, variables) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `analytics-report-${variables.timeRange}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Analytics report has been downloaded successfully.",
      });
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return '📱';
      case 'android': return '🤖';
      case 'react_native': return '⚛️';
      case 'flutter': return '🦋';
      default: return '📱';
    }
  };

  const getPlatformBadge = (platform: string) => {
    const colors = {
      ios: 'bg-gray-500 text-white',
      android: 'bg-green-500 text-white',
      react_native: 'bg-blue-500 text-white',
      flutter: 'bg-purple-500 text-white'
    };

    return (
      <Badge className={colors[platform as keyof typeof colors] || 'bg-gray-500 text-white'}>
        {platform.replace('_', ' ').charAt(0).toUpperCase() + platform.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      core: 'bg-blue-500 text-white',
      advanced: 'bg-purple-500 text-white',
      premium: 'bg-gold-500 text-white'
    };

    return (
      <Badge className={colors[category as keyof typeof colors] || 'bg-gray-500 text-white'}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getTrendIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProjects = projects?.filter(project => {
    return filterPlatform === 'all' || project.platform === filterPlatform;
  }) || [];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive business intelligence and performance insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={() => exportMutation.mutate({ format: 'csv', timeRange })}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metricsLoading ? '...' : formatNumber(metrics?.overview.totalProjects || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metricsLoading ? '...' : formatNumber(metrics?.overview.activeUsers || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Daily active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Build Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metricsLoading ? '...' : formatPercentage(metrics?.overview.successRate || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Successful builds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metricsLoading ? '...' : formatCurrency(metrics?.revenue.monthlyRevenue || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              {metrics?.revenue.growth && (
                <>
                  {getTrendIcon(metrics.revenue.growth)}
                  <span className="ml-1">{formatPercentage(Math.abs(metrics.revenue.growth))} vs last month</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="users">User Behavior</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>User engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Daily Active Users</span>
                    <span className="font-bold text-blue-600">
                      {formatNumber(metrics?.usage.dailyActiveUsers || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weekly Active Users</span>
                    <span className="font-bold text-green-600">
                      {formatNumber(metrics?.usage.weeklyActiveUsers || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Active Users</span>
                    <span className="font-bold text-purple-600">
                      {formatNumber(metrics?.usage.monthlyActiveUsers || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg Session Duration</span>
                    <span className="font-bold">
                      {formatDuration(metrics?.usage.avgSessionDuration || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
                <CardDescription>Financial performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Monthly Revenue</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(metrics?.revenue.monthlyRevenue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth Rate</span>
                    <div className="flex items-center">
                      {metrics?.revenue.growth && getTrendIcon(metrics.revenue.growth)}
                      <span className="font-bold ml-1">
                        {formatPercentage(Math.abs(metrics?.revenue.growth || 0))}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg Revenue Per User</span>
                    <span className="font-bold text-purple-600">
                      {formatCurrency(metrics?.revenue.avgRevenuePerUser || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Churn Rate</span>
                    <span className="font-bold text-red-600">
                      {formatPercentage(metrics?.revenue.churnRate || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>System performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatDuration(metrics?.performance.avgBuildTime || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Build Time</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics?.performance.codeGenerationSpeed || 0}/min
                  </div>
                  <div className="text-sm text-gray-600">Code Generation</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics?.performance.apiResponseTime || 0}ms
                  </div>
                  <div className="text-sm text-gray-600">API Response</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPercentage(metrics?.performance.systemUptime || 0)}
                  </div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Analytics</CardTitle>
                  <CardDescription>Performance insights for individual projects</CardDescription>
                </div>
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="ios">iOS</SelectItem>
                    <SelectItem value="android">Android</SelectItem>
                    <SelectItem value="react_native">React Native</SelectItem>
                    <SelectItem value="flutter">Flutter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {projectsLoading ? (
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredProjects.length > 0 ? (
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <Card key={project.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{getPlatformIcon(project.platform)}</div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{project.name}</h4>
                                  {getPlatformBadge(project.platform)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {project.builds} builds • {project.deployments} deployments
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                  <div className={`font-bold ${getQualityColor(project.codeQuality)}`}>
                                    {project.codeQuality}%
                                  </div>
                                  <div className="text-gray-500">Quality</div>
                                </div>
                                <div className="text-center">
                                  <div className={`font-bold ${getQualityColor(project.userEngagement)}`}>
                                    {project.userEngagement}%
                                  </div>
                                  <div className="text-gray-500">Engagement</div>
                                </div>
                                <div className="text-center">
                                  <div className={`font-bold ${getQualityColor(project.performanceScore)}`}>
                                    {project.performanceScore}%
                                  </div>
                                  <div className="text-gray-500">Performance</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No project data</h3>
                    <p className="text-gray-600">No projects match your filter criteria</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Behavior Analysis</CardTitle>
              <CardDescription>Feature usage and user engagement patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {behaviorLoading ? (
                  <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : userBehavior && userBehavior.length > 0 ? (
                  <div className="space-y-3">
                    {userBehavior.map((behavior, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Target className="h-5 w-5 text-blue-500" />
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{behavior.feature}</h4>
                                  {getCategoryBadge(behavior.category)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {formatNumber(behavior.usage)} uses • {formatPercentage(behavior.retention)} retention
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <div className="flex items-center">
                                    {getTrendIcon(behavior.growth)}
                                    <span className="font-bold ml-1">
                                      {formatPercentage(Math.abs(behavior.growth))}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">Growth</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-purple-600">
                                    {formatPercentage(behavior.satisfaction)}
                                  </div>
                                  <div className="text-xs text-gray-500">Satisfaction</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No behavior data</h3>
                    <p className="text-gray-600">User behavior analytics will appear here</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Build Time</span>
                    <span className="font-bold">
                      {formatDuration(metrics?.performance.avgBuildTime || 0)}
                    </span>
                  </div>
                  <Progress value={85} className="mt-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Code Generation Speed</span>
                    <span className="font-bold">
                      {metrics?.performance.codeGenerationSpeed || 0} files/min
                    </span>
                  </div>
                  <Progress value={92} className="mt-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>API Response Time</span>
                    <span className="font-bold">
                      {metrics?.performance.apiResponseTime || 0}ms
                    </span>
                  </div>
                  <Progress value={78} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>System resource usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>CPU Usage</span>
                    <span className="font-bold text-blue-600">68%</span>
                  </div>
                  <Progress value={68} className="mt-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Memory Usage</span>
                    <span className="font-bold text-green-600">45%</span>
                  </div>
                  <Progress value={45} className="mt-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Storage Usage</span>
                    <span className="font-bold text-purple-600">72%</span>
                  </div>
                  <Progress value={72} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User and revenue distribution by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {geoLoading ? (
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : geographic && geographic.length > 0 ? (
                  <div className="space-y-3">
                    {geographic.map((geo, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Globe className="h-5 w-5 text-blue-500" />
                              <div>
                                <h4 className="font-medium">{geo.country}</h4>
                                <div className="text-sm text-gray-600">
                                  {formatNumber(geo.users)} users • {formatNumber(geo.projects)} projects
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <div className="font-bold text-green-600">
                                    {formatCurrency(geo.revenue)}
                                  </div>
                                  <div className="text-xs text-gray-500">Revenue</div>
                                </div>
                                <div className="text-center flex items-center">
                                  {getTrendIcon(geo.growth)}
                                  <span className="font-bold ml-1">
                                    {formatPercentage(Math.abs(geo.growth))}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Globe className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No geographic data</h3>
                    <p className="text-gray-600">Geographic analytics will appear here</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}