'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TheoryHeader } from './TheoryHeader';
import { ControlPanel } from './ControlPanel';
import { NetworkCanvas } from './NetworkCanvas';
import { TerminalLog } from './TerminalLog';

export type Protocol = 'ipv4' | 'ipv6';
export type DestinationKey = 'A' | 'B' | 'C';

export default function DualStackSim() {
  const [selectedDest, setSelectedDest] = useState<DestinationKey>('C');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState<Protocol | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const destinations = {
    A: { name: 'ipv6.server.internal', records: ['AAAA'] },
    B: { name: 'legacy.node.net', records: ['A'] },
    C: { name: 'gateway.dualstack.io', records: ['A', 'AAAA'] }
  };

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-12), msg]);
  }, []);

  const handleTransmit = async () => {
    if (isTransmitting) return;
    setIsTransmitting(true);
    setLogs([]);
    const dest = destinations[selectedDest];
    
    addLog(`Establishing session with ${dest.name}...`);
    await new Promise(r => setTimeout(r, 600));
    let resolvedProtocol: Protocol = 'ipv4';
    
    if (dest.records.includes('AAAA')) {
      addLog(`DNS Query [AAAA]: Found 2001:db8::80`);
      resolvedProtocol = 'ipv6';
      if (dest.records.includes('A')) {
        addLog(`DNS Query [A]: Found 198.51.100.24`);
        addLog(`Priority: IPv6 preferred (RFC 6724)`);
      }
    } else {
      addLog(`DNS Query [AAAA]: No record found`);
      addLog(`Fallback [A]: Found 198.51.100.24`);
      resolvedProtocol = 'ipv4';
    }

    setActiveProtocol(resolvedProtocol);
    addLog(`Protocol: ${resolvedProtocol.toUpperCase()} selected`);
    addLog(`Status: Link active. Data flowing.`);
    await new Promise(r => setTimeout(r, 3000));
    setIsTransmitting(false);
    setActiveProtocol(null);
  };

  return (
    <div className="w-full bg-transparent flex items-center justify-center p-4 md:p-8 font-sans antialiased text-white relative selection:bg-neutral-500/30">
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

        <div className="relative z-10 flex flex-col gap-8">
          <TheoryHeader />
          
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[540px]">
            <section className="lg:col-span-8 flex flex-col gap-6 min-h-[500px]">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 bg-[#161617] border border-neutral-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-[380px]"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-400">language</span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Live Infrastructure</span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${activeProtocol === 'ipv4' ? 'bg-[#ff9f0a]' : 'bg-neutral-700'}`}></div>
                      <span className="text-[10px] font-medium text-neutral-400 tracking-wider">IPv4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${activeProtocol === 'ipv6' ? 'bg-[#2997ff]' : 'bg-neutral-700'}`}></div>
                      <span className="text-[10px] font-medium text-neutral-400 tracking-wider">IPv6</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative min-h-[260px] flex items-center">
                  <NetworkCanvas 
                    activeProtocol={activeProtocol} 
                    isTransmitting={isTransmitting} 
                  />
                </div>
              </motion.div>
              
              <TerminalLog logs={logs} />
            </section>

            <aside className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-1">
              <ControlPanel 
                selectedDest={selectedDest}
                onSelect={setSelectedDest}
                onTransmit={handleTransmit}
                isTransmitting={isTransmitting}
              />
            </aside>
          </main>
        </div>
      </motion.div>
    </div>
  );
}
