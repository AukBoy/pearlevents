import React from 'react';
import { CalendarCheck, DollarSign, Wallet, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function StatsOverview({ bookings }) {
  const totalCount = bookings.length;
  
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.fullAmount) || 0), 0);
  const totalAdvance = bookings.reduce((sum, b) => sum + (Number(b.advance) || 0), 0);
  const totalBalance = bookings.reduce((sum, b) => {
    const full = Number(b.fullAmount) || 0;
    const adv = Number(b.advance) || 0;
    return sum + Math.max(0, full - adv);
  }, 0);

  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const completionPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Revenue Card */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Revenue
          </span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          LKR {totalRevenue.toLocaleString('en-US')}
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Sum across {totalCount} bookings</span>
        </div>
      </div>

      {/* Advance Received Card */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Advance Received
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 tracking-tight">
          LKR {totalAdvance.toLocaleString('en-US')}
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
          <span>{totalRevenue ? Math.round((totalAdvance / totalRevenue) * 100) : 0}% of total revenue collected</span>
        </div>
      </div>

      {/* Outstanding Balance Card */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Balance Due
          </span>
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-red-400 tracking-tight">
          LKR {totalBalance.toLocaleString('en-US')}
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
          <span>Total pending amount to collect</span>
        </div>
      </div>

      {/* Completion Status Card */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Surprise Progress
          </span>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl lg:text-3xl font-extrabold text-white">
            {completedCount} <span className="text-sm font-normal text-slate-400">/ {totalCount}</span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-500/30">
            {completionPercentage}% Done
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
          <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3 h-3" /> {completedCount} Done</span>
          <span className="flex items-center gap-1 text-amber-400"><Clock className="w-3 h-3" /> {pendingCount} Pending</span>
        </div>
      </div>

    </div>
  );
}
