import React, { useState } from 'react';
import { X, Printer, Copy, Check, Car, Phone, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, booking }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !booking) return null;

  const full = Number(booking.fullAmount) || 0;
  const adv = Number(booking.advance) || 0;
  const balance = Math.max(0, full - adv);

  const formatWhatsAppMsg = () => {
    return (
      `🚗🎉 *SURPRISE DRIVE - EVENT BOOKING CONFIRMATION* 🎉🚗\n` +
      `-------------------------------------------\n` +
      `📌 *Reference No:* #${booking.refNo}\n` +
      `📅 *Date:* ${booking.date}\n` +
      `⏰ *Time:* ${booking.time}\n` +
      `📍 *Location:* ${booking.place}\n` +
      `📞 *Client Tel:* ${booking.phone}\n` +
      `🎁 *Package:* ${booking.items}\n` +
      (booking.extraInfo ? `📝 *Notes:* ${booking.extraInfo}\n` : '') +
      `-------------------------------------------\n` +
      `💰 *Full Amount:* LKR ${full.toLocaleString()}\n` +
      `💵 *Advance Paid:* LKR ${adv.toLocaleString()}\n` +
      `💳 *Balance Due:* LKR ${balance.toLocaleString()}\n` +
      `-------------------------------------------\n` +
      `✨ Thank you for choosing SURPRISE DRIVE for your special day!`
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatWhatsAppMsg());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-lg p-6 relative animate-fade-in border-amber-500/40">
        
        {/* Modal Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Ticket Receipt */}
        <div id="printable-receipt" className="bg-slate-950 p-6 rounded-2xl border border-amber-500/30 text-white space-y-4 my-2">
          
          {/* Header Branding */}
          <div className="text-center pb-4 border-b border-dashed border-slate-800 space-y-1">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500 text-slate-950 mb-1">
              <Car className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-extrabold tracking-wider text-amber-400">
              SURPRISE DRIVE 🚗🎉
            </h2>
            <p className="text-xs text-slate-400">
              Vehicle Birthday Surprise & Event Decoration Voucher
            </p>
            <div className="inline-block mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full font-mono text-xs font-bold text-amber-300">
              BOOKING REF: #{booking.refNo}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="space-y-2.5 text-xs py-2">
            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Event Date
              </span>
              <span className="font-bold text-white">{booking.date}</span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Time
              </span>
              <span className="font-bold text-white">{booking.time}</span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Location
              </span>
              <span className="font-bold text-white text-right max-w-[200px] truncate">{booking.place}</span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                Contact Tel
              </span>
              <span className="font-mono font-bold text-white">{booking.phone}</span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Selected Package & Services
              </span>
              <p className="font-semibold text-white pl-5">{booking.items}</p>
              {booking.extraInfo && (
                <p className="text-[11px] text-slate-400 pl-5 italic">Notes: {booking.extraInfo}</p>
              )}
            </div>
          </div>

          {/* Financial Breakdown Ticket Footer */}
          <div className="pt-3 border-t border-dashed border-slate-800 space-y-2 font-mono">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Full Amount:</span>
              <span className="text-white font-bold">රු. {full.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-xs text-emerald-400">
              <span>Advance Paid:</span>
              <span className="font-bold">රු. {adv.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm font-extrabold text-rose-400 pt-1 border-t border-slate-900">
              <span>BALANCE DUE:</span>
              <span>රු. {balance.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 pt-2">
            Thank you for making memories with us! 🎈
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="btn-gold text-xs py-2 px-4 w-full justify-center"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'WhatsApp Text Copied!' : 'Copy for WhatsApp'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-secondary text-xs py-2 px-4 justify-center"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>

      </div>
    </div>
  );
}
