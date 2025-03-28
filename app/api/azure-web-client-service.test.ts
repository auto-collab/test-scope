import * as azDev from 'azure-devops-node-api';
import {
  createAzureWebClient,
  getAzureWebClient,
  resetAzureWebClient,
} from './azure-web-client-service';

jest.mock('azure-devops-node-api', () => {
  return {
    WebApi: jest.fn().mockImplementation(() => ({})),
    getPersonalAccessTokenHandler: jest.fn(),
  };
});

describe('Azure Web Client', () => {
  const mockOrgUrl = 'https://dev.azure.com/testOrg';
  const mockToken = 'test-pat-token';
  let mockAuthHandler: jest.Mock;
  let mockWebApiInstance: jest.Mocked<azDev.WebApi>;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_ORG = 'testOrg';
    process.env.NEXT_PUBLIC_AZURE_BASE_URL = 'https://dev.azure.com/';
    process.env.NEXT_PUBLIC_AZURE_PAT = mockToken;

    mockAuthHandler = jest.fn();
    mockWebApiInstance = {} as unknown as jest.Mocked<azDev.WebApi>;

    (azDev.getPersonalAccessTokenHandler as jest.Mock).mockReturnValue(
      mockAuthHandler,
    );
    (azDev.WebApi as unknown as jest.Mock).mockImplementation(
      () => mockWebApiInstance,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    resetAzureWebClient(); // Reset singleton after each test
  });

  test('createAzureWebClient should create a new WebApi instance', () => {
    const client = createAzureWebClient();

    expect(azDev.getPersonalAccessTokenHandler).toHaveBeenCalledWith(mockToken);
    expect(azDev.WebApi).toHaveBeenCalledWith(mockOrgUrl, mockAuthHandler);
    expect(client).toBe(mockWebApiInstance);
  });

  test('createAzureWebClient should handle missing environment variables', () => {
    delete process.env.NEXT_PUBLIC_ORG;
    delete process.env.NEXT_PUBLIC_AZURE_BASE_URL;
    delete process.env.NEXT_PUBLIC_AZURE_PAT;

    const client = createAzureWebClient();

    expect(azDev.getPersonalAccessTokenHandler).toHaveBeenCalledWith('');
    expect(azDev.WebApi).toHaveBeenCalledWith('', expect.anything());
    expect(client).toBeDefined();
  });

  test('getAzureWebClient should return cached instance if exists', () => {
    const firstCall = getAzureWebClient();
    const secondCall = getAzureWebClient();

    expect(azDev.WebApi).toHaveBeenCalledTimes(1); // Ensures only one instance is created
    expect(firstCall).toBe(secondCall);
  });

  test('getAzureWebClient should create a new instance if not cached', () => {
    resetAzureWebClient();

    const client = getAzureWebClient();

    expect(azDev.WebApi).toHaveBeenCalledTimes(1); // Ensures a new instance is created
    expect(client).toBe(mockWebApiInstance);
  });
});
