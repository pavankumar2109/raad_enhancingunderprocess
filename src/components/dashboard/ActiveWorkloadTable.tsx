import React, { useState } from 'react';
import { Search, Filter, Download, MoreVertical } from 'lucide-react';
import type { Task } from '../../types';

interface ActiveWorkloadTableProps {
  tasks: Task[];
  onReallocateTask?: (task: Task) => void;
  onViewTaskDetails?: (task: Task) => void;
}

export const ActiveWorkloadTable: React.FC<ActiveWorkloadTableProps> = ({
  tasks,
  onReallocateTask,
  onViewTaskDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = 
      t.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.taskCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedEmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.workstream.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Critical Breach':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'Approaching':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
      case 'Optimal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
      case 'On Track':
      default:
        return 'bg-sky-100 text-sky-800 border-sky-300 font-semibold';
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 font-serif">Active Workload Allocations</h3>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
              Live sync active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Task assignment matrix sorted by risk priority and skill confidence mapping.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter tasks..."
              className="bg-slate-100/80 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative flex items-center">
            <Filter className="w-3 h-3 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter tasks by status"
              className="bg-slate-100/80 border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">Status: All</option>
              <option value="Critical Breach">Critical Breach</option>
              <option value="Approaching">Approaching</option>
              <option value="On Track">On Track</option>
              <option value="Optimal">Optimal</option>
            </select>
          </div>

          {/* Export */}
          <button 
            onClick={() => alert('Exporting Active Workload Allocations CSV...')}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              <th className="py-3 px-4">TASK NAME & WORKSTREAM</th>
              <th className="py-3 px-4">ASSIGNED EMPLOYEE</th>
              <th className="py-3 px-4">AI SKILL MATCH</th>
              <th className="py-3 px-4">REMAINING SLA</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No matching tasks found.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/70 transition">
                  {/* Task Name & Workstream */}
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-bold text-slate-900 text-xs leading-snug">{task.taskName}</p>
                      <p className="text-[11px] text-slate-500">{task.workstream}</p>
                    </div>
                  </td>

                  {/* Assigned Employee */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${task.assignedEmployeeAvatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                        {task.assignedEmployeeInitials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight">{task.assignedEmployeeName}</p>
                        <p className="text-[10px] text-slate-500">{task.assignedEmployeeRole}</p>
                      </div>
                    </div>
                  </td>

                  {/* AI Skill Match Bar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono w-7 text-right">{task.aiSkillMatch}%</span>
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-700 rounded-full"
                          style={{ width: `${task.aiSkillMatch}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Remaining SLA */}
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {task.remainingSla}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full border ${getStatusBadge(task.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{task.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {task.status === 'Critical Breach' ? (
                        <button
                          onClick={() => onReallocateTask && onReallocateTask(task)}
                          className="bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-bold px-2.5 py-1 rounded transition shadow-2xs"
                        >
                          Reallocate
                        </button>
                      ) : (
                        <button
                          onClick={() => onReallocateTask && onReallocateTask(task)}
                          className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded transition"
                        >
                          Reassign
                        </button>
                      )}

                      <button
                        onClick={() => onViewTaskDetails && onViewTaskDetails(task)}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded transition"
                      >
                        Details
                      </button>

                      <button 
                        onClick={() => onViewTaskDetails && onViewTaskDetails(task)}
                        aria-label="More task options"
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 pt-1">
        <p className="font-mono text-[11px]">
          Showing <span className="font-bold text-slate-800">{filteredTasks.length}</span> of 72 tasks •{' '}
          <span className="text-slate-600 font-semibold">RAAD Engine v4.2 continuous auto-balancing</span>
        </p>

        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-600 font-medium text-[11px] disabled:opacity-50">
            Previous
          </button>
          <span className="font-mono text-[11px]">Page 1 of 15</span>
          <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-600 font-medium text-[11px]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
