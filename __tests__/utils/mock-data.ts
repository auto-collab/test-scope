import { Application, PipelineSummary, Build, TestResult, TestResultsDetails } from '../../app/types/azure-devops';

export const mockBuild: Build = {
  id: 12345,
  buildNumber: '2024.1.15.1',
  status: 'completed',
  result: 'succeeded',
  queueTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  startTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
  finishTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
  sourceBranch: 'main',
  sourceVersion: 'abc123def456',
  definition: {} as any,
  repository: {} as any,
  requestedBy: {} as any,
  requestedFor: {} as any,
  lastChangedBy: {} as any,
  lastChangedDate: new Date().toISOString(),
  keepForever: false,
  retainIndefinitely: false,
  hasDiagnostics: false,
  definitionRevision: 1,
  queue: {} as any,
  tags: []
};

export const mockTestResult: TestResult = {
  id: 1001,
  testCaseTitle: 'Should calculate total price correctly',
  automatedTestName: 'ECommerce.Tests.Unit.OrderTests.CalculateTotalPrice_ValidItems_ReturnsCorrectTotal',
  outcome: 'passed',
  state: 'completed',
  priority: 1,
  durationInMs: 45,
  startedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  completedDate: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45).toISOString(),
  testRun: { id: 12345, name: 'CI/CD Pipeline Run' }
};

export const mockFailedTestResult: TestResult = {
  id: 1003,
  testCaseTitle: 'Should handle inventory updates',
  automatedTestName: 'ECommerce.Tests.Unit.InventoryTests.UpdateInventory_OutOfStock_UpdatesCorrectly',
  outcome: 'failed',
  state: 'completed',
  priority: 1,
  errorMessage: 'Expected inventory count to be 0, but was 1',
  stackTrace: 'at ECommerce.Tests.Unit.InventoryTests.UpdateInventory_OutOfStock_UpdatesCorrectly() line 45',
  durationInMs: 78,
  startedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  completedDate: new Date(Date.now() - 2 * 60 * 60 * 1000 + 78).toISOString(),
  testRun: { id: 12345, name: 'CI/CD Pipeline Run' }
};

export const mockTestResultsDetails: TestResultsDetails[] = [
  {
    testAssembly: 'ECommerce.Tests.dll',
    testContainer: 'ECommerce.Tests.Unit',
    totalCount: 145,
    results: [mockTestResult, mockFailedTestResult]
  }
];

export const mockSuccessfulPipeline: PipelineSummary = {
  id: 1,
  name: 'CI/CD Pipeline',
  type: 'build',
  status: 'success',
  lastRun: mockBuild,
  testResults: {
    total: 245,
    passed: 238,
    failed: 3,
    skipped: 4,
    passRate: 97.1,
    duration: 12.5
  },
  codeCoverage: {
    lineCoverage: 87.3,
    branchCoverage: 82.1,
    functionCoverage: 91.7,
    totalLines: 15420,
    coveredLines: 13452
  },
  qualityGates: [
    { name: 'Code Coverage', status: 'passed', threshold: 80, actual: 87.3, unit: '%' },
    { name: 'Test Pass Rate', status: 'passed', threshold: 95, actual: 97.1, unit: '%' },
    { name: 'Build Time', status: 'passed', threshold: 20, actual: 15, unit: 'min' }
  ],
  detailedTestResults: mockTestResultsDetails
};

export const mockFailedPipeline: PipelineSummary = {
  id: 4,
  name: 'Frontend Build Pipeline',
  type: 'build',
  status: 'failed',
  lastRun: {
    ...mockBuild,
    id: 12348,
    buildNumber: '2024.1.15.4',
    result: 'failed',
    sourceBranch: 'hotfix/chart-rendering',
    sourceVersion: 'ghi789jkl012'
  },
  testResults: {
    total: 78,
    passed: 45,
    failed: 28,
    skipped: 5,
    passRate: 57.7,
    duration: 4.1
  },
  codeCoverage: {
    lineCoverage: 65.4,
    branchCoverage: 58.9,
    functionCoverage: 71.2,
    totalLines: 4560,
    coveredLines: 2982
  },
  qualityGates: [
    { name: 'Code Coverage', status: 'failed', threshold: 80, actual: 65.4, unit: '%' },
    { name: 'Test Pass Rate', status: 'failed', threshold: 90, actual: 57.7, unit: '%' },
    { name: 'Lint Errors', status: 'failed', threshold: 0, actual: 12, unit: 'errors' }
  ]
};

export const mockRunningPipeline: PipelineSummary = {
  id: 5,
  name: 'E2E Tests Pipeline',
  type: 'build',
  status: 'running',
  lastRun: {
    ...mockBuild,
    id: 12349,
    buildNumber: '2024.1.15.5',
    status: 'inProgress',
    result: 'none',
    finishTime: undefined
  },
  testResults: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    passRate: 0,
    duration: 0
  },
  codeCoverage: undefined,
  qualityGates: []
};

export const mockNoCoveragePipeline: PipelineSummary = {
  id: 6,
  name: 'Legacy System Integration',
  type: 'build',
  status: 'success',
  lastRun: {
    ...mockBuild,
    id: 12350,
    buildNumber: '2024.1.15.6',
    result: 'succeeded',
    sourceBranch: 'feature/legacy-integration',
    sourceVersion: 'mno345pqr678'
  },
  testResults: {
    total: 42,
    passed: 40,
    failed: 2,
    skipped: 0,
    passRate: 95.2,
    duration: 3.8
  },
  codeCoverage: undefined, // No coverage tooling configured for this legacy pipeline
  qualityGates: [
    { name: 'Test Pass Rate', status: 'passed', threshold: 90, actual: 95.2, unit: '%' },
    { name: 'Build Time', status: 'passed', threshold: 10, actual: 8.5, unit: 'min' }
  ]
};

export const mockHealthyApplication: Application = {
  id: 'app1',
  name: 'E-Commerce Platform',
  description: 'Main e-commerce application with payment processing',
  pipelines: [mockSuccessfulPipeline],
  lastUpdated: new Date().toISOString(),
  overallHealth: 'healthy'
};

export const mockWarningApplication: Application = {
  id: 'app2',
  name: 'User Management Service',
  description: 'Microservice for user authentication and authorization',
  pipelines: [mockSuccessfulPipeline, mockNoCoveragePipeline, mockRunningPipeline],
  lastUpdated: new Date().toISOString(),
  overallHealth: 'warning'
};

export const mockCriticalApplication: Application = {
  id: 'app3',
  name: 'Analytics Dashboard',
  description: 'Real-time analytics and reporting dashboard',
  pipelines: [mockFailedPipeline, mockRunningPipeline],
  lastUpdated: new Date().toISOString(),
  overallHealth: 'critical'
};

export const mockApplications: Application[] = [
  mockHealthyApplication,
  mockWarningApplication,
  mockCriticalApplication
];

export const mockEmptyApplication: Application = {
  id: 'app4',
  name: 'Empty Application',
  description: 'Application with no pipelines',
  pipelines: [],
  lastUpdated: new Date().toISOString(),
  overallHealth: 'healthy'
};
