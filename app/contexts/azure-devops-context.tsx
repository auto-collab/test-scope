"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Application, AzureDevOpsConfig } from '../types/azure-devops';

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

  const initializeService = (config: AzureDevOpsConfig) => {
    try {
      // For demo purposes, just validate the config
      if (!config.organization || !config.project || !config.personalAccessToken) {
        throw new Error('Invalid configuration');
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock applications with realistic pipeline data
      const mockApplications: Application[] = [
        {
          id: 'app1',
          name: 'E-Commerce Platform',
          description: 'Main e-commerce application with payment processing',
          pipelines: [
            {
              id: 1,
              name: 'CI/CD Pipeline',
              type: 'build',
              status: 'success',
              lastRun: {
                id: 12345,
                buildNumber: '2024.1.15.1',
                status: 'completed',
                result: 'succeeded',
                queueTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                startTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
                finishTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
                sourceBranch: 'main',
                sourceVersion: 'abc123def456',
                definition: {} as any,
                repository: {} as any,
                requestedBy: {} as any,
                requestedFor: {} as any,
                lastChangedBy: {} as any,
                lastChangedDate: new Date().toISOString(),
                keepForever: false,
                retainIndefinitely: false,
                hasDiagnostics: false,
                definitionRevision: 1,
                queue: {} as any,
                tags: []
              },
              testResults: {
                total: 245,
                passed: 238,
                failed: 3,
                skipped: 4,
                passRate: 97.1,
                duration: 12.5
              },
              codeCoverage: {
                lineCoverage: 87.3,
                branchCoverage: 82.1,
                functionCoverage: 91.7,
                totalLines: 15420,
                coveredLines: 13452
              },
              qualityGates: [
                { name: 'Code Coverage', status: 'passed', threshold: 80, actual: 87.3, unit: '%' },
                { name: 'Test Pass Rate', status: 'passed', threshold: 95, actual: 97.1, unit: '%' },
                { name: 'Build Time', status: 'passed', threshold: 20, actual: 15, unit: 'min' }
              ]
            },
            {
              id: 2,
              name: 'Security Scan Pipeline',
              type: 'build',
              status: 'success',
              lastRun: {
                id: 12346,
                buildNumber: '2024.1.15.2',
                status: 'completed',
                result: 'succeeded',
                queueTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                startTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
                finishTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString(),
                sourceBranch: 'main',
                sourceVersion: 'abc123def456',
                definition: {} as any,
                repository: {} as any,
                requestedBy: {} as any,
                requestedFor: {} as any,
                lastChangedBy: {} as any,
                lastChangedDate: new Date().toISOString(),
                keepForever: false,
                retainIndefinitely: false,
                hasDiagnostics: false,
                definitionRevision: 1,
                queue: {} as any,
                tags: []
              },
              testResults: {
                total: 89,
                passed: 89,
                failed: 0,
                skipped: 0,
                passRate: 100,
                duration: 6.2
              },
              codeCoverage: {
                lineCoverage: 92.1,
                branchCoverage: 88.7,
                functionCoverage: 94.3,
                totalLines: 3240,
                coveredLines: 2984
              },
              qualityGates: [
                { name: 'Security Score', status: 'passed', threshold: 90, actual: 94, unit: 'points' },
                { name: 'Vulnerability Count', status: 'passed', threshold: 0, actual: 0, unit: 'issues' }
              ]
            }
          ],
          lastUpdated: new Date().toISOString(),
          overallHealth: 'healthy'
        },
        {
          id: 'app2',
          name: 'User Management Service',
          description: 'Microservice for user authentication and authorization',
          pipelines: [
            {
              id: 3,
              name: 'API Tests Pipeline',
              type: 'build',
              status: 'failed',
              lastRun: {
                id: 12347,
                buildNumber: '2024.1.15.3',
                status: 'completed',
                result: 'partiallySucceeded',
                queueTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                startTime: new Date(Date.now() - 1 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
                finishTime: new Date(Date.now() - 1 * 60 * 60 * 1000 + 18 * 60 * 1000).toISOString(),
                sourceBranch: 'feature/auth-improvements',
                sourceVersion: 'def456ghi789',
                definition: {} as any,
                repository: {} as any,
                requestedBy: {} as any,
                requestedFor: {} as any,
                lastChangedBy: {} as any,
                lastChangedDate: new Date().toISOString(),
                keepForever: false,
                retainIndefinitely: false,
                hasDiagnostics: false,
                definitionRevision: 1,
                queue: {} as any,
                tags: []
              },
              testResults: {
                total: 156,
                passed: 142,
                failed: 8,
                skipped: 6,
                passRate: 91.0,
                duration: 15.3
              },
              codeCoverage: {
                lineCoverage: 78.9,
                branchCoverage: 74.2,
                functionCoverage: 83.6,
                totalLines: 8920,
                coveredLines: 7040
              },
              qualityGates: [
                { name: 'Code Coverage', status: 'warning', threshold: 80, actual: 78.9, unit: '%' },
                { name: 'Test Pass Rate', status: 'passed', threshold: 90, actual: 91.0, unit: '%' },
                { name: 'Performance Tests', status: 'failed', threshold: 95, actual: 87, unit: '%' }
              ]
            }
          ],
          lastUpdated: new Date().toISOString(),
          overallHealth: 'warning'
        },
        {
          id: 'app3',
          name: 'Analytics Dashboard',
          description: 'Real-time analytics and reporting dashboard',
          pipelines: [
            {
              id: 4,
              name: 'Frontend Build Pipeline',
              type: 'build',
              status: 'failed',
              lastRun: {
                id: 12348,
                buildNumber: '2024.1.15.4',
                status: 'completed',
                result: 'failed',
                queueTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                startTime: new Date(Date.now() - 30 * 60 * 1000 + 1 * 60 * 1000).toISOString(),
                finishTime: new Date(Date.now() - 30 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
                sourceBranch: 'hotfix/chart-rendering',
                sourceVersion: 'ghi789jkl012',
                definition: {} as any,
                repository: {} as any,
                requestedBy: {} as any,
                requestedFor: {} as any,
                lastChangedBy: {} as any,
                lastChangedDate: new Date().toISOString(),
                keepForever: false,
                retainIndefinitely: false,
                hasDiagnostics: false,
                definitionRevision: 1,
                queue: {} as any,
                tags: []
              },
              testResults: {
                total: 78,
                passed: 45,
                failed: 28,
                skipped: 5,
                passRate: 57.7,
                duration: 4.1
              },
              codeCoverage: {
                lineCoverage: 65.4,
                branchCoverage: 58.9,
                functionCoverage: 71.2,
                totalLines: 4560,
                coveredLines: 2982
              },
              qualityGates: [
                { name: 'Code Coverage', status: 'failed', threshold: 80, actual: 65.4, unit: '%' },
                { name: 'Test Pass Rate', status: 'failed', threshold: 90, actual: 57.7, unit: '%' },
                { name: 'Lint Errors', status: 'failed', threshold: 0, actual: 12, unit: 'errors' }
              ]
            },
            {
              id: 5,
              name: 'E2E Tests Pipeline',
              type: 'build',
              status: 'running',
              lastRun: {
                id: 12349,
                buildNumber: '2024.1.15.5',
                status: 'inProgress',
                result: 'none',
                queueTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
                startTime: new Date(Date.now() - 10 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
                finishTime: undefined,
                sourceBranch: 'hotfix/chart-rendering',
                sourceVersion: 'ghi789jkl012',
                definition: {} as any,
                repository: {} as any,
                requestedBy: {} as any,
                requestedFor: {} as any,
                lastChangedBy: {} as any,
                lastChangedDate: new Date().toISOString(),
                keepForever: false,
                retainIndefinitely: false,
                hasDiagnostics: false,
                definitionRevision: 1,
                queue: {} as any,
                tags: []
              },
              testResults: {
                total: 0,
                passed: 0,
                failed: 0,
                skipped: 0,
                passRate: 0,
                duration: 0
              },
              codeCoverage: undefined,
              qualityGates: []
            }
          ],
          lastUpdated: new Date().toISOString(),
          overallHealth: 'critical'
        }
      ];

      setApplications(mockApplications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with demo data on mount
  useEffect(() => {
    // Only run on client side to avoid hydration issues
    if (typeof window === 'undefined') return;
    
    const demoConfig: AzureDevOpsConfig = {
      organization: 'your-org',
      project: 'your-project',
      personalAccessToken: 'your-token'
    };
    initializeService(demoConfig);
    // Load mock data after component mounts
    refreshApplications();
  }, []);

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
