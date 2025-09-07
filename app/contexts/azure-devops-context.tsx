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

  // Debug: Watch for service state changes and auto-refresh when service becomes available
  useEffect(() => {
    console.log('Azure DevOps service state changed:', azureDevOpsService ? 'SERVICE AVAILABLE' : 'NO SERVICE');
    
    // If service becomes available and we have applications configured, refresh them
    if (azureDevOpsService && applications.length > 0 && applications[0].pipelines.length === 0) {
      console.log('Service became available, refreshing applications...');
      refreshApplications();
    }
  }, [azureDevOpsService]);

  // Show configured applications immediately, then try to auto-connect
  useEffect(() => {
    const initializeFromEnv = async () => {
      // Always show configured apps first to avoid hydration issues
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

      // Then try to auto-connect if environment variables are available
      const org = process.env.NEXT_PUBLIC_AZURE_DEVOPS_ORG;
      const pat = process.env.NEXT_PUBLIC_AZURE_DEVOPS_PAT;
      const project = process.env.NEXT_PUBLIC_AZURE_DEVOPS_PROJECT;
      
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
        
        console.log('Calling initializeService...');
        initializeService(config);
        console.log('Service initialization started, will auto-refresh when service is ready');
      } else {
        console.log('No environment variables found, showing configured apps only');
      }
    };
    
    initializeFromEnv();
  }, []);

  const initializeService = (config: AzureDevOpsConfig) => {
    console.log('initializeService called with config:', config);
    try {
      // Validate the config
      if (!config.organization || !config.project || !config.personalAccessToken) {
        console.error('Missing required Azure DevOps configuration:', {
          hasOrg: !!config.organization,
          hasProject: !!config.project,
          hasToken: !!config.personalAccessToken
        });
        throw new Error('Missing required Azure DevOps configuration');
      }
      
      // Create the Azure DevOps service
      console.log('Creating Azure DevOps service with config:', config);
      const service = new AzureDevOpsService(config);
      console.log('Service instance created:', service);
      setAzureDevOpsService(service);
      console.log('Service state set, current service:', azureDevOpsService);
      
      // Validate application configurations (only warn if we don't have env vars)
      const validation = validateApplicationConfigs();
      if (!validation.valid) {
        console.warn('Application configuration issues:', validation.errors);
        // Only set error if we don't have environment variables to override
        if (!config.organization || !config.project || !config.personalAccessToken) {
          setError(`Configuration issues: ${validation.errors.join(', ')}`);
          return;
        } else {
          console.log('Using environment variables to override config validation');
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error in initializeService:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Azure DevOps service');
    }
  };

  const refreshApplications = async () => {
    console.log('refreshApplications called');
    setIsLoading(true);
    setError(null);

    try {
      if (!azureDevOpsService) {
        console.log('No Azure DevOps service available, showing configured apps only');
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

      console.log('Azure DevOps service available, fetching real data...');

      // Fetch all applications from configuration, using the real project ID from the service
      const realProjectId = azureDevOpsService.getConfig().project;
      console.log('Using real project ID for applications:', realProjectId);
      
      const applicationPromises = APPLICATION_CONFIGS.map(appConfig => {
        // Override the projectId with the real one from environment variables
        const realAppConfig = {
          ...appConfig,
          projectId: realProjectId
        };
        console.log(`Fetching data for application: ${appConfig.name} with project: ${realProjectId}`);
        return azureDevOpsService.fetchApplicationData(realAppConfig);
      });

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
