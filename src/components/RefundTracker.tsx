import React, { useState } from 'react';
import { 
  History, RotateCcw, Search, CheckCircle2, AlertCircle, Clock, 
  ArrowRight, ShieldCheck, ChevronRight, HelpCircle 
} from 'lucide-react';
import { BookingHistory, RefundRecord } from '../types';

interface RefundTrackerProps {
  bookings: BookingHistory[];
  refunds: RefundRecord[];
}

export default function RefundTracker({ bookings, refunds }: RefundTrackerProps) {
  const [searchPnrs, setSearchPnr] = useState('');
  const [queriedRefund, setQueriedRefund] = useState<RefundRecord | null>(null);
  const [searchError, setSearchError] = useState('');

  // Handle local refund query
  const handleQueryRefund = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setQueriedRefund(null);

    const clean = searchPnrs.trim();
    if (!clean) return;

    // Search existing records
    const found = refunds.find(r => r.pnr === clean || r.id === clean || r.refundTxId === clean);
    
    if (found) {
      setQueriedRefund(found);
    } else {
      // Generate a dynamic mock refund stage if they type a realistic 10-digit numeric string to make search robust!
      if (/^\r?\n?\d{10}$/.test(clean)) {
        const generated: RefundRecord = {
          id: `REF-${Math.floor(Math.random() * 90000) + 10000}`,
          bookingId: `BKG-${Math.floor(Math.random() * 9000) + 1000}`,
          pnr: clean,
          trainNumber: '12951',
          trainName: 'Mumbai Rajdhani Express',
          cancelledDate: '2026-06-04',
          refundAmount: 2480,
          status: 'PROCESSING_IRCTC',
          refundTxId: `TXN-IRCTC${Math.floor(Math.random() * 900000000) + 100000000}`,
          bankRef: 'BKN-UNCONFIRMED',
          timeline: [
            {
              title: 'Cancellation Confirmed',
              description: 'Ticket cancelled. Release seat back to General/Tatkal pools.',
              timestamp: '2026-06-04 10:45:00',
              status: 'completed'
            },
            {
              title: 'Refund Approved by IRCTC',
              description: 'Refund claim approved on Transaction ledger. Amount calculated: ₹2480.',
              timestamp: '2026-06-05 09:30:00',
              status: 'current'
            },
            {
              title: 'Disbursed to CONCOR Gateway',
              description: 'Awaiting handoff code to destination bank servers.',
              timestamp: 'Awaiting clearance',
              status: 'pending'
            },
            {
              title: 'Settled to Source Bank',
              description: 'Awaiting Bank settlement confirmations.',
              timestamp: 'Awaiting settlement',
              status: 'pending'
            }
          ]
        };
        setQueriedRefund(generated);
      } else {
        setSearchError('No active refund transactions found. Ensure you provided a valid 10-digit PNR value.');
      }
    }
  };  const getStatusBadge = (status: RefundRecord['status']) => {
    switch (status) {
      case 'SETTLED':
        return <span className="bg-green-50 text-green-700 text-[10px] font-black px-2 py-0.5 rounded border border-green-200 uppercase">SETTLED</span>;
      case 'BANK_ROUTING':
        return <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded border border-blue-200 uppercase">SENT TO BANK</span>;
      case 'PROCESSING_IRCTC':
        return <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded border border-amber-200 uppercase">PROCESSING</span>;
      case 'INITIATED':
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded border border-slate-200 uppercase">INITIATED</span>;
      default:
        return <span className="bg-red-50 text-red-700 text-[10px] font-black px-2 py-0.5 rounded border border-red-200 uppercase">FAILED</span>;
    }
  };

  return (
    <div className="space-y-6" id="refund-tab">
      
      {/* Title block */}
      <div className="bg-white border border-slate-200 p-5 rounded shadow-sm text-slate-800">
        <h2 className="text-lg font-black text-slate-950 mb-1">Cancellations & Refund Tracker</h2>
        <p className="text-xs text-slate-550 font-semibold">Track cancellation settlements and trace electronic clearing bank routing timelines.</p>
      </div>

      {/* Grid: Search query + main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Refund Ledger Cards + Search form */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Diagnostic PNR Search form */}
          <div className="bg-white border border-slate-200 p-5 rounded shadow-sm space-y-4">
            <h3 className="text-xs font-mono text-slate-500 font-bold uppercase">PNR Query Board</h3>
            
            <form onSubmit={handleQueryRefund} className="space-y-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter 10-digit PNR / REF ID" 
                  value={searchPnrs} 
                  onChange={e => setSearchPnr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 text-slate-800 py-2 pl-3 pr-10 rounded text-xs font-mono font-bold focus:bg-white focus:border-blue-500 outline-none"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-800 transition cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              
              {searchError && (
                <p className="text-[10px] text-red-700 font-bold font-mono leading-tight bg-red-50 p-2.5 rounded border border-red-150">
                  ⚠ {searchError}
                </p>
              )}

              <p className="text-[10px] text-slate-500 font-mono font-bold">
                Hint: Search cancelled PNR "1240982541" to trace a completed refund.
              </p>
            </form>
          </div>

          {/* List of active refunds in storage */}
          <div className="bg-white border border-slate-200 p-5 rounded shadow-sm space-y-4">
            <h3 className="text-xs font-mono text-slate-550 font-bold uppercase">Recent Cancellations</h3>
            
            <div className="space-y-3 font-sans">
              {refunds.map(ref => (
                <div 
                  key={ref.id}
                  onClick={() => setQueriedRefund(ref)}
                  className={`p-3 rounded border transition text-left cursor-pointer ${
                    queriedRefund?.id === ref.id 
                      ? 'bg-blue-50/70 border-blue-300 shadow-sm' 
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-350'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-900">{ref.pnr}</h4>
                      <p className="text-[10px] text-slate-600 font-semibold truncate max-w-[150px]">{ref.trainName}</p>
                    </div>
                    {getStatusBadge(ref.status)}
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-550 font-mono font-bold mt-2 pt-2 border-t border-slate-200/60">
                    <span>Refund: ₹{ref.refundAmount}</span>
                    <span>Date: {ref.cancelledDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Stepper Timeline detail */}
        <div className="lg:col-span-2 space-y-6">
          {queriedRefund ? (
            <div className="bg-white border border-slate-200 p-6 rounded shadow-sm space-y-6 animate-fade-in text-slate-800" id="panel-refund-stepper">
              
              {/* Header metrics */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 header">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-indigo-650 uppercase font-black">Ref Ledger: {queriedRefund.id}</span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-950">PNR {queriedRefund.pnr}</h3>
                    {getStatusBadge(queriedRefund.status)}
                  </div>
                  <p className="text-xs text-slate-550 font-mono font-bold">{queriedRefund.trainNumber} - {queriedRefund.trainName}</p>
                </div>

                <div className="bg-slate-50 px-4 py-2 rounded border border-slate-200 text-right">
                  <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">ESTIMATED REFUND SUM</span>
                  <h4 className="text-lg font-mono font-black text-slate-900">₹{queriedRefund.refundAmount}</h4>
                </div>
              </div>

              {/* Progress Timeline steppers */}
              <div className="space-y-6 font-sans">
                <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Gateway Clearance Trail</h4>
                
                <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 ml-3">
                  {queriedRefund.timeline.map((stage, idx) => (
                    <div key={idx} className="relative">
                      {/* Interactive dot */}
                      <span className={`absolute -left-[31px] top-1 flex h-4.5 w-4.5 rounded-full border-2 items-center justify-center ${
                        stage.status === 'completed'
                          ? 'bg-green-600 border-green-500 text-white'
                          : stage.status === 'current'
                            ? 'bg-white border-blue-500 text-blue-500 animate-pulse'
                            : 'bg-white border-slate-300'
                      }`}>
                        {stage.status === 'completed' && <span className="h-1.5 w-1.5 bg-white rounded-full"></span>}
                        {stage.status === 'current' && <span className="h-1.5 w-1.5 bg-blue-550 rounded-full"></span>}
                      </span>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <h5 className={`text-sm font-bold ${
                            stage.status === 'completed' 
                              ? 'text-slate-800' 
                              : stage.status === 'current' 
                                ? 'text-blue-650 font-extrabold' 
                                : 'text-slate-400'
                          }`}>
                            {stage.title}
                          </h5>
                          <span className="text-[10px] font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
                            {stage.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-555 font-medium leading-relaxed max-w-xl">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security parameters info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-200 text-xs font-mono text-slate-700">
                <div className="space-y-1">
                  <span className="text-slate-550 uppercase block text-[9px] font-bold">IRCTC Settlement Ledger Code</span>
                  <span className="text-slate-800 font-bold select-all">{queriedRefund.refundTxId}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-550 uppercase block text-[9px] font-bold">Acquiring Bank Settlement Ref</span>
                  <span className="text-slate-800 font-bold select-all">{queriedRefund.bankRef}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-205 p-12 rounded shadow-sm text-center space-y-3">
              <RotateCcw className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-sm font-black text-slate-500">No Target Refund Selected</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-semibold">
                Choose a cancelled ticket on the left menu, or query via a valid PNR number to open the financial clearing details board.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Booking History ledger Section */}
      <div className="bg-white border border-slate-200 p-6 rounded shadow-sm space-y-4 text-slate-850">
        <h3 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wide">Personal Ticket Booking History</h3>
        
        <div className="overflow-x-auto pr-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono font-bold text-[10px]">
                <th className="py-3 px-2">Train</th>
                <th className="py-3 px-2">PNR</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Class</th>
                <th className="py-3 px-2">Passengers</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Fare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-705">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-2 font-semibold">
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 text-slate-655 font-mono font-bold rounded mr-1.5">{b.trainNumber}</span>
                    {b.trainName}
                  </td>
                  <td className="py-3 px-2 font-mono text-slate-800 font-bold">{b.pnr}</td>
                  <td className="py-3 px-2 font-semibold">{b.journeyDate}</td>
                  <td className="py-3 px-2 font-mono text-indigo-650 font-black">{b.trainClass}</td>
                  <td className="py-3 px-2 truncate max-w-[150px] font-semibold">{b.passengers.join(', ')}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${
                      b.status === 'CNF' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : b.status === 'CAN' 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-slate-900 font-black">₹{b.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
