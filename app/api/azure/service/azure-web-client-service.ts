import * as azDev from 'azure-devops-node-api';

let azureWebClient: azDev.WebApi | null = null;

export function getAzureWebClient(): azDev.WebApi {
  if (!azureWebClient) {
    const organizationName = process.env.NEXT_PUBLIC_ORG ?? '';
    const baseUrl = process.env.NEXT_PUBLIC_AZURE_BASE_URL ?? '';
    const token = process.env.NEXT_PUBLIC_AZURE_PAT ?? '';
    const orgUrl = baseUrl + organizationName;
    const authHandler = azDev.getPersonalAccessTokenHandler(token);

    azureWebClient = new azDev.WebApi(orgUrl, authHandler);
  }
  return azureWebClient;
}
