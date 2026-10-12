import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  UserPlus,
} from 'lucide-react';
import { useHealthSync } from '../../context/HealthSyncContext';

interface TopHeaderProps {
  collapsed: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ collapsed }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    currentUser,
    navigate,
    setIsSearchOpen,
  } = useHealthSync();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.read);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-[#E2E8F0] z-20 flex items-center justify-between px-6 transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-60'
      }`}
    >
      {/* Search Input matching reference image */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl text-xs font-medium transition-colors border border-slate-200 text-left"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="flex-1 truncate">Search patients, cases, or anything...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Zone: Notification Bell & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Operational Alerts</span>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-blue-600 hover:underline font-semibold text-[11px]"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      if (notif.recordType === 'case') navigate('case-details');
                      else if (notif.recordType === 'investigation') navigate('investigations');
                      else if (notif.recordType === 'appointment') navigate('appointments');
                      setIsNotificationsOpen(false);
                    }}
                    className={`p-3.5 hover:bg-slate-50 cursor-pointer ${
                      !notif.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <p className="font-bold text-slate-800">{notif.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-slate-500 mt-1 line-clamp-2 text-[11px]">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Register / Sign In Quick Button */}
        <button
          onClick={() => navigate('login')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200/80 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          title="Open Register & Sign In Portal"
        >
          <UserPlus className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Register & Sign In</span>
        </button>

        {/* User Profile matching reference image */}
        <div
          onClick={() => navigate('users')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 select-none"
          title="Manage Users & Access"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80"
              alt="Dr. Sarah Johnson"
              className="w-full h-full object-cover"
              onError={(e) => {
                // styled CSS fallback
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="hidden">SJ</span>
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser?.name || 'Dr. Sarah Johnson'}
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              {currentUser?.role || 'Doctor'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
