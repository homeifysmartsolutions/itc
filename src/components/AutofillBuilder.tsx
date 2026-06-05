import React, { useState } from 'react';
import { 
  UserCheck, CreditCard, Lock, Unlock, Fingerprint, Plus, Trash2, 
  HelpCircle, Copy, CheckCircle2, ShieldAlert, Sparkles, Code 
} from 'lucide-react';
import { AutofillProfile, Passenger, TrainClass, Quota } from '../types';

interface AutofillBuilderProps {
  profile: AutofillProfile;
  onUpdateProfile: (updated: AutofillProfile) => void;
  onUnlockPayment: () => void;
}

export default function AutofillBuilder({ 
  profile, 
  onUpdateProfile, 
  onUnlockPayment 
}: AutofillBuilderProps) {
  
  // Passenger Form State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | ''>('');
  const [newGender, setNewGender] = useState<'M' | 'F' | 'T'>('M');
  const [newBerth, setNewBerth] = useState<'NONE' | 'LB' | 'MB' | 'UB' | 'SL' | 'SU'>('NONE');
  const [newFood, setNewFood] = useState<'V' | 'N' | 'D'>('V');

  // Payment Form Input States
  const [upiVal, setUpiVal] = useState(profile.upiAddress || '');
  const [cardNo, setCardNo] = useState('4532 9081 2471 0984');
  const [cardExpiry, setCardExpiry] = useState('11/29');

  // Component local helpers
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [copiedScript, setCopiedScript] = useState(false);

  // Add passenger to state list
  const handleAddPassenger = () => {
    if (!newName || !newAge) return;
    
    const passenger: Passenger = {
      id: Math.random().toString(36).substring(2, 9),
      name: newName,
      age: Number(newAge),
      gender: newGender,
      berthPreference: newBerth,
      foodChoice: newFood
    };

    onUpdateProfile({
      ...profile,
      passengers: [...profile.passengers, passenger]
    });

    // Reset passenger inputs
    setNewName('');
    setNewAge('');
    setNewBerth('NONE');
  };

  // Remove passenger
  const handleRemovePassenger = (id: string) => {
    onUpdateProfile({
      ...profile,
      passengers: profile.passengers.filter(p => p.id !== id)
    });
  };

  // Save full profile preferences
  const handleSavePreferences = (updates: Partial<AutofillProfile>) => {
    onUpdateProfile({
      ...profile,
      ...updates
    });
  };

  // Bio-authentication flow simulator
  const triggerBiometricScan = () => {
    setIsBiometricScanning(true);
    setScanStatus('scanning');
    
    // Simulate scanner latency
    setTimeout(() => {
      // 90% scan success probability
      if (Math.random() < 0.95) {
        setScanStatus('success');
        setTimeout(() => {
          onUpdateProfile({
            ...profile,
            paymentUnlocked: true,
            upiAddress: upiVal
          });
          setIsBiometricScanning(false);
          setScanStatus('idle');
        }, 1200);
      } else {
        setScanStatus('failed');
        setTimeout(() => {
          setScanStatus('idle');
        }, 2000);
      }
    }, 2000);
  };

  const handleLockVault = () => {
    onUpdateProfile({
      ...profile,
      paymentUnlocked: false
    });
  };

  // Compiles state details into an actual, functional Javascript autofill bookmarket!
  const generateAutofillBookmarklet = () => {
    const passengersPayload = JSON.stringify(profile.passengers.map(p => ({
      name: p.name,
      age: p.age,
      gender: p.gender,
      berth: p.berthPreference,
      food: p.foodChoice
    })));

    const upiPayload = profile.upiAddress || '';

    // The actual functional bookmarklet code
    const rawJS = `(function(){
      const passengers = ${passengersPayload};
      const upi = "${upiPayload}";
      console.log("Tatkal Express Autofiller Initiated!");
      
      // Select standard passenger fields inside IRCTC booking DOM structure
      passengers.forEach((p, idx) => {
        const row = idx + 1;
        const nameInput = document.querySelector("#passenger-row-" + row + " .psg-name") || document.querySelector("input[placeholder='Passenger " + row + " Name']");
        const ageInput = document.querySelector("#passenger-row-" + row + " .psg-age") || document.querySelector("input[placeholder='Passenger " + row + " Age']");
        const genderSelect = document.querySelector("#passenger-row-" + row + " select.psg-gender");
        const berthSelect = document.querySelector("#passenger-row-" + row + " select.psg-berth");
        
        if (nameInput) nameInput.value = p.name;
        if (ageInput) ageInput.value = p.age;
        if (genderSelect) genderSelect.value = p.gender;
        if (berthSelect && p.berth !== 'NONE') berthSelect.value = p.berth;
        
        // Trigger React input dispatch events in modern IRCTC Angular/React apps
        [nameInput, ageInput].forEach(inp => {
          if (inp) {
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            inp.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });

      // Inject UPI details if present inside payment methods code
      if (upi) {
        const upiField = document.querySelector("input[placeholder='Enter UPI Virtual Address']") || document.querySelector("#upi-id-field");
        if (upiField) {
          upiField.value = upi;
          upiField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
      
      alert("Tatkal Express: Filled " + passengers.length + " passengers and payment metrics instantly!");
    })()`;

    // Wrap in javascript schematics uri
    return `javascript:${encodeURIComponent(rawJS)}`;
  };

  const handleCopyScript = () => {
    const script = generateAutofillBookmarklet();
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="space-y-6" id="autofill-tab">
      
      {/* Introduction Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
        <div className="max-w-2xl space-y-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-orange-500" />
            <span>Passenger Details & Automation Vault</span>
          </h2>
          <p className="text-sm text-slate-400">
            For rapid tatkal checkouts, details must load instantly. Pre-save passengers here securely in local application memory and download the instant browser script.
          </p>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Master Passenger List Editor */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-850">
            <h3 className="text-sm font-mono text-slate-400 uppercase">Master Passenger List</h3>
            <span className="text-xs text-slate-500 font-mono">Max 4 passengers for Tatkal</span>
          </div>

          {/* Passenger Add Input Form */}
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 bg-slate-950 p-4 border border-slate-850 rounded-xl">
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[10px] text-slate-500 font-mono">PASSENGER NAME</label>
              <input 
                type="text" 
                placeholder="As printed in ID" 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 py-2 px-3 text-sm rounded-lg focus:border-orange-500 outline-none font-sans"
              />
            </div>

            <div className="sm:col-span-1 space-y-1">
              <label className="text-[10px] text-slate-500 font-mono">AGE</label>
              <input 
                type="number" 
                placeholder="Age" 
                value={newAge} 
                onChange={e => setNewAge(e.target.value !== '' ? Number(e.target.value) : '')}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 py-2 px-3 text-sm rounded-lg focus:border-orange-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-500 font-mono">GENDER</label>
              <select 
                value={newGender} 
                onChange={e => setNewGender(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-300 py-2 px-2 text-sm rounded-lg focus:border-orange-500 outline-none"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="T">Transgender</option>
              </select>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-[10px] text-slate-500 font-mono">BERTH CHOICE</label>
              <select 
                value={newBerth} 
                onChange={e => setNewBerth(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-300 py-2 px-2 text-sm rounded-lg focus:border-orange-500 outline-none"
              >
                <option value="NONE">No Berth Preference</option>
                <option value="LB">Lower berth (LB)</option>
                <option value="MB">Middle berth (MB)</option>
                <option value="UB">Upper berth (UB)</option>
                <option value="SL">Side Lower (SL)</option>
                <option value="SU">Side Upper (SU)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-500 font-mono">MEAL CHOICE</label>
              <select 
                value={newFood} 
                onChange={e => setNewFood(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-300 py-2 px-2 text-sm rounded-lg focus:border-orange-500 outline-none"
              >
                <option value="V">Vegetarian (Veg)</option>
                <option value="N">Non-Vegetarian</option>
                <option value="D">No Food Services</option>
              </select>
            </div>

            {/* Submit passenger */}
            <div className="sm:col-span-1 flex items-end">
              <button 
                type="button"
                onClick={handleAddPassenger}
                disabled={profile.passengers.length >= 4}
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-lg transition text-xs flex justify-center items-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Render List */}
          <div className="space-y-3">
            {profile.passengers.length === 0 ? (
              <div className="p-8 bg-slate-950/40 border border-slate-850 rounded-xl text-center space-y-2">
                <p className="text-sm text-slate-500">Currently no pre-saved passengers inside Master Details.</p>
                <p className="text-xs text-slate-600 font-mono">Fill out the console above to add passenger details.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {profile.passengers.map((p, idx) => (
                  <div key={p.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">#{idx+1}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{p.name}</h4>
                          <span className="text-[10px] bg-slate-800 border border-slate-700 font-mono px-1.5 py-[1px] text-slate-300 rounded">
                            {p.gender} | {p.age} Yrs
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          Berth: <span className="text-indigo-400">{p.berthPreference}</span> | Food: {p.foodChoice === 'V' ? 'Veg' : 'Non-Veg'}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRemovePassenger(p.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Preferences Options */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-850">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">Class Preference</label>
              <select
                value={profile.preferredClass}
                onChange={e => handleSavePreferences({ preferredClass: e.target.value as TrainClass })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 py-2.5 px-3 rounded-lg text-sm"
              >
                <option value="3A">3AC sleeper (3A)</option>
                <option value="2A">2AC sleeper (2A)</option>
                <option value="1A">First AC (1A)</option>
                <option value="SL">Sleeper Class (SL)</option>
                <option value="CC">AC Chair Car (CC)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">Quota Preference</label>
              <select
                value={profile.preferredQuota}
                onChange={e => handleSavePreferences({ preferredQuota: e.target.value as Quota })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 py-2.5 px-3 rounded-lg text-sm"
              >
                <option value="TQ">Tatkal Quota (TQ)</option>
                <option value="PT">Premium Tatkal (PT)</option>
                <option value="GN">General Quota (GN)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Payment Configuration & Biometrics decrypter */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-850">
              <h3 className="text-sm font-mono text-slate-400 uppercase">Secure Payment Gate</h3>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>

            <p className="text-xs text-slate-400">
              Payments are the biggest bottleneck during Tatkal. Save UPI ID and quick credentials here, locked down behind standard end-to-end device biometric simulation.
            </p>

            {/* Lock Overlay Shield / Unlocked Input values */}
            {!profile.paymentUnlocked ? (
              <div className="p-6 bg-slate-950 border border-slate-850 rounded-2xl text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 focus:animate-shake" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Payment Vault Locked</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Biometric challenge required to decrypt checkout elements.</p>
                </div>
                
                <button 
                  onClick={triggerBiometricScan}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40"
                >
                  <Fingerprint className="w-4 h-4 text-white" />
                  <span>Scan Fingerprint / Face ID</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 bg-slate-950/60 p-4 border border-emerald-900/30 rounded-xl relative">
                <div className="absolute top-3 right-3 text-xs text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80">
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span>Decrypted</span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">UPI Virtual Address (VPA)</label>
                    <input 
                      type="text" 
                      value={upiVal}
                      onChange={e => {
                        setUpiVal(e.target.value);
                        onUpdateProfile({ ...profile, upiAddress: e.target.value });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 py-2 px-3 text-xs rounded-lg font-mono focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">Simulated Card Details (Lock-Mock)</label>
                    <input 
                      type="text" 
                      value={cardNo}
                      onChange={e => setCardNo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-205 py-2 px-3 text-xs rounded-lg font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Vault Session expires: 5m</span>
                  <button 
                    onClick={handleLockVault}
                    className="text-amber-500 hover:text-amber-400 hover:underline font-mono"
                  >
                    Lock Vault Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drag-and-drop bookmarklet code script block */}
          <div className="pt-4 border-t border-slate-850 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-indigo-400 font-semibold uppercase flex items-center gap-1">
                <Code className="w-4 h-4" />
                Bookmarklet Script Generator
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              Drag this script directly to your browser's Bookmarks bar. When checking out on the official IRCTC portal, click the bookmark to instantly autofill the saved lists.
            </p>

            {profile.passengers.length === 0 ? (
              <div className="p-3 bg-slate-950 text-center text-xs text-slate-500 rounded-xl border border-slate-850">
                Add at least one passenger first before generating bookmark scripts.
              </div>
            ) : (
              <div className="space-y-2">
                {/* Visual Draggable Anchor Item representing Bookmarklet */}
                <div 
                  className="p-3 bg-gradient-to-r from-orange-600/30 to-indigo-600/30 border-2 border-dashed border-slate-700 rounded-xl text-center select-none cursor-grab active:cursor-grabbing hover:border-orange-500 transition"
                  onDragStart={(e) => {
                    const script = generateAutofillBookmarklet();
                    e.dataTransfer.setData('text/plain', script);
                  }}
                  draggable
                >
                  <span className="text-xs font-bold text-slate-200">
                    🔗 DRAG ME TO BOOKMARK BAR: <span className="text-orange-400 font-mono font-black border-b border-orange-500 pb-0.5">IRCTC Autofill</span>
                  </span>
                </div>

                {/* Copyable code console */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopyScript}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg flex items-center justify-center gap-2 transition border border-slate-700"
                  >
                    {copiedScript ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Autofill Script Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Copy Script URL Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Biometric Scanning Challenge Overlay */}
      {isBiometricScanning && (
        <div id="modal-fingerprint-scanner" className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Biometric Checkout Match</h3>
              <p className="text-xs text-slate-400">Place and hold finger on sensor</p>
            </div>

            {/* scanning animation */}
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center text-slate-500">
              <div className="absolute inset-0 border-4 border-dashed border-slate-800 rounded-full animate-spin-slow"></div>
              
              <div className={`p-6 rounded-full transition duration-300 relative ${
                scanStatus === 'scanning' 
                  ? 'bg-amber-500/20 text-amber-500 animate-pulse' 
                  : scanStatus === 'success' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : scanStatus === 'failed' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-slate-800 text-slate-400'
              }`}>
                <Fingerprint className="w-16 h-16" />
                
                {/* Horizontal scanner beam line */}
                {scanStatus === 'scanning' && (
                  <div className="absolute left-0 right-0 h-1 bg-amber-400 animate-scanner-beam shadow shadow-amber-400"></div>
                )}
              </div>
            </div>

            <div className="space-y-1 text-sm font-mono font-medium">
              {scanStatus === 'scanning' && (
                <p className="text-amber-500 animate-pulse">CONNECTING TO DEVICE SECURE ELEMENT...</p>
              )}
              {scanStatus === 'success' && (
                <p className="text-emerald-400">FINGERPRINT AUTHENTICATED MATCH ✔</p>
              )}
              {scanStatus === 'failed' && (
                <p className="text-red-400 font-bold">SCAN ERROR. RE-ATTEMPTING SENSOR CHECK.</p>
              )}
              {scanStatus === 'idle' && (
                <p className="text-slate-400">WAITING...</p>
              )}
            </div>

            <button 
              onClick={() => setIsBiometricScanning(false)}
              className="text-xs text-slate-500 hover:text-slate-400 underline font-mono"
            >
              Abort Sensor Probe
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
