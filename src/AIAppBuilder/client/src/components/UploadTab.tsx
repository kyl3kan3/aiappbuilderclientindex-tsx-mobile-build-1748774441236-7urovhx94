import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UploadTabProps {
  onUploadSuccess: (files: Record<string, string>) => void;
}

export default function UploadTab({ onUploadSuccess }: UploadTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("zipfile", file);

    setIsUploading(true);

    try {
      const response = await fetch("/api/convert/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.files) {
        onUploadSuccess(data.files);
        toast({ 
          title: "✅ Upload Success!", 
          description: "Your web app has been converted to mobile format" 
        });
      } else {
        throw new Error("No files received from conversion");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({ 
        title: "❌ Upload Failed", 
        description: "Please try again with a valid ZIP file", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50">
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <span className="text-3xl text-white">📁</span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Convert Web App to Mobile</h3>
        <p className="text-gray-600 mb-6">
          Upload a ZIP file of your web app and we'll automatically convert it to mobile format
        </p>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-violet-400 transition-colors">
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="zip-upload"
            />
            <label
              htmlFor="zip-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="text-4xl">📦</span>
              <span className="text-sm text-gray-600">
                {file ? file.name : "Click to select ZIP file"}
              </span>
            </label>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Converting...
              </div>
            ) : (
              "🔄 Convert to Mobile"
            )}
          </Button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Supported: React, HTML/CSS/JS web apps</p>
          <p>Output: React Native mobile code</p>
        </div>
      </div>
    </div>
  );
}