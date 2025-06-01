import React from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";

interface LiveCodePreviewProps {
  code: string;
}

export function LiveCodePreview({ code }: LiveCodePreviewProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-100 px-4 py-2 text-sm text-gray-700 border-b">
        Live Preview
      </div>
      
      <LiveProvider code={code} language="jsx">
        <div className="p-6 bg-white min-h-[300px]">
          <LivePreview />
        </div>
        
        <div className="bg-red-50 border-t border-red-200">
          <LiveError className="text-red-600 text-sm p-4" />
        </div>
      </LiveProvider>
    </div>
  );
}