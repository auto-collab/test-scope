import * as azDev from 'azure-devops-node-api';

export function createAzureWebClient(): azDev.WebApi {
  const organizationName = process.env.NEXT_PUBLIC_ORG ?? '';
  const baseUrl = process.env.NEXT_PUBLIC_AZURE_BASE_URL ?? '';
  const token = process.env.NEXT_PUBLIC_AZURE_PAT ?? '';
  const orgUrl = baseUrl + organizationName;
  const authHandler = azDev.getPersonalAccessTokenHandler(token);

  return new azDev.WebApi(orgUrl, authHandler);
}

// Singleton instance
let azureWebClient: azDev.WebApi | null = null;

export function getAzureWebClient(): azDev.WebApi {
  if (!azureWebClient) {
    azureWebClient = createAzureWebClient();
  }
  return azureWebClient;
}

// ✅ Add this function to reset the singleton
export function resetAzureWebClient() {
  azureWebClient = null;
}
