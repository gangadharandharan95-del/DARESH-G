import React, { useState } from 'react';
import { HealthSyncProvider, useHealthSync } from './context/HealthSyncContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';
import { RegisterPatientModal } from './components/modals/RegisterPatientModal';
import { CreateCaseModal } from './components/modals/CreateCaseModal';
import { ScheduleAppointmentModal } from './components/modals/ScheduleAppointmentModal';
import { OrderInvestigationModal } from './components/modals/OrderInvestigationModal';

// Views
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { PatientProfileView } from './views/PatientProfileView';
import { CasesView } from './views/CasesView';
import { CaseDetailsView } from './views/CaseDetailsView';
import { AppointmentsView } from './views/AppointmentsView';
import { FollowUpsView } from './views/FollowUpsView';
import { InvestigationsView } from './views/InvestigationsView';
import { AiInsightsView } from './views/AiInsightsView';
import { AnalyticsView } from './views/AnalyticsView';
import { WorkloadSimulatorView } from './views/WorkloadSimulatorView';
import { NotificationsView } from './views/NotificationsView';
import { UsersView } from './views/UsersView';
import { AuditLogView } from './views/AuditLogView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';

const AppContent: React.FC = () => {
  const { currentView } = useHealthSync();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global Creation Modals
  const [isRegisterPatientOpen, setIsRegisterPatientOpen] = useState(false);
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [isScheduleAppointmentOpen, setIsScheduleAppointmentOpen] = useState(false);
  const [isOrderInvestigationOpen, setIsOrderInvestigationOpen] = useState(false);

  // Target preselected IDs when opening modal from specific contexts
  const [preselectedPatientId, setPreselectedPatientId] = useState<string | undefined>(undefined);
  const [preselectedCaseId, setPreselectedCaseId] = useState<string | undefined>(undefined);

  const openRegisterPatient = () => {
    setIsRegisterPatientOpen(true);
  };

  const openCreateCase = (patientId?: string) => {
    setPreselectedPatientId(patientId);
    setIsCreateCaseOpen(true);
  };

  const openScheduleAppointment = (patientId?: string) => {
    setPreselectedPatientId(patientId);
    setIsScheduleAppointmentOpen(true);
  };

  const openOrderInvestigation = (patientId?: string, caseId?: string) => {
    setPreselectedPatientId(patientId);
    setPreselectedCaseId(caseId);
    setIsOrderInvestigationOpen(true);
  };

  // If user is on the login screen
  if (currentView === 'login') {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#172033] font-sans antialiased">
      {/* Sidebar matching screenshot */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Top Header matching screenshot */}
      <TopHeader collapsed={sidebarCollapsed} />

      {/* Main Content Viewport */}
      <main
        className={`flex-1 pt-20 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-60'
        }`}
      >
        <div className="max-w-[1400px] mx-auto py-2">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'patients' && (
            <PatientsView
              onOpenRegisterModal={openRegisterPatient}
              onOpenCreateCaseModal={openCreateCase}
            />
          )}
          {currentView === 'patient-profile' && (
            <PatientProfileView
              onOpenCreateCaseModal={openCreateCase}
              onOpenAppointmentModal={openScheduleAppointment}
              onOpenInvestigationModal={openOrderInvestigation}
            />
          )}
          {currentView === 'cases' && (
            <CasesView onOpenCreateCaseModal={() => openCreateCase()} />
          )}
          {currentView === 'case-details' && <CaseDetailsView />}
          {currentView === 'appointments' && (
            <AppointmentsView onOpenAppointmentModal={openScheduleAppointment} />
          )}
          {currentView === 'follow-ups' && <FollowUpsView />}
          {currentView === 'investigations' && (
            <InvestigationsView onOpenInvestigationModal={() => openOrderInvestigation()} />
          )}
          {currentView === 'ai-insights' && <AiInsightsView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'workload-simulator' && <WorkloadSimulatorView />}
          {currentView === 'notifications' && <NotificationsView />}
          {currentView === 'users' && <UsersView />}
          {currentView === 'audit-log' && <AuditLogView />}
          {currentView === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <RegisterPatientModal
        isOpen={isRegisterPatientOpen}
        onClose={() => setIsRegisterPatientOpen(false)}
      />
      <CreateCaseModal
        isOpen={isCreateCaseOpen}
        onClose={() => setIsCreateCaseOpen(false)}
        preselectedPatientId={preselectedPatientId}
      />
      <ScheduleAppointmentModal
        isOpen={isScheduleAppointmentOpen}
        onClose={() => setIsScheduleAppointmentOpen(false)}
        preselectedPatientId={preselectedPatientId}
      />
      <OrderInvestigationModal
        isOpen={isOrderInvestigationOpen}
        onClose={() => setIsOrderInvestigationOpen(false)}
        preselectedPatientId={preselectedPatientId}
        preselectedCaseId={preselectedCaseId}
      />
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HealthSyncProvider>
      <AppContent />
    </HealthSyncProvider>
  );
}
