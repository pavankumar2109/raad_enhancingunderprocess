import { useState } from "react";
import { Hexagon, Home, Activity, Wallet, Layers, Zap, Search, Bell } from "lucide-react";
import { GlobalStyles, NavItem, OverviewView, AnalyticsView, FinanceView, ProjectsView, TimeToggle } from "./Lumina";

export default function LuminaDashboard() {
    const [activeTab, setActiveTab] = useState("Overview");
    const [timeRange, setTimeRange] = useState("Monthly");

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/50">
            <GlobalStyles />
            <div className="noise-bg" />

            {/* Ambient Background Lights */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
                <div className="absolute top-[20%] left-[40%] w-[300px] h-[300px] rounded-full bg-cyan-600/10 blur-[100px]" />
            </div>

            <div className="relative z-10 flex h-screen overflow-hidden">

                {/* Sidebar */}
                <aside className="hidden w-64 flex-col gap-8 border-r border-white/5 bg-slate-950/30 p-6 backdrop-blur-xl lg:flex">
                    <div className="flex items-center gap-3 px-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
                            <Hexagon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Lumina</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Menu</p>
                        <NavItem icon={Home} label="Overview" active={activeTab === "Overview"} onClick={() => setActiveTab("Overview")} />
                        <NavItem icon={Activity} label="Analytics" active={activeTab === "Analytics"} onClick={() => setActiveTab("Analytics")} />
                        <NavItem icon={Wallet} label="Finance" active={activeTab === "Finance"} onClick={() => setActiveTab("Finance")} />
                        <NavItem icon={Layers} label="Projects" active={activeTab === "Projects"} onClick={() => setActiveTab("Projects")} />
                    </div>

                    <div className="mt-auto rounded-2xl bg-gradient-to-b from-indigo-900/50 to-purple-900/50 p-4 border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold">Pro Plan</span>
                            </div>
                            <p className="text-xs text-indigo-200 mb-3">Get access to AI predictions.</p>
                            <button className="w-full rounded-lg bg-white py-2 text-xs font-bold text-slate-900 hover:bg-indigo-50 transition-colors">Upgrade Now</button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0">

                    {/* Header */}
                    <header className="flex h-20 items-center justify-between border-b border-white/5 px-8 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search assets..."
                                    className="h-10 w-64 rounded-full border border-white/10 bg-white/5 pl-10 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none transition-all hidden md:block"
                                />
                            </div>
                            {activeTab !== 'Projects' && <TimeToggle active={timeRange} onChange={setTimeRange} />}
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                <span className="text-xs font-medium text-slate-400">ETH Gas: 12 gwei</span>
                            </div>

                            <button className="relative">
                                <Bell className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
                                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                            </button>

                            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold">Alex Chen</p>
                                    <p className="text-xs text-slate-400">Admin</p>
                                </div>
                                <div className="h-10 w-10 rounded-full border border-white/10 bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5">
                                    <img src="https://api.dicebear.com/7.x/micah/svg?seed=Alex" className="h-full w-full rounded-full bg-slate-950" alt="Avatar" />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                        <div className="mx-auto max-w-7xl">
                            {activeTab === "Overview" && <OverviewView timeRange={timeRange} />}
                            {activeTab === "Analytics" && <AnalyticsView timeRange={timeRange} />}
                            {activeTab === "Finance" && <FinanceView timeRange={timeRange} />}
                            {activeTab === "Projects" && <ProjectsView />}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
