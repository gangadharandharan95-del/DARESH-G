import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  User,
} from 'lucide-react';
import { useHealthSync } from '../context/HealthSyncContext';

interface AppointmentsViewProps {
  onOpenAppointmentModal: (patientId?: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({ onOpenAppointmentModal }) => {
  const { appointments, navigate } = useHealthSync();
  const [activeTab, setActiveTab] = useState<'Appointments' | 'Follow-ups'>('Appointments');
  const [selectedDay, setSelectedDay] = useState<number>(28);

  // Month days for April 2026 (April starts on Wednesday)
  // Mar 29, 30, 31 (gray)
  // Apr 1 - 30
  // May 1 - 2
  const calendarDays = [
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 31, currentMonth: false },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true },
    { day: 3, currentMonth: true },
    { day: 4, currentMonth: true },
    { day: 5, currentMonth: true },
    { day: 6, currentMonth: true },
    { day: 7, currentMonth: true },
    { day: 8, currentMonth: true },
    { day: 9, currentMonth: true },
    { day: 10, currentMonth: true },
    { day: 11, currentMonth: true },
    { day: 12, currentMonth: true },
    { day: 13, currentMonth: true },
    { day: 14, currentMonth: true },
    { day: 15, currentMonth: true },
    { day: 16, currentMonth: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true },
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true },
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true }, // Highlighted in screenshot
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true },
    { day: 1, currentMonth: false },
    { day: 2, currentMonth: false },
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Appointments & Follow-ups
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage patient appointments and follow-up schedule
          </p>
        </div>

        <button
          onClick={() => onOpenAppointmentModal()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Main Container matching screenshot */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Tab switcher: Appointments vs Follow-ups */}
        <div className="flex items-center gap-6 border-b border-slate-100 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('Appointments')}
            className={`pb-1 transition-colors ${
              activeTab === 'Appointments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('Follow-ups')}
            className={`pb-1 transition-colors ${
              activeTab === 'Follow-ups'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Follow-ups
          </button>
        </div>

        {/* 2 Columns: Calendar on Left, Upcoming on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
          {/* Left Column: Calendar Widget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">April 2026</span>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-slate-400 font-semibold py-1">
                  {d}
                </div>
              ))}
              {calendarDays.map((item, idx) => {
                const isSelected = item.currentMonth && item.day === selectedDay;
                return (
                  <button
                    key={idx}
                    onClick={() => item.currentMonth && setSelectedDay(item.day)}
                    className={`h-7 rounded-full flex items-center justify-center font-medium tabular-nums transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : item.currentMonth
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-300'
                    }`}
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Upcoming Appointments */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Upcoming Appointments</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Today, 28 Apr 2026</p>
            </div>

            <div className="space-y-3">
              {/* Appt 1: Priya Sharma */}
              <div
                onClick={() => navigate('patient-profile', { patientId: 'P-1002' })}
                className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-slate-700 mt-0.5 tabular-nums">
                    09:00
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Priya Sharma</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dr. Amit Kumar (Orthopedics)
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confirmed
                </span>
              </div>

              {/* Appt 2: Robert Davis */}
              <div
                onClick={() => navigate('patient-profile', { patientId: 'P-1003' })}
                className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-slate-700 mt-0.5 tabular-nums">
                    11:30
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Robert Davis</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dr. Priya Nair (Cardiology)
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confirmed
                </span>
              </div>

              {/* Appt 3: Anjali Gupta */}
              <div
                onClick={() => navigate('patient-profile', { patientId: 'P-1004' })}
                className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-slate-700 mt-0.5 tabular-nums">
                    14:00
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Anjali Gupta</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dr. Sneha Patel (Pediatrics)
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Scheduled
                </span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => navigate('appointments')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
