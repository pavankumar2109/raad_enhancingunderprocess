import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, Bell, HelpCircle, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onOpenReallocationModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReallocationModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Command Center';
      case '/employees': return 'Employee Directory';
      case '/tasks': return 'Task Matrix';
      case '/copilot': return 'AI Workforce Copilot';
      case '/reallocation': return 'Reallocation Planner';
      case '/skills': return 'Skill Competency & Gaps';
      case '/analytics': return 'Workforce Analytics';
      case '/forecasting': return 'Capacity Forecasting';
      case '/alerts': return 'Risk & SLA Alerts';
      case '/reports': return 'Intelligence Reports';
      case '/settings': return 'System Settings';
      default: return 'Command Center';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tasks?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-serif font-bold text-slate-800 tracking-tight">RAAD</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-medium text-slate-600">{getPageTitle()}</span>
      </div>

      {/* Center Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-96">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, skills, personnel..."
            className="w-full bg-slate-100/80 border border-slate-200 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
          />
          <kbd className="absolute right-3 top-1.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 rounded border border-slate-300/50">
            ⌘K
          </kbd>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* + New Reallocation Plan button (matches Stitch exact styling) */}
        <button
          onClick={() => {
            if (onOpenReallocationModal) {
              onOpenReallocationModal();
            } else {
              navigate('/copilot');
            }
          }}
          className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Reallocation Plan</span>
        </button>

        <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
          {/* Notifications */}
          <button 
            onClick={() => navigate('/alerts')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* Help */}
          <button 
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Documentation & Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-amber-50 flex items-center justify-center font-bold text-xs ring-2 ring-amber-700/20">
            EV
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Elena Vance</p>
            <p className="text-[11px] text-slate-500 leading-tight">Chief Operations Dir.</p>
          </div>
        </div>
      </div>
    </header>
  );
};
