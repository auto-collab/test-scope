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
// 🔧 CONFIGURATION: Define your applications and their associated pipelines
// ==================================================================================
// 
// Each application represents a logical grouping of pipelines that work together.
// All pipelines are in the same Azure DevOps project, but grouped conceptually
// by application for better organization and monitoring.
//
// Example: If you have an "E-Commerce App" that has both a "Build Pipeline" and 
// "Test Pipeline", you would group them under one application to see combined results.

// 🔴 REPLACE: Your single Azure DevOps project ID (all pipelines are in this project)
const AZURE_DEVOPS_PROJECT_ID = 'your-project-id';

export const APPLICATION_CONFIGS: ApplicationConfig[] = [
  {
    id: 'ecommerce-app',
    name: 'E-Commerce Platform',
    description: 'Main e-commerce application with payment processing',
    projectId: AZURE_DEVOPS_PROJECT_ID,
    pipelines: [
      {
        name: 'CI/CD Pipeline', // ✅ Pipeline name from Azure DevOps
        type: 'build',
        buildFilter: {
          branchName: 'main',
          maxBuilds: 1 // Only get the latest build results
        }
      },
      {
        name: 'Security Scan Pipeline', // ✅ Another pipeline for this app
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
    projectId: AZURE_DEVOPS_PROJECT_ID,
    pipelines: [
      {
        name: 'API Tests Pipeline', // ✅ Pipeline that runs tests for this service
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
    projectId: AZURE_DEVOPS_PROJECT_ID,
    pipelines: [
      {
        name: 'Frontend Build Pipeline', // ✅ Pipeline that builds the frontend
        type: 'build'
      },
      {
        name: 'E2E Tests Pipeline', // ✅ Pipeline that runs end-to-end tests
        type: 'build'
      }
    ]
  }
];

// ==================================================================================
// 📋 HOW TO CONFIGURE YOUR APPLICATIONS:
// ==================================================================================
// 
// 1. SET YOUR AZURE DEVOPS PROJECT ID:
//    - Replace 'your-project-id' with your actual Azure DevOps project name
//    - All pipelines are in this single project
//
// 2. CREATE YOUR APPLICATIONS (conceptual groupings):
//    - Give each a unique ID (e.g., 'my-app', 'frontend-service')
//    - Add descriptive names and descriptions
//    - Group related pipelines together logically
//
// 3. ADD PIPELINES TO EACH APPLICATION:
//    - Go to Pipelines in your Azure DevOps project
//    - Copy the exact name of each pipeline you want to monitor
//    - The system will fetch the latest test results and coverage from these pipelines
//    - Example: "Build Pipeline", "Unit Tests", "E2E Tests", "Security Scan"
//
// 4. CONFIGURE BRANCH FILTERING (optional):
//    - Specify which branch builds you want to monitor (usually 'main' or 'master')
//    - Leave undefined to get builds from all branches
//
// EXAMPLE WORKFLOW:
// 1. Your CI/CD triggers → Pipeline runs → Tests execute → Results published
// 2. This dashboard fetches those results → Shows QA metrics → You see the status
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
