import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Sparkles, Filter } from 'lucide-react';
import { apiService } from '../services/api';
import type { AlertItem } from '../types';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    apiService.getAlerts().then(setAlerts);
  }, []);

  const filteredAlerts = alerts.filter(a => typeFilter === 'ALL' || a.type === typeFilter);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'Urgent':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Risk & SLA Breach Alerts
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time incident prevention radar categorizing capacity, skill deficit, and SLA exposure signals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter alerts by category risk"
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="SLA Risk">SLA Risk</option>
            <option value="Capacity Risk">Capacity Risk</option>
            <option value="Workload Risk">Workload Risk</option>
            <option value="Skill Gap">Skill Gap</option>
            <option value="Task Risk">Task Risk</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                alert.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {alert.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {alert.timestamp} • {alert.team}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-serif">{alert.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{alert.description}</p>
                <p className="text-xs font-semibold text-slate-800 pt-1">
                  💡 <span className="text-amber-900 font-bold">Recommended Mitigation:</span> {alert.recommendedAction}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/copilot')}
              className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition shadow-2xs shrink-0 cursor-pointer self-start md:self-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mitigate via AI</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
