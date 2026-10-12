import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  FileCheck,
  ChevronRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';
import { Investigation, InvestigationStatus, Priority } from '../types';
import { exportDatasetToCSV } from '../data/demo-data';

interface InvestigationsViewProps {
  onOpenInvestigationModal: () => void;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  onOpenInvestigationModal,
}) => {
  const {
    investigations,
    updateInvestigationStatus,
    updateInvestigationResult,
    navigate,
    showToast,
  } = useHealthSync();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Result entry modal
  const [enteringResultFor, setEnteringResultFor] = useState<Investigation | null>(null);
  const [findings, setFindings] = useState('');
  const [referenceRange, setReferenceRange] = useState('');
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [notes, setNotes] = useState('');

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((inv) => {
      const matchesSearch =
        inv.investigationType.toLowerCase().includes(search.toLowerCase()) ||
        inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
        inv.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || inv.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [investigations, search, statusFilter, priorityFilter]);

  const handleOpenResultModal = (inv: Investigation) => {
    setEnteringResultFor(inv);
    setFindings(inv.findings || '');
    setReferenceRange(inv.referenceRange || 'Within normal physiological limits');
    setIsAbnormal(inv.isAbnormal || false);
    setNotes(inv.notes || '');
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteringResultFor) return;
    if (!findings.trim()) {
      showToast('error', 'Findings description is required to record lab result.');
      return;
    }

    updateInvestigationResult(
      enteringResultFor.id,
      findings.trim(),
      referenceRange.trim(),
      isAbnormal,
      notes.trim()
    );
    setEnteringResultFor(null);
  };

  const handleExportCSV = () => {
    const exportData = filteredInvestigations.map((inv) => ({
      Investigation_ID: inv.id,
      Patient: inv.patientName,
      Case_ID: inv.caseId,
      Test_Type: inv.investigationType,
      Clinician: inv.requestingClinician,
      Date_Requested: inv.requestDate,
      Date_Completed: inv.completedDate || 'Pending',
      Status: inv.status,
      Priority: inv.priority,
      Findings: inv.findings || 'Pending',
      Abnormal: inv.isAbnormal ? 'Yes' : 'No',
    }));
    exportDatasetToCSV('healthsync_investigations_register', exportData);
    showToast('success', 'Exported investigations dataset to CSV.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Diagnostic Investigations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Laboratory pathology, medical imaging tracking, and synthetic diagnostic results recording.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Register</span>
          </button>

          <button
            onClick={onOpenInvestigationModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Order Investigation</span>
          </button>
        </div>
      </div>

      {/* Safety Synthetic Notice Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Synthetic Laboratory Environment:</strong> All specimen analyses, imaging modalities, and biomarker deltas recorded here are synthetic demonstration constructs for clinical decision workflow simulation.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="healthsync-card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search test type, patient, or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="requested">Requested</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="result_available">Result Available</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="critical">Critical / STAT</option>
              <option value="high">High Priority</option>
              <option value="medium">Routine Priority</option>
              <option value="low">Elective</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredInvestigations.length}</strong> diagnostic orders
          </span>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setPriorityFilter('All');
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Investigations Register */}
      <div className="space-y-3">
        {filteredInvestigations.length === 0 ? (
          <div className="healthsync-card p-12 text-center text-slate-500 text-xs">
            No diagnostic orders match your current filters.
          </div>
        ) : (
          filteredInvestigations.map((inv) => (
            <div
              key={inv.id}
              className="healthsync-card p-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-600 tabular-nums">
                      {inv.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{inv.investigationType}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.priority === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : inv.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {inv.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-600">
                    <button
                      onClick={() => navigate('patient-profile', { patientId: inv.patientId })}
                      className="hover:text-indigo-600 font-semibold text-slate-800"
                    >
                      Patient: {inv.patientName} ({inv.patientId})
                    </button>
                    <span>·</span>
                    {inv.caseId && (
                      <button
                        onClick={() => navigate('case-details', { caseId: inv.caseId })}
                        className="hover:text-indigo-600 text-indigo-700 font-medium"
                      >
                        Case: {inv.caseId}
                      </button>
                    )}
                    <span>·</span>
                    <span>Requested by {inv.requestingClinician} on {inv.requestDate}</span>
                  </div>

                  {/* Findings Box */}
                  {inv.findings ? (
                    <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Diagnostic Findings:</span>
                        {inv.isAbnormal !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              inv.isAbnormal
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {inv.isAbnormal ? 'ABNORMAL VALUE' : 'NORMAL'}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 mt-1">{inv.findings}</p>
                      {inv.referenceRange && (
                        <p className="text-slate-500 text-[11px] mt-1">
                          Ref Range: {inv.referenceRange}
                        </p>
                      )}
                      {inv.attachmentRef && (
                        <p className="text-indigo-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Attachment: {inv.attachmentRef}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 mt-2 italic">
                      Awaiting laboratory analysis / radiology capture...
                    </p>
                  )}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col md:items-end gap-2.5 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase self-start md:self-end ${
                    inv.status === 'result_available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : inv.status === 'in_progress'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {inv.status.replace(/_/g, ' ')}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenResultModal(inv)}
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{inv.findings ? 'Edit Findings' : 'Enter Results'}</span>
                  </button>

                  {inv.status !== 'result_available' && (
                    <button
                      onClick={() => updateInvestigationStatus(inv.id, 'in_progress')}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      In Progress
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Enter Result Modal */}
      {enteringResultFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Record Diagnostic Findings ({enteringResultFor.id})
              </h3>
              <p className="text-xs text-slate-500">
                {enteringResultFor.investigationType} for {enteringResultFor.patientName}
              </p>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Findings / Laboratory Values <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  placeholder="e.g. Troponin delta verified at 618 ng/L; acute myocardial injury pattern confirmed."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reference Range / Physiological Norm
                </label>
                <input
                  type="text"
                  value={referenceRange}
                  onChange={(e) => setReferenceRange(e.target.value)}
                  placeholder="e.g. < 14 ng/L (99th percentile)"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="abnormalCheckbox"
                  checked={isAbnormal}
                  onChange={(e) => setIsAbnormal(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <label
                  htmlFor="abnormalCheckbox"
                  className="text-xs font-bold text-rose-700 cursor-pointer"
                >
                  Flag as Abnormal / Out-of-Range Clinical Finding
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technician Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional calibration or verification notes..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEnteringResultFor(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-xs"
                >
                  Finalize & Upload Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
