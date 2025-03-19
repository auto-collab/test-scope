import { getAzureWebClient } from './azure-web-client-service';
import { IBuildApi } from 'azure-devops-node-api/BuildApi';
import { getLatestBuildId } from './latest-build-service';

// ✅ Mock `getAzureWebClient`
jest.mock('../azure-web-client-service');

describe('getLatestBuildId', () => {
  let mockBuildApi: Partial<IBuildApi>;

  beforeEach(() => {
    jest.clearAllMocks(); // ✅ Reset mocks before each test

    // ✅ Define only the method we use (`getLatestBuild`)
    mockBuildApi = {
      getLatestBuild: jest.fn().mockResolvedValue({ id: 12345 }),
    };

    (getAzureWebClient as jest.Mock).mockReturnValue({
      getBuildApi: jest.fn().mockResolvedValue(mockBuildApi),
    });
  });

  test('should return the latest build ID', async () => {
    const buildId = await getLatestBuildId('pipeline1');

    expect(buildId).toBe(12345);
    expect(mockBuildApi.getLatestBuild).toHaveBeenCalledWith(
      'hagerty',
      'pipeline1',
      'main',
    );
  });

  test('should return 0 if no build ID is found', async () => {
    (mockBuildApi.getLatestBuild as jest.Mock).mockResolvedValue({ id: null });

    const buildId = await getLatestBuildId('pipeline1');

    expect(buildId).toBe(0);
  });

  test('should throw an error when API call fails', async () => {
    (mockBuildApi.getLatestBuild as jest.Mock).mockRejectedValue(
      new Error('API Failure'),
    );

    await expect(getLatestBuildId('pipeline1')).rejects.toThrow('API Failure');
  });
});
