import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  PatientCase,
  Appointment,
  Investigation,
  AIInsight,
  User,
  AppNotification,
  AuditEvent,
  CaseStatus,
  CaseTimelineEvent,
  Role,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_CASES,
  INITIAL_APPOINTMENTS,
  INITIAL_INVESTIGATIONS,
  INITIAL_AI_INSIGHTS,
  INITIAL_USERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  getStoredData,
  setStoredData,
  resetAllDataToDefault,
} from '../data/demo-data';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

export type ViewType =
  | 'dashboard'
  | 'patients'
  | 'patient-profile'
  | 'cases'
  | 'case-details'
  | 'appointments'
  | 'follow-ups'
  | 'investigations'
  | 'ai-insights'
  | 'analytics'
  | 'workload-simulator'
  | 'notifications'
  | 'users'
  | 'audit-log'
  | 'settings'
  | 'login';

interface HealthSyncContextType {
  currentUser: User | null;
  patients: Patient[];
  cases: PatientCase[];
  appointments: Appointment[];
  investigations: Investigation[];
  insights: AIInsight[];
  users: User[];
  notifications: AppNotification[];
  auditLogs: AuditEvent[];
  toasts: Toast[];
  currentView: ViewType;
  selectedPatientId: string | null;
  selectedCaseId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  // Navigation
  navigate: (view: ViewType, params?: { patientId?: string; caseId?: string }) => void;
  // Auth
  login: (user: User) => void;
  logout: () => void;
  // Toast
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
  removeToast: (id: string) => void;
  // Mutations
  registerPatient: (patient: Omit<Patient, 'id' | 'activeCasesCount' | 'registeredAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  createCase: (newCase: Omit<PatientCase, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => PatientCase;
  updateCaseStatus: (caseId: string, newStatus: CaseStatus, note?: string) => boolean;
  addCaseNote: (caseId: string, note: string) => void;
  reassignCase: (caseId: string, newClinician: string) => void;
  createAppointment: (appt: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string, reason: string) => void;
  completeAppointment: (id: string) => void;
  createInvestigation: (inv: Omit<Investigation, 'id'>) => Investigation;
  updateInvestigationResult: (
    id: string,
    findings: string,
    referenceRange: string,
    isAbnormal: boolean,
    notes?: string
  ) => void;
  updateInvestigationStatus: (id: string, status: Investigation['status']) => void;
  reviewInsight: (id: string, feedback: string) => void;
  createUser: (user: Omit<User, 'id'>) => User;
  updateUserRole: (id: string, newRole: Role) => void;
  toggleUserStatus: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetAllDemoData: () => void;
}

const HealthSyncContext = createContext<HealthSyncContextType | undefined>(undefined);

export const HealthSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getStoredData<User | null>('healthsync_current_user', INITIAL_USERS[0])
  );
  const [patients, setPatients] = useState<Patient[]>(() =>
    getStoredData<Patient[]>('healthsync_patients', INITIAL_PATIENTS)
  );
  const [cases, setCases] = useState<PatientCase[]>(() =>
    getStoredData<PatientCase[]>('healthsync_cases', INITIAL_CASES)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getStoredData<Appointment[]>('healthsync_appointments', INITIAL_APPOINTMENTS)
  );
  const [investigations, setInvestigations] = useState<Investigation[]>(() =>
    getStoredData<Investigation[]>('healthsync_investigations', INITIAL_INVESTIGATIONS)
  );
  const [insights, setInsights] = useState<AIInsight[]>(() =>
    getStoredData<AIInsight[]>('healthsync_insights', INITIAL_AI_INSIGHTS)
  );
  const [users, setUsers] = useState<User[]>(() =>
    getStoredData<User[]>('healthsync_users', INITIAL_USERS)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getStoredData<AppNotification[]>('healthsync_notifications', INITIAL_NOTIFICATIONS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() =>
    getStoredData<AuditEvent[]>('healthsync_audit_logs', INITIAL_AUDIT_LOGS)
  );

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('P-1002');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('CASE-2026-001');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    setStoredData('healthsync_current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStoredData('healthsync_patients', patients);
  }, [patients]);

  useEffect(() => {
    setStoredData('healthsync_cases', cases);
  }, [cases]);

  useEffect(() => {
    setStoredData('healthsync_appointments', appointments);
  }, [appointments]);

  useEffect(() => {
    setStoredData('healthsync_investigations', investigations);
  }, [investigations]);

  useEffect(() => {
    setStoredData('healthsync_insights', insights);
  }, [insights]);

  useEffect(() => {
    setStoredData('healthsync_users', users);
  }, [users]);

  useEffect(() => {
    setStoredData('healthsync_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    setStoredData('healthsync_audit_logs', auditLogs);
  }, [auditLogs]);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
    const id = `TOAST-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: Toast = { id, type, message, title };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const recordAudit = (action: string, targetType: string, targetId: string, details: string) => {
    const newAudit: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userName: currentUser ? currentUser.name : 'Dr. Sarah Johnson',
      userRole: currentUser ? currentUser.role : 'Doctor',
      action,
      targetType,
      targetId,
      details,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const navigate = (view: ViewType, params?: { patientId?: string; caseId?: string }) => {
    if (params?.patientId) setSelectedPatientId(params.patientId);
    if (params?.caseId) setSelectedCaseId(params.caseId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (user: User) => {
    setCurrentUser(user);
    showToast('success', `Signed in as ${user.name} (${user.role})`);
    recordAudit('User Login', 'Auth', user.id, `User logged in under role ${user.role}`);
    navigate('dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('info', 'Signed out of HealthSync.');
    navigate('login');
  };

  const registerPatient = (patientData: Omit<Patient, 'id' | 'activeCasesCount' | 'registeredAt'>): Patient => {
    const nextNum = 1000 + patients.length + 1;
    const newPatient: Patient = {
      ...patientData,
      id: `P-${nextNum}`,
      activeCasesCount: 0,
      registeredAt: new Date().toISOString().split('T')[0],
    };

    setPatients((prev) => [newPatient, ...prev]);
    recordAudit('Patient Registered', 'Patient', newPatient.id, `Registered patient ${newPatient.name}`);
    showToast('success', `Patient ${newPatient.name} (${newPatient.id}) registered.`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    recordAudit('Patient Updated', 'Patient', id, `Updated patient record details.`);
    showToast('success', 'Patient record updated.');
  };

  const createCase = (newCaseData: Omit<PatientCase, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): PatientCase => {
    const nextNum = String(cases.length + 1).padStart(3, '0');
    const id = `CASE-2026-${nextNum}`;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const initialEvent: CaseTimelineEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: nowStr,
      actor: currentUser ? currentUser.name : 'Dr. Sarah Johnson',
      role: currentUser ? currentUser.role : 'Doctor',
      eventType: 'created',
      description: 'Case created',
      note: newCaseData.initialNotes,
    };

    const newCase: PatientCase = {
      ...newCaseData,
      id,
      createdAt: nowStr,
      updatedAt: nowStr,
      timeline: [initialEvent],
    };

    setCases((prev) => [newCase, ...prev]);

    setPatients((prev) =>
      prev.map((p) => (p.id === newCase.patientId ? { ...p, activeCasesCount: p.activeCasesCount + 1 } : p))
    );

    recordAudit('Case Created', 'Case', id, `Created case ${newCase.title} for ${newCase.patientName}`);
    showToast('success', `Case ${id} created.`);
    return newCase;
  };

  const updateCaseStatus = (caseId: string, newStatus: CaseStatus, note?: string): boolean => {
    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase) return false;

    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: CaseTimelineEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: nowStr,
      actor: currentUser ? currentUser.name : 'Dr. Sarah Johnson',
      role: currentUser ? currentUser.role : 'Doctor',
      eventType: 'status_changed',
      description: `Status changed to ${newStatus.replace(/_/g, ' ')}`,
      note,
      statusTransition: { from: targetCase.status, to: newStatus },
    };

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: newStatus,
            updatedAt: nowStr,
            timeline: [newEvent, ...c.timeline],
          };
        }
        return c;
      })
    );

    recordAudit('Status Updated', 'Case', caseId, `Status transitioned to ${newStatus}`);
    showToast('success', `Case ${caseId} status updated to ${newStatus.replace(/_/g, ' ').toUpperCase()}`);
    return true;
  };

  const addCaseNote = (caseId: string, note: string) => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: CaseTimelineEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: nowStr,
      actor: currentUser ? currentUser.name : 'Dr. Sarah Johnson',
      role: currentUser ? currentUser.role : 'Doctor',
      eventType: 'assessment',
      description: 'Clinical observation added',
      note,
    };

    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, updatedAt: nowStr, timeline: [newEvent, ...c.timeline] } : c))
    );

    recordAudit('Note Added', 'Case', caseId, `Recorded clinical note: ${note.substring(0, 30)}...`);
    showToast('success', 'Progress note added to case timeline.');
  };

  const reassignCase = (caseId: string, newClinician: string) => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: CaseTimelineEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: nowStr,
      actor: currentUser ? currentUser.name : 'Dr. Sarah Johnson',
      role: currentUser ? currentUser.role : 'Doctor',
      eventType: 'status_changed',
      description: `Reassigned to ${newClinician}`,
    };

    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, assignedClinician: newClinician, updatedAt: nowStr, timeline: [newEvent, ...c.timeline] } : c))
    );

    recordAudit('Case Reassigned', 'Case', caseId, `Reassigned clinician to ${newClinician}`);
    showToast('success', `Case reassigned to ${newClinician}.`);
  };

  const createAppointment = (apptData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const nextNum = 300 + appointments.length + 1;
    const newAppt: Appointment = {
      ...apptData,
      id: `APT-${nextNum}`,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppt, ...prev]);
    recordAudit('Appointment Scheduled', 'Appointment', newAppt.id, `Booked ${newAppt.type} for ${newAppt.patientName}`);
    showToast('success', `Appointment scheduled for ${newAppt.patientName}`);
    return newAppt;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    recordAudit('Appointment Updated', 'Appointment', id, `Updated appointment time or status`);
    showToast('success', 'Appointment updated.');
  };

  const cancelAppointment = (id: string, reason: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled', notes: `${a.notes} [Cancelled: ${reason}]` } : a))
    );
    recordAudit('Appointment Cancelled', 'Appointment', id, `Cancelled: ${reason}`);
    showToast('info', 'Appointment cancelled.');
  };

  const completeAppointment = (id: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'completed' } : a)));
    recordAudit('Appointment Completed', 'Appointment', id, `Marked appointment completed`);
    showToast('success', 'Appointment marked completed.');
  };

  const createInvestigation = (invData: Omit<Investigation, 'id'>): Investigation => {
    const nextNum = 100 + investigations.length + 1;
    const newInv: Investigation = {
      ...invData,
      id: `INV-${nextNum}`,
    };

    setInvestigations((prev) => [newInv, ...prev]);
    recordAudit('Investigation Ordered', 'Investigation', newInv.id, `Ordered ${newInv.investigationType}`);
    showToast('success', `Investigation ${newInv.id} ordered.`);
    return newInv;
  };

  const updateInvestigationResult = (
    id: string,
    findings: string,
    referenceRange: string,
    isAbnormal: boolean,
    notes?: string
  ) => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInvestigations((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              findings,
              referenceRange,
              isAbnormal,
              notes: notes || inv.notes,
              status: 'result_available',
              completedDate: nowStr,
            }
          : inv
      )
    );
    recordAudit('Investigation Result Recorded', 'Investigation', id, `Recorded findings`);
    showToast('success', `Investigation result saved.`);
  };

  const updateInvestigationStatus = (id: string, status: Investigation['status']) => {
    setInvestigations((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
    recordAudit('Investigation Status Changed', 'Investigation', id, `Updated to ${status}`);
    showToast('success', `Status updated to ${status}.`);
  };

  const reviewInsight = (id: string, feedback: string) => {
    setInsights((prev) => prev.map((ins) => (ins.id === id ? { ...ins, reviewed: true, reviewerFeedback: feedback } : ins)));
    recordAudit('AI Insight Reviewed', 'Insight', id, `Clinician feedback: ${feedback}`);
    showToast('success', 'Insight reviewed.');
  };

  const createUser = (userData: Omit<User, 'id'>): User => {
    const nextNum = String(users.length + 1).padStart(2, '0');
    const newUser: User = { ...userData, id: `USR-${nextNum}` };
    setUsers((prev) => [...prev, newUser]);
    recordAudit('User Created', 'User', newUser.id, `Created ${newUser.name}`);
    showToast('success', `User ${newUser.name} created.`);
    return newUser;
  };

  const updateUserRole = (id: string, newRole: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    recordAudit('User Role Updated', 'User', id, `Role changed to ${newRole}`);
    showToast('success', `Role updated to ${newRole}.`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u)));
    showToast('info', 'Account status toggled.');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('info', 'All notifications marked as read.');
  };

  const resetAllDemoData = () => {
    resetAllDataToDefault();
    setPatients(INITIAL_PATIENTS);
    setCases(INITIAL_CASES);
    setAppointments(INITIAL_APPOINTMENTS);
    setInvestigations(INITIAL_INVESTIGATIONS);
    setInsights(INITIAL_AI_INSIGHTS);
    setUsers(INITIAL_USERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(INITIAL_USERS[0]);
    showToast('success', 'Demo data reset to factory state.');
  };

  return (
    <HealthSyncContext.Provider
      value={{
        currentUser,
        patients,
        cases,
        appointments,
        investigations,
        insights,
        users,
        notifications,
        auditLogs,
        toasts,
        currentView,
        selectedPatientId,
        selectedCaseId,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        navigate,
        login,
        logout,
        showToast,
        removeToast,
        registerPatient,
        updatePatient,
        createCase,
        updateCaseStatus,
        addCaseNote,
        reassignCase,
        createAppointment,
        updateAppointment,
        cancelAppointment,
        completeAppointment,
        createInvestigation,
        updateInvestigationResult,
        updateInvestigationStatus,
        reviewInsight,
        createUser,
        updateUserRole,
        toggleUserStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetAllDemoData,
      }}
    >
      {children}
    </HealthSyncContext.Provider>
  );
};

export const useHealthSync = () => {
  const context = useContext(HealthSyncContext);
  if (!context) {
    throw new Error('useHealthSync must be used within a HealthSyncProvider');
  }
  return context;
};
