// Azure DevOps API Type Definitions
// These interfaces model the data structures returned by Azure DevOps REST API
// Enhanced to work with the official azure-devops-node-api SDK

export interface AzureDevOpsConfig {
  organization: string;
  project: string;
  personalAccessToken: string;
}

// Enhanced configuration for SDK usage
export interface AzureDevOpsSDKConfig extends AzureDevOpsConfig {
  apiVersion?: string;
  timeout?: number;
  retryCount?: number;
}

// API Request/Response types for the new SDK-based approach
export interface ApiRequest {
  organization: string;
  project: string;
  personalAccessToken: string;
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  parameters?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  value?: T[];
  count?: number;
  data?: T;
  error?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  state: 'wellFormed' | 'createPending' | 'deleted' | 'new' | 'all';
  visibility: 'private' | 'public';
  url?: string;
  lastUpdateTime?: string;
  capabilities?: Record<string, unknown>;
  defaultTeam?: TeamReference;
}

export interface TeamReference {
  id: string;
  name: string;
  url: string;
}

export interface BuildDefinition {
  id: number;
  name: string;
  path: string;
  type: 'build' | 'xaml';
  quality: 'definition' | 'draft';
  queueStatus: 'enabled' | 'paused' | 'disabled';
  buildNumberFormat?: string;
  process?: Record<string, unknown>; // Process definition varies by type
  repository?: Repository;
  triggers?: BuildTrigger[];
}

export interface Repository {
  id: string;
  name: string;
  type: 'TfsGit' | 'TfsVersionControl' | 'Git' | 'GitHub' | 'Svn' | 'Bitbucket';
  url: string;
  defaultBranch?: string;
}

export interface BuildTrigger {
  triggerType: 'none' | 'continuousIntegration' | 'batchedContinuousIntegration' | 'schedule' | 'gatedCheckIn' | 'buildCompletion' | 'pullRequest';
}

export interface Build {
  id: number;
  buildNumber: string;
  status: 'none' | 'inProgress' | 'completed' | 'cancelling' | 'postponed' | 'notStarted' | 'all';
  result: 'none' | 'succeeded' | 'partiallySucceeded' | 'failed' | 'cancelled';
  queueTime: string;
  startTime?: string;
  finishTime?: string;
  sourceBranch: string;
  sourceVersion: string;
  definition: BuildDefinition;
  repository: Repository;
  requestedBy: IdentityRef;
  requestedFor: IdentityRef;
  lastChangedBy: IdentityRef;
  lastChangedDate: string;
  parameters?: string;
  logs?: BuildLogReference;
  buildNumberRevision?: number;
  keepForever: boolean;
  retainIndefinitely: boolean;
  hasDiagnostics: boolean;
  definitionRevision: number;
  queue: AgentPoolQueue;
  orchestrationPlan?: TaskOrchestrationPlanReference;
  plans?: TaskOrchestrationPlanReference[];
  timeline?: TimelineReference;
  artifacts?: BuildArtifact[];
  _links?: Record<string, unknown>;
  properties?: Record<string, unknown>;
  tags: string[];
  triggeredBy?: BuildTrigger;
  triggerInfo?: Record<string, unknown>;
  validationResults?: BuildRequestValidationResult[];
}

export interface IdentityRef {
  id: string;
  displayName: string;
  uniqueName: string;
  url: string;
  imageUrl?: string;
  descriptor?: string;
}

export interface AgentPoolQueue {
  id: number;
  name: string;
  pool?: TaskAgentPoolReference;
}

export interface TaskAgentPoolReference {
  id: number;
  name: string;
  isHosted: boolean;
}

export interface TaskOrchestrationPlanReference {
  planId: string;
  orchestrationType: number;
}

export interface TimelineReference {
  id: string;
  changeId: number;
  lastChangedBy: IdentityRef;
  lastChangedOn: string;
  location?: string;
}

export interface BuildArtifact {
  id: number;
  name: string;
  source: string;
  resource?: ArtifactResource;
}

export interface ArtifactResource {
  data: string;
  downloadUrl: string;
  properties?: Record<string, unknown>;
  type: string;
  url: string;
}

export interface BuildRequestValidationResult {
  result: 'ok' | 'warning' | 'error';
  message: string;
}

export interface BuildLogReference {
  id: number;
  type: 'container' | 'file';
  url: string;
  downloadUrl?: string;
}

