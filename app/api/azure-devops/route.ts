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

// This runs on the server side and uses the official Azure DevOps Node.js SDK
// All Azure DevOps API interactions go through the SDK, not direct HTTP calls
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

    // Create Azure DevOps connection using the official Azure DevOps Node.js SDK
    // This ensures we use the official package instead of making direct HTTP calls
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
      // Unsupported endpoint - return error instead of making direct HTTP calls
      console.log('Unsupported endpoint, using Azure DevOps SDK only:', endpoint);
      throw new Error(`Unsupported Azure DevOps endpoint: ${endpoint}. Only SDK-supported endpoints are allowed.`);
    }

    // Handle different response types from the Azure DevOps SDK
    const hasValue = 'value' in result && Array.isArray((result as any).value);
    const hasValues = 'values' in result && Array.isArray((result as any).values);
    const isArray = Array.isArray(result);
    
    console.log('Successfully fetched data using Azure DevOps SDK:', { 
      hasValue,
      hasValues,
      isArray,
      valueLength: hasValue ? (result as any).value.length : hasValues ? (result as any).values.length : isArray ? result.length : 0,
      resultType: typeof result
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Azure DevOps SDK error:', error);
    return NextResponse.json(
      { error: `Failed to connect to Azure DevOps using SDK: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// All Azure DevOps API interactions now use the official azure-devops-node-api package
// No direct HTTP calls to Azure DevOps endpoints are made