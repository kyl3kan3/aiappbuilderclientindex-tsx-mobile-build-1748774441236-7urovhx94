import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import LivePreview from "@/components/LivePreview";
import Editor from "@monaco-editor/react";
import DiffViewer from "@/components/DiffViewer";
import UndoPanel from "@/components/UndoPanel";
import UploadTab from "@/components/UploadTab";
import { contextMemory } from "@/utils/contextMemory";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

function PromptBar({ onPrompt }: { onPrompt: (input: string) => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onPrompt(input.trim());
      setInput("");
    }
  };

  return (
    <div className="border-t border-white/20 bg-white/5 backdrop-blur-xl mb-20" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your app or ask for changes..."
            className="flex-1 bg-white/90 border-white/30 text-gray-800 placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[44px] text-base"
            style={{ fontSize: '16px' }}
          />
          <Button 
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex-shrink-0 min-h-[44px]"
          >
            ✨ Build
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function BuildWizardNew() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "👋 Welcome to AI Builder Pro! Describe any app you want to create and I'll build it for you instantly. Try something like:\n\n• 'Create a habit tracker app'\n• 'Build a weather dashboard'\n• 'Make a recipe organizer'" }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState("");
  const [code, setCode] = useState("");
  const [appMetadata, setAppMetadata] = useState({ name: "My App", description: "" });
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'chat' | 'upload' | 'deploy'>('chat');
  const [pendingChanges, setPendingChanges] = useState<{filename: string, oldCode: string, newCode: string} | null>(null);
  const { toast } = useToast();

  const sendPrompt = async (input: string) => {
    setIsGenerating(true);
    const updated = [...messages, { role: "user" as const, content: input }];
    setMessages(updated);

    // Load existing context and add it to the prompt
    const existingContext = contextMemory.loadContext();
    const contextInfo = contextMemory.getContextForAI();

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated,
          existingFiles: generatedCode,
          context: contextInfo // Enhanced context memory
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate: ${response.status}`);
      }

      const data = await response.json();
      
      // Initialize or update app context
      if (data.appName && !existingContext) {
        contextMemory.initializeApp(data.appName, data.response);
        setAppMetadata({ name: data.appName, description: data.response });
      }

      if (data.files && typeof data.files === 'object') {
        // Check for changes and show diff viewer
        let hasSignificantChanges = false;
        
        Object.entries(data.files).forEach(([filename, newCode]) => {
          const oldCode = generatedCode[filename] || '';
          if (oldCode && oldCode !== newCode && oldCode.length > 10) {
            // Show diff for significant changes to existing files
            setPendingChanges({
              filename,
              oldCode,
              newCode: newCode as string
            });
            hasSignificantChanges = true;
          }
        });

        // Apply changes immediately if it's new files or no significant changes
        if (!hasSignificantChanges) {
          setGeneratedCode(prev => ({ ...prev, ...data.files }));
          
          const firstFile = Object.keys(data.files)[0];
          if (firstFile) {
            setSelectedFile(firstFile);
            setCode(data.files[firstFile]);
            setActiveTab('code');
          }
        }
      }

      setMessages([...updated, { role: "assistant", content: data.response }]);
      toast({ title: "✨ App Generated!", description: "Your code is ready in the editor" });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: "❌ Generation Failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle accepting diff changes
  const handleAcceptChanges = () => {
    if (!pendingChanges) return;
    
    const { filename, oldCode, newCode } = pendingChanges;
    
    // Record the change in context memory
    contextMemory.recordCodeChange(filename, oldCode, newCode, "AI modification");
    
    // Apply the changes
    setGeneratedCode(prev => ({ ...prev, [filename]: newCode }));
    if (selectedFile === filename) {
      setCode(newCode);
    }
    
    setPendingChanges(null);
    toast({ title: "✅ Changes Applied", description: "Code updated successfully" });
  };

  // Handle rejecting diff changes
  const handleRejectChanges = () => {
    setPendingChanges(null);
    toast({ title: "❌ Changes Rejected", description: "Keeping original code" });
  };

  // Handle undo from history
  const handleUndo = (filename: string, oldCode: string) => {
    setGeneratedCode(prev => ({ ...prev, [filename]: oldCode }));
    if (selectedFile === filename) {
      setCode(oldCode);
    }
    toast({ title: "↶ Undone", description: `Reverted ${filename}` });
  };

  useEffect(() => {
    if (Object.keys(generatedCode).length > 0 && !selectedFile) {
      const firstFile = Object.keys(generatedCode)[0];
      setSelectedFile(firstFile);
      setCode(generatedCode[firstFile]);
    }
  }, [generatedCode, selectedFile]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 animate-pulse"></div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 animate-pulse"></div>
        <div className="relative z-10 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg">🚀</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Builder Pro</h1>
              <p className="text-white/80 text-xs">Build apps with conversation</p>
            </div>
          </div>
          
          {/* Undo Panel */}
          <UndoPanel onUndo={handleUndo} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative pt-[60px] pb-[80px]">
        {/* Code Tab */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col">
            {Object.keys(generatedCode).length > 0 ? (
              <>
                {/* File Tabs */}
                <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-3">
                  <div className="flex gap-2 overflow-x-auto">
                    {Object.keys(generatedCode).map((filename) => (
                      <button
                        key={filename}
                        onClick={() => {
                          setSelectedFile(filename);
                          setCode(generatedCode[filename]);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                          selectedFile === filename
                            ? "bg-white/30 text-white shadow-lg"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        <span>
                          {filename.endsWith('.tsx') ? '⚛️' : 
                           filename.endsWith('.swift') ? '🍎' : 
                           filename.endsWith('.kt') ? '☕' : '📄'}
                        </span>
                        {filename}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 bg-slate-900">
                  <Editor
                    height="100%"
                    language={selectedFile?.endsWith('.tsx') ? 'typescript' : selectedFile?.endsWith('.swift') ? 'swift' : 'kotlin'}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      automaticLayout: true,
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <span className="text-3xl text-white">💻</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">No Code Generated Yet</h3>
                  <p className="text-gray-600 mb-6">Use the chat to create your first app</p>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    💬 Start Building
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="flex-1">
            {Object.keys(generatedCode).length > 0 && selectedFile?.endsWith('.tsx') ? (
              <div className="bg-white h-full">
                <LivePreview 
                  code={code} 
                  filename={selectedFile} 
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 h-full">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <span className="text-3xl text-white">👁️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">No Preview Available</h3>
                  <p className="text-gray-600 mb-6">
                    {Object.keys(generatedCode).length === 0 
                      ? "Generate a React app first to see the preview" 
                      : "Select a React (.tsx) file to see the live preview"}
                  </p>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    💬 Create App
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col bg-white/95 backdrop-blur-xl">
            {/* Diff Viewer for Pending Changes */}
            {pendingChanges && (
              <div className="p-4 border-b border-gray-200">
                <DiffViewer
                  oldCode={pendingChanges.oldCode}
                  newCode={pendingChanges.newCode}
                  onAccept={handleAcceptChanges}
                  onReject={handleRejectChanges}
                />
              </div>
            )}
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, i) => (
                <div key={i} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white ml-auto' 
                      : message.role === 'system'
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-200'
                      : 'bg-white text-gray-800 shadow-lg border border-gray-100'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">👤</span>
                    </div>
                  )}
                </div>
              ))}
              {isGenerating && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-white text-gray-800 shadow-lg border border-gray-100 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-sm text-gray-600 ml-2">Generating your app...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <PromptBar onPrompt={sendPrompt} />
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && <UploadTab onUploadSuccess={(files: Record<string, string>) => {
          setGeneratedCode(files);
          const firstFile = Object.keys(files)[0];
          if (firstFile) {
            setSelectedFile(firstFile);
            setCode(files[firstFile]);
            setActiveTab('code');
          }
        }} />}

        {/* Deploy Tab */}
        {activeTab === 'deploy' && (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-3xl text-white">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Deploy Your App</h3>
              <p className="text-gray-600 mb-6">Push to GitHub and deploy to TestFlight/Firebase</p>
              <button
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                🚀 Deploy Now
              </button>
            </div>
          </div>
        )}

        {/* Welcome Screen */}
        {Object.keys(generatedCode).length === 0 && activeTab !== 'chat' && (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-3xl text-white">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Build Amazing Apps!</h3>
              <p className="text-gray-600 mb-6">Use the chat to start building with AI</p>
              <button
                onClick={() => setActiveTab('chat')}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                💬 Start Chatting
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Tabs - Replit Style */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'code'
                  ? "bg-white/30 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              <span>💻</span>
              <span className="hidden sm:inline">Code</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'preview'
                  ? "bg-white/30 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              <span>👁️</span>
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'chat'
                  ? "bg-white/30 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              <span>💬</span>
              <span className="hidden sm:inline">Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? "bg-white/30 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              <span>📁</span>
              <span className="hidden sm:inline">Upload</span>
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'deploy'
                  ? "bg-white/30 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              <span>🚀</span>
              <span className="hidden sm:inline">Deploy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}