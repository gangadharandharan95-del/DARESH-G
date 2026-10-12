import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Plus,
  UserPlus,
  LogIn,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';
import { INITIAL_USERS } from '../data/demo-data';
import { Role, Department } from '../types';

export const LoginView: React.FC = () => {
  const { login, createUser, showToast } = useHealthSync();

  // Mobile active tab ('signin' | 'register')
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In state
  const [loginUsername, setLoginUsername] = useState('sarah.johnson@healthsync.hospital');
  const [loginPassword, setLoginPassword] = useState('Hospital@2026');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register / Create Account state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<Role>('Doctor');
  const [regDept, setRegDept] = useState<Department>('General Medicine');
  const [regStaffId, setRegStaffId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [regError, setRegError] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const user =
      INITIAL_USERS.find((u) => u.email.toLowerCase() === loginUsername.toLowerCase().trim()) ||
      INITIAL_USERS[0];
    login(user);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Please provide your full legal or staff name.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Valid hospital email address is required.');
      return;
    }
    if (!regPassword) {
      setRegError('Please choose a secure password.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify.');
      return;
    }
    if (!termsAgreed) {
      setRegError('Please acknowledge the hospital credential compliance agreement.');
      return;
    }

    const newUser = createUser({
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      department: regDept,
      status: 'Active',
      lastActive: 'Just registered',
      permissions: ['view_patients', 'create_cases', 'view_analytics', 'order_investigations'],
    });

    showToast('success', `Account created for ${newUser.name}! Welcome to HealthSync.`, 'Account Provisioned');
    login(newUser);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute w-[32rem] h-[32rem] rounded-full bg-blue-300/20 blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-[32rem] h-[32rem] rounded-full bg-cyan-300/20 blur-3xl -bottom-20 -right-20 pointer-events-none" />

      {/* Brand Header matching bottom-right screenshot */}
      <div className="flex flex-col items-center text-center mb-6 relative">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Health<span className="text-blue-600">Sync</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Better Tracking, Healthier Tomorrows.
        </p>

        {/* Quick return button */}
        <button
          onClick={() => login(INITIAL_USERS[0])}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-blue-600 text-[11px] font-semibold border border-slate-200 shadow-2xs transition-all"
        >
          <span>← Continue to Clinical Dashboard</span>
        </button>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex items-center p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 mb-4 shadow-2xs">
        <button
          onClick={() => setActiveTab('signin')}
          className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'signin' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In Column</span>
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'register' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register & Create Account</span>
        </button>
      </div>

      {/* Dual Column Container: Left = Sign In, Right = Register & Create Account */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        
        {/* ========================================================= */}
        {/* COLUMN 1: SIGN IN                                         */}
        {/* ========================================================= */}
        <div className={`p-6 sm:p-8 flex flex-col justify-between space-y-5 ${activeTab === 'register' ? 'hidden md:flex' : 'flex'}`}>
          <div>
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                  Column 1 · Existing User
                </span>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Sign In</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Access your clinical workspace to continue
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <LogIn className="w-4 h-4" />
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3.5 mt-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Email or Username
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="name@healthsync.hospital"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2.5"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px]">Remember me</span>
                </label>

                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to demo account.');
                  }}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Sign In
              </button>
            </form>

            {/* Quick Demo Switcher Strip */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                1-Click Quick Demo Sign In
              </span>
              <div className="grid grid-cols-2 gap-2">
                {INITIAL_USERS.slice(0, 4).map((usr) => (
                  <button
                    key={usr.id}
                    type="button"
                    onClick={() => login(usr)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-100 text-left transition-all"
                  >
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                      {usr.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{usr.role} · {usr.department}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-3 border-t border-slate-100">
            Protected under HIPAA & clinical credentialing protocols.
          </p>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: REGISTER & CREATE AN ACCOUNT                    */}
        {/* ========================================================= */}
        <div className={`p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-slate-50/50 ${activeTab === 'signin' ? 'hidden md:flex' : 'flex'}`}>
          <div>
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Column 2 · New Registration
                </span>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Register & Create Account</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enroll hospital staff credentials & clinical privileges
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Prefill Button for Demo Testing */}
            <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs">
              <span className="text-[11px] text-emerald-800 font-medium">Quick Test:</span>
              <button
                type="button"
                onClick={() => {
                  setRegName('Dr. Elena Rostova');
                  setRegEmail('e.rostova@healthsync.hospital');
                  setRegRole('Doctor');
                  setRegDept('Cardiology');
                  setRegStaffId('MED-9942-CARD');
                  setRegPassword('Hospital@2026');
                  setRegConfirmPassword('Hospital@2026');
                  setTermsAgreed(true);
                  setRegError('');
                }}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg border border-emerald-300 text-[11px] shadow-2xs transition-colors"
              >
                ⚡ Prefill Demo Clinician
              </button>
            </div>

            {regError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 mt-3">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-[11px]">{regError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="space-y-3 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Vance"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Hospital Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="a.vance@healthsync.hospital"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as Role)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white text-slate-700 font-medium"
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
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value as Department)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white text-slate-700 font-medium"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Employee ID / License #
                </label>
                <input
                  type="text"
                  value={regStaffId}
                  onChange={(e) => setRegStaffId(e.target.value)}
                  placeholder="e.g. LIC-9942-MED"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 pr-8 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1.5"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    I verify clinical staff authority and agree to hospital data compliance policies.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors mt-2"
              >
                Create Account & Sign In
              </button>
            </form>
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-3 border-t border-slate-100">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign In above
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
