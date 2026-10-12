import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  Calendar,
  BriefcaseMedical,
  Clock,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';

interface PatientProfileViewProps {
  onOpenCreateCaseModal: (patientId?: string) => void;
  onOpenAppointmentModal: (patientId?: string) => void;
  onOpenInvestigationModal: (patientId?: string) => void;
}

type TabType =
  | 'Overview'
  | 'Medical History'
  | 'Cases (2)'
  | 'Appointments'
  | 'Follow-ups'
  | 'Documents';

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  onOpenCreateCaseModal,
  onOpenAppointmentModal,
  onOpenInvestigationModal,
}) => {
  const { selectedPatientId, patients, cases, appointments, navigate } = useHealthSync();

  const [activeTab, setActiveTab] = useState<TabType>('Overview');

  // Default to Priya Sharma (P-1002) as in reference screenshot
  const patient =
    patients.find((p) => p.id === selectedPatientId) ||
    patients.find((p) => p.id === 'P-1002') ||
    patients[0];

  const patientCases = cases.filter((c) => c.patientId === patient.id);
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);

  return (
    <div className="space-y-4 pb-8">
      {/* Top Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('patients')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Patient 360° Profile</span>
        </button>
      </div>

      {/* Patient Banner matching screenshot */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar matching Priya Sharma portrait */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80"
                alt={patient.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-lg">
                PS
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Patient ID: {patient.id}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {patient.age} years · {patient.gender} · {patient.contact}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Edit patient profile dialog')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex items-center gap-6 border-b border-slate-100 mt-5 text-xs font-semibold text-slate-500 overflow-x-auto">
          {(['Overview', 'Medical History', 'Cases (2)', 'Appointments', 'Follow-ups', 'Documents'] as TabType[]).map(
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

      {/* 3 Columns matching middle-left screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Personal Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900">Personal Information</h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Date of Birth</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                14 Jan 1963 ({patient.age} years)
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Address</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {patient.address || '12, Green Park, Bangalore'}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {patient.emergencyContact.name} ({patient.emergencyContact.phone})
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Blood Group</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {patient.bloodGroup}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Allergies</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {patient.allergies.join(', ') || 'Penicillin, Nuts'}
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Active Cases */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-3">Active Cases</h3>

            <div className="space-y-3">
              {/* Case 1: CASE-2026-001 */}
              <div
                onClick={() => navigate('case-details', { caseId: 'CASE-2026-001' })}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-600">
                    CASE-2026-001
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Treatment in Progress
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  Knee Replacement Surgery
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Next Follow-up: <strong className="text-slate-700">May 5th 2026</strong>
                </p>
              </div>

              {/* Case 2: CASE-2026-002 */}
              <div
                onClick={() => navigate('case-details', { caseId: 'CASE-2026-002' })}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-600">
                    CASE-2026-002
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    On Hold
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  Hypertension Management
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Next Follow-up: <span className="text-slate-400">--</span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('cases')}
            className="text-xs font-semibold text-blue-600 hover:underline text-left mt-3 pt-2 border-t border-slate-100"
          >
            View All Cases
          </button>
        </div>

        {/* Column 3: Recent Appointments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-3">Recent Appointments</h3>

            <div className="space-y-3 text-xs">
              {/* Appt 1 */}
              <div className="flex items-start justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/30">
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block">
                    15 Apr 2026 <span className="font-normal text-slate-400">10:30</span>
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    Dr. Priya Nair <span className="text-[10px] text-slate-400">(General Physician)</span>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600">
                  Completed
                </span>
              </div>

              {/* Appt 2 */}
              <div className="flex items-start justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/30">
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block">
                    28 Apr 2026 <span className="font-normal text-slate-400">11:15</span>
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    Dr. Amit Kumar <span className="text-[10px] text-slate-400">(Orthopedics)</span>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Upcoming
                </span>
              </div>

              {/* Appt 3 */}
              <div className="flex items-start justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/30">
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block">
                    02 May 2026 <span className="font-normal text-slate-400">09:00</span>
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    Dr. Amit Kumar <span className="text-[10px] text-slate-400">(Follow-up)</span>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Upcoming
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('appointments')}
            className="text-xs font-semibold text-blue-600 hover:underline text-left mt-3 pt-2 border-t border-slate-100"
          >
            View All Appointments
          </button>
        </div>
      </div>
    </div>
  );
};
