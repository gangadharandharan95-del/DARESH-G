import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';
import { Department } from '../types';

interface PatientsViewProps {
  onOpenRegisterModal: () => void;
  onOpenCreateCaseModal: (patientId?: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  onOpenRegisterModal,
  onOpenCreateCaseModal,
}) => {
  const { patients, navigate } = useHealthSync();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('All Departments');
  const [genderFilter, setGenderFilter] = useState<string>('All Genders');
  const [statusFilter, setStatusFilter] = useState<string>('Active Patients');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.contact.includes(search);
      const matchesDept = deptFilter === 'All Departments' || p.department === deptFilter;
      const matchesGender = genderFilter === 'All Genders' || p.gender === genderFilter;
      const matchesStatus =
        statusFilter === 'All Statuses' ||
        (statusFilter === 'Active Patients' && p.status === 'Active');
      return matchesSearch && matchesDept && matchesGender && matchesStatus;
    });
  }, [patients, search, deptFilter, genderFilter, statusFilter]);

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Patient Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Search and manage patient records
        </p>
      </div>

      {/* Filter and Action Bar matching top-right screenshot */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>

        {/* Filter Dropdowns and + Register Patient Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dept */}
          <div className="relative">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-xl pl-3 pr-7 py-2 focus:outline-none cursor-pointer"
            >
              <option value="All Departments">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Surgery">Surgery</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Gender */}
          <div className="relative">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-xl pl-3 pr-7 py-2 focus:outline-none cursor-pointer"
            >
              <option value="All Genders">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-xl pl-3 pr-7 py-2 focus:outline-none cursor-pointer"
            >
              <option value="Active Patients">Active Patients</option>
              <option value="All Statuses">All Statuses</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Register Patient Button */}
          <button
            onClick={onOpenRegisterModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Patient Table matching screenshot */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold text-[11px] bg-white">
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Portal Account</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-600 tabular-nums">
                    {patient.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {patient.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 tabular-nums">
                    {patient.age}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {patient.gender}
                  </td>
                  <td className="py-3 px-4 text-slate-600 tabular-nums">
                    {patient.contact}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {patient.department}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Registered
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => navigate('patient-profile', { patientId: patient.id })}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onOpenCreateCaseModal(patient.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                        title="Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination matching reference: < 1 2 3 4 5 > & Showing 1-5 of 1248 */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg font-semibold text-xs transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
              className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="tabular-nums text-slate-500 font-medium">
            Showing 1-{filteredPatients.length} of 1248
          </div>
        </div>
      </div>
    </div>
  );
};
