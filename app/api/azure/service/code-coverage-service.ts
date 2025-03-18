'use-client';
import { getAzureWebClient } from './azure-web-client-service';
import { ITestApi } from 'azure-devops-node-api/TestApi';
import { BuildCoverage } from 'azure-devops-node-api/interfaces/TestInterfaces';
import { getLatestBuildId } from './latest-build-service';

export async function getCodeCoverageResults(
  pipeline: string,
): Promise<BuildCoverage[] | undefined> {
  try {
    const connection = getAzureWebClient();

    const buildId: number = await getLatestBuildId(pipeline);

    const testApi: ITestApi = await connection.getTestApi();
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
