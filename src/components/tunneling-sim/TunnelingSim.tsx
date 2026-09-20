'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Stage = 'ingress' | 'encapsulation' | 'transit' | 'decapsulation' | 'egress';
const STAGES: Stage[] = ['ingress', 'encapsulation', 'transit', 'decapsulation', 'egress'];
const PACKET_POSITIONS = [12.5, 37.5, 50, 62.5, 87.5];

export default function TunnelingSim() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
  };

  const handleReset = () => {
    setCurrentIdx(0);
  };

  return (
    <div className="w-full bg-transparent flex items-center justify-center p-4 md:p-8 font-sans antialiased text-white relative selection:bg-[#2997ff]/25">
      <motion.div 
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-40px 0px -40px 0px' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl bg-[#161617] border border-neutral-800 rounded-[2rem] p-6 md:p-12 shadow-2xl flex flex-col gap-8 md:gap-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white">Tunneling</h1>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
            Protocol 41 Active
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 md:gap-4 relative z-10">
          {STAGES.map((s, i) => (
            <button 
              key={s} 
              onClick={() => setCurrentIdx(i)}
              className={`group flex flex-col gap-2 transition-all duration-300 cursor-pointer ${i <= currentIdx ? 'opacity-100' : 'opacity-30 hover:opacity-50'}`}
            >
              <div className={`h-1 w-full rounded-full transition-all duration-500 ${i <= currentIdx ? 'bg-[#2997ff]' : 'bg-neutral-800'}`} />
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-semibold tracking-wider uppercase transition-colors ${i === currentIdx ? 'text-[#2997ff]' : 'text-neutral-500'}`}>
                  {s}
                </span>
                {i < currentIdx && <span className="material-symbols-outlined text-[12px] text-[#30d158]">done_all</span>}
              </div>
            </button>
          ))}
        </div>

        <div className="relative h-64 md:h-80 bg-black rounded-2xl md:rounded-[2rem] border border-white/5 flex flex-col justify-center overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,30,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-20 opacity-10" />
          
          <div className="grid grid-cols-4 h-full items-center relative z-10">
            <div className="absolute top-1/2 left-[12.5%] right-[12.5%] h-px bg-white/5 -translate-y-1/2 -z-10" />
            <div className="absolute top-1/2 left-[37.5%] right-[37.5%] h-px border-t border-dashed border-[#ff9f0a]/30 -translate-y-1/2 -z-10" />
            
            <Node label="Host A" icon="desktop_windows" color="indigo" active={currentIdx === 0} />
            <Node label="Gateway A" icon="router" color="amber" active={currentIdx === 1} />
            <Node label="Gateway B" icon="router" color="amber" active={currentIdx === 3} />
            <Node label="Host B" icon="desktop_windows" color="indigo" active={currentIdx === 4} />
            
            <Packet index={currentIdx} />
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-around pointer-events-none px-4">
            <span className="text-[8px] font-mono text-neutral-600 tracking-[0.25em] uppercase">Local Domain (Site A)</span>
            <span className="text-[8px] font-mono text-[#ff9f0a]/60 tracking-[0.25em] uppercase">IPv4 Transit Infrastructure</span>
            <span className="text-[8px] font-mono text-neutral-600 tracking-[0.25em] uppercase">Local Domain (Site B)</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 w-full relative z-10">
          <button 
            onClick={handleReset}
            className="px-6 py-4 rounded-xl border border-white/10 text-[10px] font-bold tracking-widest uppercase hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Reset
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIdx === 4}
            className={`px-10 py-4 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
              currentIdx === 4 
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
              : 'bg-white text-black hover:bg-neutral-200 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]'
            }`}
          >
            Next Step
            <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
          </button>
        </div>
      </motion.div>
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}} />
    </div>
  );
}

function Node({ label, icon, color, active }: { label: string, icon: string, color: 'indigo' | 'amber', active: boolean }) {
  const colorMap = {
    indigo: { primary: '#2997ff', bg: 'rgba(41, 151, 255, 0.08)', border: 'rgba(41, 151, 255, 0.3)' },
    amber: { primary: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.08)', border: 'rgba(255, 159, 10, 0.3)' }
  };
  const theme = colorMap[color];

  return (
    <div className="flex flex-col items-center justify-center gap-4 relative">
      <motion.div 
        animate={{ 
          scale: active ? 1.05 : 1,
          borderColor: active ? theme.primary : 'rgba(255,255,255,0.06)',
          backgroundColor: active ? theme.bg : 'rgba(0,0,0,0.2)'
        }}
        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl border flex items-center justify-center transition-all duration-500 group relative"
      >
        <span className={`material-symbols-outlined text-2xl md:text-3xl transition-colors duration-500 ${active ? 'opacity-100' : 'opacity-30'}`} style={{ color: active ? theme.primary : '#fff' }}>
          {icon}
        </span>
        {active && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.3, 1.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none"
            style={{ backgroundColor: theme.primary }}
          />
        )}
      </motion.div>
      <div className="flex flex-col items-center gap-1">
        <span className={`text-[9px] md:text-[10px] font-semibold uppercase tracking-widest transition-colors ${active ? 'text-white' : 'text-neutral-500'}`}>
          {label}
        </span>
        {active && (
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[7px] font-mono text-neutral-400 uppercase tracking-wider"
          >
            Active Node
          </motion.span>
        )}
      </div>
    </div>
  );
}

function Packet({ index }: { index: number }) {
  const xPos = PACKET_POSITIONS[index];
  const isEnveloped = index >= 1 && index <= 3;

  return (
    <motion.div 
      animate={{ left: `${xPos}%` }}
      transition={{ type: 'spring', damping: 20, stiffness: 80, mass: 1 }}
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center"
      style={{ width: '80px', height: '80px' }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence>
          {isEnveloped && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 1.2, opacity: 0, rotateY: -90 }}
              className="absolute inset-0 bg-[#ff9f0a]/10 border border-[#ff9f0a]/50 rounded-2xl md:rounded-3xl shadow-lg flex flex-col items-center justify-between py-2 backdrop-blur-sm"
            >
               <div className="w-full px-2.5 flex justify-between items-center">
                 <span className="text-[7px] font-semibold text-[#ff9f0a] uppercase">IPv4 Header</span>
                 <div className="w-2 h-0.5 bg-[#ff9f0a]/40 rounded-full" />
               </div>
               <div className="flex-1" />
               <span className="text-[7px] font-mono font-medium text-[#ff9f0a] uppercase tracking-wider">Proto 41</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          layout
          animate={{ 
            width: isEnveloped ? '50px' : '64px',
            height: isEnveloped ? '36px' : '64px',
            scale: 1,
          }}
          className="bg-[#2997ff] border border-[#2997ff]/80 rounded-xl md:rounded-2xl flex flex-col items-center justify-center shadow-lg relative z-10 overflow-hidden"
        >
          <motion.span 
            animate={{ scale: isEnveloped ? 0.7 : 1 }}
            className="material-symbols-outlined text-white text-xl"
          >
            mail
          </motion.span>
          {!isEnveloped && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[8px] font-semibold text-white uppercase tracking-tight mt-1"
            >
              IPv6 Data
            </motion.span>
          )}
          
          <motion.div 
            animate={{ top: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="absolute inset-0 w-full h-[20%] bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none"
          />
        </motion.div>

        <motion.div 
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`absolute inset-0 blur-2xl -z-10 rounded-full ${isEnveloped ? 'bg-[#ff9f0a]/15' : 'bg-[#2997ff]/15'}`} 
        />
      </div>
    </motion.div>
  );
}

export { TunnelingSim };
