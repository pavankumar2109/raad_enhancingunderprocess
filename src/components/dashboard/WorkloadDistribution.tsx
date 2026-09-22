import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Employee } from '../../types';

interface WorkloadDistributionProps {
  employees: Employee[];
}

export const WorkloadDistribution: React.FC<WorkloadDistributionProps> = ({ employees }) => {
  const navigate = useNavigate();

  // Display top 5 key engineers for high-density command center view
  const displayEmployees = employees.slice(0, 5);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Overloaded':
        return 'bg-rose-100 text-rose-700 border-rose-200 font-bold';
      case 'Optimal Available':
        return 'bg-sky-100 text-sky-800 border-sky-200 font-semibold';
      case 'Steady Load':
        return 'bg-amber-100 text-amber-800 border-amber-200 font-semibold';
      case 'Balanced':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-semibold';
    }
  };

  const getProgressBarClass = (workload: number) => {
    if (workload > 85) return 'bg-rose-600';
    if (workload >= 65) return 'bg-amber-600';
    return 'bg-slate-700';
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
              REAL-TIME ALLOCATION
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-serif">Workforce Workload Distribution</h3>
          </div>

          <button
            onClick={() => navigate('/employees')}
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 transition"
          >
            <span>View all 32</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Live telemetry synced with git commits, ticket velocity, and sprint time logs.
        </p>

        {/* Engineer workload progress rows */}
        <div className="space-y-5">
          {displayEmployees.map((emp) => (
            <div key={emp.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full ${emp.avatarColor} text-white font-bold text-[11px] flex items-center justify-center shadow-2xs shrink-0`}>
                    {emp.initials}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 mr-2">{emp.name}</span>
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {emp.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeClass(emp.status)}`}>
                    {emp.status}
                  </span>
                  <span className="font-bold text-slate-900 text-xs w-8 text-right font-mono">
                    {emp.workload}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${getProgressBarClass(emp.workload)}`}
                  style={{ width: `${emp.workload}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span>Healthy (&lt;65%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span>Optimal (65-80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>Critical (&gt;85%)</span>
          </div>
        </div>

        <span className="font-mono text-slate-600 font-semibold">Target Avg: 68.4%</span>
      </div>
    </div>
  );
};
