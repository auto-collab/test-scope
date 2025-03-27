import { getAzureWebClient } from './azure-web-client-service';
import * as azDev from 'azure-devops-node-api';
import { IRequestHandler } from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces';

describe('getAzureWebClient', () => {
  let mockWebApiInstance: Partial<azDev.WebApi>;
  let mockAuthHandler: jest.Mocked<IRequestHandler>;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    originalEnv = process.env;
    process.env = { ...originalEnv };

    mockAuthHandler = {
      prepareRequest: jest.fn(),
      canHandleAuthentication: jest.fn(),
      handleAuthentication: jest.fn(),
    } as jest.Mocked<IRequestHandler>;

    mockWebApiInstance = {
      getBuildApi: jest.fn(), // Mocking a real method like in other tests
    };

    jest
      .spyOn(azDev, 'getPersonalAccessTokenHandler')
      .mockReturnValue(mockAuthHandler);
    jest
      .spyOn(azDev, 'WebApi')
      .mockImplementation(() => mockWebApiInstance as azDev.WebApi);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should create a new WebApi instance if not already initialized', () => {
    process.env.NEXT_PUBLIC_ORG = 'testOrg';
    process.env.NEXT_PUBLIC_AZURE_BASE_URL = 'https://dev.azure.com/';
    process.env.NEXT_PUBLIC_AZURE_PAT = 'testToken';

    const client = getAzureWebClient();

    expect(azDev.getPersonalAccessTokenHandler).toHaveBeenCalledWith(
      'testToken',
    );
    expect(azDev.WebApi).toHaveBeenCalledTimes(1);
    expect(client).toBeDefined();
  });

  it('should return the existing WebApi instance if already initialized', () => {
    process.env.NEXT_PUBLIC_ORG = 'testOrg';
    process.env.NEXT_PUBLIC_AZURE_BASE_URL = 'https://dev.azure.com/';
    process.env.NEXT_PUBLIC_AZURE_PAT = 'testToken';

    const firstCall = getAzureWebClient();
    const secondCall = getAzureWebClient();

    expect(firstCall).toBe(secondCall); // Must return the same instance
    expect(azDev.WebApi).toHaveBeenCalledTimes(1); // Ensures only one instance is created
  });

  it('should handle missing environment variables gracefully', () => {
    process.env.NEXT_PUBLIC_ORG = '';
    process.env.NEXT_PUBLIC_AZURE_BASE_URL = '';
    process.env.NEXT_PUBLIC_AZURE_PAT = '';

    const client = getAzureWebClient();

    expect(azDev.getPersonalAccessTokenHandler).toHaveBeenCalledWith('');
    expect(azDev.WebApi).toHaveBeenCalledTimes(1);
    expect(client).toBeDefined();
  });
});
