import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2
} from 'lucide-react';
import { mockReallocationPlan } from '../data/mockData';
import { apiService } from '../services/api';

export const ReallocationPage: React.FC = () => {
  const [plan] = useState(mockReallocationPlan);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const res = await apiService.applyReallocation(plan.planId);
      setIsApplying(false);
      setIsApplied(true);
      setFeedback(res.message);
    } catch (err) {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            ✦ PRECISION ALLOCATION SIMULATOR
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight mt-1">
            Intelligent Workload Reallocation
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Simulate and execute optimal workload redistribution plans to eliminate SLA breach risks and capacity bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('Simulating alternative graph allocation policies...')}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-run Graph Optimization</span>
          </button>

          <button
            onClick={handleApply}
            disabled={isApplying || isApplied}
            className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isApplied ? 'Reallocation Executed ✓' : 'Apply Reallocation'}</span>
          </button>
        </div>
      </div>

      {isApplied && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-xs font-semibold text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Plan Header Summary Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">PLAN ID & ENGINE</span>
          <p className="text-lg font-bold font-serif text-slate-900 mt-1">AI Plan {plan.planId}</p>
          <p className="text-xs text-slate-500">Computed in {plan.computedTime} • Confidence 98.4%</p>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">AFFECTED TASKS & PENALTY RISK</span>
          <p className="text-lg font-bold font-serif text-rose-700 mt-1">{plan.affectedTasksCount} Critical Tasks</p>
          <p className="text-xs text-rose-800 font-medium">{plan.totalUnmitigatedRisk}</p>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">SLA WINDOW & SAFETY</span>
          <p className="text-lg font-bold font-mono text-amber-800 mt-1">{plan.criticalSlaWindow}</p>
          <p className="text-xs text-slate-600 font-medium">Cap Guard: {plan.capacitySafety}</p>
        </div>
      </div>

      {/* Reallocation Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-serif text-slate-900">Reallocation Matrix & Interventions</h3>

        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 font-bold">
                <th className="py-3 px-4">TASK & URGENCY</th>
                <th className="py-3 px-4">CURRENT ASSIGNEE</th>
                <th className="py-3 px-4">RECOMMENDED ASSIGNEE</th>
                <th className="py-3 px-4">SKILL MATCH</th>
                <th className="py-3 px-4">CURRENT vs NEW CAPACITY</th>
                <th className="py-3 px-4">EXPECTED IMPACT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plan.interventions.map((item) => (
                <tr key={item.taskId} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{item.taskCode} {item.taskName}</p>
                    <span className="text-[10px] font-mono text-rose-700 font-semibold">{item.severityBadge}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{item.originalAssignee}</span>
                    <span className="block text-[10px] text-rose-600">Reason: {item.originalAssigneeReason}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.recommendedAssigneeInitials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.recommendedAssignee}</p>
                        <p className="text-[10px] text-slate-500">{item.recommendedRole}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                    {item.fitScore}%
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                    {item.capacityDelta}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      SLA Breach Deflected
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold font-serif text-base">Ready to deploy allocation matrix?</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            4 webhook notifications will trigger to notify Arun, Priya & Divya across Slack & Jira.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleApply}
            disabled={isApplied}
            className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition shadow-md cursor-pointer disabled:opacity-50"
          >
            {isApplied ? 'Applied ✓' : 'Apply Reallocation'}
          </button>
        </div>
      </div>

    </div>
  );
};
