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
  Lock,
  Key,
  Database,
  FileText,
  Eye,
  EyeOff,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Settings,
  Zap,
  Search,
  Server,
  HardDrive,
  Fingerprint,
  Gauge
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EncryptionKey {
  id: string;
  name: string;
  algorithm: 'AES-256' | 'RSA-4096' | 'ChaCha20' | 'ECC-P384';
  status: 'active' | 'rotating' | 'deprecated' | 'revoked';
  usage: 'data_encryption' | 'key_encryption' | 'signing' | 'authentication';
  createdAt: string;
  expiresAt: string;
  rotationSchedule: string;
  usageCount: number;
  strength: number;
}

interface DataAsset {
  id: string;
  name: string;
  type: 'database' | 'file' | 'backup' | 'logs' | 'configuration';
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  encryptionStatus: 'encrypted' | 'unencrypted' | 'partially_encrypted';
  encryptionMethod: string;
  size: number;
  location: string;
  lastAccessed: string;
  accessCount: number;
  riskScore: number;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending';
}

interface DLPPolicy {
  id: string;
  name: string;
  type: 'pii_detection' | 'credit_card' | 'ssn' | 'medical' | 'financial' | 'custom';
  enabled: boolean;
  scope: 'global' | 'department' | 'application';
  rules: DLPRule[];
  enforcement: 'block' | 'quarantine' | 'alert' | 'encrypt';
  violationCount: number;
  effectiveness: number;
}

interface DLPRule {
  id: string;
  pattern: string;
  confidence: number;
  action: 'detect' | 'mask' | 'tokenize' | 'encrypt';
  exceptions: string[];
}

interface PrivacyControl {
  id: string;
  name: string;
  regulation: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOX' | 'PCI_DSS' | 'FERPA';
  enabled: boolean;
  dataTypes: string[];
  retentionPeriod: number;
  deletionMethod: 'secure_delete' | 'crypto_shredding' | 'physical_destruction';
  consentRequired: boolean;
  rightToForget: boolean;
  dataPortability: boolean;
  complianceScore: number;
}

interface EncryptionMetrics {
  totalDataAssets: number;
  encryptedAssets: number;
  encryptionCoverage: number;
  keyRotationCompliance: number;
  dlpViolations: number;
  privacyComplianceScore: number;
  dataAtRest: {
    encrypted: number;
    unencrypted: number;
    total: number;
  };
  dataInTransit: {
    encrypted: number;
    unencrypted: number;
    total: number;
  };
  keyManagement: {
    activeKeys: number;
    rotatingKeys: number;
    expiredKeys: number;
  };
}

