import { getLatestBuildId } from './get-latest-build-service';
import { getAzureWebClient } from './azure-web-client-service';
import { WebApi } from 'azure-devops-node-api';

jest.mock('./azure-web-client-service', () => ({
  getAzureWebClient: jest.fn(),
}));

describe('getLatestBuildId', () => {
  let mockWebApi: Partial<WebApi>;
  let mockBuildApi: { getLatestBuild: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ Correct structure for getBuildApi() and getLatestBuild()
    mockBuildApi = {
      getLatestBuild: jest.fn().mockResolvedValue({ id: 12345 }),
    };

    mockWebApi = {
      getBuildApi: jest.fn().mockResolvedValue(mockBuildApi),
    };

    // ✅ Mock `getAzureWebClient` to return our mockWebApi
    (getAzureWebClient as jest.Mock).mockReturnValue(mockWebApi);
  });

  // Tests
  test('should return the latest build ID', async () => {
    const buildId = await getLatestBuildId('pipeline1', mockWebApi as WebApi);

    expect(buildId).toBe(12345);
    expect(getAzureWebClient).toHaveBeenCalled();
  });

  test('should return 0 if no build ID is found', async () => {
    (mockWebApi.getBuildApi as jest.Mock).mockResolvedValue({
      getLatestBuildId: jest.fn().mockResolvedValue(0),
    });

    const buildId = await getLatestBuildId('pipeline1', mockWebApi as WebApi);

    expect(buildId).toBe(0);
  });

  test('should throw an error when API call fails', async () => {
    (mockWebApi.getBuildApi as jest.Mock).mockRejectedValue(
      new Error('API Failure'),
    );

    await expect(
      getLatestBuildId('pipeline1', mockWebApi as WebApi),
    ).rejects.toThrow('API Failure');
  });
});
