import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, MapPin, X } from 'lucide-react';
import { apiService } from '../services/api';
import type { Employee } from '../types';

export const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    apiService.getEmployees().then(setEmployees);
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTeam = teamFilter === 'ALL' || emp.team === teamFilter;

    return matchesSearch && matchesTeam;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Overloaded':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      case 'Optimal Available':
        return 'bg-sky-100 text-sky-800 border-sky-200 font-semibold';
      case 'Steady Load':
        return 'bg-amber-100 text-amber-800 border-amber-200 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-semibold';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Workforce Directory & Capacity
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time headcount utilization, skill profiles, and active load metrics across Nordic Enterprise Ops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 font-bold">
            32 Active Engineers
          </span>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, role, or skill..."
            className="w-full bg-slate-100/80 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            aria-label="Filter employees by team"
            className="bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Teams</option>
            <option value="Platform Engineering">Platform Engineering</option>
            <option value="Core Infrastructure">Core Infrastructure</option>
            <option value="Observability Hub">Observability Hub</option>
            <option value="SecOps Boundary">SecOps Boundary</option>
            <option value="Data Infra & Telemetry">Data Infra & Telemetry</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 font-bold">
                <th className="py-3 px-4">EMPLOYEE</th>
                <th className="py-3 px-4">ROLE & TEAM</th>
                <th className="py-3 px-4">SKILLS</th>
                <th className="py-3 px-4">WORKLOAD</th>
                <th className="py-3 px-4">CAPACITY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${emp.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {emp.initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{emp.name}</p>
                        <p className="text-[10px] text-slate-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{emp.role}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{emp.team}</p>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {emp.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-200">
                          {skill}
                        </span>
                      ))}
                      {emp.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-mono self-center">
                          +{emp.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 w-8">{emp.workload}%</span>
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${emp.workload > 85 ? 'bg-rose-600' : emp.workload >= 65 ? 'bg-amber-600' : 'bg-slate-700'}`}
                          style={{ width: `${emp.workload}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-700">
                    {emp.capacity}h / wk
                  </td>

                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getStatusBadge(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg transition"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Drawer / Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${selectedEmployee.avatarColor} text-white font-bold text-sm flex items-center justify-center`}>
                    {selectedEmployee.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-slate-900">{selectedEmployee.name}</h3>
                    <p className="text-xs text-slate-500">{selectedEmployee.role}</p>
                  </div>
                </div>

                <button onClick={() => setSelectedEmployee(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">CONTACT & LOCATION</span>
                  <p className="text-xs text-slate-700 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedEmployee.email}</span>
                  </p>
                  <p className="text-xs text-slate-700 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedEmployee.location}</span>
                  </p>
                </div>

                <div className="space-y-1 border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">TEAM & DEPLOYMENT</span>
                  <p className="text-xs font-semibold text-slate-900">{selectedEmployee.team}</p>
                  <p className="text-xs text-slate-600">Active tasks assigned: {selectedEmployee.activeTasksCount}</p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">SKILL GRAPH COMPETENCIES</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEmployee.skills.map((skill, i) => (
                      <span key={i} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md font-mono border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">WORKLOAD & CAPACITY METER</span>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Utilization</span>
                      <span className="font-mono text-rose-700">{selectedEmployee.workload}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${selectedEmployee.workload > 85 ? 'bg-rose-600' : 'bg-slate-800'}`} style={{ width: `${selectedEmployee.workload}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedEmployee(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
