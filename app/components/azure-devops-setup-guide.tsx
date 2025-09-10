"use client";

import React, { useState } from 'react';

export default function AzureDevOpsSetupGuide() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🔧 Azure DevOps Integration Setup
          </h3>
          <p className="text-blue-800 mb-4">
            Currently running in <strong>demo mode</strong> with mock data. 
            Follow these steps to connect to real Azure DevOps data using environment variables.
          </p>
          
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-blue-600 hover:text-blue-800 font-medium underline"
          >
            {showGuide ? 'Hide' : 'Show'} Integration Guide
          </button>
        </div>
        
        <div className="ml-4">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Demo Mode
          </div>
        </div>
      </div>

      {showGuide && (
        <div className="mt-6 space-y-6">
          {/* Step 1: Personal Access Token */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Step 1: Create Personal Access Token</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Go to your Azure DevOps organization</li>
              <li>Click on your profile picture → Personal Access Tokens</li>
              <li>Click &quot;New Token&quot;</li>
              <li>Set name: &quot;Test Scope Dashboard&quot;</li>
              <li>Set expiration: 1 year</li>
              <li>Select these scopes:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Build</strong> - Read</li>
                  <li><strong>Test Management</strong> - Read</li>
                  <li><strong>Code</strong> - Read</li>
                  <li><strong>Project and Team</strong> - Read</li>
                </ul>
              </li>
              <li>Click &quot;Create&quot; and copy the token</li>
            </ol>
          </div>

          {/* Step 2: Environment Configuration */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Step 2: Configure Environment Variables</h4>
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project root:
              </p>
              
              <div className="bg-gray-50 p-3 rounded border">
                <pre className="text-xs text-gray-800">
{`# .env.local
NEXT_PUBLIC_AZURE_DEVOPS_ORG=your-org-name
NEXT_PUBLIC_AZURE_DEVOPS_PROJECT=your-project-name
NEXT_PUBLIC_AZURE_DEVOPS_PAT=your-personal-access-token`}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3: Update Pipeline Configuration */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Step 3: Update Pipeline Configuration</h4>
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Update <code className="bg-gray-100 px-2 py-1 rounded">app/config/applications.ts</code> with your actual pipeline definition IDs:
              </p>
              
              <div className="bg-gray-50 p-3 rounded border">
                <pre className="text-xs text-gray-800">
{`// Replace placeholder IDs with your actual Azure DevOps pipeline definition IDs
{
  definitionId: 123, // 🔴 REPLACE: Your actual build definition ID
  name: 'CI/CD Pipeline',
  type: 'build',
  // ...
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 4: Test */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Step 4: Test the Integration</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Restart your development server: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">npm run dev</code></li>
              <li>Open the browser console to see any API errors</li>
              <li>Check that real project names appear in the dropdown</li>
              <li>Verify that pipeline data loads from your Azure DevOps</li>
              <li>If you see 401 errors, double-check your Personal Access Token permissions</li>
            </ol>
          </div>

          {/* API Endpoints Reference */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Azure DevOps REST API Endpoints Used</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Projects:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">/_apis/projects</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Build Definitions:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">/{"{project}"}/_apis/build/definitions</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Builds:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">/{"{project}"}/_apis/build/builds</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Test Runs:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">/{"{project}"}/_apis/test/runs</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Code Coverage:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">/{"{project}"}/_apis/build/builds/{"{buildId}"}/coverage</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