// Test Results and Coverage
export interface TestRun {
  id: number;
  name: string;
  url: string;
  isAutomated: boolean;
  iteration: string;
  owner: IdentityRef;
  project: Project;
  startedDate: string;
  completedDate?: string;
  state: 'unspecified' | 'notStarted' | 'inProgress' | 'completed' | 'aborted' | 'waiting' | 'needsInvestigation';
  plan?: TestPlanReference;
  build?: BuildReference;
  buildConfiguration?: BuildConfiguration;
  release?: ReleaseReference;
  releaseEnvironmentUri?: string;
  releaseDefinition?: ReleaseDefinitionReference;
  releaseUri?: string;
  releaseEnvironmentId?: number;
  runStatistics?: RunStatistic[];
}

export interface TestPlanReference {
  id: number;
  name: string;
}

export interface BuildReference {
  id: number;
  name: string;
  branchName?: string;
  definitionId?: number;
}

export interface BuildConfiguration {
  id: number;
  number: string;
  uri: string;
  buildDefinitionId: number;
  dateCreated: string;
  sourceBranch: string;
  sourceVersion: string;
  status: 'none' | 'inProgress' | 'completed' | 'cancelling' | 'postponed' | 'notStarted' | 'all';
  quality: 'definition' | 'draft';
  queueStatus: 'enabled' | 'paused' | 'disabled';
  priority: 'low' | 'normal' | 'high';
  startTime?: string;
  finishTime?: string;
  lastChangedBy: IdentityRef;
  lastChangedDate: string;
  parameters?: string;
  orchestrationPlan?: TaskOrchestrationPlanReference;
  logs?: BuildLogReference;
  repository?: Repository;
  keepForever: boolean;
  retainIndefinitely: boolean;
  triggeredBy?: BuildTrigger;
  triggerInfo?: Record<string, unknown>;
  validationResults?: BuildRequestValidationResult[];
  plans?: TaskOrchestrationPlanReference[];
  timeline?: TimelineReference;
  artifacts?: BuildArtifact[];
  _links?: Record<string, unknown>;
  properties?: Record<string, unknown>;
  tags: string[];
  queue?: AgentPoolQueue;
  buildNumberRevision?: number;
  hasDiagnostics: boolean;
  definitionRevision: number;
}

export interface ReleaseReference {
  id: number;
  name: string;
  environmentId?: number;
  environmentName?: string;
  environmentUri?: string;
  definitionId?: number;
  definitionName?: string;
  definitionUri?: string;
  description?: string;
  reason?: 'none' | 'manual' | 'continuousIntegration' | 'schedule' | 'pullRequest' | 'buildCompletion' | 'resourceTrigger' | 'other';
  releaseDefinition?: ReleaseDefinitionReference;
  releaseDefinitionUri?: string;
  isDeleted?: boolean;
  artifacts?: ReleaseArtifact[];
  variables?: Record<string, unknown>;
  variableGroups?: Record<string, unknown>;
  preDeployApprovals?: Record<string, unknown>;
  postDeployApprovals?: Record<string, unknown>;
  gates?: Record<string, unknown>;
  environments?: Record<string, unknown>;
  createdOn?: string;
  modifiedOn?: string;
  createdBy?: IdentityRef;
  modifiedBy?: IdentityRef;
  createdFor?: IdentityRef;
  projectReference?: ProjectReference;
  _links?: Record<string, unknown>;
  properties?: Record<string, unknown>;
  tags?: string[];
  releaseNameFormat?: string;
  keepForever?: boolean;
  retentionPolicy?: Record<string, unknown>;
  releaseDefinitionRevision?: number;
}

export interface ReleaseDefinitionReference {
  id: number;
  name: string;
  path?: string;
  source?: string;
  revision?: number;
  description?: string;
  createdBy?: IdentityRef;
  createdOn?: string;
  modifiedBy?: IdentityRef;
  modifiedOn?: string;
  isDeleted?: boolean;
  variableGroups?: Record<string, unknown>;
  releaseDefinitionRevision?: number;
}

export interface ReleaseArtifact {
  sourceId: string;
  type: string;
  alias?: string;
  definitionReference?: Record<string, unknown>;
  isPrimary?: boolean;
  isRetained?: boolean;
}

export interface ProjectReference {
  id: string;
  name: string;
  description?: string;
  url?: string;
  state?: 'wellFormed' | 'createPending' | 'deleted' | 'new' | 'all';
  visibility?: 'private' | 'public';
}

