import { getTestResults } from './azure/service/test-results-service';
import { getCodeCoverageResults } from './azure/service/code-coverage-service';
import { GroupedTestResults } from '@/models/interfaces/test-results-response';

export async function getTestScope(applicationName: string) {
  // Get all associated pipelines for application
  let pipelines = [];
  pipelines = getAssociatedPipelines(applicationName);

  const testResultsPromises = pipelines.map((pipeline) =>
    getTestResults(pipeline),
  );
  const codeCoverageResultsPromises = pipelines.map((pipeline) =>
    getCodeCoverageResults(pipeline),
  );

  const testResults = await Promise.all(testResultsPromises);
  const codeCoverageResults = await Promise.all(codeCoverageResultsPromises);

  //Prevents errors caused by undefined or null values
  // If an API call fails and returns undefined, .filter(Boolean) removes it.

  return {
    testResults: testResults.filter(Boolean) as GroupedTestResults[],
  };
}

function getAssociatedPipelines(applicationName: string) {
  return ['pipeline1', 'pipeline2'];
}
