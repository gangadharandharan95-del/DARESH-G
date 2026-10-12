import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BriefcaseMedical,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  CheckSquare,
  Square,
  Users,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';
import { CaseStatus, Department, Priority } from '../types';
import { exportDatasetToCSV } from '../data/demo-data';

interface CasesViewProps {
  onOpenCreateCaseModal: () => void;
}

export const CasesView: React.FC<CasesViewProps> = ({ onOpenCreateCaseModal }) => {
  const { cases, navigate, showToast, updateCaseStatus, reassignCase } = useHealthSync();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [clinicianFilter, setClinicianFilter] = useState<string>('All');
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.patientName.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchesDept = departmentFilter === 'All' || c.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesClinician = clinicianFilter === 'All' || c.assignedClinician === clinicianFilter;
      return matchesSearch && matchesPriority && matchesDept && matchesStatus && matchesClinician;
    });
  }, [cases, search, priorityFilter, departmentFilter, statusFilter, clinicianFilter]);

  const totalPages = Math.ceil(filteredCases.length / pageSize) || 1;
  const paginatedCases = filteredCases.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectCase = (id: string) => {
    setSelectedCaseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllOnPage = () => {
    if (selectedCaseIds.length === paginatedCases.length) {
      setSelectedCaseIds([]);
    } else {
      setSelectedCaseIds(paginatedCases.map((c) => c.id));
    }
  };

  const handleBulkStatusChange = (newStatus: CaseStatus) => {
    if (selectedCaseIds.length === 0) return;
    selectedCaseIds.forEach((id) => {
      updateCaseStatus(id, newStatus, 'Bulk workflow action applied by clinician.');
    });
    setSelectedCaseIds([]);
    showToast('success', `Updated ${selectedCaseIds.length} cases to ${newStatus.replace(/_/g, ' ')}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setPriorityFilter('All');
    setDepartmentFilter('All');
    setStatusFilter('All');
    setClinicianFilter('All');
    setCurrentPage(1);
    showToast('info', 'Case filters cleared.');
  };

  const handleExportCSV = () => {
    const exportData = filteredCases.map((c) => ({
      Case_ID: c.id,
      Patient_ID: c.patientId,
      Patient_Name: c.patientName,
      Title: c.title,
      Department: c.department,
      Clinician: c.assignedClinician,
      Priority: c.priority,
      Status: c.status,
      Category: c.category,
      FollowUp_Required: c.followUpRequired ? 'Yes' : 'No',
      Created_At: c.createdAt,
      Updated_At: c.updatedAt,
    }));
    exportDatasetToCSV('healthsync_cases_register', exportData);
    showToast('success', 'Exported cases dataset to CSV.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Case Tracking Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">
            Clinical workflow triage, multi-specialty progress tracking, and outcome coordination.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenCreateCaseModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Case</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="healthsync-card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search case ID, title, patient..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            />
          </div>

          {/* Priority */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-slate-700"
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Oncology">Oncology</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="new">New</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="awaiting_investigation">Awaiting Investigation</option>
              <option value="awaiting_review">Awaiting Review</option>
              <option value="follow_up_required">Follow-up Required</option>
              <option value="resolved">Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Clinician */}
          <div>
            <select
              value={clinicianFilter}
              onChange={(e) => {
                setClinicianFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-slate-700"
            >
              <option value="All">All Clinicians</option>
              <option value="Dr. Alex Vance">Dr. Alex Vance</option>
              <option value="Dr. Sarah Chen">Dr. Sarah Chen</option>
              <option value="Dr. James Thorne">Dr. James Thorne</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-slate-800">{filteredCases.length}</strong> cases
            </span>

            {selectedCaseIds.length > 0 && (
              <div className="flex items-center gap-2 bg-indigo-50 px-2.5 py-1 rounded-lg text-indigo-800 font-semibold text-[11px]">
                <span>{selectedCaseIds.length} selected</span>
                <span>·</span>
                <button
                  onClick={() => handleBulkStatusChange('awaiting_review')}
                  className="hover:underline text-indigo-700"
                >
                  Mark Awaiting Review
                </button>
                <span>·</span>
                <button
                  onClick={() => handleBulkStatusChange('follow_up_required')}
                  className="hover:underline text-indigo-700"
                >
                  Mark Follow-up Required
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Cases Table */}
      <div className="healthsync-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-10 text-center">
                  <button
                    onClick={selectAllOnPage}
                    className="text-slate-400 hover:text-slate-600"
                    title="Select all on this page"
                  >
                    {selectedCaseIds.length > 0 &&
                    selectedCaseIds.length === paginatedCases.length ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Case Title & Symptoms</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Clinician</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    No clinical cases match your active filters.
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => {
                  const isSelected = selectedCaseIds.includes(c.id);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate('case-details', { caseId: c.id })}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectCase(c.id);
                        }}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-600 tabular-nums">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {c.symptoms.join(', ')}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {c.patientName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {c.department}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {c.assignedClinician}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.priority === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : c.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : c.priority === 'medium'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {c.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold capitalize ${
                            c.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : c.status === 'awaiting_investigation'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : c.status === 'awaiting_review'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate('case-details', { caseId: c.id })}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          Workspace <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
