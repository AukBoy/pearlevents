import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, PlusCircle } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, onSave, editingBooking, nextRefNo }) {
  const [formData, setFormData] = useState({
    refNo: '',
    bookedDate: '',
    date: '',
    place: '',
    phone: '',
    time: '7:00 PM',
    items: 'Vehicle B\'day Surprise',
    fullAmount: 15000,
    advance: 5000,
    extraInfo: '',
    status: 'pending'
  });

  const [showCalculator, setShowCalculator] = useState(false);
  const [calcBase, setCalcBase] = useState(13500);
  const [calcDeco, setCalcDeco] = useState(0);
  const [calcTrans, setCalcTrans] = useState(1500);

  useEffect(() => {
    if (editingBooking) {
      setFormData({
        ...editingBooking,
        fullAmount: editingBooking.fullAmount || 0,
        advance: editingBooking.advance || 0
      });
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setFormData({
        refNo: nextRefNo || '14',
        bookedDate: todayStr,
        date: todayStr,
        place: '',
        phone: '',
        time: '7:00 PM',
        items: 'Vehicle B\'day Surprise',
        fullAmount: 15000,
        advance: 5000,
        extraInfo: '',
        status: 'pending'
      });
    }
  }, [editingBooking, nextRefNo, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyCalc = () => {
    const total = (Number(calcBase) || 0) + (Number(calcDeco) || 0) + (Number(calcTrans) || 0);
    setFormData(prev => ({
      ...prev,
      fullAmount: total,
      extraInfo: prev.extraInfo ? `${prev.extraInfo} (Breakdown: ${calcBase} + ${calcDeco} deco + ${calcTrans} transp)` : `Breakdown: ${calcBase} + ${calcDeco} deco + ${calcTrans} transp`
    }));
    setShowCalculator(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      fullAmount: Number(formData.fullAmount) || 0,
      advance: Number(formData.advance) || 0
    });
    onClose();
  };

  const calculatedBalance = Math.max(0, (Number(formData.fullAmount) || 0) - (Number(formData.advance) || 0));

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto animate-fade-in border-amber-500/30">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {editingBooking ? `Edit Booking #${formData.refNo}` : 'Add New Event Booking'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Ref No */}
            <div>
              <label className="block text-xs font-bold text-amber-400 mb-1">
                Ref No *
              </label>
              <input 
                type="text"
                name="refNo"
                required
                value={formData.refNo}
                onChange={handleChange}
                className="input-dark font-extrabold text-amber-400"
                placeholder="01, 02, 14..."
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Surprise Date *
              </label>
              <input 
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="input-dark"
              />
            </div>

            {/* Booked Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Booked On Date
              </label>
              <input 
                type="date"
                name="bookedDate"
                value={formData.bookedDate}
                onChange={handleChange}
                className="input-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Place */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Place / Location *
              </label>
              <input 
                type="text"
                name="place"
                required
                value={formData.place}
                onChange={handleChange}
                className="input-dark"
                placeholder="e.g. Colombo, Negombo, Ekala Airforce Camp Rd..."
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Telephone Number *
              </label>
              <input 
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="input-dark font-mono"
                placeholder="0771234567 or +9477..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Surprise Time
              </label>
              <input 
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input-dark"
                placeholder="e.g. 7:00 PM / 12:00 AM"
              />
            </div>

            {/* Items */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Items & Services *
              </label>
              <input 
                type="text"
                name="items"
                required
                value={formData.items}
                onChange={handleChange}
                className="input-dark"
                placeholder="e.g. Vehicle B'day Surprise, Mascot, Deco..."
              />
            </div>
          </div>

          {/* Pricing Calculator Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowCalculator(!showCalculator)}
              className="text-xs text-amber-400 font-bold flex items-center gap-1.5 hover:underline"
            >
              <Calculator className="w-4 h-4" />
              <span>{showCalculator ? "Close Calculator" : "Price Breakdown Calculator (Base + Deco + Transport)"}</span>
            </button>

            {showCalculator && (
              <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-amber-500/30 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Base Price</label>
                    <input 
                      type="number"
                      value={calcBase}
                      onChange={(e) => setCalcBase(e.target.value)}
                      className="input-dark text-xs py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Deco Fee</label>
                    <input 
                      type="number"
                      value={calcDeco}
                      onChange={(e) => setCalcDeco(e.target.value)}
                      className="input-dark text-xs py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Transport Fee</label>
                    <input 
                      type="number"
                      value={calcTrans}
                      onChange={(e) => setCalcTrans(e.target.value)}
                      className="input-dark text-xs py-1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-white">
                    Calculated Total: LKR {((Number(calcBase)||0)+(Number(calcDeco)||0)+(Number(calcTrans)||0)).toLocaleString()}
                  </span>
                  <button 
                    type="button"
                    onClick={handleApplyCalc}
                    className="btn-gold text-xs py-1 px-3"
                  >
                    Apply Total
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {/* Full Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Full Amount (LKR) *
              </label>
              <input 
                type="number"
                name="fullAmount"
                required
                value={formData.fullAmount}
                onChange={handleChange}
                className="input-dark font-mono font-bold text-white"
              />
            </div>

            {/* Advance */}
            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                Advance Paid (LKR)
              </label>
              <input 
                type="number"
                name="advance"
                value={formData.advance}
                onChange={handleChange}
                className="input-dark font-mono text-emerald-400"
              />
            </div>

            {/* Balance Preview */}
            <div>
              <label className="block text-xs font-bold text-rose-400 mb-1">
                Balance Due (LKR)
              </label>
              <div className="input-dark font-mono font-extrabold text-rose-400 bg-slate-900/90 flex items-center">
                LKR {calculatedBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Status & Extra Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-dark"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed ✓</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Extra Info / Notes
              </label>
              <input 
                type="text"
                name="extraInfo"
                value={formData.extraInfo}
                onChange={handleChange}
                className="input-dark"
                placeholder="e.g. Fireworks, Photo frame size, Mascot code..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2.5 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold text-xs py-2.5 px-5"
            >
              <Save className="w-4 h-4 stroke-[3]" />
              <span>{editingBooking ? 'Update Booking' : 'Save Booking'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
