'use-client';
import { IBuildApi } from 'azure-devops-node-api/BuildApi';
import { getAzureWebClient } from './azure-web-client-service';
import { WebApi } from 'azure-devops-node-api';

export async function getLatestBuildId(
  pipeline: string,
  webApi: WebApi,
): Promise<number> {
  try {
    const buildApi: IBuildApi = await webApi.getBuildApi();
    const buildResponse = await buildApi.getLatestBuild(
      'hagerty',
      pipeline,
      'main', // Assumes Github Flow based deployment where the main branch is always deployable to production
    );
    return buildResponse.id ?? 0;
  } catch (error: unknown) {
    console.error('Error occurred in getLatestBuildId:', error);
    throw new Error(
      `An unexpected error occurred: ${(error as Error).message}`,
    );
  }
}
