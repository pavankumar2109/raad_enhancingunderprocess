import React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, MoreHorizontal, Activity, Wallet, Layers } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from "recharts";

// Utility for class merging
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- Global Styles ---
export function GlobalStyles() {
    return (
    <style>{`
    @keyframes border-beam {
      100% { offset-distance: 100%; }
    }

    .border-beam {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      pointer-events: none;
      border-radius: inherit;
      border: 1px solid transparent;
      mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    .border-beam::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      aspect-ratio: 1;
      width: 100px;
      background: linear-gradient(to left, #6366f1, #a855f7, #ec4899);
      offset-path: rect(0 auto auto 0 round 1.5rem);
      animation: border-beam 4s linear infinite;
    }

    .noise-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 50;
      opacity: 0.05;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
  `}</style>
);
}

// --- Mock Data ---
export const timeRanges = ["Daily", "Monthly", "Yearly"];

export const dashboardData = {
    Daily: [
        { name: "Mon", value: 1200, users: 400, revenue: 120, tx: 50 },
        { name: "Tue", value: 1900, users: 600, revenue: 190, tx: 80 },
        { name: "Wed", value: 1500, users: 500, revenue: 150, tx: 60 },
        { name: "Thu", value: 2800, users: 800, revenue: 280, tx: 110 },
        { name: "Fri", value: 2200, users: 700, revenue: 220, tx: 90 },
        { name: "Sat", value: 3400, users: 1100, revenue: 340, tx: 150 },
        { name: "Sun", value: 3800, users: 1200, revenue: 380, tx: 180 },
    ],
    Monthly: [
        { name: "Jan", value: 12400, users: 4200, revenue: 1240, tx: 520 },
        { name: "Feb", value: 18900, users: 6100, revenue: 1890, tx: 810 },
        { name: "Mar", value: 15500, users: 5100, revenue: 1550, tx: 610 },
        { name: "Apr", value: 28800, users: 8500, revenue: 2880, tx: 1150 },
        { name: "May", value: 22200, users: 7300, revenue: 2220, tx: 930 },
        { name: "Jun", value: 34400, users: 11200, revenue: 3440, tx: 1520 },
        { name: "Jul", value: 38800, users: 12500, revenue: 3880, tx: 1850 },
        { name: "Aug", value: 42100, users: 13100, revenue: 4210, tx: 1950 },
        { name: "Sep", value: 39500, users: 11900, revenue: 3950, tx: 1750 },
        { name: "Oct", value: 45000, users: 14500, revenue: 4500, tx: 2150 },
        { name: "Nov", value: 52000, users: 16500, revenue: 5200, tx: 2550 },
        { name: "Dec", value: 61000, users: 19500, revenue: 6100, tx: 3150 },
    ],
    Yearly: [
        { name: "2020", value: 124000, users: 40000, revenue: 12400, tx: 5000 },
        { name: "2021", value: 218900, users: 65000, revenue: 21890, tx: 8500 },
        { name: "2022", value: 315500, users: 95000, revenue: 31550, tx: 12500 },
        { name: "2023", value: 528800, users: 185000, revenue: 52880, tx: 21500 },
        { name: "2024", value: 822200, users: 275000, revenue: 82220, tx: 35500 },
    ]
};

export const pieData = [
    { name: "Uilora Core", value: 400, color: "#6366f1" },
    { name: "Uilora API", value: 300, color: "#ec4899" },
    { name: "Uilora DB", value: 300, color: "#10b981" },
    { name: "Uilora Analytics", value: 150, color: "#f59e0b" },
];

export const projectFiles = [
    { name: "Uilora Auth Module", status: "Deployed", team: "Core Infra", progress: 100 },
    { name: "Uilora Payment Gateway", status: "In Code Review", team: "Finance", progress: 85 },
    { name: "Uilora Machine Learning", status: "In Progress", team: "Data Science", progress: 45 },
    { name: "Uilora Mobile SDK", status: "Planning", team: "Mobile", progress: 10 },
    { name: "Uilora Edge Network", status: "Deployed", team: "Infra", progress: 100 },
];

