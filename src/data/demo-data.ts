import {
  Patient,
  PatientCase,
  Appointment,
  Investigation,
  AIInsight,
  User,
  AppNotification,
  AuditEvent,
  SimulationParams,
  SimulationResult,
} from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-1001',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    dob: '1981-06-12',
    bloodGroup: 'O+',
    department: 'Cardiology',
    assignedClinician: 'Dr. Priya Nair',
    activeCasesCount: 1,
    lastVisit: '2026-04-26',
    status: 'Active',
    contact: '+91 98765 43210',
    email: 'john.smith@example.hospital',
    emergencyContact: {
      name: 'Mary Smith',
      relationship: 'Spouse',
      phone: '+91 98765 43219',
    },
    address: '44 Park Avenue, Bangalore',
    allergies: ['Aspirin'],
    chronicConditions: ['Hypertension'],
    notes: 'Cardiac outpatient under routine telemetry review.',
    consentAgreed: true,
    registeredAt: '2026-01-10',
  },
  {
    id: 'P-1002',
    name: 'Priya Sharma',
    age: 62,
    gender: 'Female',
    dob: '1963-01-14',
    bloodGroup: 'B+',
    department: 'Orthopedics',
    assignedClinician: 'Dr. Amit Kumar',
    activeCasesCount: 2,
    lastVisit: '2026-04-28',
    status: 'Active',
    contact: '+91 91234 56789',
    email: 'priya.sharma@example.hospital',
    emergencyContact: {
      name: 'Rajesh Sharma',
      relationship: 'Spouse',
      phone: '+91 98765 43211',
    },
    address: '12, Green Park, Bangalore',
    allergies: ['Penicillin', 'Nuts'],
    chronicConditions: ['Osteoarthritis Knee', 'Hypertension'],
    notes: 'Underwent elective knee replacement surgery; post-op recovery progressing favorably.',
    consentAgreed: true,
    registeredAt: '2026-02-18',
  },
  {
    id: 'P-1003',
    name: 'Robert Davis',
    age: 38,
    gender: 'Male',
    dob: '1988-09-04',
    bloodGroup: 'A+',
    department: 'General Medicine',
    assignedClinician: 'Dr. Sarah Johnson',
    activeCasesCount: 1,
    lastVisit: '2026-04-27',
    status: 'Active',
    contact: '+91 98987 66554',
    email: 'robert.davis@example.hospital',
    emergencyContact: {
      name: 'Emma Davis',
      relationship: 'Sister',
      phone: '+91 98987 66559',
    },
    address: '88 Brigade Road, Bangalore',
    allergies: ['None known'],
    chronicConditions: ['Dyslipidemia'],
    notes: 'Comprehensive metabolic panel and serology review pending.',
    consentAgreed: true,
    registeredAt: '2026-03-01',
  },
  {
    id: 'P-1004',
    name: 'Anjali Gupta',
    age: 28,
    gender: 'Female',
    dob: '1998-04-20',
    bloodGroup: 'O-',
    department: 'Pediatrics',
    assignedClinician: 'Dr. Sneha Patel',
    activeCasesCount: 1,
    lastVisit: '2026-04-25',
    status: 'Active',
    contact: '+91 87654 32109',
    email: 'anjali.gupta@example.hospital',
    emergencyContact: {
      name: 'Vikas Gupta',
      relationship: 'Father',
      phone: '+91 87654 32110',
    },
    address: '15 Indiranagar 100ft Rd, Bangalore',
    allergies: ['Sulfa Drugs'],
    chronicConditions: ['Asthma'],
    notes: 'Follow-up for seasonal asthma control and inhaler adherence.',
    consentAgreed: true,
    registeredAt: '2026-03-15',
  },
  {
    id: 'P-1005',
    name: 'Michael Wilson',
    age: 55,
    gender: 'Male',
    dob: '1971-11-30',
    bloodGroup: 'AB+',
    department: 'Surgery',
    assignedClinician: 'Dr. Amit Kumar',
    activeCasesCount: 1,
    lastVisit: '2026-04-28',
    status: 'Active',
    contact: '+91 90123 45678',
    email: 'michael.wilson@example.hospital',
    emergencyContact: {
      name: 'Sarah Wilson',
      relationship: 'Spouse',
      phone: '+91 90123 45679',
    },
    address: '29 Koramangala 4th Block, Bangalore',
    allergies: ['Latex'],
    chronicConditions: ['Type 2 Diabetes'],
    notes: 'Laparoscopic cholecystectomy post-op day 7. Wounds healing well.',
    consentAgreed: true,
    registeredAt: '2026-04-01',
  },
];

