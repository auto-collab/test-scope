import { AzureDevOpsConfig } from '../types/azure-devops';

// Configuration for mapping logical applications to Azure DevOps pipelines
export interface ApplicationConfig {
  id: string;
  name: string;
  description?: string;
  projectId: string; // Azure DevOps project ID
  pipelines: PipelineConfig[];
}

export interface PipelineConfig {
  id: number; // Azure DevOps build definition ID
  name: string; // Display name for the pipeline
  type: 'build' | 'release';
  // Optional: specify which builds to include (latest, specific branch, etc.)
  buildFilter?: {
    branchName?: string;
    maxBuilds?: number; // How many recent builds to consider
  };
}

// ==================================================================================
// 🔧 CONFIGURATION: Update these values with your real Azure DevOps information
// ==================================================================================

export const APPLICATION_CONFIGS: ApplicationConfig[] = [
  {
    id: 'ecommerce-app',
    name: 'E-Commerce Platform',
    description: 'Main e-commerce application with payment processing',
    projectId: 'your-ecommerce-project-id', // 🔴 REPLACE: Get from Azure DevOps project URL
    pipelines: [
      {
        id: 123, // 🔴 REPLACE: Build Definition ID from Azure DevOps
        name: 'CI/CD Pipeline',
        type: 'build',
        buildFilter: {
          branchName: 'main',
          maxBuilds: 1 // Only get the latest build
        }
      },
      {
        id: 124, // 🔴 REPLACE: Build Definition ID from Azure DevOps
        name: 'Security Scan Pipeline',
        type: 'build',
        buildFilter: {
          maxBuilds: 1
        }
      }
    ]
  },
  {
    id: 'user-management',
    name: 'User Management Service',
    description: 'Microservice for user authentication and authorization',
    projectId: 'your-user-service-project-id', // 🔴 REPLACE: Get from Azure DevOps project URL
    pipelines: [
      {
        id: 125, // 🔴 REPLACE: Build Definition ID from Azure DevOps
        name: 'API Tests Pipeline',
        type: 'build',
        buildFilter: {
          branchName: 'main',
          maxBuilds: 1
        }
      }
    ]
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard',
    projectId: 'your-analytics-project-id', // 🔴 REPLACE: Get from Azure DevOps project URL
    pipelines: [
      {
        id: 126, // 🔴 REPLACE: Build Definition ID from Azure DevOps
        name: 'Frontend Build Pipeline',
        type: 'build'
      },
      {
        id: 127, // 🔴 REPLACE: Build Definition ID from Azure DevOps
        name: 'E2E Tests Pipeline',
        type: 'build'
      }
    ]
  }
];

// ==================================================================================
// 📋 HOW TO GET THE REQUIRED VALUES:
// ==================================================================================
// 
// 1. PROJECT ID:
//    - Go to your Azure DevOps organization
//    - Navigate to your project
//    - Look at the URL: https://dev.azure.com/{org}/{PROJECT_ID}/_build
//    - The PROJECT_ID is the name/ID in the URL
//
// 2. BUILD DEFINITION ID:
//    - Go to Pipelines in your Azure DevOps project
//    - Click on a pipeline
//    - Look at the URL: https://dev.azure.com/{org}/{project}/_build?definitionId={ID}
//    - The ID number is your build definition ID
//
// 3. BRANCH NAME:
//    - Specify which branch builds you want to monitor (usually 'main' or 'master')
//    - Leave undefined to get builds from all branches
//
// ==================================================================================

// Helper function to get application config by ID
export function getApplicationConfig(appId: string): ApplicationConfig | undefined {
  return APPLICATION_CONFIGS.find(config => config.id === appId);
}

// Helper function to validate that all required Azure DevOps data is available
export function validateApplicationConfigs(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  APPLICATION_CONFIGS.forEach(app => {
    if (!app.projectId || app.projectId.includes('your-')) {
      errors.push(`Application "${app.name}" has placeholder project ID. Please update with real Azure DevOps project ID.`);
    }
    
    app.pipelines.forEach(pipeline => {
      if (pipeline.id <= 200) { // Assuming real definition IDs are higher
        errors.push(`Pipeline "${pipeline.name}" in "${app.name}" has placeholder ID. Please update with real build definition ID.`);
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