// --- Components ---

/**
 * LuminaCard
 * A dark glass card with optional "Border Beam" animation.
 */
export function LuminaCard({ children, className, beam = false }: { children: React.ReactNode; className: string; beam: boolean }) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-2xl transition-all hover:bg-slate-900/70",
            className
        )}>
            {beam && <div className="border-beam rounded-3xl" />}

            {/* Subtle top light reflection */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

            <div className="relative z-10 h-full p-6">
                {children}
            </div>
        </div>
    );
}

/**
 * Nav Button
 */
export function NavItem({ icon: Icon, active, onClick, label }: { icon: LucideIcon; active: boolean; onClick: () => void; label: string }) {
    return (
    <button
        onClick={onClick}
        className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
            active
                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-inner shadow-white/5 border border-white/5"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
    >
        <Icon className={cn("h-5 w-5", active ? "text-indigo-400" : "text-slate-500 group-hover:text-white")} />
        <span>{label}</span>
        {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_currentColor]" />}
    </button>
);
}

export function TimeToggle({ active, onChange }: { active: string; onChange: (val: string) => void }) {
    return (
        <div className="flex bg-white/5 border border-white/5 p-1 rounded-lg">
            {timeRanges.map((range) => (
                <button
                    key={range}
                    onClick={() => onChange(range)}
                    className={cn(
                        "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                        active === range ? "bg-indigo-500/20 text-indigo-300 shadow-md border border-indigo-500/20" : "text-slate-500 hover:text-white"
                    )}
                >
                    {range}
                </button>
            ))}
        </div>
    );
}

// --- Views ---