export const INITIAL_CASES: PatientCase[] = [
  {
    id: 'CASE-2026-001',
    patientId: 'P-1002',
    patientName: 'Priya Sharma',
    title: 'Knee Replacement Surgery',
    department: 'Orthopedics',
    assignedClinician: 'Dr. Amit Kumar',
    priority: 'high',
    status: 'treatment_in_progress',
    symptoms: ['Joint stiffness', 'Mild localized post-surgical edema', 'Assisted ambulation'],
    initialNotes: 'Elective total knee arthroplasty performed smoothly. Post-op physical therapy active.',
    category: 'Surgical',
    followUpRequired: true,
    nextFollowUpDate: '02 May 2026',
    durationDays: 5,
    createdAt: '28 Apr 2026 10:30',
    updatedAt: '02 May 2026 09:00',
    timeline: [
      {
        id: 'EVT-01',
        timestamp: '28 Apr 2026 10:30',
        actor: 'Dr. Amit Kumar',
        role: 'Doctor',
        eventType: 'created',
        description: 'Case created',
        note: 'Admission for total knee arthroplasty protocol.',
      },
      {
        id: 'EVT-02',
        timestamp: '28 Apr 2026 11:15',
        actor: 'Dr. Amit Kumar',
        role: 'Doctor',
        eventType: 'assessment',
        description: 'Initial assessment completed',
        note: 'Surgical site verified intact; vitals stable.',
      },
      {
        id: 'EVT-03',
        timestamp: '29 Apr 2026 09:00',
        actor: 'Dr. Amit Kumar',
        role: 'Doctor',
        eventType: 'investigation_requested',
        description: 'Investigation requested (X-ray, Blood Work)',
        note: 'Post-op baseline imaging and hemoglobin check.',
      },
      {
        id: 'EVT-04',
        timestamp: '30 Apr 2026 14:10',
        actor: 'Lab Department',
        role: 'Laboratory Staff',
        eventType: 'investigation_result',
        description: 'Investigation results received',
        note: 'Alignment satisfactory on radiograph; Hb 11.8 g/dL.',
      },
      {
        id: 'EVT-05',
        timestamp: '01 May 2026 11:00',
        actor: 'Dr. Amit Kumar',
        role: 'Doctor',
        eventType: 'treatment_updated',
        description: 'Treatment plan updated',
        note: 'Prescribed home physical therapy exercises and wound care.',
      },
      {
        id: 'EVT-06',
        timestamp: '02 May 2026 09:00',
        actor: 'Dr. Amit Kumar',
        role: 'Doctor',
        eventType: 'followup_scheduled',
        description: 'Follow-up scheduled',
        note: 'Scheduled for in-person review on 02 May 2026 at 09:00 AM.',
      },
    ],
  },
  {
    id: 'CASE-2026-002',
    patientId: 'P-1002',
    patientName: 'Priya Sharma',
    title: 'Hypertension Management',
    department: 'General Medicine',
    assignedClinician: 'Dr. Priya Nair',
    priority: 'medium',
    status: 'on_hold',
    symptoms: ['Mild episodic headache', 'Blood pressure fluctuation'],
    initialNotes: 'Routine outpatient blood pressure optimization.',
    category: 'Chronic',
    followUpRequired: true,
    nextFollowUpDate: '05 May 2026',
    durationDays: 14,
    createdAt: '15 Apr 2026 09:00',
    updatedAt: '25 Apr 2026 14:00',
    timeline: [
      {
        id: 'EVT-07',
        timestamp: '15 Apr 2026 09:00',
        actor: 'Dr. Priya Nair',
        role: 'Doctor',
        eventType: 'created',
        description: 'Case created for chronic BP monitoring',
      },
      {
        id: 'EVT-08',
        timestamp: '25 Apr 2026 14:00',
        actor: 'Dr. Priya Nair',
        role: 'Doctor',
        eventType: 'status_changed',
        description: 'Placed on hold pending post-surgical stabilization',
      },
    ],
  },
  {
    id: 'CASE-2026-003',
    patientId: 'P-1001',
    patientName: 'John Smith',
    title: 'Post-Infarction Telemetry Review',
    department: 'Cardiology',
    assignedClinician: 'Dr. Priya Nair',
    priority: 'high',
    status: 'investigation_pending',
    symptoms: ['Occasional palpitation', 'Fatigue on stairs'],
    initialNotes: '24-hour Holter monitor and echocardiogram ordered.',
    category: 'Chronic',
    followUpRequired: true,
    nextFollowUpDate: '30 Apr 2026',
    durationDays: 8,
    createdAt: '22 Apr 2026 11:00',
    updatedAt: '27 Apr 2026 16:30',
    timeline: [
      {
        id: 'EVT-09',
        timestamp: '22 Apr 2026 11:00',
        actor: 'Dr. Priya Nair',
        role: 'Doctor',
        eventType: 'created',
        description: 'Cardiology outpatient review initiated',
      },
    ],
  },
  {
    id: 'CASE-2026-004',
    patientId: 'P-1003',
    patientName: 'Robert Davis',
    title: 'Metabolic & Hepatic Function Evaluation',
    department: 'General Medicine',
    assignedClinician: 'Dr. Sarah Johnson',
    priority: 'high',
    status: 'investigation_pending',
    symptoms: ['Mild right upper quadrant ache', 'Lethargy'],
    initialNotes: 'LFTs and abdominal ultrasound ordered.',
    category: 'Diagnostic Inquiry',
    followUpRequired: true,
    nextFollowUpDate: '01 May 2026',
    durationDays: 3,
    createdAt: '25 Apr 2026 14:20',
    updatedAt: '27 Apr 2026 10:15',
    timeline: [
      {
        id: 'EVT-10',
        timestamp: '25 Apr 2026 14:20',
        actor: 'Dr. Sarah Johnson',
        role: 'Doctor',
        eventType: 'created',
        description: 'Evaluation initiated by Dr. Sarah Johnson',
      },
    ],
  },
  {
    id: 'CASE-2026-005',
    patientId: 'P-1004',
    patientName: 'Anjali Gupta',
    title: 'Seasonal Reactive Airway Assessment',
    department: 'Pediatrics',
    assignedClinician: 'Dr. Sneha Patel',
    priority: 'medium',
    status: 'follow_up_required',
    symptoms: ['Nocturnal cough', 'Exertional wheezing'],
    initialNotes: 'Peak flow diary reviewed; maintenance inhaler adjusted.',
    category: 'Routine Monitoring',
    followUpRequired: true,
    nextFollowUpDate: '03 May 2026',
    durationDays: 12,
    createdAt: '18 Apr 2026 10:00',
    updatedAt: '26 Apr 2026 11:30',
    timeline: [
      {
        id: 'EVT-11',
        timestamp: '18 Apr 2026 10:00',
        actor: 'Dr. Sneha Patel',
        role: 'Doctor',
        eventType: 'created',
        description: 'Pediatric respiratory follow-up opened',
      },
    ],
  },
  {
    id: 'CASE-2026-006',
    patientId: 'P-1005',
    patientName: 'Michael Wilson',
    title: 'Laparoscopic Cholecystectomy Post-Op',
    department: 'Surgery',
    assignedClinician: 'Dr. Amit Kumar',
    priority: 'low',
    status: 'treatment_in_progress',
    symptoms: ['Normal post-op soreness', 'Tolerating regular diet'],
    initialNotes: 'Standard 1-week surgical wound review.',
    category: 'Post-Operative',
    followUpRequired: false,
    nextFollowUpDate: '08 May 2026',
    durationDays: 7,
    createdAt: '21 Apr 2026 08:30',
    updatedAt: '28 Apr 2026 15:00',
    timeline: [
      {
        id: 'EVT-12',
        timestamp: '21 Apr 2026 08:30',
        actor: 'Dr. Amit Kumar',
        role: 'Doctor',
        eventType: 'created',
        description: 'Post-surgical tracking initiated',
      },
    ],
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-301',
    patientId: 'P-1002',
    patientName: 'Priya Sharma',
    clinician: 'Dr. Amit Kumar',
    department: 'Orthopedics',
    date: '2026-04-28',
    time: '09:00',
    durationMinutes: 30,
    type: 'Follow-up',
    status: 'confirmed',
    notes: 'Post-knee surgery mobility & wound inspection.',
    createdAt: '2026-04-25 10:00',
  },
  {
    id: 'APT-302',
    patientId: 'P-1003',
    patientName: 'Robert Davis',
    clinician: 'Dr. Priya Nair',
    department: 'Cardiology',
    date: '2026-04-28',
    time: '11:30',
    durationMinutes: 30,
    type: 'Initial Consultation',
    status: 'confirmed',
    notes: 'Cardiology consult regarding lab findings.',
    createdAt: '2026-04-26 14:00',
  },
  {
    id: 'APT-303',
    patientId: 'P-1004',
    patientName: 'Anjali Gupta',
    clinician: 'Dr. Sneha Patel',
    department: 'Pediatrics',
    date: '2026-04-28',
    time: '14:00',
    durationMinutes: 30,
    type: 'Follow-up',
    status: 'scheduled',
    notes: 'Check lung sounds and spirometry reading.',
    createdAt: '2026-04-27 09:30',
  },
  {
    id: 'APT-304',
    patientId: 'P-1002',
    patientName: 'Priya Sharma',
    clinician: 'Dr. Priya Nair',
    department: 'General Medicine',
    date: '2026-04-15',
    time: '10:30',
    durationMinutes: 30,
    type: 'General Consultation',
    status: 'completed',
    notes: 'Routine general physician wellness review.',
    createdAt: '2026-04-10 11:00',
  },
  {
    id: 'APT-305',
    patientId: 'P-1002',
    patientName: 'Priya Sharma',
    clinician: 'Dr. Amit Kumar',
    department: 'Orthopedics',
    date: '2026-05-02',
    time: '09:00',
    durationMinutes: 30,
    type: 'Follow-up',
    status: 'scheduled',
    notes: 'Orthopedic follow-up milestone.',
    createdAt: '2026-04-28 09:30',
  },
];

