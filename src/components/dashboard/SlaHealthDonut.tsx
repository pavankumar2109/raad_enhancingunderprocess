import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Clock, ChevronRight } from 'lucide-react';
import type { SlaHealthSummary } from '../../types';

interface SlaHealthDonutProps {
  slaHealth: SlaHealthSummary;
  onOpenCopilot?: () => void;
}

export const SlaHealthDonut: React.FC<SlaHealthDonutProps> = ({ slaHealth, onOpenCopilot }) => {
  const navigate = useNavigate();

  const data = [
    { name: 'On Track', value: slaHealth.onTrackCount, color: '#38bdf8' }, // sky-400
    { name: 'At Risk', value: slaHealth.atRiskCount, color: '#f59e0b' },   // amber-500
    { name: 'Critical', value: slaHealth.criticalCount, color: '#dc2626' }, // red-600
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
              SERVICE LEVEL AGREEMENTS
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-serif">SLA Health Distribution</h3>
          </div>

          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
            {slaHealth.totalTasks} TOTAL
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Automated threshold monitoring across active commitments.
        </p>

        {/* Donut Chart with Center Text */}
        <div className="relative h-44 flex items-center justify-center my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-serif">
              {slaHealth.compliantPercentage}%
            </span>
            <span className="text-[9px] font-mono uppercase font-bold text-slate-500 tracking-wider">
              SLA COMPLIANT
            </span>
          </div>
        </div>

        {/* 3 Metric Breakdown Cards */}
        <div className="grid grid-cols-3 gap-2 text-center mb-5">
          <div className="bg-rose-50 border border-rose-100 p-2 rounded-xl">
            <span className="block text-[10px] font-bold text-rose-700 uppercase tracking-tight">Critical (&lt;4h)</span>
            <span className="text-base font-extrabold text-rose-800">{slaHealth.criticalCount}</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-2 rounded-xl">
            <span className="block text-[10px] font-bold text-amber-700 uppercase tracking-tight">At Risk (4-12h)</span>
            <span className="text-base font-extrabold text-amber-800">{slaHealth.atRiskCount}</span>
          </div>
          <div className="bg-sky-50 border border-sky-100 p-2 rounded-xl">
            <span className="block text-[10px] font-bold text-sky-700 uppercase tracking-tight">On Track (&gt;12h)</span>
            <span className="text-base font-extrabold text-sky-800">{slaHealth.onTrackCount}</span>
          </div>
        </div>

        {/* Urgent Incident Breaches */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block mb-1">
            URGENT INCIDENT BREACHES
          </span>

          {slaHealth.incidentBreaches.map((incident) => (
            <div key={incident.id} className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 leading-tight">
                    {incident.ticketCode} {incident.title}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {incident.team} • {incident.assignedTo}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200 whitespace-nowrap">
                {incident.remainingTime}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer link to AI Rebalance preview */}
      <div className="pt-4 mt-4 border-t border-slate-100">
        <button
          onClick={() => {
            if (onOpenCopilot) onOpenCopilot();
            else navigate('/copilot');
          }}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-amber-800 transition py-1 group"
        >
          <span className="text-left text-[11px]">
            Recommended rebalance ready <span className="font-bold text-amber-800 underline ml-1">Automated Rebalancing Preview</span>
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
        </button>
      </div>
    </div>
  );
};
