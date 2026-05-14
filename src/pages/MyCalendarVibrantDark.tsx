import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  format, addDays, startOfWeek, addWeeks, subWeeks,
  isSameDay, startOfMonth, endOfMonth, eachDayOfInterval,
  isToday, getDay, addMonths, subMonths, isSameMonth
} from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { useLanguage } from '../lib/i18n';

export default function MyCalendarVibrantDark() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  
  const events = useStore((state) => state.events);

  const upcomingEvents = events.slice(0, 3).map((e, idx) => ({
    ...e,
    parsedDate: addDays(new Date(), idx * 2)
  }));

  const prevPeriod = () => {
    if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const nextPeriod = () => {
    if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Leading blank cells so that the grid starts on Monday (getDay 0=Sun,1=Mon,...6=Sat)
  const leadingBlanks = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">{t('Το Ημερολόγιό μου', 'My Calendar')}</h1>
          <p className="text-white font-medium text-xs md:text-sm mt-1">{t('Διαχειριστείτε το πρόγραμμά σας και τις προσεχείς εμπειρίες.', 'Manage your schedule and upcoming experiences.')}</p>
        </div>
        
        <div className="flex bg-gray-700 p-1 rounded-lg">
          <button 
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${view === 'week' ? 'bg-gray-800 shadow-sm text-white' : 'text-white'}`}
            onClick={() => setView('week')}
          >
            {t('Εβδομάδα', 'Week')}
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${view === 'month' ? 'bg-gray-800 shadow-sm text-white' : 'text-white'}`}
            onClick={() => setView('month')}
          >
            {t('Μήνας', 'Month')}
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="font-bold text-white text-lg">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={prevPeriod} className="p-1.5 hover:bg-gray-700 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold bg-gray-700 text-white rounded-md hover:bg-gray-200">
              {t('Σήμερα', 'Today')}
            </button>
            <button onClick={nextPeriod} className="p-1.5 hover:bg-gray-700 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'week' && (
            <motion.div
              key="week"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              <div className="grid grid-cols-7 gap-2 mb-4">
                {days.map((day, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[10px] font-bold text-white tracking-wide">{format(day, 'EEE')}</div>
                    <div className={`mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-bold ${isToday(day) ? 'bg-cyan-600 text-white' : 'text-white'}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mt-6">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl border border-gray-800 hover:border-emerald-800 hover:bg-emerald-900/30/30 transition-colors cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                    <div className="flex flex-col items-center justify-center w-16 shrink-0 border-r border-gray-800 pr-4">
                      <span className="text-xs font-bold text-white">{format(event.parsedDate, 'MMM')}</span>
                      <span className="text-2xl font-black text-white">{format(event.parsedDate, 'dd')}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white text-sm">{event.title}</h3>
                        <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide text--400 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> {t('Επιβεβαιώθηκε', 'Confirmed')}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white font-medium">
                        <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</div>
                        <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.locationArea}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {view === 'month' && (
            <motion.div
              key="month"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {[t('Δευ', 'Mon'), t('Τρι', 'Tue'), t('Τετ', 'Wed'), t('Πεμ', 'Thu'), t('Παρ', 'Fri'), t('Σαβ', 'Sat'), t('Κυρ', 'Sun')].map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-white tracking-wide py-2">{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Leading blank cells */}
                {Array.from({ length: leadingBlanks }).map((_, i) => (
                  <div key={`blank-${i}`} className="aspect-square" />
                ))}

                {monthDays.map(day => {
                  const dayEvents = upcomingEvents.filter(e => isSameDay(e.parsedDate, day));
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  return (
                    <div
                      key={day.toISOString()}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors ${
                        isToday(day)
                          ? 'bg-cyan-600 text-white'
                          : dayEvents.length > 0
                            ? 'bg-emerald-900/30 hover:bg-emerald-900/50'
                            : 'hover:bg-gray-900'
                      } ${!isCurrentMonth ? 'opacity-30' : ''}`}
                    >
                      <span className={`text-xs font-bold ${isToday(day) ? 'text-white' : 'text-white'}`}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isToday(day) ? 'bg-gray-800' : 'bg-cyan-600'}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Upcoming events list below the grid */}
              {upcomingEvents.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-gray-800 pt-4">
                  <h4 className="text-[10px] font-bold text-white tracking-wide mb-2">{t('Προσεχώς αυτόν τον μήνα', 'Upcoming This Month')}</h4>
                  {upcomingEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-center text-sm cursor-pointer hover:bg-emerald-900/30 p-2 rounded-lg transition-colors"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <div className="text-[10px] font-bold text-white w-12 shrink-0">
                        {format(event.parsedDate, 'MMM d')}
                      </div>
                      <div className="w-2 h-2 rounded-full bg-cyan-600 shrink-0" />
                      <div className="font-medium text-white text-xs line-clamp-1 flex-1">{event.title}</div>
                      <span className="text-[10px] text--400 font-bold bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">{t('Επιβεβαιώθηκε', 'Confirmed')}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
