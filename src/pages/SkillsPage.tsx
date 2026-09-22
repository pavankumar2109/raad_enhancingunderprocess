import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Skill } from '../types';

export const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    apiService.getSkills().then(setSkills);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
          Skill Inventory & Gap Analysis
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Deep-graph skill telemetry mapping across 32 active engineers, targeting key competencies for enterprise readiness.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">TRACKED COMPETENCIES</span>
          <p className="text-2xl font-extrabold text-slate-900 font-serif mt-1">{skills.length} Core Domains</p>
          <p className="text-xs text-slate-500 mt-1">AI/ML, Go, Cloud, K8s, Security</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">AVERAGE PROFICIENCY</span>
          <p className="text-2xl font-extrabold text-emerald-700 font-serif mt-1">88.2%</p>
          <p className="text-xs text-emerald-800 font-medium mt-1">Top tier proficiency in Go & K8s</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">PRIMARY SKILL DEFICIT</span>
          <p className="text-2xl font-extrabold text-amber-800 font-serif mt-1">Cybersecurity (22% Gap)</p>
          <p className="text-xs text-amber-900 font-medium mt-1">Requires cross-training rotation</p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{skill.category}</span>
                <h3 className="text-base font-bold text-slate-900 font-serif">{skill.name}</h3>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                skill.demandLevel === 'Critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-700'
              }`}>
                {skill.demandLevel} Demand
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Proficiency Rating</span>
                <span className="font-mono font-bold text-slate-900">{skill.proficiency}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${skill.proficiency >= 90 ? 'bg-emerald-600' : skill.proficiency >= 80 ? 'bg-amber-600' : 'bg-rose-600'}`}
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{skill.totalEngineers} Verified Engineers</span>
              <span>Target Gap: <strong className="text-rose-700">{skill.skillGapPercentage}%</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