export const INITIAL_INVESTIGATIONS: Investigation[] = [
  {
    id: 'INV-101',
    patientId: 'P-1002',
    patientName: 'Priya Sharma',
    caseId: 'CASE-2026-001',
    caseTitle: 'Knee Replacement Surgery',
    investigationType: 'Right Knee Plain Radiograph (AP & Lateral)',
    requestingClinician: 'Dr. Amit Kumar',
    requestDate: '2026-04-29 09:00',
    completedDate: '2026-04-30 14:10',
    status: 'result_available',
    priority: 'high',
    findings: 'Component position anatomical. No peri-prosthetic lucency or displacement detected.',
    referenceRange: 'Normal Post-Arthroplasty Alignment',
    isAbnormal: false,
    attachmentRef: 'RAD-KNEE-884.dcm',
    notes: 'Good bone contact verified.',
  },
  {
    id: 'INV-102',
    patientId: 'P-1003',
    patientName: 'Robert Davis',
    caseId: 'CASE-2026-004',
    caseTitle: 'Metabolic & Hepatic Function Evaluation',
    investigationType: 'Comprehensive Liver Function Panel (LFT)',
    requestingClinician: 'Dr. Sarah Johnson',
    requestDate: '2026-04-26 11:00',
    status: 'in_progress',
    priority: 'high',
    notes: 'Specimen in automated analyzer queue; results overdue.',
  },
  {
    id: 'INV-103',
    patientId: 'P-1001',
    patientName: 'John Smith',
    caseId: 'CASE-2026-003',
    caseTitle: 'Post-Infarction Telemetry Review',
    investigationType: '24-Hour Ambulatory Holter ECG',
    requestingClinician: 'Dr. Priya Nair',
    requestDate: '2026-04-27 10:15',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Device fitted; data download scheduled tomorrow morning.',
  },
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'INS-001',
    caseId: 'CASE-2026-001',
    patientId: 'P-1002',
    patientName: 'Priya Sharma',
    priority: 'critical',
    category: 'case_priority',
    title: 'High Priority Case Recommendation',
    summary: 'Based on recent investigation results and treatment progress, this case requires monitoring and an earlier follow-up.',
    contributingFactors: [
      'Recent investigation pending',
      'High risk condition (as per rules)',
      'Follow-up due in 2 days',
      'Patient age > 60',
    ],
    confidenceScore: 92,
    timestamp: '28 Apr 2026 14:30',
    dataSource: 'EHR Clinical Observations & Lab Feeds',
    modelVersion: 'HealthSync v1.9.0',
    recommendedAction: 'Schedule priority in-clinic orthopedic evaluation within 48 hours.',
    reviewed: false,
  },
  {
    id: 'INS-002',
    caseId: 'CASE-2026-004',
    patientId: 'P-1003',
    patientName: 'Robert Davis',
    priority: 'high',
    category: 'investigation_pending',
    title: 'Lab Results Overdue Alert',
    summary: 'Comprehensive Liver Function Panel pending > 48 hours without finalized report.',
    contributingFactors: ['Specimen drawn 26 Apr', 'TAT threshold exceeded by 18 hours', 'Patient awaiting clinical consult'],
    confidenceScore: 88,
    timestamp: '28 Apr 2026 11:00',
    dataSource: 'Laboratory Information System (LIS)',
    modelVersion: 'HealthSync v1.9.0',
    recommendedAction: 'Escalate status query to central chemistry lab supervisor.',
    reviewed: false,
  },
  {
    id: 'INS-003',
    caseId: 'CASE-2026-005',
    patientId: 'P-1004',
    patientName: 'Anjali Gupta',
    priority: 'medium',
    category: 'followup_required',
    title: 'Upcoming Follow-up Notification',
    summary: 'Pediatric respiratory follow-up window approaching within 3 days.',
    contributingFactors: ['Maintenance inhaler cycle ending', 'Scheduled check due 03 May'],
    confidenceScore: 84,
    timestamp: '27 Apr 2026 16:45',
    dataSource: 'Appointment Scheduling Registry',
    modelVersion: 'HealthSync v1.9.0',
    recommendedAction: 'Send automated reminder SMS to guardian.',
    reviewed: true,
    reviewerFeedback: 'Reminder confirmed dispatched by reception staff.',
  },
  {
    id: 'INS-004',
    caseId: 'CASE-2026-006',
    patientId: 'P-1005',
    patientName: 'Michael Wilson',
    priority: 'low',
    category: 'treatment_progress',
    title: 'Post-Surgical Healing Stable',
    summary: 'Laparoscopic incision recovery on track; no abnormal biomarker flags.',
    contributingFactors: ['Vital signs within normal limits', 'No infection markers'],
    confidenceScore: 95,
    timestamp: '28 Apr 2026 09:15',
    dataSource: 'Nursing Shift Notes',
    modelVersion: 'HealthSync v1.9.0',
    recommendedAction: 'Maintain current post-op home care regimen.',
    reviewed: true,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-01',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@healthsync.hospital',
    role: 'Doctor',
    department: 'General Medicine',
    status: 'Active',
    lastActive: 'Just now',
    permissions: ['view_patients', 'create_cases', 'edit_cases', 'order_investigations', 'view_analytics'],
  },
  {
    id: 'USR-02',
    name: 'Dr. Amit Kumar',
    email: 'amit.kumar@healthsync.hospital',
    role: 'Doctor',
    department: 'Orthopedics',
    status: 'Active',
    lastActive: '10 mins ago',
    permissions: ['view_patients', 'create_cases', 'edit_cases', 'order_investigations'],
  },
  {
    id: 'USR-03',
    name: 'Dr. Priya Nair',
    email: 'priya.nair@healthsync.hospital',
    role: 'Doctor',
    department: 'Cardiology',
    status: 'Active',
    lastActive: '25 mins ago',
    permissions: ['view_patients', 'create_cases', 'edit_cases', 'order_investigations'],
  },
  {
    id: 'USR-04',
    name: 'Nurse Marcus Cole',
    email: 'marcus.cole@healthsync.hospital',
    role: 'Nurse',
    department: 'General Medicine',
    status: 'Active',
    lastActive: '5 mins ago',
    permissions: ['view_patients', 'record_vitals', 'add_timeline_notes'],
  },
  {
    id: 'USR-05',
    name: 'Elena Rostova',
    email: 'elena.rostova@healthsync.hospital',
    role: 'Administrator',
    department: 'General Medicine',
    status: 'Active',
    lastActive: '1 hour ago',
    permissions: ['admin_full_access', 'manage_users', 'audit_logs', 'export_reports'],
  },
  {
    id: 'USR-06',
    name: 'Rachel Green',
    email: 'rachel.green@healthsync.hospital',
    role: 'Receptionist',
    department: 'Orthopedics',
    status: 'Active',
    lastActive: '3 mins ago',
    permissions: ['register_patients', 'schedule_appointments'],
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOT-01',
    title: 'High Priority Case Recommendation',
    message: 'CASE-2026-001 (Priya Sharma) flagged by HealthSync AI for follow-up review.',
    type: 'alert',
    recordId: 'CASE-2026-001',
    recordType: 'case',
    timestamp: '28 Apr 2026 14:30',
    read: false,
  },
  {
    id: 'NOT-02',
    title: 'Investigation Results Ready',
    message: 'Right Knee Plain Radiograph finalized for Priya Sharma (P-1002).',
    type: 'investigation',
    recordId: 'INV-101',
    recordType: 'investigation',
    timestamp: '30 Apr 2026 14:10',
    read: false,
  },
  {
    id: 'NOT-03',
    title: 'Upcoming Appointment: 09:00 AM',
    message: 'Follow-up with Priya Sharma scheduled with Dr. Amit Kumar.',
    type: 'appointment',
    recordId: 'APT-301',
    recordType: 'appointment',
    timestamp: '28 Apr 2026 08:30',
    read: true,
  },
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'AUD-01',
    timestamp: '02 May 2026 09:00',
    userName: 'Dr. Amit Kumar',
    userRole: 'Doctor',
    action: 'Follow-up Scheduled',
    targetType: 'Case',
    targetId: 'CASE-2026-001',
    details: 'Scheduled in-clinic follow-up for Priya Sharma.',
  },
  {
    id: 'AUD-02',
    timestamp: '01 May 2026 11:00',
    userName: 'Dr. Amit Kumar',
    userRole: 'Doctor',
    action: 'Treatment Plan Updated',
    targetType: 'Case',
    targetId: 'CASE-2026-001',
    details: 'Updated post-arthroplasty physical therapy plan.',
  },
  {
    id: 'AUD-03',
    timestamp: '30 Apr 2026 14:10',
    userName: 'Lab Department',
    userRole: 'Laboratory Staff',
    action: 'Investigation Result Received',
    targetType: 'Investigation',
    targetId: 'INV-101',
    details: 'Right Knee Plain Radiograph uploaded with normal alignment.',
  },
  {
    id: 'AUD-04',
    timestamp: '29 Apr 2026 09:00',
    userName: 'Dr. Amit Kumar',
    userRole: 'Doctor',
    action: 'Investigation Requested',
    targetType: 'Investigation',
    targetId: 'INV-101',
    details: 'Requested X-ray and post-op blood work.',
  },
  {
    id: 'AUD-05',
    timestamp: '28 Apr 2026 11:15',
    userName: 'Dr. Amit Kumar',
    userRole: 'Doctor',
    action: 'Initial Assessment',
    targetType: 'Case',
    targetId: 'CASE-2026-001',
    details: 'Completed post-surgical surgical wound and vitals assessment.',
  },
  {
    id: 'AUD-06',
    timestamp: '28 Apr 2026 10:30',
    userName: 'Dr. Amit Kumar',
    userRole: 'Doctor',
    action: 'Case Created',
    targetType: 'Case',
    targetId: 'CASE-2026-001',
    details: 'Created case CASE-2026-001 for patient Priya Sharma.',
  },
];

