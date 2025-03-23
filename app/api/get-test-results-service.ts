'use-client';
import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces';
import { ITestResultsApi } from 'azure-devops-node-api/TestResultsApi';

import {
  GroupedTestResults,
  TestResultsResponse,
} from '@/models/interfaces/test-results-response';

import { getLatestBuildId } from './get-latest-build/get-latest-build-service';
import { WebApi } from 'azure-devops-node-api';

export async function getTestResults(
  pipeline: string,
  webApi: WebApi,
): Promise<GroupedTestResults | undefined> {
  try {
    const buildId: number = await getLatestBuildId(pipeline, webApi);
    const testResultsApi: ITestResultsApi = await webApi.getTestResultsApi();

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