export function OverviewView({ timeRange }: { timeRange: string }) {
    const activeData = dashboardData[timeRange as keyof typeof dashboardData];
    
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 block pb-24">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LuminaCard beam className="md:col-span-1 bg-gradient-to-br from-indigo-900/40 to-slate-900/40">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            <ArrowUpRight className="h-3 w-3" />
                            +12.5%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 font-medium">Uilora Asset Value</p>
                        <h2 className="text-4xl font-bold text-white mt-1">
                            {timeRange === 'Daily' ? "$84,230" : timeRange === 'Monthly' ? "$412,450" : "$6,400,200"}
                        </h2>
                    </div>
                </LuminaCard>
                {[
                    { label: "Uilora API Processing", val: timeRange === 'Daily' ? "1.2M" : timeRange === 'Monthly' ? "42M" : "450M", icon: Activity, color: "text-indigo-400", bg: "bg-indigo-500/20" },
                    { label: "Active Subscriptions", val: timeRange === 'Daily' ? "+125" : timeRange === 'Monthly' ? "+4,100" : "+82,000", icon: Layers, color: "text-purple-400", bg: "bg-purple-500/20" },
                ].map((stat, i) => (
                    <LuminaCard key={i} className="flex flex-col justify-between" beam={false}>
                        <div className="flex justify-between items-start">
                            <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <button className="text-slate-500 hover:text-white"><MoreHorizontal className="h-5 w-5" /></button>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                            <h2 className="text-3xl font-bold text-white mt-1">{stat.val}</h2>
                        </div>
                    </LuminaCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <LuminaCard className="lg:col-span-2 min-h-[400px]" beam={false}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Uilora Matrix Growth</h3>
                            <p className="text-sm text-slate-500">Infrastructure scaling over time</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activeData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px" }} itemStyle={{ color: "#e2e8f0" }} />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </LuminaCard>

                <LuminaCard className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 flex flex-col justify-center" beam={false}>
                    <h3 className="text-lg font-bold mb-1">Uilora Load Distribution</h3>
                    <p className="text-sm text-slate-500 mb-6">Current compute allocation</p>
                    <div className="h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-2xl font-bold">100%</span>
                            <span className="text-xs text-slate-500">Utilization</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        {pieData.map((asset) => (
                            <div key={asset.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: asset.color }} />
                                    <span className="text-sm font-medium text-slate-300">{asset.name}</span>
                                </div>
                                <span className="text-sm font-bold">{Math.round(asset.value / 10)}%</span>
                            </div>
                        ))}
                    </div>
                </LuminaCard>
            </div>
        </div>
    );
}

export function AnalyticsView({ timeRange }: { timeRange: string }) {
    const activeData = dashboardData[timeRange as keyof typeof dashboardData];
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 block pb-24">
            <LuminaCard className="min-h-[500px]" beam={false}>
                 <div className="flex items-center justify-between mb-8">
                     <div>
                         <h3 className="text-lg font-bold">Uilora Analytics Pipeline</h3>
                         <p className="text-sm text-slate-500">Deep dive into query performance</p>
                     </div>
                 </div>
                 <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={activeData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                             <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                             <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                             <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px" }} />
                             <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                             <Bar dataKey="revenue" fill="#ec4899" radius={[4, 4, 0, 0]} />
                         </BarChart>
                     </ResponsiveContainer>
                 </div>
            </LuminaCard>
        </div>
    );
}

export function FinanceView({ timeRange }: { timeRange: string }) {
    const activeData = dashboardData[timeRange as keyof typeof dashboardData];
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 block pb-24">
             <LuminaCard className="min-h-[500px]" beam={false}>
                 <div className="flex items-center justify-between mb-8">
                     <div>
                         <h3 className="text-lg font-bold">Uilora Treasury</h3>
                         <p className="text-sm text-slate-500">Corporate cash flow</p>
                     </div>
                 </div>
                 <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={activeData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                             <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                             <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px" }} />
                             <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                         </LineChart>
                     </ResponsiveContainer>
                 </div>
             </LuminaCard>
        </div>
    );
}

export function ProjectsView() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 block pb-24">
             <LuminaCard className="bg-gradient-to-br from-indigo-900/20 to-slate-900/20" beam={false}>
                 <div className="flex items-center justify-between mb-8">
                     <div>
                         <h3 className="text-lg font-bold">Uilora Operational Modules</h3>
                         <p className="text-sm text-slate-500">Core architecture deployment status</p>
                     </div>
                     <button className="bg-white/5 border border-white/10 hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm font-medium">Create Module</button>
                 </div>
                 <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm text-slate-300">
                         <thead className="text-xs text-slate-500 uppercase border-b border-white/10">
                             <tr>
                                 <th className="px-4 py-4 font-bold">Module Name</th>
                                 <th className="px-4 py-4 font-bold">Status</th>
                                 <th className="px-4 py-4 font-bold">Owning Team</th>
                                 <th className="px-4 py-4 font-bold">Health / Progress</th>
                             </tr>
                         </thead>
                         <tbody>
                             {projectFiles.map((pf, i) => (
                                 <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                     <td className="px-4 py-4 font-semibold text-white group-hover:text-indigo-400 transition">{pf.name}</td>
                                     <td className="px-4 py-4">
                                         <span className={cn("px-2 py-1 rounded-md text-xs font-bold border", 
                                             pf.status === 'Deployed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                             pf.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                             pf.status === 'Planning' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 
                                             'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                         )}>
                                             {pf.status}
                                         </span>
                                     </td>
                                     <td className="px-4 py-4">{pf.team}</td>
                                     <td className="px-4 py-4">
                                         <div className="flex items-center gap-3">
                                             <div className="w-32 bg-white/5 rounded-full h-2 overflow-hidden">
                                                 <div className={cn("h-full rounded-full transition-all duration-1000", 
                                                    pf.progress === 100 ? "bg-emerald-500" : "bg-indigo-500"
                                                 )} style={{ width: `${pf.progress}%` }} />
                                             </div>
                                             <span className="text-xs font-mono">{pf.progress}%</span>
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </LuminaCard>
        </div>
    );
}

export default OverviewView;