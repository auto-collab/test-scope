import { NextRequest, NextResponse } from 'next/server';

interface AzureDevOpsConfig {
  organization: string;
  project: string;
  personalAccessToken: string;
}

// This runs on the server side, so we can make direct API calls
export async function POST(request: NextRequest) {
  try {
    const { organization, project, personalAccessToken, endpoint } = await request.json();
    
    // Validate required fields
    if (!organization || !personalAccessToken) {
      return NextResponse.json(
        { error: 'Missing required configuration fields' },
        { status: 400 }
      );
    }

    // Use the provided endpoint or default to projects
    const apiEndpoint = endpoint || '/_apis/projects';
    const baseUrl = `https://dev.azure.com/${organization}`;
    
    const response = await fetch(`${baseUrl}${apiEndpoint}?api-version=7.2-preview.1`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`:${personalAccessToken}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Azure DevOps API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Azure DevOps API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Azure DevOps' },
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