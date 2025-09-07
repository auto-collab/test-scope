"use client";

import React, { useState } from 'react';
import { TestResultsDetails } from '../types/azure-devops';

interface TestResultsDetailsProps {
  testResults: TestResultsDetails[];
}

export default function TestResultsDetailsComponent({ testResults }: TestResultsDetailsProps) {
  const [expandedAssemblies, setExpandedAssemblies] = useState<Set<string>>(new Set());
  const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());

  const toggleAssembly = (assembly: string) => {
    const newExpanded = new Set(expandedAssemblies);
    if (newExpanded.has(assembly)) {
      newExpanded.delete(assembly);
    } else {
      newExpanded.add(assembly);
    }
    setExpandedAssemblies(newExpanded);
  };

  const toggleTest = (testId: number) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedTests(newExpanded);
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'inconclusive': return 'text-yellow-600 bg-yellow-100';
      case 'timeout': return 'text-orange-600 bg-orange-100';
      case 'aborted': return 'text-gray-600 bg-gray-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'notExecuted': return 'text-gray-600 bg-gray-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'inProgress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (durationInMs: number) => {
    if (durationInMs < 1000) {
      return `${durationInMs}ms`;
    }
    return `${(durationInMs / 1000).toFixed(2)}s`;
  };

  if (!testResults || testResults.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No detailed test results available
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Test Results by Assembly</h4>
      
      {testResults.map((assembly) => {
        const isExpanded = expandedAssemblies.has(assembly.testAssembly);
        const passedTests = assembly.results.filter(r => r.outcome === 'passed').length;
        const failedTests = assembly.results.filter(r => r.outcome === 'failed').length;
        const otherTests = assembly.results.length - passedTests - failedTests;

        return (
          <div key={assembly.testAssembly} className="border border-gray-200 rounded-lg">
            {/* Assembly Header */}
            <div 
              className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleAssembly(assembly.testAssembly)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                  <div>
                    <h5 className="font-medium text-gray-900">{assembly.testAssembly}</h5>
                    <p className="text-xs text-gray-500">{assembly.testContainer}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {passedTests} passed
                  </span>
                  {failedTests > 0 && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                      {failedTests} failed
                    </span>
                  )}
                  {otherTests > 0 && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {otherTests} other
                    </span>
                  )}
                  <span className="text-gray-500">
                    ({assembly.totalCount} total)
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Test Results */}
            {isExpanded && (
              <div className="border-t border-gray-200">
                {assembly.results.map((test) => {
                  const isTestExpanded = expandedTests.has(test.id);
                  
                  return (
                    <div key={test.id} className="border-b border-gray-100 last:border-b-0">
                      {/* Test Header */}
                      <div 
                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => toggleTest(test.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <span className={`transform transition-transform text-xs ${isTestExpanded ? 'rotate-90' : ''}`}>
                              ▶
                            </span>
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-sm text-gray-900 truncate">
                                {test.testCaseTitle}
                              </h6>
                              <p className="text-xs text-gray-500 truncate">
                                {test.automatedTestName}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getOutcomeColor(test.outcome)}`}>
                              {test.outcome}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDuration(test.durationInMs)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Test Details */}
                      {isTestExpanded && (
                        <div className="px-6 pb-3 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                              <div className="space-y-2">
                                <div><strong className="text-gray-900">Test ID:</strong> <span className="text-gray-700">{test.id}</span></div>
                                <div><strong className="text-gray-900">Priority:</strong> <span className="text-gray-700">{test.priority}</span></div>
                                <div><strong className="text-gray-900">State:</strong> <span className="text-gray-700">{test.state}</span></div>
                                <div><strong className="text-gray-900">Started:</strong> <span className="text-gray-700">{new Date(test.startedDate).toLocaleString()}</span></div>
                                <div><strong className="text-gray-900">Completed:</strong> <span className="text-gray-700">{new Date(test.completedDate).toLocaleString()}</span></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="space-y-2">
                                <div><strong className="text-gray-900">Test Run:</strong> <span className="text-gray-700">{test.testRun.name} (#{test.testRun.id})</span></div>
                                <div><strong className="text-gray-900">Duration:</strong> <span className="text-gray-700">{formatDuration(test.durationInMs)}</span></div>
                                {test.testCaseReferenceId && (
                                  <div><strong className="text-gray-900">Reference ID:</strong> <span className="text-gray-700">{test.testCaseReferenceId}</span></div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Error Details */}
                          {test.errorMessage && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                              <h6 className="font-medium text-red-800 text-sm mb-1">Error Message:</h6>
                              <p className="text-red-700 text-sm mb-2">{test.errorMessage}</p>
                              
                              {test.stackTrace && (
                                <>
                                  <h6 className="font-medium text-red-800 text-sm mb-1">Stack Trace:</h6>
                                  <pre className="text-red-700 text-sm whitespace-pre-wrap font-mono bg-red-100 p-2 rounded">
                                    {test.stackTrace}
                                  </pre>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
