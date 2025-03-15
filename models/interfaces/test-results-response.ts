import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces';

export interface TestResultsResponse {
  tests: ShallowTestCaseResult[];
  count: number;
}

export interface GroupedTestResults {
  totalTests: number;
  testGroups: Record<string, ShallowTestCaseResult[]>;
}
