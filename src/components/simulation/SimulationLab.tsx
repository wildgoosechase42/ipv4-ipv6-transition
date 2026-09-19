'use client';

import React, { useState } from 'react';
import { Layers, ArrowRightLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import { DualStackVisualizer } from './DualStackVisualizer';
import { TunnelingVisualizer } from './TunnelingVisualizer';
import { Nat64Visualizer } from './Nat64Visualizer';

type SimulationMode = 'dual-stack' | 'tunneling' | 'nat64';

export function SimulationLab() {
  const [activeMode, setActiveMode] = useState<SimulationMode>('dual-stack');

  return (
    <section id="simulation" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#38BDF8]">
            <span>03 &bull; INTERACTIVE SIMULATION LAB</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-[#EDEDED]">
            Transition Pipeline Simulator
          </h2>
          <p className="text-sm text-[#8A8A8E] max-w-2xl leading-relaxed">
            Hands-on exploration of the three primary IETF transition technologies. Observe real-time address synthesis, packet encapsulation, and RFC 6724 routing behavior.
          </p>
        </div>

        <div className="flex items-center p-1 rounded bg-[#111111] border border-white/[0.08] font-mono text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveMode('dual-stack')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'dual-stack'
                ? 'bg-white/[0.1] text-[#EDEDED] font-semibold border border-white/[0.15]'
                : 'text-[#8A8A8E] hover:text-[#EDEDED] border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>DUAL-STACK</span>
          </button>
          <button
            onClick={() => setActiveMode('tunneling')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'tunneling'
                ? 'bg-white/[0.1] text-[#EDEDED] font-semibold border border-white/[0.15]'
                : 'text-[#8A8A8E] hover:text-[#EDEDED] border border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
            <span>TUNNELING</span>
          </button>
          <button
            onClick={() => setActiveMode('nat64')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'nat64'
                ? 'bg-white/[0.1] text-[#EDEDED] font-semibold border border-white/[0.15]'
                : 'text-[#8A8A8E] hover:text-[#EDEDED] border border-transparent'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>NAT64 TRANSLATION</span>
          </button>
        </div>
      </div>

      <div className="p-6 rounded bg-[#111111] border border-white/[0.08]">
        {activeMode === 'dual-stack' && <DualStackVisualizer />}
        {activeMode === 'tunneling' && <TunnelingVisualizer />}
        {activeMode === 'nat64' && <Nat64Visualizer />}
      </div>
    </section>
  );
}
