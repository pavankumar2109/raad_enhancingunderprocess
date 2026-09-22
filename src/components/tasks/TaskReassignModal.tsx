import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import type { Task, Employee } from '../../types';
import { apiService } from '../../services/api';

interface TaskReassignModalProps {
  task: Task | null;
  employees: Employee[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedTask: Task, message: string) => void;
}

export const TaskReassignModal: React.FC<TaskReassignModalProps> = ({
  task,
  employees,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !task) return null;

  const handleReassign = async () => {
    if (!selectedEmployeeId) return;
    const emp = employees.find(e => e.id === selectedEmployeeId);
    if (!emp) return;

    setIsSubmitting(true);
    try {
      await apiService.allocateTask(task.id, emp.id);

      const updatedTask: Task = {
        ...task,
        assignedEmployeeId: emp.id,
        assignedEmployeeName: emp.name,
        assignedEmployeeInitials: emp.initials,
        assignedEmployeeRole: emp.role,
        assignedEmployeeAvatarColor: emp.avatarColor,
        status: 'On Track'
      };

      setIsSubmitting(false);
      onClose();
      onSuccess(updatedTask, `Task ${task.taskCode} reassigned to ${emp.name}.`);
    } catch (err) {
      setIsSubmitting(false);
      onSuccess(task, `Failed to reassign task ${task.taskCode}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-slate-900">Direct Manual Reassign</h3>
              <p className="text-[11px] text-slate-500">{task.taskCode} — {task.taskName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">CURRENT ASSIGNEE</span>
            <p className="font-bold text-slate-900">{task.assignedEmployeeName} ({task.assignedEmployeeRole})</p>
            <p className="text-[11px] text-slate-500">Remaining SLA: {task.remainingSla}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select New Assignee:
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role} • {emp.workload}% load)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleReassign}
            disabled={!selectedEmployeeId || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};
