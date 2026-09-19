'use client';

import React, { useState } from 'react';
import { ArrowRight, Binary, Cpu, RefreshCw } from 'lucide-react';

export function Nat64Visualizer() {
  const [ipv4Input, setIpv4Input] = useState<string>('198.51.100.25');
  const [activePreset, setActivePreset] = useState<string>('198.51.100.25');
  const [hasTranslated, setHasTranslated] = useState<boolean>(true);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const presets = [
    { label: 'Test Network 3', ip: '198.51.100.25' },
    { label: 'Documentation Network', ip: '203.0.113.88' },
    { label: 'Legacy DNS Host', ip: '8.8.8.8' },
    { label: 'Cloudflare IPv4', ip: '1.1.1.1' },
  ];

  const parseIpv4ToHex = (ip: string) => {
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return { valid: false, hex1: '0000', hex2: '0000', synthesized: '64:ff9b::0000:0000' };
    const nums = parts.map(p => {
      const n = parseInt(p, 10);
      return isNaN(n) || n < 0 || n > 255 ? null : n;
    });
    if (nums.some(n => n === null)) {
      return { valid: false, hex1: '0000', hex2: '0000', synthesized: '64:ff9b::0000:0000' };
    }
    const hexParts = nums.map(n => (n as number).toString(16).padStart(2, '0'));
    const hex1 = `${hexParts[0]}${hexParts[1]}`;
    const hex2 = `${hexParts[2]}${hexParts[3]}`;
    return {
      valid: true,
      hex1,
      hex2,
      synthesized: `64:ff9b::${hex1}:${hex2}`,
      octets: nums as number[],
    };
  };

  const currentParsed = parseIpv4ToHex(ipv4Input);

  const handleTranslate = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setHasTranslated(true);
    }, 600);
  };

  const calculateSimulatedChecksum = (octets?: number[]) => {
    if (!octets || octets.length !== 4) return '0x8FA2';
    const sum = (0x4500 + 0x0034 + 0x1c4d + 0x4000 + 0x4006 + (octets[0] << 8 | octets[1]) + (octets[2] << 8 | octets[3])) & 0xffff;
    const inv = (~sum) & 0xffff;
    return `0x${inv.toString(16).toUpperCase().padStart(4, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-[#080808] border border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-mono text-[#8A8A8E]">Target IPv4 Endpoint:</label>
          <input
            type="text"
            value={ipv4Input}
            onChange={(e) => {
              setIpv4Input(e.target.value);
              setActivePreset('');
            }}
            placeholder="198.51.100.25"
            className="w-36 bg-[#111111] border border-white/[0.1] text-xs font-mono text-[#EDEDED] rounded px-3 py-1.5 focus:outline-none focus:border-[#38BDF8]"
          />
          <div className="flex items-center gap-1.5 ml-2">
            {presets.map((preset) => (
              <button
                key={preset.ip}
                onClick={() => {
                  setIpv4Input(preset.ip);
                  setActivePreset(preset.ip);
                }}
                className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                  activePreset === preset.ip
                    ? 'bg-white/[0.08] text-[#EDEDED] border-white/[0.2]'
                    : 'bg-white/[0.02] text-[#8A8A8E] border-white/[0.04] hover:bg-white/[0.04]'
                }`}
              >
                {preset.ip}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={isSynthesizing || !currentParsed.valid}
          className="flex items-center gap-2 px-4 py-1.5 rounded bg-[#38BDF8] text-[#080808] text-xs font-mono font-bold hover:bg-[#38BDF8]/90 disabled:opacity-50 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
          <span>{isSynthesizing ? 'Translating...' : 'Synthesize & Translate'}</span>
        </button>
      </div>

      <div className="p-5 rounded bg-[#080808] border border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#EDEDED]">
              DNS64 Synthesis Inspector (RFC 6052)
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8]">
            Well-Known Prefix: 64:ff9b::/96
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded bg-[#111111] border border-white/[0.06] space-y-1">
            <div className="text-[10px] text-[#8A8A8E] uppercase">Original IPv4 Input</div>
            <div className="text-sm font-bold text-[#D97706]">{ipv4Input}</div>
            <div className="text-[10px] text-[#8A8A8E]">A Record on Authoritative DNS</div>
          </div>
          <div className="p-3 rounded bg-[#111111] border border-white/[0.06] space-y-1">
            <div className="text-[10px] text-[#8A8A8E] uppercase">Hex Octet Conversion</div>
            <div className="text-sm font-bold text-[#EDEDED]">
              {currentParsed.valid ? `${currentParsed.hex1}:${currentParsed.hex2}` : 'Invalid IP format'}
            </div>
            <div className="text-[10px] text-[#8A8A8E]">Converted to 32 hex bits</div>
          </div>
          <div className="p-3 rounded bg-[#111111] border border-white/[0.06] space-y-1">
            <div className="text-[10px] text-[#8A8A8E] uppercase">Synthesized AAAA Record</div>
            <div className="text-sm font-bold text-[#38BDF8] break-all">{currentParsed.synthesized}</div>
            <div className="text-[10px] text-[#8A8A8E]">Delivered to IPv6-Only Client</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded bg-[#111111] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              Inbound IPv6 Packet (From Client)
            </span>
            <span className="text-[10px] font-mono text-[#8A8A8E]">40-byte Fixed Header</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">IP Version</span>
              <span className="text-[#38BDF8] font-bold">6</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Source Address</span>
              <span className="text-[#EDEDED]">2001:db8:cafe::42</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Destination Address</span>
              <span className="text-[#38BDF8] font-bold">{currentParsed.synthesized}</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Next Header</span>
              <span className="text-[#EDEDED]">6 (TCP)</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Hop Limit</span>
              <span className="text-[#EDEDED]">64</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Header Checksum</span>
              <span className="text-[#22C55E]">None (Eliminated)</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded bg-[#111111] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D97706] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              Outbound IPv4 Packet (To Destination)
            </span>
            <span className="text-[10px] font-mono text-[#8A8A8E]">20-byte Header (NAT64 Rewritten)</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">IP Version</span>
              <span className="text-[#D97706] font-bold">4</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Source Address (Gateway Pool)</span>
              <span className="text-[#EDEDED]">192.0.2.100 (Stateful NAT)</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Destination Address</span>
              <span className="text-[#D97706] font-bold">{ipv4Input}</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Protocol</span>
              <span className="text-[#EDEDED]">6 (TCP)</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Time To Live (TTL)</span>
              <span className="text-[#EDEDED]">63 (Hop Limit - 1)</span>
            </div>
            <div className="p-2.5 rounded bg-[#080808] border border-white/[0.04] flex justify-between">
              <span className="text-[#8A8A8E]">Header Checksum</span>
              <span className="text-[#D97706] font-bold">
                {calculateSimulatedChecksum(currentParsed.octets)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded bg-[#080808] border border-white/[0.06] flex items-start gap-3">
        <Cpu className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 font-mono">
          <span className="font-semibold text-[#EDEDED]">Stateful Connection Tracking:</span>
          <p className="text-[#8A8A8E] leading-relaxed">
            NAT64 retains a state table entry mapping <code className="text-[#38BDF8]">[2001:db8:cafe::42, Port 49152]</code> &harr; <code className="text-[#D97706]">[192.0.2.100, Port 1024]</code> &harr; <code className="text-[#EDEDED]">[{ipv4Input}, Port 80]</code>. When the remote IPv4 server replies, the gateway performs the reverse translation to deliver the packet back to the IPv6 client.
          </p>
        </div>
      </div>
    </div>
  );
}
