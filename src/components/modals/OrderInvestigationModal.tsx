import React, { useState } from 'react';
import { X, FlaskConical } from 'lucide-react';
import { useHealthSync } from '../../context/HealthSyncContext';
import { Priority } from '../../types';

interface OrderInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  preselectedCaseId?: string;
}

const COMMON_INVESTIGATIONS = [
  'High-Sensitivity Troponin I (Serial)',
  'Complete Blood Count with Differential',
  'Comprehensive Metabolic Panel (CMP)',
  '12-Lead Electrocardiogram (ECG)',
  'Transthoracic Echocardiogram (TTE)',
  'Brain MRI with & without Contrast',
  'Chest CT Angiography (Rule-out PE)',
  'Contrast-Enhanced Abdominal & Pelvic CT',
  'Coagulation Profile (PT/INR/aPTT)',
  'Blood Cultures (Aerobic + Anaerobic)',
];

export const OrderInvestigationModal: React.FC<OrderInvestigationModalProps> = ({
  isOpen,
  onClose,
  preselectedPatientId,
  preselectedCaseId,
}) => {
  const { patients, cases, createInvestigation, currentUser } = useHealthSync();

  const [patientId, setPatientId] = useState(
    preselectedPatientId || (patients.length > 0 ? patients[0].id : '')
  );

  const patientCases = cases.filter((c) => c.patientId === patientId && c.status !== 'resolved');
  const [caseId, setCaseId] = useState(
    preselectedCaseId || (patientCases.length > 0 ? patientCases[0].id : '')
  );

  const [investigationType, setInvestigationType] = useState(COMMON_INVESTIGATIONS[0]);
  const [priority, setPriority] = useState<Priority>('high');
  const [notes, setNotes] = useState('Urgent diagnostic order for clinical evaluation.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    const relatedCase = cases.find((c) => c.id === caseId);

    createInvestigation({
      patientId,
      patientName: patient ? patient.name : 'Unknown Patient',
      caseId: caseId || (relatedCase ? relatedCase.id : 'CAS-1042'),
      caseTitle: relatedCase ? relatedCase.title : 'General Diagnostic Evaluation',
      investigationType,
      requestingClinician: currentUser?.name || 'Dr. Alex Vance',
      requestDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'requested',
      priority,
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
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Order Investigation</h3>
              <p className="text-xs text-slate-600">Request laboratory analysis or diagnostic imaging</p>
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => {
                setPatientId(e.target.value);
                const firstCase = cases.find((c) => c.patientId === e.target.value);
                if (firstCase) setCaseId(firstCase.id);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) — {p.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Linked Clinical Case</label>
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              {patientCases.length > 0 ? (
                patientCases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.title}
                  </option>
                ))
              ) : (
                <option value="">No active cases (creates standalone order)</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Investigation Type</label>
            <select
              value={investigationType}
              onChange={(e) => setInvestigationType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              {COMMON_INVESTIGATIONS.map((inv) => (
                <option key={inv} value={inv}>{inv}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="critical">Critical / STAT (Urgent Analysis)</option>
              <option value="high">High Priority</option>
              <option value="medium">Routine Priority</option>
              <option value="low">Elective</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Indication & Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
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
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
            >
              Order Investigation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
