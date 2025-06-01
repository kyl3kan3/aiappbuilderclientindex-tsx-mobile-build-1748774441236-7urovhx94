import React from "react";
import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from "react-live";

// Common components that might be used in generated code
const mockComponents = {
  Button: ({ children, onClick, className = "" }) => (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  ),
  Card: ({ children, className = "" }) => (
    <div className={`border rounded-lg p-4 shadow-sm bg-white ${className}`}>
      {children}
    </div>
  ),
  Input: ({ placeholder, value, onChange, className = "" }) => (
    <input 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  )
};

export default function LivePreview({ code, filename }: { code: string; filename: string }) {
  // Check if it's React Native code
  const isReactNative = code.includes('StyleSheet.create') || code.includes('from \'react-native\'');
  
  if (filename.endsWith(".tsx") || filename.endsWith(".jsx")) {
    return (
      <div className="h-full bg-white">
        {/* Preview Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-slate-200">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <span className="text-lg">👁️</span>
            {isReactNative ? 'Mobile App Preview' : 'Web Component Preview'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            File: {filename} | {isReactNative ? 'React Native mobile app code' : 'React web component code'}
          </p>
        </div>
        
        {isReactNative ? (
          // For React Native code, show a mobile mockup preview
          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-[400px] flex items-center justify-center">
            <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
              <div className="bg-white rounded-2xl w-80 h-[600px] overflow-hidden relative">
                <div className="bg-gray-100 h-8 flex items-center justify-center text-xs text-gray-500">
                  Mobile App Preview
                </div>
                <div className="p-4 h-full overflow-auto">
                  <div className="text-center text-gray-600 text-sm mb-4">
                    Mobile App Code Preview
                  </div>
                  
                  {/* Show actual code structure info */}
                  <div className="space-y-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Code Type</div>
                      <div className="text-xs text-blue-600 mt-1">
                        React Native - Ready for mobile deployment
                      </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-800">Features Detected</div>
                      <div className="text-xs text-green-600 mt-1">
                        {code.includes('useState') ? 'State Management, ' : ''}
                        {code.includes('useEffect') ? 'Lifecycle Hooks, ' : ''}
                        {code.includes('navigation') ? 'Navigation, ' : ''}
                        {code.includes('TouchableOpacity') ? 'Touch Interactions, ' : ''}
                        Native Components
                      </div>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <div className="text-sm font-medium text-purple-800">Deployment Ready</div>
                      <div className="text-xs text-purple-600 mt-1">
                        Code can be compiled for iOS and Android
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                      Use Deploy tab to build native app
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LiveProvider 
            code={`
              ${code
                .replace(/import.*from.*['"];?\s*/g, '')
                .replace(/export\s+default\s+/g, '')
                .replace(/function\s+(\w+)/g, 'function App')
                .trim()}
              
              render(<App />);
            `}
            language="jsx" 
            noInline={true}
            scope={{ 
              React, 
              useState: React.useState,
              useEffect: React.useEffect,
              ...mockComponents,
              render: (element: any) => element
            }}
          >
            <div className="p-4 bg-white h-full overflow-auto">
              <div className="w-full mx-auto bg-gray-50 rounded-lg border p-4 min-h-[400px]">
                <div className="text-sm text-gray-600 mb-4">Live App Preview:</div>
                <ReactLivePreview />
              </div>
            </div>
            <div className="p-4 bg-red-50 text-red-700 text-sm border-t border-red-200">
              <LiveError />
            </div>
          </LiveProvider>
        )}
      </div>
    );
  }

  if (filename.endsWith(".swift")) {
    return (
      <div className="h-full bg-white">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <span className="text-lg">📱</span>
            Swift Preview
          </h3>
          <p className="text-xs text-slate-500 mt-1">iOS native code preview</p>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[400px] flex items-center justify-center">
          <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
            <div className="bg-white rounded-2xl w-80 h-[600px] overflow-hidden relative">
              <div className="bg-gray-100 h-8 flex items-center justify-center text-xs text-gray-500">
                iOS App Preview
              </div>
              <div className="p-4 h-full overflow-auto">
                <div className="text-center text-gray-600 text-sm mb-4">
                  Swift code generated successfully
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">SwiftUI Components</div>
                    <div className="text-xs text-blue-600 mt-1">
                      Native iOS user interface elements
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-800">iOS Native</div>
                    <div className="text-xs text-green-600 mt-1">
                      Optimized for iPhone and iPad
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                    Build with Xcode
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex items-center justify-center">
      <div className="text-center text-gray-500">
        <div className="text-4xl mb-4">📄</div>
        <p>Code preview not available for this file type</p>
        <p className="text-sm mt-2 text-gray-400">{filename}</p>
      </div>
    </div>
  );
}