'use-client';
import { ITestApi } from 'azure-devops-node-api/TestApi';
import { BuildCoverage } from 'azure-devops-node-api/interfaces/TestInterfaces';
import { getLatestBuildId } from './get-latest-build-service';
import { WebApi } from 'azure-devops-node-api';

export async function getCodeCoverageResults(
  pipeline: string,
  webApi: WebApi,
): Promise<BuildCoverage[] | undefined> {
  try {
    const buildId: number = await getLatestBuildId(pipeline, webApi);

    const testApi: ITestApi = await webApi.getTestApi();
    const codeCoverage: BuildCoverage[] = await testApi.getBuildCodeCoverage(
      'hagerty',
      buildId,
      2,
    );

    if (!codeCoverage) {
      console.error('Error: No code coverage found for build:', buildId);
      throw new Error('No test results found');
    }

    return codeCoverage;
  } catch (error: unknown) {
    console.error('Error occurred in getCodeCoverageResults:', error);
    throw new Error(
      'An unexpected error occurred: ${(error as Error).message}',
    );
  }
}

export interface CodeCoverageResults {}
