import React from "react";
import { useEditor } from "@craftjs/core";
import { Button } from "./components/Button";
import { Text } from "./components/Text";
import { Container } from "./components/Container";
import { Plus, Type, Square, MousePointer } from "lucide-react";

export function Sidebar() {
  const { connectors, selected } = useEditor((state) => {
    const currentNodeId = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
      };
    }

    return {
      selected,
    };
  });

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Components Panel */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Components</h3>
        <div className="space-y-2">
          <div
            ref={(ref) => connectors.create(ref, <span />)}
            className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <Type className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Text</span>
          </div>
          
          <div
            ref={(ref) => connectors.create(ref, <Button />)}
            className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <MousePointer className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Button</span>
          </div>
          
          <div
            ref={(ref) => connectors.create(ref, <Container />)}
            className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <Square className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Container</span>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="flex-1 p-4">
        {selected && (
          <>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Properties</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                {selected.name}
              </div>
              {selected.settings && React.createElement(selected.settings)}
            </div>
          </>
        )}
        
        {!selected && (
          <div className="text-center text-gray-500 mt-8">
            <Square className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select an element to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
}