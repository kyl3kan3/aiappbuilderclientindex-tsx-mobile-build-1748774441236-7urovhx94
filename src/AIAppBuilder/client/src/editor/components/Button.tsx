import React from "react";
import { useNode } from "@craftjs/core";

interface ButtonProps {
  text?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export function Button({ text = "Click Me", color = "blue", size = "medium" }: ButtonProps) {
  const { connectors: { connect, drag } } = useNode();
  
  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg"
  };
  
  return (
    <button 
      ref={ref => connect(drag(ref))} 
      className={`bg-${color}-500 hover:bg-${color}-600 text-white rounded transition-colors ${sizeClasses[size]}`}
    >
      {text}
    </button>
  );
}

Button.craft = {
  props: { 
    text: "Click Me", 
    color: "blue",
    size: "medium"
  },
  related: {
    settings: ButtonSettings
  }
};

function ButtonSettings() {
  const { actions: { setProp }, text, color, size } = useNode((node) => ({
    text: node.data.props.text,
    color: node.data.props.color,
    size: node.data.props.size,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setProp((props: ButtonProps) => props.text = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <select
          value={color}
          onChange={(e) => setProp((props: ButtonProps) => props.color = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="red">Red</option>
          <option value="purple">Purple</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Size</label>
        <select
          value={size}
          onChange={(e) => setProp((props: ButtonProps) => props.size = e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
    </div>
  );
}