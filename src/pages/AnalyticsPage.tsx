import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const utilizationData = [
    { time: '08:00', utilization: 62, target: 70 },
    { time: '10:00', utilization: 84, target: 70 },
    { time: '12:00', utilization: 95, target: 70 },
    { time: '14:00', utilization: 78, target: 70 },
    { time: '16:00', utilization: 88, target: 70 },
    { time: '18:00', utilization: 65, target: 70 },
  ];

  const teamWorkloadData = [
    { team: 'Platform Eng', workload: 92, capacity: 100 },
    { team: 'Core Infra', workload: 68, capacity: 100 },
    { team: 'Observability', workload: 52, capacity: 100 },
    { team: 'SecOps', workload: 76, capacity: 100 },
    { team: 'Data Infra', workload: 60, capacity: 100 },
  ];

  const taskCompletionData = [
    { day: 'Mon', completed: 18, assigned: 20 },
    { day: 'Tue', completed: 22, assigned: 24 },
    { day: 'Wed', completed: 15, assigned: 22 },
    { day: 'Thu', completed: 25, assigned: 25 },
    { day: 'Fri', completed: 19, assigned: 21 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
          Workforce Intelligence & Telemetry Analytics
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Historical and real-time visualization of capacity trends, team workload, and SLA compliance metrics.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Workforce Utilization Trend */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">REAL-TIME TELEMETRY</span>
            <h3 className="text-base font-bold font-serif text-slate-900">Workforce Utilization (%)</h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="utilization" stroke="#795914" fill="#fef3c7" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Team Workload Distribution */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">CAPACITY ALLOCATION</span>
            <h3 className="text-base font-bold font-serif text-slate-900">Team Workload vs Capacity</h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="team" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="workload" fill="#1e293b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Task Completion Velocity */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">SPRINT VELOCITY</span>
            <h3 className="text-base font-bold font-serif text-slate-900">Daily Task Completion vs Assigned</h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assigned" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: SLA Exposure Distribution */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">INCIDENT PREVENTATIVE TELEMETRY</span>
            <h3 className="text-base font-bold font-serif text-slate-900">SLA Risk Horizon Breakdown</h3>
          </div>

          <div className="p-6 bg-slate-50 rounded-xl space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">SLA Compliance Rate</span>
              <span className="font-mono font-bold text-sky-700 text-lg">81.9%</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
              <div className="bg-sky-500 h-full" style={{ width: '81.9%' }} />
              <div className="bg-amber-500 h-full" style={{ width: '11.1%' }} />
              <div className="bg-rose-600 h-full" style={{ width: '7.0%' }} />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] font-mono">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-sky-700 font-bold block">59 On Track</span>
                <span className="text-slate-400 text-[9px]">&gt;12h remaining</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-amber-700 font-bold block">8 Approaching</span>
                <span className="text-slate-400 text-[9px]">4-12h remaining</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-rose-700 font-bold block">5 Critical</span>
                <span className="text-slate-400 text-[9px]">&lt;4h remaining</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
