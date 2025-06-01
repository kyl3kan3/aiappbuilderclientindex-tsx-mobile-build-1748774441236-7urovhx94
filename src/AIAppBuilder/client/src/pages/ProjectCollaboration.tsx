import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Share2, 
  Edit3, 
  MessageCircle, 
  Clock, 
  Eye,
  Copy,
  Link,
  Download,
  Settings,
  UserPlus,
  Lock,
  Unlock,
  Globe,
  Zap,
  FileText,
  Code2,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  platform: 'ios' | 'android' | 'react-native' | 'flutter';
  visibility: 'private' | 'team' | 'public';
  status: 'draft' | 'development' | 'testing' | 'published';
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName: string;
  collaborators: Collaborator[];
  liveUsers: LiveUser[];
  comments: Comment[];
  versions: Version[];
}

interface Collaborator {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
    canExport: boolean;
  };
  joinedAt: string;
  lastActive: string;
}

interface LiveUser {
  id: string;
  name: string;
  avatar?: string;
  cursor: {
    x: number;
    y: number;
    section: string;
  };
  isTyping: boolean;
  lastSeen: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  section: string;
  position?: {
    x: number;
    y: number;
  };
  resolved: boolean;
  createdAt: string;
  replies: CommentReply[];
}

interface CommentReply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface Version {
  id: string;
  version: string;
  description: string;
  createdBy: string;
  createdAt: string;
  changes: string[];
}

