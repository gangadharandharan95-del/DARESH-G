import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  RotateCcw,
  Activity,
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { SimulationParams, SimulationResult } from '../types';
import { calculateSimulationMetrics, INITIAL_SIMULATION_PARAMS } from '../data/demo-data';

Chart.register(...registerables);

export const WorkloadSimulatorView: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(INITIAL_SIMULATION_PARAMS);
  const [results, setResults] = useState<SimulationResult>(() =>
    calculateSimulationMetrics(INITIAL_SIMULATION_PARAMS)
  );

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(calculateSimulationMetrics(params));
  };

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: results.trendDays.map((_, i) => String(i + 1)),
        datasets: [
          {
            label: 'Current',
            data: results.trendDays.map((d) => d.current),
            borderColor: '#2563EB',
            backgroundColor: 'transparent',
            tension: 0.35,
            pointBackgroundColor: '#2563EB',
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: 'After Changes',
            data: results.trendDays.map((d) => d.afterChanges),
            borderColor: '#06B6D4',
            backgroundColor: 'transparent',
            tension: 0.35,
            pointBackgroundColor: '#06B6D4',
            pointRadius: 3,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              font: { size: 10, family: 'Plus Jakarta Sans' },
              usePointStyle: true,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            title: { display: true, text: 'Days', font: { size: 10 } },
            ticks: { font: { size: 9 } },
          },
          y: {
            grid: { color: '#F1F5F9' },
            beginAtZero: true,
            max: 50,
            ticks: { stepSize: 10, font: { size: 9 } },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [results]);

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Hospital Workload Simulator
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Estimate resource needs and waiting times (Simulated data)
        </p>
      </div>

      {/* Main Grid: 2 Columns matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (5 cols): Simulation Parameters */}
        <form
          onSubmit={handleRunSimulation}
          className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4"
        >
          <h3 className="text-xs font-bold text-slate-900">Simulation Parameters</h3>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Daily Registrations
            </label>
            <input
              type="number"
              value={params.dailyRegistrations}
              onChange={(e) =>
                setParams({ ...params, dailyRegistrations: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Available Doctors
            </label>
            <input
              type="number"
              value={params.availableDoctors}
              onChange={(e) =>
                setParams({ ...params, availableDoctors: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Avg. Appointment Duration
            </label>
            <div className="relative">
              <input
                type="number"
                value={params.avgAppointmentDurationMin}
                onChange={(e) =>
                  setParams({ ...params, avgAppointmentDurationMin: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold text-slate-800"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400">min</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Investigation Processing Time
            </label>
            <div className="relative">
              <input
                type="number"
                value={params.investigationProcessingDays}
                onChange={(e) =>
                  setParams({ ...params, investigationProcessingDays: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold text-slate-800"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400">days</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Current Backlog
            </label>
            <input
              type="number"
              value={params.currentBacklog}
              onChange={(e) =>
                setParams({ ...params, currentBacklog: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold text-slate-800"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Run Simulation
            </button>
          </div>
        </form>

        {/* Right Column (8 cols): Simulation Results & Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-5">
          <h3 className="text-xs font-bold text-slate-900">Simulation Results</h3>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Estimated Wait Time</span>
              <p className="text-lg font-bold text-blue-600 tabular-nums mt-0.5">
                {results.estimatedWaitDays} days
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Total Cases (7 days)</span>
              <p className="text-lg font-bold text-slate-800 tabular-nums mt-0.5">
                {results.totalCases7Days}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Doctor Utilization</span>
              <p className="text-lg font-bold text-blue-600 tabular-nums mt-0.5">
                {results.doctorUtilizationHours}h
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Doctor Count</span>
              <p className="text-lg font-bold text-slate-800 tabular-nums mt-0.5">
                {results.doctorCount}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Capacity</span>
              <p className="text-lg font-bold text-blue-600 tabular-nums mt-0.5">
                {results.capacityPercent}%
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Queue Length</span>
              <p className="text-lg font-bold text-slate-800 tabular-nums mt-0.5">
                {results.queueLength}
              </p>
            </div>
          </div>

          {/* Chart at Bottom matching screenshot */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">Estimated Queue Trend</h4>
            <div className="h-48 relative">
              <canvas ref={chartRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
