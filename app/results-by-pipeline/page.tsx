'use client';

import { useState, useEffect } from 'react';
import Dropdown from '../components/Dropdown';
import TestCard from '../components/TestCard';

export default function ResultsByPipelinePage() {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState('');
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    setApps(['App1', 'App2']);
  }, []);

  useEffect(() => {
    if (selectedApp) {
      fetch(`api/test-scope?app=${selectedApp}`)
        .then((res) => res.json())
        .then((data) => setTestData(data));
    }
  }, [selectedApp]);

  return (
    <main className="min-h-screen p-4 bg-gray-100">
      <div className="flex flex-row">
        <div className="w-1/4">
          <Dropdown
            label="Select an application"
            options={apps}
            value={selectedApp}
            onChange={(v) => setSelectedApp(v)}
          />
          {testData && (
            <ul className="text-sm mt-2 space-y-1 text-dark">
              {Object.entries(
                testData.lastPipelineOutcomes as Record<string, string>,
              ).map(([pipeline, outcome]) => (
                <li key={pipeline}>
                  <strong>{pipeline}:</strong> {outcome}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-1/2 flex justify-center">
          <TestCard title="Total Tests:">
            <div>{testData?.totalTests ?? 'No test data available'}</div>
          </TestCard>
        </div>
      </div>
    </main>
  );
}
