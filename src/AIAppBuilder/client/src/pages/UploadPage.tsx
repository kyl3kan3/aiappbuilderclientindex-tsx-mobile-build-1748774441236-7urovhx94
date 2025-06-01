import React from "react";
import { useState, useEffect } from "react";
import { VisualWorkspace } from "./VisualWorkspace";
import { setProject, getProject } from "../utils/projectState";
import Header from "../components/Header";

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [scaffoldedFiles, setScaffoldedFiles] = useState<Record<string, string> | null>(null);
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check for existing project on page load
  useEffect(() => {
    const existingProject = getProject();
    if (existingProject) {
      setScaffoldedFiles(existingProject.files);
      setStatus(`✅ Project "${existingProject.name}" restored from session with ${Object.keys(existingProject.files).length} files`);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("zipfile", file);
    
    setIsProcessing(true);
    setProcessingFiles([]);
    setStatus("Extracting and converting files...");

    // Simulate real-time file processing display
    const simulateProcessing = () => {
      const sampleFiles = [
        "📁 Extracting ZIP archive...",
        "📄 Reading package.json",
        "⚛️ Converting App.tsx",
        "🧩 Processing components/",
        "📱 Converting auth/login-form.tsx",
        "🎯 Processing learning-modules.tsx",
        "📊 Converting progress-dashboard.tsx",
        "🎨 Processing styles and assets",
        "🔧 Optimizing for mobile",
        "✅ Finalizing conversion..."
      ];

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < sampleFiles.length) {
          setProcessingFiles(prev => [...prev, sampleFiles[currentIndex]]);
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 400);

      return interval;
    };

    const processingInterval = simulateProcessing();

    try {
      const res = await fetch("/api/convert/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(processingInterval);

      if (!res.ok) {
        setStatus(`Upload failed: ${res.status} ${res.statusText}`);
        setIsProcessing(false);
        return;
      }
      
      // Get the actual response data from server
      const data = await res.json();
      
      console.log('Response data received, files:', Object.keys(data.scaffold || {}));
      
      if (data.scaffold && Object.keys(data.scaffold).length > 0) {
        setScaffoldedFiles(data.scaffold);
        setStatus(`✅ Successfully converted ${Object.keys(data.scaffold).length} files!`);
        setIsProcessing(false);
        
        // Save project state for use across the app
        const projectName = file?.name?.replace('.zip', '') || 'Converted Project';
        setProject({
          name: projectName,
          files: data.scaffold,
          isUploaded: true
        });
        
        console.log('Files set successfully');
      } else {
        setStatus("No files were converted.");
        setIsProcessing(false);
        console.log('No scaffold data received');
      }
    } catch (error) {
      clearInterval(processingInterval);
      setIsProcessing(false);
      const errorMessage = error instanceof Error ? error.message : "Upload failed. Please try again.";
      setStatus(`Upload failed: ${errorMessage}`);
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto mt-10 p-8 rounded-xl bg-white/60 shadow-lg backdrop-blur border border-gray-300">
        {!scaffoldedFiles ? (
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Convert Your Web App</h2>
            <p className="text-gray-500">Upload a ZIP file to convert your app into mobile format.</p>
            <input type="file" accept=".zip" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
              onClick={handleUpload}
              disabled={!file || isProcessing}
            >
              {isProcessing ? "Converting..." : "Upload & Convert"}
            </button>
            <p className="text-sm text-gray-600">{status}</p>

            {/* Real-time processing display */}
            {isProcessing && (
              <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">🔄 Processing Files</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {processingFiles.map((fileName, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 py-1 px-2 bg-gray-50 rounded animate-pulse"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {fileName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">✅ Conversion Complete!</h2>
            <p className="text-gray-600 mb-6">Your web app has been converted to mobile format. Files generated: {Object.keys(scaffoldedFiles).length}</p>
            <VisualWorkspace generated={scaffoldedFiles} />
          </div>
        )}
      </div>
    </div>
  );
}