import React from 'react';
import {
  LayoutDashboard,
  Users,
  BriefcaseMedical,
  Calendar,
  CalendarClock,
  FlaskConical,
  Sparkles,
  BarChart3,
  Sliders,
  Bell,
  UserCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { useHealthSync, ViewType } from '../../context/HealthSyncContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { currentView, navigate, notifications, currentUser } = useHealthSync();

  const unreadCount = notifications.filter((n) => !n.read).length || 2;

  const navItems: {
    id: ViewType;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'cases', label: 'Cases', icon: BriefcaseMedical },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'follow-ups', label: 'Follow-ups', icon: CalendarClock },
    { id: 'investigations', label: 'Investigations', icon: FlaskConical },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'workload-simulator', label: 'Workload Simulator', icon: Sliders },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'users', label: 'Users & Roles', icon: UserCheck },
    { id: 'login', label: 'Register & Sign In', icon: UserPlus },
    { id: 'audit-log', label: 'Audit Log', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-white border-r border-[#E2E8F0] transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-60'
      }`}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#E2E8F0]">
        <div
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          {/* Blue circle with white cross + */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Health<span className="text-blue-600">Sync</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.id ||
            (item.id === 'patients' && currentView === 'patient-profile') ||
            (item.id === 'cases' && currentView === 'case-details');

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}

              {/* Red badge */}
              {item.badge !== undefined && !collapsed && (
                <span
                  className={`ml-auto text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold tabular-nums ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}

              {item.badge !== undefined && collapsed && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Register Quick-Action */}
      <div className="p-3 border-t border-[#E2E8F0] bg-slate-50/70">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div
              onClick={() => navigate('users')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80"
              title="View Users & Access"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                  : 'DR'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {currentUser?.name || 'Dr. Alex Vance'}
                </p>
                <p className="text-[10px] text-slate-500 truncate leading-tight">
                  {currentUser?.role || 'Doctor'}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('login')}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Sign Out / Switch / Register Account"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('login')}
            className="w-full flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-colors"
            title="Register & Sign In"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
