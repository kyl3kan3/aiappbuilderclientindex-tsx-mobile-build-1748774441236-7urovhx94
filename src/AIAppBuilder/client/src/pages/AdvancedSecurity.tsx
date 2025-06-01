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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Eye, 
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Smartphone,
  Users,
  FileText,
  Clock,
  RefreshCw,
  Settings,
  Zap,
  Search,
  Download,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityThreat {
  id: string;
  type: 'brute_force' | 'suspicious_login' | 'malware' | 'data_breach' | 'unauthorized_access';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  source: string;
  target: string;
  description: string;
  timestamp: string;
  details: Record<string, any>;
}

interface SecurityRule {
  id: string;
  name: string;
  type: 'authentication' | 'authorization' | 'data_protection' | 'network' | 'compliance';
  enabled: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  conditions: string[];
  actions: string[];
  lastTriggered?: string;
  triggerCount: number;
}

interface AuthenticationMethod {
  id: string;
  name: string;
  type: 'password' | 'mfa' | 'biometric' | 'sso' | 'oauth' | 'certificate';
  enabled: boolean;
  users: number;
  lastUsed: string;
  successRate: number;
  configuration: Record<string, any>;
}

interface SecurityMetrics {
  threatsBlocked: number;
  activeThreats: number;
  securityScore: number;
  vulnerabilities: number;
  lastScan: string;
  authenticationAttempts: {
    successful: number;
    failed: number;
    suspicious: number;
  };
  dataProtection: {
    encrypted: number;
    unencrypted: number;
    backups: number;
  };
}

