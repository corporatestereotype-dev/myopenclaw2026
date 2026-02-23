
import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  Terminal, 
  Cpu, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  Search,
  Zap,
  RefreshCw,
  Send,
  Activity,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import AgentGrid from './components/AgentGrid';
import WorkflowMonitor from './components/WorkflowMonitor';
import TaskDecomposition from './components/TaskDecomposition';
import { Agent, NodeStatus, WorkflowStep, LogEntry, SubTask } from './types';
import { geminiService } from './services/geminiService';

const MOCK_AGENTS: Agent[] = [
  { id: 'OC-001', name: 'Alpha-Orchestrator', type: 'Orchestrator', status: NodeStatus.ONLINE, lastSeen: '2s ago', skills: ['Orchestration', 'Planning', 'NLP'], metrics: { latency: 14, tasksCompleted: 124, tokenUsage: 450000 } },
  { id: 'OC-042', name: 'Parser-Bot-Sigma', type: 'Worker', status: NodeStatus.PROCESSING, lastSeen: '1s ago', skills: ['Data Retrieval', 'Parsing', 'NLP'], metrics: { latency: 8, tasksCompleted: 890, tokenUsage: 120000 } },
  { id: 'OC-089', name: 'Validation-Sentry', type: 'Sentry', status: NodeStatus.ONLINE, lastSeen: '5s ago', skills: ['Validation', 'Security', 'Compliance'], metrics: { latency: 22, tasksCompleted: 54, tokenUsage: 12000 } },
  { id: 'OC-112', name: 'RAG-Retrieval-Node', type: 'Worker', status: NodeStatus.ERROR, lastSeen: '12m ago', skills: ['Data Retrieval', 'Vector Search', 'RAG'], metrics: { latency: 0, tasksCompleted: 12, tokenUsage: 500 } },
];

