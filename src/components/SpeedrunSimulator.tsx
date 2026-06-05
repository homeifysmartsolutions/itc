import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Train, Timer, RefreshCw, CheckCircle2, Play, 
  HelpCircle, Zap, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { AutofillProfile } from '../types';

interface SpeedrunSimulatorProps {
  profile: AutofillProfile;
}

export default function SpeedrunSimulator({ profile }: SpeedrunSimulatorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [captchaText, setCaptchaText] = useState('7R3A9');
  
  // Simulated form states representing IRCTC passenger sheet
  const [passengerForms, setPassengerForms] = useState([
    { name: '', age: '', gender: 'M', berth: 'NONE' },
    { name: '', age: '', gender: 'M', berth: 'NONE' }
  ]);
  const [captchaInput, setCaptchaInput] = useState('');
  const [paymentUpi, setPaymentUpi] = useState('');
  
  // Outcome state
  const [submissionCompleted, setSubmissionCompleted] = useState(false);
  const [benchmarkRecord, setBenchmarkRecord] = useState<{
    totalTime: number;
    status: 'CNF' | 'WL' | 'REGRET';
    msg: string;
    speedRating: string;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Generate random Captcha strings
  const rollCaptcha = () => {
    const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  // Reset forms for clean speed trial
  const startTrial = () => {
    setIsPlaying(true);
    setSubmissionCompleted(false);
    setBenchmarkRecord(null);
    setCaptchaInput('');
    setPaymentUpi('');
    setPassengerForms([
      { name: '', age: '', gender: 'M', berth: 'NONE' },
      { name: '', age: '', gender: 'M', berth: 'NONE' }
    ]);
    rollCaptcha();

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - startTimeRef.current) / 1000);
    }, 50);
  };

  // Run simulated Autofill injection from saved Master Profile values
  const triggerSpeedrunAutofill = () => {
    if (!isPlaying) return;

    // Map profile passengers, filling up to length of forms, or resizing forms to fit profile size!
    const updated = passengerForms.map((f, idx) => {
      const pData = profile.passengers[idx];
      if (pData) {
        return {
          name: pData.name,
          age: String(pData.age),
          gender: pData.gender,
          berth: pData.berthPreference
        };
      }
      return f;
    });

    setPassengerForms(updated);
    
    // Fill payment fields if present and unlocked:
    if (profile.upiAddress) {
      setPaymentUpi(profile.upiAddress);
    }
  };

  // Handle final checkout attempt
  const handleCheckoutSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPlaying) return;

    // Validate captcha correctness first
    if (captchaInput.toUpperCase() !== captchaText) {
      alert("Invalid Captcha string match! Re-read the captcha. In Tatkal, failed captchas ruin bookings!");
      rollCaptcha();
      setCaptchaInput('');
      return;
    }

    // Stop clock
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setSubmissionCompleted(true);

    const totalSecs = Number(elapsed.toFixed(2));
    
    // Seat success thresholds (tatkal sells out within 15 seconds)
    let outcomeStatus: 'CNF' | 'WL' | 'REGRET' = 'REGRET';
    let remark = '';
    let rating = 'Slow';

    if (totalSecs <= 8) {
      outcomeStatus = 'CNF';
      remark = "Incredible! Pro-level automation booking speeds. You booked your confirmed AC seat before general public loads are initiated.";
      rating = 'Lightning Speed (Elite)';
    } else if (totalSecs <= 16) {
      outcomeStatus = 'CNF';
      remark = "Confirmed ticket secured! Using Autofill profiles effectively saved valuable seconds against bulk bookings.";
      rating = 'Automated Average (Fast)';
    } else if (totalSecs <= 26) {
      outcomeStatus = 'WL';
      remark = "Seats already packed. Shifted into Tatkal waitlist pool. Automated quick checkout bookmarklet could shave off an extra 10 seconds.";
      rating = 'Manual Average (Moderate)';
    } else {
      outcomeStatus = 'REGRET';
      remark = "Booking closed. Regret / Sold out class. Manual text entry was too slow to secure a position in the queue.";
      rating = 'Manual Typist (Slow)';
    }

    setBenchmarkRecord({
      totalTime: totalSecs,
      status: outcomeStatus,
      msg: remark,
      speedRating: rating
    });
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6" id="practice-tab">
      
      {/* Overview Block */}
      <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-slate-800">
        <div className="space-y-1 my-1.5 flex-1">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Timer className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span>Tatkal Speedrun Practice Arena</span>
          </h2>
          <p className="text-xs text-slate-550 font-semibold leading-relaxed">
            Automating Tatkal is all about speed math. Benchmark your booking checkout latency. Practice manual entering vs loading our rapid autofill profiles!
          </p>
        </div>

        {!isPlaying ? (
          <button
            onClick={startTrial}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Practice Trial</span>
          </button>
        ) : (
          <div className="px-5 py-2 bg-orange-50 border border-orange-200 text-orange-900 rounded flex items-center gap-3 font-mono">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-605"></span>
            </span>
            <span className="text-[10px] text-orange-800 font-mono font-bold">ELAPSED TIME:</span>
            <span className="text-xl font-mono font-black text-orange-950 tabular-nums">{elapsed.toFixed(1)}s</span>
          </div>
        )}
      </div>

      {benchmarkRecord && (
        <div className={`p-6 border rounded grid grid-cols-1 md:grid-cols-4 gap-6 items-center animate-fade-in ${
          benchmarkRecord.status === 'CNF' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : benchmarkRecord.status === 'WL' 
              ? 'bg-amber-50 border-amber-205 text-amber-800' 
              : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="text-center md:border-r md:border-slate-200">
            <p className="text-[10px] text-slate-500 font-mono uppercase font-bold">BENCHMARK TIME</p>
            <h4 className="text-4xl font-mono font-black text-slate-900 my-1">{benchmarkRecord.totalTime}s</h4>
            <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded ${
              benchmarkRecord.status === 'CNF' 
                ? 'bg-green-150 text-green-700 border border-green-200' 
                : benchmarkRecord.status === 'WL' 
                  ? 'bg-amber-150 text-amber-700 border border-amber-200' 
                  : 'bg-red-150 text-red-700 border border-red-200'
            }`}>
              {benchmarkRecord.status} STATUS
            </span>
          </div>

          <div className="md:col-span-2 space-y-1 text-slate-800">
            <h5 className="text-sm font-black text-slate-900">Speed Assessment: {benchmarkRecord.speedRating}</h5>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{benchmarkRecord.msg}</p>
          </div>

          <div className="text-center">
            <button 
              onClick={startTrial}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase rounded border border-slate-300 transition"
            >
              Retry Speed Test
            </button>
          </div>
        </div>
      )}

      {/* Simulator Sandbox Container */}
      <div className={`relative ${!isPlaying ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* Floating Autofill Shortcut Tooltip bar */}
        {isPlaying && (
          <div className="absolute -top-4 right-6 bg-orange-600 hover:bg-orange-705 text-white text-[10px] font-black py-2 px-4 rounded-full flex items-center gap-2 shadow-sm animate-bounce cursor-pointer z-10"
            onClick={triggerSpeedrunAutofill}
          >
            <Zap className="w-4 h-4 text-orange-200 fill-current" />
            <span>RUN AUTOFILL PROFILE INSTANTLY</span>
          </div>
        )}

        {/* Mock IRCTC form container */}
        <div className="bg-white border border-slate-200 p-6 rounded shadow-sm text-slate-800 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-150">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 font-bold font-mono uppercase tracking-wider rounded">
                IRCTC Port Checkout Mock
              </span>
              <span className="text-slate-300 text-xs font-mono">|</span>
              <span className="text-slate-600 text-xs font-mono font-bold">Passenger Details Setup Page</span>
            </div>

            <button
              onClick={triggerSpeedrunAutofill}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold uppercase rounded transition"
            >
              Trigger Autofill Injector
            </button>
          </div>

          <form onSubmit={handleCheckoutSubmission} className="space-y-6">
            
            {/* Passenger forms */}
            <div className="space-y-4">
              {passengerForms.map((form, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  
                  <div className="sm:col-span-6 space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">PASSENGER NAME #{idx+1}</label>
                    <input 
                      type="text" 
                      placeholder="Enter Full Name" 
                      value={form.name}
                      onChange={e => {
                        const copy = [...passengerForms];
                        copy[idx].name = e.target.value;
                        setPassengerForms(copy);
                       }}
                      required
                      className="w-full bg-white border border-slate-200 text-slate-800 py-2 px-3 text-xs font-semibold rounded focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">AGE</label>
                    <input 
                      type="number" 
                      placeholder="Age" 
                      value={form.age}
                      onChange={e => {
                        const copy = [...passengerForms];
                        copy[idx].age = e.target.value;
                        setPassengerForms(copy);
                      }}
                      required
                      className="w-full bg-white border border-slate-200 text-slate-800 py-2 px-3 text-xs font-semibold rounded focus:border-blue-500 outline-none font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">GENDER</label>
                    <select
                      value={form.gender}
                      onChange={e => {
                        const copy = [...passengerForms];
                        copy[idx].gender = e.target.value;
                        setPassengerForms(copy);
                      }}
                      className="w-full bg-white border border-slate-200 text-slate-800 py-2 px-2 text-xs font-semibold rounded focus:border-blue-500 outline-none"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">BERTH PREFERENCE</label>
                    <select
                      value={form.berth}
                      onChange={e => {
                        const copy = [...passengerForms];
                        copy[idx].berth = e.target.value;
                        setPassengerForms(copy);
                      }}
                      className="w-full bg-white border border-slate-200 text-slate-800 py-2 px-2 text-xs font-semibold rounded focus:border-blue-500 outline-none"
                    >
                      <option value="NONE">No preference</option>
                      <option value="LB">Lower Berth</option>
                      <option value="UB">Upper Berth</option>
                    </select>
                  </div>

                </div>
              ))}
            </div>

            {/* Captcha & payment row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-150">
              
              {/* High precision IRCTC standard Captcha screen */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-550 font-mono font-bold block uppercase">SECURITY CALC (CAPTCHA)</label>
                  
                  {/* Styled mock Captcha board */}
                  <div className="flex items-center gap-3">
                    <div className="py-2.5 px-6 bg-emerald-50 border border-emerald-100 rounded text-xl text-emerald-805 font-mono tracking-widest font-black select-none italic line-through shadow-inner">
                      {captchaText}
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={rollCaptcha}
                      className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-600 rounded transition"
                      title="Reload Captcha"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <label className="text-[10px] text-slate-500 font-mono font-bold uppercase block">TYPE CODE ABOVE</label>
                  <input 
                    type="text" 
                    placeholder="Enter Code" 
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 text-slate-800 py-2 px-3 text-sm font-semibold rounded focus:border-blue-550 outline-none uppercase font-mono font-bold"
                  />
                </div>
              </div>

              {/* Instant payment setup */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                <label className="text-[10px] text-slate-500 font-mono font-bold block uppercase">UPI ADRESS PAY-OUT METHOD</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="name@ybl, name@oksbi" 
                    value={paymentUpi}
                    onChange={e => setPaymentUpi(e.target.value)}
                    required
                    className="flex-1 bg-white border border-slate-200 text-slate-800 py-2 px-3 text-xs font-mono font-semibold rounded focus:border-blue-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  Using biometric encrypted autofill pulls payment gateways instantly without manual card numbers entry.
                </p>
              </div>

            </div>

            {/* Submit Block */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-150">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Practice Simulator safe transaction probe</span>
              </div>

              <button 
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded transition cursor-pointer shadow-sm"
              >
                Submit Decrypt & Book Seat
              </button>
            </div>

          </form>

        </div>

      </div>

      {!isPlaying && !benchmarkRecord && (
        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 text-slate-600 text-xs text-center justify-center rounded">
          <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 animate-bounce" />
          <span>Click the "Start Practice Trial" button above to spin up the speed clock! Setup your passenger profiles before starting the simulator.</span>
        </div>
      )}

    </div>
  );
}
