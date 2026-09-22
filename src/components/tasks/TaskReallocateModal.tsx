import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  UserCheck 
} from 'lucide-react';
import type { Task, Employee } from '../../types';
import { apiService } from '../../services/api';

interface TaskReallocateModalProps {
  task: Task | null;
  employees: Employee[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedTask: Task, message: string) => void;
}

export const TaskReallocateModal: React.FC<TaskReallocateModalProps> = ({
  task,
  employees,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidates, setCandidates] = useState<Array<{
    employee: Employee;
    skillMatch: number;
    workload: number;
    availability: string;
    slaCompatibility: 'Safe' | 'At Risk' | 'Optimal';
    conflict: string | null;
  }>>([]);

  useEffect(() => {
    if (!task) return;

    // Calculate candidate fit scores dynamically based on task skills & current workload
    const taskSkills = task.description 
      ? task.description.split('requiring ')[1]?.split(' under')[0]?.split(', ') || ['Python', 'SQL']
      : ['Python', 'SQL'];

    const evaluated = employees.map((emp) => {
      // Basic skill match calculation
      const matching = emp.skills.filter(s => taskSkills.some(ts => ts.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ts.toLowerCase())));
      const skillScore = Math.min(98, Math.max(70, Math.round(75 + (matching.length * 8) + (emp.workload < 70 ? 10 : 0))));
      
      const slaCompatibility: 'Safe' | 'At Risk' | 'Optimal' = 
        emp.workload > 85 ? 'At Risk' : emp.workload < 60 ? 'Optimal' : 'Safe';
      
      const conflict = emp.workload >= 85 ? 'High load (Over 85%)' : emp.id === task.assignedEmployeeId ? 'Current Assignee' : null;

      return {
        employee: emp,
        skillMatch: skillScore,
        workload: emp.workload,
        availability: emp.status === 'Overloaded' ? 'Limited' : 'Available',
        slaCompatibility,
        conflict
      };
    });

    // Sort by best match & workload headroom
    evaluated.sort((a, b) => b.skillMatch - a.skillMatch || a.workload - b.workload);
    setCandidates(evaluated.filter(c => c.employee.id !== task.assignedEmployeeId));
    
    if (evaluated.length > 0) {
      setSelectedCandidate(evaluated.find(c => c.employee.id !== task.assignedEmployeeId)?.employee || null);
    }
  }, [task, employees]);

  if (!isOpen || !task) return null;

  const handleConfirm = async () => {
    if (!selectedCandidate) return;

    setIsSubmitting(true);
    try {
      await apiService.allocateTask(task.id, selectedCandidate.id);
      
      const updatedTask: Task = {
        ...task,
        assignedEmployeeId: selectedCandidate.id,
        assignedEmployeeName: selectedCandidate.name,
        assignedEmployeeInitials: selectedCandidate.initials,
        assignedEmployeeRole: selectedCandidate.role,
        assignedEmployeeAvatarColor: selectedCandidate.avatarColor,
        aiSkillMatch: candidates.find(c => c.employee.id === selectedCandidate.id)?.skillMatch || 92,
        status: 'On Track'
      };

      setIsSubmitting(false);
      onClose();
      onSuccess(updatedTask, `Reallocation completed — ${task.taskCode} assigned to ${selectedCandidate.name}.`);
    } catch (err) {
      setIsSubmitting(false);
      onSuccess(task, `Failed to reallocate ${task.taskCode}. Please try again.`);
    }
  };

  const activeCandidateEval = candidates.find(c => c.employee.id === selectedCandidate?.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-serif text-slate-900">
                  Task Reallocation Planner
                </h2>
                <span className="text-xs font-mono bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-bold">
                  {task.taskCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                AI precision allocation evaluated for {task.taskName}
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

        {/* Task Header Context */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">SELECTED TASK FOR REALLOCATION</span>
                <h3 className="text-base font-bold text-slate-900">{task.taskCode} — {task.taskName}</h3>
                <p className="text-xs text-slate-500">{task.workstream}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA: {task.remainingSla}</span>
                </span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  {task.priority} Priority
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">CURRENT ASSIGNEE</span>
                <p className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <span className={`w-4 h-4 rounded-full ${task.assignedEmployeeAvatarColor} text-white text-[9px] flex items-center justify-center`}>
                    {task.assignedEmployeeInitials}
                  </span>
                  <span>{task.assignedEmployeeName}</span>
                  <span className="text-rose-600 text-[10px] font-mono">(95% Capacity)</span>
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-mono">REQUIRED SKILL PROFILE</span>
                <p className="font-semibold text-slate-700 mt-0.5">
                  {task.description.split('requiring ')[1]?.split(' under')[0] || 'Python, Distributed Systems, K8s'}
                </p>
              </div>
            </div>
          </div>

          {/* Qualified Candidates Section */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>QUALIFIED ALTERNATIVE CANDIDATES ({candidates.length} EVALUATED)</span>
              <span className="text-slate-400 font-normal">Sorted by Skill & Capacity Score</span>
            </h4>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {candidates.slice(0, 5).map((cand) => {
                const isSelected = selectedCandidate?.id === cand.employee.id;
                return (
                  <div
                    key={cand.employee.id}
                    onClick={() => setSelectedCandidate(cand.employee)}
                    className={`border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${cand.employee.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {cand.employee.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-xs">{cand.employee.name}</p>
                          <span className="text-[10px] font-mono text-slate-500">{cand.employee.role}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>Team: <strong>{cand.employee.team}</strong></span>
                          <span>•</span>
                          <span>Workload: <strong className={cand.workload > 80 ? 'text-rose-600' : 'text-emerald-700'}>{cand.workload}%</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">FIT SCORE</span>
                        <span className="font-extrabold text-amber-800">{cand.skillMatch}%</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">SLA IMPACT</span>
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          cand.slaCompatibility === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                          cand.slaCompatibility === 'Safe' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {cand.slaCompatibility}
                        </span>
                      </div>

                      <div className="w-5 h-5 flex items-center justify-center">
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-[#795914] text-white flex items-center justify-center text-[10px]">✓</div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Reallocation Impact Summary */}
          {selectedCandidate && (
            <div className="bg-amber-50/50 border border-amber-200/90 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Proposed Allocation Shift Comparison</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">CURRENT ASSIGNMENT</span>
                  <p className="font-bold text-slate-900 mt-1">{task.assignedEmployeeName}</p>
                  <p className="text-[11px] text-slate-500">Workload: 95% → 82% (Offloaded)</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-300">
                  <span className="text-[10px] font-mono text-amber-800 block uppercase font-bold">NEW PROPOSED ASSIGNMENT</span>
                  <p className="font-bold text-slate-900 mt-1">{selectedCandidate.name}</p>
                  <p className="text-[11px] text-slate-500">
                    Workload: {selectedCandidate.workload}% → {Math.min(100, selectedCandidate.workload + 12)}% ({activeCandidateEval?.slaCompatibility} SLA)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selectedCandidate || isSubmitting}
            className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Reallocating task via RAAD engine...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Confirm Reallocation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
