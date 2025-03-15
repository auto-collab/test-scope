'use client';
import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { GroupedTestResults } from '@/models/interfaces/test-results-response';
import { Select } from '@hagerty/react-components';

// Registering necessary Chart.js components?
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function ResultsByPipelinePage() {
  const [pipelines] = useState([
    'manifold-apollo-mo-e2e',
    'manifold-apollo-qa-e2e',
    'router-e2e',
    'router-bff-integration',
    'merlin-integration-tests',
    'WCF-Manifold-Services',
    'WEB-Manifold-Web',
    'WEB-Merlin-Web',
    'clientproxy-insuranceops-integration',
    'manifold-domainquoteandapp-integration',
    'manifold-web-integration',
    'manifold-performance',
  ]);

  const [selectedPipeline, setSelectedPipeline] = useState('');
  const [groupedTestResults, setGroupTestResults] =
    useState<GroupedTestResults | null>(null);
  const [barChartData, setBarChartData] = useState<TestCountByStorage>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPipeline) {
      fetchBuildData(selectedPipeline);
    }
  }, [selectedPipeline]);

  const fetchBuildData = async (pipelineName: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        '/api/test-results?pipelineName=${pipelineName}',
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      setGroupTestResults(data);
    } catch (error) {
      console.error('Error fetching build data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupedTestResults) {
      const chartData = getTestCountByStorage(groupedTestResults.testGroups);
      setBarChartData(chartData);
    }
  }, [groupedTestResults]);

  interface TestCountByStorage {
    labels: string[];
    datasets: Dataset[];
  }
  interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string;
  }

  // 'Storage' means DLL which we're going to use to determine if tests are unit or integration
  // getTestCountByDLL
  const getTestCountByStorage = (
    testGroups: Record<string, ShallowTestCaseResult[]>,
  ): TestCountByStorage => {
    const storageNames = Object.keys(testGroups);
    const testCounts = storageNames.map(
      (storage) => testGroups[storage].length,
    );

    const results: TestCountByStorage = {
      labels: storageNames,
      datasets: [
        {
          label: 'Number of Tests',
          data: testCounts,
          backgroundColor: '#42A5F5',
        },
      ],
    };
    return results;
  };

  return (
    <div>
      <header className="App-header">
        <h1>Test Results By Pipeline</h1>
        <Select
          name="pipeline-select"
          required={true}
          data-testid="pipeline-select"
          options={[
            { label: '', value: '' },
            ...pipelines.map((p) => ({
              label: p,
              value: p,
            })),
          ]}
          onChange={(e) => setSelectedPipeline(e.target.value)}
          value={selectedPipeline || ''}
        />

        {groupedTestResults && (
          <>
            <div>
              <h2>Total tests: {groupedTestResults.totalTests}</h2>
              {/** Display Bar chart for the number of tests by automatedTestStorage */}
              {barChartData && (
                <div style={{ width: '600px', height: '400px' }}>
                  <Bar data={barChartData} options={{ responsive: true }} />
                </div>
              )}
              {/** TODO: Break off into own method */}
              {Object.entries(groupedTestResults.testGroups).map(
                ([groupName, tests]) => (
                  <div key={groupName}>
                    <h2>{groupName}</h2>
                    <ul>
                      {tests.map((result: ShallowTestCaseResult, index) => (
                        <li key={index}>
                          <strong>{result.testCaseTitle}</strong>
                          <ul>
                            <li>
                              <strong>Result:</strong> {result.outcome}
                            </li>
                            <li>
                              <strong>Duration:</strong> {result.durationInMs}ms
                            </li>
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          </>
        )}
      </header>
    </div>
  );
}
