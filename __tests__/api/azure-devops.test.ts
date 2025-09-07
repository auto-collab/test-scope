import { NextRequest } from 'next/server';
import { POST } from '../../app/api/azure-devops/route';

// Mock NextResponse
const mockJson = jest.fn();
const mockNextResponse = {
  json: mockJson,
};

// Mock fetch for Azure DevOps API calls
global.fetch = jest.fn();

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => {
      mockJson(data, init);
      return { ...mockNextResponse, data, init };
    }),
  },
}));

describe('/api/azure-devops', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 for missing organization', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: '',
        project: 'test-project',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: 'Missing required configuration fields' },
      { status: 400 }
    );
  });

  it('returns 400 for missing project', async () => {
    // Mock fetch to return a successful response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ value: [] })
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: '',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    // Project is no longer required for validation, so this should succeed
    expect(mockJson).toHaveBeenCalledWith(
      { value: [] },
      undefined
    );
  });

  it('returns 400 for missing personalAccessToken', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: 'test-project',
        personalAccessToken: ''
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: 'Missing required configuration fields' },
      { status: 400 }
    );
  });

  it('returns 400 for missing all fields', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({})
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: 'Missing required configuration fields' },
      { status: 400 }
    );
  });

  it('returns Azure DevOps projects for valid configuration', async () => {
    const mockAzureResponse = {
      value: [
        {
          id: 'real-project-1',
          name: 'Test Project 1',
          description: 'A real Azure DevOps project',
          state: 'wellFormed',
          visibility: 'private'
        },
        {
          id: 'real-project-2',
          name: 'Test Project 2',
          description: 'Another real Azure DevOps project',
          state: 'wellFormed',
          visibility: 'private'
        }
      ]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockAzureResponse)
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: 'test-project',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://dev.azure.com/test-org/_apis/projects?api-version=7.2-preview.1',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic'),
          'Content-Type': 'application/json'
        })
      })
    );

    expect(mockJson).toHaveBeenCalledWith(mockAzureResponse, undefined);
  });

  it('handles JSON parsing errors', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
    } as unknown as NextRequest;

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: expect.stringContaining('Failed to connect to Azure DevOps') },
      { status: 500 }
    );

    expect(consoleSpy).toHaveBeenCalledWith('Azure DevOps API error:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('handles Azure DevOps API errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: 'test-project',
        personalAccessToken: 'invalid-token'
      })
    } as unknown as NextRequest;

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: expect.stringContaining('Failed to connect to Azure DevOps') },
      { status: 500 }
    );

    expect(consoleSpy).toHaveBeenCalledWith('Azure DevOps API error:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('handles unexpected errors gracefully', async () => {
    const mockRequest = {
      json: jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      })
    } as unknown as NextRequest;

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: expect.stringContaining('Failed to connect to Azure DevOps') },
      { status: 500 }
    );

    consoleSpy.mockRestore();
  });

  it('validates configuration fields are strings', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: null,
        project: 'test-project',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: 'Missing required configuration fields' },
      { status: 400 }
    );
  });

  it('validates all configuration fields are truthy strings', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: '',  // empty string
        project: 'test-project',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: 'Missing required configuration fields' },
      { status: 400 }
    );
  });

  it('returns correct project structure from Azure DevOps', async () => {
    const mockAzureResponse = {
      value: [
        {
          id: 'test-project-id',
          name: 'Test Project',
          description: 'A test project from Azure DevOps',
          state: 'wellFormed',
          visibility: 'private'
        }
      ]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockAzureResponse)
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: 'test-project',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    const callArgs = mockJson.mock.calls[0][0];
    expect(callArgs).toHaveProperty('value');
    expect(Array.isArray(callArgs.value)).toBe(true);
    expect(callArgs.value).toHaveLength(1);

    // Check structure of first project
    const firstProject = callArgs.value[0];
    expect(firstProject).toHaveProperty('id');
    expect(firstProject).toHaveProperty('name');
    expect(firstProject).toHaveProperty('description');
    expect(firstProject).toHaveProperty('state');
    expect(firstProject).toHaveProperty('visibility');

    expect(typeof firstProject.id).toBe('string');
    expect(typeof firstProject.name).toBe('string');
    expect(typeof firstProject.description).toBe('string');
    expect(firstProject.state).toBe('wellFormed');
    expect(firstProject.visibility).toBe('private');
  });

  it('handles request with extra fields gracefully', async () => {
    const mockAzureResponse = {
      value: [
        {
          id: 'test-project-id',
          name: 'Test Project',
          state: 'wellFormed',
          visibility: 'private'
        }
      ]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockAzureResponse)
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: 'test-project',
        personalAccessToken: 'test-token',
        extraField: 'should-be-ignored',
        anotherField: 123
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    // Should still return Azure DevOps data successfully
    const callArgs = mockJson.mock.calls[0][0];
    expect(callArgs).toHaveProperty('value');
    expect(callArgs.value).toHaveLength(1);
  });

  it('returns consistent Azure DevOps data across calls', async () => {
    const mockAzureResponse = {
      value: [
        {
          id: 'test-project-id',
          name: 'Test Project',
          state: 'wellFormed',
          visibility: 'private'
        }
      ]
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockAzureResponse)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockAzureResponse)
      });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: 'test-project',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    // Make first call
    await POST(mockRequest);
    const firstCallData = mockJson.mock.calls[0][0];

    // Clear mocks and make second call
    mockJson.mockClear();
    await POST(mockRequest);
    const secondCallData = mockJson.mock.calls[0][0];

    // Data should be identical
    expect(firstCallData).toEqual(secondCallData);
  });
});
