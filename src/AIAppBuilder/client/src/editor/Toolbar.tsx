import React from "react";
import { useEditor } from "@craftjs/core";
import { Undo, Redo, Eye, Code, Download, Smartphone } from "lucide-react";

export function Toolbar() {
  const { actions, canUndo, canRedo, query } = useEditor((state) => ({
    canUndo: state.options.enabled && state.events.history.canUndo,
    canRedo: state.options.enabled && state.events.history.canRedo,
  }));

  const exportDesign = () => {
    const json = query.serialize();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design.json';
    link.click();
  };

  const generateCode = () => {
    // This will be connected to your AI generation system
    const designData = query.serialize();
    console.log('Design data for code generation:', designData);
    // TODO: Send to your AI backend for code generation
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Visual Designer</h2>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => canUndo && actions.history.undo()}
              disabled={!canUndo}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => canRedo && actions.history.redo()}
              disabled={!canRedo}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportDesign}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button
            onClick={generateCode}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Code className="w-4 h-4" />
            Generate Code
          </button>
        </div>
      </div>
    </div>
  );
}