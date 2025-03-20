import { getLatestBuildId } from './latest-build-service'; // ✅ Ensure correct import path
import { getAzureWebClient } from './azure-web-client-service'; // ✅ Ensure correct import path
import { IBuildApi } from 'azure-devops-node-api/BuildApi';

// ✅ Mock the entire module
jest.mock('./azure-web-client-service', () => ({
  getAzureWebClient: jest.fn(),
}));

describe('getLatestBuildId', () => {
  let mockBuildApi: Partial<IBuildApi>;

  beforeEach(() => {
    jest.clearAllMocks(); // ✅ Reset mocks before each test

    // ✅ Define the mock API behavior
    mockBuildApi = {
      getLatestBuild: jest.fn().mockResolvedValue({ id: 12345 }),
    };

    // ✅ Correctly mock `getAzureWebClient`
    (getAzureWebClient as jest.Mock).mockImplementation(() => ({
      getBuildApi: jest.fn().mockResolvedValue(mockBuildApi),
    }));
  });

  test('should return the latest build ID', async () => {
    const buildId = await getLatestBuildId('pipeline1');

    expect(buildId).toBe(12345);
    expect(getAzureWebClient).toHaveBeenCalled(); // ✅ Ensure mock is called
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
