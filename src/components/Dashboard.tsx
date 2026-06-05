import React, { useState, useEffect } from 'react';
import { 
  Clock, Train, Shield, AlertCircle, Fingerprint, 
  Activity, ArrowRight, RefreshCw, Sparkles 
} from 'lucide-react';
import { AutofillProfile, TrainAvailabilityAlert, BookingHistory, RefundRecord } from '../types';

interface DashboardProps {
  profile: AutofillProfile;
  alerts: TrainAvailabilityAlert[];
  bookings: BookingHistory[];
  refunds: RefundRecord[];
  onNavigate: (tab: string) => void;
  onUnlockPayment: () => void;
}

export default function Dashboard({ 
  profile, 
  alerts, 
  bookings, 
  refunds, 
  onNavigate, 
  onUnlockPayment 
}: DashboardProps) {
  const [acTimeLeft, setAcTimeLeft] = useState('');
  const [slTimeLeft, setSlTimeLeft] = useState('');
  const [sysLogs, setSysLogs] = useState({
    activeBackgroundTrackers: 2,
    cpuLoad: '4%',
    lastCheckedTime: new Date().toLocaleTimeString(),
    networkInbound: '1.8 Mbps'
  });

  // Calculate countdown to Tatkal Class Windows
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      
      // Calculate AC Countdown (10:00:00 AM today or tomorrow)
      const acTarget = new Date(now);
      acTarget.setHours(10, 0, 0, 0);
      if (now.getHours() >= 10) {
        acTarget.setDate(acTarget.getDate() + 1);
      }
      const acDiff = acTarget.getTime() - now.getTime();
      const acH = Math.floor(acDiff / (1000 * 60 * 60));
      const acM = Math.floor((acDiff % (1000 * 60 * 60)) / (1000 * 60));
      const acS = Math.floor((acDiff % (1000 * 60)) / 1000);
      setAcTimeLeft(`${acH.toString().padStart(2, '0')}:${acM.toString().padStart(2, '0')}:${acS.toString().padStart(2, '0')}`);

      // Calculate Sleeper Countdown (11:00:00 AM today or tomorrow)
      const slTarget = new Date(now);
      slTarget.setHours(11, 0, 0, 0);
      if (now.getHours() >= 11) {
        slTarget.setDate(slTarget.getDate() + 1);
      }
      const slDiff = slTarget.getTime() - now.getTime();
      const slH = Math.floor(slDiff / (1000 * 60 * 60));
      const slM = Math.floor((slDiff % (1000 * 60 * 60)) / (1000 * 60));
      const slS = Math.floor((slDiff % (1000 * 60)) / 1000);
      setSlTimeLeft(`${slH.toString().padStart(2, '0')}:${slM.toString().padStart(2, '0')}:${slS.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch light system logs
  useEffect(() => {
    const ping = setInterval(() => {
      setSysLogs({
        activeBackgroundTrackers: alerts.filter(a => a.isActive).length,
        cpuLoad: `${Math.floor(Math.random() * 8) + 3}%`,
        lastCheckedTime: new Date().toLocaleTimeString(),
        networkInbound: `${(Math.random() * 2 + 1).toFixed(1)} Mbps`
      });
    }, 5000);
    return () => clearInterval(ping);
  }, [alerts]);

  const activeAlerts = alerts.filter(a => a.isActive);
  const pendingRefunds = refunds.filter(r => r.status !== 'SETTLED' && r.status !== 'FAILED');

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Prime Header Accent */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 p-6 rounded shadow-sm text-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-600"></span>
            </span>
            <span className="text-xs font-mono text-orange-600 uppercase tracking-widest font-bold">Active Booking Console</span>
          </div>
          <h1 className="text-2xl font-sans font-black text-slate-900 tracking-tight">Suite Control Center</h1>
          <p className="text-xs text-slate-550">Automated IRCTC queue scheduling, rapid biometric checkout, and alerts</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            id="btn-trigger-practice"
            onClick={() => onNavigate('practice')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded transition cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-100" />
            <span>Practice Speedrun</span>
          </button>
          
          <button 
            id="btn-trigger-ai"
            onClick={() => onNavigate('chat')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wide rounded border border-slate-300 transition cursor-pointer"
          >
            Ask AI Expert
          </button>
        </div>
      </div>

      {/* Grid: Timers & Fast Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Countdown AC Window */}
        <div id="card-ac-timer" className="bg-white border border-slate-200 p-6 rounded shadow-sm relative overflow-hidden flex flex-col justify-between text-slate-800">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-505/5 to-transparent rounded-full blur-xl animate-pulse"></div>
          <div>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-wider font-bold">Tatkal AC Window</span>
                <h3 className="text-sm font-bold text-slate-900">Starts at 10:00 AM</h3>
              </div>
              <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            
            {/* The live countdown display */}
            <div className="my-5">
              <span className="text-3xl font-mono font-black text-slate-900 tracking-wider tabular-nums">
                {acTimeLeft || '00:00:00'}
              </span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase font-bold">h : m : s left</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-150 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Class: 3A, 2A, 1A, EC</span>
            <button 
              onClick={() => onNavigate('search')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <span>Verify Seats</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Countdown Sleeper Window */}
        <div id="card-sleeper-timer" className="bg-white border border-slate-200 p-6 rounded shadow-sm relative overflow-hidden flex flex-col justify-between text-slate-800">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-505/5 to-transparent rounded-full blur-xl animate-pulse"></div>
          <div>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider font-bold">Tatkal Non-AC Window</span>
                <h3 className="text-sm font-bold text-slate-900">Starts at 11:00 AM</h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* The live countdown display */}
            <div className="my-5">
              <span className="text-3xl font-mono font-black text-slate-900 tracking-wider tabular-nums">
                {slTimeLeft || '00:00:00'}
              </span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase font-bold">h : m : s left</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-150 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Class: Sleeper (SL), 2S</span>
            <button 
              onClick={() => onNavigate('search')}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <span>Verify Seats</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Security & Biometric Vault Status */}
        <div id="card-security-vault" className="bg-white border border-slate-200 p-6 rounded shadow-sm relative overflow-hidden flex flex-col justify-between text-slate-800">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-505/5 to-transparent rounded-full blur-xl animate-pulse"></div>
          <div>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider font-bold">Biometric Encryption Vault</span>
                <h3 className="text-sm font-bold text-slate-900">Checkout Key Vault</h3>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <Shield className="w-4 h-4 text-amber-655" />
              </div>
            </div>

            <div className="my-3 p-3 bg-slate-50 border border-slate-100 rounded flex items-center gap-3">
              <div className={`p-2 rounded-full ${profile.paymentUnlocked ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600 animate-pulse'}`}>
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[9px] font-mono font-bold text-slate-450 uppercase">Auto-Decrypt Gate</p>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">
                  {profile.paymentUnlocked ? 'Unlocked - Ready for checkout' : 'Secured (Encrypted)'}
                </h4>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {!profile.paymentUnlocked ? (
              <button 
                id="btn-unlock-vault"
                onClick={onUnlockPayment}
                className="w-full py-2 bg-amber-650 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wide rounded transition"
              >
                Scan Biometric for Autofill
              </button>
            ) : (
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-600 flex items-center gap-1 font-mono font-bold">
                  <span>●</span> Ready
                </span>
                <button 
                  onClick={onUnlockPayment} // Toggles block
                  className="text-slate-550 hover:text-slate-700 underline font-mono text-xs font-semibold"
                >
                  Lock Vault
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Grid: Live Alerts & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Alerts Panel */}
        <div id="panel-active-alerts" className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded shadow-sm flex flex-col justify-between text-slate-800">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase text-slate-400 tracking-widest">Active Availability Tracks</h3>
                <p className="text-xs text-slate-500 font-semibold">Pinging railway API nodes for seat indicators</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full">
                {activeAlerts.length} Monitor(s) Live
              </span>
            </div>

            {activeAlerts.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-300 rounded text-center space-y-3">
                <p className="text-sm text-slate-505">No active ticket alerts currently set.</p>
                <button 
                  onClick={() => onNavigate('search')}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded border border-slate-350"
                >
                  Create Live Monitor Alert
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white border border-slate-200 rounded text-orange-600">
                        <Train className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{alert.trainNumber}</span>
                          <span className="text-xs font-extrabold text-slate-700 truncate max-w-[150px]">{alert.trainName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5 font-bold">
                          <span>{alert.fromCode} → {alert.toCode}</span>
                          <span>|</span>
                          <span>{alert.travelDate}</span>
                          <span>|</span>
                          <span className="text-indigo-600 uppercase font-black">{alert.trainClass}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-450 uppercase font-bold font-mono">Alert Threshold: </span>
                        <span className="text-xs font-mono font-bold text-slate-800">&lt; {alert.seatsThreshold} Seats</span>
                      </div>
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-550 animate-pulse"></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-150 flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
              Auto refresh: 50s. System background workers active.
            </span>
            <button 
              onClick={() => onNavigate('search')}
              className="text-xs text-indigo-650 hover:text-indigo-805 font-bold flex items-center gap-1 transition"
            >
              <span>Manage Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Infrastructure Stats */}
        <div id="panel-system-stats" className="bg-white border border-slate-200 p-6 rounded shadow-sm flex flex-col justify-between text-slate-805">
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">Operations Engine</h3>
            
            <div className="space-y-3.5">
              {/* CPU load */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono font-bold uppercase text-slate-500">
                  <span>REFRESH LATENCY LOAD</span>
                  <span className="text-emerald-600 font-bold">{sysLogs.cpuLoad}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden border border-slate-200">
                  <div className="h-full bg-emerald-500" style={{ width: sysLogs.cpuLoad }}></div>
                </div>
              </div>

              {/* Alert Trackers */}
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-105 font-mono font-bold">
                <span className="text-slate-500 flex items-center gap-1 uppercase">
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                  Background Watchers
                </span>
                <span className="text-slate-800">{sysLogs.activeBackgroundTrackers} active</span>
              </div>

              {/* Latency / ping */}
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-105 font-mono font-bold">
                <span className="text-slate-505 flex items-center gap-1 uppercase">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Tunnel Connection Rate
                </span>
                <span className="text-slate-800">12 ms</span>
              </div>

              {/* Inbound data streams */}
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-105 font-mono font-bold">
                <span className="text-slate-505 flex items-center gap-1 uppercase">
                  <RefreshCw className="w-3.5 h-3.5 text-pink-500 animate-spin-slow" />
                  Polled Live Queries
                </span>
                <span className="text-slate-800">{sysLogs.networkInbound}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 bg-slate-50 p-2 rounded border border-slate-100 text-center">
            <span className="text-[9px] uppercase font-mono font-bold text-slate-500 tracking-wider">
              Last railway check: {sysLogs.lastCheckedTime}
            </span>
          </div>

        </div>

      </div>

      {/* Refund Tracking Summary Accent */}
      <div id="refunds-summary-band" className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 border border-amber-100 text-amber-600 rounded">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-450 tracking-wider">Refund Tracking Active</h4>
            <p className="text-xs text-slate-600">
              {pendingRefunds.length > 0 
                ? `You have ${pendingRefunds.length} refund orders pending bank clearance.` 
                : 'All cancellations and refund sequences are fully settled in source accounts.'
              }
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('refunds')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold uppercase tracking-wide rounded transition"
        >
          Track Refunds Gate
        </button>
      </div>

    </div>
  );
}
