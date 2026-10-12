import React, { useState } from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';
import { useHealthSync } from '../../context/HealthSyncContext';
import { Department } from '../../types';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
}

const DEPARTMENTS: Department[] = [
  'Cardiology',
  'Neurology',
  'Emergency Medicine',
  'Orthopedics',
  'General Medicine',
  'Pediatrics',
  'Oncology',
];

export const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedPatientId,
}) => {
  const { patients, appointments, createAppointment, currentUser } = useHealthSync();

  const [patientId, setPatientId] = useState(
    preselectedPatientId || (patients.length > 0 ? patients[0].id : '')
  );
  const [clinician, setClinician] = useState(currentUser?.name || 'Dr. Alex Vance');
  const [department, setDepartment] = useState<Department>('Cardiology');
  const [date, setDate] = useState('2026-10-14');
  const [time, setTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [type, setType] = useState<any>('Follow-up');
  const [notes, setNotes] = useState('Routine clinical review and therapy evaluation.');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Conflict detection
  const hasConflict = appointments.some(
    (a) =>
      a.status !== 'cancelled' &&
      a.clinician === clinician &&
      a.date === date &&
      a.time === time
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setError('Please select a patient.');
      return;
    }

    const patient = patients.find((p) => p.id === patientId);

    createAppointment({
      patientId,
      patientName: patient ? patient.name : 'Unknown Patient',
      clinician,
      department,
      date,
      time,
      durationMinutes,
      type,
      status: 'confirmed',
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Schedule Appointment</h3>
              <p className="text-xs text-slate-600">Book clinician encounter or follow-up session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {hasConflict && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Schedule Conflict Warning:</span> {clinician} already has an active appointment scheduled on {date} at {time}. You may proceed or pick an alternative slot.
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) — {p.department}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinician</label>
              <select
                value={clinician}
                onChange={(e) => setClinician(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="Dr. Alex Vance">Dr. Alex Vance (Cardiology)</option>
                <option value="Dr. Sarah Chen">Dr. Sarah Chen (Neurology)</option>
                <option value="Dr. James Thorne">Dr. James Thorne (Orthopedics)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="Initial Consultation">Initial Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Pre-op Review">Pre-op Review</option>
              <option value="Emergency Triage">Emergency Triage</option>
              <option value="Specialist Referral">Specialist Referral</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Encounter Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
