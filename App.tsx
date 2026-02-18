
import React, { useState, useEffect } from 'react';
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
  // FIX: Added missing Activity import
  Activity
} from 'lucide-react';
import AgentGrid from './components/AgentGrid';
import WorkflowMonitor from './components/WorkflowMonitor';
import { Agent, NodeStatus, WorkflowStep, LogEntry } from './types';
import { geminiService } from './services/geminiService';

const MOCK_AGENTS: Agent[] = [
  { id: 'OC-001', name: 'Alpha-Orchestrator', type: 'Orchestrator', status: NodeStatus.ONLINE, lastSeen: '2s ago', metrics: { latency: 14, tasksCompleted: 124, tokenUsage: 450000 } },
  { id: 'OC-042', name: 'Parser-Bot-Sigma', type: 'Worker', status: NodeStatus.PROCESSING, lastSeen: '1s ago', metrics: { latency: 8, tasksCompleted: 890, tokenUsage: 120000 } },
  { id: 'OC-089', name: 'Validation-Sentry', type: 'Sentry', status: NodeStatus.ONLINE, lastSeen: '5s ago', metrics: { latency: 22, tasksCompleted: 54, tokenUsage: 12000 } },
  { id: 'OC-112', name: 'RAG-Retrieval-Node', type: 'Worker', status: NodeStatus.ERROR, lastSeen: '12m ago', metrics: { latency: 0, tasksCompleted: 12, tokenUsage: 500 } },
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

  const handleNexusSubmit = async () => {
    if (!nexusInput.trim()) return;
    setIsNexusLoading(true);
    const result = await geminiService.getOrchestrationAdvice(nexusInput);
    setNexusOutput(result);
    setNexusInput('');
    setIsNexusLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/30">
      {/* Navigation Rail */}
      <aside className="w-16 border-r border-slate-800 flex flex-col items-center py-6 bg-slate-950">
        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center mb-10 shadow-lg shadow-teal-500/20">
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
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 border border-slate-700" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-hide">
          <WorkflowMonitor steps={MOCK_WORKFLOW} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-slate-100 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    Managed Agents
                  </h2>
                  <button className="text-[10px] text-teal-500 font-bold hover:underline">+ DEPLOY NODE</button>
                </div>
                <AgentGrid agents={MOCK_AGENTS} />
              </section>

              <section className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Event Stream</span>
                  <Terminal size={12} className="text-slate-500" />
                </div>
                <div className="p-4 font-mono text-[11px] h-48 overflow-y-auto space-y-1">
                  {logs.map(log => (
                    <div key={log.id} className="flex space-x-2">
                      <span className="text-slate-600">[{log.timestamp.toLocaleTimeString()}]</span>
                      <span className={`uppercase font-bold ${
                        log.level === 'success' ? 'text-teal-500' :
                        log.level === 'error' ? 'text-red-500' :
                        log.level === 'warn' ? 'text-yellow-500' : 'text-blue-500'
                      }`}>{log.level}</span>
                      <span className="text-slate-400">[{log.source}]</span>
                      <span className="text-slate-300">{log.message}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Nexus Advisor Panel */}
            <div className="space-y-4">
              <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col h-[500px] shadow-2xl">
                <div className="p-4 border-b border-white/5 flex items-center space-x-3 bg-indigo-500/10">
                  <Zap className="text-teal-400" size={18} />
                  <h3 className="font-bold text-slate-100 text-sm tracking-widest uppercase">Nexus Orchestrator</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto text-xs text-indigo-100 leading-relaxed font-mono whitespace-pre-wrap">
                  {nexusOutput}
                </div>
                <div className="p-4 bg-slate-950/50 border-t border-white/5">
                  <div className="relative">
                    <textarea 
                      value={nexusInput}
                      onChange={(e) => setNexusInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleNexusSubmit(); }}}
                      placeholder="Request workflow optimization..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pr-12 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-all resize-none h-20"
                    />
                    <button 
                      onClick={handleNexusSubmit}
                      disabled={isNexusLoading}
                      className="absolute bottom-3 right-3 p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      {isNexusLoading ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-600 mt-2 text-center">
                    Nexus leverages Gemini 3.0 Pro for advanced agent telemetry analysis.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center space-x-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Activity size={20} className="text-green-500" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Network Health</div>
                  <div className="text-xl font-bold text-slate-100">99.98%</div>
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
    active ? 'bg-teal-500/10 text-teal-400' : 'text-slate-500 hover:text-slate-200'
  }`}>
    {icon}
    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-teal-500 rounded-l-full" />}
    <div className="absolute left-16 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
      Tooltip
    </div>
  </button>
);

export default App;
