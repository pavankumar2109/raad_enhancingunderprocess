import React from 'react';
import { X, Clock, Sparkles } from 'lucide-react';
import type { Task } from '../../types';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onReallocate?: (task: Task) => void;
  onReassign?: (task: Task) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onReallocate,
  onReassign
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">{task.taskCode}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                task.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {task.priority} Priority
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-slate-900 mt-0.5">{task.taskName}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">WORKSTREAM & DESCRIPTION</span>
            <p className="text-slate-600 leading-relaxed">{task.description}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Workstream:</span>
              <span className="font-bold text-slate-900">{task.workstream}</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Assigned Engineer:</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <div className={`w-4 h-4 rounded-full ${task.assignedEmployeeAvatarColor} text-white text-[9px] flex items-center justify-center`}>
                  {task.assignedEmployeeInitials}
                </div>
                <span>{task.assignedEmployeeName}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2 font-mono">
              <span className="text-slate-500 font-medium">Remaining SLA:</span>
              <span className="font-bold text-rose-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.remainingSla}</span>
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2 font-mono">
              <span className="text-slate-500 font-medium">AI Skill Compatibility:</span>
              <span className="font-bold text-amber-800">{task.aiSkillMatch}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Status:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                {task.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {onReassign && (
              <button
                onClick={() => { onClose(); onReassign(task); }}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition"
              >
                Reassign
              </button>
            )}
            {onReallocate && (
              <button
                onClick={() => { onClose(); onReallocate(task); }}
                className="px-4 py-2 bg-[#795914] hover:bg-[#63480f] text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reallocate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
