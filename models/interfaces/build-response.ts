export interface Build {
  _links?: ReferenceLinks;
  agentSpecification?: AgentSpecification;
  appendCommitMessageToRunName?: boolean;
  buildNumber?: string;
  buildNumberRevision?: number;
  controller?: BuildController;
  definition?: DefinitionReference;
  deleted?: boolean;
  deletedBy?: IdentityRef;
  deletedDate?: string;
  deletedReason?: string;
  demands?: Demand[];
  finishTime?: string;
  id?: number;
  lastChangedBy?: IdentityRef;
  lastChangedDate?: string;
  logs?: BuildLogReference;
  orchestrationPlan?: TaskOrchestrationPlanReference;
  parameters?: string;
  plans?: TaskOrchestrationPlanReference[];
  project?: TeamProjectReference;
  properties?: PropertiesCollection;
  quality?: string;
  queue?: AgentPoolQueue;
  queueOptions?: QueueOptions;
  queuePosition?: number;
  queueTime?: string;
  reason?: BuildReason;
  repository?: BuildRepository;
  requestedBy?: IdentityRef;
  requestedFor?: IdentityRef;
  result?: BuildResult;
  retainedByRelease?: boolean;
  sourceBranch?: string;
  sourceVersion?: string;
  startTime?: string;
  status?: BuildStatus;
  tags?: string[];
  templateParameters?: object;
  triggerInfo?: object;
  triggeredByBuild?: Build;
  uri?: string;
  url?: string;
  validationResults?: BuildRequestValidationResult[];
}

interface ReferenceLinks {
  links: object;
}

interface AgentSpecification {
  identifier: string;
}

interface BuildController {
  id: number;
  name: string;
  status: string;
  createdDate: string;
  updatedDate: string;
  uri: string;
  url: string;
}

interface DefinitionReference {
  id: number;
  name: string;
  path: string;
  project: TeamProjectReference;
  queueStatus: string;
  revision: number;
  type: string;
  uri: string;
  url: string;
}

interface IdentityRef {
  id: string;
  displayName: string;
  uniqueName?: string;
  url?: string;
  _links?: ReferenceLinks;
}

interface Demand {
  name: string;
  value: string;
}

interface BuildLogReference {
  id: number;
  type: string;
  url: string;
}

interface TaskOrchestrationPlanReference {
  orchestrationType: number;
  planId: string;
}

interface TeamProjectReference {
  id: string;
  name: string;
  description?: string;
  revision: number;
  state: string;
  visibility: string;
  url: string;
}

interface PropertiesCollection {
  count: number;
  keys: string[];
  values: string[];
}

interface AgentPoolQueue {
  id: number;
  name: string;
  isHosted: boolean;
}

interface QueueOptions {
  doNotRun: string;
  none: string;
}

interface BuildReason {
  reason: string;
}

interface BuildRepository {
  id: string;
  name: string;
  type: string;
  url: string;
  defaultBranch: string;
  checkoutSubmodules: boolean;
  clean: string;
}

interface BuildResult {
  result: string;
}

interface BuildStatus {
  status: string;
}

interface BuildRequestValidationResult {
  result: string;
  message: string;
}
