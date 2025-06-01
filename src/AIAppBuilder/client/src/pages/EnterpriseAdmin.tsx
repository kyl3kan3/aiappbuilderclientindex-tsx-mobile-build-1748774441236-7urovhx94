import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2,
  Users,
  Shield,
  Settings,
  TrendingUp,
  BarChart3,
  UserPlus,
  Crown,
  Key,
  Globe,
  Zap,
  Clock,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: string;
  name: string;
  domain: string;
  subscription: 'starter' | 'professional' | 'enterprise' | 'custom';
  status: 'active' | 'suspended' | 'trial' | 'expired';
  memberCount: number;
  projectCount: number;
  createdAt: string;
  expiresAt: string;
  features: string[];
  billing: {
    plan: string;
    amount: number;
    currency: string;
    nextBilling: string;
  };
  settings: {
    ssoEnabled: boolean;
    mfaRequired: boolean;
    apiAccess: boolean;
    auditLogging: boolean;
  };
}

interface Team {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  memberCount: number;
  projectCount: number;
  role: 'admin' | 'manager' | 'developer' | 'viewer';
  permissions: string[];
  createdAt: string;
  isActive: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'org_admin' | 'team_lead' | 'developer' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  organizationId: string;
  teams: string[];
  lastLogin: string;
  projectsCreated: number;
  permissions: string[];
  mfaEnabled: boolean;
}

interface AdminMetrics {
  totalOrganizations: number;
  totalUsers: number;
  totalProjects: number;
  activeSubscriptions: number;
  revenue: {
    monthly: number;
    annual: number;
    growth: number;
  };
  usage: {
    apiCalls: number;
    storageUsed: number;
    buildMinutes: number;
  };
  security: {
    threatsPrevented: number;
    complianceScore: number;
    vulnerabilities: number;
  };
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  services: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    responseTime: number;
  }[];
  incidents: {
    id: string;
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    createdAt: string;
  }[];
}

