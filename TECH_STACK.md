# HealthSync — Technical Architecture & Technology Stack

This document details the engineering principles, frontend architecture, state management patterns, and charting implementations powering HealthSync.

---

## 1. Core Technology Stack

| Layer | Technology | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Runtime & Framework** | React + TypeScript | 19.x / 5.7+ | Component modularity, functional hooks, static type safety |
| **Bundler & Tooling** | Vite | 6.x | Fast HMR, optimized tree-shaken production bundles |
| **Styling** | Tailwind CSS v4 | 4.x | Utility-first CSS, responsive modifiers, CSS custom properties |
| **Data Visualizations** | Chart.js | 4.x | Canvas-rendered interactive charts with zero memory leaks |
| **Iconography** | Lucide React | 0.546+ | Crisp, standard healthcare icons |
| **Typography** | Google Fonts | Web | *Plus Jakarta Sans*, *Manrope*, *JetBrains Mono* |
| **Persistence** | HTML5 LocalStorage | Web API | Zero-backend state durability across page reloads |

---

## 2. State Architecture & Persistence Strategy

HealthSync implements a centralized reactive store via `HealthSyncContext.tsx`:

```typescript
// Unified Clinical Store Structure
interface HealthSyncState {
  currentUser: User | null;
  patients: Patient[];
  cases: PatientCase[];
  appointments: Appointment[];
  investigations: Investigation[];
  insights: AIInsight[];
  users: User[];
  notifications: AppNotification[];
  auditLogs: AuditEvent[];
  currentView: ViewType;
}
```

### Persistence Mechanics
1. **Hydration**: On application mount, state initializes from `localStorage.getItem('healthsync_*')`. If keys are absent, it seeds with `INITIAL_*` collections from `src/data/demo-data.ts`.
2. **Synchronization**: Every mutation trigger (`registerPatient`, `updateCaseStatus`, `createAppointment`, etc.) updates React state and immediately serializes to `localStorage`.
3. **Backup & Reset**: Dedicated functions allow clinicians to download a comprehensive JSON snapshot or trigger a factory reset.

---

## 3. Data Visualization Architecture (Chart.js v4)

To guarantee high visual performance and prevent canvas redraw collisions:
* **Lifecycle Isolation**: Every chart canvas registers via `useRef<HTMLCanvasElement>` and retains an instance reference `useRef<Chart>`.
* **Cleanup Discipline**: Component cleanup returns explicit `chartInstance.current.destroy()` calls, ensuring zero DOM leaks during tab switching or resizing.
* **Canvas Styling**: Charts utilize subtle line fills (`rgba(79, 70, 229, 0.08)`), tension curve smoothing (`0.35`), and legible tooltips with rounded borders.

---

## 4. Mathematical Queuing Engine (Hospital Workload Simulator)

The workload simulator computes Erlang-C deterministic queuing dynamics in `calculateSimulationMetrics`:

$$\text{Total Available Physician Hours} = N_{\text{clinicians}} \times 8 \times \left(\frac{\text{Capacity}\%}{100}\right)$$

$$\text{Effective Case Duration} = T_{\text{mean}} \times F_{\text{investigation backlog}}$$

$$\text{Aggregate Daily Demand Hours} = N_{\text{incoming}} \times \left(\frac{\text{Effective Case Duration}}{60}\right) \times \left(1 + \frac{\text{FollowUp}\%}{100}\right)$$

$$\text{Capacity Utilization} = \left(\frac{\text{Aggregate Demand Hours}}{\text{Available Physician Hours}}\right) \times 100\%$$

When utilization exceeds $115\%$, the system flags **Critical Overload**, estimates cumulative queue backlogs in days, and forecasts throughput degradation.

---

## 5. Security & Clinical Compliance Considerations

1. **Synthetic Data Policy**: No real PHI (Protected Health Information) is present or collected. All patient records, diagnoses, and lab results are synthetic demo constructs.
2. **Frontend vs. Backend RBAC**: Role-based access control inside the client coordinates presentation layers. Production deployment requires JWT token verification, RBAC middleware on server routes, and encrypted TLS 1.3 transport.
3. **Audit Logging**: Every patient edit, status change, and lab entry automatically appends an immutable timestamped `AuditEvent` to the compliance ledger.

---

## 6. Testing Approach

Every major journey can be verified end-to-end:
1. **Patient Registration**: Fill registration modal $\rightarrow$ verify patient appears in directory and counts update.
2. **Case Creation & Triage**: Open case $\rightarrow$ link to patient $\rightarrow$ observe active cases increment on Dashboard and Cases list.
3. **Workflow State Transition**: Open Case Workspace $\rightarrow$ update status to "Awaiting Review" $\rightarrow$ confirm timeline event is logged.
4. **Appointment Scheduling**: Book new encounter $\rightarrow$ verify time slot conflict warning if overlapping $\rightarrow$ check appearance on Calendar.
5. **Diagnostic Test Results**: Open investigation $\rightarrow$ enter synthetic findings and abnormal flag $\rightarrow$ confirm status shifts to "Result Available".
6. **Workload Simulator**: Adjust clinician slider from 8 down to 2 $\rightarrow$ observe real-time red "Critical Overload" calculation and queue expansion.
7. **Role Switching**: Switch role to "Nurse" or "Auditor" from header menu $\rightarrow$ verify role indicator reflects active permissions.
