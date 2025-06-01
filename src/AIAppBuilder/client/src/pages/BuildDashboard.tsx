import React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DeployButton } from "@/components/DeployButton";
import Header from "../components/Header";

interface Build {
  id: string;
  projectName: string;
  status: 'pending' | 'building' | 'success' | 'failed';
  platform: string;
  createdAt: string;
  repoUrl?: string;
  actionsUrl?: string;
  downloadUrls?: {
    ios?: string;
    android?: string;
  };
}

export function BuildDashboard() {
  const { data: builds = [], isLoading } = useQuery({
    queryKey: ['/api/builds'],
    queryFn: async () => {
      const response = await fetch('/api/builds');
      if (!response.ok) {
        throw new Error('Failed to fetch builds');
      }
      return response.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'building': return '🔨';
      case 'success': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'building': return 'text-blue-600 bg-blue-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading builds...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto mt-10 p-8 rounded-xl bg-white/60 shadow-lg backdrop-blur border border-gray-300">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📱 Mobile Build Dashboard</h1>
          <p className="text-gray-600">Track your AI Learning Companion and other mobile app builds</p>
        </div>

        <div className="mb-6">
          <div className="bg-white/70 backdrop-blur rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Deploy New Project</h2>
            <DeployButton />
          </div>
        </div>

        {builds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No builds yet</h3>
            <p className="text-gray-600">Deploy your first project to start tracking builds</p>
          </div>
        ) : (
          <div className="space-y-4">
            {builds.map((build: Build) => (
              <div key={build.id} className="bg-white/70 backdrop-blur rounded-2xl shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{build.projectName}</h3>
                    <p className="text-sm text-gray-500">
                      {build.platform} • {new Date(build.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(build.status)}`}>
                    <span className="mr-1">{getStatusIcon(build.status)}</span>
                    {build.status.charAt(0).toUpperCase() + build.status.slice(1)}
                  </div>
                </div>

                {build.repoUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Repository: <a href={build.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{build.repoUrl}</a>
                    </p>
                  </div>
                )}

                {build.actionsUrl && (
                  <div className="mb-4">
                    <a 
                      href={build.actionsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Build Progress
                    </a>
                  </div>
                )}

                {build.status === 'success' && build.downloadUrls && (
                  <div className="flex gap-4">
                    {build.downloadUrls.ios && (
                      <a
                        href={build.downloadUrls.ios}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        📱 Download iOS App
                      </a>
                    )}
                    {build.downloadUrls.android && (
                      <a
                        href={build.downloadUrls.android}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        🤖 Download Android APK
                      </a>
                    )}
                  </div>
                )}

                {build.status === 'building' && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Building your mobile app...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}