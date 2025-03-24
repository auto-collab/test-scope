import { getTestResults } from './get-test-results/get-test-results-service';
import { getCodeCoverageResults } from './get-code-coverage-service';
import { GroupedTestResults } from '@/models/interfaces/test-results-response';
import { BuildCoverage } from 'azure-devops-node-api/interfaces/TestInterfaces';
import { getAzureWebClient } from './azure-web-client-service';

const webApi = getAzureWebClient();

export async function getApplicationTestScope(
  applicationName: string,
): Promise<Record<string, ApplicationTestCoverage>> {
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
            ?.codeCoverageResults || null,
      };
      return results;
    },
    {} as Record<string, ApplicationTestCoverage>,
  );
}

async function fetchCodeCoverageResultsForPipelines(pipelines: string[]) {
  return await Promise.all(
    pipelines.map(async (pipeline) => ({
      pipeline,
      codeCoverageResults: await getCodeCoverageResults(pipeline, webApi),
    })),
  );
}

async function fetchTestResultsForPipelines(pipelines: string[]) {
  return await Promise.all(
    pipelines.map(async (pipeline) => ({
      pipeline,
      testResults: await getTestResults(pipeline, webApi),
    })),
  );
}

function getAssociatedPipelines(_applicationName: string) {
  return ['pipeline1', 'pipeline2'];
}

// Interface for expected structure of pipeline test coverage results
export interface ApplicationTestCoverage {
  testResults: GroupedTestResults | null;
  codeCoverage: BuildCoverage[] | null;
}
