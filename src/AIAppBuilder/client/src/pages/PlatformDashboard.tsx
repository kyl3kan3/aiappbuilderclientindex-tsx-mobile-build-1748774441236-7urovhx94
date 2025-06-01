import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { 
  Smartphone,
  Code,
  Zap,
  Users,
  BarChart3,
  Shield,
  Settings,
  Rocket,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Plus,
  Play,
  Eye,
  Download,
  Globe,
  Clock,
  Star,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardOverview {
  projects: {
    total: number;
    active: number;
    completed: number;
    thisMonth: number;
  };
  builds: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
  };
  users: {
    total: number;
    active: number;
    thisMonth: number;
    growth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    growth: number;
    arr: number;
  };
}

interface RecentProject {
  id: string;
  name: string;
  platform: 'ios' | 'android' | 'react_native' | 'flutter';
  status: 'active' | 'building' | 'deployed' | 'error';
  progress: number;
  lastUpdate: string;
  builds: number;
  quality: number;
}

interface SystemStatus {
  overall: 'healthy' | 'warning' | 'critical';
  services: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    uptime: number;
    responseTime: number;
  }[];
  alerts: {
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  category: 'create' | 'manage' | 'analyze' | 'secure';
  featured: boolean;
}

export default function PlatformDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard overview
  const { data: overview, isLoading: overviewLoading } = useQuery<DashboardOverview>({
    queryKey: ['/api/dashboard/overview', timeRange],
    refetchInterval: 30000,
  });

  // Fetch recent projects
  const { data: projects, isLoading: projectsLoading } = useQuery<RecentProject[]>({
    queryKey: ['/api/dashboard/projects'],
    refetchInterval: 60000,
  });

  // Fetch system status
  const { data: systemStatus, isLoading: statusLoading } = useQuery<SystemStatus>({
    queryKey: ['/api/dashboard/system-status'],
    refetchInterval: 15000,
  });

  const quickActions: QuickAction[] = [
    {
      id: 'create-project',
      title: 'Create New Project',
      description: 'Start building your next mobile app',
      icon: <Plus className="h-6 w-6" />,
      href: '/requirements',
      category: 'create',
      featured: true
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Get help with development questions',
      icon: <Zap className="h-6 w-6" />,
      href: '/assistant',
      category: 'create',
      featured: true
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Analyze platform performance and usage',
      icon: <BarChart3 className="h-6 w-6" />,
      href: '/analytics',
      category: 'analyze',
      featured: true
    },
    {
      id: 'security-center',
      title: 'Security Center',
      description: 'Monitor threats and security status',
      icon: <Shield className="h-6 w-6" />,
      href: '/advanced-security',
      category: 'secure',
      featured: true
    },
    {
      id: 'design-studio',
      title: 'Design Studio',
      description: 'Create beautiful UI designs with AI',
      icon: <Star className="h-6 w-6" />,
      href: '/design',
      category: 'create',
      featured: false
    },
    {
      id: 'code-editor',
      title: 'Live Code Editor',
      description: 'Edit and collaborate on code in real-time',
      icon: <Code className="h-6 w-6" />,
      href: '/editor',
      category: 'create',
      featured: false
    },
    {
      id: 'enterprise-admin',
      title: 'Enterprise Admin',
      description: 'Manage organizations and users',
      icon: <Users className="h-6 w-6" />,
      href: '/enterprise',
      category: 'manage',
      featured: false
    },
    {
      id: 'data-protection',
      title: 'Data Protection',
      description: 'Manage encryption and privacy controls',
      icon: <Shield className="h-6 w-6" />,
      href: '/data-protection',
      category: 'secure',
      featured: false
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return '📱';
      case 'android': return '🤖';
      case 'react_native': return '⚛️';
      case 'flutter': return '🦋';
      default: return '📱';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-500 text-white',
      building: 'bg-blue-500 text-white',
      deployed: 'bg-purple-500 text-white',
      error: 'bg-red-500 text-white'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-500 text-white'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
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
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const featuredActions = quickActions.filter(action => action.featured);
  const otherActions = quickActions.filter(action => !action.featured);

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Mobile App Builder
          </h1>
          <p className="text-gray-600">Welcome to your comprehensive mobile development platform</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Platform Report
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Rocket className="h-4 w-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Smartphone className="h-4 w-4 mr-2 text-blue-500" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {overviewLoading ? '...' : formatNumber(overview?.projects.total || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{overview?.projects.thisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Build Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overviewLoading ? '...' : `${overview?.builds.successRate.toFixed(1) || 0}%`}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatNumber(overview?.builds.successful || 0)} / {formatNumber(overview?.builds.total || 0)} builds
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {overviewLoading ? '...' : formatNumber(overview?.users.active || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{overview?.users.growth.toFixed(1) || 0}% growth
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-orange-500" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {overviewLoading ? '...' : formatCurrency(overview?.revenue.thisMonth || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{overview?.revenue.growth.toFixed(1) || 0}% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get started with these popular features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredActions.map((action) => (
                  <Link key={action.id} href={action.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{action.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-sm mb-3">More Actions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {otherActions.map((action) => (
                    <Link key={action.id} href={action.href}>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        {action.icon}
                        <span className="ml-1 hidden sm:inline">{action.title}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Recent Projects
                </CardTitle>
                <Link href="/projects">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {projectsLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : projects && projects.length > 0 ? (
                  <div className="space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <Card key={project.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{getPlatformIcon(project.platform)}</div>
                              <div>
                                <h4 className="font-medium text-sm">{project.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  {getStatusBadge(project.status)}
                                  <span className="text-xs text-gray-500">
                                    {project.builds} builds • {project.quality}% quality
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500 mb-1">
                                {formatTimeAgo(project.lastUpdate)}
                              </div>
                              <Progress value={project.progress} className="w-16 h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Smartphone className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 text-sm">No projects yet</p>
                    <Link href="/requirements">
                      <Button size="sm" className="mt-2">Create Your First Project</Button>
                    </Link>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* System Status & Alerts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Status</span>
                  <Badge className={
                    systemStatus?.overall === 'healthy' ? 'bg-green-500 text-white' :
                    systemStatus?.overall === 'warning' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }>
                    {systemStatus?.overall || 'Unknown'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {statusLoading ? (
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse h-8 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : systemStatus?.services ? (
                    systemStatus.services.slice(0, 5).map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <div className="flex items-center space-x-2">
                          {getServiceStatusIcon(service.status)}
                          <span className="text-xs font-medium">{service.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {service.uptime}% • {service.responseTime}ms
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No status data available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {statusLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : systemStatus?.alerts && systemStatus.alerts.length > 0 ? (
                  <div className="space-y-2">
                    {systemStatus.alerts.slice(0, 5).map((alert) => (
                      <Alert key={alert.id} className="p-3">
                        <div className="flex items-start space-x-2">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <p className="text-xs font-medium">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTimeAgo(alert.timestamp)}
                            </p>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-xs text-gray-500">All systems operational</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}