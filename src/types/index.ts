export type Role = 'Doctor' | 'Nurse' | 'Administrator' | 'Receptionist' | 'Laboratory Staff' | 'Auditor';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type CaseStatus =
  | 'new'
  | 'assigned'
  | 'treatment_in_progress'
  | 'investigation_pending'
  | 'awaiting_investigation'
  | 'awaiting_review'
  | 'on_hold'
  | 'follow_up_required'
  | 'resolved'
  | 'closed';

export type Department =
  | 'Cardiology'
  | 'Orthopedics'
  | 'General Medicine'
  | 'Pediatrics'
  | 'Surgery'
  | 'Neurology'
  | 'Emergency Medicine'
  | 'Oncology'
  | 'Others';

export type PatientStatus = 'Active' | 'Under Observation' | 'Discharged' | 'Critical';

export interface Patient {
  id: string; // P-1001
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  department: Department;
  assignedClinician: string;
  activeCasesCount: number;
  lastVisit: string;
  status: PatientStatus;
  contact: string;
  email: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: string;
  allergies: string[];
  chronicConditions: string[];
  notes: string;
  consentAgreed: boolean;
  registeredAt: string;
}

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: Role;
  eventType: 'created' | 'assessment' | 'investigation_requested' | 'investigation_result' | 'treatment_updated' | 'followup_scheduled' | 'status_changed' | 'closed';
  description: string;
  note?: string;
  statusTransition?: { from: CaseStatus; to: CaseStatus };
}

export interface PatientCase {
  id: string; // CASE-2026-001
  patientId: string;
  patientName: string;
  title: string;
  department: Department;
  assignedClinician: string;
  priority: Priority;
  status: CaseStatus;
  symptoms: string[];
  initialNotes: string;
  category: 'Surgical' | 'Chronic' | 'Post-Operative' | 'Diagnostic Inquiry' | 'Routine Monitoring';
  followUpRequired: boolean;
  nextFollowUpDate?: string;
  followUpDate?: string;
  durationDays?: number;
  createdAt: string;
  updatedAt: string;
  timeline: CaseTimelineEvent[];
}

export type AppointmentStatus = 'confirmed' | 'scheduled' | 'completed' | 'cancelled' | 'missed';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  clinician: string;
  department: Department;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  type: 'Initial Consultation' | 'Follow-up' | 'Pre-op Review' | 'General Consultation';
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export type InvestigationStatus =
  | 'requested'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'result_available'
  | 'cancelled';

export interface Investigation {
  id: string;
  patientId: string;
  patientName: string;
  caseId: string;
  caseTitle: string;
  investigationType: string;
  requestingClinician: string;
  requestDate: string;
  completedDate?: string;
  status: InvestigationStatus;
  priority: Priority;
  findings?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  attachmentRef?: string;
  notes?: string;
}

export interface AIInsight {
  id: string;
  caseId: string;
  patientId: string;
  patientName: string;
  priority: Priority;
  category: 'case_priority' | 'investigation_pending' | 'followup_required' | 'treatment_progress';
  title: string;
  summary: string;
  contributingFactors: string[];
  confidenceScore: number;
  timestamp: string;
  dataSource: string;
  modelVersion: string;
  recommendedAction: string;
  reviewed: boolean;
  reviewerFeedback?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  status: 'Active' | 'Inactive';
  avatar?: string;
  lastActive: string;
  permissions: string[];
}

export type Permission = string;

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'investigation' | 'case' | 'alert';
  recordId?: string;
  recordType?: 'case' | 'patient' | 'appointment' | 'investigation';
  timestamp: string;
  read: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userName: string;
  userRole: Role;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
}

export interface SimulationParams {
  dailyRegistrations: number; // e.g. 50
  availableDoctors: number; // e.g. 10
  avgAppointmentDurationMin: number; // e.g. 30 min
  investigationProcessingDays: number; // e.g. 2 days
  currentBacklog: number; // e.g. 20
}

export interface SimulationResult {
  estimatedWaitDays: number;
  totalCases7Days: number;
  doctorUtilizationHours: number;
  doctorCount: number;
  capacityPercent: number;
  queueLength: number;
  trendDays: { day: string; current: number; afterChanges: number }[];
}
