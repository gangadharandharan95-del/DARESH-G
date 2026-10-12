import React from 'react';
import {
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';

export const AiInsightsView: React.FC = () => {
  const { navigate } = useHealthSync();

  return (
    <div className="space-y-4 pb-8">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          AI Insights & Prioritization
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          AI-assisted recommendations for case prioritization and follow-up
        </p>
      </div>

      {/* Main Feature Card matching screenshot */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Case Priority Recommendation
          </span>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 uppercase">
            HIGH RISK / STAT REVIEW
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Recommendation Overview */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="text-xs font-bold text-rose-600">High Priority:</span>
              <button
                onClick={() => navigate('case-details', { caseId: 'CASE-2026-001' })}
                className="text-xs font-bold text-slate-900 hover:text-blue-600 underline"
              >
                CASE-2026-001 · Priya Sharma
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Based on recent investigation results and treatment progress, this case requires monitoring and an earlier follow-up.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigate('case-details', { caseId: 'CASE-2026-001' })}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Key Factors Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
            <span className="text-[11px] font-bold text-slate-800 block mb-2">Key Factors</span>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Recent investigation pending
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                High risk condition (as per rules)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Follow-up due in 2 days
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Patient age &gt; 60
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
          Model: HealthSync v1.9.0 · 28 Apr 2026 14:30
        </div>
      </div>

      {/* Section 2: Other Recommendations Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800">Other Recommendations</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold">
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Case Status</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1: Robert Davis */}
              <tr
                onClick={() => navigate('cases')}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <td className="py-3 px-3 font-semibold text-slate-900">Robert Davis</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Investigation Pending
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    High
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">Lab results overdue</td>
              </tr>

              {/* Row 2: Anjali Gupta */}
              <tr
                onClick={() => navigate('cases')}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <td className="py-3 px-3 font-semibold text-slate-900">Anjali Gupta</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Follow-up Required
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Medium
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">Next follow-up in 3 days</td>
              </tr>

              {/* Row 3: Michael Wilson */}
              <tr
                onClick={() => navigate('cases')}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <td className="py-3 px-3 font-semibold text-slate-900">Michael Wilson</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Treatment in Progress
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Low
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">Stable progress</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
