
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
  metrics: {
    latency: number;
    tasksCompleted: number;
    tokenUsage: number;
  };
}

export interface WorkflowStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  agentId?: string;
}

export interface NetworkStats {
  connectedNodes: number;
  totalTasks: number;
  uptime: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  source: string;
}

// FIX: Added missing PlayerStats interface required by ClawHUD and GameCanvas
export interface PlayerStats {
  lives: number;
  health: number;
  score: number;
  pistol: number;
  magic: number;
  dynamite: number;
}

// FIX: Added missing GameState interface required by GameCanvas
export interface GameState {
  stats: PlayerStats;
  isGameOver: boolean;
}

// FIX: Added missing ChatMessage interface required by CaptainsLog
export interface ChatMessage {
  role: 'claw' | 'user';
  content: string;
  timestamp: Date;
}
