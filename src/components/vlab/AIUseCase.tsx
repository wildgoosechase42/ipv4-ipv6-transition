'use client';

import React from 'react';
import {
  Satellite,
  Cpu,
  Radio,
  Layers,
  ArrowRightLeft,
  ShieldCheck,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const AIUseCase: React.FC = () => {
  return (
    <section id="ai-use-case" className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <ScrollReveal>
        <div className="border border-white/[0.08] bg-gradient-to-b from-[#161618] to-[#0f0f11] rounded-[2rem] p-6 sm:p-9 space-y-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2997ff]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Section Header */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2997ff]/15 border border-[#2997ff]/30 flex items-center justify-center text-[#2997ff] shadow-[0_0_12px_rgba(41,151,255,0.25)]">
                <Satellite className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2997ff] font-semibold">
                AI USE CASE
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-[26px] font-semibold tracking-tight text-white">
              Applying IPv4 → IPv6 Transition Mechanisms to SomaiyaSat
            </h3>
          </div>

          {/* High-Tech Architectural Flow Schematic */}
          <div className="relative z-10 p-6 sm:p-7 rounded-2xl bg-black/50 border border-white/[0.06] backdrop-blur-md">
            <div className="flex flex-col items-center">
              
              {/* Top Node: SomaiyaSat + AI Router */}
              <div className="inline-flex items-center gap-2.5 sm:gap-3 px-5 py-2.5 rounded-full bg-[#18181b]/95 border border-white/10 shadow-[0_0_30px_rgba(41,151,255,0.18)] transition-transform hover:scale-[1.02]">
                <div className="w-7 h-7 rounded-full bg-[#2997ff]/20 flex items-center justify-center text-[#2997ff]">
                  <Satellite className="w-4 h-4 animate-pulse" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-white">
                  SOMAIYASAT
                </span>
                <span className="text-zinc-600">•</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff9f0a]/15 text-[#ffb340] border border-[#ff9f0a]/30 text-[11px] font-mono font-medium">
                  <Cpu className="w-3.5 h-3.5" />
                  AI ROUTER
                </span>
              </div>

              {/* Data Flow Connector Down */}
              <div className="w-px h-6 sm:h-7 bg-gradient-to-b from-[#2997ff]/70 via-white/20 to-white/5 relative my-1">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2997ff] shadow-[0_0_8px_#2997ff]" />
              </div>

              {/* Middle Layer: 3 Transition Mechanism Channels */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
                {/* Dual Stack Card */}
                <div className="group relative p-4 rounded-xl bg-gradient-to-b from-[#1c1427]/80 to-[#120d1a]/80 border border-[#a855f7]/30 shadow-md hover:border-[#a855f7]/60 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[#a855f7]/20 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#a855f7]/20 text-[#d8b4fe] border border-[#a855f7]/30">
                      IPv4 + IPv6
                    </span>
                  </div>
                  <div className="font-semibold text-white text-xs sm:text-sm">
                    Dual Stack
                  </div>
                </div>

                {/* Tunneling Card */}
                <div className="group relative p-4 rounded-xl bg-gradient-to-b from-[#251808]/80 to-[#150e04]/80 border border-[#ff9f0a]/30 shadow-md hover:border-[#ff9f0a]/60 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[#ff9f0a]/20 border border-[#ff9f0a]/30 flex items-center justify-center text-[#ffb340]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff9f0a]/20 text-[#fed7aa] border border-[#ff9f0a]/30">
                      IPv6 in IPv4
                    </span>
                  </div>
                  <div className="font-semibold text-white text-xs sm:text-sm">
                    Tunneling
                  </div>
                </div>

                {/* Translation Card */}
                <div className="group relative p-4 rounded-xl bg-gradient-to-b from-[#0a192f]/80 to-[#06101e]/80 border border-[#2997ff]/30 shadow-md hover:border-[#2997ff]/60 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[#2997ff]/20 border border-[#2997ff]/30 flex items-center justify-center text-[#60a5fa]">
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2997ff]/20 text-[#93c5fd] border border-[#2997ff]/30">
                      IPv6 ↔ IPv4
                    </span>
                  </div>
                  <div className="font-semibold text-white text-xs sm:text-sm">
                    Translation (NAT64)
                  </div>
                </div>
              </div>

              {/* Data Flow Connector Down */}
              <div className="w-px h-6 sm:h-7 bg-gradient-to-b from-white/5 via-white/20 to-[#30d158]/70 relative my-1">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#30d158] shadow-[0_0_8px_#30d158]" />
              </div>

              {/* Bottom Node: Ground Station & Mission Network */}
              <div className="inline-flex items-center gap-2.5 sm:gap-3 px-5 py-2.5 rounded-full bg-[#18181b]/95 border border-white/10 shadow-[0_0_30px_rgba(48,209,88,0.18)] transition-transform hover:scale-[1.02]">
                <div className="w-7 h-7 rounded-full bg-[#30d158]/20 flex items-center justify-center text-[#30d158]">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-white">
                  GROUND STATION &amp; MISSION NETWORK
                </span>
              </div>

            </div>
          </div>

          {/* Exact Authoritative Content Paragraph */}
          <div className="relative z-10 p-6 sm:p-7 rounded-2xl border-l-4 border-[#2997ff] bg-black/40 border border-white/[0.05] text-sm sm:text-[15px] text-zinc-200 font-normal leading-relaxed tracking-normal shadow-inner">
            The IPv4-to-IPv6 transition mechanisms can be applied to the SomaiyaSat AI use case by using them as the networking layer for communication between the satellite, ground station, and supporting network infrastructure. The onboard AI-based scheduler/router already makes autonomous decisions about which data should be transmitted based on link quality, power availability, and data priority. In this system, <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold text-[#c084fc] bg-[#a855f7]/15 border border-[#a855f7]/30">Dual Stack</span> can allow the ground-station and mission-support network to operate with both IPv4 and IPv6, enabling gradual migration to IPv6 without disrupting existing IPv4 infrastructure. <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold text-[#ffb340] bg-[#ff9f0a]/15 border border-[#ff9f0a]/30">Tunneling</span> can be used when IPv6-based mission or ground-network data needs to pass through an IPv4 network, while <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold text-[#60a5fa] bg-[#2997ff]/15 border border-[#2997ff]/30">Translation such as NAT64</span> can enable communication between IPv6-based systems and IPv4-only systems. These mechanisms can therefore be incorporated into the ground communication and software-network environment, while the AI router decides how and when data should be transmitted based on mission conditions. This would provide a practical demonstration of how networking technologies can support the reliable, flexible, and autonomous communication architecture described in the SomaiyaSat use case.
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
};
