import React from "react";
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Download, 
  Twitter, 
  Github, 
  Copy, 
  Loader2,
  CheckCircle,
  ExternalLink 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeSnippetShareProps {
  code: string;
  language?: string;
  title?: string;
  platform?: string;
}

export function CodeSnippetShare({ code, language = 'swift', title, platform }: CodeSnippetShareProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [gistUrl, setGistUrl] = useState<string>('');
  const [isCreatingGist, setIsCreatingGist] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const exportAsImage = async () => {
    if (!codeRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(codeRef.current, {
        backgroundColor: '#09090b',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: codeRef.current.scrollWidth,
        height: codeRef.current.scrollHeight,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${title || 'code-snippet'}.png`;
      link.click();
      
      toast({
        title: "Image Downloaded!",
        description: "Code snippet exported as PNG successfully.",
      });
    } catch (error) {
      console.error('Error exporting image:', error);
      toast({
        title: "Export Failed",
        description: "Could not export code as image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const createGist = async () => {
    setIsCreatingGist(true);
    try {
      const response = await fetch('/api/create-gist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          title: title || 'AI Generated Code',
          platform,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Gist');
      }

      const { url } = await response.json();
      setGistUrl(url);
      
      toast({
        title: "Gist Created!",
        description: "Code snippet uploaded to GitHub successfully.",
      });
    } catch (error) {
      console.error('Error creating Gist:', error);
      toast({
        title: "Gist Creation Failed", 
        description: "Could not create GitHub Gist. Please check your GitHub token.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingGist(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const shareOnTwitter = () => {
    const snippetPreview = code.split('\n').slice(0, 5).join('\n');
    const truncated = snippetPreview.length > 200 ? snippetPreview.slice(0, 200) + '...' : snippetPreview;
    const tweetText = encodeURIComponent(
      `🚀 Just generated this ${platform || language} code with AI App Builder!\n\n${truncated}\n\n${gistUrl ? `\n🔗 ${gistUrl}` : ''}\n\n#AIAppBuilder #CodeGeneration #${platform || language}`
    );
    const tweetURL = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetURL, '_blank');
  };

  const getLanguageDisplayName = (lang: string) => {
    const langMap: Record<string, string> = {
      'swift': 'Swift',
      'kotlin': 'Kotlin', 
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'dart': 'Dart',
      'java': 'Java',
    };
    return langMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  return (
    <div className="space-y-4">
      {/* Code Display */}
      <Card className="overflow-hidden">
        <div className="bg-zinc-900 text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-zinc-700 text-zinc-100">
                {getLanguageDisplayName(language)}
              </Badge>
              {platform && (
                <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                  {platform}
                </Badge>
              )}
            </div>
            {title && (
              <span className="text-sm text-zinc-400">{title}</span>
            )}
          </div>
          
          <div ref={codeRef} className="bg-zinc-950 rounded-lg p-4 overflow-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Share Actions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Share & Export
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportAsImage}
              disabled={isExporting}
              className="flex items-center space-x-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>PNG</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={createGist}
              disabled={isCreatingGist}
              className="flex items-center space-x-2"
            >
              {isCreatingGist ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : gistUrl ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Github className="h-4 w-4" />
              )}
              <span>Gist</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={shareOnTwitter}
              className="flex items-center space-x-2"
            >
              <Twitter className="h-4 w-4" />
              <span>Tweet</span>
            </Button>
          </div>

          {gistUrl && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">
                  Gist created successfully!
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(gistUrl, '_blank')}
                  className="text-green-700 hover:text-green-800"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}