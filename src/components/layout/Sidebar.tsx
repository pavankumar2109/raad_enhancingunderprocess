import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Sparkles, 
  RefreshCw, 
  Award, 
  LineChart, 
  TrendingUp, 
  Bell, 
  FileText, 
  Settings,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  onOpenReallocationModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/tasks', label: 'Tasks', icon: ClipboardList },
    { path: '/copilot', label: 'AI Copilot', icon: Sparkles, badge: '+ AI', badgeClass: 'bg-amber-100 text-amber-800 font-semibold' },
    { path: '/reallocation', label: 'Reallocation', icon: RefreshCw },
    { path: '/skills', label: 'Skills', icon: Award },
    { path: '/analytics', label: 'Analytics', icon: LineChart },
    { path: '/forecasting', label: 'Forecasting', icon: TrendingUp },
    { path: '/alerts', label: 'Alerts', icon: Bell, badge: '3', badgeClass: 'bg-rose-100 text-rose-700 font-bold' },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200/90 flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">RAAD</span>
              <span className="text-[10px] uppercase tracking-wider bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-wide">Workforce Intel</p>
          </div>
        </div>

        {/* Team / Workspace Dropdown Selector */}
        <div className="px-3 py-3">
          <button className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">N</div>
              <span className="truncate">Nordic Enterprise Ops</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-0.5 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100/70 text-blue-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Footer */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50">
        <div className="bg-[#edf5fd] rounded-xl p-3 border border-blue-100 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Engine: Allocator v4.2</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 pl-4">Status: System Healthy</p>
        </div>
      </div>
    </aside>
  );
};
