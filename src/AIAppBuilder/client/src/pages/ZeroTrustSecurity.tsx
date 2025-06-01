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
import { 
  Shield, 
  Eye, 
  Lock,
  Key,
  Smartphone,
  Globe,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Settings,
  Zap,
  Search,
  Download,
  Network,
  Fingerprint,
  Database,
  Server
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IdentityTrust {
  id: string;
  userId: string;
  userName: string;
  email: string;
  trustLevel: 'high' | 'medium' | 'low' | 'untrusted';
  riskScore: number;
  verificationMethods: string[];
  lastVerification: string;
  deviceCount: number;
  locationTrust: 'trusted' | 'suspicious' | 'unknown';
  behaviorAnalysis: {
    normalPatterns: boolean;
    anomalies: number;
    riskFactors: string[];
  };
}

interface DeviceCompliance {
  id: string;
  deviceId: string;
  deviceName: string;
  platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux';
  userId: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending' | 'quarantined';
  trustScore: number;
  lastChecked: string;
  policies: {
    encryptionEnabled: boolean;
    screenLockEnabled: boolean;
    osUpToDate: boolean;
    antivirusEnabled: boolean;
    unauthorizedApps: number;
  };
  violations: string[];
  remediationRequired: boolean;
}

interface NetworkPolicy {
  id: string;
  name: string;
  type: 'micro_segmentation' | 'access_control' | 'traffic_filtering' | 'encryption';
  enabled: boolean;
  scope: 'global' | 'department' | 'role' | 'device';
  rules: NetworkRule[];
  enforcement: 'block' | 'monitor' | 'alert';
  effectiveness: number;
  violationCount: number;
}

interface NetworkRule {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  action: 'allow' | 'deny' | 'inspect';
  conditions: string[];
}

interface AccessSession {
  id: string;
  userId: string;
  resource: string;
  accessLevel: 'read' | 'write' | 'admin' | 'full';
  grantedAt: string;
  expiresAt: string;
  trustFactors: {
    identity: number;
    device: number;
    location: number;
    behavior: number;
  };
  continuousValidation: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'expired' | 'revoked' | 'suspended';
}

interface ZeroTrustMetrics {
  overallTrustScore: number;
  identityVerification: {
    verified: number;
    pending: number;
    failed: number;
  };
  deviceCompliance: {
    compliant: number;
    nonCompliant: number;
    pending: number;
  };
  networkSecurity: {
    policiesActive: number;
    violations: number;
    threatsBlocked: number;
  };
  accessControl: {
    activeSessions: number;
    revokedSessions: number;
    riskySessions: number;
  };
}

export default function ZeroTrustSecurity() {
  const [selectedIdentity, setSelectedIdentity] = useState<string | null>(null);
  const [filterTrustLevel, setFilterTrustLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch zero trust metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery<ZeroTrustMetrics>({
    queryKey: ['/api/zero-trust/metrics'],
    refetchInterval: 30000,
  });

  // Fetch identity trust data
  const { data: identities, isLoading: identitiesLoading } = useQuery<IdentityTrust[]>({
    queryKey: ['/api/zero-trust/identities'],
    refetchInterval: 60000,
  });

  // Fetch device compliance
  const { data: devices, isLoading: devicesLoading } = useQuery<DeviceCompliance[]>({
    queryKey: ['/api/zero-trust/devices'],
    refetchInterval: 60000,
  });

  // Fetch network policies
  const { data: policies, isLoading: policiesLoading } = useQuery<NetworkPolicy[]>({
    queryKey: ['/api/zero-trust/policies'],
  });

  // Fetch access sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery<AccessSession[]>({
    queryKey: ['/api/zero-trust/sessions'],
    refetchInterval: 30000,
  });

  // Update identity trust level
  const updateTrustMutation = useMutation({
    mutationFn: async ({ identityId, trustLevel }: { identityId: string; trustLevel: string }) => {
      const response = await fetch(`/api/zero-trust/identities/${identityId}/trust`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trustLevel }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update trust level');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Trust Level Updated",
        description: "Identity trust level has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/zero-trust/identities'] });
    },
  });

  // Update device compliance
  const updateDeviceMutation = useMutation({
    mutationFn: async ({ deviceId, action }: { deviceId: string; action: string }) => {
      const response = await fetch(`/api/zero-trust/devices/${deviceId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update device');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Device Updated",
        description: "Device compliance status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/zero-trust/devices'] });
    },
  });

  // Toggle network policy
  const togglePolicyMutation = useMutation({
    mutationFn: async ({ policyId, enabled }: { policyId: string; enabled: boolean }) => {
      const response = await fetch(`/api/zero-trust/policies/${policyId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle policy');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Policy Updated",
        description: "Network policy has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/zero-trust/policies'] });
    },
  });

  // Revoke access session
  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/zero-trust/sessions/${sessionId}/revoke`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to revoke session');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Session Revoked",
        description: "Access session has been revoked successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/zero-trust/sessions'] });
    },
  });

  const getTrustBadge = (trustLevel: string) => {
    const colors = {
      high: 'bg-green-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-orange-500 text-white',
      untrusted: 'bg-red-500 text-white'
    };

    return (
      <Badge className={colors[trustLevel as keyof typeof colors]}>
        {trustLevel.charAt(0).toUpperCase() + trustLevel.slice(1)}
      </Badge>
    );
  };

  const getComplianceBadge = (status: string) => {
    const colors = {
      compliant: 'bg-green-500 text-white',
      non_compliant: 'bg-red-500 text-white',
      pending: 'bg-yellow-500 text-white',
      quarantined: 'bg-gray-500 text-white'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (level: string) => {
    const colors = {
      low: 'bg-green-500 text-white',
      medium: 'bg-yellow-500 text-white',
      high: 'bg-red-500 text-white'
    };

    return (
      <Badge className={colors[level as keyof typeof colors]}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </Badge>
    );
  };

  const getDeviceIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return '📱';
      case 'android': return '🤖';
      case 'windows': return '🖥️';
      case 'macos': return '💻';
      case 'linux': return '🐧';
      default: return '📱';
    }
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

  const filteredIdentities = identities?.filter(identity => {
    const matchesTrust = filterTrustLevel === 'all' || identity.trustLevel === filterTrustLevel;
    const matchesSearch = !searchQuery || 
      identity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      identity.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTrust && matchesSearch;
  }) || [];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zero Trust Security</h1>
          <p className="text-gray-600">Never trust, always verify - comprehensive zero-trust architecture</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Shield className="h-4 w-4 mr-2" />
            Security Audit
          </Button>
        </div>
      </div>

      {/* Zero Trust Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metricsLoading ? '...' : metrics?.overallTrustScore || 0}/100
            </div>
            <p className="text-xs text-gray-500 mt-1">Overall security posture</p>
            {metrics && (
              <Progress value={metrics.overallTrustScore} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Identity Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metricsLoading ? '...' : metrics?.identityVerification.verified || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Verified identities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Device Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metricsLoading ? '...' : metrics?.deviceCompliance.compliant || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Compliant devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metricsLoading ? '...' : metrics?.accessControl.activeSessions || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current access sessions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="identities" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="identities">Identity Trust</TabsTrigger>
          <TabsTrigger value="devices">Device Compliance</TabsTrigger>
          <TabsTrigger value="network">Network Policies</TabsTrigger>
          <TabsTrigger value="sessions">Access Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="identities" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Identity Trust Management</CardTitle>
                  <CardDescription>Continuous identity verification and risk assessment</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search identities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48"
                    />
                  </div>
                  <Select value={filterTrustLevel} onValueChange={setFilterTrustLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trust</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="untrusted">Untrusted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {identitiesLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredIdentities.length > 0 ? (
                  <div className="space-y-3">
                    {filteredIdentities.map((identity) => (
                      <Card key={identity.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{identity.userName}</h4>
                                  {getTrustBadge(identity.trustLevel)}
                                </div>
                                <div className="text-sm text-gray-600">{identity.email}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Risk Score: {identity.riskScore}/100 • {identity.deviceCount} devices
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right text-sm">
                                <div className="font-medium">
                                  {identity.verificationMethods.length} methods
                                </div>
                                <div className="text-gray-500">
                                  {formatTimeAgo(identity.lastVerification)}
                                </div>
                              </div>
                              <Select
                                value={identity.trustLevel}
                                onValueChange={(trustLevel) =>
                                  updateTrustMutation.mutate({ identityId: identity.id, trustLevel })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High Trust</SelectItem>
                                  <SelectItem value="medium">Medium Trust</SelectItem>
                                  <SelectItem value="low">Low Trust</SelectItem>
                                  <SelectItem value="untrusted">Untrusted</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {identity.behaviorAnalysis.anomalies > 0 && (
                            <Alert className="mt-3">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                {identity.behaviorAnalysis.anomalies} behavioral anomalies detected
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Fingerprint className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No identities found</h3>
                    <p className="text-gray-600">No identities match your search criteria</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Compliance Management</CardTitle>
              <CardDescription>Monitor and enforce device security policies</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {devicesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : devices && devices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {devices.map((device) => (
                      <Card key={device.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{getDeviceIcon(device.platform)}</span>
                              <div>
                                <h4 className="font-medium">{device.deviceName}</h4>
                                <div className="text-sm text-gray-600">{device.platform}</div>
                              </div>
                            </div>
                            {getComplianceBadge(device.complianceStatus)}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Trust Score:</span>
                              <span className="font-medium">{device.trustScore}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Checked:</span>
                              <span>{formatTimeAgo(device.lastChecked)}</span>
                            </div>
                          </div>

                          {device.violations.length > 0 && (
                            <Alert className="mt-3">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                {device.violations.length} policy violations detected
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <div className="text-xs text-gray-500">
                              Policies: {Object.values(device.policies).filter(Boolean).length}/
                              {Object.values(device.policies).length}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateDeviceMutation.mutate({ deviceId: device.id, action: 'remediate' })}
                              >
                                Remediate
                              </Button>
                              {device.complianceStatus === 'non_compliant' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateDeviceMutation.mutate({ deviceId: device.id, action: 'quarantine' })}
                                >
                                  Quarantine
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Smartphone className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No devices found</h3>
                    <p className="text-gray-600">No devices are currently registered</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Security Policies</CardTitle>
              <CardDescription>Micro-segmentation and traffic control policies</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {policiesLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : policies && policies.length > 0 ? (
                  <div className="space-y-4">
                    {policies.map((policy) => (
                      <Card key={policy.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Network className="h-4 w-4 text-blue-500" />
                                <h4 className="font-medium">{policy.name}</h4>
                                <Badge variant="outline">{policy.type.replace('_', ' ')}</Badge>
                                <Badge variant="outline">{policy.scope}</Badge>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {policy.rules.length} rules • {policy.enforcement} enforcement
                              </div>
                              <div className="flex items-center space-x-4 text-sm">
                                <div>Effectiveness: {policy.effectiveness}%</div>
                                <div>Violations: {policy.violationCount}</div>
                              </div>
                            </div>
                            <Switch
                              checked={policy.enabled}
                              onCheckedChange={(enabled) =>
                                togglePolicyMutation.mutate({ policyId: policy.id, enabled })
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Network className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No network policies</h3>
                    <p className="text-gray-600 mb-4">Configure network security policies</p>
                    <Button>Add Network Policy</Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Session Management</CardTitle>
              <CardDescription>Monitor and control active access sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {sessionsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : sessions && sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <Card key={session.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Key className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{session.resource}</h4>
                                  <Badge variant="outline">{session.accessLevel}</Badge>
                                  {getRiskBadge(session.riskLevel)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  User: {session.userId} • Granted: {formatTimeAgo(session.grantedAt)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Expires: {new Date(session.expiresAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right text-sm">
                                <div className="font-medium">Trust Factors</div>
                                <div className="text-gray-500">
                                  I:{session.trustFactors.identity} D:{session.trustFactors.device} 
                                  L:{session.trustFactors.location} B:{session.trustFactors.behavior}
                                </div>
                              </div>
                              {session.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => revokeSessionMutation.mutate(session.id)}
                                >
                                  Revoke
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Lock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No active sessions</h3>
                    <p className="text-gray-600">No access sessions are currently active</p>
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