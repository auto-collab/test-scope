import { NextRequest, NextResponse } from 'next/server';
import * as azdev from 'azure-devops-node-api';
import * as ba from 'azure-devops-node-api/BuildApi';
import * as ca from 'azure-devops-node-api/CoreApi';
import * as ta from 'azure-devops-node-api/TestApi';

interface ApiRequest {
  organization: string;
  project: string;
  personalAccessToken: string;
  endpoint: string;
  method?: string;
  parameters?: Record<string, unknown>;
}

// This runs on the server side, so we can make direct API calls using the official SDK
export async function POST(request: NextRequest) {
  try {
    let organization, project, personalAccessToken, endpoint, method, parameters;
    
    try {
      // Try to parse as JSON first (for tests and direct calls)
      const data: ApiRequest = await request.json();
      console.log('API Route received raw data:', data);
      ({ organization, project, personalAccessToken, endpoint, method, parameters } = data);
      console.log('API Route extracted values:', { 
        organization, 
        project, 
        hasToken: !!personalAccessToken, 
        endpoint,
        method,
        hasParameters: !!parameters
      });
    } catch {
      // Fallback to text parsing (for debugging)
      const rawBody = await request.text();
      console.log('API Route received raw body:', rawBody);
      const parsed = JSON.parse(rawBody);
      console.log('API Route parsed JSON:', parsed);
      ({ organization, project, personalAccessToken, endpoint, method, parameters } = parsed);
      console.log('API Route extracted from text:', { 
        organization, 
        project, 
        hasToken: !!personalAccessToken, 
        endpoint,
        method,
        hasParameters: !!parameters
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

    // Create Azure DevOps connection using the official SDK
    const orgUrl = `https://dev.azure.com/${organization}`;
    const authHandler = azdev.getPersonalAccessTokenHandler(personalAccessToken);
    const connection = new azdev.WebApi(orgUrl, authHandler);

    console.log('=== AZURE DEVOPS SDK CALL ===');
    console.log('Organization:', organization);
    console.log('Project:', project);
    console.log('Endpoint:', endpoint);
    console.log('Method:', method || 'GET');
    console.log('Has PAT:', !!personalAccessToken);
    console.log('==============================');

    // Route to appropriate API client based on endpoint
    let result;
    
    if (endpoint.includes('/_apis/projects')) {
      // Core API - Projects
      const coreApi: ca.ICoreApi = await connection.getCoreApi();
      result = await coreApi.getProjects();
    } else if (endpoint.includes('/_apis/build/definitions')) {
      // Build API - Definitions
      const buildApi: ba.IBuildApi = await connection.getBuildApi();
      result = await buildApi.getDefinitions(project);
    } else if (endpoint.includes('/_apis/build/builds')) {
      // Build API - Builds
      const buildApi: ba.IBuildApi = await connection.getBuildApi();
      if (method === 'GET' && parameters?.definitionId) {
        result = await buildApi.getBuilds(project, [parameters.definitionId]);
      } else {
        result = await buildApi.getBuilds(project);
      }
    } else if (endpoint.includes('/_apis/test/runs')) {
      // Test API - Test Runs
      const testApi: ta.ITestApi = await connection.getTestApi();
      result = await testApi.getTestRuns(project);
    } else if (endpoint.includes('/_apis/test/results')) {
      // Test API - Test Results
      const testApi: ta.ITestApi = await connection.getTestApi();
      if (parameters?.runId) {
        result = await testApi.getTestResults(project, parameters.runId);
      } else {
        // Get test results for all test runs in the project
        const testRuns = await testApi.getTestRuns(project);
        if (testRuns && testRuns.length > 0) {
          const latestRun = testRuns[0];
          result = await testApi.getTestResults(project, latestRun.id);
        } else {
          result = { value: [] };
        }
      }
    } else {
      // Fallback to generic REST API call for unsupported endpoints
      console.log('Using fallback REST API call for endpoint:', endpoint);
      const apiVersion = endpoint.includes('/_apis/build/definitions') ? '7.2-preview.1' : '7.2';
      const fullUrl = `${orgUrl}${endpoint}?api-version=${apiVersion}`;
      
      const response = await fetch(fullUrl, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`:${personalAccessToken}`).toString('base64')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Azure DevOps API error response:', errorText);
        throw new Error(`Azure DevOps API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      result = await response.json();
    }

    console.log('Successfully fetched data using SDK:', { 
      hasValue: !!result.value, 
      valueLength: result.value?.length || 0,
      resultType: typeof result
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Azure DevOps SDK error:', error);
    return NextResponse.json(
      { error: `Failed to connect to Azure DevOps: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Legacy functions removed - now using Azure DevOps SDK