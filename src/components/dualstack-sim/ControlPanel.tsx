'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DestinationKey } from './DualStackSim';

interface Props {
  selectedDest: DestinationKey;
  onSelect: (k: DestinationKey) => void;
  onTransmit: () => void;
  isTransmitting: boolean;
}

export const ControlPanel: React.FC<Props> = ({ selectedDest, onSelect, onTransmit, isTransmitting }) => {
  const options: { id: DestinationKey; label: string; desc: string; icon: string }[] = [
    { id: 'C', label: 'Dual Stack Gateway', desc: 'Hybrid Performance', icon: 'stacks' },
    { id: 'A', label: 'IPv6 Priority', desc: 'Future Protocol', icon: 'looks_6' },
    { id: 'B', label: 'Legacy Target', desc: 'IPv4 Fallback', icon: 'looks_4' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-8"
    >
      <div className="bg-[#161617] border border-neutral-800 rounded-[2rem] p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-neutral-400 text-lg">settings_ethernet</span>
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-500">Destination Config</h2>
        </div>
        
        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              disabled={isTransmitting}
              className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                selectedDest === opt.id 
                  ? 'bg-neutral-100 border-white text-black' 
                  : 'bg-transparent border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800/30'
              } ${isTransmitting ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-[0.97]'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                selectedDest === opt.id ? 'bg-black/10' : 'bg-neutral-800'
              }`}>
                <span className={`material-symbols-outlined text-xl`}>
                  {opt.icon}
                </span>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold tracking-tight">{opt.label}</div>
                <div className={`text-[10px] font-medium opacity-60`}>{opt.desc}</div>
              </div>
              {selectedDest === opt.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black"
                />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={onTransmit}
          disabled={isTransmitting}
          className={`w-full mt-10 relative group overflow-hidden py-5 rounded-2xl font-bold text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
            isTransmitting 
              ? 'bg-neutral-800 text-neutral-500 cursor-wait' 
              : 'bg-white text-black hover:bg-neutral-200'
          }`}
        >
          {isTransmitting ? (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
              <span>ORCHESTRATING...</span>
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
              <span>TEST LINK</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
