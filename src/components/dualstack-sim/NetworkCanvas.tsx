'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Protocol } from './DualStackSim';

interface Props {
  activeProtocol: Protocol | null;
  isTransmitting: boolean;
}

export const NetworkCanvas: React.FC<Props> = ({ activeProtocol, isTransmitting }) => {
  const isIPv4 = activeProtocol === 'ipv4';
  const isIPv6 = activeProtocol === 'ipv6';
  const isNone = activeProtocol === null;

  return (
    <div className="w-full h-full flex items-center justify-between px-8 sm:px-20 relative">
      <AnimatePresence>
        {isTransmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 rounded-full blur-[100px] pointer-events-none -z-10 ${isIPv4 ? 'bg-amber-500' : 'bg-blue-500'}`}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-4 z-20">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-24 h-24 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent"></div>
          <span className="material-symbols-outlined text-4xl text-neutral-200 relative z-10">desktop_windows</span>
        </motion.div>
        <span className="text-[9px] font-bold text-neutral-500 tracking-[0.2em] uppercase whitespace-nowrap">Local Host</span>
      </div>

      <div className="flex-1 h-full flex flex-col justify-center items-center relative overflow-visible">
        <div className="absolute inset-0 flex flex-col justify-center gap-32">
          
          <div className="relative group">
            <div className={`h-[1px] bg-neutral-800 transition-all duration-700 ${!isIPv4 && !isNone ? 'opacity-5' : 'opacity-100'}`}></div>
            <AnimatePresence>
              {isIPv4 && isTransmitting && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent h-[1px] blur-[2px]"
                />
              )}
            </AnimatePresence>
            <div className="absolute -top-6 left-0 text-[8px] font-bold text-neutral-600 uppercase tracking-[0.3em]">Channel 04_LEGACY</div>
            
            {isIPv4 && isTransmitting && (
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_20px_#f59e0b] animate-packet z-30">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-amber-500">V4</div>
              </div>
            )}
          </div>

          <div className="relative group">
            <div className={`h-[1px] bg-neutral-800 transition-all duration-700 ${!isIPv6 && !isNone ? 'opacity-5' : 'opacity-100'}`}></div>
            <AnimatePresence>
              {isIPv6 && isTransmitting && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[1px] blur-[2px]"
                />
              )}
            </AnimatePresence>
            <div className="absolute -bottom-6 left-0 text-[8px] font-bold text-neutral-600 uppercase tracking-[0.3em]">Channel 06_ULTRA</div>

            {isIPv6 && isTransmitting && (
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] animate-packet z-30">
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-blue-500">V6</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 z-20">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-24 h-24 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent"></div>
          <span className="material-symbols-outlined text-4xl text-neutral-200 relative z-10">hub</span>
        </motion.div>
        <span className="text-[9px] font-bold text-neutral-500 tracking-[0.2em] uppercase whitespace-nowrap">Cloud Node</span>
      </div>

      <style>{`
        @keyframes packet {
          0% { left: 0%; opacity: 0; transform: scale(0.5); }
          10% { opacity: 1; transform: scale(1); }
          90% { opacity: 1; transform: scale(1); }
          100% { left: 100%; opacity: 0; transform: scale(0.8); }
        }
        .animate-packet {
          animation: packet 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};
