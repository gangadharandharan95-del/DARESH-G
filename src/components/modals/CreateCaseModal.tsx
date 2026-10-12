import React, { useState } from 'react';
import { X, FileText, AlertCircle } from 'lucide-react';
import { useHealthSync } from '../../context/HealthSyncContext';
import { Department, Priority } from '../../types';

interface CreateCaseModalProps {
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

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  preselectedPatientId,
}) => {
  const { patients, createCase, currentUser } = useHealthSync();

  const [patientId, setPatientId] = useState(
    preselectedPatientId || (patients.length > 0 ? patients[0].id : '')
  );
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('Cardiology');
  const [assignedClinician, setAssignedClinician] = useState(
    currentUser?.name || 'Dr. Alex Vance'
  );
  const [priority, setPriority] = useState<Priority>('high');
  const [category, setCategory] = useState<any>('Acute');
  const [symptomsText, setSymptomsText] = useState('Acute chest discomfort, shortness of breath');
  const [initialNotes, setInitialNotes] = useState('Patient presented via emergency intake.');
  const [followUpRequired, setFollowUpRequired] = useState(true);
  const [followUpDate, setFollowUpDate] = useState('2026-10-18');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientId) newErrors.patient = 'Please select a registered patient.';
    if (!title.trim()) newErrors.title = 'Case diagnosis / title is required.';
    if (!initialNotes.trim()) newErrors.notes = 'Initial triage clinical notes are required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const patient = patients.find((p) => p.id === patientId);
    const symptoms = symptomsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createCase({
      patientId,
      patientName: patient ? patient.name : 'Unknown Patient',
      title: title.trim(),
      department,
      assignedClinician,
      priority,
      status: 'new',
      symptoms,
      initialNotes: initialNotes.trim(),
      category,
      followUpRequired,
      followUpDate: followUpRequired ? followUpDate : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Create Clinical Case</h3>
              <p className="text-xs text-slate-600">Initialize a case record with tracking & audit trail</p>
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
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Patient <span className="text-rose-500">*</span>
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) — {p.department} (Age {p.age})
                </option>
              ))}
            </select>
            {errors.patient && <p className="text-[11px] text-rose-500 mt-1">{errors.patient}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Case Title / Primary Diagnosis <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acute Coronary Syndrome Rule-Out"
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.title ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
              } focus:outline-none focus:border-indigo-500`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Clinician</label>
              <select
                value={assignedClinician}
                onChange={(e) => setAssignedClinician(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="Dr. Alex Vance">Dr. Alex Vance (Cardiology)</option>
                <option value="Dr. Sarah Chen">Dr. Sarah Chen (Neurology)</option>
                <option value="Dr. James Thorne">Dr. James Thorne (Orthopedics)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Triage Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="critical">Critical (Immediate Attention)</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="Acute">Acute</option>
                <option value="Chronic">Chronic</option>
                <option value="Post-Operative">Post-Operative</option>
                <option value="Diagnostic Inquiry">Diagnostic Inquiry</option>
                <option value="Routine Monitoring">Routine Monitoring</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reported Symptoms (comma-separated)</label>
            <input
              type="text"
              value={symptomsText}
              onChange={(e) => setSymptomsText(e.target.value)}
              placeholder="e.g. Diaphoresis, dyspnea, nausea"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Initial Clinical Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={initialNotes}
              onChange={(e) => setInitialNotes(e.target.value)}
              placeholder="Document physical exam findings, bedside observations, or triage criteria..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
            {errors.notes && <p className="text-[11px] text-rose-500 mt-1">{errors.notes}</p>}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={followUpRequired}
                onChange={(e) => setFollowUpRequired(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium">Mandatory Follow-up Required</span>
            </label>

            {followUpRequired && (
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>

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
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              Create Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
