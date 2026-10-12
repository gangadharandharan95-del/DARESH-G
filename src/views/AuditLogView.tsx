import React, { useState } from 'react';
import {
  FileText,
  Search,
  ShieldCheck,
  RotateCcw,
  Download,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';
import { exportDatasetToCSV } from '../data/demo-data';

export const AuditLogView: React.FC = () => {
  const { auditLogs, showToast } = useHealthSync();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (a) =>
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.details.toLowerCase().includes(search.toLowerCase()) ||
      a.targetId.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    exportDatasetToCSV('healthsync_compliance_audit_log', filteredLogs);
    showToast('success', 'Audit log exported to CSV.');
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Compliance & Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable, timestamped record of clinical case mutations, lab orders, and user logins
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, or case ID..."
            className="w-full max-w-sm px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold text-[11px] bg-slate-50/50">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Actor</th>
                <th className="py-2.5 px-4">Target</th>
                <th className="py-2.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 tabular-nums">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.userName} <span className="text-[10px] text-slate-400">({log.userRole})</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-blue-600 font-bold">
                    {log.targetId}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
