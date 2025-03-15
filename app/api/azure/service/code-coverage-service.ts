'use-client';
import { IBuildApi } from 'azure-devops-node-api/BuildApi';
import { getAzureWebClient } from './azure-web-client-service';
import { ITestApi } from 'azure-devops-node-api/TestApi';
import { BuildCoverage } from 'azure-devops-node-api/interfaces/TestInterfaces';

export async function getCodeCoverageResults(
  pipeline: string,
): Promise<BuildCoverage[] | undefined> {
  try {
    const connection = getAzureWebClient();

    const buildApi: IBuildApi = await connection.getBuildApi();
    const buildResponse = await buildApi.getLatestBuild(
      'hagerty',
      pipeline,
      'main', // Assumes Github Flow based deployment where the main branch is always deployable to production
    );
    const buildId = buildResponse.id ?? 0;

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
