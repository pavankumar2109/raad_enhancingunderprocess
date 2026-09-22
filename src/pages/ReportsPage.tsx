import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { apiService } from '../services/api';
import type { ReportCard } from '../types';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportCard[]>([]);

  useEffect(() => {
    apiService.getReports().then(setReports);
  }, []);

  const handleExportReport = (title: string, format: string) => {
    alert(`Generating and downloading ${title} in ${format} format...`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
          Workforce Intelligence Reports
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Exportable compliance, SLA exposure, capacity audit, and skill gap reports for executive stakeholders.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {report.category}
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {report.format}
                </span>
              </div>

              <h3 className="text-lg font-bold font-serif text-slate-900 leading-snug">{report.title}</h3>
              <p className="text-xs text-slate-600">{report.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Last generated: {report.lastGenerated}</span>

              <button
                onClick={() => handleExportReport(report.title, report.format)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export {report.format}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
