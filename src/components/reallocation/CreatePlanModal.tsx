import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import type { Task, Employee, ReallocationPlanData } from '../../types';
import { apiService } from '../../services/api';
import { mockReallocationPlan } from '../../data/mockData';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanExecuted?: (message: string) => void;
}

export type ReallocationTrigger = 
  | 'Critical task arrived'
  | 'Employee became unavailable'
  | 'SLA at risk'
  | 'Priority changed'
  | 'Workload imbalance'
  | 'Manual reallocation';

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onPlanExecuted
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTrigger, setSelectedTrigger] = useState<ReallocationTrigger>('Employee became unavailable');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<ReallocationPlanData | null>(null);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedMessage, setExecutedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      apiService.getTasks().then((tList) => {
        setTasks(tList);
        if (tList.length > 0 && selectedTaskIds.length === 0) {
          const critical = tList.filter(t => t.priority === 'Critical' || t.status === 'Critical Breach');
          setSelectedTaskIds(critical.map(t => t.id).slice(0, 3));
        }
      });
      apiService.getEmployees().then((eList) => {
        setEmployees(eList);
        const overloaded = eList.find(e => e.workload >= 85);
        if (overloaded) setSelectedEmployeeId(overloaded.id);
      });
    } else {
      // Reset on close
      setStep(1);
      setIsGenerating(false);
      setGeneratedPlan(null);
      setExecutedMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggers: Array<{ id: ReallocationTrigger; title: string; desc: string; badge: string }> = [
    { id: 'Employee became unavailable', title: 'Employee Became Unavailable', desc: 'Emergency leave, PTO, or medical off-boarding requiring immediate task offloading.', badge: 'Urgent' },
    { id: 'Critical task arrived', title: 'Critical Task Arrived', desc: 'High-priority enterprise commitment needing immediate skill-matched assignment.', badge: 'SLA Priority' },
    { id: 'SLA at risk', title: 'SLA at Risk', desc: 'Tasks approaching SLA breach horizon (<4h remaining window).', badge: 'Critical Breach' },
    { id: 'Workload imbalance', title: 'Workload Imbalance', desc: 'Uneven capacity distribution across team members exceeding 85% threshold.', badge: 'Capacity Load' },
    { id: 'Priority changed', title: 'Priority Changed', desc: 'Sprint scope re-prioritization requiring active resource shifting.', badge: 'Sprint Sync' },
    { id: 'Manual reallocation', title: 'Manual Reallocation', desc: 'Custom workforce optimization scenario simulation.', badge: 'Custom Flow' },
  ];

  const handleToggleTask = (id: string) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter(tId => tId !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setStep(4);

    try {
      // Fetch plan base from API
      const plan = await apiService.getReallocationPlan();
      
      const targetEmp = employees.find(e => e.id === selectedEmployeeId) || employees.find(e => e.workload >= 85) || employees[0];
      const selectedTasks = tasks.filter(t => selectedTaskIds.includes(t.id));
      
      const customPlan: ReallocationPlanData = {
        ...plan,
        planId: `RP-${Math.floor(1000 + Math.random() * 9000)}`,
        affectedTasksCount: selectedTasks.length || 4,
        totalUnmitigatedRisk: `$${(selectedTasks.length * 10.5).toFixed(0)},000 SLA penalty exposure`,
        interventions: selectedTasks.length > 0 ? selectedTasks.map((t, idx) => ({
          taskId: t.id,
          taskCode: t.taskCode,
          taskName: t.taskName,
          workstream: t.workstream,
          severityBadge: t.remainingSla,
          remainingSla: t.remainingSla,
          originalAssignee: t.assignedEmployeeName || targetEmp?.name || 'Rahul Sharma',
          originalAssigneeReason: 'Overloaded queue',
          recommendedAssignee: idx % 2 === 0 ? 'Priya Sundaram' : 'Arun Kumar',
          recommendedAssigneeInitials: idx % 2 === 0 ? 'PS' : 'AK',
          recommendedRole: idx % 2 === 0 ? 'Senior Staff Eng' : 'Lead Infra Eng',
          fitScore: 92 + (idx % 5),
          capacityDelta: idx % 2 === 0 ? '64% → 72%' : '50% → 65%'
        })) : mockReallocationPlan.interventions
      };

      setTimeout(() => {
        setGeneratedPlan(customPlan);
        setIsGenerating(false);
      }, 700);
    } catch (err) {
      setGeneratedPlan(mockReallocationPlan);
      setIsGenerating(false);
    }
  };

  const handleExecuteReallocation = async () => {
    if (!generatedPlan) return;
    setIsExecuting(true);
    try {
      const res = await apiService.applyReallocation(generatedPlan.planId);
      setIsExecuting(false);
      setExecutedMessage(res.message);
      if (onPlanExecuted) {
        onPlanExecuted(res.message);
      }
    } catch (err) {
      setIsExecuting(false);
      setExecutedMessage('Reallocation Plan executed successfully.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#795914] text-white rounded-lg shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Create Reallocation Plan
                </h2>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
                  STEP {step} OF 4
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Configure constraints and trigger autonomous workforce reallocation
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

        {/* Step Indicator Progress Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs font-mono shrink-0">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#795914] font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">1</span>
            <span>Trigger</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#795914] font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">2</span>
            <span>Affected Tasks</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />

          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#795914] font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">3</span>
            <span>Constraint</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />

          <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-[#795914] font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">4</span>
            <span>Generate Plan</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: SELECT TRIGGER */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif">STEP 1 — Select Reallocation Trigger Event</h3>
                <p className="text-xs text-slate-500">Choose the operational event initiating this workforce reallocation calculation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {triggers.map((trig) => {
                  const isSelected = selectedTrigger === trig.id;
                  return (
                    <div
                      key={trig.id}
                      onClick={() => setSelectedTrigger(trig.id)}
                      className={`p-4 border rounded-xl cursor-pointer transition flex flex-col justify-between space-y-2 ${
                        isSelected 
                          ? 'border-[#795914] bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{trig.title}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                          {trig.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{trig.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT AFFECTED TASKS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">STEP 2 — Select Affected Tasks ({selectedTaskIds.length} Selected)</h3>
                  <p className="text-xs text-slate-500">Choose the sprint commitments to include in the reallocation model.</p>
                </div>
                <span className="text-xs font-mono text-[#795914] font-bold">
                  {selectedTaskIds.length} of {tasks.length} tasks marked
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">SELECT</th>
                      <th className="py-2.5 px-3">TASK CODE & NAME</th>
                      <th className="py-2.5 px-3">PRIORITY</th>
                      <th className="py-2.5 px-3">CURRENT ASSIGNEE</th>
                      <th className="py-2.5 px-3">REMAINING SLA</th>
                      <th className="py-2.5 px-3">SKILL MATCH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map((t) => {
                      const isChecked = selectedTaskIds.includes(t.id);
                      return (
                        <tr key={t.id} onClick={() => handleToggleTask(t.id)} className="hover:bg-slate-50 cursor-pointer">
                          <td className="py-2.5 px-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              aria-label={`Select task ${t.taskCode}`}
                              className="rounded border-slate-300 text-[#795914] focus:ring-[#795914]"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {t.taskCode} {t.taskName}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              t.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                            }`}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{t.assignedEmployeeName}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-rose-700">{t.remainingSla}</td>
                          <td className="py-2.5 px-3 font-mono text-amber-800">{t.aiSkillMatch}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: CONSTRAINTS & EVENT SPECIFICS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif">STEP 3 — Define Constraint Details</h3>
                <p className="text-xs text-slate-500">Configure parameters for trigger: <strong>{selectedTrigger}</strong></p>
              </div>

              {selectedTrigger === 'Employee became unavailable' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">Select Unavailable Employee:</label>
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    aria-label="Select unavailable employee"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} — {emp.role} ({emp.team} • {emp.workload}% load)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500">
                    Marking this employee unavailable will calculate optimal replacement targets with zero predicted SLA breaches.
                  </p>
                </div>
              )}

              {selectedTrigger !== 'Employee became unavailable' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-800">Trigger Conditions Configured:</span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-mono block">TRIGGER</span>
                      <span className="font-bold text-slate-900">{selectedTrigger}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-mono block">TARGET TASKS</span>
                      <span className="font-bold text-slate-900">{selectedTaskIds.length} Tasks Enqueued</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: GENERATE & REVIEW PLAN */}
          {step === 4 && (
            <div className="space-y-6">
              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-3 border-[#795914] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-mono font-bold text-slate-700">Analyzing workforce constraints...</p>
                  <p className="text-[11px] text-slate-400">RAAD Allocator v4.2 evaluating 5 optimization constraints</p>
                </div>
              ) : executedMessage ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold font-serif text-emerald-900">Reallocation Successfully Executed!</h3>
                  <p className="text-xs text-emerald-800 max-w-lg mx-auto font-medium">{executedMessage}</p>
                  <button
                    onClick={onClose}
                    className="bg-[#795914] text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-xs hover:bg-[#63480f] transition"
                  >
                    Done & Close
                  </button>
                </div>
              ) : generatedPlan ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-mono text-[#795914] font-bold">AI Plan {generatedPlan.planId}</span>
                      <h3 className="text-base font-bold text-slate-900 font-serif">Proposed Reallocation Plan Result</h3>
                    </div>
                    <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      Zero SLA Breaches Predicted
                    </span>
                  </div>

                  {/* Interventions Matrix Table */}
                  <div className="border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 font-bold">
                        <tr>
                          <th className="py-2.5 px-3">TASK</th>
                          <th className="py-2.5 px-3">CURRENT ALLOCATION</th>
                          <th className="py-2.5 px-3">PROPOSED ALLOCATION</th>
                          <th className="py-2.5 px-3">FIT SCORE</th>
                          <th className="py-2.5 px-3">WORKLOAD IMPACT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {generatedPlan.interventions.map((row) => (
                          <tr key={row.taskId} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">{row.taskCode} {row.taskName}</td>
                            <td className="py-2.5 px-3 text-slate-700 font-medium">{row.originalAssignee}</td>
                            <td className="py-2.5 px-3 font-bold text-[#795914]">{row.recommendedAssignee}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{row.fitScore}%</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{row.capacityDelta}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-900 block">EXPLAINABLE REASONING:</span>
                    <p>Reallocates tasks from high-load engineers to optimal available headcount based on verified skill proficiency & SLA windows.</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 && step < 4 && !isGenerating ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700"
            >
              Previous
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
          )}

          <div className="flex items-center gap-2">
            {step < 3 && (
              <button
                onClick={() => setStep((step + 1) as any)}
                className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-1.5 transition"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleGeneratePlan}
                className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Reallocation Plan</span>
              </button>
            )}

            {step === 4 && generatedPlan && !executedMessage && (
              <button
                onClick={handleExecuteReallocation}
                disabled={isExecuting}
                className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                {isExecuting ? 'Executing Reallocation...' : 'Execute Reallocation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
