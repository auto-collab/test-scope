import { getTestResults } from '../get-test-results/get-test-results-service';
import { getCodeCoverageResults } from '../get-code-coverage/get-code-coverage-service';
import { getApplicationTestScope } from './get-application-test-scope';

jest.mock('../get-test-results/get-test-results-service');
jest.mock('../get-code-coverage/get-code-coverage-service');

describe('getApplicationTestScope', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return test and coverage results for multiple pipelines', async () => {
    (getTestResults as jest.Mock).mockImplementation(async (pipeline) => {
      return { testGroups: { [pipeline]: [`test-${pipeline}`] } };
    });

    (getCodeCoverageResults as jest.Mock).mockImplementation(
      async (pipeline) => {
        return [{ module: `coverage-${pipeline}` }];
      },
    );

    const results = await getApplicationTestScope();
    expect(results).toEqual({
      pipeline1: {
        testResults: { testGroups: { pipeline1: ['test-pipeline1'] } },
        codeCoverage: [{ module: 'coverage-pipeline1' }],
      },
      pipeline2: {
        testResults: { testGroups: { pipeline2: ['test-pipeline2'] } },
        codeCoverage: [{ module: 'coverage-pipeline2' }],
      },
    });
  });

  test('should handle missing test results', async () => {
    (getTestResults as jest.Mock).mockResolvedValue(null);
    (getCodeCoverageResults as jest.Mock).mockResolvedValue(null);

    const results = await getApplicationTestScope();
    expect(results).toEqual({
      pipeline1: { testResults: null, codeCoverage: null },
      pipeline2: { testResults: null, codeCoverage: null },
    });
  });

  test('should handle API errors gracefully', async () => {
    (getTestResults as jest.Mock).mockRejectedValue(
      new Error('Test API Error'),
    );
    (getCodeCoverageResults as jest.Mock).mockRejectedValue(
      new Error('Coverage API Error'),
    );

    await expect(getApplicationTestScope()).rejects.toThrow('Test API Error');
  });

  test('should ensure code coverage results are correctly mapped to pipelines', async () => {
    (getTestResults as jest.Mock).mockResolvedValue({ testGroups: {} });
    (getCodeCoverageResults as jest.Mock).mockImplementation(
      async (pipeline) => {
        return [{ module: `coverage-${pipeline}` }];
      },
    );

    const results = await getApplicationTestScope();

    expect(getCodeCoverageResults).toHaveBeenCalledTimes(2);
    expect(results).toEqual({
      pipeline1: {
        testResults: { testGroups: {} },
        codeCoverage: [{ module: 'coverage-pipeline1' }],
      },
      pipeline2: {
        testResults: { testGroups: {} },
        codeCoverage: [{ module: 'coverage-pipeline2' }],
      },
    });
  });
});
