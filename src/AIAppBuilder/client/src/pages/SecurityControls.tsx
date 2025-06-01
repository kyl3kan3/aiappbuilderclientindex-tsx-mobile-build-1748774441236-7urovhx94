import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Key, Lock, Users, Shield, AlertTriangle, RefreshCw, Eye, Circle, Database, UserPlus, FileText, Settings, Loader2, XCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

// Mock security settings
const initialSecuritySettings = {
  id: 1,
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAgeDays: 90,
    preventReuseCount: 10,
    lockoutThreshold: 5,
    lockoutDurationMinutes: 30
  },
  requireTwoFactor: true,
  allowedTwoFactorMethods: ['totp', 'email', 'recovery_code'],
  sessionTimeoutMinutes: 60,
  ipRestrictions: [],
  allowedOrigins: ['https://example.com'],
  enforceStrongCiphers: true,
  dataEncryptionEnabled: true,
  sensitiveFieldsEncryption: true,
  auditLogRetentionDays: 365,
  lastUpdatedById: 1,
  lastUpdatedAt: new Date()
};

// Mock API keys
const mockApiKeys = [
  {
    id: 1,
    name: "Development API Key",
    key: "pk_test_3eC91vXVL7XF",
    createdAt: new Date('2023-01-15'),
    lastUsed: new Date('2023-05-10'),
    expiresAt: new Date('2024-01-15'),
    permissions: ['project:read', 'deployment:read'],
    ipRestrictions: []
  },
  {
    id: 2,
    name: "Production API Key",
    key: "pk_live_8mH42bPcR7ZQ",
    createdAt: new Date('2023-02-20'),
    lastUsed: new Date('2023-05-18'),
    expiresAt: new Date('2023-08-20'),
    permissions: ['project:read'],
    ipRestrictions: ['192.168.1.0/24']
  }
];

// Mock audit logs
const mockAuditLogs = [
  {
    id: 1,
    userId: 1,
    action: 'login',
    resourceType: 'session',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date('2023-05-20T10:30:00Z'),
    success: true
  },
  {
    id: 2,
    userId: 1,
    action: 'security_settings_updated',
    resourceType: 'security_settings',
    resourceId: 1,
    details: 'Updated password policy',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date('2023-05-20T11:15:00Z'),
    success: true
  },
  {
    id: 3,
    userId: 2,
    action: 'login_failed',
    resourceType: 'session',
    details: 'Invalid password',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date('2023-05-20T14:20:00Z'),
    success: false,
    failureReason: 'Invalid credentials'
  },
  {
    id: 4,
    userId: 1,
    action: 'api_key_created',
    resourceType: 'api_key',
    resourceId: 2,
    details: 'Created new API key: Production API Key',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date('2023-05-21T09:45:00Z'),
    success: true
  },
  {
    id: 5,
    userId: 3,
    action: 'access_denied',
    resourceType: 'deployment',
    resourceId: 12,
    details: 'Attempted to access production deployment without permission',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    timestamp: new Date('2023-05-22T16:30:00Z'),
    success: false,
    failureReason: 'Insufficient permissions'
  }
];

// Mock users with roles
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    twoFactorEnabled: true,
    lastLogin: new Date('2023-05-22T10:15:00Z'),
    accountLocked: false
  },
  {
    id: 2,
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'manager',
    twoFactorEnabled: true,
    lastLogin: new Date('2023-05-21T14:30:00Z'),
    accountLocked: false
  },
  {
    id: 3,
    name: 'Developer User',
    email: 'developer@example.com',
    role: 'developer',
    twoFactorEnabled: false,
    lastLogin: new Date('2023-05-20T09:45:00Z'),
    accountLocked: false
  },
  {
    id: 4,
    name: 'Viewer User',
    email: 'viewer@example.com',
    role: 'viewer',
    twoFactorEnabled: false,
    lastLogin: new Date('2023-05-19T16:20:00Z'),
    accountLocked: true
  }
];

// Two-factor methods
const twoFactorMethods = [
  { value: 'totp', label: 'Time-based OTP (Authenticator App)' },
  { value: 'sms', label: 'SMS Text Message' },
  { value: 'email', label: 'Email' },
  { value: 'hardware_token', label: 'Hardware Security Key' },
  { value: 'recovery_code', label: 'Recovery Codes' }
];

