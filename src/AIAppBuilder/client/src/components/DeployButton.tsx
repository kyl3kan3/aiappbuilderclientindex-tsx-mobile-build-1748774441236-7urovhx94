import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Github, Smartphone } from 'lucide-react';

interface DeployButtonProps {
  projectName?: string;
  files?: Record<string, string>;
}

export function DeployButton({ projectName = 'ai-app-builder', files = {} }: DeployButtonProps) {
  const [loading, setLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const { toast } = useToast();

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/deploy/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          files
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setRepoUrl(data.repoUrl);
        toast({
          title: "Deployment Successful!",
          description: `Your project has been deployed to GitHub with Capacitor iOS support.`,
        });
      } else {
        throw new Error(data.error || 'Deployment failed');
      }
    } catch (error) {
      console.error('Deployment error:', error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : 'Failed to deploy to GitHub',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <button
        onClick={handleDeploy}
        disabled={loading}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        {loading ? 'Deploying...' : '🚀 Deploy to GitHub'}
      </button>
      {repoUrl && (
        <p className="mt-4 text-green-700">
          ✅ Repo created: <a className="underline" href={repoUrl} target="_blank">{repoUrl}</a>
        </p>
      )}
    </div>
  );
}