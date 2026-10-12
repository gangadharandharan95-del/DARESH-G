import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Plus,
  UserCheck,
  UserX,
  Edit2,
  CheckCircle2,
  Lock,
  RotateCcw,
  Users,
  UserPlus,
  LayoutGrid,
  Table as TableIcon,
  KeyRound,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';
import { Role, User, Department, Permission } from '../types';

export const UsersView: React.FC = () => {
  const {
    users,
    createUser,
    updateUserRole,
    toggleUserStatus,
    currentUser,
    login,
    showToast,
  } = useHealthSync();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [layoutMode, setLayoutMode] = useState<'split' | 'full'>('split');

  // Inline "Register & Create Account" Column Form State
  const [colName, setColName] = useState('');
  const [colEmail, setColEmail] = useState('');
  const [colRole, setColRole] = useState<Role>('Doctor');
  const [colDept, setColDept] = useState<Department>('Cardiology');
  const [colStaffId, setColStaffId] = useState('');
  const [colPassword, setColPassword] = useState('Hospital@2026');
  const [colPermissions, setColPermissions] = useState<Permission[]>([
    'view_patients',
    'create_cases',
    'view_cases',
    'order_investigations',
  ]);
  const [colSuccessMsg, setColSuccessMsg] = useState('');
  const [colErrorMsg, setColErrorMsg] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('Doctor');
  const [newDept, setNewDept] = useState<Department>('Cardiology');

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [targetRole, setTargetRole] = useState<Role>('Doctor');

  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handler for Inline "Register & Create Account" Column
  const handleInlineRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setColErrorMsg('');
    setColSuccessMsg('');

    if (!colName.trim()) {
      setColErrorMsg('Full staff member name is required.');
      return;
    }
    if (!colEmail.trim()) {
      setColErrorMsg('Hospital email address is required.');
      return;
    }

    const newUser = createUser({
      name: colName.trim(),
      email: colEmail.trim(),
      role: colRole,
      department: colDept,
      status: 'Active',
      lastActive: 'Just registered',
      permissions: colPermissions,
    });

    setColSuccessMsg(`Account registered successfully for ${newUser.name} (${newUser.role})!`);
    showToast('success', `Created account for ${newUser.name}`, 'Account Provisioned');

    // Reset fields
    setColName('');
    setColEmail('');
    setColStaffId('');
  };

  const handlePrefillDemo = () => {
    setColName('Dr. Jordan Miller');
    setColEmail('j.miller@healthsync.hospital');
    setColRole('Doctor');
    setColDept('Neurology');
    setColStaffId('LIC-8821-NEURO');
    setColPassword('Hospital@2026');
    setColPermissions(['view_patients', 'create_cases', 'view_cases', 'order_investigations']);
    setColErrorMsg('');
    setColSuccessMsg('');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast('error', 'Name and email are required to create a user.');
      return;
    }

    createUser({
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      department: newDept,
      status: 'Active',
      lastActive: 'Just registered',
      permissions: ['view_patients', 'view_cases'],
    });

    setNewName('');
    setNewEmail('');
    setIsCreateOpen(false);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserRole(editingUser.id, targetRole);
    setEditingUser(null);
  };

  const togglePermission = (perm: Permission) => {
    setColPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Users, Roles & Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administrative user directory, role assignments, and permission matrices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Layout switcher: 2-Column (Directory + Register Column) vs Full Table */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setLayoutMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                layoutMode === 'split'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Two-column view with Register & Create Account column"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Two-Column View</span>
            </button>
            <button
              onClick={() => setLayoutMode('full')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                layoutMode === 'full'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full-width user directory table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Full Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsMatrixOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Permissions Matrix</span>
          </button>

          <button
            onClick={() => {
              if (layoutMode === 'split') {
                const el = document.getElementById('register-column-card');
                el?.scrollIntoView({ behavior: 'smooth' });
              } else {
                setIsCreateOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register & Create Account</span>
          </button>
        </div>
      </div>

      {/* Security Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
        <div>
          <strong>Role-Based Access Simulation:</strong> Active staff accounts govern front-end views, clinical decision actions, and patient case assignments.
        </div>
        <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
          RBAC · HIPAA Security Rule 45 CFR § 164.312
        </span>
      </div>

      {/* Main Grid: Left = Staff Directory, Right = Register & Create Account Column (when in split mode) */}
      <div className={`grid grid-cols-1 ${layoutMode === 'split' ? 'lg:grid-cols-12 gap-6' : 'gap-6'} items-start`}>
        
        {/* ========================================================= */}
        {/* COLUMN 1: ACTIVE STAFF DIRECTORY (lg:col-span-7)          */}
        {/* ========================================================= */}
        <div className={`${layoutMode === 'split' ? 'lg:col-span-7 space-y-4' : 'space-y-4'}`}>
          {/* Filter Bar */}
          <div className="healthsync-card p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user name or email..."
                  className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 w-52 sm:w-60"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700"
              >
                <option value="All">All Roles (6 Total)</option>
                <option value="Administrator">Administrator</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Laboratory Staff">Laboratory Staff</option>
                <option value="Auditor">Auditor</option>
              </select>
            </div>

            <span className="text-slate-500 text-[11px]">
              Showing <strong>{filteredUsers.length}</strong> active staff members
            </span>
          </div>

          {/* Users Table */}
          <div className="healthsync-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isCurrent = currentUser?.id === u.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {u.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                                {u.name}
                                {isCurrent && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                                    YOU
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'Administrator'
                                ? 'bg-purple-100 text-purple-800'
                                : u.role === 'Doctor'
                                ? 'bg-blue-100 text-blue-800'
                                : u.role === 'Nurse'
                                ? 'bg-emerald-100 text-emerald-800'
                                : u.role === 'Laboratory Staff'
                                ? 'bg-amber-100 text-amber-800'
                                : u.role === 'Receptionist'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {u.department}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                              u.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                            title="Click to toggle status"
                          >
                            {u.status}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isCurrent && (
                              <button
                                onClick={() => login(u)}
                                className="px-2 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100"
                              >
                                Switch
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setTargetRole(u.role);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                              title="Edit Role"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: REGISTER & CREATE AN ACCOUNT COLUMN (lg:col-span-5) */}
        {/* ========================================================= */}
        {layoutMode === 'split' && (
          <div id="register-column-card" className="lg:col-span-5">
            <div className="healthsync-card p-5 sm:p-6 bg-white border border-indigo-100 shadow-md rounded-2xl relative overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                      Register & Create Account Column
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Register & Create Account
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provision new staff credentials & configure access permissions
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>

              {/* Prefill shortcut */}
              <div className="mt-3.5 flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
                <span className="text-[11px] text-indigo-800 font-medium">Quick Demo Setup:</span>
                <button
                  type="button"
                  onClick={handlePrefillDemo}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold rounded-lg border border-indigo-200 text-[11px] shadow-2xs transition-colors"
                >
                  ⚡ Prefill Sample Clinician
                </button>
              </div>

              {colSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 mt-3 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-[11px]">{colSuccessMsg}</span>
                </div>
              )}

              {colErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 mt-3">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="text-[11px]">{colErrorMsg}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleInlineRegister} className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Staff Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={colName}
                    onChange={(e) => setColName(e.target.value)}
                    placeholder="e.g. Dr. Jordan Miller"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Hospital Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={colEmail}
                    onChange={(e) => setColEmail(e.target.value)}
                    placeholder="j.miller@healthsync.hospital"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Assigned Role
                    </label>
                    <select
                      value={colRole}
                      onChange={(e) => setColRole(e.target.value as Role)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-slate-700 font-medium"
                    >
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Laboratory Staff">Laboratory Staff</option>
                      <option value="Auditor">Auditor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={colDept}
                      onChange={(e) => setColDept(e.target.value as Department)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-slate-700 font-medium"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Laboratory">Laboratory</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      License / Staff ID
                    </label>
                    <input
                      type="text"
                      value={colStaffId}
                      onChange={(e) => setColStaffId(e.target.value)}
                      placeholder="e.g. LIC-8821"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Initial Password
                    </label>
                    <input
                      type="password"
                      value={colPassword}
                      onChange={(e) => setColPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>

                {/* Permissions checklist */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                    Assigned Privilege Flags
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={colPermissions.includes('view_patients')}
                        onChange={() => togglePermission('view_patients')}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>View Patients</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={colPermissions.includes('create_cases')}
                        onChange={() => togglePermission('create_cases')}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Create Cases</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={colPermissions.includes('order_investigations')}
                        onChange={() => togglePermission('order_investigations')}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Order Labs</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={colPermissions.includes('view_analytics')}
                        onChange={() => togglePermission('view_analytics')}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>View Analytics</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register & Create Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setColName('');
                      setColEmail('');
                      setColStaffId('');
                      setColErrorMsg('');
                      setColSuccessMsg('');
                    }}
                    className="px-3 py-2.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Permissions Matrix Modal */}
      {isMatrixOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hospital Role Permissions Matrix</h3>
                <p className="text-xs text-slate-500">
                  Granular functional capabilities mapped to each hospital clinical role.
                </p>
              </div>
              <button
                onClick={() => setIsMatrixOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3 text-center">View EMR</th>
                    <th className="py-2.5 px-3 text-center">Create Cases</th>
                    <th className="py-2.5 px-3 text-center">Order Labs</th>
                    <th className="py-2.5 px-3 text-center">AI Insights</th>
                    <th className="py-2.5 px-3 text-center">Analytics</th>
                    <th className="py-2.5 px-3 text-center">Audit Logs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-800">Administrator</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-800">Doctor</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-800">Nurse</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-800">Receptionist</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-800">Laboratory Staff</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-800">Auditor</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setIsMatrixOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Edit User Role</h3>
            <p className="text-xs text-slate-500">
              Update authorization role for {editingUser.name}.
            </p>
            <form onSubmit={handleSaveRole} className="space-y-4">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as Role)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Administrator">Administrator</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Laboratory Staff">Laboratory Staff</option>
                <option value="Auditor">Auditor</option>
              </select>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