export default function DataProtection() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [filterClassification, setFilterClassification] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch encryption metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery<EncryptionMetrics>({
    queryKey: ['/api/data-protection/metrics'],
    refetchInterval: 30000,
  });

  // Fetch encryption keys
  const { data: keys, isLoading: keysLoading } = useQuery<EncryptionKey[]>({
    queryKey: ['/api/data-protection/keys'],
    refetchInterval: 60000,
  });

  // Fetch data assets
  const { data: assets, isLoading: assetsLoading } = useQuery<DataAsset[]>({
    queryKey: ['/api/data-protection/assets'],
    refetchInterval: 60000,
  });

  // Fetch DLP policies
  const { data: dlpPolicies, isLoading: dlpLoading } = useQuery<DLPPolicy[]>({
    queryKey: ['/api/data-protection/dlp-policies'],
  });

  // Fetch privacy controls
  const { data: privacyControls, isLoading: privacyLoading } = useQuery<PrivacyControl[]>({
    queryKey: ['/api/data-protection/privacy-controls'],
  });

  // Rotate encryption key
  const rotateKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const response = await fetch(`/api/data-protection/keys/${keyId}/rotate`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to rotate key');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Key Rotation Started",
        description: "Encryption key rotation has been initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/data-protection/keys'] });
    },
  });

  // Encrypt data asset
  const encryptAssetMutation = useMutation({
    mutationFn: async ({ assetId, method }: { assetId: string; method: string }) => {
      const response = await fetch(`/api/data-protection/assets/${assetId}/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to encrypt asset');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Encryption Started",
        description: "Data asset encryption has been initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/data-protection/assets'] });
    },
  });

  // Toggle DLP policy
  const toggleDLPMutation = useMutation({
    mutationFn: async ({ policyId, enabled }: { policyId: string; enabled: boolean }) => {
      const response = await fetch(`/api/data-protection/dlp-policies/${policyId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle DLP policy');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "DLP Policy Updated",
        description: "Data loss prevention policy has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/data-protection/dlp-policies'] });
    },
  });

  // Toggle privacy control
  const togglePrivacyMutation = useMutation({
    mutationFn: async ({ controlId, enabled }: { controlId: string; enabled: boolean }) => {
      const response = await fetch(`/api/data-protection/privacy-controls/${controlId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle privacy control');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Privacy Control Updated",
        description: "Privacy control has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/data-protection/privacy-controls'] });
    },
  });

  const getClassificationBadge = (classification: string) => {
    const colors = {
      public: 'bg-green-500 text-white',
      internal: 'bg-blue-500 text-white',
      confidential: 'bg-orange-500 text-white',
      restricted: 'bg-red-500 text-white'
    };

    return (
      <Badge className={colors[classification as keyof typeof colors]}>
        {classification.charAt(0).toUpperCase() + classification.slice(1)}
      </Badge>
    );
  };

  const getEncryptionBadge = (status: string) => {
    const colors = {
      encrypted: 'bg-green-500 text-white',
      unencrypted: 'bg-red-500 text-white',
      partially_encrypted: 'bg-yellow-500 text-white'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getKeyStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-500 text-white',
      rotating: 'bg-blue-500 text-white',
      deprecated: 'bg-yellow-500 text-white',
      revoked: 'bg-red-500 text-white'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getComplianceBadge = (status: string) => {
    const colors = {
      compliant: 'bg-green-500 text-white',
      non_compliant: 'bg-red-500 text-white',
      pending: 'bg-yellow-500 text-white'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const filteredAssets = assets?.filter(asset => {
    const matchesClassification = filterClassification === 'all' || asset.classification === filterClassification;
    const matchesSearch = !searchQuery || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesClassification && matchesSearch;
  }) || [];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Protection Center</h1>
          <p className="text-gray-600">Advanced encryption, data loss prevention, and privacy controls</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
            <Shield className="h-4 w-4 mr-2" />
            Full Scan
          </Button>
        </div>
      </div>

      {/* Data Protection Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Encryption Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metricsLoading ? '...' : `${metrics?.encryptionCoverage || 0}%`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Of all data assets</p>
            {metrics && (
              <Progress value={metrics.encryptionCoverage} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metricsLoading ? '...' : metrics?.keyManagement.activeKeys || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Encryption keys in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">DLP Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metricsLoading ? '...' : metrics?.dlpViolations || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">In the last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Privacy Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metricsLoading ? '...' : `${metrics?.privacyComplianceScore || 0}/100`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Compliance rating</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">Data Assets</TabsTrigger>
          <TabsTrigger value="keys">Encryption Keys</TabsTrigger>
          <TabsTrigger value="dlp">Data Loss Prevention</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Asset Protection</CardTitle>
                  <CardDescription>Monitor and protect sensitive data across your organization</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48"
                    />
                  </div>
                  <Select value={filterClassification} onValueChange={setFilterClassification}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {assetsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredAssets.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAssets.map((asset) => (
                      <Card key={asset.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                {asset.type === 'database' && <Database className="h-5 w-5 text-blue-600" />}
                                {asset.type === 'file' && <FileText className="h-5 w-5 text-blue-600" />}
                                {asset.type === 'backup' && <HardDrive className="h-5 w-5 text-blue-600" />}
                                {asset.type === 'logs' && <Server className="h-5 w-5 text-blue-600" />}
                                {asset.type === 'configuration' && <Settings className="h-5 w-5 text-blue-600" />}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{asset.name}</h4>
                                  {getClassificationBadge(asset.classification)}
                                  {getEncryptionBadge(asset.encryptionStatus)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {asset.type} • {formatBytes(asset.size)} • {asset.location}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Risk Score: {asset.riskScore}/100 • Last accessed {formatTimeAgo(asset.lastAccessed)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right text-sm">
                                <div className="font-medium">{asset.accessCount} accesses</div>
                                {getComplianceBadge(asset.complianceStatus)}
                              </div>
                              {asset.encryptionStatus === 'unencrypted' && (
                                <Button
                                  size="sm"
                                  onClick={() => encryptAssetMutation.mutate({ assetId: asset.id, method: 'AES-256' })}
                                >
                                  <Lock className="h-4 w-4 mr-1" />
                                  Encrypt
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
                    <Database className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No data assets found</h3>
                    <p className="text-gray-600">No assets match your search criteria</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Encryption Key Management</CardTitle>
              <CardDescription>Manage and rotate encryption keys for optimal security</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {keysLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : keys && keys.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keys.map((key) => (
                      <Card key={key.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Key className="h-5 w-5 text-yellow-600" />
                              <div>
                                <h4 className="font-medium">{key.name}</h4>
                                <div className="text-sm text-gray-600">{key.algorithm}</div>
                              </div>
                            </div>
                            {getKeyStatusBadge(key.status)}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Usage:</span>
                              <span>{key.usage.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Strength:</span>
                              <span>{key.strength}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Used:</span>
                              <span>{key.usageCount.toLocaleString()} times</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expires:</span>
                              <span>{new Date(key.expiresAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="text-xs text-gray-500">
                              Created {formatTimeAgo(key.createdAt)}
                            </div>
                            {key.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rotateKeyMutation.mutate(key.id)}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Rotate
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Key className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No encryption keys</h3>
                    <p className="text-gray-600 mb-4">Generate encryption keys for data protection</p>
                    <Button>Generate Key</Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dlp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Loss Prevention</CardTitle>
              <CardDescription>Prevent unauthorized access and data exfiltration</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {dlpLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : dlpPolicies && dlpPolicies.length > 0 ? (
                  <div className="space-y-4">
                    {dlpPolicies.map((policy) => (
                      <Card key={policy.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Shield className="h-4 w-4 text-purple-500" />
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
                                toggleDLPMutation.mutate({ policyId: policy.id, enabled })
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No DLP policies</h3>
                    <p className="text-gray-600 mb-4">Configure data loss prevention policies</p>
                    <Button>Add DLP Policy</Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Controls</CardTitle>
              <CardDescription>Manage data privacy and regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {privacyLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : privacyControls && privacyControls.length > 0 ? (
                  <div className="space-y-4">
                    {privacyControls.map((control) => (
                      <Card key={control.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Fingerprint className="h-5 w-5 text-green-600" />
                              <div>
                                <h4 className="font-medium">{control.name}</h4>
                                <div className="text-sm text-gray-600">{control.regulation}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right">
                                <div className="text-sm font-medium">Score: {control.complianceScore}/100</div>
                                <Progress value={control.complianceScore} className="w-20 mt-1" />
                              </div>
                              <Switch
                                checked={control.enabled}
                                onCheckedChange={(enabled) =>
                                  togglePrivacyMutation.mutate({ controlId: control.id, enabled })
                                }
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium mb-1">Data Types</div>
                              <div className="text-gray-600">{control.dataTypes.join(', ')}</div>
                            </div>
                            <div>
                              <div className="font-medium mb-1">Retention</div>
                              <div className="text-gray-600">{control.retentionPeriod} days</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mt-3 text-sm">
                            <div className="flex items-center space-x-1">
                              {control.consentRequired ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                              <span>Consent Required</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {control.rightToForget ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                              <span>Right to Forget</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {control.dataPortability ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                              <span>Data Portability</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Fingerprint className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No privacy controls</h3>
                    <p className="text-gray-600 mb-4">Configure privacy and compliance controls</p>
                    <Button>Add Privacy Control</Button>
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