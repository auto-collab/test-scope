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
  name: string; // Pipeline name (used to find the build definition)
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
        name: 'CI/CD Pipeline', // ✅ Use exact pipeline name from Azure DevOps
        type: 'build',
        buildFilter: {
          branchName: 'main',
          maxBuilds: 1 // Only get the latest build
        }
      },
      {
        name: 'Security Scan Pipeline', // ✅ Use exact pipeline name from Azure DevOps
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
        name: 'API Tests Pipeline', // ✅ Use exact pipeline name from Azure DevOps
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
        name: 'Frontend Build Pipeline', // ✅ Use exact pipeline name from Azure DevOps
        type: 'build'
      },
      {
        name: 'E2E Tests Pipeline', // ✅ Use exact pipeline name from Azure DevOps
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
// 2. PIPELINE NAME:
//    - Go to Pipelines in your Azure DevOps project
//    - Copy the exact name of each pipeline you want to monitor
//    - The system will automatically find the pipeline ID and latest build
//    - Example: "CI/CD Pipeline", "Frontend Build", "E2E Tests"
//
// 3. BRANCH NAME (optional):
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
      if (!pipeline.name || pipeline.name.trim() === '') {
        errors.push(`Pipeline in "${app.name}" has empty name. Please provide the exact pipeline name from Azure DevOps.`);
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
