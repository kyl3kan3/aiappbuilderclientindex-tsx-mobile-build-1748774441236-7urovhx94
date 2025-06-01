import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Plus, 
  Settings, 
  Crown, 
  Shield, 
  User, 
  Eye,
  Mail,
  Calendar,
  Activity,
  Building,
  UserPlus,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  projectCount: number;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  ownerId: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'pending' | 'suspended';
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  teamId: string;
  projectCount: number;
  memberCount: number;
  isDefault: boolean;
  createdAt: string;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
}

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [createWorkspaceDialogOpen, setCreateWorkspaceDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'guest'>('member');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch team data
  const { data: team, isLoading: teamLoading } = useQuery<Team>({
    queryKey: ['/api/teams/current'],
  });

  // Fetch team members
  const { data: members, isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/teams/members'],
    refetchInterval: 30000,
  });

  // Fetch workspaces
  const { data: workspaces, isLoading: workspacesLoading } = useQuery<Workspace[]>({
    queryKey: ['/api/teams/workspaces'],
  });

  // Fetch pending invitations
  const { data: invitations, isLoading: invitationsLoading } = useQuery<TeamInvitation[]>({
    queryKey: ['/api/teams/invitations'],
  });

  // Send invitation mutation
  const inviteMemberMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await fetch('/api/teams/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation Sent",
        description: "Team invitation has been sent successfully.",
      });
      setInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('member');
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Invitation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create workspace mutation
  const createWorkspaceMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      const response = await fetch('/api/teams/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create workspace');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Workspace Created",
        description: "New workspace has been created successfully.",
      });
      setCreateWorkspaceDialogOpen(false);
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Workspace",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'member': return <User className="h-4 w-4 text-green-500" />;
      case 'guest': return <Eye className="h-4 w-4 text-gray-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      'owner': 'default',
      'admin': 'secondary',
      'member': 'outline',
      'guest': 'outline'
    } as const;

    const colors = {
      'owner': 'bg-yellow-500 text-white',
      'admin': 'bg-blue-500 text-white',
      'member': 'bg-green-500 text-white',
      'guest': 'bg-gray-500 text-white'
    };

    return (
      <Badge variant={variants[role as keyof typeof variants]} className={colors[role as keyof typeof colors]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'pending': 'secondary',
      'suspended': 'destructive',
      'accepted': 'default',
      'declined': 'destructive',
      'expired': 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      'free': 'bg-gray-500',
      'pro': 'bg-blue-500',
      'enterprise': 'bg-purple-500'
    };

    return (
      <Badge className={`${colors[plan as keyof typeof colors]} text-white`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-600">Manage your team, workspaces, and collaboration settings</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={createWorkspaceDialogOpen} onOpenChange={setCreateWorkspaceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Building className="h-4 w-4 mr-2" />
                New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>
                  Create a new workspace to organize your team's projects.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workspaceName">Workspace Name</Label>
                  <Input
                    id="workspaceName"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Mobile Development"
                  />
                </div>
                <div>
                  <Label htmlFor="workspaceDescription">Description</Label>
                  <Input
                    id="workspaceDescription"
                    value={newWorkspaceDescription}
                    onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                    placeholder="Workspace for mobile app projects"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => createWorkspaceMutation.mutate({
                    name: newWorkspaceName,
                    description: newWorkspaceDescription
                  })}
                  disabled={!newWorkspaceName || createWorkspaceMutation.isPending}
                >
                  {createWorkspaceMutation.isPending ? 'Creating...' : 'Create Workspace'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your team. They'll receive an email with instructions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={(value: 'admin' | 'member' | 'guest') => setInviteRole(value)}>
                    <SelectTrigger>
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
              <DialogFooter>
                <Button
                  onClick={() => inviteMemberMutation.mutate({ email: inviteEmail, role: inviteRole })}
                  disabled={!inviteEmail || inviteMemberMutation.isPending}
                >
                  {inviteMemberMutation.isPending ? 'Sending...' : 'Send Invitation'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Team Overview */}
      {team && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{team.name}</span>
                  {getPlanBadge(team.plan)}
                </CardTitle>
                <CardDescription>{team.description}</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Team Settings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{team.memberCount}</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{team.projectCount}</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{workspaces?.length || 0}</div>
                <div className="text-sm text-gray-600">Workspaces</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest team activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {[
                      { user: 'Sarah Johnson', action: 'created a new project', target: 'E-commerce App', time: '2 hours ago' },
                      { user: 'Mike Chen', action: 'deployed to production', target: 'TaskManager v1.2', time: '4 hours ago' },
                      { user: 'Emma Davis', action: 'invited new member', target: 'john@company.com', time: '1 day ago' },
                      { user: 'Alex Rodriguez', action: 'updated workspace', target: 'Mobile Development', time: '2 days ago' },
                      { user: 'Lisa Wang', action: 'completed testing', target: 'Weather App', time: '3 days ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                            <span className="font-medium">{activity.target}</span>
                          </div>
                          <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Statistics</CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Projects This Month</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Successful Deployments</span>
                  <span className="font-bold text-green-600">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Build Time</span>
                  <span className="font-bold">8m 32s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Collaborations</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Team Productivity</span>
                  <span className="font-bold text-blue-600">↑ 23%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {membersLoading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              members?.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Avatar className="h-12 w-12">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(member.role)}
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {getRoleBadge(member.role)}
                        {getStatusBadge(member.status)}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <div>Joined: {formatDate(member.joinedAt)}</div>
                        <div>Last active: {formatRelativeTime(member.lastActive)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workspacesLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              workspaces?.map((workspace) => (
                <Card key={workspace.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>{workspace.name}</span>
                        {workspace.isDefault && (
                          <Badge variant="outline">Default</Badge>
                        )}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{workspace.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Projects</div>
                        <div className="text-2xl font-bold text-blue-600">{workspace.projectCount}</div>
                      </div>
                      <div>
                        <div className="font-medium">Members</div>
                        <div className="text-2xl font-bold text-green-600">{workspace.memberCount}</div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Created: {formatDate(workspace.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Manage sent invitations and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitationsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : invitations && invitations.length > 0 ? (
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium">{invitation.email}</div>
                          <div className="text-sm text-gray-500">
                            Invited as {invitation.role} by {invitation.invitedBy}
                          </div>
                          <div className="text-xs text-gray-400">
                            Sent: {formatDate(invitation.invitedAt)} • 
                            Expires: {formatDate(invitation.expiresAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(invitation.status)}
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending invitations</p>
                  <p className="text-sm">Invite team members to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}