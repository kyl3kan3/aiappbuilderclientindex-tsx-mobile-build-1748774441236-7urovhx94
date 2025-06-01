import React from "react";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import LivePreview from "../components/LivePreview";
import { getProject, hasProject } from "../utils/projectState";
import Header from "../components/Header";

export function BuildWizard() {
  const [messages, setMessages] = useState([{ role: "system", content: "Describe your app idea to begin." }]);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "code" | "preview" | "deploy">("chat");
  const [isTyping, setIsTyping] = useState(false);

  // Check for uploaded project on component mount
  useEffect(() => {
    const uploadedProject = getProject();
    if (uploadedProject) {
      setGeneratedCode(uploadedProject.files);
      setMessages([
        { 
          role: "system", 
          content: `Welcome back! I see you've uploaded "${uploadedProject.name}" with ${Object.keys(uploadedProject.files).length} files. I can help you enhance your AI Learning Companion app - what would you like to improve or add?`
        }
      ]);
      
      // Set the first file as selected if available
      const firstFile = Object.keys(uploadedProject.files)[0];
      if (firstFile) {
        setSelectedFile(firstFile);
        setCode(uploadedProject.files[firstFile]);
      }
    }
  }, []);

  const sendPrompt = async (input: string) => {
    const updated = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      const data = await res.json();
      if (data.files) {
        setGeneratedCode(prev => ({ ...prev, ...data.files }));
        const firstFile = Object.keys(data.files)[0];
        setSelectedFile(firstFile);
        setCode(data.files[firstFile]);
      }

      setMessages([...updated, { role: "assistant", content: data.response }]);
    } catch (error) {
      setMessages([...updated, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (selectedFile) setCode(generatedCode[selectedFile]);
  }, [selectedFile]);

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto mt-10 p-8 rounded-xl bg-white/60 shadow-lg backdrop-blur border border-gray-300">
        <h2 className="text-2xl font-bold mb-6">Build with AI</h2>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "chat" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "code" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={Object.keys(generatedCode).length === 0}
          >
            📝 Code
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "preview" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={Object.keys(generatedCode).length === 0}
          >
            👁️ Preview
          </button>
          <button
            onClick={() => setActiveTab("deploy")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "deploy" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={Object.keys(generatedCode).length === 0}
          >
            🚀 Deploy
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="flex-1 bg-zinc-900 text-white p-6 rounded-lg flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto mb-6">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div className={`inline-block max-w-3xl p-4 rounded-lg ${
                    m.role === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-zinc-800 text-gray-100"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {/* AI Thinking Indicator */}
              {isTyping && (
                <div className="text-left">
                  <div className="inline-block max-w-3xl p-4 rounded-lg bg-zinc-800 text-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-300">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <input
                className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none"
                placeholder="Describe your app idea or ask for changes..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendPrompt(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    sendPrompt(input.value);
                    input.value = "";
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Code Tab */}
        {activeTab === "code" && Object.keys(generatedCode).length > 0 && (
          <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="flex bg-gray-100 border-b p-3 gap-2 rounded-t-lg">
              {Object.keys(generatedCode).map((f) => (
                <button 
                  key={f} 
                  onClick={() => setSelectedFile(f)} 
                  className={`px-4 py-2 rounded ${selectedFile === f ? "bg-white shadow-sm border" : "bg-transparent hover:bg-gray-50"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {selectedFile && (
              <div className="flex-1 p-4">
                <Editor
                  height="100%"
                  language={selectedFile.endsWith(".tsx") ? "typescript" : "javascript"}
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === "preview" && selectedFile && (
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
            <LivePreview code={code} filename={selectedFile} />
          </div>
        )}

        {/* Deploy Tab */}
        {activeTab === "deploy" && Object.keys(generatedCode).length > 0 && (
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-4">Deploy Your App</h3>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span>📦</span>
                  GitHub Repository
                </h4>
                <p className="text-gray-600 mb-4">Deploy your app to GitHub and make it accessible online.</p>
                
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/github/push', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            files: generatedCode,
                            repoName: `ai-generated-app-${Date.now()}`
                          }),
                        });
                        const data = await response.json();
                        if (data.repoUrl) {
                          window.open(data.repoUrl, '_blank');
                        }
                      } catch (error) {
                        console.error('Deploy error:', error);
                      }
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    🚀 Deploy to GitHub
                  </button>
                  
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/create-gist', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ files: generatedCode }),
                        });
                        const data = await response.json();
                        if (data.gistUrl) {
                          window.open(data.gistUrl, '_blank');
                        }
                      } catch (error) {
                        console.error('Gist error:', error);
                      }
                    }}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    📝 Create Gist
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span>📱</span>
                  Mobile App Build
                </h4>
                <p className="text-gray-600 mb-4">Convert your web app to native mobile format and build APK/IPA files.</p>
                
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/generate-production-app', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          appName: 'AI Generated App',
                          appDescription: 'Built with AI App Builder',
                          appType: 'mobile',
                          features: ['responsive', 'modern'],
                          platforms: ['ios', 'android'],
                          designTemplate: 'modern'
                        }),
                      });
                      const data = await response.json();
                      console.log('Mobile build initiated:', data);
                    } catch (error) {
                      console.error('Mobile build error:', error);
                    }
                  }}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📱 Build Mobile App
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span>⬇️</span>
                  Download Project
                </h4>
                <p className="text-gray-600 mb-4">Download your complete project as a ZIP file.</p>
                
                <button
                  onClick={() => {
                    const appName = 'ai-generated-app';
                    window.location.href = `/api/download-project/${appName}`;
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  💾 Download ZIP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}