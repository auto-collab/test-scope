import * as azDev from 'azure-devops-node-api';

// TODO: Research creating only one instance of client for app lifecycle
export function getAzureWebClient(): azDev.WebApi {
  const organizationName = process.env.NEXT_PUBLIC_ORG ?? '';
  const baseUrl = process.env.NEXT_PUBLIC_AZURE_BASE_URL ?? '';
  const token = process.env.NEXT_PUBLIC_AZURE_PAT ?? '';
  const orgUrl = baseUrl + organizationName;
  const authHandler = azDev.getPersonalAccessTokenHandler(token);
  return new azDev.WebApi(orgUrl, authHandler);
}
