import { WebApi } from 'azure-devops-node-api';
import { getLatestBuildId } from '../get-latest-build/get-latest-build-service';
import { getCodeCoverageResults } from './get-code-coverage-service';

jest.mock('../get-latest-build/get-latest-build-service');

describe('getCodeCoverageResults', () => {
  let mockWebApi: Partial<WebApi>;
  let mockTestApi: { getBuildCodeCoverage: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockTestApi = {
      getBuildCodeCoverage: jest.fn(),
    };

    mockWebApi = {
      getTestApi: jest.fn().mockResolvedValue(mockTestApi),
    };

    (getLatestBuildId as jest.Mock).mockResolvedValue(12345);
  });

  test('should fetch code coverage results successfully', async () => {
    const mockCoverageResults = [
      {
        codeCoverageFileUrl: 'https://coverage-report.com/1',
        modules: [],
        state: 'Final',
      },
    ];

    mockTestApi.getBuildCodeCoverage.mockResolvedValue(mockCoverageResults);

    const results = await getCodeCoverageResults(
      'pipeline1',
      mockWebApi as WebApi,
    );

    expect(results).toEqual(mockCoverageResults);
    expect(getLatestBuildId).toHaveBeenCalledWith('pipeline1', mockWebApi);
    expect(mockTestApi.getBuildCodeCoverage).toHaveBeenCalledWith(
      'hagerty',
      12345,
      2,
    );
  });

  test('should throw an error when no code coverage is found', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress expected error output in console

    mockTestApi.getBuildCodeCoverage.mockResolvedValue(undefined);

    await expect(
      getCodeCoverageResults('pipeline1', mockWebApi as WebApi),
    ).rejects.toThrow('No test results found');

    expect(getLatestBuildId).toHaveBeenCalledWith('pipeline1', mockWebApi);
    expect(mockTestApi.getBuildCodeCoverage).toHaveBeenCalledWith(
      'hagerty',
      12345,
      2,
    );
  });

  test('should handle API errors gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress expected error output in console

    mockTestApi.getBuildCodeCoverage.mockRejectedValue(new Error('API error'));

    await expect(
      getCodeCoverageResults('pipeline1', mockWebApi as WebApi),
    ).rejects.toThrow('An unexpected error occurred: API error');

    expect(getLatestBuildId).toHaveBeenCalledWith('pipeline1', mockWebApi);
    expect(mockTestApi.getBuildCodeCoverage).toHaveBeenCalledWith(
      'hagerty',
      12345,
      2,
    );
  });
});
