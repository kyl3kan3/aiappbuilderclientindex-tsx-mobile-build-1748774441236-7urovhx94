import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Key, 
  Users, 
  Settings, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Copy,
  Download,
  Upload,
  Link,
  Lock,
  Unlock,
  Globe,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth' | 'oidc';
  status: 'active' | 'inactive' | 'testing';
  domain: string;
  userCount: number;
  lastSync: string;
  configuration: any;
}

interface SSOConfiguration {
  id: string;
  provider: string;
  entityId: string;
  ssoUrl: string;
  certificate: string;
  attributeMapping: {
    email: string;
    firstName: string;
    lastName: string;
    groups: string;
  };
  settings: {
    autoProvisioning: boolean;
    justInTimeProvisioning: boolean;
    defaultRole: string;
    allowedDomains: string[];
  };
}

interface AuthenticationLog {
  id: string;
  userId: string;
  userName: string;
  email: string;
  provider: string;
  action: 'login' | 'logout' | 'failed_login' | 'provisioned';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
}

export default function SSOConfiguration() {
  const [activeTab, setActiveTab] = useState('overview');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [newConfig, setNewConfig] = useState<Partial<SSOConfiguration>>({
    attributeMapping: {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      groups: 'groups'
    },
    settings: {
      autoProvisioning: true,
      justInTimeProvisioning: true,
      defaultRole: 'member',
      allowedDomains: []
    }
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch SSO providers
  const { data: providers, isLoading: providersLoading } = useQuery<SSOProvider[]>({
    queryKey: ['/api/auth/sso/providers'],
    refetchInterval: 30000,
  });

  // Fetch authentication logs
  const { data: authLogs, isLoading: logsLoading } = useQuery<AuthenticationLog[]>({
    queryKey: ['/api/auth/logs'],
    refetchInterval: 10000,
  });

  // Configure SSO mutation
  const configureSSOmutation = useMutation({
    mutationFn: async (config: Partial<SSOConfiguration>) => {
      const response = await fetch('/api/auth/sso/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error('Failed to configure SSO');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "SSO Configured",
        description: "Single Sign-On has been configured successfully.",
      });
      setConfigDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/auth'] });
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Test SSO connection mutation
  const testSSOmutation = useMutation({
    mutationFn: async (providerId: string) => {
      const response = await fetch(`/api/auth/sso/test/${providerId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('SSO test failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "SSO Test Successful",
        description: `Connection to ${data.provider} is working correctly.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "SSO Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'saml': return <Shield className="h-5 w-5 text-blue-500" />;
      case 'oauth': return <Key className="h-5 w-5 text-green-500" />;
      case 'oidc': return <Lock className="h-5 w-5 text-purple-500" />;
      default: return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'inactive': 'outline',
      'testing': 'secondary'
    } as const;

    const colors = {
      'active': 'bg-green-500 text-white',
      'inactive': 'bg-gray-500 text-white',
      'testing': 'bg-yellow-500 text-white'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'logout': return <XCircle className="h-4 w-4 text-blue-500" />;
      case 'failed_login': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'provisioned': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const copyMetadata = () => {
    const metadata = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://aiappbuilder.com/sp">
  <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://aiappbuilder.com/auth/saml/callback" index="0" isDefault="true"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;
    
    navigator.clipboard.writeText(metadata);
    toast({
      title: "Metadata Copied",
      description: "SAML metadata copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise SSO Configuration</h1>
          <p className="text-gray-600">Configure Single Sign-On for seamless enterprise authentication</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={copyMetadata}>
            <Copy className="h-4 w-4 mr-2" />
            Copy SP Metadata
          </Button>
          <Button 
            onClick={() => setConfigDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Shield className="h-4 w-4 mr-2" />
            Add SSO Provider
          </Button>
        </div>
      </div>

      {/* SSO Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers?.filter(p => p.status === 'active').length || 0}</div>
            <div className="text-xs text-muted-foreground">
              {providers?.length || 0} total configured
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SSO Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers?.reduce((sum, p) => sum + p.userCount, 0) || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Authenticated via SSO
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <div className="text-xs text-muted-foreground">
              Last 30 days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {authLogs?.filter(log => !log.success).length || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Last 24 hours
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Providers</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="logs">Authentication Logs</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {providersLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : providers && providers.length > 0 ? (
              providers.map((provider) => (
                <Card key={provider.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getProviderIcon(provider.type)}
                        <div>
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                          <CardDescription>{provider.domain}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(provider.status)}
                        <Badge variant="outline" className="text-xs uppercase">
                          {provider.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Users</div>
                        <div className="text-2xl font-bold text-blue-600">{provider.userCount}</div>
                      </div>
                      <div>
                        <div className="font-medium">Last Sync</div>
                        <div className="text-sm text-gray-600">
                          {formatRelativeTime(provider.lastSync)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testSSOmutation.mutate(provider.id)}
                        disabled={testSSOmutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {testSSOmutation.isPending ? 'Testing...' : 'Test Connection'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Shield className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">No SSO Providers Configured</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first SSO provider</p>
                <Button onClick={() => setConfigDialogOpen(true)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Add SSO Provider
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SAML Configuration</CardTitle>
                <CardDescription>Configure SAML 2.0 identity providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Service Provider Details:</strong><br/>
                    Entity ID: https://aiappbuilder.com/sp<br/>
                    ACS URL: https://aiappbuilder.com/auth/saml/callback
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Supported Identity Providers</Label>
                    <div className="mt-2 space-y-2">
                      {[
                        { name: 'Microsoft Azure AD', logo: '🔵' },
                        { name: 'Okta', logo: '🟡' },
                        { name: 'OneLogin', logo: '🔴' },
                        { name: 'Google Workspace', logo: '🔴' },
                        { name: 'Auth0', logo: '🟠' },
                        { name: 'Custom SAML 2.0', logo: '⚙️' }
                      ].map((idp, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span>{idp.logo}</span>
                          <span>{idp.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>OAuth Configuration</CardTitle>
                <CardDescription>Configure OAuth 2.0 and OpenID Connect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    <strong>OAuth Details:</strong><br/>
                    Redirect URI: https://aiappbuilder.com/auth/oauth/callback<br/>
                    Scope: openid profile email groups
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Supported OAuth Providers</Label>
                    <div className="mt-2 space-y-2">
                      {[
                        { name: 'GitHub Enterprise', logo: '🐙' },
                        { name: 'GitLab Enterprise', logo: '🦊' },
                        { name: 'Microsoft Azure AD', logo: '🔵' },
                        { name: 'Google Workspace', logo: '🔴' },
                        { name: 'Custom OAuth 2.0', logo: '⚙️' }
                      ].map((provider, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span>{provider.logo}</span>
                          <span>{provider.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attribute Mapping</CardTitle>
              <CardDescription>Map identity provider attributes to user fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emailMapping">Email Attribute</Label>
                    <Input
                      id="emailMapping"
                      value={newConfig.attributeMapping?.email || ''}
                      onChange={(e) => setNewConfig({
                        ...newConfig,
                        attributeMapping: {
                          ...newConfig.attributeMapping!,
                          email: e.target.value
                        }
                      })}
                      placeholder="email or http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstNameMapping">First Name Attribute</Label>
                    <Input
                      id="firstNameMapping"
                      value={newConfig.attributeMapping?.firstName || ''}
                      onChange={(e) => setNewConfig({
                        ...newConfig,
                        attributeMapping: {
                          ...newConfig.attributeMapping!,
                          firstName: e.target.value
                        }
                      })}
                      placeholder="firstName or givenName"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="lastNameMapping">Last Name Attribute</Label>
                    <Input
                      id="lastNameMapping"
                      value={newConfig.attributeMapping?.lastName || ''}
                      onChange={(e) => setNewConfig({
                        ...newConfig,
                        attributeMapping: {
                          ...newConfig.attributeMapping!,
                          lastName: e.target.value
                        }
                      })}
                      placeholder="lastName or surname"
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupsMapping">Groups Attribute</Label>
                    <Input
                      id="groupsMapping"
                      value={newConfig.attributeMapping?.groups || ''}
                      onChange={(e) => setNewConfig({
                        ...newConfig,
                        attributeMapping: {
                          ...newConfig.attributeMapping!,
                          groups: e.target.value
                        }
                      })}
                      placeholder="groups or memberOf"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Logs</CardTitle>
              <CardDescription>Monitor SSO login attempts and user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {logsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : authLogs && authLogs.length > 0 ? (
                  <div className="space-y-3">
                    {authLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getActionIcon(log.action)}
                          <div>
                            <div className="font-medium">
                              {log.userName} ({log.email})
                            </div>
                            <div className="text-sm text-gray-500">
                              {log.action.replace('_', ' ').charAt(0).toUpperCase() + log.action.replace('_', ' ').slice(1)} via {log.provider}
                            </div>
                            <div className="text-xs text-gray-400">
                              {log.ipAddress} • {formatRelativeTime(log.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={log.success ? 'default' : 'destructive'}>
                            {log.success ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No authentication logs available</p>
                    <p className="text-sm">Logs will appear here once SSO is configured</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure enterprise security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Enforce SSO</Label>
                    <div className="text-sm text-gray-500">Require all users to authenticate via SSO</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Just-in-Time Provisioning</Label>
                    <div className="text-sm text-gray-500">Automatically create user accounts on first login</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto-update User Profiles</Label>
                    <div className="text-sm text-gray-500">Sync user attributes on every login</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Session Timeout</Label>
                    <div className="text-sm text-gray-500">Automatically log out inactive users</div>
                  </div>
                  <Select defaultValue="8h">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Allowed Domains</Label>
                  <div className="text-sm text-gray-500 mb-2">Restrict access to specific email domains</div>
                  <Textarea
                    placeholder="acme.com&#10;example.org&#10;company.net"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Default Role for New Users</Label>
                  <div className="text-sm text-gray-500 mb-2">Role assigned to users created via SSO</div>
                  <Select defaultValue="member">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest">Guest - View only access</SelectItem>
                      <SelectItem value="member">Member - Create and edit projects</SelectItem>
                      <SelectItem value="admin">Admin - Full team management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configure SSO Dialog */}
      {configDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Configure SSO Provider</CardTitle>
              <CardDescription>
                Add a new Single Sign-On identity provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="providerType">Provider Type</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SSO provider type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saml">SAML 2.0</SelectItem>
                    <SelectItem value="oauth">OAuth 2.0</SelectItem>
                    <SelectItem value="oidc">OpenID Connect</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedProvider === 'saml' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="entityId">Identity Provider Entity ID</Label>
                    <Input
                      id="entityId"
                      value={newConfig.entityId || ''}
                      onChange={(e) => setNewConfig({ ...newConfig, entityId: e.target.value })}
                      placeholder="https://idp.example.com/metadata"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ssoUrl">SSO URL</Label>
                    <Input
                      id="ssoUrl"
                      value={newConfig.ssoUrl || ''}
                      onChange={(e) => setNewConfig({ ...newConfig, ssoUrl: e.target.value })}
                      placeholder="https://idp.example.com/sso"
                    />
                  </div>
                  <div>
                    <Label htmlFor="certificate">X.509 Certificate</Label>
                    <Textarea
                      id="certificate"
                      value={newConfig.certificate || ''}
                      onChange={(e) => setNewConfig({ ...newConfig, certificate: e.target.value })}
                      placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => configureSSOmutation.mutate(newConfig)}
                  disabled={!selectedProvider || configureSSOmutation.isPending}
                >
                  {configureSSOmutation.isPending ? 'Configuring...' : 'Configure SSO'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}