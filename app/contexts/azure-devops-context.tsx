"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Application, AzureDevOpsConfig } from '../types/azure-devops';
import { APPLICATION_CONFIGS, validateApplicationConfigs } from '../config/applications';
import { AzureDevOpsService } from '../services/azure-devops-service';

interface AzureDevOpsContextType {
  applications: Application[];
  selectedApplication: Application | null;
  isLoading: boolean;
  error: string | null;
  setSelectedApplication: (app: Application | null) => void;
  refreshApplications: () => Promise<void>;
  initializeService: (config: AzureDevOpsConfig) => void;
}

const AzureDevOpsContext = createContext<AzureDevOpsContextType | undefined>(undefined);

export const useAzureDevOps = () => {
  const context = useContext(AzureDevOpsContext);
  if (!context) {
    throw new Error('useAzureDevOps must be used within an AzureDevOpsProvider');
  }
  return context;
};

interface AzureDevOpsProviderProps {
  children: ReactNode;
}

export const AzureDevOpsProvider: React.FC<AzureDevOpsProviderProps> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [azureDevOpsService, setAzureDevOpsService] = useState<AzureDevOpsService | null>(null);

  // Auto-initialize with environment variables on mount
  useEffect(() => {
    const initializeFromEnv = async () => {
      const org = process.env.NEXT_PUBLIC_AZURE_DEVOPS_ORG;
      const pat = process.env.NEXT_PUBLIC_AZURE_DEVOPS_PAT;
      const project = APPLICATION_CONFIGS[0]?.projectId; // Use first app's project ID
      
      console.log('Environment variables check:', { 
        org: org ? 'SET' : 'NOT SET', 
        pat: pat ? 'SET' : 'NOT SET', 
        project 
      });
      
      if (org && pat && project) {
        const config: AzureDevOpsConfig = {
          organization: org,
          project: project,
          personalAccessToken: pat
        };
        
        console.log('Auto-initializing with env vars:', { 
          organization: config.organization, 
          project: config.project,
          hasToken: !!config.personalAccessToken 
        });
        
        initializeService(config);
        await refreshApplications();
      } else {
        console.log('No environment variables found, showing configured apps only');
        // If no env vars, show configured applications without connection
        const configuredApps: Application[] = APPLICATION_CONFIGS.map(appConfig => ({
          id: appConfig.id,
          name: appConfig.name,
          description: appConfig.description,
          pipelines: [], // Empty for now, will be populated when connected
          lastUpdated: new Date().toISOString(),
          overallHealth: 'warning' as const
        }));
        
        setApplications(configuredApps);
        if (configuredApps.length > 0) {
          setSelectedApplication(configuredApps[0]);
        }
      }
    };
    
    initializeFromEnv();
  }, []);

  const initializeService = (config: AzureDevOpsConfig) => {
    try {
      // Validate the config
      if (!config.organization || !config.project || !config.personalAccessToken) {
        throw new Error('Missing required Azure DevOps configuration');
      }
      
      // Create the Azure DevOps service
      const service = new AzureDevOpsService(config);
      setAzureDevOpsService(service);
      
      // Validate application configurations
      const validation = validateApplicationConfigs();
      if (!validation.valid) {
        console.warn('Application configuration issues:', validation.errors);
        setError(`Configuration issues: ${validation.errors.join(', ')}`);
        return;
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize Azure DevOps service');
    }
  };

  const refreshApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!azureDevOpsService) {
        // If no service, just show the configured applications
        const configuredApps: Application[] = APPLICATION_CONFIGS.map(appConfig => ({
          id: appConfig.id,
          name: appConfig.name,
          description: appConfig.description,
          pipelines: [], // Empty for now, will be populated when connected
          lastUpdated: new Date().toISOString(),
          overallHealth: 'warning' as const
        }));
        
        setApplications(configuredApps);
        return;
      }

      // Fetch all applications from configuration
      const applicationPromises = APPLICATION_CONFIGS.map(appConfig => 
        azureDevOpsService.fetchApplicationData(appConfig)
      );

      const applications = await Promise.all(applicationPromises);

      setApplications(applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AzureDevOpsContextType = {
    applications,
    selectedApplication,
    isLoading,
    error,
    setSelectedApplication,
    refreshApplications,
    initializeService
  };

  return (
    <AzureDevOpsContext.Provider value={value}>
      {children}
    </AzureDevOpsContext.Provider>
  );
};