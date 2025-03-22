import { getLatestBuildId } from './get-latest-build-service';
import { WebApi } from 'azure-devops-node-api';

describe('getLatestBuildId', () => {
  let mockWebApi: Partial<WebApi>;
  let mockBuildApi: { getLatestBuild: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockBuildApi = {
      getLatestBuild: jest.fn().mockResolvedValue({ id: 12345 }),
    };

    mockWebApi = {
      getBuildApi: jest.fn().mockResolvedValue(mockBuildApi),
    };
  });

  test('should return the latest build ID', async () => {
    const buildId = await getLatestBuildId('pipeline1', mockWebApi as WebApi);

    expect(buildId).toBe(12345);
    expect(mockWebApi.getBuildApi).toHaveBeenCalled();
    expect(mockBuildApi.getLatestBuild).toHaveBeenCalledWith(
      'hagerty',
      'pipeline1',
      'main',
    );
  });

  test('should return 0 if no build ID is found', async () => {
    (mockBuildApi.getLatestBuild as jest.Mock).mockResolvedValue(undefined);

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
