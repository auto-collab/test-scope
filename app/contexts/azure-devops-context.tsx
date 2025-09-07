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
        throw new Error('Azure DevOps service not initialized. Please configure your connection first.');
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