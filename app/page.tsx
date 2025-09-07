"use client";

import React, { useState, useEffect } from 'react';
import { useAzureDevOps } from './contexts/azure-devops-context';
import ProjectSelector from './components/project-selector';
import TestScopeDashboard from './components/test-scope-dashboard';
import AzureDevOpsSetupGuide from './components/azure-devops-setup-guide';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { 
    applications, 
    selectedApplication, 
    setSelectedApplication, 
    isLoading, 
    error 
  } = useAzureDevOps();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleApplicationSelect = (selectedOption: { value: string; label: string } | null) => {
    const app = applications.find(a => a.id === selectedOption?.value);
    setSelectedApplication(app || null);
  };

  const projectOptions = applications.map(app => ({
    value: app.id,
    label: app.name
  }));

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Scope Dashboard</h1>
          <p className="text-gray-600">
            Monitor test coverage, quality gates, and pipeline health across your applications
          </p>
        </div>

        <AzureDevOpsSetupGuide />

        <div className="mb-8">
          <div className="flex items-end gap-4">
            <div className="max-w-md flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Application
              </label>
              <ProjectSelector
                options={projectOptions}
                onSelect={handleApplicationSelect}
                isLoading={isLoading}
              />
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading applications...</span>
          </div>
        ) : selectedApplication ? (
          <TestScopeDashboard application={selectedApplication} />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Selected</h3>
            <p className="text-gray-500">
              Choose an application from the dropdown above to view its test scope metrics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
