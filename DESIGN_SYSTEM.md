# HealthSync — Design System Documentation

HealthSync embodies a light-mode clinical design system designed for modern healthcare SaaS platforms, high-throughput medical centers, and clinical decision support consoles.

---

## 1. Brand Identity & Principles

* **Product Name**: HealthSync
* **Visual Direction**: Crisp, trustworthy, calming light theme featuring soft pastel gradients, generous whitespace, and high-density tabular alignment.
* **Brand Personality**: Clinical, authoritative, modern, empathetic, and unambiguous.

### Core Principles
1. **Clinical Clarity**: Zero visual ambiguity. Every indicator, priority score, and lab delta is legible at a glance.
2. **Restrained Gradients**: Cards remain predominantly crisp white (`#FFFFFF`). Pastel gradients are used strategically for highlights, AI decision panels, and active indicators.
3. **Multi-Modal Redundancy**: Critical patient statuses (e.g., Critical, Abnormal, High Priority) are never communicated by color alone; they always incorporate bold text labels and icons.
4. **Zero Layout Jitter**: All metrics, vitals, timestamps, and laboratory values strictly enforce monospace tabular figures (`font-variant-numeric: tabular-nums`).

---

## 2. Color System

### Primary & Neutral Palette

| Token | Hex Value | Primary Purpose |
| :--- | :--- | :--- |
| `--primary` | `#4F46E5` | Primary action buttons, brand accents, active navigation |
| `--primary-light` | `#EEF2FF` | Active background highlight for selected menu rows |
| `--secondary` | `#0891B2` | Specialty markers, secondary actions, and outpatient links |
| `--accent-mint` | `#10B981` | Positive indicators, normal lab values, resolved outcomes |
| `--lavender` | `#A78BFA` | Clinical decision support highlights and AI insights |
| `--sky-blue` | `#7DD3FC` | Calendar appointments and scheduling accents |
| `--background` | `#F7F9FC` | Application background field |
| `--surface` | `#FFFFFF` | Card surfaces, modals, popovers, and tables |
| `--text-primary` | `#172033` | Headings, patient names, and primary copy |
| `--text-secondary`| `#64748B` | Supporting labels, clinical metadata, and captions |
| `--border` | `#E5EAF2` | Hairline dividers and container borders |

### Semantic Status Tokens

| Semantic Token | Hex Value | Application |
| :--- | :--- | :--- |
| `--success` | `#16A34A` | Completed visits, resolved cases, normal lab results |
| `--warning` | `#D97706` | Approaching deadlines, awaiting review, moderate priority |
| `--danger` | `#DC2626` | Critical STAT alerts, abnormal biomarker deltas, emergency intake |
| `--info` | `#0284C7` | Informational announcements, schedule confirmations |

### Reusable Pastel Gradients

```css
:root {
  --gradient-primary: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  --gradient-sky: linear-gradient(135deg, #38BDF8 0%, #6366F1 100%);
  --gradient-mint: linear-gradient(135deg, #6EE7B7 0%, #34D399 100%);
  --gradient-lavender: linear-gradient(135deg, #C4B5FD 0%, #A5B4FC 100%);
  --gradient-peach: linear-gradient(135deg, #FED7AA 0%, #FDA4AF 100%);
  --gradient-background: linear-gradient(135deg, #F8FAFF 0%, #F3F6FF 50%, #F8FBFF 100%);
  --gradient-ai: linear-gradient(135deg, #EDE9FE 0%, #DBEAFE 100%);
  --gradient-card: linear-gradient(145deg, #FFFFFF 0%, #F9FBFF 100%);
}
```

---

## 3. Typography Scale

HealthSync employs **Plus Jakarta Sans** and **Manrope** for primary interface elements, paired with **JetBrains Mono** for numerical values and patient identifiers.

| Level | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 28px–32px | Bold (700) | 1.2 | Greeting banner and primary section headers |
| **Section Title** | 20px–24px | Bold (700) | 1.3 | Module headers, patient profile name |
| **Card Heading** | 14px–16px | SemiBold (600) | 1.4 | Card titles, chart container labels |
| **Body Standard**| 13px–14px | Regular (400) | 1.5 | General copy, clinical notes, descriptions |
| **Meta / Label** | 11px–12px | Medium (500) | 1.4 | Form field labels, timestamps, table headers |
| **KPI Value** | 24px–28px | Bold (700) | 1.1 | Dashboard metric numbers (`tabular-nums`) |
| **Micro Badge** | 10px–11px | Bold (700) | 1.0 | Status badges and priority tags |

---

## 4. Component Specifications

### 1. Cards (`.healthsync-card`)
* Background: `#FFFFFF`
* Border: `1px solid #E8EDF5`
* Border Radius: `18px` (`rounded-2xl`)
* Shadow: `0 4px 20px rgba(31, 55, 90, 0.035)`
* Hover Elevation: `transform: translateY(-2px); box-shadow: 0 10px 28px rgba(31, 55, 90, 0.075);`

### 2. Buttons
* **Primary**: `bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold px-4 py-2 shadow-xs`
* **Secondary**: `bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold px-3 py-2 shadow-xs`
* **Danger**: `bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold`
* **Success**: `bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold`

### 3. Data Tables
* Header row: `bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-[11px] uppercase`
* Body row: `hover:bg-slate-50/80 transition-colors py-3.5 px-4 text-xs`
* Numerical cells: `tabular-nums font-mono`

### 4. Status & Priority Badges
* Critical: `bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full`
* High / In Progress: `bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full`
* Normal / Active: `bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full`
* Neutral / Completed: `bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full`

---

## 5. Interaction Patterns & Micro-Interactions

* **Feedback Latency**: Every click, form submission, and filter change renders feedback within 150ms.
* **Toasts**: Non-disruptive floating feedback displayed at the bottom-right for 4.5 seconds.
* **Modals**: Smooth entrance zoom (`fade-in zoom-in-95`), background backdrop blur (`backdrop-blur-sm`), and dismissal on `Escape` key.
* **Validation**: Required fields display inline warning indicators and outline highlights; destructive actions require explicit user confirmation.

---

## 6. Accessibility (WCAG 2.2 AA)

* **Keyboard Navigation**: Universal global search (`⌘K`), tab traversal on all form inputs and interactive tables.
* **Contrast Compliance**: Strict adherence to minimum 4.5:1 text-to-background contrast ratio.
* **Motion Preferences**: Respects `prefers-reduced-motion` with soft settling curves.
