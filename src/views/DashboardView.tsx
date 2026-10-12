import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  BriefcaseMedical,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle2,
  Hourglass,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { useHealthSync } from '../context/HealthSyncContext';

Chart.register(...registerables);

export const DashboardView: React.FC = () => {
  const { navigate } = useHealthSync();
  const [timeRange, setTimeRange] = useState('Last 7 days');

  const deptChartRef = useRef<HTMLCanvasElement | null>(null);
  const statusChartRef = useRef<HTMLCanvasElement | null>(null);
  const trendsChartRef = useRef<HTMLCanvasElement | null>(null);

  const deptChartInstance = useRef<Chart | null>(null);
  const statusChartInstance = useRef<Chart | null>(null);
  const trendsChartInstance = useRef<Chart | null>(null);

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
              '#818CF8', // purple/indigo
              '#38BDF8', // sky
              '#34D399', // emerald
              '#60A5FA', // blue
              '#F87171', // rose/red
              '#FBBF24', // amber
            ],
            borderRadius: 6,
            barThickness: 24,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { cornerRadius: 8 },
        },
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
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw}%`,
            },
          },
        },
      },
    });

    return () => {
      if (statusChartInstance.current) statusChartInstance.current.destroy();
    };
  }, []);

  // 3. Case Trends Dual Line Chart
  useEffect(() => {
    if (!trendsChartRef.current) return;
    if (trendsChartInstance.current) trendsChartInstance.current.destroy();

    const ctx = trendsChartRef.current.getContext('2d');
    if (!ctx) return;

    trendsChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Apr 21', 'Apr 22', 'Apr 23', 'Apr 24', 'Apr 25', 'Apr 26', 'Apr 27'],
        datasets: [
          {
            label: 'Opened',
            data: [42, 68, 55, 74, 60, 68, 88],
            borderColor: '#2563EB',
            backgroundColor: 'transparent',
            tension: 0.35,
            pointBackgroundColor: '#2563EB',
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: 'Closed',
            data: [30, 48, 40, 50, 45, 52, 62],
            borderColor: '#10B981',
            backgroundColor: 'transparent',
            tension: 0.35,
            pointBackgroundColor: '#10B981',
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
            ticks: { font: { size: 9, family: 'Plus Jakarta Sans' } },
          },
          y: {
            grid: { color: '#F1F5F9' },
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 25, font: { size: 9 } },
          },
        },
      },
    });

    return () => {
      if (trendsChartInstance.current) trendsChartInstance.current.destroy();
    };
  }, []);

  return (
    <div className="space-y-5 pb-8">
      {/* Page Title & Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of hospital operations and patient cases
          </p>
        </div>

        <div className="relative inline-block text-left">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl pl-3 pr-8 py-1.5 focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 30 days">Last 30 days</option>
            <option value="This Month">This Month</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* 6 Metric KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Patients */}
        <div
          onClick={() => navigate('patients')}
          className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-slate-300 transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Total Patients</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-slate-900 tabular-nums">1,248</p>
            <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↑ 12%</span> <span className="text-slate-400 font-normal">vs last week</span>
            </p>
          </div>
        </div>

        {/* Card 2: Active Cases */}
        <div
          onClick={() => navigate('cases')}
          className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-slate-300 transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Active Cases</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BriefcaseMedical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-slate-900 tabular-nums">482</p>
            <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↑ 8%</span> <span className="text-slate-400 font-normal">vs last week</span>
            </p>
          </div>
        </div>

        {/* Card 3: Awaiting Review */}
        <div
          onClick={() => navigate('cases')}
          className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-slate-300 transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Awaiting Review</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-slate-900 tabular-nums">76</p>
            <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↑ 5%</span> <span className="text-slate-400 font-normal">vs last week</span>
            </p>
          </div>
        </div>

        {/* Card 4: Overdue Follow-ups */}
        <div
          onClick={() => navigate('follow-ups')}
          className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-slate-300 transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Overdue Follow-ups</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-slate-900 tabular-nums">32</p>
            <p className="text-[10px] font-semibold text-rose-600 flex items-center gap-0.5 mt-0.5">
              <span>↑ 18%</span> <span className="text-slate-400 font-normal">vs last week</span>
            </p>
          </div>
        </div>

        {/* Card 5: Closed This Month */}
        <div
          onClick={() => navigate('cases')}
          className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-slate-300 transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Closed This Month</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-slate-900 tabular-nums">218</p>
            <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↑ 14%</span> <span className="text-slate-400 font-normal">vs last month</span>
            </p>
          </div>
        </div>

        {/* Card 6: Avg. Case Duration */}
        <div
          onClick={() => navigate('analytics')}
          className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-slate-300 transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Avg. Case Duration</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-slate-900 tabular-nums">8.6 days</p>
            <p className="text-[10px] font-semibold text-sky-600 flex items-center gap-0.5 mt-0.5">
              <span>↓ 20%</span> <span className="text-slate-400 font-normal">vs last month</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3 Main Charts Row */}
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
          <div className="mt-2 flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <canvas ref={statusChartRef} />
              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-slate-900 tabular-nums">482</span>
                <span className="text-[9px] text-slate-400 font-medium">Active Cases</span>
              </div>
            </div>

            {/* Custom Legend matching screenshot */}
            <div className="space-y-1.5 text-[11px] text-slate-600 min-w-44">
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

        {/* Chart 3: Case Trends */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800">Case Trends</h3>
          <div className="h-56 mt-2 relative">
            <canvas ref={trendsChartRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
