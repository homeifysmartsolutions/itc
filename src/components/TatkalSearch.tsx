import React, { useState, useEffect } from 'react';
import { 
  Search, Train, Bell, AlertTriangle, ArrowRight, Play, 
  HelpCircle, RefreshCw, Layers, CheckCircle2 
} from 'lucide-react';
import { TRAINS, STATIONS, getLiveSeatsAvailability } from '../data/trains';
import { TrainAvailabilityAlert, TrainClass, Quota } from '../types';

interface TatkalSearchProps {
  alerts: TrainAvailabilityAlert[];
  onAddAlert: (newAlert: Omit<TrainAvailabilityAlert, 'id' | 'createdAt' | 'isActive'>) => void;
  onDeleteAlert: (alertId: string) => void;
}

export default function TatkalSearch({ alerts, onAddAlert, onDeleteAlert }: TatkalSearchProps) {
  // Search parameters
  const [sourceCode, setSourceCode] = useState('HWH');
  const [destCode, setDestCode] = useState('NDLS');
  const [travelDate, setTravelDate] = useState('2026-06-12');
  const [selectedClass, setSelectedClass] = useState<TrainClass>('3A');
  const [selectedQuota, setSelectedQuota] = useState<Quota>('TQ');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Seat drain simulation variables
  const [simulateRush, setSimulateRush] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // New alert form state
  const [alertFormTrain, setAlertFormTrain] = useState<any | null>(null);
  const [alertThreshold, setAlertThreshold] = useState(10);
  const [successToast, setSuccessToast] = useState('');

  // Auto-run simulation time ticking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulateRush) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [simulateRush]);

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = TRAINS.filter(train => {
      // Station match
      const matchedRoute = train.fromCode === sourceCode && train.toCode === destCode;
      return matchedRoute;
    });

    setSearchResults(filtered);
    setHasSearched(true);
  };

  const handleCreateAlert = (train: any) => {
    onAddAlert({
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      fromCode: train.fromCode,
      toCode: train.toCode,
      travelDate: travelDate,
      trainClass: selectedClass,
      seatsThreshold: alertThreshold,
      triggerSound: true,
      triggerPush: true
    });

    setSuccessToast(`Alert tracker successfully configured for ${train.trainNumber}! Monitor is now active.`);
    setTimeout(() => setSuccessToast(''), 4000);
    setAlertFormTrain(null);
  };

  const handleSwapStations = () => {
    const temp = sourceCode;
    setSourceCode(destCode);
    setDestCode(temp);
  };

  return (
    <div className="space-y-6" id="search-tab">
      
      {/* Search Header Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-1">Verify Seat Openings & Alerts</h2>
        <p className="text-xs text-slate-550 font-semibold">Search train schedules, evaluate Tatkal seat statistics, and deploy background cancellation push alerts.</p>
      </div>

      {hasSearched && successToast && (
        <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Booking Search Form */}
      <div className="bg-white border border-slate-205 p-6 rounded shadow-sm text-slate-800">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* From Station */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">From Station</label>
              <select 
                value={sourceCode} 
                onChange={e => setSourceCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2.5 px-3 rounded text-xs font-semibold outline-none focus:border-blue-500"
              >
                {STATIONS.map(st => (
                  <option key={st.code} value={st.code}>{st.name}</option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pb-1">
              <button 
                type="button" 
                onClick={handleSwapStations}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 rounded transition"
                title="Swap stations"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* To Station */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">To Station</label>
              <select 
                value={destCode} 
                onChange={e => setDestCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2.5 px-3 rounded text-xs font-semibold outline-none focus:border-blue-500"
              >
                {STATIONS.map(st => (
                  <option key={st.code} value={st.code}>{st.name}</option>
                ))}
              </select>
            </div>

            {/* Travel Date */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Travel Date</label>
              <input 
                type="date" 
                value={travelDate} 
                onChange={e => setTravelDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-2.5 rounded text-xs font-semibold outline-none focus:border-blue-505"
              />
            </div>

            {/* Quota preference */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Quota Selection</label>
              <select 
                value={selectedQuota} 
                onChange={e => setSelectedQuota(e.target.value as Quota)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2.5 px-2 rounded text-xs font-semibold outline-none focus:border-blue-505"
              >
                <option value="TQ">Tatkal (TQ)</option>
                <option value="PT">Premium Tatkal (PT)</option>
                <option value="GN">General Quota (GN)</option>
                <option value="LD">Ladies Quota (LD)</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-1 space-y-1.5 flex items-end justify-end">
              <button 
                type="submit"
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded flex items-center justify-center transition shadow-sm cursor-pointer"
              >
                <Search className="w-4 h-4 mr-1" />
                <span>GO</span>
              </button>
            </div>

          </div>

          {/* Advanced options & simulated timers */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 gap-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-slate-450 font-bold uppercase tracking-wider">CLASS SELECTOR:</span>
              <div className="flex gap-1">
                {(['3A', '2A', '1A', 'SL', 'CC'] as TrainClass[]).map(tc => (
                  <button
                    key={tc}
                    type="button"
                    onClick={() => setSelectedClass(tc)}
                    className={`px-3 py-1 text-xs font-mono rounded transition border ${selectedClass === tc ? 'bg-blue-600 border-blue-550 text-white font-black' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                  >
                    {tc}
                  </button>
                ))}
              </div>
            </div>

            {/* Tatkal Drain simulator toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold">Stress Rush Simulator (10:00:00 AM Open):</span>
              <button
                type="button"
                onClick={() => setSimulateRush(!simulateRush)}
                className={`text-xs py-1.5 px-3 rounded font-mono font-bold border transition ${simulateRush ? 'bg-red-50 border-red-200 text-red-700 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
              >
                {simulateRush ? `LIVE DRAIN ACTIVE (${elapsedSeconds}s)` : 'STRESS SIMULATE'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Search results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-mono text-slate-505 font-bold uppercase tracking-wider">
              Available Train Connections ({searchResults.length})
            </h3>
            {simulateRush && (
              <p className="text-xs text-red-650 font-mono font-bold animate-pulse">
                ⚠ Simulated stress drain active. Rapid speed checkout required.
              </p>
            )}
          </div>

          {searchResults.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-205 rounded">
              <Train className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-bold">No rail connections scheduled on this station selection.</p>
              <p className="text-xs text-slate-450 mt-1">Staged Station Nodes currently supported: HWH (Howrah) & NDLS (New Delhi)</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map(train => {
                // Get dynamic seats count based on active simulation
                const avail = getLiveSeatsAvailability(
                  train.trainNumber,
                  selectedClass,
                  simulateRush,
                  elapsedSeconds
                );

                return (
                  <div key={train.trainNumber} className="bg-white border border-slate-200 p-5 rounded hover:border-slate-350 transition flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm text-slate-800">
                    
                    {/* Schedule block */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 border border-slate-200 text-slate-700 rounded">
                          {train.trainNumber}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900">{train.trainName}</h4>
                      </div>

                      <div className="flex items-center gap-4 text-slate-750 font-mono text-xs">
                        <div>
                          <p className="text-[9px] text-slate-450 font-bold uppercase">DEP TIME</p>
                          <p className="text-sm font-black text-slate-900 leading-snug">{train.departureTime}</p>
                          <p className="text-[10px] text-slate-505 font-bold truncate max-w-[120px]">{train.fromName}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-455 font-bold uppercase">{train.duration}</span>
                          <span className="text-slate-400 px-3 py-[1px] border-t border-slate-200 font-sans text-[9px] font-bold">Direct</span>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-450 font-bold uppercase">ARR TIME</p>
                          <p className="text-sm font-black text-slate-900 leading-snug">{train.arrivalTime}</p>
                          <p className="text-[10px] text-slate-505 font-bold truncate max-w-[120px]">{train.toName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Seat status, probability & Action block */}
                    <div className="flex flex-wrap items-center md:justify-end gap-6 md:w-2/5">
                      
                      {/* Availability status */}
                      <div className="p-3 bg-slate-53 border border-slate-200 rounded space-y-1 w-34 flex-shrink-0">
                        <span className="text-[9px] uppercase text-slate-450 font-mono font-bold block">CLASS: {selectedClass}</span>
                        <div>
                          {avail.status === 'AVAILABLE' ? (
                            <div className="text-xs font-mono font-black text-green-700 uppercase">
                              AVAILABLE • {avail.seats}
                            </div>
                          ) : avail.status === 'WL' ? (
                            <div className="text-xs font-black text-amber-600 font-mono uppercase">
                              WL #{avail.waitlist}
                            </div>
                          ) : (
                            <div className="text-xs font-black text-red-650 font-mono uppercase">
                              REGRET / WL
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Confirmation probability */}
                      <div className="space-y-1 flex-shrink-0 w-28">
                        <span className="text-[9px] uppercase text-slate-450 font-mono font-bold block">PROBABILITY</span>
                        <div>
                          <span className={`text-xs font-bold leading-none ${
                            avail.probability > 75 
                              ? 'text-green-700' 
                              : avail.probability > 40 
                                ? 'text-amber-600' 
                                : 'text-red-655'
                          }`}>
                            {avail.probability}% Success
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className={`h-full ${
                              avail.probability > 75 
                                ? 'bg-green-600' 
                                : avail.probability > 40 
                                  ? 'bg-amber-500' 
                                  : 'bg-red-550'
                            }`}
                            style={{ width: `${avail.probability}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Launch alert configure modal / Trigger Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => setAlertFormTrain(train)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold uppercase rounded flex items-center gap-1.5 transition"
                        >
                          <Bell className="w-4 h-4 text-indigo-650" />
                          <span>Monitor Route</span>
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Set alert details block */}
      {alertFormTrain && (
        <div id="modal-alert-setup" className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 p-6 rounded shadow-2xl max-w-md w-full space-y-6 text-slate-800">
            <div className="space-y-1.5">
              <h3 className="text-xs font-mono text-slate-450 font-bold uppercase tracking-widest">Deploy Route Monitor</h3>
              <p className="text-base font-extrabold text-slate-900 leading-snug">
                {alertFormTrain.trainNumber} • {alertFormTrain.trainName}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-mono font-bold uppercase block">ALERT THRESHOLD (SEATS)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={alertThreshold}
                    onChange={e => setAlertThreshold(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm font-mono font-bold text-slate-850 w-12 text-center bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {alertThreshold}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  Triggers push messages instantly when seat availability drops below custom trigger limit.
                </p>
              </div>

              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-550">Trigger Sound Buzzer?</span>
                  <span className="text-green-700">YES</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-550">Send Push Message Notification?</span>
                  <span className="text-green-700">YES</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setAlertFormTrain(null)}
                className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase rounded border border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateAlert(alertFormTrain)}
                className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wide rounded shadow"
              >
                Deploy Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Active Overview Section */}
      {alerts.length > 0 && (
        <div className="bg-white border border-slate-200 p-6 rounded shadow-sm text-slate-800 space-y-4">
          <h3 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Active Watch Configurations ({alerts.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map(al => (
              <div key={al.id} className="p-3 bg-slate-50 border border-slate-250 rounded flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900">{al.trainNumber}</span>
                    <span className="text-xs text-slate-600 font-bold truncate max-w-[120px]">{al.trainName}</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 font-bold mt-0.5">
                    {al.fromCode} → {al.toCode} | {al.trainClass} | Limit: &lt;{al.seatsThreshold}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-green-700 font-bold font-mono">Active</span>
                  <button
                    onClick={() => onDeleteAlert(al.id)}
                    className="text-slate-400 hover:text-red-650 p-1 bg-white border border-slate-200 rounded text-[10px] font-bold uppercase hover:bg-red-50 hover:border-red-100 transition"
                    title="Remove Tracker"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
