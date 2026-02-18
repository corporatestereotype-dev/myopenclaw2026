
import React from 'react';
import { Cpu, Activity, Zap, ShieldAlert } from 'lucide-react';
import { Agent, NodeStatus } from '../types';

interface AgentGridProps {
  agents: Agent[];
}

const AgentGrid: React.FC<AgentGridProps> = ({ agents }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {agents.map(agent => (
        <div key={agent.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 hover:border-teal-500/50 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getStatusBg(agent.status)}`}>
                <Cpu size={20} className={getStatusColor(agent.status)} />
              </div>
              <div>
                <h3 className="text-slate-100 font-bold text-sm tracking-tight">{agent.name}</h3>
                <span className="text-[10px] text-slate-500 uppercase font-mono">{agent.type}</span>
              </div>
            </div>
            <span className={`h-2 w-2 rounded-full ${getStatusDot(agent.status)} animate-pulse`} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Metric label="Latency" value={`${agent.metrics.latency}ms`} icon={<Activity size={12}/>} />
            <Metric label="Tokens" value={`${(agent.metrics.tokenUsage / 1000).toFixed(1)}k`} icon={<Zap size={12}/>} />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[10px] text-slate-600 font-mono">ID: {agent.id}</span>
            <button className="text-[10px] text-teal-500 font-bold hover:underline">RECONFIGURE</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Metric = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="flex flex-col">
    <div className="flex items-center space-x-1 text-slate-500 mb-1">
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
    </div>
    <span className="text-slate-200 font-mono text-xs">{value}</span>
  </div>
);

const getStatusBg = (s: NodeStatus) => {
  switch(s) {
    case NodeStatus.ONLINE: return 'bg-teal-500/10';
    case NodeStatus.PROCESSING: return 'bg-blue-500/10';
    case NodeStatus.ERROR: return 'bg-red-500/10';
    default: return 'bg-slate-800';
  }
};

const getStatusColor = (s: NodeStatus) => {
  switch(s) {
    case NodeStatus.ONLINE: return 'text-teal-400';
    case NodeStatus.PROCESSING: return 'text-blue-400';
    case NodeStatus.ERROR: return 'text-red-400';
    default: return 'text-slate-400';
  }
};

const getStatusDot = (s: NodeStatus) => {
  switch(s) {
    case NodeStatus.ONLINE: return 'bg-teal-500';
    case NodeStatus.PROCESSING: return 'bg-blue-500';
    case NodeStatus.ERROR: return 'bg-red-500';
    default: return 'bg-slate-500';
  }
};

export default AgentGrid;