export default function ProjectCollaboration() {
  const [activeTab, setActiveTab] = useState('overview');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorRole, setNewCollaboratorRole] = useState<'editor' | 'viewer'>('viewer');
  const [commentText, setCommentText] = useState('');
  const [selectedSection, setSelectedSection] = useState('general');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get project ID from URL params (in real app)
  const projectId = 'project-demo';

  // Fetch project data
  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}/collaboration`],
    refetchInterval: 5000, // Real-time updates every 5 seconds
  });

  // Share project mutation
  const shareProjectMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to share project');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Shared",
        description: "Collaboration invitation sent successfully.",
      });
      setNewCollaboratorEmail('');
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Share Project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ content, section }: { content: string; section: string }) => {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, section }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Settings className="h-4 w-4 text-yellow-500" />;
      case 'editor': return <Edit3 className="h-4 w-4 text-blue-500" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      'owner': 'default',
      'editor': 'secondary',
      'viewer': 'outline'
    } as const;

    const colors = {
      'owner': 'bg-yellow-500 text-white',
      'editor': 'bg-blue-500 text-white',
      'viewer': 'bg-gray-500 text-white'
    };

    return (
      <Badge variant={variants[role as keyof typeof variants]} className={colors[role as keyof typeof colors]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private': return <Lock className="h-4 w-4 text-red-500" />;
      case 'team': return <Users className="h-4 w-4 text-blue-500" />;
      case 'public': return <Globe className="h-4 w-4 text-green-500" />;
      default: return <Lock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'draft': 'bg-gray-500',
      'development': 'bg-blue-500',
      'testing': 'bg-yellow-500',
      'published': 'bg-green-500'
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return '🍎';
      case 'android': return '🤖';
      case 'react-native': return '⚛️';
      case 'flutter': return '🐦';
      default: return '📱';
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

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/projects/${projectId}/view`;
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link Copied",
      description: "Project share link copied to clipboard.",
    });
  };

  if (projectLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Project not found or you don't have access to view it.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{getPlatformIcon(project.platform)}</span>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {getStatusBadge(project.status)}
          </div>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={copyShareLink}>
            <Link className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button 
            onClick={() => setShareDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Project
          </Button>
        </div>
      </div>

      {/* Project Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getVisibilityIcon(project.visibility)}
              <CardTitle className="text-lg">Project Status</CardTitle>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Last updated: {formatRelativeTime(project.updatedAt)}
              </div>
              <div className="flex -space-x-2">
                {project.liveUsers.map((user) => (
                  <Avatar key={user.id} className="h-8 w-8 border-2 border-white">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-green-500 text-white text-xs">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{project.collaborators.length}</div>
              <div className="text-sm text-gray-600">Collaborators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{project.liveUsers.length}</div>
              <div className="text-sm text-gray-600">Live Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{project.comments.length}</div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{project.versions.length}</div>
              <div className="text-sm text-gray-600">Versions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Collaboration</CardTitle>
                <CardDescription>Real-time editing and cursor tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.liveUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : (
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            Editing: {user.cursor.section}
                            {user.isTyping && <span className="ml-2 text-blue-500">typing...</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-500">
                          {formatRelativeTime(user.lastSeen)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {project.liveUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No users currently editing</p>
                      <p className="text-sm">Share the project to collaborate in real-time</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest changes and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {[
                      { user: 'Sarah Johnson', action: 'updated UI components', time: '5 minutes ago', type: 'edit' },
                      { user: 'Mike Chen', action: 'added comment on login flow', time: '12 minutes ago', type: 'comment' },
                      { user: 'Emma Davis', action: 'shared project with team', time: '1 hour ago', type: 'share' },
                      { user: 'Alex Rodriguez', action: 'created new version v1.2', time: '2 hours ago', type: 'version' },
                      { user: 'Lisa Wang', action: 'exported project for testing', time: '3 hours ago', type: 'export' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {activity.type === 'edit' && <Edit3 className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'comment' && <MessageCircle className="h-4 w-4 text-green-600" />}
                          {activity.type === 'share' && <Share2 className="h-4 w-4 text-purple-600" />}
                          {activity.type === 'version' && <FileText className="h-4 w-4 text-orange-600" />}
                          {activity.type === 'export' && <Download className="h-4 w-4 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </div>
                          <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collaborators" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Collaborators</h3>
            <Button onClick={() => setShareDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Collaborator
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.collaborators.map((collaborator) => (
              <Card key={collaborator.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Avatar className="h-12 w-12">
                      {collaborator.avatar ? (
                        <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                      ) : (
                        <AvatarFallback>{collaborator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(collaborator.role)}
                      {getRoleBadge(collaborator.role)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium">{collaborator.name}</div>
                      <div className="text-sm text-gray-500">{collaborator.email}</div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <div>Joined: {new Date(collaborator.joinedAt).toLocaleDateString()}</div>
                      <div>Last active: {formatRelativeTime(collaborator.lastActive)}</div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2">
                      {collaborator.permissions.canEdit && (
                        <Badge variant="outline" className="text-xs">Edit</Badge>
                      )}
                      {collaborator.permissions.canComment && (
                        <Badge variant="outline" className="text-xs">Comment</Badge>
                      )}
                      {collaborator.permissions.canShare && (
                        <Badge variant="outline" className="text-xs">Share</Badge>
                      )}
                      {collaborator.permissions.canExport && (
                        <Badge variant="outline" className="text-xs">Export</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Comments</h3>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="ui">UI Design</SelectItem>
                <SelectItem value="logic">App Logic</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Comment Form */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Commenting on: {selectedSection}
                  </div>
                  <Button
                    onClick={() => addCommentMutation.mutate({ content: commentText, section: selectedSection })}
                    disabled={!commentText.trim() || addCommentMutation.isPending}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {project.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      {comment.userAvatar ? (
                        <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                      ) : (
                        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">{comment.userName}</span>
                        <Badge variant="outline" className="text-xs">{comment.section}</Badge>
                        <span className="text-sm text-gray-500">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                        {comment.resolved && (
                          <Badge variant="default" className="text-xs bg-green-500">Resolved</Badge>
                        )}
                      </div>
                      <p className="text-sm mb-3">{comment.content}</p>
                      
                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="space-y-2 ml-4 border-l-2 border-gray-200 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{reply.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">{reply.userName}</span>
                                  <span className="text-xs text-gray-500">
                                    {formatRelativeTime(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {project.comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No comments yet</p>
                <p className="text-sm">Start a discussion by adding the first comment</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Versions</h3>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create Version
            </Button>
          </div>

          <div className="space-y-4">
            {project.versions.map((version) => (
              <Card key={version.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-blue-500 text-white">v{version.version}</Badge>
                        <span className="font-medium">{version.description}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Created by {version.createdBy} • {formatRelativeTime(version.createdAt)}
                      </div>
                      <div className="mt-2">
                        <div className="text-sm font-medium mb-1">Changes:</div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {version.changes.map((change, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Configure sharing and collaboration preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Project Visibility</Label>
                  <Select value={project.visibility}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>Private - Only invited collaborators</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="team">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Team - All team members can view</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="public">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>Public - Anyone with link can view</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Allow Comments</Label>
                    <div className="text-sm text-gray-500">Enable commenting on project elements</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Real-time Collaboration</Label>
                    <div className="text-sm text-gray-500">Show live cursors and typing indicators</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto-save Changes</Label>
                    <div className="text-sm text-gray-500">Automatically save edits every 30 seconds</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Version History</Label>
                    <div className="text-sm text-gray-500">Keep track of all project changes</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      {shareDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Share Project</CardTitle>
              <CardDescription>
                Invite collaborators to work on this project together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="collaboratorEmail">Email Address</Label>
                <Input
                  id="collaboratorEmail"
                  type="email"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  placeholder="colleague@company.com"
                />
              </div>
              <div>
                <Label htmlFor="collaboratorRole">Role</Label>
                <Select value={newCollaboratorRole} onValueChange={(value: 'editor' | 'viewer') => setNewCollaboratorRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Can view and comment</SelectItem>
                    <SelectItem value="editor">Editor - Can edit and modify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    shareProjectMutation.mutate({ 
                      email: newCollaboratorEmail, 
                      role: newCollaboratorRole 
                    });
                    setShareDialogOpen(false);
                  }}
                  disabled={!newCollaboratorEmail || shareProjectMutation.isPending}
                >
                  {shareProjectMutation.isPending ? 'Sharing...' : 'Send Invitation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}