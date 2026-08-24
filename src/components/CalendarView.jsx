import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Phone, AlertTriangle } from 'lucide-react';

export default function CalendarView({ bookings, onEdit, onGenerateReceipt }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Default to Aug 2026
  const [selectedDayBookings, setSelectedDayBookings] = useState([]);
  const [selectedDayStr, setSelectedDayStr] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const formatDateStr = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const bookingsByDate = {};
  bookings.forEach(b => {
    if (b.date) {
      const parts = b.date.split('-');
      if (parts.length === 3) {
        const formatted = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
        if (!bookingsByDate[formatted]) bookingsByDate[formatted] = [];
        bookingsByDate[formatted].push(b);
      }
    }
  });

  const handleDayClick = (dayNum) => {
    const dateStr = formatDateStr(year, month, dayNum);
    setSelectedDayStr(dateStr);
    setSelectedDayBookings(bookingsByDate[dateStr] || []);
  };

  return (
    <div className="glass-panel p-4 md:p-6">
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">
              Surprise Events Schedule & Double-booking Check
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth}
            className="btn-secondary p-2 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(2026, 7, 1))}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            Today (Aug 2026)
          </button>
          <button 
            onClick={nextMonth}
            className="btn-secondary p-2 text-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-amber-400 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-20 bg-slate-950/30 rounded-xl border border-slate-900/50 opacity-30" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatDateStr(year, month, dayNum);
              const dayBookings = bookingsByDate[dateStr] || [];
              const isSelected = selectedDayStr === dateStr;

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => handleDayClick(dayNum)}
                  className={`h-20 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 scale-[1.02]' 
                      : dayBookings.length > 0 
                      ? 'border-indigo-500/40 bg-slate-900/90 hover:border-amber-400' 
                      : 'border-slate-800/60 bg-slate-950/40 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={dayBookings.length > 0 ? "text-amber-400" : "text-slate-400"}>
                      {dayNum}
                    </span>
                    {dayBookings.length > 1 && (
                      <span className="text-[10px] px-1 bg-rose-500/20 text-rose-300 rounded flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {dayBookings.length} Events
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayBookings.slice(0, 2).map((b) => (
                      <div 
                        key={b.id}
                        className={`text-[10px] truncate px-1.5 py-0.5 rounded font-semibold ${
                          b.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        #{b.refNo} {b.place.split(' ')[0]}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-[9px] text-slate-400 text-center font-bold">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Selected Day Event Details Sidebar */}
        <div className="glass-panel p-4 bg-slate-900/80 border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center justify-between">
            <span>{selectedDayStr ? `Events for ${selectedDayStr}` : 'Selected Day Details'}</span>
            {selectedDayBookings.length > 0 && (
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                {selectedDayBookings.length} Surprise(s)
              </span>
            )}
          </h3>

          {!selectedDayStr ? (
            <div className="text-slate-500 text-xs text-center py-12">
              Click on any day in the calendar to view its surprise bookings.
            </div>
          ) : selectedDayBookings.length === 0 ? (
            <div className="text-slate-400 text-xs text-center py-10">
              No bookings scheduled on this date.
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {selectedDayBookings.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-400 text-sm">
                      Ref #{b.refNo}
                    </span>
                    <span className={`badge ${b.status === 'completed' ? 'badge-completed' : 'badge-pending'}`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-300">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{b.place}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{b.time}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{b.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Full: LKR {b.fullAmount?.toLocaleString()}</span>
                    <span className="text-red-400 font-bold">
                      Bal: LKR {(b.fullAmount - b.advance)?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => onEdit(b)}
                      className="btn-secondary text-[11px] py-1 px-2.5 w-full justify-center"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onGenerateReceipt(b)}
                      className="btn-gold text-[11px] py-1 px-2.5 w-full justify-center"
                    >
                      Receipt
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
