'use client';

import React from 'react';
import { Terminal, Shield, Check, Network, ExternalLink } from 'lucide-react';

export function ConclusionSection() {
  return (
    <section id="conclusion" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#EDEDED]">
          <span>05 &bull; ARCHITECTURAL SYNTHESIS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-[#EDEDED]">
          The Scaffolding vs. The Destination
        </h2>
        <p className="text-sm text-[#8A8A8E] max-w-3xl leading-relaxed">
          IPv6 was intentionally engineered without backward compatibility to purge legacy design flaws. Every transition mechanism—Dual-Stack, 6in4, and NAT64—represents temporary scaffolding toward a pure single-stack future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded bg-[#111111] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#D97706]/10 border border-[#D97706]/20 flex items-center justify-center text-[#D97706]">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#EDEDED]">
              The Current Reality: Dual-Stack Exhaustion
            </h3>
          </div>
          <p className="text-xs text-[#8A8A8E] leading-relaxed">
            Dual-stack has been the pragmatic bridge for the past two decades. However, dual-stack still requires an IPv4 address for every public host, doubling operational telemetry, security surface, and routing tables. As IPv4 market prices exceeded $50 per IP, maintaining dual-stack has transitioned from a convenience into an escalating financial penalty.
          </p>
          <div className="p-3 rounded bg-[#080808] border border-white/[0.06] text-[11px] font-mono text-[#8A8A8E] space-y-1">
            <div className="text-white font-medium">Overhead Vectors:</div>
            <div>&bull; Double routing memory allocation in core BGP tables (TCAM).</div>
            <div>&bull; Fragmented firewall policies across IPv4 and IPv6 rulesets.</div>
            <div>&bull; Complex carrier-grade NAT (CGNAT) state synchronization.</div>
          </div>
        </div>

        <div className="p-6 rounded bg-[#111111] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#EDEDED]">
              The Modern Paradigm: Pure Single-Stack IPv6
            </h3>
          </div>
          <p className="text-xs text-[#8A8A8E] leading-relaxed">
            Leading hyperscalers (Meta, Microsoft Azure) and top tier mobile carriers (T-Mobile US, Reliance Jio) have transitioned their internal fabric entirely to pure IPv6. By deploying IPv6-only data center underlays with NAT64/DNS64 and 464XLAT at the edges, they have eradicated internal IPv4 addresses completely, unlocking limitless horizontal scalability.
          </p>
          <div className="p-3 rounded bg-[#080808] border border-white/[0.06] text-[11px] font-mono text-[#8A8A8E] space-y-1">
            <div className="text-white font-medium">Production Metrics:</div>
            <div>&bull; T-Mobile US mobile traffic: &gt;90% pure IPv6.</div>
            <div>&bull; Meta internal data center fabric: 100% IPv6-only.</div>
            <div>&bull; Google global user adoption: &gt;45% native IPv6 requests.</div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded bg-[#111111] border border-white/[0.08] space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#EDEDED]">
          Core Takeaway Matrix
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded bg-[#080808] border border-white/[0.04] space-y-2">
            <span className="text-[#38BDF8] font-bold block">1. Dual-Stack (RFC 4213)</span>
            <p className="text-[#8A8A8E] text-[11px] leading-relaxed">
              Best for client endpoints and edge servers during initial transition. Both stacks run in parallel; requires scarce public IPv4 addresses.
            </p>
          </div>
          <div className="p-4 rounded bg-[#080808] border border-white/[0.04] space-y-2">
            <span className="text-[#D97706] font-bold block">2. Tunneling (Protocol 41)</span>
            <p className="text-[#8A8A8E] text-[11px] leading-relaxed">
              Connects isolated IPv6 sites across IPv4 backbones. +20 byte header overhead; requires careful Path MTU Discovery configuration.
            </p>
          </div>
          <div className="p-4 rounded bg-[#080808] border border-white/[0.04] space-y-2">
            <span className="text-[#22C55E] font-bold block">3. NAT64 / DNS64 (RFC 6146)</span>
            <p className="text-[#8A8A8E] text-[11px] leading-relaxed">
              The endgame architecture. Enables pure IPv6 networks to access legacy IPv4 destinations via stateful gateway translation.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8A8A8E]">
        <div className="flex items-center gap-2">
          <span>Transitioning from IPv4 to IPv6</span>
          <span>&bull;</span>
          <span>Educational Reference &amp; Simulation Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://datatracker.ietf.org/doc/html/rfc8200"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#EDEDED] transition-colors flex items-center gap-1"
          >
            <span>IETF RFC 8200</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://datatracker.ietf.org/doc/html/rfc6146"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#EDEDED] transition-colors flex items-center gap-1"
          >
            <span>RFC 6146 (NAT64)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </section>
  );
}
