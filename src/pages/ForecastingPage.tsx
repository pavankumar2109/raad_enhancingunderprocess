import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { ForecastDataPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ForecastingPage: React.FC = () => {
  const [horizon, setHorizon] = useState<'7 Days' | '14 Days' | '30 Days'>('7 Days');
  const [forecast, setForecast] = useState<ForecastDataPoint[]>([]);

  useEffect(() => {
    apiService.getForecast(horizon).then(setForecast);
  }, [horizon]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Predictive Capacity Forecasting
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Machine learning forecast models projecting future workload demands against engineer availability.
          </p>
        </div>

        {/* Horizon Switcher */}
        <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center gap-1 shadow-2xs">
          {(['7 Days', '14 Days', '30 Days'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                horizon === h
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Main Forecast Chart Card */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">PREDICTIVE CAPACITY vs DEMAND</span>
            <h3 className="text-lg font-bold font-serif text-slate-900">{horizon} Capacity Projection</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-lg">
            ★ ML Confidence 94.2%
          </span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="predictedCapacity" stroke="#0284c7" fill="#e0f2fe" opacity={0.6} name="Predicted Capacity (h)" />
              <Area type="monotone" dataKey="expectedWorkload" stroke="#795914" fill="#fef3c7" opacity={0.6} name="Expected Workload (h)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900 font-serif">Capacity & Workload Metrics Breakdown</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 font-bold">
                <th className="py-3 px-4">TIMEFRAME</th>
                <th className="py-3 px-4">CURRENT CAPACITY</th>
                <th className="py-3 px-4">PREDICTED CAPACITY</th>
                <th className="py-3 px-4">EXPECTED WORKLOAD</th>
                <th className="py-3 px-4">PROJECTED SHORTAGE</th>
                <th className="py-3 px-4">PROJECTED SURPLUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {forecast.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">{row.date}</td>
                  <td className="py-3 px-4 text-slate-700">{row.currentCapacity}h</td>
                  <td className="py-3 px-4 text-slate-700">{row.predictedCapacity}h</td>
                  <td className="py-3 px-4 text-slate-700">{row.expectedWorkload}h</td>
                  <td className="py-3 px-4">
                    {row.shortage > 0 ? (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        -{row.shortage}h Shortage
                      </span>
                    ) : (
                      <span className="text-slate-400">0h</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {row.surplus > 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        +{row.surplus}h Headroom
                      </span>
                    ) : (
                      <span className="text-slate-400">0h</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
