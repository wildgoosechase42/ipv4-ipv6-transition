'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const TheoryHeader: React.FC = () => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-100 uppercase italic">
          Dual Stack
        </h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3"
      >
        <div className="bg-[#161617] border border-neutral-800 px-5 py-3 rounded-2xl flex flex-col min-w-[140px] transition-all hover:border-neutral-700">
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-1">Source v4</span>
          <span className="text-amber-500/90 font-mono text-xs">192.168.1.10</span>
        </div>
        <div className="bg-[#161617] border border-neutral-800 px-5 py-3 rounded-2xl flex flex-col min-w-[140px] transition-all hover:border-neutral-700">
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-1">Source v6</span>
          <span className="text-blue-400/90 font-mono text-xs truncate">2001:db8::10</span>
        </div>
      </motion.div>
    </header>
  );
};
