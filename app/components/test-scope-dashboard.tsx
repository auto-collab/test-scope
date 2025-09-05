"use client";

import React from 'react';
import MetricBox from './metric-box';
import { Application, PipelineSummary } from '../types/azure-devops';

interface TestScopeDashboardProps {
  application: Application;
}

export default function TestScopeDashboard({ application }: TestScopeDashboardProps) {
  const calculateOverallMetrics = () => {
    const totalPipelines = application.pipelines.length;
    const successfulPipelines = application.pipelines.filter(p => p.status === 'success').length;
    const failedPipelines = application.pipelines.filter(p => p.status === 'failed').length;
    const runningPipelines = application.pipelines.filter(p => p.status === 'running').length;

    const totalTests = application.pipelines.reduce((sum, p) => 
      sum + (p.testResults?.total || 0), 0
    );
    const passedTests = application.pipelines.reduce((sum, p) => 
      sum + (p.testResults?.passed || 0), 0
    );
    const failedTests = application.pipelines.reduce((sum, p) => 
      sum + (p.testResults?.failed || 0), 0
    );

    const avgCodeCoverage = application.pipelines.reduce((sum, p) => 
      sum + (p.codeCoverage?.lineCoverage || 0), 0
    ) / Math.max(totalPipelines, 1);

    const totalDuration = application.pipelines.reduce((sum, p) => 
      sum + (p.testResults?.duration || 0), 0
    );

    return {
      totalPipelines,
      successfulPipelines,
      failedPipelines,
      runningPipelines,
      totalTests,
      passedTests,
      failedTests,
      passRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      avgCodeCoverage,
      totalDuration
    };
  };

  const metrics = calculateOverallMetrics();

  const getHealthStatus = (): 'success' | 'warning' | 'error' => {
    if (metrics.failedPipelines > 0) return 'error';
    if (metrics.runningPipelines > 0 || metrics.passRate < 80) return 'warning';
    return 'success';
  };

  const getCoverageStatus = (coverage: number): 'success' | 'warning' | 'error' => {
    if (coverage >= 80) return 'success';
    if (coverage >= 60) return 'warning';
    return 'error';
  };

  const getPassRateStatus = (passRate: number): 'success' | 'warning' | 'error' => {
    if (passRate >= 90) return 'success';
    if (passRate >= 70) return 'warning';
    return 'error';
  };

  return (
    <div className="space-y-6">
      {/* Application Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{application.name}</h2>
            {application.description && (
              <p className="text-gray-600 mt-1">{application.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              application.overallHealth === 'healthy' 
                ? 'bg-green-100 text-green-800'
                : application.overallHealth === 'warning'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {application.overallHealth === 'healthy' ? '✓' : application.overallHealth === 'warning' ? '⚠' : '✗'}
              <span className="ml-1 capitalize">{application.overallHealth}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date(application.lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricBox
          title="Pipeline Health"
          value={`${metrics.successfulPipelines}/${metrics.totalPipelines}`}
          status={getHealthStatus()}
          subtitle="Successful pipelines"
        />
        <MetricBox
          title="Test Pass Rate"
          value={`${metrics.passRate.toFixed(1)}%`}
          status={getPassRateStatus(metrics.passRate)}
          subtitle={`${metrics.passedTests}/${metrics.totalTests} tests`}
        />
        <MetricBox
          title="Code Coverage"
          value={`${metrics.avgCodeCoverage.toFixed(1)}%`}
          status={getCoverageStatus(metrics.avgCodeCoverage)}
          subtitle="Average line coverage"
        />
        <MetricBox
          title="Total Tests"
          value={metrics.totalTests.toLocaleString()}
          status="info"
          subtitle={`${metrics.failedTests} failed`}
        />
      </div>

      {/* Pipeline Details */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Pipeline Details</h3>
        </div>
        <div className="p-6">
          {application.pipelines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pipelines found for this application.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {application.pipelines.map((pipeline) => (
                <PipelineCard key={pipeline.id} pipeline={pipeline} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PipelineCard({ pipeline }: { pipeline: PipelineSummary }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h4 className="font-medium text-gray-900">{pipeline.name}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}>
            {pipeline.status}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {pipeline.lastRun && 'finishTime' in pipeline.lastRun && pipeline.lastRun.finishTime
            ? new Date(pipeline.lastRun.finishTime).toLocaleString()
            : 'Never run'
          }
        </div>
      </div>
      
      {pipeline.testResults && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Tests:</span>
            <span className="ml-1 font-medium">{pipeline.testResults.total}</span>
          </div>
          <div>
            <span className="text-gray-500">Passed:</span>
            <span className="ml-1 font-medium text-green-600">{pipeline.testResults.passed}</span>
          </div>
          <div>
            <span className="text-gray-500">Failed:</span>
            <span className="ml-1 font-medium text-red-600">{pipeline.testResults.failed}</span>
          </div>
          <div>
            <span className="text-gray-500">Duration:</span>
            <span className="ml-1 font-medium">{pipeline.testResults.duration.toFixed(1)}m</span>
          </div>
        </div>
      )}

      {pipeline.codeCoverage && (
        <div className="mt-3 pt-3 border-t">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Line Coverage:</span>
              <span className="ml-1 font-medium">{pipeline.codeCoverage.lineCoverage.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-500">Branch Coverage:</span>
              <span className="ml-1 font-medium">{pipeline.codeCoverage.branchCoverage.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-500">Function Coverage:</span>
              <span className="ml-1 font-medium">{pipeline.codeCoverage.functionCoverage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
