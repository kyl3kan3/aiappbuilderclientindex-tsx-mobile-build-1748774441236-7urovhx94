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
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  User,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
  Eye,
  Database,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system_change' | 'security';
  outcome: 'success' | 'failure' | 'warning';
  metadata: Record<string, any>;
}

interface ComplianceReport {
  id: string;
  name: string;
  type: 'gdpr' | 'sox' | 'hipaa' | 'iso27001' | 'custom';
  status: 'compliant' | 'non_compliant' | 'pending' | 'review_required';
  score: number;
  lastAssessment: string;
  nextDue: string;
  findings: number;
  criticalIssues: number;
}

interface DataRetentionPolicy {
  id: string;
  name: string;
  description: string;
  dataType: string;
  retentionPeriod: number;
  retentionUnit: 'days' | 'months' | 'years';
  autoDelete: boolean;
  legalHold: boolean;
  status: 'active' | 'draft' | 'archived';
}

interface SecurityControl {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'implemented' | 'planned' | 'not_applicable';
  compliance: string[];
  lastReview: string;
  responsible: string;
}

export default function ComplianceManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch audit logs
  const { data: auditLogs, isLoading: logsLoading } = useQuery<AuditLog[]>({
    queryKey: [`/api/compliance/audit-logs?category=${selectedCategory}&severity=${selectedSeverity}&range=${dateRange}&search=${searchQuery}`],
    refetchInterval: 30000,
  });

  // Fetch compliance reports
  const { data: complianceReports, isLoading: reportsLoading } = useQuery<ComplianceReport[]>({
    queryKey: ['/api/compliance/reports'],
    refetchInterval: 60000,
  });

  // Fetch data retention policies
  const { data: retentionPolicies, isLoading: policiesLoading } = useQuery<DataRetentionPolicy[]>({
    queryKey: ['/api/compliance/retention-policies'],
  });

  // Fetch security controls
  const { data: securityControls, isLoading: controlsLoading } = useQuery<SecurityControl[]>({
    queryKey: ['/api/compliance/security-controls'],
  });

  // Export audit logs mutation
  const exportLogsMutation = useMutation({
    mutationFn: async ({ format, filters }: { format: string; filters: any }) => {
      const response = await fetch('/api/compliance/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, filters }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to export audit logs');
      }
      
      return response.blob();
    },
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Audit logs have been exported successfully.",
      });
      setExportDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      'critical': 'bg-red-500 text-white',
      'high': 'bg-orange-500 text-white',
      'medium': 'bg-yellow-500 text-white',
      'low': 'bg-blue-500 text-white'
    };

    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getComplianceStatusBadge = (status: string) => {
    const variants = {
      'compliant': 'default',
      'non_compliant': 'destructive',
      'pending': 'secondary',
      'review_required': 'outline'
    } as const;

    const colors = {
      'compliant': 'bg-green-500 text-white',
      'non_compliant': 'bg-red-500 text-white',
      'pending': 'bg-yellow-500 text-white',
      'review_required': 'bg-blue-500 text-white'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
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

  const filteredLogs = auditLogs?.filter(log => {
    const matchesSearch = !searchQuery || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  }) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Management</h1>
          <p className="text-gray-600">Monitor audit trails, compliance status, and regulatory requirements</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs?.length || 0}</div>
            <div className="text-xs text-muted-foreground">
              Last {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '24 hours'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {complianceReports?.length ? Math.round(complianceReports.reduce((acc, r) => acc + r.score, 0) / complianceReports.length) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">
              Average across all frameworks
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {complianceReports?.reduce((acc, r) => acc + r.criticalIssues, 0) || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Require immediate attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Retention</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retentionPolicies?.filter(p => p.status === 'active').length || 0}</div>
            <div className="text-xs text-muted-foreground">
              Active policies
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
          <TabsTrigger value="controls">Security Controls</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search actions, users, resources..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="authorization">Authorization</SelectItem>
                      <SelectItem value="data_access">Data Access</SelectItem>
                      <SelectItem value="data_modification">Data Modification</SelectItem>
                      <SelectItem value="system_change">System Change</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateRange">Time Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete record of all system activities and user actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {logsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredLogs.length > 0 ? (
                  <div className="space-y-3">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="mt-0.5">
                            {getOutcomeIcon(log.outcome)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{log.action}</span>
                              <Badge variant="outline" className="text-xs">
                                {log.category.replace('_', ' ')}
                              </Badge>
                              {getSeverityBadge(log.severity)}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">{log.userName}</span> ({log.userEmail}) • 
                              Resource: {log.resource}
                              {log.resourceId && ` (${log.resourceId})`}
                            </div>
                            <div className="text-sm text-gray-500">{log.details}</div>
                            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
                              <span>{formatRelativeTime(log.timestamp)}</span>
                              <span>{log.ipAddress}</span>
                              <span className="truncate max-w-40">{log.userAgent}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getSeverityIcon(log.severity)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No audit logs found</p>
                    <p className="text-sm">Try adjusting your search filters</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportsLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              complianceReports?.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      {getComplianceStatusBadge(report.status)}
                    </div>
                    <CardDescription>
                      {report.type.toUpperCase()} Compliance Assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Compliance Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${report.score >= 80 ? 'bg-green-500' : report.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${report.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">{report.score}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Total Findings</div>
                        <div className="font-bold">{report.findings}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Critical Issues</div>
                        <div className="font-bold text-red-600">{report.criticalIssues}</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <div>Last Assessment: {new Date(report.lastAssessment).toLocaleDateString()}</div>
                      <div>Next Due: {new Date(report.nextDue).toLocaleDateString()}</div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {policiesLoading ? (
              <Card className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ) : (
              retentionPolicies?.map((policy) => (
                <Card key={policy.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      <Badge variant={policy.status === 'active' ? 'default' : 'outline'}>
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>{policy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Data Type</div>
                        <div className="text-gray-600">{policy.dataType}</div>
                      </div>
                      <div>
                        <div className="font-medium">Retention Period</div>
                        <div className="text-gray-600">
                          {policy.retentionPeriod} {policy.retentionUnit}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Auto Delete</div>
                        <div className="text-gray-600">
                          {policy.autoDelete ? 'Enabled' : 'Disabled'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Legal Hold</div>
                        <div className="text-gray-600">
                          {policy.legalHold ? 'Active' : 'None'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {controlsLoading ? (
              [...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              securityControls?.map((control) => (
                <Card key={control.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={control.status === 'implemented' ? 'default' : control.status === 'planned' ? 'secondary' : 'outline'}
                            className={control.status === 'implemented' ? 'bg-green-500 text-white' : ''}
                          >
                            {control.status.replace('_', ' ').charAt(0).toUpperCase() + control.status.replace('_', ' ').slice(1)}
                          </Badge>
                          <span className="font-medium">{control.name}</span>
                          <Badge variant="outline" className="text-xs">{control.category}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{control.description}</div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <span>Compliance: {control.compliance.join(', ')}</span>
                          <span>Responsible: {control.responsible}</span>
                          <span>Last Review: {new Date(control.lastReview).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Summary</CardTitle>
                <CardDescription>Overall compliance status across all frameworks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-gray-600">Overall Compliance Score</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>GDPR</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SOX</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>ISO 27001</span>
                      <span className="font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Current security risks and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium text-sm">Privileged Access Review</div>
                      <div className="text-xs text-gray-500">Overdue by 15 days</div>
                    </div>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium text-sm">Data Encryption Audit</div>
                      <div className="text-xs text-gray-500">Due in 30 days</div>
                    </div>
                    <Badge className="bg-yellow-500 text-white">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium text-sm">Access Log Review</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    <Badge className="bg-green-500 text-white">Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      {exportDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Export Audit Logs</CardTitle>
              <CardDescription>
                Export filtered audit logs for compliance reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exportFormat">Export Format</Label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xlsx">Excel</SelectItem>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Current Filters:</strong><br/>
                Category: {selectedCategory}<br/>
                Severity: {selectedSeverity}<br/>
                Time Range: {dateRange}<br/>
                Results: {filteredLogs.length} records
              </div>
              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => exportLogsMutation.mutate({
                    format: 'csv',
                    filters: { category: selectedCategory, severity: selectedSeverity, range: dateRange }
                  })}
                  disabled={exportLogsMutation.isPending}
                >
                  {exportLogsMutation.isPending ? 'Exporting...' : 'Export'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}