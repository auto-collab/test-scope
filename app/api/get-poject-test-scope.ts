import { getTestResults } from './azure/service/test-results-service';
import { getCodeCoverageResults } from './azure/service/code-coverage-service';
import { GroupedTestResults } from '@/models/interfaces/test-results-response';
import { BuildCoverage } from 'azure-devops-node-api/interfaces/TestInterfaces';

export async function getTestScope(
  applicationName: string,
): Promise<Record<string, PipelineTestCoverage>> {
  const pipelines = getAssociatedPipelines(applicationName);

  const [testResultsArray, codeCoverageArray] = await Promise.all([
    fetchTestResultsForPipelines(pipelines),
    fetchCodeCoverageResultsForPipelines(pipelines),
  ]);

  return pipelines.reduce(
    (results, pipeline) => {
      results[pipeline] = {
        testResults:
          testResultsArray.find((r) => r.pipeline === pipeline)?.testResults ||
          null,
        codeCoverage:
          codeCoverageArray.find((c) => c.pipeline === pipeline)
            ?.codeCoverage || null,
      };
      return results;
    },
    {} as Record<string, PipelineTestCoverage>,
  );
}

async function fetchTestResultsForPipelines(pipelines: string[]) {
  return Promise.all(
    pipelines.map(async (pipeline) => ({
      pipeline,
      testResults: await getTestResults(pipeline),
    })),
  );
}

async function fetchCodeCoverageResultsForPipelines(pipelines: string[]) {
  return Promise.all(
    pipelines.map(async (pipeline) => ({
      pipeline,
      codeCoverage: await getCodeCoverageResults(pipeline),
    })),
  );
}

function getAssociatedPipelines(applicationName: string) {
  return ['pipeline1', 'pipeline2'];
}

// Interface for expected structure of pipeline test coverage results
export interface PipelineTestCoverage {
  testResults: GroupedTestResults | null;
  codeCoverage: BuildCoverage[] | null;
}
