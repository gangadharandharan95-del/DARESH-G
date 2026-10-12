import React, { useState } from 'react';
import {
  CalendarClock,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';

export const FollowUpsView: React.FC = () => {
  const { cases, navigate, updateCaseStatus } = useHealthSync();
  const [filter, setFilter] = useState('All');

  const followUpCases = cases.filter((c) => c.followUpRequired);

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Patient Follow-ups
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track mandated clinical follow-ups, post-operative milestones, and overdue encounters
        </p>
      </div>

      <div className="space-y-3">
        {followUpCases.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600">{c.id}</span>
                  <h3 className="text-xs font-bold text-slate-900">{c.title}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient: <strong className="text-slate-800">{c.patientName}</strong> · Lead: {c.assignedClinician} ({c.department})
                </p>
                <p className="text-[11px] text-blue-600 font-semibold mt-1">
                  Scheduled Target Date: {c.nextFollowUpDate || 'Due this week'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => navigate('case-details', { caseId: c.id })}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-xl transition-colors"
              >
                Case Workspace
              </button>
              <button
                onClick={() => updateCaseStatus(c.id, 'closed', 'Follow-up clinical assessment finalized.')}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
              >
                Mark Completed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
