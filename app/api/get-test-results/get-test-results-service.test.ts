import { WebApi } from 'azure-devops-node-api';
import { getLatestBuildId } from '../get-latest-build/get-latest-build-service';
import { getTestResults } from './get-test-results-service';

jest.mock('../get-latest-build/get-latest-build-service');

describe('getTestResults', () => {
  let mockWebApi: Partial<WebApi>;
  let mockTestResultsApi: { getTestResultsByBuild: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockTestResultsApi = {
      getTestResultsByBuild: jest.fn(),
    };

    mockWebApi = {
      getTestResultsApi: jest.fn().mockResolvedValue(mockTestResultsApi),
    };

    (getLatestBuildId as jest.Mock).mockResolvedValue(12345);
  });

  it('should successfully fetch test results', async () => {
    const mockTestRuns = [
      {
        testName: 'Test 1',
        id: 0,
        runId: 123,
        refId: 0,
        outcome: 'PASSED',
        priority: 1,
        automatedTestName: 'Test 1',
        automatedTestStorage: 'TestStorage1',
        owner: 'OwnerA',
        testCaseTitle: 'Test 1',
        durationInMs: 600,
      },
    ];

    mockTestResultsApi.getTestResultsByBuild.mockResolvedValue(mockTestRuns);

    const results = await getTestResults('pipeline1', mockWebApi as WebApi);

    expect(results?.testGroups['TestStorage1']).toEqual(mockTestRuns);
    expect(mockTestResultsApi.getTestResultsByBuild).toHaveBeenCalledWith(
      'hagerty',
      12345,
    );
    expect(getLatestBuildId).toHaveBeenCalledWith(
      'pipeline1',
      mockWebApi as WebApi,
    );
  });

  it('should successfully fetch multiple test results from same automatedTestStorage', async () => {
    const mockTestRuns = [
      {
        testName: 'Test 1',
        testCaseTitle: 'Test 1',
        automatedTestName: 'Test 1',
        id: 0,
        runId: 123,
        refId: 0,
        outcome: 'PASSED',
        priority: 1,
        automatedTestStorage: 'TestStorage1',
        owner: 'OwnerA',
        durationInMs: 600,
      },
      {
        testName: 'Test 2',
        testCaseTitle: 'Test 2',
        automatedTestName: 'Test 2',
        id: 0,
        runId: 123,
        refId: 0,
        outcome: 'PASSED',
        priority: 1,
        automatedTestStorage: 'TestStorage1',
        owner: 'OwnerA',
        durationInMs: 600,
      },
    ];

    mockTestResultsApi.getTestResultsByBuild.mockResolvedValue(mockTestRuns);

    const results = await getTestResults('pipeline1', mockWebApi as WebApi);

    expect(results?.testGroups['TestStorage1']).toEqual(mockTestRuns);
  });

  it('should successfully fetch multiple test results from different automatedTestStorage', async () => {
    const mockTestRuns = [
      {
        testName: 'Test 1',
        testCaseTitle: 'Test 1',
        automatedTestName: 'Test 1',
        id: 0,
        runId: 123,
        refId: 0,
        outcome: 'PASSED',
        priority: 1,
        automatedTestStorage: 'TestStorage1',
        owner: 'OwnerA',
        durationInMs: 600,
      },
      {
        testName: 'Test 2',
        testCaseTitle: 'Test 2',
        automatedTestName: 'Test 2',
        id: 0,
        runId: 123,
        refId: 0,
        outcome: 'PASSED',
        priority: 1,
        automatedTestStorage: 'TestStorage2',
        owner: 'OwnerA',
        durationInMs: 600,
      },
    ];

    mockTestResultsApi.getTestResultsByBuild.mockResolvedValue(mockTestRuns);

    const results = await getTestResults('pipeline1', mockWebApi as WebApi);

    expect(results?.testGroups['TestStorage1']).toEqual([mockTestRuns[0]]);
    expect(results?.testGroups['TestStorage2']).toEqual([mockTestRuns[1]]);
  });

  it('should handle null automatedTestStorage value', async () => {
    const mockTestRuns = [
      {
        testName: 'Test 1',
        testCaseTitle: 'Test 1',
        automatedTestName: 'Test 1',
        id: 0,
        runId: 123,
        refId: 0,
        outcome: 'PASSED',
        priority: 1,
        automatedTestStorage: null,
        owner: 'OwnerA',
        durationInMs: 600,
      },
    ];

    mockTestResultsApi.getTestResultsByBuild.mockResolvedValue(mockTestRuns);

    const results = await getTestResults('pipeline1', mockWebApi as WebApi);

    expect(results?.testGroups['']).toEqual(mockTestRuns);
  });

  it('should handle undefined automatedTestStorage value', async () => {
    const mockTestRuns = [
      {
        testName: 'Test 1',
        testCaseTitle: 'Test 1',
        automatedTestName: 'Test 1',
        id: 0,
        runId: 123,
        refId: 0,
        outcome: 'PASSED',
        priority: 1,
        automatedTestStorage: undefined,
        owner: 'OwnerA',
        durationInMs: 600,
      },
    ];

    mockTestResultsApi.getTestResultsByBuild.mockResolvedValue(mockTestRuns);

    const results = await getTestResults('pipeline1', mockWebApi as WebApi);

    expect(results?.testGroups['']).toEqual(mockTestRuns);
  });

  it('should handle missing automatedTestStorage attribute', async () => {
    const mockTestRuns = [
      {
        testName: 'Test 1',
        testCaseTitle: 'Test 1',
        automatedTestName: 'Test 1',
        id: 0,
        runId: 123,
        refId: 0,
        outcome: 'PASSED',
        priority: 1,
        owner: 'OwnerA',
        durationInMs: 600,
      },
    ];

    mockTestResultsApi.getTestResultsByBuild.mockResolvedValue(mockTestRuns);

    const results = await getTestResults('pipeline1', mockWebApi as WebApi);

    expect(results?.testGroups['']).toEqual(mockTestRuns);
  });

  it('should handle empty automatedTestStorage value', async () => {
    const mockTestRuns = [
      {
        testName: 'Test 1',
        testCaseTitle: 'Test 1',
        automatedTestName: 'Test 1',
        automatedTestStorage: '',
        id: 0,
        runId: 123,
        refId: 0,
        outcome: 'PASSED',
        priority: 1,
        owner: 'OwnerA',
        durationInMs: 600,
      },
    ];

    mockTestResultsApi.getTestResultsByBuild.mockResolvedValue(mockTestRuns);

    const results = await getTestResults('pipeline1', mockWebApi as WebApi);

    expect(results?.testGroups['']).toEqual(mockTestRuns);
  });



  it('should throw an error when no test results are found', async () => {
    mockTestResultsApi.getTestResultsByBuild.mockResolvedValue(undefined);

    await expect(
      getTestResults('pipeline1', mockWebApi as WebApi),
    ).rejects.toThrow('No test results found');

    expect(getLatestBuildId).toHaveBeenCalledWith('pipeline1', mockWebApi);
    expect(mockTestResultsApi.getTestResultsByBuild).toHaveBeenCalledWith(
      'hagerty',
      12345,
    );
  });

  it('should handle API errors gracefully', async () => {
    mockTestResultsApi.getTestResultsByBuild.mockRejectedValue(
      new Error('API error'),
    );

    await expect(
      getTestResults('pipeline1', mockWebApi as WebApi),
    ).rejects.toThrow('An unexpected error occurred: API error');

    expect(getLatestBuildId).toHaveBeenCalledWith('pipeline1', mockWebApi);
    expect(mockTestResultsApi.getTestResultsByBuild).toHaveBeenCalledWith(
      'hagerty',
      12345,
    );
  });

});
