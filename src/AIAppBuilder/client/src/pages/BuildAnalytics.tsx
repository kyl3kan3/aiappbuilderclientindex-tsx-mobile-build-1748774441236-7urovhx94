import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Smartphone,
  Zap,
  Target,
  Activity,
  Calendar,
  Users
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalBuilds: number;
    successRate: number;
    averageBuildTime: number;
    failureRate: number;
    trendsComparison: {
      buildsChange: number;
      successRateChange: number;
      buildTimeChange: number;
    };
  };
  platformBreakdown: {
    ios: number;
    android: number;
    reactNative: number;
    flutter: number;
  };
  timeSeriesData: Array<{
    date: string;
    builds: number;
    successful: number;
    failed: number;
    avgBuildTime: number;
  }>;
  buildTypeDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topFailureReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  performanceMetrics: {
    fastestBuild: number;
    slowestBuild: number;
    medianBuildTime: number;
    p95BuildTime: number;
  };
  recommendations: Array<{
    type: 'optimization' | 'warning' | 'info';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}

export default function BuildAnalytics() {
  const [timeRange, setTimeRange] = useState('30');
  const [selectedRepo, setSelectedRepo] = useState('all');

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: [`/api/phoenix/analytics/dashboard?days=${timeRange}&repo=${selectedRepo}`],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatPercentage = (value: number) => `${Math.round(value * 100) / 100}%`;

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Target className="h-4 w-4 text-gray-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const;
    
    return <Badge variant={variants[impact as keyof typeof variants]}>{impact.toUpperCase()}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Build Analytics</h1>
          <p className="text-gray-600">Insights and performance metrics for your mobile app builds</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedRepo} onValueChange={setSelectedRepo}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Repositories</SelectItem>
              <SelectItem value="demo-repo">demo-repo</SelectItem>
              <SelectItem value="my-app">my-app</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Builds</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.overview.totalBuilds || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getChangeIcon(analytics?.overview.trendsComparison.buildsChange || 0)}
              <span className={`ml-1 ${getChangeColor(analytics?.overview.trendsComparison.buildsChange || 0)}`}>
                {Math.abs(analytics?.overview.trendsComparison.buildsChange || 0)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(analytics?.overview.successRate || 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getChangeIcon(analytics?.overview.trendsComparison.successRateChange || 0)}
              <span className={`ml-1 ${getChangeColor(analytics?.overview.trendsComparison.successRateChange || 0)}`}>
                {Math.abs(analytics?.overview.trendsComparison.successRateChange || 0)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Build Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(analytics?.overview.averageBuildTime || 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getChangeIcon(-(analytics?.overview.trendsComparison.buildTimeChange || 0))}
              <span className={`ml-1 ${getChangeColor(-(analytics?.overview.trendsComparison.buildTimeChange || 0))}`}>
                {Math.abs(analytics?.overview.trendsComparison.buildTimeChange || 0)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(analytics?.overview.failureRate || 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getChangeIcon(-(analytics?.overview.trendsComparison.successRateChange || 0))}
              <span className="ml-1 text-gray-600">
                Inverse of success rate trend
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="failures">Failures</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Build Volume Over Time</CardTitle>
                <CardDescription>Number of builds per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics?.timeSeriesData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="builds" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success vs Failure Trends</CardTitle>
                <CardDescription>Build outcomes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.timeSeriesData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="successful" stroke="#00C49F" strokeWidth={2} />
                    <Line type="monotone" dataKey="failed" stroke="#FF8042" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Build Time Trends</CardTitle>
              <CardDescription>Average build duration over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.timeSeriesData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatDuration(Number(value)), 'Build Time']} />
                  <Line 
                    type="monotone" 
                    dataKey="avgBuildTime" 
                    stroke="#0088FE" 
                    strokeWidth={3}
                    dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Builds by platform type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'iOS', value: analytics?.platformBreakdown.ios || 0, color: '#0088FE' },
                        { name: 'Android', value: analytics?.platformBreakdown.android || 0, color: '#00C49F' },
                        { name: 'React Native', value: analytics?.platformBreakdown.reactNative || 0, color: '#FFBB28' },
                        { name: 'Flutter', value: analytics?.platformBreakdown.flutter || 0, color: '#FF8042' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'iOS', value: analytics?.platformBreakdown.ios || 0, color: '#0088FE' },
                        { name: 'Android', value: analytics?.platformBreakdown.android || 0, color: '#00C49F' },
                        { name: 'React Native', value: analytics?.platformBreakdown.reactNative || 0, color: '#FFBB28' },
                        { name: 'Flutter', value: analytics?.platformBreakdown.flutter || 0, color: '#FF8042' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Build Type Distribution</CardTitle>
                <CardDescription>Debug vs Release builds</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.buildTypeDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Fastest Build</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatDuration(analytics?.performanceMetrics.fastestBuild || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Median Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatDuration(analytics?.performanceMetrics.medianBuildTime || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">95th Percentile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatDuration(analytics?.performanceMetrics.p95BuildTime || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Slowest Build</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatDuration(analytics?.performanceMetrics.slowestBuild || 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="failures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Failure Reasons</CardTitle>
              <CardDescription>Most common causes of build failures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topFailureReasons.map((failure, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{failure.reason}</div>
                      <div className="text-sm text-gray-500">{failure.count} occurrences</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32">
                        <Progress value={failure.percentage} className="h-2" />
                      </div>
                      <div className="text-sm font-medium w-12">
                        {Math.round(failure.percentage)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to improve your build performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {analytics?.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <div className="mt-0.5">
                        {getRecommendationIcon(rec.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{rec.title}</h4>
                          {getImpactBadge(rec.impact)}
                        </div>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}