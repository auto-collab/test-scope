import { IBuildApi } from 'azure-devops-node-api/BuildApi';
import { getAzureWebClient } from './azure/service/azure-web-client-service';
import { getTestResults } from './azure/service/test-results-service';
import { getCodeCoverageResults } from './azure/service/code-coverage-service';

export async function getTestScope(applicationName: string) {
  // Get all associated pipelines for application
  let pipelines = [];
  pipelines = getAssociatedPipelines(applicationName);

  for (let p in pipelines) {
    const testResults = getTestResults(p);
    const codeCoverage = getCodeCoverageResults(p);
  }
}

function getAssociatedPipelines(applicationName: string) {
  return ['pipeline1', 'pipeline2'];
}