export default function EnterpriseAdmin() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch admin metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery<AdminMetrics>({
    queryKey: ['/api/enterprise/metrics'],
    refetchInterval: 30000,
  });

  // Fetch organizations
  const { data: organizations, isLoading: orgsLoading } = useQuery<Organization[]>({
    queryKey: ['/api/enterprise/organizations'],
    refetchInterval: 60000,
  });

  // Fetch teams
  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['/api/enterprise/teams'],
    refetchInterval: 60000,
  });

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/enterprise/users'],
    refetchInterval: 60000,
  });

  // Fetch system health
  const { data: systemHealth, isLoading: healthLoading } = useQuery<SystemHealth>({
    queryKey: ['/api/enterprise/system-health'],
    refetchInterval: 15000,
  });

  // Create organization
  const createOrgMutation = useMutation({
    mutationFn: async (orgData: { name: string; domain: string; subscription: string }) => {
      const response = await fetch('/api/enterprise/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create organization');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Organization Created",
        description: "New organization has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/enterprise/organizations'] });
    },
  });

  // Update user role
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, role, status }: { userId: string; role?: string; status?: string }) => {
      const response = await fetch(`/api/enterprise/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: "User has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/enterprise/users'] });
    },
  });

  // Update organization
  const updateOrgMutation = useMutation({
    mutationFn: async ({ orgId, updates }: { orgId: string; updates: Partial<Organization> }) => {
      const response = await fetch(`/api/enterprise/organizations/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update organization');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Organization Updated",
        description: "Organization has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/enterprise/organizations'] });
    },
  });

  const getSubscriptionBadge = (subscription: string) => {
    const colors = {
      starter: 'bg-blue-500 text-white',
      professional: 'bg-purple-500 text-white',
      enterprise: 'bg-gold-500 text-white',
      custom: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    };

    return (
      <Badge className={colors[subscription as keyof typeof colors] || 'bg-gray-500 text-white'}>
        {subscription.charAt(0).toUpperCase() + subscription.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-500 text-white',
      inactive: 'bg-gray-500 text-white',
      pending: 'bg-yellow-500 text-white',
      suspended: 'bg-red-500 text-white',
      trial: 'bg-blue-500 text-white',
      expired: 'bg-red-500 text-white'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-500 text-white'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: 'bg-red-500 text-white',
      org_admin: 'bg-orange-500 text-white',
      team_lead: 'bg-purple-500 text-white',
      developer: 'bg-blue-500 text-white',
      viewer: 'bg-gray-500 text-white'
    };

    return (
      <Badge className={colors[role as keyof typeof colors] || 'bg-gray-500 text-white'}>
        {role.replace('_', ' ').charAt(0).toUpperCase() + role.replace('_', ' ').slice(1)}
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
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

  const filteredUsers = users?.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRole && matchesSearch;
  }) || [];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Administration</h1>
          <p className="text-gray-600">Manage organizations, users, and system-wide settings</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Organization</DialogTitle>
                <DialogDescription>Add a new organization to the platform</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" placeholder="Enter organization name" />
                </div>
                <div>
                  <Label htmlFor="orgDomain">Domain</Label>
                  <Input id="orgDomain" placeholder="company.com" />
                </div>
                <div>
                  <Label htmlFor="subscription">Subscription Plan</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Create Organization</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Admin Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metricsLoading ? '...' : metrics?.totalOrganizations || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metricsLoading ? '...' : metrics?.totalUsers || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metricsLoading ? '...' : formatCurrency(metrics?.revenue.monthly || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics?.revenue.growth && `+${metrics.revenue.growth}% growth`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {healthLoading ? '...' : `${systemHealth?.uptime || 0}%`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Uptime</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="organizations" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Management</CardTitle>
              <CardDescription>Manage organization subscriptions and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {orgsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : organizations && organizations.length > 0 ? (
                  <div className="space-y-4">
                    {organizations.map((org) => (
                      <Card key={org.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{org.name}</h4>
                                  {getSubscriptionBadge(org.subscription)}
                                  {getStatusBadge(org.status)}
                                </div>
                                <div className="text-sm text-gray-600">{org.domain}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {org.memberCount} members • {org.projectCount} projects
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right text-sm">
                                <div className="font-medium">
                                  {formatCurrency(org.billing.amount)} / month
                                </div>
                                <div className="text-gray-500">
                                  Next: {new Date(org.billing.nextBilling).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No organizations</h3>
                    <p className="text-gray-600">Create your first organization to get started</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="org_admin">Org Admin</SelectItem>
                      <SelectItem value="team_lead">Team Lead</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {usersLoading ? (
                  <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <Card key={user.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{user.name}</h4>
                                  {getRoleBadge(user.role)}
                                  {getStatusBadge(user.status)}
                                  {user.mfaEnabled && <Shield className="h-4 w-4 text-green-500" />}
                                </div>
                                <div className="text-sm text-gray-600">{user.email}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Last login: {formatTimeAgo(user.lastLogin)} • {user.projectsCreated} projects
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Select
                                value={user.role}
                                onValueChange={(role) =>
                                  updateUserMutation.mutate({ userId: user.id, role })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="super_admin">Super Admin</SelectItem>
                                  <SelectItem value="org_admin">Org Admin</SelectItem>
                                  <SelectItem value="team_lead">Team Lead</SelectItem>
                                  <SelectItem value="developer">Developer</SelectItem>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No users found</h3>
                    <p className="text-gray-600">No users match your search criteria</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Organize users into teams and manage permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {teamsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : teams && teams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teams.map((team) => (
                      <Card key={team.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Users className="h-5 w-5 text-orange-600" />
                              <div>
                                <h4 className="font-medium">{team.name}</h4>
                                <div className="text-sm text-gray-600">{team.description}</div>
                              </div>
                            </div>
                            {getRoleBadge(team.role)}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Members:</span>
                              <span>{team.memberCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Projects:</span>
                              <span>{team.projectCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Permissions:</span>
                              <span>{team.permissions.length}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="text-xs text-gray-500">
                              Created {formatTimeAgo(team.createdAt)}
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No teams found</h3>
                    <p className="text-gray-600 mb-4">Create teams to organize your users</p>
                    <Button>Create Team</Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Monthly Revenue</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(metrics?.revenue.monthly || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Annual Revenue</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(metrics?.revenue.annual || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth Rate</span>
                    <span className="font-bold text-purple-600">
                      +{metrics?.revenue.growth || 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>API Calls</span>
                    <span className="font-bold">{metrics?.usage.apiCalls.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storage Used</span>
                    <span className="font-bold">{metrics?.usage.storageUsed || 0} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Build Minutes</span>
                    <span className="font-bold">{metrics?.usage.buildMinutes.toLocaleString() || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Monitor system performance and service status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {systemHealth?.uptime || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {systemHealth?.responseTime || 0}ms
                    </div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {systemHealth?.services?.filter(s => s.status === 'operational').length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Services Online</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Service Status</h4>
                  <div className="space-y-2">
                    {systemHealth?.services?.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getServiceStatusIcon(service.status)}
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{service.responseTime}ms</span>
                          {getStatusBadge(service.status)}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        No service data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}