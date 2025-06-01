import React from "react";
import { useState } from "react";
import { LiveCodeEditor } from "./LiveCodeEditor";
import { LiveCodePreview } from "./LivePreview";
import { Button } from "@/components/ui/button";
import { Download, Play, Code, Eye } from "lucide-react";

const initialCode = `function WelcomeApp() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#3B82F6' }}>
        Welcome to Live Code Editor!
      </h1>
      <p>You clicked {count} times</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          backgroundColor: '#3B82F6',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Click me!
      </button>
    </div>
  );
}`;

export function CodePreviewPage() {
  const [code, setCode] = useState(initialCode);
  const [view, setView] = useState<'split' | 'editor' | 'preview'>('split');

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'component.jsx';
    link.click();
    URL.revokeObjectURL(url);
  };

  const examples = [
    {
      name: 'Hello World',
      code: `function HelloWorld() {
  return <h1 style={{ color: '#3B82F6' }}>Hello, World!</h1>;
}`
    },
    {
      name: 'Counter App',
      code: initialCode
    },
    {
      name: 'Form Example',
      code: `function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Contact Form</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <button style={{
        backgroundColor: '#10B981',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px'
      }}>
        Submit
      </button>
    </div>
  );
}`
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Live Code Editor</h1>
            
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('editor')}
                className={`px-3 py-1 rounded text-sm ${view === 'editor' ? 'bg-white shadow-sm' : ''}`}
              >
                <Code className="w-4 h-4 inline mr-1" />
                Editor
              </button>
              <button
                onClick={() => setView('split')}
                className={`px-3 py-1 rounded text-sm ${view === 'split' ? 'bg-white shadow-sm' : ''}`}
              >
                Split
              </button>
              <button
                onClick={() => setView('preview')}
                className={`px-3 py-1 rounded text-sm ${view === 'preview' ? 'bg-white shadow-sm' : ''}`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Preview
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              onChange={(e) => setCode(examples[parseInt(e.target.value)].code)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Load Example...</option>
              {examples.map((example, index) => (
                <option key={index} value={index}>
                  {example.name}
                </option>
              ))}
            </select>
            
            <Button onClick={downloadCode} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {view === 'split' && (
          <div className="grid grid-cols-2 gap-6 h-full">
            <LiveCodeEditor code={code} onChange={setCode} />
            <LiveCodePreview code={code} />
          </div>
        )}
        
        {view === 'editor' && (
          <div className="h-full">
            <LiveCodeEditor code={code} onChange={setCode} />
          </div>
        )}
        
        {view === 'preview' && (
          <div className="h-full">
            <LiveCodePreview code={code} />
          </div>
        )}
      </div>
    </div>
  );
}