import React from 'react';
import { Car, Plus, RefreshCw, Calendar, ListFilter, DollarSign, Download, Upload } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenAddModal, 
  onResetData, 
  onExportData, 
  onImportData 
}) {
  return (
    <header className="mb-6 pt-4">
      <div className="glass-panel p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Car className="w-7 h-7 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
              SURPRISE DRIVE 🚗🎉
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium">
              Vehicle Birthday Surprise & Event Decoration Manager
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'table'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Bookings Register</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'calendar'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'financials'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financial Summary</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={onOpenAddModal}
            className="btn-gold text-sm py-2 px-4"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Booking</span>
          </button>

          <button
            onClick={onExportData}
            title="Export Backup JSON"
            className="btn-secondary text-xs p-2.5"
          >
            <Download className="w-4 h-4" />
          </button>

          <label 
            title="Import Backup JSON"
            className="btn-secondary text-xs p-2.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <input 
              type="file" 
              accept=".json" 
              onChange={onImportData} 
              className="hidden" 
            />
          </label>

          <button
            onClick={onResetData}
            title="Reset to Original Notebook Seed Data"
            className="btn-secondary text-xs p-2.5 text-slate-400 hover:text-amber-400"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
