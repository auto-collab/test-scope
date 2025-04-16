'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function TestResultsDashboard() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState('');
  const [testData, setTestData] = useState(null);
  const [expandedStorage, setExpandedStorage] = useState({});

  useEffect(() => {
    setApplications(['App1', 'App2', 'App3']);
  }, []);

  useEffect(() => {
    if (selectedApp) {
      fetch(`/api/test-scope?app=${selectedApp}`)
        .then((res) => res.json())
        .then((data) => setTestData(data));
    }
  }, [selectedApp]);

  const toggleStorage = (storage) => {
    setExpandedStorage((prev) => ({ ...prev, [storage]: !prev[storage] }));
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen p-6 space-y-6 antialiased">
      <h1 className="text-3xl font-bold text-primary border-b-2 border-accent pb-2">
        Test Results Dashboard
      </h1>

      <select
        value={selectedApp}
        onChange={(e) => setSelectedApp(e.target.value)}
        className="bg-white text-dark border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
      >
        <option value="" disabled>
          Select an application
        </option>
        {applications.map((app) => (
          <option key={app} value={app}>
            {app}
          </option>
        ))}
      </select>

      {testData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-dark">
              Total Tests
            </h2>
            <p className="text-2xl font-bold text-primary">
              {testData.totalTests}
            </p>
            <h3 className="text-md font-medium mt-4 text-dark">
              Last Outcomes
            </h3>
            <ul className="text-sm mt-2 space-y-1 text-dark">
              {Object.entries(
                testData.lastPipelineOutcomes as Record<string, string>,
              ).map(([pipeline, outcome]) => (
                <li key={pipeline}>
                  <strong>{pipeline}:</strong> {outcome}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-dark">
              Code Coverage
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testData.codeCoverage}>
                <XAxis dataKey="module" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="coverage" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {testData?.testGroups && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-4 text-dark">
            Test Groups
          </h2>
          <ul className="space-y-3">
            {Object.keys(testData.testGroups).map((storage) => (
              <li key={storage}>
                <button
                  className="text-accent hover:underline transition"
                  onClick={() => toggleStorage(storage)}
                >
                  {storage}
                </button>
                {expandedStorage[storage] && (
                  <div className="mt-3 ml-4 border-l-2 pl-4 space-y-2">
                    {testData.testGroups[storage].map((test, index) => (
                      <div
                        key={index}
                        className={`rounded-lg p-3 flex justify-start items-center gap-4 text-sm transition ${
                          test.outcome === 'Passed'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <span className="font-medium">{test.testName}</span>
                        <span className="text-gray-600">
                          Duration: {test.duration}
                        </span>
                        <span className="text-gray-600">
                          Outcome: {test.outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
