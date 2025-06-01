import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { contextMemory, type CodeChange } from "@/utils/contextMemory";

interface UndoPanelProps {
  onUndo: (filename: string, oldCode: string) => void;
}

export default function UndoPanel({ onUndo }: UndoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const history = contextMemory.getUndoHistory();

  if (history.length === 0) return null;

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="px-3 py-2 text-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        ⏪ History ({history.length})
      </Button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-80 max-h-64 overflow-y-auto z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 text-sm">Code History</h3>
          </div>
          
          <div className="p-2 space-y-1">
            {history.slice().reverse().map((change, index) => (
              <div
                key={`${change.timestamp}-${index}`}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                      {change.filename}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {change.reason}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(change.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                
                <Button
                  onClick={() => {
                    onUndo(change.filename, change.oldCode);
                    setIsOpen(false);
                  }}
                  size="sm"
                  variant="outline"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1"
                >
                  ↶ Undo
                </Button>
              </div>
            ))}
          </div>
          
          <div className="p-2 border-t border-gray-200">
            <Button
              onClick={() => {
                contextMemory.clearContext();
                setIsOpen(false);
              }}
              variant="outline"
              className="w-full text-xs text-red-600 hover:bg-red-50"
            >
              🗑️ Clear History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}