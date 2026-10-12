import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Users,
  BriefcaseMedical,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 30 days');

  const deptChartRef = useRef<HTMLCanvasElement | null>(null);
  const statusChartRef = useRef<HTMLCanvasElement | null>(null);

  const deptChartInstance = useRef<Chart | null>(null);
  const statusChartInstance = useRef<Chart | null>(null);

  // 1. Cases by Department Bar Chart
  useEffect(() => {
    if (!deptChartRef.current) return;
    if (deptChartInstance.current) deptChartInstance.current.destroy();

    const ctx = deptChartRef.current.getContext('2d');
    if (!ctx) return;

    deptChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Surgery', 'Others'],
        datasets: [
          {
            data: [120, 98, 87, 64, 52, 41],
            backgroundColor: [
              '#818CF8',
              '#38BDF8',
              '#34D399',
              '#60A5FA',
              '#F87171',
              '#FBBF24',
            ],
            borderRadius: 6,
            barThickness: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 9, family: 'Plus Jakarta Sans' }, maxRotation: 30 },
          },
          y: {
            grid: { color: '#F1F5F9' },
            beginAtZero: true,
            max: 160,
            ticks: { stepSize: 40, font: { size: 9 } },
          },
        },
      },
    });

    return () => {
      if (deptChartInstance.current) deptChartInstance.current.destroy();
    };
  }, []);

  // 2. Case Status Distribution Donut Chart
  useEffect(() => {
    if (!statusChartRef.current) return;
    if (statusChartInstance.current) statusChartInstance.current.destroy();

    const ctx = statusChartRef.current.getContext('2d');
    if (!ctx) return;

    statusChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Treatment in Progress',
          'Investigation Pending',
          'Awaiting Review',
          'On Hold',
          'Closed',
        ],
        datasets: [
          {
            data: [34, 22, 15, 8, 21],
            backgroundColor: ['#2563EB', '#06B6D4', '#F59E0B', '#8B5CF6', '#10B981'],
            borderWidth: 2,
            borderColor: '#FFFFFF',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => {
      if (statusChartInstance.current) statusChartInstance.current.destroy();
    };
  }, []);

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Data-driven insights for better decision making
          </p>
        </div>

        <div className="relative inline-block text-left">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl pl-3 pr-8 py-1.5 focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="Last 30 days">Last 30 days</option>
            <option value="Last 90 days">Last 90 days</option>
            <option value="This Year">This Year</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* 4 Cards Row matching screenshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Patients */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500">Total Patients</span>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-1.5">1,248</p>
          <p className="text-[10px] font-semibold text-blue-600 flex items-center gap-0.5 mt-0.5">
            <span>↑ 12%</span> <span className="text-slate-400 font-normal">vs last month</span>
          </p>
        </div>

        {/* Card 2: Active Cases */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500">Active Cases</span>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-1.5">482</p>
          <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <span>↑ 8%</span> <span className="text-slate-400 font-normal">vs last month</span>
          </p>
        </div>

        {/* Card 3: Follow-up Compliance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl shadow-slate-100">
          <span className="text-[11px] font-medium text-slate-500">Follow-up Compliance</span>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-1.5">78%</p>
          <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <span>↑ 5%</span> <span className="text-slate-400 font-normal">vs last month</span>
          </p>
        </div>

        {/* Card 4: Avg. Length of Stay */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500">Avg. Length of Stay</span>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-1.5">8.6 days</p>
          <p className="text-[10px] font-semibold text-blue-600 flex items-center gap-0.5 mt-0.5">
            <span>↓ 20%</span> <span className="text-slate-400 font-normal">vs last month</span>
          </p>
        </div>
      </div>

      {/* 3 Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Cases by Department */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800">Cases by Department</h3>
          <div className="h-56 mt-2 relative">
            <canvas ref={deptChartRef} />
          </div>
        </div>

        {/* Chart 2: Case Status Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800">Case Status Distribution</h3>
          <div className="mt-2 flex-1 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <canvas ref={statusChartRef} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-bold text-slate-900 tabular-nums">482</span>
                <span className="text-[9px] text-slate-400">Active Cases</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 min-w-40">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Treatment in Progress
                </span>
                <span className="font-bold tabular-nums text-slate-800">34%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  Investigation Pending
                </span>
                <span className="font-bold tabular-nums text-slate-800">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Awaiting Review
                </span>
                <span className="font-bold tabular-nums text-slate-800">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  On Hold
                </span>
                <span className="font-bold tabular-nums text-slate-800">8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Closed
                </span>
                <span className="font-bold tabular-nums text-slate-800">21%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Workflow Bottlenecks */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-3">Workflow Bottlenecks</h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600">Waiting for Investigation</span>
                  <span className="font-bold text-slate-800 tabular-nums">34%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '34%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600">Specialist Consultation</span>
                  <span className="font-bold text-slate-800 tabular-nums">28%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600">Administrative Approval</span>
                  <span className="font-bold text-slate-800 tabular-nums">16%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: '16%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600">Waiting for Follow-up</span>
                  <span className="font-bold text-slate-800 tabular-nums">12%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-300 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600">Other</span>
                  <span className="font-bold text-slate-800 tabular-nums">7%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: '7%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
