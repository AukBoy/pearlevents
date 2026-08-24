import React, { useState } from 'react';
import { 
  Search, Phone, MessageSquare, Check, Edit2, Trash2, 
  FileText, Calendar, MapPin, Clock, Tag, Sparkles, Filter 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingTable({ 
  bookings, 
  onToggleStatus, 
  onEdit, 
  onDelete, 
  onGenerateReceipt 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, completed
  const [sortBy, setSortBy] = useState('date-asc'); // date-asc, date-desc, ref-asc, balance-desc

  // Handle Confetti on Complete
  const handleToggle = (id, currentStatus) => {
    if (currentStatus !== 'completed') {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback
      }
    }
    onToggleStatus(id);
  };

  // Filter & Search Logic
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking.refNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.place || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.items || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.extraInfo || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ? true : booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sorting Logic
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'ref-asc') {
      return (parseInt(a.refNo, 10) || 0) - (parseInt(b.refNo, 10) || 0);
    }
    if (sortBy === 'balance-desc') {
      const balA = (a.fullAmount || 0) - (a.advance || 0);
      const balB = (b.fullAmount || 0) - (b.advance || 0);
      return balB - balA;
    }
    return 0;
  });

  // Helper for WhatsApp link formatting
  const getWhatsAppLink = (phoneStr, booking) => {
    let cleanPhone = (phoneStr || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '94' + cleanPhone.substring(1);
    }
    const message = encodeURIComponent(
      `👋 Hello! SURPRISE DRIVE Vehicle Birthday Surprise details:\n\n` +
      `📌 Ref: #${booking.refNo}\n` +
      `📅 Date: ${booking.date} (${booking.time})\n` +
      `📍 Location: ${booking.place}\n` +
      `🎉 Package: ${booking.items}\n` +
      `💰 Full Amount: LKR ${booking.fullAmount?.toLocaleString()}\n` +
      `💵 Advance Paid: LKR ${booking.advance?.toLocaleString()}\n` +
      `💳 Balance Due: LKR ${(booking.fullAmount - booking.advance)?.toLocaleString()}\n\n` +
      `Thank you for booking with us! 🚗✨`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="glass-panel p-4 md:p-6 shadow-2xl">
      
      {/* Controls Bar: Search, Filters, Sorting */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search (Ref #, Location, Phone, Items)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-dark pl-9 pr-3 text-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter & Sort Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-end">
          
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'pending' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({bookings.filter(b => b.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'completed' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed ✓ ({bookings.filter(b => b.status === 'completed').length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-dark text-xs py-1.5 px-3 bg-slate-900 border-slate-800"
            >
              <option value="date-asc">Date (Earliest First)</option>
              <option value="date-desc">Date (Latest First)</option>
              <option value="ref-asc">Ref Number (01, 02...)</option>
              <option value="balance-desc">Balance Due (Highest First)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-sm text-slate-300">
          
          <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-amber-400 font-bold border-b border-slate-800">
            <tr>
              <th className="p-3.5 text-center">Ref</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Place / Location</th>
              <th className="p-3.5">Telephone</th>
              <th className="p-3.5">Time</th>
              <th className="p-3.5">Items & Services</th>
              <th className="p-3.5 text-right">Full Amount</th>
              <th className="p-3.5 text-right">Advance</th>
              <th className="p-3.5 text-right">Balance</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {sortedBookings.length === 0 ? (
              <tr>
                <td colSpan="11" className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-slate-600" />
                    <p className="text-base">No bookings found matching your search</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedBookings.map((b) => {
                const full = Number(b.fullAmount) || 0;
                const adv = Number(b.advance) || 0;
                const balance = Math.max(0, full - adv);
                const isCompleted = b.status === 'completed';

                return (
                  <tr 
                    key={b.id} 
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isCompleted ? 'bg-slate-950/40 opacity-90' : ''
                    }`}
                  >
                    
                    {/* Ref Number */}
                    <td className="p-3.5 text-center font-extrabold text-amber-400">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        #{b.refNo}
                      </span>
                    </td>

                    {/* Date & Booked Date */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-white">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{b.date}</span>
                      </div>
                      {b.bookedDate && b.bookedDate !== b.date && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Booked: {b.bookedDate}
                        </div>
                      )}
                    </td>

                    {/* Place */}
                    <td className="p-3.5 font-medium text-white max-w-[160px]">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{b.place}</span>
                      </div>
                    </td>

                    {/* Telephone + WhatsApp */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`tel:${b.phone}`}
                          className="font-mono text-slate-200 hover:text-amber-400 font-semibold text-xs flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded border border-slate-800"
                          title="Call Phone"
                        >
                          <Phone className="w-3 h-3 text-cyan-400" />
                          {b.phone}
                        </a>

                        <a 
                          href={getWhatsAppLink(b.phone, b)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors border border-emerald-500/30"
                          title="Send WhatsApp details"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{b.time}</span>
                      </div>
                    </td>

                    {/* Items & Notes */}
                    <td className="p-3.5 max-w-[220px]">
                      <div className="font-semibold text-slate-100 flex items-center gap-1 text-xs">
                        <Tag className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{b.items}</span>
                      </div>
                      {b.extraInfo && (
                        <div className="text-[11px] text-slate-400 mt-1 italic line-clamp-2 bg-slate-900/40 p-1 rounded border border-slate-800/50">
                          {b.extraInfo}
                        </div>
                      )}
                    </td>

                    {/* Full Amount */}
                    <td className="p-3.5 text-right font-mono font-bold text-white whitespace-nowrap">
                      LKR {full.toLocaleString()}
                    </td>

                    {/* Advance */}
                    <td className="p-3.5 text-right font-mono text-emerald-400 whitespace-nowrap">
                      {adv > 0 ? `LKR ${adv.toLocaleString()}` : '-'}
                    </td>

                    {/* Balance */}
                    <td className="p-3.5 text-right font-mono whitespace-nowrap">
                      {balance > 0 ? (
                        <span className="font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          LKR {balance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold text-xs">
                          Paid ✓
                        </span>
                      )}
                    </td>

                    {/* Completion Tick Button (notebook style ✓) */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggle(b.id, b.status)}
                        className={`badge cursor-pointer transition-all ${
                          isCompleted ? 'badge-completed' : 'badge-pending'
                        }`}
                        title={isCompleted ? "Mark as Pending" : "Mark as Completed ✓"}
                      >
                        {isCompleted ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Done ✓</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        
                        {/* Printable Receipt */}
                        <button
                          onClick={() => onGenerateReceipt(b)}
                          className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors"
                          title="Generate Receipt / Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit(b)}
                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          title="Edit Booking"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete(b.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
