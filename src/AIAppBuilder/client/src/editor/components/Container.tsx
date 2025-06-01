import React from "react";
import { useNode } from "@craftjs/core";
import { ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  flexDirection?: 'row' | 'column';
}

export function Container({ 
  children, 
  backgroundColor = "white",
  padding = "4",
  borderRadius = "md",
  flexDirection = "column"
}: ContainerProps) {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div 
      ref={ref => connect(drag(ref))} 
      className={`bg-${backgroundColor} p-${padding} rounded-${borderRadius} flex flex-${flexDirection} gap-2 min-h-[100px] border-2 border-dashed border-gray-300`}
    >
      {children}
    </div>
  );
}

Container.craft = {
  props: {
    backgroundColor: "white",
    padding: "4",
    borderRadius: "md",
    flexDirection: "column"
  },
  related: {
    settings: ContainerSettings
  }
};

function ContainerSettings() {
  const { actions: { setProp }, backgroundColor, padding, borderRadius, flexDirection } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    padding: node.data.props.padding,
    borderRadius: node.data.props.borderRadius,
    flexDirection: node.data.props.flexDirection,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <select
          value={backgroundColor}
          onChange={(e) => setProp((props: ContainerProps) => props.backgroundColor = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="white">White</option>
          <option value="gray-100">Light Gray</option>
          <option value="blue-50">Light Blue</option>
          <option value="green-50">Light Green</option>
          <option value="yellow-50">Light Yellow</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <select
          value={padding}
          onChange={(e) => setProp((props: ContainerProps) => props.padding = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="2">Small (8px)</option>
          <option value="4">Medium (16px)</option>
          <option value="6">Large (24px)</option>
          <option value="8">Extra Large (32px)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Border Radius</label>
        <select
          value={borderRadius}
          onChange={(e) => setProp((props: ContainerProps) => props.borderRadius = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Layout Direction</label>
        <select
          value={flexDirection}
          onChange={(e) => setProp((props: ContainerProps) => props.flexDirection = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="column">Vertical</option>
          <option value="row">Horizontal</option>
        </select>
      </div>
    </div>
  );
}