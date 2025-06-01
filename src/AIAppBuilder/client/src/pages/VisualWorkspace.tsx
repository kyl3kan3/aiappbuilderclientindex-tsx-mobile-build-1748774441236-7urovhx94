import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";

interface VisualWorkspaceProps {
  generated: Record<string, string>;
}

export function VisualWorkspace({ generated }: VisualWorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<string>(Object.keys(generated)[0] || "");
  const [code, setCode] = useState(generated[selectedFile] || "");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedFile && generated[selectedFile]) {
      setCode(generated[selectedFile]);
    }
  }, [selectedFile, generated]);

  const filteredFiles = Object.keys(generated).filter(filename =>
    filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadProject = async () => {
    try {
      const projectName = Object.keys(generated)[0]?.split('/')[0] || 'ConvertedApp';
      const response = await fetch(`/api/download-project/${encodeURIComponent(projectName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: generated }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}-mobile-ready.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const [isBuildingMobile, setIsBuildingMobile] = useState(false);

  const handleBuildMobile = async () => {
    if (isBuildingMobile) return; // Prevent multiple clicks
    
    setIsBuildingMobile(true);
    try {
      const projectName = Object.keys(generated)[0]?.split('/')[0] || 'ConvertedApp';
      const response = await fetch('/api/build-mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          projectName,
          files: generated,
          platform: 'react-native'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.repoUrl && data.actionsUrl) {
          const message = `🎉 Project Phoenix Build Started!

Your ${projectName} is being compiled for iOS & Android:
• GitHub Repository: ${data.repoUrl}
• Build Status: ${data.actionsUrl}
• Build ID: ${data.buildId}

The build will take 10-15 minutes. You can track progress in GitHub Actions.`;
          alert(message);
          
          // Open GitHub Actions in new tab
          window.open(data.actionsUrl, '_blank');
        } else {
          alert(`🎉 Mobile build started! Build ID: ${data.buildId}\n\nYour React Native project files are ready for mobile compilation. Check the Build Status dashboard to track progress.`);
        }
      } else {
        console.error('Build failed:', data);
        if (data.error?.includes('Resource not accessible')) {
          alert(`🔧 GitHub Token Needs Account Owner Permissions

The token works but needs additional setup:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Make sure you're the repository owner 
3. Or try creating a Fine-grained token instead of Classic

Your files are still converted and ready! Check Build Status for updates.`);
        } else if (data.needsSetup) {
          alert('🔧 GitHub credentials needed for mobile builds. Please add your GitHub token and owner to environment variables.');
        } else {
          alert(`❌ Build failed: ${data.error || 'Unknown error'}\n\nDetails: ${data.details || 'Check console for more info'}`);
        }
      }
    } catch (error) {
      console.error('Build error:', error);
      alert('❌ Build error. Please check your connection and try again.');
    } finally {
      setIsBuildingMobile(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🎉 Your AI Learning Companion - Mobile Ready!</h2>
        <p className="text-gray-600 mb-4">Successfully converted {Object.keys(generated).length} files to React Native format</p>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <Link 
            to="/build" 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            🤖 Enhance with AI
          </Link>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            🚀 Deploy App
          </button>
          <button 
            onClick={handleBuildMobile}
            disabled={isBuildingMobile}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isBuildingMobile 
                ? "bg-gray-400 text-white cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isBuildingMobile ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Building...
              </>
            ) : (
              <>📱 Build Mobile</>
            )}
          </button>
          <button 
            onClick={handleDownloadProject}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            💾 Download ZIP
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1">
        {/* File Browser */}
        <div className="w-1/3 bg-gray-50 rounded-lg p-4">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div className="h-96 overflow-y-auto space-y-1">
            {filteredFiles.map((filename) => (
              <button
                key={filename}
                onClick={() => setSelectedFile(filename)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedFile === filename 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-200"
                }`}
              >
                <div className="font-medium">
                  {filename.split('/').pop() || filename}
                </div>
                <div className="text-xs opacity-70">
                  {filename.includes('/') ? filename.substring(0, filename.lastIndexOf('/')) : 'root'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 bg-white rounded-lg border">
          <div className="bg-gray-100 px-4 py-2 border-b rounded-t-lg">
            <span className="font-medium">{selectedFile}</span>
          </div>
          <Editor
            height="500px"
            language={selectedFile.endsWith(".tsx") || selectedFile.endsWith(".ts") ? "typescript" : 
                     selectedFile.endsWith(".json") ? "json" : "javascript"}
            value={code}
            onChange={(val) => setCode(val || "")}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              readOnly: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}