// Permission options
const permissionOptions = [
  { value: 'project:create', label: 'Create Projects', group: 'Projects' },
  { value: 'project:read', label: 'View Projects', group: 'Projects' },
  { value: 'project:update', label: 'Edit Projects', group: 'Projects' },
  { value: 'project:delete', label: 'Delete Projects', group: 'Projects' },
  
  { value: 'deployment:create', label: 'Create Deployments', group: 'Deployments' },
  { value: 'deployment:read', label: 'View Deployments', group: 'Deployments' },
  { value: 'deployment:update', label: 'Edit Deployments', group: 'Deployments' },
  { value: 'deployment:delete', label: 'Delete Deployments', group: 'Deployments' },
  { value: 'deployment:execute', label: 'Execute Deployments', group: 'Deployments' },
  
  { value: 'team:create', label: 'Create Teams', group: 'Teams' },
  { value: 'team:read', label: 'View Teams', group: 'Teams' },
  { value: 'team:update', label: 'Edit Teams', group: 'Teams' },
  { value: 'team:delete', label: 'Delete Teams', group: 'Teams' },
  { value: 'team:invite', label: 'Invite Team Members', group: 'Teams' },
  
  { value: 'admin:access', label: 'Admin Access', group: 'Administration' },
  { value: 'security:settings', label: 'Security Settings', group: 'Administration' }
];

