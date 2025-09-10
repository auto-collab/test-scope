// import { AzureDevOpsConfig } from '../types/azure-devops'; // Unused in this file

// Configuration for mapping logical applications to Azure DevOps pipelines
export interface ApplicationConfig {
  id: string;
  name: string;
  description?: string;
  projectId: string; // Azure DevOps project ID
  pipelines: PipelineConfig[];
}

export interface PipelineConfig {
  definitionId: number; // Azure DevOps build definition ID (unique identifier)
  name: string; // Pipeline name (for display purposes)
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
const AZURE_DEVOPS_PROJECT_ID = process.env.NEXT_PUBLIC_AZURE_DEVOPS_PROJECT || 'your-actual-project-name';

export const APPLICATION_CONFIGS: ApplicationConfig[] = [
  {
    id: 'ecommerce-app',
    name: 'E-Commerce Platform',
    description: 'Main e-commerce application with payment processing',
    projectId: AZURE_DEVOPS_PROJECT_ID,
    pipelines: [
      {
        definitionId: 123, // 🔴 REPLACE: Your actual build definition ID
        name: 'CI/CD Pipeline', // Display name
        type: 'build',
        buildFilter: {
          branchName: 'main',
          maxBuilds: 1 // Only get the latest build results
        }
      },
      {
        definitionId: 456, // 🔴 REPLACE: Your actual build definition ID
        name: 'Security Scan Pipeline', // Display name
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
        definitionId: 789, // 🔴 REPLACE: Your actual build definition ID
        name: 'API Tests Pipeline', // Display name
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
        definitionId: 101, // 🔴 REPLACE: Your actual build definition ID
        name: 'Frontend Build Pipeline', // Display name
        type: 'build'
      },
      {
        definitionId: 102, // 🔴 REPLACE: Your actual build definition ID
        name: 'E2E Tests Pipeline', // Display name
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
//    - Click on each pipeline you want to monitor
//    - Copy the Definition ID from the URL (e.g., /build/definitions/123)
//    - Replace the placeholder definitionId values below with your actual IDs
//    - The name field is just for display - you can customize it
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
      if (!pipeline.definitionId || pipeline.definitionId <= 0) {
        errors.push(`Pipeline in "${app.name}" has invalid definitionId. Please provide the actual build definition ID from Azure DevOps.`);
      }
      if (!pipeline.name || pipeline.name.trim() === '') {
        errors.push(`Pipeline in "${app.name}" has empty name. Please provide a display name for the pipeline.`);
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
