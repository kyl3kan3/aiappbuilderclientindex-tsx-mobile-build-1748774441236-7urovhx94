import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DiffViewerProps {
  oldCode: string;
  newCode: string;
  onAccept: () => void;
  onReject: () => void;
}

export default function DiffViewer({ oldCode, newCode, onAccept, onReject }: DiffViewerProps) {
  const [showDiff, setShowDiff] = useState(true);

  // Simple diff algorithm for highlighting changes
  const getDiff = (old: string, updated: string) => {
    const oldLines = old.split('\n');
    const newLines = updated.split('\n');
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    const diff = [];
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';
      
      if (oldLine === newLine) {
        diff.push({ type: 'unchanged', content: newLine, lineNumber: i + 1 });
      } else if (!oldLine) {
        diff.push({ type: 'added', content: newLine, lineNumber: i + 1 });
      } else if (!newLine) {
        diff.push({ type: 'removed', content: oldLine, lineNumber: i + 1 });
      } else {
        diff.push({ type: 'changed', oldContent: oldLine, newContent: newLine, lineNumber: i + 1 });
      }
    }
    
    return diff;
  };

  const diffLines = getDiff(oldCode, newCode);
  const hasChanges = diffLines.some(line => line.type !== 'unchanged');

  if (!hasChanges) return null;

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <h3 className="font-semibold text-gray-800">AI Code Changes</h3>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onReject}
            variant="outline"
            className="px-3 py-1 text-sm"
          >
            ❌ Reject
          </Button>
          <Button
            onClick={onAccept}
            className="px-3 py-1 text-sm bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            ✅ Accept
          </Button>
        </div>
      </div>

      {showDiff && (
        <div className="bg-slate-900 rounded-lg p-3 text-sm font-mono overflow-x-auto max-h-64 overflow-y-auto">
          {diffLines.map((line, index) => (
            <div key={index} className="flex">
              <span className="text-gray-500 w-8 text-right mr-3 flex-shrink-0">
                {line.lineNumber}
              </span>
              <div className="flex-1">
                {line.type === 'unchanged' && (
                  <span className="text-gray-300">{line.content}</span>
                )}
                {line.type === 'added' && (
                  <span className="bg-green-800/50 text-green-200 block px-1">
                    + {line.content}
                  </span>
                )}
                {line.type === 'removed' && (
                  <span className="bg-red-800/50 text-red-200 block px-1 line-through">
                    - {line.content}
                  </span>
                )}
                {line.type === 'changed' && (
                  <div>
                    <span className="bg-red-800/50 text-red-200 block px-1 line-through">
                      - {line.oldContent}
                    </span>
                    <span className="bg-green-800/50 text-green-200 block px-1">
                      + {line.newContent}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}