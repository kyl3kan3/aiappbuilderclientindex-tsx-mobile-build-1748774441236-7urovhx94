import React from "react";
import { useState } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { UploadPage } from "./pages/UploadPage";
import { BuildWizard } from "./pages/BuildWizard";
import { BuildDashboard } from "./pages/BuildDashboard";
import { ErrorMonitor } from "./components/ErrorMonitor";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="relative h-screen">
      {/* Overlay to close sidebar when tapping outside */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Floating menu button when sidebar is collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed top-20 left-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          →
        </button>
      )}
      
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 ${sidebarCollapsed ? '-translate-x-full' : 'w-64'} w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 shadow-2xl border-r border-slate-700`}>
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-6'} space-y-6 h-full transition-all duration-300`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`${sidebarCollapsed ? 'w-12 h-12 mx-auto' : 'absolute -right-3 top-6'} bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        
          <div className={`${sidebarCollapsed ? 'mt-8' : 'mt-4'}`}>
            <h1 className={`font-bold transition-all duration-300 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ${sidebarCollapsed ? 'text-sm text-center' : 'text-2xl'}`}>
              {sidebarCollapsed ? '🤖' : '🤖 AI App Builder'}
            </h1>
            {!sidebarCollapsed && (
              <p className="text-slate-400 text-sm mt-2">Build amazing apps with AI</p>
            )}
          </div>
        
          <nav className="space-y-2">
            <Link 
              to="/upload" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === '/upload' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-slate-700/50 hover:text-blue-400'
              }`}
              title={sidebarCollapsed ? "Upload" : ""}
            >
              <span className="text-xl">📁</span>
              {!sidebarCollapsed && <span className="font-medium">Upload</span>}
            </Link>
            <Link 
              to="/build" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === '/build' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-slate-700/50 hover:text-blue-400'
              }`}
              title={sidebarCollapsed ? "Build with AI" : ""}
            >
              <span className="text-xl">🤖</span>
              {!sidebarCollapsed && <span className="font-medium">Build with AI</span>}
            </Link>
            <Link 
              to="/builds" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === '/builds' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-slate-700/50 hover:text-blue-400'
              }`}
              title={sidebarCollapsed ? "Build Status" : ""}
            >
              <span className="text-xl">📱</span>
              {!sidebarCollapsed && <span className="font-medium">Build Status</span>}
            </Link>
          </nav>
        </div>
      </aside>

      <main className="w-full overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/upload" />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/build" element={<BuildWizard />} />
          <Route path="/builds" element={<BuildDashboard />} />
        </Routes>
      </main>
      <ErrorMonitor />
    </div>
  );
}

export default App;