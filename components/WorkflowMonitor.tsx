
import React from 'react';
import { ChevronRight, CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import { WorkflowStep } from '../types';

interface WorkflowMonitorProps {
  steps: WorkflowStep[];
}

const WorkflowMonitor: React.FC<WorkflowMonitorProps> = ({ steps }) => {
  return (
    <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-slate-100 font-bold text-lg flex items-center gap-2">
          <div className="w-1 h-6 bg-teal-500 rounded-full" />
          Active Workflow Pipeline
        </h2>
        <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-1 bg-slate-900 rounded border border-slate-800">
          Trace ID: 89x-992-CLAW
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
              step.status === 'active' ? 'bg-teal-500/10 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 
              step.status === 'completed' ? 'bg-slate-900/60 border-slate-700/50' : 
              'bg-transparent border-slate-800 text-slate-600'
            }`}>
              <div className="flex-shrink-0">
                {step.status === 'completed' && <CheckCircle2 className="text-teal-500" size={18} />}
                {step.status === 'active' && <Loader2 className="text-teal-400 animate-spin" size={18} />}
                {step.status === 'failed' && <AlertCircle className="text-red-500" size={18} />}
                {step.status === 'pending' && <Circle className="text-slate-700" size={18} />}
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-slate-700' : 'text-slate-200'}`}>
                  {step.label}
                </span>
                {step.agentId && <span className="text-[9px] font-mono text-teal-600/70">{step.agentId}</span>}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="hidden lg:block text-slate-800" size={16} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkflowMonitor;
