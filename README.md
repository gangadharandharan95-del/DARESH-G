# HealthSync — Intelligent Patient Case Tracking & Clinical Decision Support System

HealthSync is a modern, enterprise-grade healthcare management application designed for clinical decision support, patient case tracking, multidisciplinary communication, and hospital capacity modeling.

Built with a light-mode clinical aesthetic, soft pastel gradients, and mathematical queuing models, HealthSync provides clinicians and hospital administrators with high-density data views, interactive analytics, and auditability.

---

## 1. Project Overview

HealthSync addresses common hospital workflow bottlenecks:
* **Patient Intake & Longitudinal Tracking**: 360-degree patient profiles capturing demographics, allergies, chronic conditions, and clinical encounter histories.
* **Clinical Case Management**: Structured workflows moving patients from emergency triage through diagnostic investigations to discharge or follow-up.
* **Explainable AI Prioritization**: Multi-factor decision support evaluating troponin deltas, vital sign stability, and turnaround benchmarks with human oversight.
* **Hospital Workload Simulator**: Interactive Erlang-C deterministic queuing model forecasting clinician fatigue, department utilization, and queue length under variable admission surges.
* **Complete Role-Aware Access Control**: Support for 6 distinct hospital roles (Administrator, Doctor, Nurse, Receptionist, Laboratory Staff, Auditor).

---

## 2. Main Features

* **Real-Time Operational Dashboard**: 6 key performance indicators (Total Patients, Active Cases, Critical Review, Appointments Today, Pending Tests, Follow-ups Due) with sparklines and direct click-through filters.
* **Interactive Chart.js Visualizations**: Inflow vs. outflow trends, pipeline status distribution doughnut, specialty workload bar charts, and triage priority distribution.
* **360° Patient View with 8 Dedicated Tabs**:
  1. *Overview* (vitals snapshot, allergies, active conditions, assigned care team)
  2. *Cases* (active and historical diagnoses)
  3. *Clinical Timeline* (chronological milestones with actors)
  4. *Investigations* (lab pathology & imaging results)
  5. *Appointments* (encounter history and bookings)
  6. *Documents* (consents, discharge summaries, ECG logs)
  7. *Care Plan* (therapy goals, current medication regimens)
  8. *Audit History* (timestamped action log)
* **Full Case Operations Workspace**: Clinician reassignment, status workflow transitions with business rule validation, progress note logging, and diagnostic linkage.
* **Conflict-Aware Scheduling**: Agenda, Day, Week, and Month views with automatic double-booking detection and one-click completion.
* **Diagnostic Investigations Registry**: Lab and radiology order placement, status tracking, and abnormal value flagging.
* **Hospital Workload Simulator**: Sliders adjusting incoming volume, clinician headcount, handling duration, and lab turnaround delays with real-time recalculation of queuing metrics and baseline comparison.
* **Global Command Search (⌘K / Ctrl+K)**: Instant keyboard-accessible modal searching across Patients, Cases, Appointments, and Investigations.
* **Local Persistence Engine**: Automatic synchronization of mutations to `localStorage` with factory reset and full JSON backup capabilities.

---

## 3. Screens and Modules

| Module | Route / View ID | Purpose |
| :--- | :--- | :--- |
| **Login Portal** | `login` | Split-screen authenticated portal with 1-click demo credential switcher |
| **Dashboard** | `dashboard` | Executive hospital overview, KPI cards, and trend analytics |
| **Patient Directory** | `patients` | Searchable patient registry with sorting, pagination, and CSV export |
| **Patient 360 Profile** | `patient-profile` | Comprehensive multi-tab patient medical record |
| **Case Tracking** | `cases` | Multi-filter clinical case board with bulk action capabilities |
| **Case Workspace** | `case-details` | Operational case view with milestone timeline, notes, and status actions |
| **Appointments** | `appointments` | Scheduling calendar with agenda, day, week, and month viewports |
| **Investigations** | `investigations` | Diagnostic orders, test status updates, and synthetic lab results |
| **AI Insights** | `ai-insights` | Explainable decision support cards with physician review sign-offs |
| **Analytics & Reports**| `analytics` | Macro operational benchmarks, stay duration charts, and admissions heatmap |
| **Workload Simulator** | `workload-simulator`| Interactive capacity planning model with scenario comparisons |
| **Users & Roles** | `users` | Staff directory, role modification, and permissions matrix |
| **System Settings** | `settings` | Facility profile, clinical alert thresholds, and backup utilities |

---

## 4. Frontend Architecture

The frontend follows a modern, modular architecture:
* **Context State Management (`HealthSyncContext`)**: Central reactive store managing collections of patients, cases, appointments, tests, users, and audit logs.
* **View Controller Layer (`src/views/`)**: Domain-specific screens with isolated UI logic, clean chart lifecycle management, and keyboard support.
* **Reusable Layout & Modals (`src/components/`)**: Collapsible navigation sidebar, breadcrumb top header, toast alert container, and modal forms.
* **Data Layer (`src/data/demo-data.ts`)**: Strongly-typed seed dataset, localStorage read/write helpers, Erlang queuing calculation engine, and CSV generator.

---

## 5. Technology Stack