// Available roles
const roleOptions = [
  { value: 'admin', label: 'Administrator', description: 'Full access to all features and settings' },
  { value: 'manager', label: 'Manager', description: 'Can manage projects, deployments, and teams' },
  { value: 'developer', label: 'Developer', description: 'Can view and modify projects and deployments' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access to projects and deployments' }
];

// User form type
interface UserFormData {
  name: string;
  email: string;
  role: string;
  twoFactorRequired: boolean;
  permissions: string[];
}

// API Key form type
interface ApiKeyFormData {
  name: string;
  expiresInDays: number;
  permissions: string[];
  ipRestrictions: string;
}

const SecurityControls = () => {
  // State for settings
  const [securitySettings, setSecuritySettings] = useState(initialSecuritySettings);
  const [users, setUsers] = useState(mockUsers);
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs);
  
  // Form state
  const [newUser, setNewUser] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'developer',
    twoFactorRequired: true,
    permissions: []
  });
  
  const [newApiKey, setNewApiKey] = useState<ApiKeyFormData>({
    name: '',
    expiresInDays: 90,
    permissions: ['project:read'],
    ipRestrictions: ''
  });
  
  // Dialog state
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showAddApiKeyDialog, setShowAddApiKeyDialog] = useState(false);
  const [showRevokeApiKeyDialog, setShowRevokeApiKeyDialog] = useState(false);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<number | null>(null);
  
  // Loading states
  const [savingSettings, setSavingSettings] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [creatingApiKey, setCreatingApiKey] = useState(false);
  const [revokingApiKey, setRevokingApiKey] = useState(false);
  
  // Filter state for audit logs
  const [auditLogFilters, setAuditLogFilters] = useState({
    userId: '',
    action: '',
    dateFrom: '',
    dateTo: '',
    success: ''
  });
  
  // Filtered audit logs
  const filteredAuditLogs = auditLogs.filter(log => {
    if (auditLogFilters.userId && log.userId !== parseInt(auditLogFilters.userId)) {
      return false;
    }
    
    if (auditLogFilters.action && log.action !== auditLogFilters.action) {
      return false;
    }
    
    if (auditLogFilters.dateFrom) {
      const fromDate = new Date(auditLogFilters.dateFrom);
      if (log.timestamp < fromDate) {
        return false;
      }
    }
    
    if (auditLogFilters.dateTo) {
      const toDate = new Date(auditLogFilters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      if (log.timestamp > toDate) {
        return false;
      }
    }
    
    if (auditLogFilters.success) {
      const successFilter = auditLogFilters.success === 'true';
      if (log.success !== successFilter) {
        return false;
      }
    }
    
    return true;
  });
  
  // Update security settings
  const handleSettingsChange = (section: string, field: string, value: any) => {
    setSecuritySettings(prev => {
      if (section === 'root') {
        return { ...prev, [field]: value };
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
    });
  };
  
  // Save security settings
  const saveSecuritySettings = async () => {
    setSavingSettings(true);
    
    // Simulate API call
    setTimeout(() => {
      setSecuritySettings(prev => ({
        ...prev,
        lastUpdatedAt: new Date()
      }));
      
      setSavingSettings(false);
      
      toast({
        title: "Security settings updated",
        description: "Your security settings have been updated successfully.",
      });
      
      // Add to audit log
      const newLog = {
        id: auditLogs.length + 1,
        userId: 1,
        action: 'security_settings_updated',
        resourceType: 'security_settings',
        resourceId: 1,
        details: 'Updated security settings',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(),
        success: true
      };
      
      setAuditLogs([newLog, ...auditLogs]);
    }, 1500);
  };
  
  // Add new user
  const addUser = () => {
    setCreatingUser(true);
    
    // Simulate API call
    setTimeout(() => {
      const newUserEntry = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        twoFactorEnabled: newUser.twoFactorRequired,
        lastLogin: null,
        accountLocked: false
      };
      
      setUsers([...users, newUserEntry]);
      setCreatingUser(false);
      setShowAddUserDialog(false);
      
      toast({
        title: "User created",
        description: `${newUser.name} has been added as a ${newUser.role}.`,
      });
      
      // Add to audit log
      const newLog = {
        id: auditLogs.length + 1,
        userId: 1,
        action: 'user_created',
        resourceType: 'user',
        resourceId: newUserEntry.id,
        details: `Created new user: ${newUser.name}`,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(),
        success: true
      };
      
      setAuditLogs([newLog, ...auditLogs]);
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        role: 'developer',
        twoFactorRequired: true,
        permissions: []
      });
    }, 1500);
  };
  
  // Create new API key
  const createApiKey = () => {
    setCreatingApiKey(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + newApiKey.expiresInDays);
      
      // Create new API key
      const newKeyEntry = {
        id: apiKeys.length + 1,
        name: newApiKey.name,
        key: `pk_${Math.random().toString(36).substring(2, 10)}`,
        createdAt: new Date(),
        lastUsed: null,
        expiresAt,
        permissions: newApiKey.permissions,
        ipRestrictions: newApiKey.ipRestrictions ? newApiKey.ipRestrictions.split(',').map(ip => ip.trim()) : []
      };
      
      setApiKeys([...apiKeys, newKeyEntry]);
      setCreatingApiKey(false);
      setShowAddApiKeyDialog(false);
      
      toast({
        title: "API Key created",
        description: `New API key "${newApiKey.name}" has been created.`,
      });
      
      // Add to audit log
      const newLog = {
        id: auditLogs.length + 1,
        userId: 1,
        action: 'api_key_created',
        resourceType: 'api_key',
        resourceId: newKeyEntry.id,
        details: `Created new API key: ${newApiKey.name}`,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(),
        success: true
      };
      
      setAuditLogs([newLog, ...auditLogs]);
      
      // Reset form
      setNewApiKey({
        name: '',
        expiresInDays: 90,
        permissions: ['project:read'],
        ipRestrictions: ''
      });
    }, 1500);
  };
  
  // Revoke API key
  const revokeApiKey = () => {
    if (!selectedApiKeyId) return;
    
    setRevokingApiKey(true);
    
    // Simulate API call
    setTimeout(() => {
      setApiKeys(apiKeys.filter(key => key.id !== selectedApiKeyId));
      setRevokingApiKey(false);
      setShowRevokeApiKeyDialog(false);
      
      toast({
        title: "API Key revoked",
        description: "The API key has been revoked successfully.",
      });
      
      // Add to audit log
      const keyName = apiKeys.find(k => k.id === selectedApiKeyId)?.name;
      
      const newLog = {
        id: auditLogs.length + 1,
        userId: 1,
        action: 'api_key_revoked',
        resourceType: 'api_key',
        resourceId: selectedApiKeyId,
        details: `Revoked API key: ${keyName}`,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(),
        success: true
      };
      
      setAuditLogs([newLog, ...auditLogs]);
      setSelectedApiKeyId(null);
    }, 1500);
  };
  
  // Handle audit log filters
  const handleAuditLogFilterChange = (field: string, value: string) => {
    setAuditLogFilters(prev => ({ ...prev, [field]: value }));
  };
  
  // Clear audit log filters
  const clearAuditLogFilters = () => {
    setAuditLogFilters({
      userId: '',
      action: '',
      dateFrom: '',
      dateTo: '',
      success: ''
    });
  };
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };
  
  // Get user by ID
  const getUserById = (id: number) => {
    return users.find(user => user.id === id);
  };
  
  // Get action label
  const getActionLabel = (action: string) => {
    const actionMap: {[key: string]: string} = {
      'login': 'Login',
      'logout': 'Logout',
      'login_failed': 'Login Failed',
      'password_changed': 'Password Changed',
      'password_reset': 'Password Reset',
      'user_created': 'User Created',
      'user_updated': 'User Updated',
      'user_deleted': 'User Deleted',
      'role_assigned': 'Role Assigned',
      'permission_granted': 'Permission Granted',
      'permission_revoked': 'Permission Revoked',
      'two_factor_enabled': 'Two-Factor Enabled',
      'two_factor_disabled': 'Two-Factor Disabled',
      'api_key_created': 'API Key Created',
      'api_key_used': 'API Key Used',
      'api_key_revoked': 'API Key Revoked',
      'security_settings_updated': 'Security Settings Updated',
      'suspicious_activity': 'Suspicious Activity',
      'access_denied': 'Access Denied'
    };
    
    return actionMap[action] || action;
  };
  
  // Get status indicator
  const getStatusIndicator = (success: boolean, size: number = 16) => {
    return success ? (
      <CheckCircle2 className="text-green-500" size={size} />
    ) : (
      <XCircle className="text-red-500" size={size} />
    );
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold">Security Controls</h1>
        <p className="text-xl text-muted-foreground">
          Manage security settings and access controls for your organization
        </p>
      </div>
      
      <Tabs defaultValue="security-settings">
        <TabsList className="mb-6">
          <TabsTrigger value="security-settings" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Settings
          </TabsTrigger>
          <TabsTrigger value="users-roles" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>
        
        {/* Security Settings Tab */}
        <TabsContent value="security-settings">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security policies and controls for your organization
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Password Policy Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Password Policy</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Minimum Password Length</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="min-length"
                        value={[securitySettings.passwordPolicy.minLength]}
                        min={8}
                        max={24}
                        step={1}
                        onValueChange={(value) => handleSettingsChange('passwordPolicy', 'minLength', value[0])}
                        className="flex-1"
                      />
                      <span className="font-medium text-sm w-8 text-center">
                        {securitySettings.passwordPolicy.minLength}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-age">Password Expiry (Days)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="max-age"
                        value={[securitySettings.passwordPolicy.maxAgeDays]}
                        min={30}
                        max={365}
                        step={1}
                        onValueChange={(value) => handleSettingsChange('passwordPolicy', 'maxAgeDays', value[0])}
                        className="flex-1"
                      />
                      <span className="font-medium text-sm w-8 text-center">
                        {securitySettings.passwordPolicy.maxAgeDays}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prevent-reuse">Password History</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="prevent-reuse"
                        value={[securitySettings.passwordPolicy.preventReuseCount]}
                        min={0}
                        max={24}
                        step={1}
                        onValueChange={(value) => handleSettingsChange('passwordPolicy', 'preventReuseCount', value[0])}
                        className="flex-1"
                      />
                      <span className="font-medium text-sm w-8 text-center">
                        {securitySettings.passwordPolicy.preventReuseCount}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of previous passwords that cannot be reused
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="require-uppercase"
                        checked={securitySettings.passwordPolicy.requireUppercase}
                        onCheckedChange={(checked) => handleSettingsChange('passwordPolicy', 'requireUppercase', checked)}
                      />
                      <Label htmlFor="require-uppercase">Require uppercase letters</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="require-lowercase"
                        checked={securitySettings.passwordPolicy.requireLowercase}
                        onCheckedChange={(checked) => handleSettingsChange('passwordPolicy', 'requireLowercase', checked)}
                      />
                      <Label htmlFor="require-lowercase">Require lowercase letters</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="require-numbers"
                        checked={securitySettings.passwordPolicy.requireNumbers}
                        onCheckedChange={(checked) => handleSettingsChange('passwordPolicy', 'requireNumbers', checked)}
                      />
                      <Label htmlFor="require-numbers">Require numbers</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="require-special"
                        checked={securitySettings.passwordPolicy.requireSpecialChars}
                        onCheckedChange={(checked) => handleSettingsChange('passwordPolicy', 'requireSpecialChars', checked)}
                      />
                      <Label htmlFor="require-special">Require special characters</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Two-Factor Authentication Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-2fa">Require Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require all users to set up two-factor authentication
                      </p>
                    </div>
                    <Switch
                      id="require-2fa"
                      checked={securitySettings.requireTwoFactor}
                      onCheckedChange={(checked) => handleSettingsChange('root', 'requireTwoFactor', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Allowed Authentication Methods</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {twoFactorMethods.map((method) => (
                        <div key={method.value} className="flex items-center space-x-2">
                          <Switch
                            id={`2fa-${method.value}`}
                            checked={securitySettings.allowedTwoFactorMethods.includes(method.value)}
                            onCheckedChange={(checked) => {
                              const methods = checked
                                ? [...securitySettings.allowedTwoFactorMethods, method.value]
                                : securitySettings.allowedTwoFactorMethods.filter(m => m !== method.value);
                              handleSettingsChange('root', 'allowedTwoFactorMethods', methods);
                            }}
                          />
                          <Label htmlFor={`2fa-${method.value}`}>{method.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Session Security Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Session Security</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (Minutes)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="session-timeout"
                        value={[securitySettings.sessionTimeoutMinutes]}
                        min={5}
                        max={240}
                        step={5}
                        onValueChange={(value) => handleSettingsChange('root', 'sessionTimeoutMinutes', value[0])}
                        className="flex-1"
                      />
                      <span className="font-medium text-sm w-10 text-center">
                        {securitySettings.sessionTimeoutMinutes}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Users will be logged out after this period of inactivity
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lockout-threshold">Account Lockout Threshold</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="lockout-threshold"
                        value={[securitySettings.passwordPolicy.lockoutThreshold]}
                        min={3}
                        max={10}
                        step={1}
                        onValueChange={(value) => handleSettingsChange('passwordPolicy', 'lockoutThreshold', value[0])}
                        className="flex-1"
                      />
                      <span className="font-medium text-sm w-8 text-center">
                        {securitySettings.passwordPolicy.lockoutThreshold}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of failed login attempts before account is locked
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lockout-duration">Account Lockout Duration (Minutes)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="lockout-duration"
                        value={[securitySettings.passwordPolicy.lockoutDurationMinutes]}
                        min={5}
                        max={1440}
                        step={5}
                        onValueChange={(value) => handleSettingsChange('passwordPolicy', 'lockoutDurationMinutes', value[0])}
                        className="flex-1"
                      />
                      <span className="font-medium text-sm w-10 text-center">
                        {securitySettings.passwordPolicy.lockoutDurationMinutes}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allowed-origins">Allowed Origins (CORS)</Label>
                    <Textarea
                      id="allowed-origins"
                      placeholder="https://example.com, https://app.example.com"
                      value={securitySettings.allowedOrigins?.join(', ') || ''}
                      onChange={(e) => {
                        const origins = e.target.value.split(',').map(o => o.trim()).filter(Boolean);
                        handleSettingsChange('root', 'allowedOrigins', origins);
                      }}
                      className="h-20"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Comma-separated list of domains that can access the API
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Data Security Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Data Security</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-encryption">Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable encryption for data at rest
                      </p>
                    </div>
                    <Switch
                      id="data-encryption"
                      checked={securitySettings.dataEncryptionEnabled}
                      onCheckedChange={(checked) => handleSettingsChange('root', 'dataEncryptionEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sensitive-fields">Sensitive Fields Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable additional encryption for sensitive fields (API keys, tokens, etc.)
                      </p>
                    </div>
                    <Switch
                      id="sensitive-fields"
                      checked={securitySettings.sensitiveFieldsEncryption}
                      onCheckedChange={(checked) => handleSettingsChange('root', 'sensitiveFieldsEncryption', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="strong-ciphers">Enforce Strong Ciphers</Label>
                      <p className="text-sm text-muted-foreground">
                        Enforce TLS 1.2+ and strong cipher suites for all connections
                      </p>
                    </div>
                    <Switch
                      id="strong-ciphers"
                      checked={securitySettings.enforceStrongCiphers}
                      onCheckedChange={(checked) => handleSettingsChange('root', 'enforceStrongCiphers', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="log-retention">Audit Log Retention (Days)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="log-retention"
                        value={[securitySettings.auditLogRetentionDays]}
                        min={30}
                        max={1825}
                        step={30}
                        onValueChange={(value) => handleSettingsChange('root', 'auditLogRetentionDays', value[0])}
                        className="flex-1"
                      />
                      <span className="font-medium text-sm w-10 text-center">
                        {securitySettings.auditLogRetentionDays}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(securitySettings.lastUpdatedAt)}
              </div>
              <Button 
                onClick={saveSecuritySettings}
                disabled={savingSettings}
              >
                {savingSettings ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Users & Roles Tab */}
        <TabsContent value="users-roles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Users & Roles</CardTitle>
                <CardDescription>
                  Manage users and their access permissions
                </CardDescription>
              </div>
              
              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account with role-based permissions.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {roleOptions.find(r => r.value === newUser.role)?.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="require-2fa-user"
                        checked={newUser.twoFactorRequired}
                        onCheckedChange={(checked) => setNewUser(prev => ({ ...prev, twoFactorRequired: checked }))}
                      />
                      <Label htmlFor="require-2fa-user">Require two-factor authentication</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      onClick={addUser}
                      disabled={creatingUser || !newUser.name || !newUser.email}
                    >
                      {creatingUser ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>Create User</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>2FA</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'manager'
                            ? 'bg-blue-100 text-blue-800'
                            : user.role === 'developer'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.twoFactorEnabled ? (
                          <CheckCircle2 className="text-green-500 h-5 w-5" />
                        ) : (
                          <AlertCircle className="text-amber-500 h-5 w-5" />
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell>
                        {user.accountLocked ? (
                          <span className="flex items-center text-red-600">
                            <Lock className="h-4 w-4 mr-1" />
                            Locked
                          </span>
                        ) : (
                          <span className="flex items-center text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Active
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* API Keys Tab */}
        <TabsContent value="api-keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for programmatic access
                </CardDescription>
              </div>
              
              <Dialog open={showAddApiKeyDialog} onOpenChange={setShowAddApiKeyDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Key className="mr-2 h-4 w-4" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Create a new API key with specific permissions and restrictions.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="key-name">API Key Name</Label>
                      <Input
                        id="key-name"
                        value={newApiKey.name}
                        onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Production API Key"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="key-expiry">Expiration</Label>
                      <Select
                        value={newApiKey.expiresInDays.toString()}
                        onValueChange={(value) => setNewApiKey(prev => ({ ...prev, expiresInDays: parseInt(value) }))}
                      >
                        <SelectTrigger id="key-expiry">
                          <SelectValue placeholder="Select expiration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                          <SelectItem value="730">2 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="key-permissions">Permissions</Label>
                      <div className="h-40 overflow-y-auto border rounded-md p-2">
                        {permissionOptions.sort((a, b) => a.group.localeCompare(b.group)).map((permission, index, array) => {
                          // Add group headers
                          const prevGroup = index > 0 ? array[index - 1].group : null;
                          const showGroupHeader = prevGroup !== permission.group;
                          
                          return (
                            <React.Fragment key={permission.value}>
                              {showGroupHeader && (
                                <div className="text-sm font-medium text-muted-foreground mt-2 mb-1 first:mt-0">
                                  {permission.group}
                                </div>
                              )}
                              <div className="flex items-center space-x-2 py-1">
                                <Switch
                                  id={`perm-${permission.value}`}
                                  checked={newApiKey.permissions.includes(permission.value)}
                                  onCheckedChange={(checked) => {
                                    const permissions = checked
                                      ? [...newApiKey.permissions, permission.value]
                                      : newApiKey.permissions.filter(p => p !== permission.value);
                                    setNewApiKey(prev => ({ ...prev, permissions }));
                                  }}
                                />
                                <Label 
                                  htmlFor={`perm-${permission.value}`}
                                  className="text-sm"
                                >
                                  {permission.label}
                                </Label>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ip-restrictions">IP Restrictions (Optional)</Label>
                      <Textarea
                        id="ip-restrictions"
                        value={newApiKey.ipRestrictions}
                        onChange={(e) => setNewApiKey(prev => ({ ...prev, ipRestrictions: e.target.value }))}
                        placeholder="192.168.1.0/24, 10.0.0.5"
                        className="h-20"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Comma-separated list of IP addresses or CIDR ranges that can use this key
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      onClick={createApiKey}
                      disabled={creatingApiKey || !newApiKey.name || newApiKey.permissions.length === 0}
                    >
                      {creatingApiKey ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>Create API Key</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Restrictions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {apiKey.key.substring(0, 8)}...{apiKey.key.substring(apiKey.key.length - 4)}
                        </code>
                      </TableCell>
                      <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                      <TableCell>
                        {apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date() ? (
                          <span className="flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            Expired
                          </span>
                        ) : (
                          formatDate(apiKey.expiresAt)
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apiKey.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permissionOptions.find(p => p.value === permission)?.label || permission}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {apiKey.ipRestrictions?.length > 0 ? (
                          <span className="text-xs text-muted-foreground">
                            {apiKey.ipRestrictions.join(', ')}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No restrictions</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog open={showRevokeApiKeyDialog && selectedApiKeyId === apiKey.id} onOpenChange={(open) => {
                          setShowRevokeApiKeyDialog(open);
                          if (open) setSelectedApiKeyId(apiKey.id);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Revoke
                            </Button>
                          </DialogTrigger>
                          
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Revoke API Key</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to revoke this API key? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="py-4">
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Warning</AlertTitle>
                                <AlertDescription>
                                  Revoking this key will immediately invalidate it. Any services using this key will no longer be able to access the API.
                                </AlertDescription>
                              </Alert>
                            </div>
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowRevokeApiKeyDialog(false)}>
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={revokeApiKey}
                                disabled={revokingApiKey}
                              >
                                {revokingApiKey ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Revoking...
                                  </>
                                ) : (
                                  <>Revoke API Key</>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {apiKeys.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Key className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <p className="text-muted-foreground">No API keys</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setShowAddApiKeyDialog(true)}
                        >
                          Create your first API key
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Audit Logs Tab */}
        <TabsContent value="audit-logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Security Audit Logs</CardTitle>
                <CardDescription>
                  Review security events and user activity
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={clearAuditLogFilters}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label htmlFor="filter-user" className="mb-2 block">User</Label>
                  <Select
                    value={auditLogFilters.userId}
                    onValueChange={(value) => handleAuditLogFilterChange('userId', value)}
                  >
                    <SelectTrigger id="filter-user">
                      <SelectValue placeholder="All Users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Users</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="filter-action" className="mb-2 block">Action</Label>
                  <Select
                    value={auditLogFilters.action}
                    onValueChange={(value) => handleAuditLogFilterChange('action', value)}
                  >
                    <SelectTrigger id="filter-action">
                      <SelectValue placeholder="All Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Actions</SelectItem>
                      {Array.from(new Set(auditLogs.map(log => log.action))).map((action) => (
                        <SelectItem key={action} value={action}>
                          {getActionLabel(action)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="filter-date-from" className="mb-2 block">From Date</Label>
                  <Input
                    id="filter-date-from"
                    type="date"
                    value={auditLogFilters.dateFrom}
                    onChange={(e) => handleAuditLogFilterChange('dateFrom', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="filter-date-to" className="mb-2 block">To Date</Label>
                  <Input
                    id="filter-date-to"
                    type="date"
                    value={auditLogFilters.dateTo}
                    onChange={(e) => handleAuditLogFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Logs Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-right">User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditLogs.map((log) => {
                    const user = getUserById(log.userId);
                    
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          {getStatusIndicator(log.success)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          {user ? (
                            <span className="font-medium">{user.name}</span>
                          ) : (
                            <span className="text-muted-foreground">Unknown User</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="whitespace-nowrap">
                            {getActionLabel(log.action)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {log.details}
                            {log.failureReason && (
                              <span className="text-red-500 block text-xs">
                                Reason: {log.failureReason}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs">{log.ipAddress}</code>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="max-w-xs truncate text-xs text-muted-foreground">
                            {log.userAgent}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {filteredAuditLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <p className="text-muted-foreground">No audit logs match your filters</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={clearAuditLogFilters}
                        >
                          Clear Filters
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityControls;