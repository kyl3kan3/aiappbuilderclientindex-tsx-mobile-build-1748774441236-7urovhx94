import React from "react";
import { useState } from "react";
import Editor from "@monaco-editor/react";

function PromptBar({ onPrompt }: { onPrompt: (input: string) => void }) {
  const [prompt, setPrompt] = useState("");
  return (
    <div className="p-4 border-t flex gap-2">
      <input
        className="flex-1 border px-3 py-2 rounded"
        value={prompt}
        placeholder="Ask AI to modify your app..."
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onPrompt(prompt)}
      />
      <button
        onClick={() => onPrompt(prompt)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}

export function VisualWorkspace({ generated }: { generated: Record<string, string> }) {
  const [selectedFile, setSelectedFile] = useState(Object.keys(generated)[0]);
  const [code, setCode] = useState(generated[selectedFile]);

  const handlePrompt = async (promptText: string) => {
    const res = await fetch("/api/ai/edit-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, prompt: promptText }),
    });
    const { newCode } = await res.json();
    setCode(newCode);
    generated[selectedFile] = newCode; // update source
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <div className="w-64 bg-gray-100 border-r p-4">
          <h2 className="font-bold mb-4">Files</h2>
          {Object.keys(generated).map((filename) => (
            <div
              key={filename}
              onClick={() => {
                setSelectedFile(filename);
                setCode(generated[filename]);
              }}
              className={`cursor-pointer px-2 py-1 rounded hover:bg-blue-100 ${
                selectedFile === filename ? "bg-blue-200" : ""
              }`}
            >
              {filename}
            </div>
          ))}
        </div>

        <div className="flex-1 p-4">
          <Editor
            height="100%"
            defaultLanguage={selectedFile.endsWith(".swift") ? "swift" : "typescript"}
            value={code}
            onChange={(val) => setCode(val || "")}
          />
        </div>

        <div className="w-1/3 p-4 border-l bg-white">
          <h3 className="text-lg font-bold mb-2">Preview (stub)</h3>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{code}</pre>
        </div>
      </div>

      <PromptBar onPrompt={handlePrompt} />
    </div>
  );
}