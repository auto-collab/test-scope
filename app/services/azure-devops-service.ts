import { 
  AzureDevOpsConfig, 
  Application, 
  PipelineSummary, 
  Build, 
  TestRun,
  TestResultsSummary,
  CodeCoverageSummary 
} from '../types/azure-devops';
import { ApplicationConfig, PipelineConfig } from '../config/applications';

export class AzureDevOpsService {
  private config: AzureDevOpsConfig;
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(config: AzureDevOpsConfig) {
    console.log('AzureDevOpsService constructor called with:', {
      organization: config.organization,
      project: config.project,
      hasToken: !!config.personalAccessToken
    });
    this.config = config;
    this.baseUrl = `https://dev.azure.com/${config.organization}`;
    this.headers = {
      'Authorization': `Basic ${Buffer.from(`:${config.personalAccessToken}`).toString('base64')}`,
      'Content-Type': 'application/json',
    };
    console.log('AzureDevOpsService initialized with baseUrl:', this.baseUrl);
  }

  getConfig(): AzureDevOpsConfig {
    return this.config;
  }

  private async fetchFromAzureDevOps(endpoint: string, retryCount: number = 0): Promise<any> {
    console.log('Service calling API route with:', { 
      organization: this.config.organization, 
      project: this.config.project, 
      endpoint,
      hasToken: !!this.config.personalAccessToken,
      retryCount
    });
    
    const requestBody = {
      ...this.config,
      endpoint: endpoint
    };
    
    console.log('Service sending request body:', JSON.stringify(requestBody, null, 2));
    
    // Add a small delay to avoid rate limiting (exponential backoff for retries)
    const delay = Math.min(100 * Math.pow(2, retryCount), 2000); // Max 2 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      // Use server-side API route instead of direct client-side calls
      const response = await fetch('/api/azure-devops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Service received response:', { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText
      });

      // Handle different HTTP status codes as per Azure DevOps API docs
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired Personal Access Token');
      } else if (response.status === 403) {
        throw new Error('Forbidden: Insufficient permissions for this resource');
      } else if (response.status === 404) {
        throw new Error('Not Found: The requested resource does not exist');
      } else if (response.status === 429) {
        // Rate limiting - retry with exponential backoff
        if (retryCount < 3) {
          console.log(`Rate limited, retrying in ${delay * 2}ms...`);
          return this.fetchFromAzureDevOps(endpoint, retryCount + 1);
        } else {
          throw new Error('Rate limited: Too many requests, please try again later');
        }
      } else if (!response.ok) {
        const errorText = await response.text();
        console.error('Service API error response:', errorText);
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Service received data:', { 
        hasValue: !!data.value, 
        valueLength: data.value?.length || 0 
      });
      return data;
      
    } catch (error) {
      // Retry on network errors or 5xx server errors
      if (retryCount < 3 && (
        error instanceof TypeError || // Network error
        (error instanceof Error && error.message.includes('5')) // 5xx errors
      )) {
        console.log(`Network/server error, retrying in ${delay * 2}ms...`);
        return this.fetchFromAzureDevOps(endpoint, retryCount + 1);
      }
      
      throw error;
    }
  }

  // Removed getBuildDefinitions to avoid rate limiting - we now search for specific pipelines only

  async findBuildDefinitionByName(projectId: string, pipelineName: string): Promise<any | null> {
    console.log(`Searching for pipeline: "${pipelineName}" in project: ${projectId}`);
    
    try {
      // First try the targeted search with name parameter (most efficient)
      console.log(`Trying targeted search for: "${pipelineName}"`);
      const targetedEndpoint = `/${projectId}/_apis/build/definitions?name=${encodeURIComponent(pipelineName)}&api-version=7.2-preview.1`;
      const targetedResponse = await this.fetchFromAzureDevOps(targetedEndpoint);
      const targetedDefinitions = targetedResponse.value || [];
      
      console.log(`Targeted search returned ${targetedDefinitions.length} definitions`);
      
      // Try exact match in targeted results first
      let found = targetedDefinitions.find((def: any) => def.name === pipelineName);
      
      if (found) {
        console.log(`✅ Found exact match via targeted search: "${found.name}" (ID: ${found.id})`);
        return found;
      }
      
      // Try case-insensitive match in targeted results
      found = targetedDefinitions.find((def: any) => def.name.toLowerCase() === pipelineName.toLowerCase());
      
      if (found) {
        console.log(`✅ Found case-insensitive match via targeted search: "${found.name}" (ID: ${found.id})`);
        return found;
      }
      
      // If targeted search returned some results, try partial matching on those
      if (targetedDefinitions.length > 0) {
        found = targetedDefinitions.find((def: any) => def.name.toLowerCase().includes(pipelineName.toLowerCase()));
        
        if (found) {
          console.log(`✅ Found partial match via targeted search: "${found.name}" (ID: ${found.id})`);
          return found;
        }
      }
      
      // Only if targeted search failed completely, fall back to getting all definitions
      console.log(`Targeted search failed, falling back to comprehensive search...`);
      const allEndpoint = `/${projectId}/_apis/build/definitions?api-version=7.2-preview.1`;
      const allResponse = await this.fetchFromAzureDevOps(allEndpoint);
      const allDefinitions = allResponse.value || [];
      
      console.log(`Comprehensive search returned ${allDefinitions.length} total definitions`);
      
      // Log all available pipeline names for debugging (only if we had to do comprehensive search)
      if (allDefinitions.length <= 20) { // Only log if reasonable number
        console.log('Available pipeline names:');
        allDefinitions.forEach((def: any, index: number) => {
          console.log(`  ${index + 1}. "${def.name}" (ID: ${def.id})`);
        });
      } else {
        console.log(`Found ${allDefinitions.length} pipelines (too many to list individually)`);
      }
      
      // Try exact match in all definitions
      found = allDefinitions.find((def: any) => def.name === pipelineName);
      
      if (found) {
        console.log(`✅ Found exact match in comprehensive search: "${found.name}" (ID: ${found.id})`);
        return found;
      }
      
      // Try case-insensitive match in all definitions
      found = allDefinitions.find((def: any) => def.name.toLowerCase() === pipelineName.toLowerCase());
      
      if (found) {
        console.log(`✅ Found case-insensitive match in comprehensive search: "${found.name}" (ID: ${found.id})`);
        return found;
      }
      
      // Try partial match in all definitions
      found = allDefinitions.find((def: any) => def.name.toLowerCase().includes(pipelineName.toLowerCase()));
      
      if (found) {
        console.log(`✅ Found partial match in comprehensive search: "${found.name}" (ID: ${found.id})`);
        return found;
      }
      
      // Try reverse partial match
      found = allDefinitions.find((def: any) => pipelineName.toLowerCase().includes(def.name.toLowerCase()));
      
      if (found) {
        console.log(`✅ Found reverse partial match in comprehensive search: "${found.name}" (ID: ${found.id})`);
        return found;
      }
      
      console.log(`❌ Pipeline "${pipelineName}" not found in any search method.`);
      if (allDefinitions.length <= 50) { // Only show names if reasonable number
        console.log(`Available pipeline names: ${allDefinitions.map((d: any) => d.name).join(', ')}`);
      } else {
        console.log(`Found ${allDefinitions.length} total pipelines - too many to list names`);
      }
      return null;
      
    } catch (error) {
      console.error(`Error searching for pipeline "${pipelineName}":`, error);
      return null;
    }
  }

  async getBuilds(projectId: string, definitionId: number, maxBuilds: number = 1): Promise<Build[]> {
    const endpoint = `/${projectId}/_apis/build/builds?definitions=${definitionId}&$top=${maxBuilds}`;
    const response = await this.fetchFromAzureDevOps(endpoint);
    const builds = response.value || [];
    
    console.log(`Found ${builds.length} builds for definition ${definitionId}:`);
    builds.forEach((build: any, index: number) => {
      console.log(`  ${index + 1}. Build ${build.id} - Status: ${build.status}, Result: ${build.result}`);
    });
    
    return builds;
  }

  async getTestRuns(projectId: string, buildId: number): Promise<TestRun[]> {
    const endpoint = `/${projectId}/_apis/test/runs?buildIds=${buildId}`;
    const response = await this.fetchFromAzureDevOps(endpoint);
    const testRuns = response.value || [];
    
    console.log(`Found ${testRuns.length} test runs for build ${buildId}:`);
    testRuns.forEach((run: any, index: number) => {
      console.log(`  ${index + 1}. Test Run ${run.id} - State: ${run.state}, Statistics: ${run.runStatistics?.length || 0} stats`);
    });
    
    return testRuns;
  }

  async getCodeCoverage(projectId: string, buildId: number): Promise<any> {
    try {
      // Use the correct Azure DevOps API endpoint for code coverage
      const endpoint = `/${projectId}/_apis/build/builds/${buildId}/coverage`;
      const response = await this.fetchFromAzureDevOps(endpoint);
      
      console.log(`Code coverage data for build ${buildId}:`, {
        hasCoverageData: !!response.coverageData,
        coverageDataLength: response.coverageData?.length || 0,
        hasError: !!response.lastError
      });
      
      return response;
    } catch (error) {
      // Code coverage might not be available for all builds
      console.warn(`Code coverage not available for build ${buildId}:`, error);
      return null;
    }
  }

  private calculateTestResultsSummary(testRuns: TestRun[]): TestResultsSummary | undefined {
    if (!testRuns.length) {
      console.log('No test runs provided for summary calculation');
      return undefined;
    }

    console.log(`Calculating test results summary from ${testRuns.length} test runs`);

    const totals = testRuns.reduce((acc, run) => {
      const stats = run.runStatistics || [];
      console.log(`Processing test run ${run.id} with ${stats.length} statistics`);
      
      stats.forEach(stat => {
        console.log(`  Stat: ${stat.outcome} - Count: ${stat.count}`);
        switch (stat.outcome) {
          case 'passed':
            acc.passed += stat.count;
            break;
          case 'failed':
            acc.failed += stat.count;
            break;
          case 'notExecuted':
          case 'blocked':
            acc.skipped += stat.count;
            break;
        }
        acc.total += stat.count;
      });

      return acc;
    }, { total: 0, passed: 0, failed: 0, skipped: 0 });

    const summary = {
      ...totals,
      passRate: totals.total > 0 ? (totals.passed / totals.total) * 100 : 0,
      duration: testRuns.reduce((sum, run) => {
        if (run.startedDate && run.completedDate) {
          const start = new Date(run.startedDate).getTime();
          const end = new Date(run.completedDate).getTime();
          return sum + ((end - start) / (1000 * 60)); // Convert to minutes
        }
        return sum;
      }, 0)
    };

    console.log('Test results summary calculated:', summary);
    return summary;
  }

  private parseCodeCoverage(coverageData: any): CodeCoverageSummary | undefined {
    if (!coverageData?.coverageData?.length) {
      console.log('No coverage data available');
      return undefined;
    }

    console.log('Parsing code coverage data:', {
      coverageDataLength: coverageData.coverageData.length,
      hasError: !!coverageData.lastError
    });

    try {
      const coverage = coverageData.coverageData[0];
      const stats = coverage.coverageStats || [];

      console.log(`Found ${stats.length} coverage statistics:`, stats.map((s: any) => `${s.label}: ${s.covered}/${s.total}`));

      const lineCoverage = stats.find((s: any) => s.label === 'Lines');
      const branchCoverage = stats.find((s: any) => s.label === 'Branches');
      const functionCoverage = stats.find((s: any) => s.label === 'Functions');

      if (!lineCoverage) {
        console.log('No line coverage data found');
        return undefined;
      }

      const summary = {
        lineCoverage: lineCoverage.covered > 0 ? (lineCoverage.covered / lineCoverage.total) * 100 : 0,
        branchCoverage: branchCoverage ? (branchCoverage.covered / branchCoverage.total) * 100 : 0,
        functionCoverage: functionCoverage ? (functionCoverage.covered / functionCoverage.total) * 100 : 0,
        totalLines: lineCoverage.total,
        coveredLines: lineCoverage.covered
      };

      console.log('Code coverage summary calculated:', summary);
      return summary;
    } catch (error) {
      console.warn('Failed to parse code coverage data:', error);
      return undefined;
    }
  }

  async fetchPipelineData(appConfig: ApplicationConfig, pipelineConfig: PipelineConfig): Promise<PipelineSummary> {
    console.log(`fetchPipelineData called for pipeline: ${pipelineConfig.name} in project: ${appConfig.projectId}`);
    try {
      // First, find the build definition by name (this will only search for the specific pipeline)
      const buildDefinition = await this.findBuildDefinitionByName(appConfig.projectId, pipelineConfig.name);
      
      if (!buildDefinition) {
        console.warn(`Pipeline "${pipelineConfig.name}" not found in project ${appConfig.projectId}`);
        return {
          id: 0,
          name: pipelineConfig.name,
          type: pipelineConfig.type,
          status: 'unknown',
          testResults: undefined,
          codeCoverage: undefined,
          qualityGates: []
        };
      }

      // Get recent builds for this pipeline
      const builds = await this.getBuilds(
        appConfig.projectId, 
        buildDefinition.id, 
        pipelineConfig.buildFilter?.maxBuilds || 1
      );

      if (!builds.length) {
        return {
          id: buildDefinition.id,
          name: pipelineConfig.name,
          type: pipelineConfig.type,
          status: 'unknown',
          testResults: undefined,
          codeCoverage: undefined,
          qualityGates: []
        };
      }

      const latestBuild = builds[0];
      
      // Fetch test runs and coverage data in parallel
      const [testRuns, coverageData] = await Promise.all([
        this.getTestRuns(appConfig.projectId, latestBuild.id),
        this.getCodeCoverage(appConfig.projectId, latestBuild.id)
      ]);

      // Process the data
      const testResults = this.calculateTestResultsSummary(testRuns);
      const codeCoverage = this.parseCodeCoverage(coverageData);

      // Determine pipeline status
      let status: PipelineSummary['status'] = 'unknown';
      if (latestBuild.status === 'completed') {
        status = latestBuild.result === 'succeeded' ? 'success' : 'failed';
      } else if (latestBuild.status === 'inProgress') {
        status = 'running';
      } else if (latestBuild.status === 'cancelling') {
        status = 'cancelled';
      }

      return {
        id: buildDefinition.id,
        name: pipelineConfig.name,
        type: pipelineConfig.type,
        status,
        lastRun: latestBuild,
        testResults,
        codeCoverage,
        qualityGates: [] // You can implement quality gates parsing if needed
      };

    } catch (error) {
      console.error(`Failed to fetch pipeline data for ${pipelineConfig.name}:`, error);
      
      // Return error state
      return {
        id: 0,
        name: pipelineConfig.name,
        type: pipelineConfig.type,
        status: 'unknown',
        testResults: undefined,
        codeCoverage: undefined,
        qualityGates: []
      };
    }
  }

  async fetchApplicationData(appConfig: ApplicationConfig): Promise<Application> {
    console.log(`fetchApplicationData called for: ${appConfig.name}`);
    try {
      // Fetch all pipeline data in parallel
      const pipelinePromises = appConfig.pipelines.map(pipelineConfig => 
        this.fetchPipelineData(appConfig, pipelineConfig)
      );

      const pipelines = await Promise.all(pipelinePromises);

      // Calculate overall health
      const failedPipelines = pipelines.filter(p => p.status === 'failed').length;
      const runningPipelines = pipelines.filter(p => p.status === 'running').length;
      
      let overallHealth: Application['overallHealth'] = 'healthy';
      if (failedPipelines > 0) {
        overallHealth = 'critical';
      } else if (runningPipelines > 0) {
        overallHealth = 'warning';
      }

      return {
        id: appConfig.id,
        name: appConfig.name,
        description: appConfig.description,
        pipelines,
        lastUpdated: new Date().toISOString(),
        overallHealth
      };

    } catch (error) {
      console.error(`Failed to fetch application data for ${appConfig.name}:`, error);
      throw error;
    }
  }
}
