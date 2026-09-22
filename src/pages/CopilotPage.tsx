import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  Code, 
  Mic, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';
import { mockReallocationPlan } from '../data/mockData';
import { apiService } from '../services/api';
import type { CopilotMessage } from '../types';

export const CopilotPage: React.FC = () => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'initial-user-msg',
      sender: 'user',
      text: 'Rahul is unavailable due to an emergency medical leave starting immediately. Reassign all his active tasks to prevent SLA breaches.',
      timestamp: 'Today 10:42 AM',
    },
    {
      id: 'initial-plan-msg',
      sender: 'assistant',
      text: "I analyzed Rahul Sharma's active queue and identified 4 affected tasks at immediate risk. Total projected unmitigated risk: $42,000 SLA penalty exposure within a 14h critical window.",
      timestamp: 'Today 10:42 AM',
      planData: mockReallocationPlan,
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState('');

  const suggestedPrompts = [
    "Reassign Rahul's critical tasks",
    "Simulate Q4 platform engineering capacity",
    "Find replacements for backend on-call",
    "Analyze skill gaps in Kubernetes v1.28"
  ];

  const handleSendPrompt = async (promptText?: string) => {
    const textToSend = promptText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInputQuery('');
    setIsTyping(true);

    try {
      const responseMsg = await apiService.askCopilot(textToSend);
      setMessages((prev) => [...prev, responseMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyReallocation = async () => {
    try {
      const res = await apiService.applyReallocation(mockReallocationPlan.planId);
      setIsApplied(true);
      setAppliedNotice(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            ✦ AUTONOMOUS WORKFORCE ORCHESTRATION
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight mt-1">
            AI Workforce Copilot
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Intelligent assistant for real-time allocation, incident deflection, and predictive capacity balancing.
          </p>
        </div>

        {/* Engine Telemetry Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-4 text-xs shadow-2xs">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">ENGINE</span>
            <span className="font-bold text-slate-900 font-mono">RAAD-Nexus v4.2</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-[10px] text-slate-400 font-mono block">LATENCY</span>
            <span className="font-bold text-slate-900 font-mono">120ms</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-[10px] text-slate-400 font-mono block">CONFIDENCE</span>
            <span className="font-bold text-emerald-700 font-mono">98.4%</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-[10px] uppercase font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-mono">
              Audit Active
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Prompts Row */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="font-mono text-[10px] uppercase font-bold text-slate-400">SUGGESTED:</span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(prompt)}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-2xs font-medium cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div className="space-y-6">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex flex-col items-end space-y-1">
                <span className="text-[11px] text-slate-500 pr-1">
                  Elena Vance Head of Operations • {msg.timestamp}
                </span>
                <div className="flex items-start gap-2 max-w-2xl">
                  <div className="bg-[#334155] text-white p-4 rounded-2xl rounded-tr-xs text-xs leading-relaxed shadow-sm font-medium">
                    {msg.text}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    EV
                  </div>
                </div>
              </div>
            );
          }

          // Assistant Response Card
          return (
            <div key={msg.id} className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl shrink-0 shadow-2xs mt-1">
                <Sparkles className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-4">
                {msg.planData ? (
                  /* Full Stitch Reallocation Plan Card */
                  <div className="bg-white border-2 border-amber-300/80 rounded-2xl p-6 shadow-md space-y-6">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-serif text-slate-900">
                          ✦ RAAD Intelligent Reallocation Plan
                        </span>
                        <span className="text-xs font-mono bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
                          AI Plan {msg.planData.planId}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">
                        ⚡ Computed in {msg.planData.computedTime}
                      </span>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-amber-50/50 border border-amber-200/90 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          I analyzed <strong className="text-amber-900 font-bold">Rahul Sharma's</strong> active queue and identified{' '}
                          <span className="font-bold text-rose-700">{msg.planData.affectedTasksCount} affected tasks</span> at immediate risk.
                        </p>
                        <p className="text-xs font-semibold text-slate-600">
                          Total projected unmitigated risk:{' '}
                          <span className="font-bold text-rose-800 underline">{msg.planData.totalUnmitigatedRisk}</span> within a 14h critical window.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="bg-rose-100 text-rose-900 border border-rose-200 px-3.5 py-1.5 rounded-xl text-center">
                          <span className="block text-[9px] font-mono uppercase font-bold text-rose-700">CRITICAL SLA WINDOW</span>
                          <span className="text-base font-extrabold font-mono">{msg.planData.criticalSlaWindow}</span>
                        </div>
                        <div className="bg-blue-50 text-blue-900 border border-blue-200 px-3.5 py-1.5 rounded-xl text-center">
                          <span className="block text-[9px] font-mono uppercase font-bold text-blue-700">CAPACITY SAFETY</span>
                          <span className="text-base font-extrabold font-mono">{msg.planData.capacitySafety}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 1: EXPLAINABLE AI REASONING (5 CONSTRAINTS VERIFIED) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          EXPLAINABLE AI REASONING (5 CONSTRAINTS VERIFIED)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          ⚖ Model Rules Applied
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {msg.planData.reasoning.map((item, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                                  {item.tag}
                                </span>
                              </div>
                              <p className="font-bold text-xs text-slate-900 mt-1">{item.title}</p>
                              <p className="text-[10px] text-slate-500 leading-tight">{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: PROPOSED REALLOCATION MATRIX */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          PROPOSED REALLOCATION MATRIX (4 IMMEDIATE INTERVENTIONS)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          Sorted by SLA Urgency
                        </span>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 font-bold">
                              <th className="py-2.5 px-4">TASK & SLA STATUS</th>
                              <th className="py-2.5 px-4">ORIGINAL STATE</th>
                              <th className="py-2.5 px-4">AI RECOMMENDED ASSIGNEE</th>
                              <th className="py-2.5 px-4">FIT SCORE</th>
                              <th className="py-2.5 px-4">CAPACITY DELTA</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {msg.planData.interventions.map((row) => (
                              <tr key={row.taskId} className="hover:bg-slate-50">
                                <td className="py-3 px-4">
                                  <p className="font-bold text-slate-900">{row.taskCode} {row.taskName}</p>
                                  <span className="inline-block text-[10px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold mt-0.5">
                                    {row.severityBadge}
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  <span className="font-semibold text-slate-800">{row.originalAssignee}</span>
                                  <span className="block text-[10px] text-rose-600 font-bold">{row.originalAssigneeReason}</span>
                                </td>

                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                                      {row.recommendedAssigneeInitials}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900">{row.recommendedAssignee}</p>
                                      <p className="text-[10px] text-slate-500">{row.recommendedRole}</p>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-4 font-mono font-extrabold text-slate-900">
                                  {row.fitScore}%
                                </td>

                                <td className="py-3 px-4 font-mono font-medium text-slate-700">
                                  {row.capacityDelta}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Section 3: Systemic Impact Summary */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Systemic Impact Summary</h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            <strong className="text-emerald-700 font-bold">Zero SLA breaches predicted.</strong> {msg.planData.impactSummary.loadShift} {msg.planData.impactSummary.webhookNotice}
                          </p>
                        </div>
                      </div>

                      <div className="text-right font-mono shrink-0">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">SPRINT BURN RATE</span>
                        <span className="text-xs font-bold text-emerald-700">{msg.planData.impactSummary.burnRateStatus}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                      <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Run Alternative Simulation</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                          Review Changes & Diff
                        </button>

                        <button
                          onClick={handleApplyReallocation}
                          disabled={isApplied}
                          className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-2xs disabled:opacity-60 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isApplied ? 'Reallocation Executed ✓' : 'Apply Reallocation Immediately'}</span>
                        </button>
                      </div>
                    </div>

                    {isApplied && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>{appliedNotice}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Text Response Card */
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <div className="w-4 h-4 border-2 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
            <span>RAAD-Nexus v4.2 is reasoning across 32 active engineer telemetry graphs...</span>
          </div>
        )}
      </div>

      {/* Input Bar at Bottom */}
      <div className="fixed bottom-0 right-0 left-64 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-20">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="relative flex items-center bg-slate-100/90 border border-slate-300 rounded-xl px-4 py-2.5 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
            <div className="flex items-center gap-2 mr-3 text-slate-400">
              <button className="hover:text-slate-700 transition" title="Attach Telemetry Log">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="hover:text-slate-700 transition" title="Insert Code Constraint">
                <Code className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder="Ask RAAD anything... (e.g., 'What happens if Arun takes PTO next Tuesday?')"
              className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />

            <div className="flex items-center gap-2 ml-3">
              <button className="text-slate-400 hover:text-slate-700 transition" title="Voice Command">
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSendPrompt()}
                className="bg-[#795914] hover:bg-[#63480f] text-white p-2 rounded-lg transition shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
            <span>RAAD Assistant adheres to SOC2 Type II compliance & internal data residency.</span>
            <span>Engine: Allocator v4.2 • Context Window: 32k</span>
          </div>
        </div>
      </div>
    </div>
  );
};
