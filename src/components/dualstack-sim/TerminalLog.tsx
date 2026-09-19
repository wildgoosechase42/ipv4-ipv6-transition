'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  logs: string[];
}

export const TerminalLog: React.FC<Props> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#161617] border border-neutral-800 rounded-[2rem] flex flex-col h-[220px] overflow-hidden shadow-xl"
    >
      <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/20">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-neutral-500 text-sm">terminal</span>
          <span className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase">Diagnostic Console</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[9px] font-mono text-neutral-600 font-bold tracking-widest">SYSTEM_READY</span>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed scrollbar-none"
      >
        <AnimatePresence mode="popLayout">
          {logs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center text-neutral-700 italic font-sans"
            >
              Waiting for network sequence initiation...
            </motion.div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, i) => (
                <motion.div 
                  key={i + log}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 group"
                >
                  <span className="text-neutral-700 w-4 select-none tabular-nums text-[10px]">{i + 1}</span>
                  <span className={`
                    ${log.includes('active') || log.includes('flowing') ? 'text-white font-bold' : 
                    log.includes('IPv6 preferred') ? 'text-blue-400' :
                    log.includes('IPv6 selected') ? 'text-blue-400' : 
                    log.includes('IPv4 selected') ? 'text-amber-500' :
                    log.includes('DNS Query') ? 'text-neutral-400' : 
                    'text-neutral-500'}
                  `}>
                    {log}
                  </span>
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [1, 0] }} 
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-1.5 h-3 bg-neutral-600 inline-block align-middle ml-1"
              ></motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
