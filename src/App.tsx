import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Search, UserCheck, Timer, RotateCcw, 
  MessageSquare, Train, Bell, LogOut, CheckCircle2, 
  AlertOctagon, Fingerprint, RefreshCw, X 
} from 'lucide-react';
import { AutofillProfile, TrainAvailabilityAlert, BookingHistory, RefundRecord } from './types';
import Dashboard from './components/Dashboard';
import TatkalSearch from './components/TatkalSearch';
import AutofillBuilder from './components/AutofillBuilder';
import SpeedrunSimulator from './components/SpeedrunSimulator';
import RefundTracker from './components/RefundTracker';
import AiAssistant from './components/AiAssistant';
import { INITIAL_BOOKINGS, INITIAL_REFUNDS } from './data/trains';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Seed initial values safely inside React state for mutations
  const [profile, setProfile] = useState<AutofillProfile>({
    id: 'PROF-001',
    profileName: 'Primary Tatkal Autofill',
    irctcUsername: 'irctc_vipin_kumar',
    savedPass: 'vaulted_sha_256',
    preferredClass: '3A',
    preferredQuota: 'TQ',
    passengers: [
      { id: '1', name: 'Vipin Kumar', age: 34, gender: 'M', berthPreference: 'LB', foodChoice: 'V' },
      { id: '2', name: 'Nisha Kumari', age: 29, gender: 'F', berthPreference: 'NONE', foodChoice: 'V' }
    ],
    paymentMethod: 'UPI',
    upiAddress: 'vipinkumar@okaxis',
    paymentUnlocked: false
  });

  const [alerts, setAlerts] = useState<TrainAvailabilityAlert[]>([
    {
      id: 'ALT01',
      trainNumber: '12302',
      trainName: 'New Delhi Rajdhani Express',
      fromCode: 'NDLS',
      toCode: 'HWH',
      travelDate: '2026-06-12',
      trainClass: '3A',
      seatsThreshold: 15,
      isActive: true,
      createdAt: '2026-06-05 09:30:00',
      triggerSound: true,
      triggerPush: true
    },
    {
      id: 'ALT02',
      trainNumber: '12952',
      trainName: 'New Delhi Mumbai Rajdhani',
      fromCode: 'NDLS',
      toCode: 'CSTM',
      travelDate: '2026-06-14',
      trainClass: '2A',
      seatsThreshold: 5,
      isActive: true,
      createdAt: '2026-06-05 10:15:22',
      triggerSound: true,
      triggerPush: true
    }
  ]);

  const [bookings, setBookings] = useState<BookingHistory[]>(INITIAL_BOOKINGS);
  const [refunds, setRefunds] = useState<RefundRecord[]>(INITIAL_REFUNDS);
  
  // Dynamic alerts pushing
  const [appToasts, setAppToasts] = useState<{ id: string; msg: string; type: 'info' | 'alert' }[]>([]);

  // Simulation checks in the background to periodically trigger alert popups
  useEffect(() => {
    // Check after 8 seconds first, then every 30 seconds
    const interval = setTimeout(() => {
      pushToast(
        "Tatkal Express Alert: Train 12302 (New Delhi Rajdhani) AC 3A seats dropped below threshold of 15! Quick Autofill check suggested.",
        "alert"
      );
    }, 8000);

    return () => clearTimeout(interval);
  }, []);

  const pushToast = (msg: string, type: 'info' | 'alert' = 'info') => {
    const id = Math.random().toString();
    setAppToasts(prev => [...prev, { id, msg, type }]);
    
    // Play subtle synthetic audio warning beep if browser supports it
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.frequency.setValueAtTime(type === 'alert' ? 880 : 440, audioCtx.currentTime); 
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Ignored
    }

    setTimeout(() => {
      setAppToasts(prev => prev.filter(t => t.id !== id));
    }, 8000);
  };

  const removeToast = (id: string) => {
    setAppToasts(prev => prev.filter(t => t.id !== id));
  };

  // State handlers passed to child panels
  const handleAddAlert = (newAlert: Omit<TrainAvailabilityAlert, 'id' | 'createdAt' | 'isActive'>) => {
    const alert: TrainAvailabilityAlert = {
      ...newAlert,
      id: `ALT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      isActive: true,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAlerts(prev => [alert, ...prev]);
    pushToast(`Deployed background seat tracker alert for Train ${alert.trainNumber}!`, 'info');
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    pushToast("Removed alert monitor node.", 'info');
  };

  const handleUpdateProfile = (updatedPayload: AutofillProfile) => {
    setProfile(updatedPayload);
  };

  // Visual simulation challenge triggers
  const handleTogglePaymentLock = () => {
    setProfile(prev => ({
      ...prev,
      paymentUnlocked: !prev.paymentUnlocked
    }));
    pushToast(profile.paymentUnlocked ? "Payment Vault Key Secured." : "Payment Vault Key Decrypted via Biometrics.", 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white" id="main-app-container">
      
      {/* Top Banner Navigation bar (Responsive Layout) */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded shadow-md">
            <Train className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug">TatkalPro v2.4</h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">API Tunnel • Active Route Synced</p>
          </div>
        </div>

        {/* User Badge metadata */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-800">Vipin Kumar</span>
            <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">irctc_vipin_kumar</span>
          </div>
          <div className={`p-2 rounded-full border ${profile.paymentUnlocked ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-650'}`} title="Biometric checkout vault status">
            <Fingerprint className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar Panel */}
        <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 md:py-6 flex flex-col justify-between gap-6 border-r border-slate-950">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest px-3 block mb-2">Systems Index</span>
            
            <nav className="space-y-1">
              <button 
                id="tab-dashboard"
                onClick={() => setCurrentTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium italic transition cursor-pointer ${currentTab === 'dashboard' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard overview</span>
              </button>

              <button 
                id="tab-search"
                onClick={() => setCurrentTab('search')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium italic transition cursor-pointer ${currentTab === 'search' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Search className="w-4 h-4" />
                <span>Verify Seat Alerts</span>
              </button>

              <button 
                id="tab-autofill"
                onClick={() => setCurrentTab('autofill')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium italic transition cursor-pointer ${currentTab === 'autofill' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Autofill Profile</span>
              </button>

              <button 
                id="tab-practice"
                onClick={() => setCurrentTab('practice')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium italic transition cursor-pointer ${currentTab === 'practice' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Timer className="w-4 h-4" />
                <span>Speedrun Practice</span>
              </button>

              <button 
                id="tab-refunds"
                onClick={() => setCurrentTab('refunds')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium italic transition cursor-pointer ${currentTab === 'refunds' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Track Refund Ledger</span>
              </button>

              <button 
                id="tab-chat"
                onClick={() => setCurrentTab('chat')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium italic transition cursor-pointer ${currentTab === 'chat' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Gemini Coach Bot</span>
              </button>
            </nav>
          </div>

          {/* Security Status Block */}
          <div className="p-2 border-t border-slate-800/60 mt-auto hidden md:block">
            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/60">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Security Status</p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Biometrics Linked
              </div>
            </div>
          </div>
        </aside>

        {/* Content canvas pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full bg-slate-50">
          
          {currentTab === 'dashboard' && (
            <Dashboard 
              profile={profile}
              alerts={alerts}
              bookings={bookings}
              refunds={refunds}
              onNavigate={(tab) => setCurrentTab(tab)}
              onUnlockPayment={handleTogglePaymentLock}
            />
          )}

          {currentTab === 'search' && (
            <TatkalSearch 
              alerts={alerts}
              onAddAlert={handleAddAlert}
              onDeleteAlert={handleDeleteAlert}
            />
          )}

          {currentTab === 'autofill' && (
            <AutofillBuilder 
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onUnlockPayment={handleTogglePaymentLock}
            />
          )}

          {currentTab === 'practice' && (
            <SpeedrunSimulator 
              profile={profile}
            />
          )}

          {currentTab === 'refunds' && (
            <RefundTracker 
              bookings={bookings}
              refunds={refunds}
            />
          )}

          {currentTab === 'chat' && (
            <AiAssistant />
          )}

        </main>
      </div>

      {/* Persistent global floating alerts popups */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full select-none" id="toast-alerts-con">
        {appToasts.map(toast => (
          <div 
            key={toast.id} 
            className={`p-4 rounded-xl shadow-2xl border flex gap-3 text-xs items-start justify-between animate-slide-in relative ${
              toast.type === 'alert' 
                ? 'bg-red-950/95 border-red-800 text-red-200' 
                : 'bg-slate-900/95 border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex gap-2">
              <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${toast.type === 'alert' ? 'bg-red-900 text-red-300 animate-bounce' : 'bg-slate-800 text-slate-300'}`}>
                {toast.type === 'alert' ? <AlertOctagon className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
              <p className="leading-snug">{toast.msg}</p>
            </div>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
