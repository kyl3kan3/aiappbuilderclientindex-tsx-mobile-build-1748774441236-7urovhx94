import React from "react";
import Editor from "@monaco-editor/react";

interface LiveCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  theme?: string;
}

export function LiveCodeEditor({ 
  code, 
  onChange, 
  language = "javascript",
  theme = "vs-dark" 
}: LiveCodeEditorProps) {
  return (
    <div className="h-[400px] border rounded-lg overflow-hidden bg-gray-900">
      <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
        Live Code Editor
      </div>
      <Editor
        height="calc(100% - 40px)"
        defaultLanguage={language}
        defaultValue={code}
        theme={theme}
        onChange={(value) => onChange(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on"
        }}
      />
    </div>
  );
}