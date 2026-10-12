import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';
import { CaseStatus } from '../types';

type CaseTab = 'Timeline' | 'Clinical Notes' | 'Investigations' | 'Treatment Plan' | 'Details';

export const CaseDetailsView: React.FC = () => {
  const { cases, updateCaseStatus, navigate } = useHealthSync();

  // Find CASE-2026-001 as shown in reference
  const currentCase =
    cases.find((c) => c.id === 'CASE-2026-001') ||
    cases[0];

  const [activeTab, setActiveTab] = useState<CaseTab>('Timeline');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<CaseStatus>(currentCase.status);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateCaseStatus(currentCase.id, newStatus);
    setIsStatusModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <button
          onClick={() => navigate('cases')}
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Cases
        </button>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800">{currentCase.id}</span>
      </div>

      {/* Case Header Card matching screenshot */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentCase.id}</h1>
              <span className="text-slate-400">·</span>
              <span className="text-sm font-semibold text-slate-700">
                {currentCase.title} · {currentCase.department}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
              <span>
                Patient:{' '}
                <button
                  onClick={() => navigate('patient-profile', { patientId: currentCase.patientId })}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {currentCase.patientName} ({currentCase.patientId})
                </button>
              </span>
              <span>·</span>
              <span>
                Assigned: <strong className="text-slate-700">{currentCase.assignedClinician}</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                Priority:
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                  {currentCase.priority}
                </span>
              </span>
            </div>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Treatment in Progress
            </span>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex items-center gap-6 border-b border-slate-100 mt-5 text-xs font-semibold text-slate-500 overflow-x-auto">
          {(['Timeline', 'Clinical Notes', 'Investigations', 'Treatment Plan', 'Details'] as CaseTab[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Grid: Timeline on Left (2 cols), Case Summary on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="space-y-6 relative border-l border-blue-200 ml-28 pl-6 my-2">
            {currentCase.timeline.map((evt) => (
              <div key={evt.id} className="relative">
                {/* Timestamp on far left */}
                <span className="absolute -left-32 top-0.5 text-[11px] font-semibold text-slate-500 w-24 text-right tabular-nums">
                  {evt.timestamp}
                </span>

                {/* Blue dot on line */}
                <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{evt.description}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {evt.actor}
                  </p>
                  {evt.note && (
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {evt.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Case Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Case Summary</h3>
              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs mt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold text-slate-800">{currentCase.category || 'Surgical'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Department</span>
                <span className="font-semibold text-slate-800">{currentCase.department}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                  Treatment in Progress
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Next Follow-up</span>
                <span className="font-semibold text-slate-800">
                  {currentCase.nextFollowUpDate || '02 May 2026'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span className="font-semibold text-slate-800">
                  {currentCase.durationDays || 5} days
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6">
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Update Case Workflow Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as CaseStatus)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="treatment_in_progress">Treatment in Progress</option>
              <option value="investigation_pending">Investigation Pending</option>
              <option value="awaiting_review">Awaiting Review</option>
              <option value="on_hold">On Hold</option>
              <option value="follow_up_required">Follow-up Required</option>
              <option value="closed">Closed</option>
            </select>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
