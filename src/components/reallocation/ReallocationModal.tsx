import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import { mockReallocationPlan } from '../../data/mockData';
import { apiService } from '../../services/api';

interface ReallocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReallocationModal: React.FC<ReallocationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [appliedMessage, setAppliedMessage] = useState('');

  if (!isOpen) return null;

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const res = await apiService.applyReallocation(mockReallocationPlan.planId);
      setIsApplying(false);
      setIsApplied(true);
      setAppliedMessage(res.message);
    } catch (err) {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  RAAD Intelligent Reallocation Plan
                </h2>
                <span className="text-xs font-mono bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-bold">
                  AI Plan {mockReallocationPlan.planId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Real-time precision allocation & automated incident deflection • Computed in {mockReallocationPlan.computedTime}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isApplied ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-emerald-900">Reallocation Successfully Executed!</h3>
              <p className="text-sm text-emerald-800 max-w-xl mx-auto font-medium">
                {appliedMessage}
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsApplied(false);
                    onClose();
                    navigate('/copilot');
                  }}
                  className="bg-[#795914] text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-[#63480f] transition"
                >
                  View in AI Copilot
                </button>
                <button
                  onClick={() => {
                    setIsApplied(false);
                    onClose();
                  }}
                  className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition"
                >
                  Close Drawer
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    Analyzed <strong className="text-amber-900 font-bold">Rahul Sharma's</strong> active queue and identified{' '}
                    <span className="font-bold text-rose-700">{mockReallocationPlan.affectedTasksCount} affected tasks</span> at immediate risk.
                  </p>
                  <p className="text-xs font-semibold text-slate-600">
                    Total projected unmitigated risk:{' '}
                    <span className="font-bold text-rose-800 underline">{mockReallocationPlan.totalUnmitigatedRisk}</span> within a 14h critical window.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-rose-100 text-rose-900 border border-rose-200 px-3 py-1.5 rounded-lg text-center">
                    <span className="block text-[9px] font-mono uppercase font-bold text-rose-700">CRITICAL SLA WINDOW</span>
                    <span className="text-sm font-extrabold font-mono">{mockReallocationPlan.criticalSlaWindow}</span>
                  </div>
                  <div className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg text-center">
                    <span className="block text-[9px] font-mono uppercase font-bold text-blue-700">CAPACITY SAFETY</span>
                    <span className="text-sm font-extrabold font-mono">{mockReallocationPlan.capacitySafety}</span>
                  </div>
                </div>
              </div>

              {/* Proposed Reallocation Matrix Table */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                  PROPOSED REALLOCATION MATRIX (4 IMMEDIATE INTERVENTIONS)
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 font-bold">
                        <th className="py-2.5 px-3">TASK & SLA STATUS</th>
                        <th className="py-2.5 px-3">ORIGINAL ASSIGNEE</th>
                        <th className="py-2.5 px-3">AI RECOMMENDED ASSIGNEE</th>
                        <th className="py-2.5 px-3">FIT SCORE</th>
                        <th className="py-2.5 px-3">CAPACITY DELTA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockReallocationPlan.interventions.map((item) => (
                        <tr key={item.taskId} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-slate-900">{item.taskCode} {item.taskName}</p>
                            <span className="inline-block text-[10px] font-mono bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded mt-0.5">
                              {item.severityBadge}
                            </span>
                          </td>

                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-800">{item.originalAssignee}</span>
                            <span className="block text-[10px] text-rose-600 font-medium">({item.originalAssigneeReason})</span>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center">
                                {item.recommendedAssigneeInitials}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{item.recommendedAssignee}</p>
                                <p className="text-[10px] text-slate-500">{item.recommendedRole}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            {item.fitScore}%
                          </td>

                          <td className="py-2.5 px-3 font-mono text-slate-700 font-medium">
                            {item.capacityDelta}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Systemic Impact Summary</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong className="text-emerald-700">Zero SLA breaches predicted.</strong> {mockReallocationPlan.impactSummary.loadShift}
                  </p>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">SPRINT BURN RATE</span>
                  <span className="font-bold text-emerald-700">{mockReallocationPlan.impactSummary.burnRateStatus}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isApplied && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                navigate('/copilot');
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <span>Run Alternative Simulation</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition"
              >
                Review Changes & Diff
              </button>

              <button
                onClick={handleApply}
                disabled={isApplying}
                className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isApplying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Applying Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Reallocation Immediately</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
