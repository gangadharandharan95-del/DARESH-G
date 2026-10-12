import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Bell,
  Palette,
  Database,
  RotateCcw,
  Download,
  Plus,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';

export const SettingsView: React.FC = () => {
  const {
    resetAllDemoData,
    showToast,
    patients,
    cases,
    appointments,
    investigations,
    createCase,
  } = useHealthSync();

  const [hospitalName, setHospitalName] = useState('St. Jude Metropolitan Medical Center');
  const [campusCode, setCampusCode] = useState('MAIN-CAMPUS-EAST');
  const [timezone, setTimezone] = useState('America/New_York (EST)');
  const [unitSystem, setUnitSystem] = useState('SI Metric (mmol/L, g/L, °C)');

  // Preferences
  const [enableSound, setEnableSound] = useState(false);
  const [statAlerts, setStatAlerts] = useState(true);
  const [compactTables, setCompactTables] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Preferences and hospital configuration saved successfully.');
  };

  const handleDownloadBackup = () => {
    const backupObj = {
      facility: hospitalName,
      exportedAt: new Date().toISOString(),
      patients,
      cases,
      appointments,
      investigations,
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthsync_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'Full JSON database backup downloaded.');
  };

  const handleGenerateExtraCases = () => {
    if (patients.length === 0) return;
    const randomP = patients[Math.floor(Math.random() * patients.length)];
    createCase({
      patientId: randomP.id,
      patientName: randomP.name,
      title: 'Acute Post-Viral Fatigue and Serology Assessment',
      department: 'General Medicine',
      assignedClinician: 'Dr. Sarah Chen',
      priority: 'medium',
      status: 'new',
      symptoms: ['Persistent fatigue', 'Subfebrile temperature'],
      initialNotes: 'Generated synthetic case for load testing and demonstration.',
      category: 'Diagnostic Inquiry',
      followUpRequired: true,
      followUpDate: '2026-10-20',
    });
    showToast('success', 'Synthetic demonstration case added to registry.');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          System Configuration & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Hospital instance settings, clinical alerting preferences, and demonstration data maintenance.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Facility Profile */}
        <div className="healthsync-card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Hospital Facility Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Facility Institution Name
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Campus Identifier Code
              </label>
              <input
                type="text"
                value={campusCode}
                onChange={(e) => setCampusCode(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hospital Clinical Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Laboratory Units System
              </label>
              <select
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="SI Metric (mmol/L, g/L, °C)">SI Metric (mmol/L, g/L, °C)</option>
                <option value="US Conventional (mg/dL, g/dL, °F)">US Conventional (mg/dL, g/dL, °F)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Alert Thresholds */}
        <div className="healthsync-card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Bell className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-800">Clinical Alerting & Notification Thresholds</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Critical STAT Lab Result Banners</span>
                <span className="text-slate-500">Show high-priority red popover when abnormal troponin or potassium occurs</span>
              </div>
              <input
                type="checkbox"
                checked={statAlerts}
                onChange={(e) => setStatAlerts(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Audio Notification Chimes</span>
                <span className="text-slate-500">Play subtle audible tone for incoming emergency trauma alerts</span>
              </div>
              <input
                type="checkbox"
                checked={enableSound}
                onChange={(e) => setEnableSound(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="healthsync-card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Palette className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-800">UI Density & Visual Styling</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">High-Density Compact Data Rows</span>
                <span className="text-slate-500">Reduce table row padding for scannability on larger monitors</span>
              </div>
              <input
                type="checkbox"
                checked={compactTables}
                onChange={(e) => setCompactTables(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Chart Smooth Animations</span>
                <span className="text-slate-500">Animate chart transitions and re-renders</span>
              </div>
              <input
                type="checkbox"
                checked={animateCharts}
                onChange={(e) => setAnimateCharts(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Demonstration Database Operations */}
      <div className="healthsync-card p-6 space-y-4 border-amber-200 bg-amber-50/20">
        <div className="flex items-center gap-2.5 pb-2 border-b border-amber-100">
          <Database className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-800">Demonstration Database Maintenance</h3>
        </div>

        <p className="text-xs text-slate-600">
          Tools for testing data mutations, creating backups, and restoring baseline configurations.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Download Full JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateExtraCases}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Inject Random Demo Case</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo records back to baseline state? This will wipe your recent changes.')) {
                resetAllDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Factory Baseline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
