import React from 'react';
import { DollarSign, TrendingUp, AlertCircle, PieChart, ShieldAlert } from 'lucide-react';

export default function FinancialSummary({ bookings }) {
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.fullAmount) || 0), 0);
  const totalAdvance = bookings.reduce((sum, b) => sum + (Number(b.advance) || 0), 0);
  const totalBalance = bookings.reduce((sum, b) => {
    const full = Number(b.fullAmount) || 0;
    const adv = Number(b.advance) || 0;
    return sum + Math.max(0, full - adv);
  }, 0);

  const avgBookingValue = bookings.length ? Math.round(totalRevenue / bookings.length) : 0;

  const pendingBalanceBookings = bookings
    .map(b => ({
      ...b,
      balance: Math.max(0, (Number(b.fullAmount) || 0) - (Number(b.advance) || 0))
    }))
    .filter(b => b.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  return (
    <div className="space-y-6">
      
      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            LKR {totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Total revenue value across all bookings</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Booking Value</span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">
            LKR {avgBookingValue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Average earning per surprise package</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outstanding Balance Due</span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">
            LKR {totalBalance.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Total remaining cash to be collected</p>
        </div>

      </div>

      {/* Payment Progress Bar */}
      <div className="glass-panel p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-amber-400" />
          <span>Payment Collection Progress</span>
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-400">Advance Collected: LKR {totalAdvance.toLocaleString()} ({totalRevenue ? Math.round((totalAdvance / totalRevenue) * 100) : 0}%)</span>
            <span className="text-rose-400">Balance Pending: LKR {totalBalance.toLocaleString()} ({totalRevenue ? Math.round((totalBalance / totalRevenue) * 100) : 0}%)</span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-4 p-0.5 border border-slate-800 flex overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalRevenue ? (totalAdvance / totalRevenue) * 100 : 0}%` }}
              title={`Advance: ${totalAdvance}`}
            />
            <div 
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalRevenue ? (totalBalance / totalRevenue) * 100 : 0}%` }}
              title={`Balance Due: ${totalBalance}`}
            />
          </div>
        </div>
      </div>

      {/* Outstanding Balances Checklist */}
      <div className="glass-panel p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span>Outstanding Balance Due Checklist</span>
        </h3>

        {pendingBalanceBookings.length === 0 ? (
          <div className="text-slate-400 text-sm py-4 text-center">
            All payments fully collected!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingBalanceBookings.map(b => (
              <div key={b.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-400 text-sm flex items-center gap-2">
                    <span>Ref #{b.refNo}</span>
                    <span className="text-slate-400 text-xs font-normal">({b.date})</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium truncate max-w-[170px]">
                    {b.place}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {b.phone}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400">Full: LKR {b.fullAmount?.toLocaleString()}</div>
                  <div className="text-sm font-extrabold text-rose-400">
                    LKR {b.balance.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
