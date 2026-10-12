import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useHealthSync } from '../../context/HealthSyncContext';
import { Department, PatientStatus } from '../../types';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const RegisterPatientModal: React.FC<RegisterPatientModalProps> = ({ isOpen, onClose }) => {
  const { registerPatient, patients } = useHealthSync();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('1985-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [department, setDepartment] = useState<Department>('General Medicine');
  const [assignedClinician, setAssignedClinician] = useState('Dr. Alex Vance');
  const [contact, setContact] = useState('+1 (555) 234-8900');
  const [email, setEmail] = useState('');
  const [emergencyName, setEmergencyName] = useState('James Smith');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 234-8901');
  const [address, setAddress] = useState('124 Cedar Avenue, District 4');
  const [allergiesText, setAllergiesText] = useState('None known');
  const [conditionsText, setConditionsText] = useState('');
  const [notes, setNotes] = useState('Patient self-registered at primary admission triage.');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Check potential duplicates
  const isPotentialDuplicate = patients.some(
    (p) => p.name.toLowerCase() === name.trim().toLowerCase() && name.trim().length > 2
  );

  const calculateAge = (dobString: string): number => {
    const birthday = new Date(dobString);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) || 30;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Patient full legal name is required.';
    if (!dob) newErrors.dob = 'Date of birth is required.';
    if (!contact.trim()) newErrors.contact = 'Primary contact telephone is required.';
    if (!emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required.';
    if (!emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required.';
    if (!consentAgreed) newErrors.consent = 'Patient consent acknowledgment is required for registration.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const allergies = allergiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const chronicConditions = conditionsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    registerPatient({
      name: name.trim(),
      age: calculateAge(dob),
      gender,
      dob,
      bloodGroup,
      department,
      assignedClinician,
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Active',
      contact: contact.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example-synthetic.com`,
      emergencyContact: {
        name: emergencyName.trim(),
        relationship: 'Family Contact',
        phone: emergencyPhone.trim(),
      },
      address: address.trim(),
      allergies,
      chronicConditions,
      notes,
      consentAgreed,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Register New Patient</h3>
              <p className="text-xs text-slate-600">Enter synthetic demographic and admission details</p>
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
          {isPotentialDuplicate && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Duplicate Warning:</span> A patient with the name "{name}" is already registered in the system. Proceed only if this is a distinct record.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g. Eleanor Vance"
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.name ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                } focus:outline-none focus:border-indigo-500`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admission Department</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Relative or guardian name"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Known Allergies (comma-separated)</label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="Penicillin, Sulfa, Latex"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chronic Conditions (comma-separated)</label>
              <input
                type="text"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                placeholder="Hypertension, Asthma"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Admission Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-700 font-medium cursor-pointer p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
              <input
                type="checkbox"
                defaultChecked={true}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-blue-900 block">
                  Create & Register Patient Portal Account
                </span>
                <span className="text-[11px] text-blue-700 block">
                  Automatically provisions digital patient credentials, MRN access, and sends secure activation notice.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                Demonstration consent acknowledgement: I verify that the synthetic patient registration details entered are for simulation and clinical workflow validation purposes.
              </span>
            </label>
            {errors.consent && <p className="text-[11px] text-rose-500 mt-1">{errors.consent}</p>}
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
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
