'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Monitor, Server, ArrowRight } from 'lucide-react';

type TargetOption = 'ipv6.google.com' | 'legacy-server.local' | 'dualstack.aws.amazon.com';

export function DualStackVisualizer() {
  const [target, setTarget] = useState<TargetOption>('ipv6.google.com');
  const [animating, setAnimating] = useState(false);
  const [packetProgress, setPacketProgress] = useState<number>(0);
  const [packetState, setPacketState] = useState<'idle' | 'dns' | 'transiting' | 'delivered'>('idle');

  const targetConfig = {
    'ipv6.google.com': {
      label: 'ipv6.google.com (IPv6 Priority)',
      v4: '142.250.190.46',
      v6: '2607:f8b0:4005:805::200e',
      preferredFamily: 'AF_INET6',
      dnsRecord: 'AAAA',
      protocol: 'IPv6 Native',
      color: '#38BDF8',
      path: 'AAAA Resolution &rarr; Direct AF_INET6 Socket',
      latency: '18ms',
    },
    'legacy-server.local': {
      label: 'legacy-server.local (IPv4 Only)',
      v4: '198.51.100.14',
      v6: null,
      preferredFamily: 'AF_INET',
      dnsRecord: 'A',
      protocol: 'IPv4 Fallback',
      color: '#D97706',
      path: 'AAAA Empty &rarr; A Record Resolution &rarr; AF_INET Socket',
      latency: '42ms',
    },
    'dualstack.aws.amazon.com': {
      label: 'dualstack.aws.amazon.com (Dual Record)',
      v4: '54.239.28.85',
      v6: '2600:1f18:4388:5101::12',
      preferredFamily: 'AF_INET6',
      dnsRecord: 'AAAA + A',
      protocol: 'IPv6 (RFC 6724 Preferred)',
      color: '#38BDF8',
      path: 'Happy Eyeballs v2 (RFC 8305) &rarr; Fast IPv6 SYN',
      latency: '22ms',
    },
  }[target];

  const handleSend = () => {
    if (animating) return;
    setAnimating(true);
    setPacketState('dns');
    setPacketProgress(10);

    setTimeout(() => {
      setPacketState('transiting');
      setPacketProgress(55);
    }, 900);

    setTimeout(() => {
      setPacketState('delivered');
      setPacketProgress(100);
      setAnimating(false);
    }, 2200);
  };

  const handleReset = () => {
    setAnimating(false);
    setPacketProgress(0);
    setPacketState('idle');
  };

  const isIPv6 = targetConfig.preferredFamily === 'AF_INET6';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-[#080808] border border-white/[0.06]">
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-[#8A8A8E]">Target Endpoint:</label>
          <select
            value={target}
            disabled={animating}
            onChange={(e) => {
              setTarget(e.target.value as TargetOption);
              handleReset();
            }}
            className="bg-[#111111] border border-white/[0.1] text-xs font-mono text-[#EDEDED] rounded px-3 py-1.5 focus:outline-none focus:border-[#38BDF8] cursor-pointer"
          >
            <option value="ipv6.google.com">ipv6.google.com (Native IPv6)</option>
            <option value="legacy-server.local">legacy-server.local (IPv4 Only)</option>
            <option value="dualstack.aws.amazon.com">dualstack.aws.amazon.com (Dual A/AAAA)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSend}
            disabled={animating}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-[#38BDF8] text-[#080808] text-xs font-mono font-bold hover:bg-[#38BDF8]/90 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{animating ? 'Transmitting...' : 'Send Request'}</span>
          </button>
          <button
            onClick={handleReset}
            disabled={animating}
            className="p-1.5 rounded bg-[#111111] border border-white/[0.08] text-[#8A8A8E] hover:text-[#EDEDED] disabled:opacity-50 transition-colors cursor-pointer"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-6 rounded bg-[#080808] border border-white/[0.06] relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded bg-[#111111] border border-white/[0.1] flex items-center justify-center text-[#EDEDED] mb-2">
              <Monitor className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-[#EDEDED]">Dual-Stack Host</div>
            <div className="text-[10px] font-mono text-[#8A8A8E]">eth0 (v4 + v6)</div>
          </div>

          <div className="flex-1 mx-6 relative">
            <div className="h-0.5 w-full bg-white/[0.06] relative">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-700 ease-out"
                style={{
                  width: `${packetProgress}%`,
                  backgroundColor: isIPv6 ? '#38BDF8' : '#D97706',
                }}
              />
            </div>

            <div className="absolute -top-3.5 w-full flex justify-between px-4 text-[10px] font-mono text-[#8A8A8E]">
              <span className={packetProgress >= 10 ? 'text-[#38BDF8]' : ''}>DNS Resolver</span>
              <span className={packetProgress >= 55 ? (isIPv6 ? 'text-[#38BDF8]' : 'text-[#D97706]') : ''}>
                {isIPv6 ? 'IPv6 Transit' : 'IPv4 Transit'}
              </span>
            </div>

            {packetProgress > 0 && (
              <div
                className="absolute -top-3 transform -translate-x-1/2 transition-all duration-700 ease-out"
                style={{ left: `${packetProgress}%` }}
              >
                <div
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#080808] shadow-lg flex items-center gap-1"
                  style={{ backgroundColor: isIPv6 ? '#38BDF8' : '#D97706' }}
                >
                  <span>{isIPv6 ? 'IPv6' : 'IPv4'}</span>
                  <span>&bull;</span>
                  <span>{packetState === 'dns' ? 'DNS' : 'SYN'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div
              className="w-12 h-12 rounded bg-[#111111] border flex items-center justify-center mb-2 transition-colors"
              style={{
                borderColor: packetState === 'delivered' ? (isIPv6 ? '#38BDF8' : '#D97706') : 'rgba(255,255,255,0.1)',
                color: isIPv6 ? '#38BDF8' : '#D97706',
              }}
            >
              <Server className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-[#EDEDED]">{target}</div>
            <div className="text-[10px] font-mono text-[#8A8A8E]">{isIPv6 ? 'AAAA Listener' : 'A Listener'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] space-y-1">
            <div className="text-[10px] font-mono uppercase text-[#38BDF8]">IPv6 Channel (Preferred)</div>
            <div className="text-xs font-mono text-[#EDEDED]">
              {targetConfig.v6 ? targetConfig.v6 : 'No AAAA record available'}
            </div>
            <div className="text-[10px] font-mono text-[#8A8A8E]">
              {targetConfig.v6 ? 'Direct wire forwarding without NAT' : 'Bypassed by resolver fallback'}
            </div>
          </div>

          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] space-y-1">
            <div className="text-[10px] font-mono uppercase text-[#D97706]">IPv4 Channel (Legacy)</div>
            <div className="text-xs font-mono text-[#EDEDED]">{targetConfig.v4}</div>
            <div className="text-[10px] font-mono text-[#8A8A8E]">
              {isIPv6 ? 'Standby; suppressed by RFC 6724 priority' : 'Active fallback route'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded bg-[#080808] border border-white/[0.06] space-y-3 font-mono text-xs">
        <div className="text-[11px] font-semibold text-[#EDEDED] uppercase tracking-wider flex items-center justify-between border-b border-white/[0.06] pb-2">
          <span>Kernel Telemetry & Resolution Inspector</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-[#8A8A8E]">Live State</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <div className="text-[10px] text-[#8A8A8E] uppercase">Address Family</div>
            <div className="text-sm font-bold text-[#EDEDED] mt-0.5">{targetConfig.preferredFamily}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#8A8A8E] uppercase">DNS Query</div>
            <div className="text-sm font-bold text-[#38BDF8] mt-0.5">{targetConfig.dnsRecord}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#8A8A8E] uppercase">Active Protocol</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: targetConfig.color }}>
              {targetConfig.protocol}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#8A8A8E] uppercase">RTT / Delay</div>
            <div className="text-sm font-bold text-[#22C55E] mt-0.5">{targetConfig.latency}</div>
          </div>
        </div>

        <div className="p-3 rounded bg-[#111111] border border-white/[0.04] text-[11px] space-y-1">
          <div className="text-[#8A8A8E] flex items-center gap-1.5">
            <span className="text-white font-medium">Socket Resolution Path:</span>
            <span className="text-[#EDEDED]" dangerouslySetInnerHTML={{ __html: targetConfig.path }} />
          </div>
          <div className="text-[10px] text-[#8A8A8E]/80">
            Node NIC carries both 192.0.2.10 and 2001:db8:1::100. No protocol translation occurred.
          </div>
        </div>
      </div>
    </div>
  );
}
