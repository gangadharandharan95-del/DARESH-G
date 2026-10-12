import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, BriefcaseMedical, Calendar, FlaskConical, ArrowRight } from 'lucide-react';
import { useHealthSync } from '../../context/HealthSyncContext';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, patients, cases, appointments, investigations, navigate } = useHealthSync();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.department.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchingCases = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.patientName.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchingAppointments = appointments.filter(
    (a) =>
      a.id.toLowerCase().includes(q) ||
      a.patientName.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.clinician.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchingInvestigations = investigations.filter(
    (i) =>
      i.id.toLowerCase().includes(q) ||
      i.investigationType.toLowerCase().includes(q) ||
      i.patientName.toLowerCase().includes(q)
  ).slice(0, 3);

  const totalResults = matchingPatients.length + matchingCases.length + matchingAppointments.length + matchingInvestigations.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, case IDs, tests, clinicians..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-600 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-600 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-0.5 text-xs bg-slate-100 border border-slate-200 rounded font-mono text-slate-600 cursor-pointer"
          >
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4">
          {q && totalResults === 0 && (
            <div className="py-12 text-center text-slate-600 text-sm">
              No clinical records matching "{query}".
            </div>
          )}

          {/* Patients */}
          {matchingPatients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                Patients
              </div>
              <div className="mt-1 space-y-1">
                {matchingPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      navigate('patient-profile', { patientId: p.id });
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                        {p.name} <span className="text-xs text-slate-600 tabular-nums">({p.id})</span>
                      </p>
                      <p className="text-xs text-slate-600">
                        {p.department} · {p.age}y · Dr: {p.assignedClinician}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cases */}
          {matchingCases.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <BriefcaseMedical className="w-3.5 h-3.5 text-emerald-500" />
                Clinical Cases
              </div>
              <div className="mt-1 space-y-1">
                {matchingCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigate('case-details', { caseId: c.id });
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600">
                        {c.title}{' '}
                        <span className="text-xs text-slate-600 tabular-nums">({c.id})</span>
                      </p>
                      <p className="text-xs text-slate-600">
                        Patient: {c.patientName} · {c.department} · Status: {c.status.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investigations */}
          {matchingInvestigations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
                Diagnostic Investigations
              </div>
              <div className="mt-1 space-y-1">
                {matchingInvestigations.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      navigate('investigations');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-600">
                        {inv.investigationType}{' '}
                        <span className="text-xs text-slate-600 tabular-nums">({inv.id})</span>
                      </p>
                      <p className="text-xs text-slate-600">
                        Patient: {inv.patientName} · Status: {inv.status.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments */}
          {matchingAppointments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                Appointments
              </div>
              <div className="mt-1 space-y-1">
                {matchingAppointments.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      navigate('appointments');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-sky-600">
                        {a.type} with {a.patientName}
                      </p>
                      <p className="text-xs text-slate-600">
                        {a.date} at {a.time} · {a.clinician} ({a.department})
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>Search records across all active clinical modules</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
