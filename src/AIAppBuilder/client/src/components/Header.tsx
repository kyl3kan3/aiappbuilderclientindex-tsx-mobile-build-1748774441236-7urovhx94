import React from "react";
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-glass backdrop-blur-xs border-b border-white/30 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">🧠 AI App Builder</h1>
        <nav className="space-x-4">
          <a href="/upload" className="text-gray-700 hover:text-primary font-medium">Upload</a>
          <a href="/build" className="text-gray-700 hover:text-primary font-medium">Build</a>
          <a href="/builds" className="text-gray-700 hover:text-primary font-medium">Deploy</a>
        </nav>
      </div>
    </header>
  );
}