export const INITIAL_SIMULATION_PARAMS: SimulationParams = {
  dailyRegistrations: 50,
  availableDoctors: 10,
  avgAppointmentDurationMin: 30,
  investigationProcessingDays: 2,
  currentBacklog: 20,
};

// STORAGE HELPERS
const STORAGE_KEYS = {
  PATIENTS: 'healthsync_patients',
  CASES: 'healthsync_cases',
  APPOINTMENTS: 'healthsync_appointments',
  INVESTIGATIONS: 'healthsync_investigations',
  INSIGHTS: 'healthsync_insights',
  USERS: 'healthsync_users',
  NOTIFICATIONS: 'healthsync_notifications',
  AUDIT_LOGS: 'healthsync_audit_logs',
  CURRENT_USER: 'healthsync_current_user',
};

export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to local storage', e);
  }
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(INITIAL_CASES));
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  localStorage.setItem(STORAGE_KEYS.INVESTIGATIONS, JSON.stringify(INITIAL_INVESTIGATIONS));
  localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(INITIAL_AI_INSIGHTS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
}

export function exportDatasetToCSV(filename: string, rows: Record<string, any>[]): void {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          let val = row[header];
          if (val === null || val === undefined) val = '';
          if (typeof val === 'object') val = JSON.stringify(val);
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Workload simulator calculations matching the exact screenshot
export function calculateSimulationMetrics(params: SimulationParams): SimulationResult {
  const totalCases7Days = params.dailyRegistrations * 7;
  const doctorUtilizationHours = Math.round((params.dailyRegistrations * (params.avgAppointmentDurationMin / 60)) / Math.max(1, params.availableDoctors) * 5);
  const capacityPercent = Math.min(100, Math.round((params.dailyRegistrations * 30) / (params.availableDoctors * 8 * 60) * 100)) || 78;
  const estimatedWaitDays = Number(((params.currentBacklog / Math.max(1, params.availableDoctors * 4)) * (params.investigationProcessingDays / 1.5)).toFixed(1)) || 2.8;
  const queueLength = Math.round(params.currentBacklog * 1.2) || 24;

  const trendDays = [
    { day: 'Day 1', current: 20, afterChanges: 18 },
    { day: 'Day 2', current: 28, afterChanges: 22 },
    { day: 'Day 3', current: 25, afterChanges: 19 },
    { day: 'Day 4', current: 30, afterChanges: 24 },
    { day: 'Day 5', current: 27, afterChanges: 20 },
    { day: 'Day 6', current: 32, afterChanges: 23 },
    { day: 'Day 7', current: 29, afterChanges: 21 },
  ];

  return {
    estimatedWaitDays: estimatedWaitDays || 2.8,
    totalCases7Days: totalCases7Days || 350,
    doctorUtilizationHours: doctorUtilizationHours || 24,
    doctorCount: params.availableDoctors,
    capacityPercent: capacityPercent || 78,
    queueLength: queueLength || 24,
    trendDays,
  };
}