export interface RunStatistic {
  state: 'unspecified' | 'notStarted' | 'inProgress' | 'completed' | 'aborted' | 'waiting' | 'needsInvestigation';
  outcome: 'unspecified' | 'none' | 'passed' | 'failed' | 'inconclusive' | 'timeout' | 'aborted' | 'blocked' | 'notExecuted' | 'warning' | 'error' | 'notApplicable' | 'paused' | 'inProgress' | 'notImpacted';
  count: number;
}

// Code Coverage
export interface CodeCoverageData {
  coverageData: CoverageData[];
  coverageFileUrl?: string;
  lastError?: string;
  buildPlatform?: string;
  buildFlavor?: string;
  buildConfigurationId?: number;
  buildNumber?: string;
}

export interface CoverageData {
  coverageStats: CoverageStatistics[];
  deltaBuildId?: number;
  status?: 'none' | 'inProgress' | 'completed' | 'finalized' | 'pending' | 'updateRequestQueued' | 'updateRequestInProgress' | 'updateRequestFailed' | 'updateRequestTimedOut' | 'updateRequestAbandoned' | 'updateRequestBadRequest' | 'updateRequestNotFound' | 'updateRequestNotAuthorized' | 'updateRequestNotSupported' | 'updateRequestConflict' | 'updateRequestThrottled' | 'updateRequestServiceUnavailable';
  errorMessage?: string;
}

export interface CoverageStatistics {
  label: string;
  position: number;
  total: number;
  covered: number;
  isDeltaAvailable?: boolean;
}

// Dashboard-specific types
export interface Application {
  id: string;
  name: string;
  description?: string;
  pipelines: PipelineSummary[];
  lastUpdated: string;
  overallHealth: 'healthy' | 'warning' | 'critical';
}

export interface PipelineSummary {
  id: number;
  name: string;
  type: 'build' | 'release';
  lastRun?: Build | TestRun;
  status: 'success' | 'failed' | 'running' | 'cancelled' | 'unknown';
  testResults?: TestResultsSummary;
  codeCoverage?: CodeCoverageSummary;
  qualityGates?: QualityGateSummary[];
  detailedTestResults?: TestResultsDetails[];
}

export interface TestResultsSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
  duration: number; // in minutes
}

export interface CodeCoverageSummary {
  lineCoverage: number; // percentage
  branchCoverage: number; // percentage
  functionCoverage: number; // percentage
  totalLines: number;
  coveredLines: number;
}

export interface QualityGateSummary {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  threshold: number;
  actual: number;
  unit: string;
}

// Detailed Test Results - Based on Azure DevOps REST API
export interface TestResult {
  id: number;
  testCaseTitle: string;
  automatedTestName: string;
  testCaseReferenceId?: number;
  outcome: 'passed' | 'failed' | 'inconclusive' | 'timeout' | 'aborted' | 'blocked' | 'notExecuted' | 'warning' | 'error' | 'notApplicable' | 'paused' | 'inProgress' | 'notImpacted';
  state: 'pending' | 'queued' | 'inProgress' | 'paused' | 'completed';
  priority: number;
  errorMessage?: string;
  stackTrace?: string;
  durationInMs: number;
  startedDate: string;
  completedDate: string;
  testRun: {
    id: number;
    name: string;
  };
  owner?: IdentityRef;
  runBy?: IdentityRef;
  lastUpdatedBy?: IdentityRef;
  lastUpdatedDate?: string;
  associatedBugs?: unknown[];
  customFields?: unknown[];
}

export interface TestResultsDetails {
  results: TestResult[];
  totalCount: number;
  testAssembly: string;
  testContainer: string;
}

// Enhanced error handling types for SDK integration
export interface AzureDevOpsError {
  code: string;
  message: string;
  typeKey: string;
  typeName: string;
  innerException?: unknown;
  stackTrace?: string;
}

export interface ApiErrorResponse {
  error: AzureDevOpsError;
  statusCode: number;
  statusText: string;
}

// SDK-specific types for better integration
export interface SDKConnectionConfig {
  orgUrl: string;
  authHandler: unknown; // azdev.getPersonalAccessTokenHandler result
  connection: unknown; // azdev.WebApi instance
}

// Enhanced service method return types
export interface ServiceResult<T> {
  data?: T;
  error?: string;
  success: boolean;
  timestamp: string;
}

// Rate limiting and retry configuration
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}
