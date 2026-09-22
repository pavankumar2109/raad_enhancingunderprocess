import React, { useState } from 'react';
import { Building, User, Bell, Cpu, Database, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'organization' | 'profile' | 'notifications' | 'ai' | 'data'>('organization');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
          System & Telemetry Settings
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Configure RAAD-Nexus v4.2 optimization parameters, workspace controls, and notifications.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Tabs Nav */}
        <div className="w-full lg:w-64 bg-white border border-slate-200/90 rounded-2xl p-2 h-fit space-y-1 shadow-xs">
          {[
            { id: 'organization', label: 'Organization', icon: Building },
            { id: 'profile', label: 'User Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'ai', label: 'AI Preferences', icon: Cpu },
            { id: 'data', label: 'Data & Telemetry Sync', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="flex-1 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6">
            
            {activeTab === 'organization' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-serif text-slate-900">Organization Settings</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      defaultValue="Nordic Enterprise Operations"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cluster Region</label>
                    <input
                      type="text"
                      defaultValue="NORDIC-09 (Stockholm / Helsinki)"
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-serif text-slate-900">User Profile</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Elena Vance"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Role Title</label>
                    <input
                      type="text"
                      defaultValue="Chief Operations Dir."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-serif text-slate-900">AI Engine Parameters</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Capacity Safety Threshold (%)</label>
                    <input
                      type="number"
                      defaultValue={75}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Prevents assigning tasks to engineers above this capacity limit.</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Skill Match Confidence Threshold (%)</label>
                    <input
                      type="number"
                      defaultValue={85}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'notifications' || activeTab === 'data') && (
              <div className="space-y-4 text-xs">
                <h3 className="text-base font-bold font-serif text-slate-900">Telemetry & Webhooks</h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <p className="font-semibold text-slate-800">Live Telemetry Webhook Endpoint</p>
                  <p className="font-mono text-[11px] text-slate-600">http://localhost:8000/api/v1/telemetry/webhook</p>
                  <p className="text-[10px] text-slate-400">Configured via .env environment variable VITE_API_URL.</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {saved ? (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Settings saved successfully!
                </span>
              ) : <div></div>}

              <button
                type="submit"
                className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};
