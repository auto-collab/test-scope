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
    // Note: baseUrl and headers are kept for compatibility but not used for direct API calls
    // All Azure DevOps interactions go through the API route which uses the official SDK
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

  private async fetchFromAzureDevOps(endpoint: string, method: string = 'GET', parameters?: Record<string, unknown>, retryCount: number = 0): Promise<unknown> {
    console.log('Service calling API route with:', { 
      organization: this.config.organization, 
      project: this.config.project, 
      endpoint,
      method,
      hasToken: !!this.config.personalAccessToken,
      retryCount
    });
    
    const requestBody = {
      ...this.config,
      endpoint: endpoint,
      method: method,
      parameters: parameters
    };
    
    console.log('Service sending request body:', JSON.stringify(requestBody, null, 2));
    
    // Add a small delay to avoid rate limiting (exponential backoff for retries)
    const delay = Math.min(100 * Math.pow(2, retryCount), 2000); // Max 2 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      // Use server-side API route that uses the Azure DevOps SDK
      // This ensures we use the official package instead of direct HTTP calls
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
          return this.fetchFromAzureDevOps(endpoint, method, parameters, retryCount + 1);
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
        return this.fetchFromAzureDevOps(endpoint, method, parameters, retryCount + 1);
      }
      
      throw error;
    }
  }

  // All methods use the Azure DevOps Node.js SDK through the API route
  // No direct HTTP calls to Azure DevOps are made from this service
  
  async getProjects(): Promise<unknown[]> {
    const endpoint = '/_apis/projects';
    const response = await this.fetchFromAzureDevOps(endpoint) as { value?: unknown[] };
    const projects = response.value || [];
    
    console.log(`Found ${projects.length} projects:`);
    projects.forEach((project: unknown, index: number) => {
      const p = project as { name?: string; id?: string; state?: string };
      console.log(`  ${index + 1}. Project ${p.name} (${p.id}) - State: ${p.state}`);
    });
    
    return projects;
  }

  async getBuildDefinitions(projectId: string): Promise<unknown[]> {
    const endpoint = `/${projectId}/_apis/build/definitions`;
    const response = await this.fetchFromAzureDevOps(endpoint) as { value?: unknown[] };
    const definitions = response.value || [];
    
    console.log(`Found ${definitions.length} build definitions for project ${projectId}:`);
    definitions.forEach((def: unknown, index: number) => {
      const d = def as { name?: string; id?: number; type?: string };
      console.log(`  ${index + 1}. Definition ${d.name} (${d.id}) - Type: ${d.type}`);
    });
    
    return definitions;
  }

  async getBuilds(projectId: string, definitionId: number, maxBuilds: number = 1): Promise<Build[]> {
    const endpoint = `/${projectId}/_apis/build/builds`;
    const parameters = {
      definitionId: definitionId,
      maxBuilds: maxBuilds
    };
    const response = await this.fetchFromAzureDevOps(endpoint, 'GET', parameters) as { value?: Build[] };
    const builds = response.value || [];
    
    console.log(`Found ${builds.length} builds for definition ${definitionId}:`);
    builds.forEach((build: Build, index: number) => {
      console.log(`  ${index + 1}. Build ${build.id} - Status: ${build.status}, Result: ${build.result}`);
    });
    
    return builds;
  }

  async getTestRuns(projectId: string, buildId: number): Promise<TestRun[]> {
    const endpoint = `/${projectId}/_apis/test/runs`;
    const parameters = {
      buildId: buildId
    };
    const response = await this.fetchFromAzureDevOps(endpoint, 'GET', parameters) as { value?: TestRun[] };
    const testRuns = response.value || [];
    
    console.log(`Found ${testRuns.length} test runs for build ${buildId}:`);
    testRuns.forEach((run: TestRun, index: number) => {
      console.log(`  ${index + 1}. Test Run ${run.id} - State: ${run.state}, Statistics: ${run.runStatistics?.length || 0} stats`);
    });
    
    return testRuns;
  }

  async getCodeCoverage(projectId: string, buildId: number): Promise<unknown> {
    try {
      // Use the correct Azure DevOps API endpoint for code coverage
      const endpoint = `/${projectId}/_apis/build/builds/${buildId}/coverage`;
      const response = await this.fetchFromAzureDevOps(endpoint) as { coverageData?: unknown[]; lastError?: string };
      
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

  private parseCodeCoverage(coverageData: unknown): CodeCoverageSummary | undefined {
    const data = coverageData as { coverageData?: Array<{ coverageStats?: Array<{ label: string; covered: number; total: number }> }>; lastError?: string };
    
    if (!data?.coverageData?.length) {
      console.log('No coverage data available');
      return undefined;
    }

    console.log('Parsing code coverage data:', {
      coverageDataLength: data.coverageData.length,
      hasError: !!data.lastError
    });

    try {
      const coverage = data.coverageData[0];
      const stats = coverage.coverageStats || [];

      console.log(`Found ${stats.length} coverage statistics:`, stats.map((s) => `${s.label}: ${s.covered}/${s.total}`));

      const lineCoverage = stats.find((s) => s.label === 'Lines');
      const branchCoverage = stats.find((s) => s.label === 'Branches');
      const functionCoverage = stats.find((s) => s.label === 'Functions');

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
    console.log(`fetchPipelineData called for pipeline: ${pipelineConfig.name} (ID: ${pipelineConfig.definitionId}) in project: ${appConfig.projectId}`);
    try {
      // Use the definition ID directly - no need to search
      console.log(`Using definition ID: ${pipelineConfig.definitionId} for pipeline: ${pipelineConfig.name}`);

      // Get recent builds for this pipeline using the definition ID
      const builds = await this.getBuilds(
        appConfig.projectId, 
        pipelineConfig.definitionId, 
        pipelineConfig.buildFilter?.maxBuilds || 1
      );

      if (!builds.length) {
        return {
          id: pipelineConfig.definitionId,
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
        id: pipelineConfig.definitionId,
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
        id: pipelineConfig.definitionId,
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
