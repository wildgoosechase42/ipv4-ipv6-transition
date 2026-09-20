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
    <div className="w-full bg-transparent flex items-center justify-center p-4 md:p-8 font-sans antialiased text-white relative selection:bg-[#2997ff]/25">
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
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#2997ff]/[0.02] blur-[120px] pointer-events-none" />

        <header className="flex justify-between items-start z-10 relative">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white">Translation</h1>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wide border transition-all duration-300 ${
            status === 'completed' 
              ? 'bg-[#30d158]/10 border-[#30d158]/30 text-[#30d158]' 
              : status === 'translating'
              ? 'bg-[#2997ff]/10 border-[#2997ff]/30 text-[#2997ff]'
              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
          }`}>
            {status === 'completed' ? 'Packet Delivered' : status === 'translating' ? 'Processing...' : 'Ready'}
          </div>
        </header>

        <div className="space-y-6 z-10 relative">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500">Configuration</label>
              <button 
                onClick={resetSimulation}
                className="text-[10px] font-medium text-neutral-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
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
                    className={`px-4 py-2 text-[10px] font-medium rounded-lg transition-all cursor-pointer ${
                      targetIp === p.ip ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
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
                  className="bg-black/40 border border-neutral-800 rounded-xl px-4 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff]/30 transition-all w-48 placeholder:text-neutral-700"
                  placeholder="203.0.113.1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-neutral-500 opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">IPv4</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleTranslate}
            disabled={status === 'translating'}
            className={`group relative overflow-hidden w-full py-4 rounded-2xl font-semibold text-xs tracking-wider uppercase transition-all active:scale-[0.99] cursor-pointer ${
              status === 'translating'
                ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800'
                : 'bg-white text-black hover:bg-neutral-200 shadow-sm'
            }`}
          >
            {status === 'translating' ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff] animate-ping" />
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
                  className="absolute inset-0 bg-gradient-to-r from-[#2997ff] to-[#2997ff]/20 rounded-full"
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
                  className="absolute inset-0 bg-gradient-to-r from-[#ff9f0a] to-[#ff9f0a]/20 rounded-full"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-[1.25rem] bg-black border border-neutral-800 flex items-center justify-center shadow-lg group transition-colors hover:border-neutral-600">
              <span className="material-symbols-outlined text-[#2997ff] text-2xl group-hover:scale-105 transition-transform">terminal</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-0.5">Origin</span>
              <span className="text-[9px] font-medium text-[#2997ff]">IPv6 Node</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center z-10">
            <motion.div 
              animate={phase === 'nat' ? { 
                scale: [1, 1.03, 1], 
                borderColor: ['#262626', '#2997ff', '#262626'],
              } : {}}
              className="w-28 h-28 bg-black rounded-[2rem] border border-neutral-800 flex flex-col items-center justify-center shadow-xl relative"
            >
              <div className="absolute inset-0 bg-[#2997ff]/[0.02] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className={`material-symbols-outlined text-4xl mb-1 ${phase === 'nat' ? 'text-[#2997ff] animate-spin' : 'text-neutral-500'}`} style={{ animationDuration: '3s' }}>
                hub
              </span>
              <span className="text-[8px] font-semibold tracking-wider uppercase text-neutral-400">NAT64 Gateway</span>
            </motion.div>

            <AnimatePresence mode="wait">
              {phase === 'v6' && (
                <motion.div
                  key="v6-packet"
                  initial={{ x: -160, opacity: 0, scale: 0.8 }}
                  animate={{ x: -25, opacity: 1, scale: 1 }}
                  exit={{ x: 20, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1, ease: "anticipate" }}
                  className="absolute bg-white px-3 py-1.5 rounded-lg shadow-md z-20 border border-neutral-200"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] font-medium text-black uppercase tracking-tight opacity-40">Packet</span>
                    <span className="font-mono text-[9px] font-bold text-black whitespace-nowrap leading-none">IPv6 Header</span>
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
                  className="absolute bg-[#ff9f0a] px-3 py-1.5 rounded-lg shadow-md z-20 border border-[#ff9f0a]/80"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] font-medium text-black uppercase tracking-tight opacity-60">Packet</span>
                    <span className="font-mono text-[9px] font-bold text-black whitespace-nowrap leading-none">IPv4 Header</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-4 z-10">
            <motion.div 
              animate={status === 'completed' ? { 
                scale: [1, 1.05, 1],
                borderColor: ['#262626', '#30d158', '#262626'],
                backgroundColor: ['#000000', 'rgba(48,209,88,0.08)', '#000000']
              } : {}}
              className="w-16 h-16 rounded-[1.25rem] bg-black border border-neutral-800 flex items-center justify-center shadow-lg transition-all duration-500"
            >
              <span className={`material-symbols-outlined text-2xl transition-colors duration-500 ${status === 'completed' ? 'text-[#30d158]' : 'text-[#ff9f0a]'}`}>
                {status === 'completed' ? 'verified' : 'dns'}
              </span>
            </motion.div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-0.5">Target</span>
              <span className={`text-[9px] font-mono font-medium transition-colors ${status === 'completed' ? 'text-[#30d158]' : 'text-[#ff9f0a]'}`}>
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
