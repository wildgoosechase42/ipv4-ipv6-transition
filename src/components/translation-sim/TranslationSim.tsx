'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
  { label: 'Web Server', ip: '198.51.100.25' },
  { label: 'Cloud API', ip: '93.184.216.34' }
];

export default function TranslationSim() {
  const [targetIp, setTargetIp] = useState('198.51.100.25');
  const [status, setStatus] = useState<'idle' | 'translating' | 'completed'>('idle');
  const [phase, setPhase] = useState<'idle' | 'v6' | 'nat' | 'v4'>('idle');

  const resetSimulation = useCallback(() => {
    setStatus('idle');
    setPhase('idle');
  }, []);

  const handleTranslate = async () => {
    if (status === 'translating') return;
    
    resetSimulation();
    await new Promise(r => setTimeout(r, 100));
    
    setStatus('translating');
    setPhase('v6');
    
    await new Promise(r => setTimeout(r, 1000));
    setPhase('nat');
    
    await new Promise(r => setTimeout(r, 800));
    setPhase('v4');
    
    await new Promise(r => setTimeout(r, 1000));
    setStatus('completed');
  };

  return (
    <div className="w-full bg-transparent flex items-center justify-center p-4 md:p-8 font-sans antialiased text-white relative selection:bg-[#38BDF8]/30">
      <motion.div 
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-40px 0px -40px 0px' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl bg-[#161617] border border-neutral-800 rounded-[2rem] p-6 md:p-12 shadow-2xl flex flex-col gap-8 relative overflow-hidden"
      >
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#38BDF8]/5 blur-[120px] pointer-events-none" />

        <header className="flex justify-between items-start z-10 relative">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">Translation</h1>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all duration-300 ${
            status === 'completed' 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
              : status === 'translating'
              ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
              : 'bg-neutral-900 border-neutral-800 text-neutral-500'
          }`}>
            {status === 'completed' ? 'Packet Delivered' : status === 'translating' ? 'Processing...' : 'Ready'}
          </div>
        </header>

        <div className="space-y-6 z-10 relative">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-600">Configuration</label>
              <button 
                onClick={resetSimulation}
                className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-1 bg-black/40 p-1.5 rounded-xl border border-neutral-800/50">
                {PRESETS.map((p) => (
                  <button
                    key={p.ip}
                    disabled={status === 'translating'}
                    onClick={() => { setTargetIp(p.ip); resetSimulation(); }}
                    className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all ${
                      targetIp === p.ip ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'
                    } disabled:opacity-50`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="relative group">
                <input 
                  type="text"
                  value={targetIp}
                  disabled={status === 'translating'}
                  onChange={(e) => { setTargetIp(e.target.value); resetSimulation(); }}
                  className="bg-black/40 border border-neutral-800 rounded-xl px-4 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all w-48 placeholder:text-neutral-700"
                  placeholder="203.0.113.1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-neutral-600 opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">IPv4</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleTranslate}
            disabled={status === 'translating'}
            className={`group relative overflow-hidden w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all active:scale-[0.99] ${
              status === 'translating'
                ? 'bg-neutral-900 text-neutral-700 cursor-not-allowed border border-neutral-800'
                : 'bg-white text-black hover:bg-[#38BDF8] hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]'
            }`}
          >
            {status === 'translating' ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                Translating Payload
              </span>
            ) : (
              'Initiate Pipeline'
            )}
          </button>
        </div>

        <div className="relative h-56 flex items-center justify-between px-6 bg-black/20 rounded-[2rem] border border-neutral-800/30 z-10">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-20 pointer-events-none">
            <div className="relative flex-1 h-[2px]">
              <div className="absolute inset-0 bg-neutral-900 rounded-full" />
              {phase !== 'idle' && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="absolute inset-0 bg-gradient-to-r from-[#38BDF8] to-[#38BDF8]/20 rounded-full"
                />
              )}
            </div>
            <div className="w-24" />
            <div className="relative flex-1 h-[2px]">
              <div className="absolute inset-0 bg-neutral-900 rounded-full" />
              {phase === 'v4' && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/20 rounded-full"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-[1.25rem] bg-black border border-neutral-800 flex items-center justify-center shadow-2xl group transition-colors hover:border-neutral-600">
              <span className="material-symbols-outlined text-[#38BDF8] text-2xl group-hover:scale-110 transition-transform">terminal</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black tracking-[0.25em] uppercase text-neutral-600 mb-0.5">Origin</span>
              <span className="text-[9px] font-bold text-[#38BDF8]">IPv6 Node</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center z-10">
            <motion.div 
              animate={phase === 'nat' ? { 
                scale: [1, 1.05, 1], 
                borderColor: ['#262626', '#38BDF8', '#262626'],
                boxShadow: ['0 0 0px rgba(56,189,248,0)', '0 0 30px rgba(56,189,248,0.15)', '0 0 0px rgba(56,189,248,0)']
              } : {}}
              className="w-28 h-28 bg-black rounded-[2rem] border border-neutral-800 flex flex-col items-center justify-center shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-[#38BDF8]/2 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className={`material-symbols-outlined text-4xl mb-1 ${phase === 'nat' ? 'text-[#38BDF8] animate-spin' : 'text-neutral-700'}`} style={{ animationDuration: '3s' }}>
                hub
              </span>
              <span className="text-[8px] font-black tracking-widest uppercase text-neutral-500">NAT64 GW</span>
            </motion.div>

            <AnimatePresence mode="wait">
              {phase === 'v6' && (
                <motion.div
                  key="v6-packet"
                  initial={{ x: -160, opacity: 0, scale: 0.8 }}
                  animate={{ x: -25, opacity: 1, scale: 1 }}
                  exit={{ x: 20, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1, ease: "anticipate" }}
                  className="absolute bg-white px-3 py-1.5 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] z-20 border border-neutral-200"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] font-black text-black uppercase tracking-tighter opacity-40">Packet</span>
                    <span className="font-mono text-[9px] font-black text-black whitespace-nowrap leading-none">IPv6 HDR</span>
                  </div>
                </motion.div>
              )}
              {phase === 'v4' && (
                <motion.div
                  key="v4-packet"
                  initial={{ x: 25, opacity: 0, scale: 0.8 }}
                  animate={{ x: 165, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 1, ease: "circOut" }}
                  className="absolute bg-[#F59E0B] px-3 py-1.5 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] z-20"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] font-black text-black uppercase tracking-tighter opacity-60">Packet</span>
                    <span className="font-mono text-[9px] font-black text-black whitespace-nowrap leading-none">IPv4 HDR</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-4 z-10">
            <motion.div 
              animate={status === 'completed' ? { 
                scale: [1, 1.1, 1],
                borderColor: ['#262626', '#10B981', '#262626'],
                backgroundColor: ['#000000', '#064E3B', '#000000']
              } : {}}
              className="w-16 h-16 rounded-[1.25rem] bg-black border border-neutral-800 flex items-center justify-center shadow-2xl transition-all duration-500"
            >
              <span className={`material-symbols-outlined text-2xl transition-colors duration-500 ${status === 'completed' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                {status === 'completed' ? 'verified' : 'dns'}
              </span>
            </motion.div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black tracking-[0.25em] uppercase text-neutral-600 mb-0.5">Target</span>
              <span className={`text-[9px] font-mono font-bold transition-colors ${status === 'completed' ? 'text-emerald-400' : 'text-[#F59E0B]'}`}>
                {targetIp}
              </span>
            </div>
          </div>
        </div>

        <footer className="pt-6 border-t border-neutral-800/50 flex justify-center z-10 relative">
          <AnimatePresence mode="wait">
            {status !== 'idle' && (
              <motion.p 
                key={status + phase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="font-mono text-[10px] text-neutral-500 uppercase tracking-tight text-center"
              >
                {status === 'translating' && phase === 'v6' && '• Receiving: Processing IPv6 Frame Ingress'}
                {status === 'translating' && phase === 'nat' && '• Translating: Mapping Prefix & Synthesizing Header'}
                {status === 'translating' && phase === 'v4' && '• Routing: Dispatching Translated IPv4 Datagram'}
                {status === 'completed' && `• Connection Stabilized: Handshake completed with ${targetIp}`}
              </motion.p>
            )}
          </AnimatePresence>
        </footer>
      </motion.div>
    </div>
  );
}

export { TranslationSim };
