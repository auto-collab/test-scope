import { NextRequest, NextResponse } from 'next/server';

interface AzureDevOpsConfig {
  organization: string;
  project: string;
  personalAccessToken: string;
}

// This runs on the server side, so we can make direct API calls
export async function POST(request: NextRequest) {
  try {
    let organization, project, personalAccessToken, endpoint;
    
    try {
      // Try to parse as JSON first (for tests and direct calls)
      const data = await request.json();
      console.log('API Route received raw data:', data);
      ({ organization, project, personalAccessToken, endpoint } = data);
      console.log('API Route extracted values:', { 
        organization, 
        project, 
        hasToken: !!personalAccessToken, 
        endpoint 
      });
    } catch (jsonError) {
      // Fallback to text parsing (for debugging)
      const rawBody = await request.text();
      console.log('API Route received raw body:', rawBody);
      const parsed = JSON.parse(rawBody);
      console.log('API Route parsed JSON:', parsed);
      ({ organization, project, personalAccessToken, endpoint } = parsed);
      console.log('API Route extracted from text:', { 
        organization, 
        project, 
        hasToken: !!personalAccessToken, 
        endpoint 
      });
    }
    
    // Validate required fields
    if (!organization || !personalAccessToken) {
      console.log('Missing required fields:', { organization, hasToken: !!personalAccessToken });
      return NextResponse.json(
        { error: 'Missing required configuration fields' },
        { status: 400 }
      );
    }

    // Use the provided endpoint or default to projects
    const apiEndpoint = endpoint || '/_apis/projects';
    const baseUrl = `https://dev.azure.com/${organization}`;
    const fullUrl = `${baseUrl}${apiEndpoint}?api-version=7.2-preview.1`;
    
    console.log('Making request to:', fullUrl);
    
    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`:${personalAccessToken}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure DevOps API error response:', errorText);
      throw new Error(`Azure DevOps API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched data:', { 
      hasValue: !!data.value, 
      valueLength: data.value?.length || 0 
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Azure DevOps API error:', error);
    return NextResponse.json(
      { error: `Failed to connect to Azure DevOps: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Example of how to make real Azure DevOps REST API calls
async function fetchFromAzureDevOps(config: AzureDevOpsConfig, endpoint: string) {
  const baseUrl = `https://dev.azure.com/${config.organization}`;
  const apiVersion = 'api-version=7.2-preview.1';
  
  const response = await fetch(`${baseUrl}${endpoint}?${apiVersion}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(`:${config.personalAccessToken}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Azure DevOps API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Example functions for real Azure DevOps integration:
export async function getProjects(config: AzureDevOpsConfig) {
  return fetchFromAzureDevOps(config, '/_apis/projects');
}

export async function getBuildDefinitions(config: AzureDevOpsConfig, projectId: string) {
  return fetchFromAzureDevOps(config, `/${projectId}/_apis/build/definitions`);
}

export async function getBuilds(config: AzureDevOpsConfig, projectId: string, definitionId?: number) {
  const definitionFilter = definitionId ? `&definitions=${definitionId}` : '';
  return fetchFromAzureDevOps(config, `/${projectId}/_apis/build/builds${definitionFilter}`);
}

export async function getTestRuns(config: AzureDevOpsConfig, projectId: string, buildId?: number) {
  const buildFilter = buildId ? `&buildIds=${buildId}` : '';
  return fetchFromAzureDevOps(config, `/${projectId}/_apis/test/runs${buildFilter}`);
}

export async function getCodeCoverage(config: AzureDevOpsConfig, projectId: string, buildId: number) {
  return fetchFromAzureDevOps(config, `/${projectId}/_apis/build/builds/${buildId}/coverage`);
}