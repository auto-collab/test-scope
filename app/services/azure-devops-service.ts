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
    this.config = config;
    this.baseUrl = `https://dev.azure.com/${config.organization}`;
    this.headers = {
      'Authorization': `Basic ${Buffer.from(`:${config.personalAccessToken}`).toString('base64')}`,
      'Content-Type': 'application/json',
    };
  }

  private async fetchFromAzureDevOps(endpoint: string): Promise<any> {
    // Use server-side API route instead of direct client-side calls
    const response = await fetch('/api/azure-devops', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...this.config,
        endpoint: endpoint
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${response.status} ${errorData.error || response.statusText}`);
    }

    return await response.json();
  }

  async getBuildDefinitions(projectId: string): Promise<any[]> {
    const endpoint = `/${projectId}/_apis/build/definitions`;
    const response = await this.fetchFromAzureDevOps(endpoint);
    return response.value || [];
  }

  async findBuildDefinitionByName(projectId: string, pipelineName: string): Promise<any | null> {
    const definitions = await this.getBuildDefinitions(projectId);
    return definitions.find(def => def.name === pipelineName) || null;
  }

  async getBuilds(projectId: string, definitionId: number, maxBuilds: number = 1): Promise<Build[]> {
    const endpoint = `/${projectId}/_apis/build/builds?definitions=${definitionId}&$top=${maxBuilds}`;
    const response = await this.fetchFromAzureDevOps(endpoint);
    return response.value || [];
  }

  async getTestRuns(projectId: string, buildId: number): Promise<TestRun[]> {
    const endpoint = `/${projectId}/_apis/test/runs?buildIds=${buildId}`;
    const response = await this.fetchFromAzureDevOps(endpoint);
    return response.value || [];
  }

  async getCodeCoverage(projectId: string, buildId: number): Promise<any> {
    try {
      const endpoint = `/${projectId}/_apis/test/CodeCoverage?buildId=${buildId}`;
      const response = await this.fetchFromAzureDevOps(endpoint);
      return response;
    } catch (error) {
      // Code coverage might not be available for all builds
      console.warn(`Code coverage not available for build ${buildId}:`, error);
      return null;
    }
  }

  private calculateTestResultsSummary(testRuns: TestRun[]): TestResultsSummary | undefined {
    if (!testRuns.length) return undefined;

    const totals = testRuns.reduce((acc, run) => {
      const stats = run.runStatistics || [];
      
      stats.forEach(stat => {
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

    return {
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
  }

  private parseCodeCoverage(coverageData: any): CodeCoverageSummary | undefined {
    if (!coverageData?.coverageData?.length) return undefined;

    try {
      const coverage = coverageData.coverageData[0];
      const stats = coverage.coverageStats || [];

      const lineCoverage = stats.find((s: any) => s.label === 'Lines');
      const branchCoverage = stats.find((s: any) => s.label === 'Branches');
      const functionCoverage = stats.find((s: any) => s.label === 'Functions');

      if (!lineCoverage) return undefined;

      return {
        lineCoverage: lineCoverage.covered > 0 ? (lineCoverage.covered / lineCoverage.total) * 100 : 0,
        branchCoverage: branchCoverage ? (branchCoverage.covered / branchCoverage.total) * 100 : 0,
        functionCoverage: functionCoverage ? (functionCoverage.covered / functionCoverage.total) * 100 : 0,
        totalLines: lineCoverage.total,
        coveredLines: lineCoverage.covered
      };
    } catch (error) {
      console.warn('Failed to parse code coverage data:', error);
      return undefined;
    }
  }

  async fetchPipelineData(appConfig: ApplicationConfig, pipelineConfig: PipelineConfig): Promise<PipelineSummary> {
    try {
      // First, find the build definition by name
      const buildDefinition = await this.findBuildDefinitionByName(appConfig.projectId, pipelineConfig.name);
      
      if (!buildDefinition) {
        console.warn(`Pipeline "${pipelineConfig.name}" not found in project ${appConfig.projectId}`);
        return {
          id: 0, // Will be set to actual ID if found
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