export default function AdvancedSecurity() {
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch security threats
  const { data: threats, isLoading: threatsLoading } = useQuery<SecurityThreat[]>({
    queryKey: ['/api/security/threats'],
    refetchInterval: 30000,
  });

  // Fetch security rules
  const { data: rules, isLoading: rulesLoading } = useQuery<SecurityRule[]>({
    queryKey: ['/api/security/rules'],
  });

  // Fetch authentication methods
  const { data: authMethods, isLoading: authLoading } = useQuery<AuthenticationMethod[]>({
    queryKey: ['/api/security/auth-methods'],
  });

  // Fetch security metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery<SecurityMetrics>({
    queryKey: ['/api/security/metrics'],
    refetchInterval: 60000,
  });

  // Update threat status
  const updateThreatMutation = useMutation({
    mutationFn: async ({ threatId, status }: { threatId: string; status: string }) => {
      const response = await fetch(`/api/security/threats/${threatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update threat status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Threat Updated",
        description: "Threat status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/security/threats'] });
    },
  });

  // Toggle security rule
  const toggleRuleMutation = useMutation({
    mutationFn: async ({ ruleId, enabled }: { ruleId: string; enabled: boolean }) => {
      const response = await fetch(`/api/security/rules/${ruleId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle security rule');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Rule Updated",
        description: "Security rule has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/security/rules'] });
    },
  });

  // Configure authentication method
  const configureAuthMutation = useMutation({
    mutationFn: async ({ methodId, enabled }: { methodId: string; enabled: boolean }) => {
      const response = await fetch(`/api/security/auth-methods/${methodId}/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to configure authentication method');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Authentication Updated",
        description: "Authentication method has been configured successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/security/auth-methods'] });
    },
  });

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-blue-500 text-white'
    };

    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'investigating': return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'false_positive': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'brute_force': return '🔓';
      case 'suspicious_login': return '👤';
      case 'malware': return '🦠';
      case 'data_breach': return '💾';
      case 'unauthorized_access': return '🚫';
      default: return '⚠️';
    }
  };

  const getAuthIcon = (type: string) => {
    switch (type) {
      case 'password': return <Key className="h-4 w-4" />;
      case 'mfa': return <Shield className="h-4 w-4" />;
      case 'biometric': return <Smartphone className="h-4 w-4" />;
      case 'sso': return <Users className="h-4 w-4" />;
      case 'oauth': return <Globe className="h-4 w-4" />;
      case 'certificate': return <FileText className="h-4 w-4" />;
      default: return <Lock className="h-4 w-4" />;
    }
  };

  const filteredThreats = threats?.filter(threat => {
    const matchesSeverity = filterSeverity === 'all' || threat.severity === filterSeverity;
    const matchesType = filterType === 'all' || threat.type === filterType;
    const matchesSearch = !searchQuery || 
      threat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.source.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSeverity && matchesType && matchesSearch;
  }) || [];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-gray-600">Advanced security monitoring and threat protection</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
            <Shield className="h-4 w-4 mr-2" />
            Security Scan
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metricsLoading ? '...' : metrics?.securityScore || 0}/100
            </div>
            <p className="text-xs text-gray-500 mt-1">Excellent security posture</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metricsLoading ? '...' : metrics?.activeThreats || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metricsLoading ? '...' : metrics?.threatsBlocked || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">In the last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metricsLoading ? '...' : metrics?.vulnerabilities || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Need patching</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="rules">Security Rules</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Threats</CardTitle>
                  <CardDescription>Real-time threat detection and monitoring</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search threats..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48"
                    />
                  </div>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {threatsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredThreats.length > 0 ? (
                  <div className="space-y-3">
                    {filteredThreats.map((threat) => (
                      <Card key={threat.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{getThreatIcon(threat.type)}</div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{threat.description}</h4>
                                  {getSeverityBadge(threat.severity)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  From: {threat.source} → To: {threat.target}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatTimeAgo(threat.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(threat.status)}
                              <Select
                                value={threat.status}
                                onValueChange={(status) => 
                                  updateThreatMutation.mutate({ threatId: threat.id, status })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="investigating">Investigating</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="false_positive">False Positive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No threats detected</h3>
                    <p className="text-gray-600">Your system is secure</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Rules</CardTitle>
              <CardDescription>Configure automated security policies and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {rulesLoading ? (
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : rules && rules.length > 0 ? (
                  <div className="space-y-4">
                    {rules.map((rule) => (
                      <Card key={rule.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium">{rule.name}</h4>
                                {getSeverityBadge(rule.severity)}
                                <Badge variant="outline">{rule.type}</Badge>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                Conditions: {rule.conditions.join(', ')}
                              </div>
                              <div className="text-sm text-gray-600">
                                Actions: {rule.actions.join(', ')}
                              </div>
                              {rule.lastTriggered && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Last triggered: {formatTimeAgo(rule.lastTriggered)} 
                                  ({rule.triggerCount} times)
                                </div>
                              )}
                            </div>
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={(enabled) =>
                                toggleRuleMutation.mutate({ ruleId: rule.id, enabled })
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Settings className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No security rules configured</h3>
                    <p className="text-gray-600 mb-4">Set up automated security policies</p>
                    <Button>Add Security Rule</Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Methods</CardTitle>
              <CardDescription>Manage user authentication and access controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {authLoading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                  ))
                ) : authMethods && authMethods.length > 0 ? (
                  authMethods.map((method) => (
                    <Card key={method.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getAuthIcon(method.type)}
                            <h4 className="font-medium">{method.name}</h4>
                          </div>
                          <Switch
                            checked={method.enabled}
                            onCheckedChange={(enabled) =>
                              configureAuthMutation.mutate({ methodId: method.id, enabled })
                            }
                          />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Users:</span>
                            <span>{method.users.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Success Rate:</span>
                            <span className="text-green-600">{method.successRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Used:</span>
                            <span>{formatTimeAgo(method.lastUsed)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <Key className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No authentication methods</h3>
                    <p className="text-gray-600 mb-4">Configure user authentication</p>
                    <Button>Add Authentication Method</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Authentication Statistics */}
          {metrics && (
            <Card>
              <CardHeader>
                <CardTitle>Authentication Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {metrics.authenticationAttempts.successful.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Successful Logins</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {metrics.authenticationAttempts.failed.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Failed Attempts</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {metrics.authenticationAttempts.suspicious.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Suspicious Activity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
              <CardDescription>Real-time security monitoring and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Data Protection */}
                {metrics && (
                  <div>
                    <h4 className="font-medium mb-3">Data Protection Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {metrics.dataProtection.encrypted}
                        </div>
                        <div className="text-sm text-gray-600">Encrypted Files</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {metrics.dataProtection.unencrypted}
                        </div>
                        <div className="text-sm text-gray-600">Unencrypted Files</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {metrics.dataProtection.backups}
                        </div>
                        <div className="text-sm text-gray-600">Backup Copies</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div>
                  <h4 className="font-medium mb-3">Recent Security Events</h4>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {[
                        { event: 'Failed login attempt blocked', time: '2 minutes ago', severity: 'medium' },
                        { event: 'Security rule triggered: Unusual API usage', time: '15 minutes ago', severity: 'high' },
                        { event: 'MFA verification successful', time: '1 hour ago', severity: 'low' },
                        { event: 'Data encryption completed', time: '2 hours ago', severity: 'low' },
                        { event: 'Suspicious file upload detected', time: '3 hours ago', severity: 'high' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Activity className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{activity.event}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getSeverityBadge(activity.severity)}
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}