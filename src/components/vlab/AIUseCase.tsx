'use client';

import React from 'react';
import {
  Satellite,
  Cpu,
  Radio,
  ArrowRight,
  Layers,
  ArrowRightLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const AIUseCase: React.FC = () => {
  const handleScrollToSimulation = () => {
    const el = document.getElementById('simulation');
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="ai-use-case" className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <ScrollReveal>
        <div className="border border-neutral-800 bg-[#161617] rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2997ff]/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#a855f7]/5 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

          {/* Section Header */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2997ff]/10 border border-[#2997ff]/20 flex items-center justify-center text-[#2997ff]">
                <Satellite className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2997ff] font-semibold">
                AI USE CASE
              </span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                Applying IPv4 → IPv6 Transition Mechanisms to SomaiyaSat
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                Applying the transition mechanisms to an AI-driven satellite communication system
              </p>
            </div>
          </div>

          {/* Minimal Network Flow Diagram */}
          <div className="relative z-10 p-5 sm:p-6 rounded-2xl bg-black/60 border border-neutral-800/90 overflow-hidden">
            <div className="flex flex-col items-center gap-4 text-center">
              
              {/* Satellite Node */}
              <div className="w-full max-w-md p-3.5 sm:p-4 rounded-xl bg-[#1c1c1e] border border-neutral-700/80 shadow-lg flex flex-col items-center gap-1.5 transition-transform hover:scale-[1.01]">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm tracking-wide">
                  <Satellite className="w-4 h-4 text-[#2997ff]" />
                  <span>SOMAIYASAT</span>
                  <span className="text-neutral-500">•</span>
                  <span className="flex items-center gap-1 text-[#ff9f0a] text-[11px] font-mono">
                    <Cpu className="w-3.5 h-3.5" />
                    AI ROUTER
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
                  <span className="text-zinc-500">Autonomous Decisions:</span>
                  <span className="text-zinc-300">Link Quality</span>
                  <span className="text-neutral-600">/</span>
                  <span className="text-zinc-300">Power Availability</span>
                  <span className="text-neutral-600">/</span>
                  <span className="text-zinc-300">Data Priority</span>
                </div>
              </div>

              {/* Data Link Interconnects */}
              <div className="w-full max-w-lg flex flex-col items-center gap-2 my-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff] animate-pulse" />
                  <span>Networking Layer &bull; IPv4 ↔ IPv6 Transition</span>
                </div>
                
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 text-left font-mono text-[11px]">
                  {/* Dual Stack */}
                  <div className="p-2.5 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/25 flex items-center gap-2 text-zinc-200">
                    <Layers className="w-3.5 h-3.5 text-[#a855f7] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#c084fc]">Dual Stack</div>
                      <div className="text-[10px] text-zinc-400">IPv4 &amp; IPv6 Coexistence</div>
                    </div>
                  </div>

                  {/* Tunneling */}
                  <div className="p-2.5 rounded-lg bg-[#ff9f0a]/10 border border-[#ff9f0a]/25 flex items-center gap-2 text-zinc-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff9f0a] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#ffb340]">Tunneling</div>
                      <div className="text-[10px] text-zinc-400">IPv6-over-IPv4 Transit</div>
                    </div>
                  </div>

                  {/* Translation */}
                  <div className="p-2.5 rounded-lg bg-[#2997ff]/10 border border-[#2997ff]/25 flex items-center gap-2 text-zinc-200">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#60a5fa]">Translation (NAT64)</div>
                      <div className="text-[10px] text-zinc-400">IPv6 ↔ IPv4 Interwork</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ground Station Node */}
              <div className="w-full max-w-md p-3.5 sm:p-4 rounded-xl bg-[#1c1c1e] border border-neutral-700/80 shadow-lg flex flex-col items-center gap-1 transition-transform hover:scale-[1.01]">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm tracking-wide">
                  <Radio className="w-4 h-4 text-[#30d158]" />
                  <span>GROUND STATION</span>
                  <span className="text-neutral-500">&amp;</span>
                  <span className="text-zinc-300">MISSION SUPPORT NETWORK</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  Reliable, Flexible &amp; Autonomous Telemetry Downlink
                </div>
              </div>

            </div>
          </div>

          {/* The Exact Authoritative Paragraph */}
          <div className="relative z-10 p-5 sm:p-6 rounded-2xl border-l-4 border-[#2997ff] bg-black/40 text-sm sm:text-[15px] text-zinc-200 font-normal leading-relaxed tracking-normal">
            The IPv4-to-IPv6 transition mechanisms can be applied to the SomaiyaSat AI use case by using them as the networking layer for communication between the satellite, ground station, and supporting network infrastructure. The onboard AI-based scheduler/router already makes autonomous decisions about which data should be transmitted based on link quality, power availability, and data priority. In this system, <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold text-[#c084fc] bg-[#a855f7]/15 border border-[#a855f7]/30">Dual Stack</span> can allow the ground-station and mission-support network to operate with both IPv4 and IPv6, enabling gradual migration to IPv6 without disrupting existing IPv4 infrastructure. <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold text-[#ffb340] bg-[#ff9f0a]/15 border border-[#ff9f0a]/30">Tunneling</span> can be used when IPv6-based mission or ground-network data needs to pass through an IPv4 network, while <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold text-[#60a5fa] bg-[#2997ff]/15 border border-[#2997ff]/30">Translation such as NAT64</span> can enable communication between IPv6-based systems and IPv4-only systems. These mechanisms can therefore be incorporated into the ground communication and software-network environment, while the AI router decides how and when data should be transmitted based on mission conditions. This would provide a practical demonstration of how networking technologies can support the reliable, flexible, and autonomous communication architecture described in the SomaiyaSat use case.
          </div>

          {/* Connection to Simulations CTA */}
          <div className="relative z-10 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-800/80">
            <p className="text-xs sm:text-sm text-zinc-400">
              Explore the transition mechanisms in the interactive laboratory.
            </p>
            <button
              type="button"
              onClick={handleScrollToSimulation}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 text-xs sm:text-sm font-medium hover:bg-zinc-200 hover:text-black active:scale-95 transition-all shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>Explore Simulations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
};
