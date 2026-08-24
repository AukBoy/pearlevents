import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import BookingTable from './components/BookingTable';
import CalendarView from './components/CalendarView';
import FinancialSummary from './components/FinancialSummary';
import BookingModal from './components/BookingModal';
import ReceiptModal from './components/ReceiptModal';
import { INITIAL_BOOKINGS } from './data/initialBookings';

export default function App() {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('surprise_drive_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse localStorage bookings', e);
    }
    return INITIAL_BOOKINGS;
  });

  const [activeTab, setActiveTab] = useState('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [receiptBooking, setReceiptBooking] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch bookings from Zircon Host MySQL API on mount
  useEffect(() => {
    const fetchFromAPI = async () => {
      try {
        const response = await fetch('/api/bookings.php');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setBookings(data);
            localStorage.setItem('surprise_drive_bookings', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.log('API not reachable (running local fallback or dev mode)', err);
      }
    };
    fetchFromAPI();
  }, []);

  // Save fallback to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('surprise_drive_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [bookings]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Completion Status (✓) with API sync
  const handleToggleStatus = async (id) => {
    const target = bookings.find(b => b.id === id);
    if (!target) return;
    const newStatus = target.status === 'completed' ? 'pending' : 'completed';
    const updated = { ...target, status: newStatus };

    setBookings(prev => prev.map(b => b.id === id ? updated : b));
    showToast(newStatus === 'completed' ? `Booking #${target.refNo} Completed ✓` : `Booking #${target.refNo} Marked Pending`);

    try {
      await fetch(`/api/bookings.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error('API sync error', e);
    }
  };

  // Add or Update Booking with API sync
  const handleSaveBooking = async (bookingData) => {
    if (editingBooking) {
      const updated = { ...bookingData, id: editingBooking.id };
      setBookings(prev => prev.map(b => b.id === editingBooking.id ? updated : b));
      showToast(`Booking #${bookingData.refNo} updated`);

      try {
        await fetch(`/api/bookings.php?id=${editingBooking.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
      } catch (e) {
        console.error('API sync error', e);
      }
    } else {
      const newBooking = {
        ...bookingData,
        id: Date.now().toString()
      };
      setBookings(prev => [newBooking, ...prev]);
      showToast(`New Booking #${bookingData.refNo} added!`);

      try {
        const res = await fetch('/api/bookings.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.id) {
            setBookings(prev => prev.map(b => b.id === newBooking.id ? { ...newBooking, id: resData.id } : b));
          }
        }
      } catch (e) {
        console.error('API sync error', e);
      }
    }
    setEditingBooking(null);
  };

  // Delete Booking with API sync
  const handleDeleteBooking = async (id) => {
    const target = bookings.find(b => b.id === id);
    if (window.confirm(`Are you sure you want to delete Booking #${target?.refNo || ''}?`)) {
      setBookings(prev => prev.filter(b => b.id !== id));
      showToast(`Booking #${target?.refNo || ''} deleted`);

      try {
        await fetch(`/api/bookings.php?id=${id}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.error('API sync error', e);
      }
    }
  };

  // Reset to seed data
  const handleResetData = () => {
    if (window.confirm('Do you want to reset all bookings back to the original 13 paper notebook records?')) {
      setBookings(INITIAL_BOOKINGS);
      showToast('Data reset to original 13 ledger records');
    }
  };

  // Export JSON Backup
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `surprise_drive_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON downloaded');
  };

  // Import JSON Backup
  const handleImportData = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            setBookings(imported);
            showToast('Backup data imported successfully');
          } else {
            alert('Invalid backup JSON file!');
          }
        } catch (err) {
          alert('Failed to read file');
        }
      };
    }
  };

  // Calculate Next Ref Number
  const maxRef = bookings.reduce((max, b) => {
    const num = parseInt(b.refNo, 10);
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  const nextRefNo = String(maxRef + 1).padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingBooking(null);
          setIsAddModalOpen(true);
        }}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Main Tab Content */}
      <main className="mb-6">
        {activeTab === 'table' && (
          <BookingTable 
            bookings={bookings}
            onToggleStatus={handleToggleStatus}
            onEdit={(b) => {
              setEditingBooking(b);
              setIsAddModalOpen(true);
            }}
            onDelete={handleDeleteBooking}
            onGenerateReceipt={(b) => setReceiptBooking(b)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView 
            bookings={bookings}
            onEdit={(b) => {
              setEditingBooking(b);
              setIsAddModalOpen(true);
            }}
            onGenerateReceipt={(b) => setReceiptBooking(b)}
          />
        )}

        {activeTab === 'financials' && (
          <FinancialSummary bookings={bookings} />
        )}
      </main>

      {/* Bottom Metrics Cards */}
      <StatsOverview bookings={bookings} />

      {/* Modals */}
      <BookingModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveBooking}
        editingBooking={editingBooking}
        nextRefNo={nextRefNo}
      />

      <ReceiptModal 
        isOpen={!!receiptBooking}
        onClose={() => setReceiptBooking(null)}
        booking={receiptBooking}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl animate-fade-in border border-amber-300 flex items-center gap-2 text-sm">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