const MOCK_WORKFLOW: WorkflowStep[] = [
  { id: 'w1', label: 'Ingestion', status: 'completed', agentId: 'Parser-Bot-Sigma' },
  { id: 'w2', label: 'Processing', status: 'completed', agentId: 'Alpha-Orchestrator' },
  { id: 'w3', label: 'Verification', status: 'active', agentId: 'Validation-Sentry' },
  { id: 'w4', label: 'Execution', status: 'pending' },
];

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: new Date(), level: 'success', message: 'Connection established with OpenClaw Mainnet', source: 'System' },
    { id: '2', timestamp: new Date(), level: 'info', message: 'Agent Alpha-Orchestrator heartbeat detected', source: 'OC-001' }
  ]);
  const [nexusInput, setNexusInput] = useState('');
  const [nexusOutput, setNexusOutput] = useState('Welcome back, User. All systems operational. Nexus standing by for orchestration directives.');
  const [isNexusLoading, setIsNexusLoading] = useState(false);
  const [activeSubTasks, setActiveSubTasks] = useState<SubTask[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const prevTasksRef = useRef<SubTask[]>([]);

  // Real-time Simulation Loop (State only)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSubTasks(prev => prev.map(task => {
        if (task.status === 'in-progress') {
          const rand = Math.random();
          if (rand > 0.95) {
            return { ...task, status: 'failed' as const };
          } else if (rand > 0.85) {
            return { ...task, status: 'completed' as const };
          }
        }
        return task;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Side Effects for Task Completion and Failure
  useEffect(() => {
    activeSubTasks.forEach(task => {
      const prevTask = prevTasksRef.current.find(t => t.id === task.id);
      if (!prevTask) return;

      if (task.status === 'completed' && prevTask.status === 'in-progress') {
        setLogs(l => [{
          id: Date.now().toString(),
          timestamp: new Date(),
          level: 'success',
          message: `Task [${task.label}] completed by ${task.assignedAgentId}. Triggering immediate auto-adjustment.`,
          source: 'Nexus'
        }, ...l]);
        
        triggerAdaptation(task);
      }

      if (task.status === 'failed' && prevTask.status === 'in-progress') {
        setLogs(l => [{
          id: Date.now().toString(),
          timestamp: new Date(),
          level: 'error',
          message: `Task [${task.label}] failed on agent ${task.assignedAgentId}. Error recovery protocol required.`,
          source: 'Nexus'
        }, ...l]);
      }
    });
    prevTasksRef.current = activeSubTasks;
  }, [activeSubTasks]);

  const triggerAdaptation = async (completedTask: SubTask) => {
    setIsOptimizing(true);
    // Simulate AI thinking about how to adjust future tasks
    setTimeout(() => {
      setLogs(l => [{
        id: Date.now().toString(),
        timestamp: new Date(),
        level: 'info',
        message: `Dynamic Adaptation: Future ${completedTask.complexity} tasks will be prioritized for ${completedTask.assignedAgentId}.`,
        source: 'Nexus-Core'
      }, ...l]);
      setIsOptimizing(false);
    }, 1500);
  };

  const handleNexusSubmit = async () => {
    if (!nexusInput.trim()) return;
    setIsNexusLoading(true);

    // If input looks like a task breakdown request, trigger decomposition
    if (nexusInput.toLowerCase().includes('break down') || nexusInput.toLowerCase().includes('decompose') || nexusInput.length > 50) {
      const breakdown = await geminiService.decomposeTask(nexusInput);
      if (breakdown.length > 0) {
        const formattedTasks: SubTask[] = breakdown.map((b: any) => ({
          ...b,
          status: 'pending'
        }));
        setActiveSubTasks(formattedTasks);
        setNexusOutput(`Task decomposition successful. I have identified ${formattedTasks.length} sub-tasks for this objective. Review the Task Breakdown panel.`);
        setLogs(prev => [{
          id: Date.now().toString(),
          timestamp: new Date(),
          level: 'success',
          message: `Nexus decomposed high-level objective into ${formattedTasks.length} modules.`,
          source: 'Nexus'
        }, ...prev]);
      } else {
        const result = await geminiService.getOrchestrationAdvice(nexusInput);
        setNexusOutput(result);
      }
    } else {
      const result = await geminiService.getOrchestrationAdvice(nexusInput);
      setNexusOutput(result);
    }
    
    setNexusInput('');
    setIsNexusLoading(false);
  };

  const executeSubTask = (id: string) => {
    setActiveSubTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'in-progress' } : t
    ));

    setLogs(prev => [{
      id: Date.now().toString(),
      timestamp: new Date(),
      level: 'info',
      message: `Sub-task ${id} dispatched to assigned worker. Execution stream opened.`,
      source: 'Orchestrator'
    }, ...prev]);
  };

  const handleAssignAgent = (taskId: string, agentId: string) => {
    setActiveSubTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, assignedAgentId: agentId } : t
    ));
    const agent = MOCK_AGENTS.find(a => a.id === agentId);
    setLogs(prev => [{
      id: Date.now().toString(),
      timestamp: new Date(),
      level: 'info',
      message: `Task ${taskId} assigned to ${agent?.name || agentId}`,
      source: 'System'
    }, ...prev]);
  };

  const reassessComplexity = async (taskId: string) => {
    const task = activeSubTasks.find(t => t.id === taskId);
    if (!task) return;
    
    setLogs(prev => [{
      id: Date.now().toString(),
      timestamp: new Date(),
      level: 'info',
      message: `Re-assessing complexity for [${task.label}] using Nexus heuristics...`,
      source: 'Nexus'
    }, ...prev]);

    // Simulate AI re-assessment
    setTimeout(() => {
      setActiveSubTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, complexity: Math.random() > 0.5 ? 'High' : 'Medium' } : t
      ));
      setLogs(prev => [{
        id: Date.now().toString(),
        timestamp: new Date(),
        level: 'success',
        message: `Complexity for [${task.label}] recalibrated.`,
        source: 'Nexus'
      }, ...prev]);
    }, 1000);
  };

  const handleRetryTask = (taskId: string, strategy: string, agentId?: string) => {
    setActiveSubTasks(prev => prev.map(t => 
      t.id === taskId ? { 
        ...t, 
        status: 'pending', 
        assignedAgentId: agentId || t.assignedAgentId,
        description: strategy === 'robust' ? `[RETRY: ROBUST MODE] ${t.description}` : t.description
      } : t
    ));
    
    setLogs(prev => [{
      id: Date.now().toString(),
      timestamp: new Date(),
      level: 'warn',
      message: `Recovery protocol initiated for [${taskId}]. Strategy: ${strategy.toUpperCase()}`,
      source: 'Nexus'
    }, ...prev]);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/30">
      {/* Navigation Rail */}
      <aside className="w-16 border-r border-slate-800 flex flex-col items-center py-6 bg-slate-950">
        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center mb-10 shadow-lg shadow-teal-500/20 cursor-pointer">
          <Network size={24} className="text-white" />
        </div>
        <div className="flex-1 space-y-8">
          <NavIcon icon={<LayoutDashboard size={20}/>} active />
          <NavIcon icon={<Cpu size={20}/>} />
          <NavIcon icon={<Terminal size={20}/>} />
          <NavIcon icon={<Zap size={20}/>} />
        </div>
        <NavIcon icon={<Settings size={20}/>} />
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <h1 className="font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <span className="text-teal-500">OPEN</span>CLAW 
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">V3.0.2</span>
            </h1>
            <div className="h-4 w-[1px] bg-slate-800" />
            <div className="flex items-center text-[10px] text-slate-500 font-mono space-x-2 uppercase">
              <RefreshCw size={10} className="animate-spin text-teal-600" />
              <span>Network: Mainnet-Beta</span>
              <span className="text-teal-500">● 4/4 Nodes Syncing</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-teal-600/10 border border-teal-500/30 rounded-lg text-teal-500 text-[10px] font-bold hover:bg-teal-600/20 transition-all">
              <PlusCircle size={12} />
              NEW WORKFLOW
            </button>
            <div className="h-4 w-[1px] bg-slate-800" />
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 border border-slate-700 shadow-lg shadow-teal-500/10" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-hide">
          <WorkflowMonitor steps={MOCK_WORKFLOW} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {activeSubTasks.length > 0 && (
                <TaskDecomposition 
                  subTasks={activeSubTasks} 
                  agents={MOCK_AGENTS}
                  isOptimizing={isOptimizing}
                  onExecuteSubTask={executeSubTask} 
                  onAssignAgent={handleAssignAgent}
                  onReassessComplexity={reassessComplexity}
                  onRetryTask={handleRetryTask}
                />
              )}

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-slate-100 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    Managed Agents
                  </h2>
                  <button className="text-[10px] text-teal-500 font-bold hover:underline tracking-tighter">CLUSTER MANAGEMENT</button>
                </div>
                <AgentGrid agents={MOCK_AGENTS} />
              </section>

              <section className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Event Stream</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                    <Terminal size={12} className="text-slate-500" />
                  </div>
                </div>
                <div className="p-4 font-mono text-[11px] h-48 overflow-y-auto space-y-1 bg-black/40">
                  {logs.map(log => (
                    <div key={log.id} className="flex space-x-2 animate-in slide-in-from-left-2 duration-300">
                      <span className="text-slate-600">[{log.timestamp.toLocaleTimeString()}]</span>
                      <span className={`uppercase font-bold tracking-tighter w-14 ${
                        log.level === 'success' ? 'text-teal-500' :
                        log.level === 'error' ? 'text-red-500' :
                        log.level === 'warn' ? 'text-yellow-500' : 'text-blue-500'
                      }`}>{log.level}</span>
                      <span className="text-slate-400 font-bold">[{log.source}]</span>
                      <span className="text-slate-300">{log.message}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Nexus Advisor Panel */}
            <div className="space-y-4">
              <div className="bg-gradient-to-b from-indigo-900/30 to-slate-900 border border-indigo-500/20 rounded-2xl flex flex-col h-[600px] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-indigo-500/10 backdrop-blur-md">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="text-teal-400 animate-pulse" size={18} />
                    <h3 className="font-bold text-slate-100 text-sm tracking-widest uppercase">Nexus Core</h3>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-teal-500/20 border border-teal-500/30 text-[9px] text-teal-400 font-bold">
                    CONNECTED
                  </div>
                </div>

                <div className="flex-1 p-5 overflow-y-auto text-xs text-indigo-100 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950/20 scroll-hide">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-6 h-6 rounded bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
                      <Zap size={12} />
                    </div>
                    <div className="flex-1 bg-slate-900/40 p-3 rounded-lg border border-slate-800 shadow-inner">
                      {nexusOutput}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/5">
                  <div className="relative">
                    <textarea 
                      value={nexusInput}
                      onChange={(e) => setNexusInput(e.target.value)}
                      onKeyDown={(e) => { 
                        if (e.key === 'Enter' && !e.shiftKey) { 
                          e.preventDefault(); 
                          handleNexusSubmit(); 
                        }
                      }}
                      placeholder="Decompose a complex task..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 pr-14 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-all resize-none h-24 shadow-2xl"
                    />
                    <button 
                      onClick={handleNexusSubmit}
                      disabled={isNexusLoading}
                      className="absolute bottom-3 right-3 p-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20 group"
                    >
                      {isNexusLoading ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setNexusInput("Decompose: ")}
                        className="text-[9px] font-bold text-slate-500 border border-slate-800 px-2 py-1 rounded hover:bg-slate-800 transition-all"
                       >
                         DECOMPOSE
                       </button>
                       <button className="text-[9px] font-bold text-slate-500 border border-slate-800 px-2 py-1 rounded hover:bg-slate-800 transition-all">
                         OPTIMIZE
                       </button>
                    </div>
                    <span className="text-[9px] text-slate-600 italic">Gemini 3.0 Experimental</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-teal-500/30 transition-all cursor-default shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-all">
                    <Activity size={20} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Stability</div>
                    <div className="text-xl font-mono font-bold text-slate-100">99.98%</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[9px] text-slate-600 uppercase font-bold">Uptime</div>
                  <div className="text-xs font-mono text-slate-400">14d 02h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavIcon = ({ icon, active }: { icon: React.ReactNode, active?: boolean }) => (
  <button className={`p-3 rounded-xl transition-all duration-300 relative group ${
    active ? 'bg-teal-500/10 text-teal-400 shadow-inner' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/50'
  }`}>
    <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>
      {icon}
    </div>
    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-teal-500 rounded-l-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />}
  </button>
);

export default App;
