import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Clock, Sparkles, UserPlus, Info } from 'lucide-react';
import { TaskReallocateModal } from '../components/tasks/TaskReallocateModal';
import { TaskReassignModal } from '../components/tasks/TaskReassignModal';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';
import { ToastContainer, type ToastMessage } from '../components/ui/Toast';
import { apiService } from '../services/api';
import type { Task, Employee } from '../types';

export const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Task-specific modal states
  const [taskToReallocate, setTaskToReallocate] = useState<Task | null>(null);
  const [taskToReassign, setTaskToReassign] = useState<Task | null>(null);
  const [taskToViewDetails, setTaskToViewDetails] = useState<Task | null>(null);

  // Toast notification state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    Promise.all([
      apiService.getTasks(),
      apiService.getEmployees()
    ]).then(([tData, eData]) => {
      setTasks(tData);
      setEmployees(eData);

      // Check URL query parameters for selected task
      const selectedId = searchParams.get('selected') || searchParams.get('task') || searchParams.get('query');
      const reallocateId = searchParams.get('reallocate');

      if (reallocateId) {
        const found = tData.find(t => t.id === reallocateId || t.taskCode === reallocateId);
        if (found) setTaskToReallocate(found);
      } else if (selectedId) {
        const found = tData.find(t => t.id === selectedId || t.taskCode === selectedId);
        if (found) setTaskToViewDetails(found);
      }
    });
  }, [searchParams]);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = 
      t.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.taskCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedEmployeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.workstream.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'Urgent':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
    }
  };

  const handleTaskUpdated = (updatedTask: Task, message: string) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    addToast('Task Allocation Updated', message, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Active Task Matrix & SLA Horizon
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {tasks.length} sprint commitments monitored continuously for SLA breach risks and AI skill alignment.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-lg font-bold">
            {tasks.filter(t => t.priority === 'Critical' || t.status === 'Critical Breach').length} SLA Critical Breaches
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search task code, name, assignee..."
            className="w-full bg-slate-100/80 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter tasks by priority"
            className="bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">Priority: All</option>
            <option value="Critical">Critical</option>
            <option value="Urgent">Urgent</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  {task.taskCode}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{task.taskName}</h3>
              <p className="text-xs text-slate-500">{task.workstream}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 text-[11px]">Assignee:</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-900">
                  <div className={`w-4 h-4 rounded-full ${task.assignedEmployeeAvatarColor} text-white text-[9px] font-bold flex items-center justify-center`}>
                    {task.assignedEmployeeInitials}
                  </div>
                  <span>{task.assignedEmployeeName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-600 font-mono text-[11px]">
                <span className="text-slate-400">Remaining SLA:</span>
                <span className="font-bold text-rose-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{task.remainingSla}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">AI Skill Match:</span>
                <span className="font-bold text-amber-800 font-mono">{task.aiSkillMatch}%</span>
              </div>

              {/* Action Buttons: Problem 3 (Reallocate), Problem 4 (Reassign), Problem 5 (Details) */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setTaskToReassign(task)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition"
                  title="Direct manual assignment"
                >
                  <UserPlus className="w-3 h-3 text-slate-500" />
                  <span>Reassign</span>
                </button>

                <button
                  onClick={() => setTaskToReallocate(task)}
                  className="px-2.5 py-1 bg-[#795914] hover:bg-[#63480f] text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 shadow-2xs transition cursor-pointer"
                  title="Decision-oriented AI reallocation workflow"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Reallocate</span>
                </button>

                <button
                  onClick={() => setTaskToViewDetails(task)}
                  className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium rounded-lg flex items-center gap-1 transition"
                  title="View exact task details"
                >
                  <Info className="w-3 h-3 text-slate-400" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task-Specific Modals */}
      <TaskReallocateModal
        task={taskToReallocate}
        employees={employees}
        isOpen={!!taskToReallocate}
        onClose={() => setTaskToReallocate(null)}
        onSuccess={handleTaskUpdated}
      />

      <TaskReassignModal
        task={taskToReassign}
        employees={employees}
        isOpen={!!taskToReassign}
        onClose={() => setTaskToReassign(null)}
        onSuccess={handleTaskUpdated}
      />

      <TaskDetailsModal
        task={taskToViewDetails}
        isOpen={!!taskToViewDetails}
        onClose={() => setTaskToViewDetails(null)}
        onReallocate={(t) => setTaskToReallocate(t)}
        onReassign={(t) => setTaskToReassign(t)}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
