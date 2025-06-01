import React from "react";
import { useNode } from "@craftjs/core";

interface TextProps {
  content?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
}

export function Text({ 
  content = "Hello World", 
  fontSize = "base",
  color = "gray-800",
  fontWeight = "normal"
}: TextProps) {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <p 
      ref={ref => connect(drag(ref))} 
      className={`text-${fontSize} text-${color} font-${fontWeight} cursor-pointer`}
    >
      {content}
    </p>
  );
}

Text.craft = {
  props: { 
    content: "Hello World",
    fontSize: "base",
    color: "gray-800",
    fontWeight: "normal"
  },
  related: {
    settings: TextSettings
  }
};

function TextSettings() {
  const { actions: { setProp }, content, fontSize, color, fontWeight } = useNode((node) => ({
    content: node.data.props.content,
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
    fontWeight: node.data.props.fontWeight,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Text Content</label>
        <textarea
          value={content}
          onChange={(e) => setProp((props: TextProps) => props.content = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <select
          value={fontSize}
          onChange={(e) => setProp((props: TextProps) => props.fontSize = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="xs">Extra Small</option>
          <option value="sm">Small</option>
          <option value="base">Base</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
          <option value="2xl">2X Large</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <select
          value={color}
          onChange={(e) => setProp((props: TextProps) => props.color = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="gray-800">Dark Gray</option>
          <option value="black">Black</option>
          <option value="blue-600">Blue</option>
          <option value="green-600">Green</option>
          <option value="red-600">Red</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Font Weight</label>
        <select
          value={fontWeight}
          onChange={(e) => setProp((props: TextProps) => props.fontWeight = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="light">Light</option>
          <option value="normal">Normal</option>
          <option value="medium">Medium</option>
          <option value="semibold">Semi Bold</option>
          <option value="bold">Bold</option>
        </select>
      </div>
    </div>
  );
}