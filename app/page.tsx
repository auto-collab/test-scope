"use client";
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
          fetch(`/api/test-scope`) // later: `/api/test-scope?app=${selectedApp}`
            .then((res) => res.json())
            .then((data) => setTestData(data));
        }
      }, [selectedApp]);
      
    const toggleStorage = (storage) => {
        setExpandedStorage(prev => ({ ...prev, [storage]: !prev[storage] }));
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Test Results Dashboard</h1>

            <select
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="border p-2 rounded"
            >
                <option value="" disabled>Select an application</option>
                {applications.map(app => (
                    <option key={app} value={app}>{app}</option>
                ))}
            </select>

            {testData && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded p-4 shadow">
                        <h2 className="text-xl font-semibold">Total Tests</h2>
                        <p className="text-lg">{testData.totalTests}</p>
                        <h3 className="text-md font-medium mt-2">Last Outcomes</h3>
                        <ul className="text-sm">
  {Object.entries(testData.lastPipelineOutcomes as Record<string, string>).map(
    ([pipeline, outcome]) => (
      <li key={pipeline}>
        <strong>{pipeline}:</strong> {outcome}
      </li>
    )
  )}
</ul>
                    </div>

                    <div className="border rounded p-4 shadow">
                        <h2 className="text-xl font-semibold">Code Coverage</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={testData.codeCoverage}>
                                <XAxis dataKey="module" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="coverage" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {testData?.testGroups && (
                <div>
                    <h2 className="text-xl font-semibold mt-6">Test Groups</h2>
                    <ul className="space-y-2">
                        {Object.keys(testData.testGroups).map(storage => (
                            <li key={storage}>
                                <button
                                    className="text-blue-600 underline"
                                    onClick={() => toggleStorage(storage)}
                                >
                                    {storage}
                                </button>
                                {expandedStorage[storage] && (
                                    <div className="mt-2 ml-4 border-l pl-4">
                                        {testData.testGroups[storage].map((test, index) => (
                                            <div key={index} className="border p-2 rounded flex justify-start space-x-6">
                                                <span><strong>{test.testName}</strong></span>
                                                <span>Duration: {test.duration}</span>
                                                <span>Outcome: {test.outcome}</span>
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