* **UI Library**: React 19 (TypeScript)
* **Build System**: Vite 6+
* **Styling**: Tailwind CSS v4 with custom CSS variables & light pastel gradients
* **Visualizations**: Chart.js v4 (Canvas-based responsive charts)
* **Iconography**: Lucide React
* **Typography**: Plus Jakarta Sans, Manrope, JetBrains Mono (Google Fonts)
* **State Persistence**: HTML5 LocalStorage with fallback seed hydration

---

## 6. Directory Structure

```text
├── index.html                     # HTML5 entry point with Google Fonts
├── metadata.json                  # AI Studio build configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript compiler settings
├── vite.config.ts                 # Vite bundler configuration
├── DESIGN_SYSTEM.md               # Design documentation and design tokens
├── TECH_STACK.md                  # Architectural & technical stack details
├── README.md                      # Comprehensive project guide
└── src/
    ├── main.tsx                   # React root hydration
    ├── App.tsx                    # Shell layout and route orchestrator
    ├── index.css                  # Design tokens, gradients, and scrollbars
    ├── types/
    │   └── index.ts               # Core clinical TypeScript interfaces
    ├── data/
    │   └── demo-data.ts           # Synthetic dataset, queuing engine & storage
    ├── context/
    │   └── HealthSyncContext.tsx  # Central state, CRUD actions & toast dispatcher
    ├── components/
    │   ├── common/
    │   │   └── ToastContainer.tsx # Floating notification alerts
    │   ├── layout/
    │   │   ├── Sidebar.tsx        # Collapsible role-aware navigation
    │   │   ├── TopHeader.tsx      # Breadcrumbs, alerts popover, quick actions
    │   │   └── GlobalSearchModal.tsx # Cmd+K universal search modal
    │   └── modals/
    │       ├── RegisterPatientModal.tsx    # Patient creation with validation
    │       ├── CreateCaseModal.tsx         # Clinical case onboarding
    │       ├── ScheduleAppointmentModal.tsx # Conflict-aware scheduler
    │       └── OrderInvestigationModal.tsx # Diagnostic order placement
    └── views/
        ├── DashboardView.tsx         # Executive operational dashboard
        ├── PatientsView.tsx          # Patient directory & filters
        ├── PatientProfileView.tsx    # 8-tab patient 360 profile
        ├── CasesView.tsx             # Clinical case tracking & bulk actions
        ├── CaseDetailsView.tsx       # Case operations workspace & timeline
        ├── AppointmentsView.tsx      # Calendar scheduling modes
        ├── InvestigationsView.tsx    # Lab & radiology results register
        ├── AiInsightsView.tsx        # Explainable decision support
        ├── AnalyticsView.tsx         # Hospital reports & admissions heatmap
        ├── WorkloadSimulatorView.tsx # Scientific Erlang capacity simulator
        ├── UsersView.tsx             # Role directory & permission matrix
        ├── SettingsView.tsx          # Configuration, backup & data controls
        └── LoginView.tsx             # Split-screen portal & demo switcher
```

---

## 7. Installation & Local Setup

### Prerequisites
* Node.js v18+ or v20+
* npm v9+

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (port 3000)
npm run dev

# 3. Build production bundle
npm run build

# 4. Run type verification
npm run lint
```

---

## 8. Backend API Configuration

HealthSync is designed to operate seamlessly both in standalone demonstration mode (using `localStorage`) and connected to an enterprise REST/FHIR backend.

To configure real backend integration:
1. Define environment variables in `.env`:
   ```env
   VITE_API_BASE_URL=https://api.healthsync.hospital/v1
   VITE_FHIR_ENDPOINT=https://fhir.healthsync.hospital/r4
   ```
2. In `src/context/HealthSyncContext.tsx`, replace the `getStoredData` calls with asynchronous `fetch()` requests against standard FHIR resources (`/Patient`, `/Condition`, `/Encounter`, `/Observation`).

---

## 9. User Roles & Access Control

| Role | Permitted Workflows |
| :--- | :--- |
| **Administrator** | Full access to all modules, user administration, system settings, and exports. |
| **Doctor** | Patient 360 review, case creation, timeline notes, status transitions, lab orders, appointment scheduling. |
| **Nurse** | Patient intake, vitals recording, timeline observations, appointment calendar view. |
| **Receptionist** | Patient registration, scheduling appointments, outpatient coordination. |
| **Laboratory Staff** | Diagnostic investigation registry, recording lab findings, abnormal value flags. |
| **Auditor** | Read-only compliance access, audit trail inspection, analytics reports. |

---

## 10. Accessibility Features

HealthSync targets WCAG 2.2 AA compliance:
* **High Contrast Ratios**: Text elements exceed 4.5:1 contrast against clean white/neutral backgrounds.
* **Color Blindness Redundancy**: Status badges and priority indicators pair color cues with explicit text labels.
* **Keyboard Navigation**: Global search shortcut (`Cmd+K` / `Ctrl+K`), modal dismissal via `Escape`, and form input tabs.
* **Tabular Numerals**: High-density numeric data and timestamps use `font-variant-numeric: tabular-nums` to eliminate layout jitter.

---

## 11. Security & Demonstration Limitations

* **Synthetic Data Only**: All patient records, clinical cases, laboratory values, and diagnostic narratives are synthetically generated for demonstration.
* **Frontend Authorization**: In this demo client, role-based controls govern the presentation layer. In a production environment, authorization must be validated server-side.
* **Non-Autonomous Decision Support**: Priority recommendations and alerts are intended solely to assist clinical decision-making.
