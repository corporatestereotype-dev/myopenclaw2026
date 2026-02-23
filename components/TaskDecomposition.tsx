
import React, { useState } from 'react';
import { Layers, CheckCircle, Circle, Play, ArrowRight, Info, RefreshCw, AlertTriangle, X, Target, BrainCircuit, ShieldAlert } from 'lucide-react';
import { SubTask, Agent } from '../types';

interface TaskDecompositionProps {
  subTasks: SubTask[];
  agents: Agent[];
  isOptimizing?: boolean;
  onExecuteSubTask: (id: string) => void;
  onAssignAgent: (taskId: string, agentId: string) => void;
  onReassessComplexity: (taskId: string) => void;
  onRetryTask: (taskId: string, strategy: string, agentId?: string) => void;
}

const TaskDecomposition: React.FC<TaskDecompositionProps> = ({ 
  subTasks, 
  agents,
  isOptimizing,
  onExecuteSubTask, 
  onAssignAgent,
  onReassessComplexity,
  onRetryTask
}) => {
  const [pendingAssignment, setPendingAssignment] = useState<{ taskId: string, agentId: string } | null>(null);
  const [recoveryTask, setRecoveryTask] = useState<SubTask | null>(null);
  const [recoveryStrategy, setRecoveryStrategy] = useState<'retry' | 'robust' | 'reassign'>('retry');
  const [recoveryAgentId, setRecoveryAgentId] = useState<string>('');

  if (subTasks.length === 0) return null;

  const calculateCompatibility = (agent: Agent, task: SubTask) => {
    if (!task.requiredSkills || task.requiredSkills.length === 0) return 100;
    const matchedSkills = agent.skills.filter(skill => task.requiredSkills?.includes(skill));
    return Math.round((matchedSkills.length / task.requiredSkills.length) * 100);
  };

  const handleConfirmAssignment = () => {
    if (pendingAssignment) {
      onAssignAgent(pendingAssignment.taskId, pendingAssignment.agentId);
      setPendingAssignment(null);
    }
  };

  const handleExecuteRecovery = () => {
    if (recoveryTask) {
      onRetryTask(recoveryTask.id, recoveryStrategy, recoveryAgentId || undefined);
      setRecoveryTask(null);
      setRecoveryAgentId('');
    }
  };

  return (
    <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 relative">
      {/* Confirmation Modal */}
      {pendingAssignment && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <AlertTriangle size={24} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Confirm Reassignment</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to reassign this sub-task? Changing the assigned agent may impact ongoing processes and workflow synchronization.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setPendingAssignment(null)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition-all"
              >
                CANCEL
              </button>
              <button 
                onClick={handleConfirmAssignment}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Recovery Modal */}
      {recoveryTask && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
          <div className="bg-slate-900 border border-red-900/50 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-red-500">
                <ShieldAlert size={24} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Error Recovery Protocol</h3>
              </div>
              <button onClick={() => setRecoveryTask(null)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Failed Task</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-200">{recoveryTask.label}</h4>
                  <p className="text-[10px] text-slate-500 italic mt-1">{recoveryTask.description}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Recovery Strategy</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'retry', label: 'Simple Retry', desc: 'Execute again' },
                    { id: 'robust', label: 'Robust Mode', desc: 'High redundancy' },
                    { id: 'reassign', label: 'Reassign', desc: 'New agent' }
                  ].map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setRecoveryStrategy(s.id as any)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        recoveryStrategy === s.id ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase">{s.label}</div>
                      <div className="text-[8px] opacity-60">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {recoveryStrategy === 'reassign' && (
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Select New Agent</label>
                  <select 
                    value={recoveryAgentId}
                    onChange={(e) => setRecoveryAgentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Select Agent...</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>{agent.name} ({calculateCompatibility(agent, recoveryTask)}% Match)</option>
                    ))}
                  </select>
                </div>
              )}

              <button 
                onClick={handleExecuteRecovery}
                disabled={recoveryStrategy === 'reassign' && !recoveryAgentId}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:shadow-none"
              >
                Initiate Recovery Sequence
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="text-teal-500" size={20} />
          <div>
            <h2 className="text-slate-100 font-bold uppercase tracking-widest text-xs">Generated Task Breakdown</h2>
            {isOptimizing && (
              <div className="flex items-center gap-1.5 text-[9px] text-teal-400 font-bold animate-pulse">
                <RefreshCw size={10} className="animate-spin" />
                DYNAMICAL ADAPTATION IN PROGRESS...
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 transition-all duration-1000" 
                style={{ width: `${(subTasks.filter(t => t.status === 'completed').length / subTasks.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-teal-500">
              {Math.round((subTasks.filter(t => t.status === 'completed').length / subTasks.length) * 100)}%
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">
            {subTasks.length} OBJECTIVES IDENTIFIED
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {subTasks.map((task, idx) => {
          const assignedAgent = agents.find(a => a.id === task.assignedAgentId);
          const compatibility = assignedAgent ? calculateCompatibility(assignedAgent, task) : null;
          
          return (
            <div 
              key={task.id} 
              className="group flex items-start gap-4 p-4 bg-slate-950/40 border border-slate-800/50 rounded-xl hover:border-teal-500/30 transition-all"
            >
              <div className="flex-shrink-0 mt-1">
                {task.status === 'completed' ? (
                  <CheckCircle className="text-teal-500" size={18} />
                ) : task.status === 'in-progress' ? (
                  <RefreshCw className="text-amber-500 animate-spin" size={18} />
                ) : task.status === 'failed' ? (
                  <ShieldAlert className="text-red-500" size={18} />
                ) : (
                  <Circle className="text-slate-700 group-hover:text-teal-600 transition-colors" size={18} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-slate-200">{task.label}</h4>
                    <button 
                      onClick={() => onReassessComplexity(task.id)}
                      className={`text-[9px] px-1.5 py-0.5 rounded border transition-all hover:scale-105 ${
                        task.complexity === 'High' ? 'text-red-400 border-red-900/50 bg-red-950/20' :
                        task.complexity === 'Medium' ? 'text-amber-400 border-amber-900/50 bg-amber-950/20' :
                        'text-teal-400 border-teal-900/50 bg-teal-950/20'
                      }`}
                      title="Click to re-assess complexity using AI"
                    >
                      {task.complexity}
                    </button>
                    {task.status === 'failed' && (
                      <span className="text-[9px] font-bold text-red-500 uppercase animate-pulse">Execution Failed</span>
                    )}
                  </div>
                  
                  {/* Agent Assignment Dropdown */}
                  <div className="flex items-center gap-2">
                    {assignedAgent && (
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded-md ${
                          compatibility && compatibility > 70 ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' :
                          compatibility && compatibility > 40 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                          'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                          <BrainCircuit size={10} />
                          <span className="text-[9px] font-bold">{compatibility}% MATCH</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-md">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            assignedAgent.status === 'ONLINE' ? 'bg-green-500' : 
                            assignedAgent.status === 'PROCESSING' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                          }`} />
                          <span className="text-[9px] font-bold text-slate-300 uppercase">{assignedAgent.name}</span>
                        </div>
                      </div>
                    )}
                    <select 
                      value={task.assignedAgentId || ''}
                      onChange={(e) => {
                        const newAgentId = e.target.value;
                        if (task.assignedAgentId && newAgentId !== task.assignedAgentId) {
                          setPendingAssignment({ taskId: task.id, agentId: newAgentId });
                        } else {
                          onAssignAgent(task.id, newAgentId);
                        }
                      }}
                      disabled={task.status !== 'pending' && task.status !== 'failed'}
                      className="bg-slate-900 border border-slate-800 text-[9px] text-slate-400 rounded px-1.5 py-0.5 focus:outline-none focus:border-teal-500/50 disabled:opacity-50"
                    >
                      <option value="">Assign Agent...</option>
                      {agents.map(agent => {
                        const comp = calculateCompatibility(agent, task);
                        return (
                          <option key={agent.id} value={agent.id}>
                            {agent.name} ({comp}% Match)
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed mb-2 italic">
                  {task.description}
                </p>

                {/* Required Skills Display */}
                {task.requiredSkills && task.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[8px] text-slate-600 font-bold uppercase flex items-center gap-1">
                      <Target size={8} />
                      Required:
                    </span>
                    {task.requiredSkills.map(skill => (
                      <span key={skill} className="text-[8px] px-1.5 py-0.25 bg-slate-900 border border-slate-800 text-slate-500 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  {task.status === 'failed' ? (
                    <button 
                      onClick={() => setRecoveryTask(task)}
                      className="flex items-center gap-2 text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors"
                    >
                      <ShieldAlert size={12} />
                      INITIATE RECOVERY
                    </button>
                  ) : (
                    <button 
                      onClick={() => onExecuteSubTask(task.id)}
                      disabled={task.status !== 'pending' || !task.assignedAgentId}
                      className="flex items-center gap-2 text-[10px] font-bold text-teal-500 hover:text-teal-400 disabled:text-slate-700 transition-colors"
                    >
                      <Play size={12} fill="currentColor" />
                      {task.status === 'completed' ? 'TASK COMPLETED' : 
                       task.status === 'in-progress' ? 'EXECUTING...' :
                       !task.assignedAgentId ? 'ASSIGN AGENT TO DISPATCH' : 'DISPATCH TO AGENT'}
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
                    <Info size={10} />
                    REF: OC-{100 + idx}
                  </div>
                </div>
              </div>

              <div className="hidden group-hover:flex items-center">
                <ArrowRight className="text-teal-500 animate-pulse" size={16} />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="px-6 py-3 bg-teal-500/5 border-t border-slate-800 flex items-center justify-center">
        <p className="text-[10px] text-teal-600/70 font-mono tracking-tighter">
          NEXUS ADVISORY: PROCEED WITH PARALLEL EXECUTION FOR OPTIMAL THROUGHPUT
        </p>
      </div>
    </div>
  );
};

export default TaskDecomposition;
