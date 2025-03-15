'use-client';
import { IBuildApi } from 'azure-devops-node-api/BuildApi';
import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces';
import { ITestResultsApi } from 'azure-devops-node-api/TestResultsApi';

import {
  GroupedTestResults,
  TestResultsResponse,
} from '@/models/interfaces/test-results-response';

import { getAzureWebClient } from './azure-web-client-service';

export async function getTestResults(
  pipeline: string,
): Promise<GroupedTestResults | undefined> {
  try {
    const connection = getAzureWebClient();

    const buildApi: IBuildApi = await connection.getBuildApi();
    const buildResponse = await buildApi.getLatestBuild(
      'hagerty',
      pipeline,
      'main', // Assumes Github Flow based deployment where the main branch is always deployable to production
    );
    const buildId = buildResponse.id ?? 0;
    const testResultsApi: ITestResultsApi =
      await connection.getTestResultsApi();

    const testRunsResponse = await testResultsApi.getTestResultsByBuild(
      'hagerty',
      buildId,
    );

    if (!testRunsResponse) {
      console.error('Error: No test results found for build:', buildId);
      throw new Error('No test results found');
    } else {
      const results: TestResultsResponse = {
        tests: testRunsResponse.map((testRun: ShallowTestCaseResult) => ({
          testName: testRun.testCaseTitle,
          id: testRun.id,
          runId: testRun.runId,
          refId: testRun.refId,
          outcome: testRun.outcome,
          priority: testRun.priority,
          automatedTestName: testRun.automatedTestName,
          automatedTestStorage: testRun.automatedTestStorage,
          owner: testRun.owner,
          testCaseTitle: testRun.testCaseTitle,
          durationInMs: testRun.durationInMs,
        })),
        count: testRunsResponse.length,
      };
      const groupedResults: GroupedTestResults = {
        totalTests: results.count,
        testGroups: groupByTestStorage(results),
      };

      return groupedResults;
    }
    // TODO Replace unknown and create error type and
  } catch (error: unknown) {
    console.error('Error occurred in getTestResults:', error);
    throw new Error(
      'An unexpected error occurred: ${(error as Error).message}',
    );
  }
}

// Groups the tests according to their associated DLL.
function groupByTestStorage(
  results: TestResultsResponse,
): Record<string, ShallowTestCaseResult[]> {
  const groupedResults: Record<string, ShallowTestCaseResult[]> = {};

  results.tests.forEach((test) => {
    const storageKey = test.automatedTestStorage ?? '';

    if (!groupedResults[storageKey]) {
      groupedResults[storageKey] = [];
    }

    // Add the test result to the corresponding group
    groupedResults[storageKey].push(test);
  });

  return groupedResults;
}
