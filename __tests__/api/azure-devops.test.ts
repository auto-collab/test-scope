import { NextRequest } from 'next/server';
import { POST } from '../../app/api/azure-devops/route';

// Mock NextResponse
const mockJson = jest.fn();
const mockNextResponse = {
  json: mockJson,
};

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
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: '',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: 'Missing required configuration fields' },
      { status: 400 }
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

  it('returns mock data for valid configuration', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: 'test-project',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith({
      projects: [
        {
          id: 'project1',
          name: 'E-Commerce Platform',
          description: 'Main e-commerce application with payment processing',
          state: 'wellFormed',
          visibility: 'private'
        },
        {
          id: 'project2',
          name: 'User Management Service',
          description: 'Microservice for user authentication and authorization',
          state: 'wellFormed',
          visibility: 'private'
        },
        {
          id: 'project3',
          name: 'Analytics Dashboard',
          description: 'Real-time analytics and reporting dashboard',
          state: 'wellFormed',
          visibility: 'private'
        }
      ]
    }, undefined);
  });

  it('handles JSON parsing errors', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
    } as unknown as NextRequest;

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      { error: 'Failed to connect to Azure DevOps' },
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
      { error: 'Failed to connect to Azure DevOps' },
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

  it('returns correct project structure in mock data', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        organization: 'test-org',
        project: 'test-project',
        personalAccessToken: 'test-token'
      })
    } as unknown as NextRequest;

    await POST(mockRequest);

    const callArgs = mockJson.mock.calls[0][0];
    expect(callArgs).toHaveProperty('projects');
    expect(Array.isArray(callArgs.projects)).toBe(true);
    expect(callArgs.projects).toHaveLength(3);

    // Check structure of first project
    const firstProject = callArgs.projects[0];
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

    // Should still return mock data successfully
    const callArgs = mockJson.mock.calls[0][0];
    expect(callArgs).toHaveProperty('projects');
    expect(callArgs.projects).toHaveLength(3);
  });

  it('returns consistent mock data across calls', async () => {
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
