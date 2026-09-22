import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Zap, 
  Layers, 
  AlertTriangle, 
  Download, 
  ChevronDown, 
  RotateCcw,
  Check
} from 'lucide-react';
import { BottleneckAlert } from '../components/dashboard/BottleneckAlert';
import { WorkloadDistribution } from '../components/dashboard/WorkloadDistribution';
import { SlaHealthDonut } from '../components/dashboard/SlaHealthDonut';
import { ActiveWorkloadTable } from '../components/dashboard/ActiveWorkloadTable';
import { ReallocationModal } from '../components/reallocation/ReallocationModal';
import { TaskReallocateModal } from '../components/tasks/TaskReallocateModal';
import { TaskReassignModal } from '../components/tasks/TaskReassignModal';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';
import { ToastContainer, type ToastMessage } from '../components/ui/Toast';
import { apiService } from '../services/api';
import type { Employee, Task, SlaHealthSummary } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [slaHealth, setSlaHealth] = useState<SlaHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBottleneckAlert, setShowBottleneckAlert] = useState(true);
  
  // Modals state
  const [isReallocationModalOpen, setIsReallocationModalOpen] = useState(false);
  const [taskToReallocate, setTaskToReallocate] = useState<Task | null>(null);
  const [taskToReassign, setTaskToReassign] = useState<Task | null>(null);
  const [taskToViewDetails, setTaskToViewDetails] = useState<Task | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Problem 1 — Team Selector Dropdown State & Refs
  const teamOptions = [
    'Engineering & Platform Ops',
    'Core Infrastructure',
    'Observability Hub',
    'SecOps Boundary',
    'Data Engineering',
    'AI/ML Engineering'
  ];
  const [selectedTeam, setSelectedTeam] = useState<string>('Engineering & Platform Ops');
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empData, taskData, slaData] = await Promise.all([
          apiService.getEmployees(),
          apiService.getTasks(),
          apiService.getSlaHealth()
        ]);
        setEmployees(empData);
        setTasks(taskData);
        setSlaHealth(slaData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Outside click & Escape key listener for Team Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTeamDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTeamDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter employees and tasks dynamically by selected team
  const filteredEmployees = selectedTeam === 'Engineering & Platform Ops'
    ? employees
    : employees.filter((e) => e.team.toLowerCase().includes(selectedTeam.toLowerCase()) || selectedTeam.toLowerCase().includes(e.team.toLowerCase()));

  const filteredTasks = selectedTeam === 'Engineering & Platform Ops'
    ? tasks
    : tasks.filter((t) => t.team.toLowerCase().includes(selectedTeam.toLowerCase()) || t.workstream.toLowerCase().includes(selectedTeam.toLowerCase()));

  const handleReallocateTask = (task: Task) => {
    setTaskToReallocate(task);
  };

  const handleReassignTask = (task: Task) => {
    setTaskToReassign(task);
  };

  const handleViewTaskDetails = (task: Task) => {
    setTaskToViewDetails(task);
  };

  const handleTaskUpdated = (updatedTask: Task, message: string) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    addToast('Task Allocation Updated', message, 'success');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Task Code,Task Name,Assignee,SLA,Status"].join(",") + "\n"
      + tasks.map(e => `${e.taskCode},"${e.taskName}","${e.assignedEmployeeName}",${e.remainingSla},${e.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RAAD_Workforce_Telemetry_${selectedTeam.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Export Successful', `Exported ${tasks.length} active allocations to CSV.`, 'info');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-mono">Initializing RAAD Workforce Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* Top Telemetry Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500">
              DECISION RUNTIME: ACTIVE
            </span>
            <span className="text-[10px] font-mono text-slate-400">|</span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">
              CLUSTER-ID: NORDIC-09
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Workforce Command Center
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            AI-powered workforce intelligence and real-time precision allocation. Telemetry monitoring {filteredEmployees.length} active engineers across {selectedTeam}.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium flex items-center gap-2 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Today, Oct 24 • Live Stream</span>
          </div>

          {/* PROBLEM 1 — Interactive Team Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsTeamDropdownOpen(!isTeamDropdownOpen);
                }
              }}
              aria-haspopup="listbox"
              aria-expanded={isTeamDropdownOpen}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition flex items-center gap-2 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <span>{selectedTeam}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isTeamDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTeamDropdownOpen && (
              <div 
                role="listbox"
                className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-1.5 text-xs animate-fade-in"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Workstream Unit
                </div>
                {teamOptions.map((team) => {
                  const isSelected = selectedTeam === team;
                  return (
                    <button
                      key={team}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedTeam(team);
                        setIsTeamDropdownOpen(false);
                        addToast('Workstream Context Filtered', `Filtered Command Center telemetry for ${team}.`, 'info');
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition cursor-pointer ${
                        isSelected ? 'bg-amber-50 text-[#795914] font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <span>{team}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#795914]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsReallocationModalOpen(true)}
            className="bg-[#475569] hover:bg-slate-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Simulate Reallocation</span>
          </button>

          <button 
            onClick={handleExportCSV}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 4 KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: TOTAL WORKFORCE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                TOTAL WORKFORCE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 font-serif">{filteredEmployees.length}</span>
                <span className="text-xs text-slate-600 font-semibold">Engineers</span>
              </div>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              • 94% verified active
            </span>
            <span className="text-slate-500">2 on scheduled leave</span>
          </div>
        </div>

        {/* KPI 2: IMMEDIATE AVAILABILITY */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                IMMEDIATE AVAILABILITY
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 font-serif">
                  {filteredEmployees.filter(e => e.workload < 80).length}
                </span>
                <span className="text-xs text-slate-600 font-semibold">Available</span>
              </div>
            </div>
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/60">
              ➔ 75% unblocked capacity
            </span>
            <span className="text-slate-500 font-mono">192h total headroom</span>
          </div>
        </div>

        {/* KPI 3: ACTIVE TASKS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                ACTIVE TASKS
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 font-serif">{filteredTasks.length}</span>
                <span className="text-xs text-slate-600 font-semibold">In Flight</span>
              </div>
            </div>
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-medium">Across {selectedTeam}</span>
            <span className="font-mono text-slate-700 font-semibold">Avg: 2.2 / eng</span>
          </div>
        </div>

        {/* KPI 4: SLA EXPOSURE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                SLA EXPOSURE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-rose-700 font-serif">
                  {filteredTasks.filter(t => t.status === 'Critical Breach' || t.status === 'Approaching').length || 8}
                </span>
                <span className="text-xs text-slate-600 font-semibold">Tickets at Risk</span>
              </div>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              • 5 critical (&lt;4h)
            </span>
            <span className="text-amber-800 font-medium">3 approaching</span>
          </div>
        </div>

      </div>

      {/* BOTTLENECK DETECTION ALERT */}
      {showBottleneckAlert && (
        <BottleneckAlert
          onReviewRecommendation={() => navigate('/copilot')}
          onDismiss={() => setShowBottleneckAlert(false)}
        />
      )}

      {/* MIDDLE SECTION: WORKLOAD & SLA DONUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkloadDistribution employees={filteredEmployees} />
        </div>
        <div>
          {slaHealth && (
            <SlaHealthDonut 
              slaHealth={slaHealth} 
              onOpenCopilot={() => navigate('/copilot')} 
            />
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: ACTIVE WORKLOAD ALLOCATIONS TABLE */}
      <ActiveWorkloadTable
        tasks={filteredTasks}
        onReallocateTask={handleReallocateTask}
        onViewTaskDetails={handleViewTaskDetails}
      />

      {/* MODALS & TOASTS */}
      <ReallocationModal
        isOpen={isReallocationModalOpen}
        onClose={() => setIsReallocationModalOpen(false)}
      />

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
        onReallocate={handleReallocateTask}
        onReassign={handleReassignTask}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
