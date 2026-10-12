import React from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, navigate } = useHealthSync();

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Notifications & Clinical Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational alerts, high-risk triage triggers, and laboratory turnarounds
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-semibold text-blue-600 hover:underline self-start sm:self-auto"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => {
              markNotificationAsRead(notif.id);
              if (notif.recordType === 'case') navigate('case-details');
              else if (notif.recordType === 'investigation') navigate('investigations');
              else if (notif.recordType === 'appointment') navigate('appointments');
            }}
            className={`p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
              !notif.read ? 'bg-blue-50/20' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  notif.type === 'alert'
                    ? 'bg-rose-50 text-rose-600'
                    : notif.type === 'appointment'
                    ? 'bg-sky-50 text-sky-600'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block tabular-nums">
                  {notif.timestamp}
                </span>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
};
