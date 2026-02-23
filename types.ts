
export enum NodeStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR',
}

export interface Agent {
  id: string;
  name: string;
  status: NodeStatus;
  type: 'Orchestrator' | 'Worker' | 'Sentry';
  lastSeen: string;
  skills: string[];
  metrics: {
    latency: number;
    tasksCompleted: number;
    tokenUsage: number;
  };
}

export interface SubTask {
  id: string;
  label: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignedAgentId?: string;
  requiredSkills?: string[];
}

export interface WorkflowStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  agentId?: string;
  subTasks?: SubTask[];
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  source: string;
}

export interface PlayerStats {
  lives: number;
  health: number;
  score: number;
  pistol: number;
  magic: number;
  dynamite: number;
}

export interface GameState {
  stats: PlayerStats;
  isGameOver: boolean;
}

export interface ChatMessage {
  role: 'claw' | 'user';
  content: string;
  timestamp: Date;
}
