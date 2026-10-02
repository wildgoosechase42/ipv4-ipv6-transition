'use client';

import React from 'react';
import { Mail, ArrowRightLeft } from 'lucide-react';
import { PacketData } from '../types';

interface PacketRendererProps {
  packet: PacketData;
  onClick: (packet: PacketData) => void;
}

export const PacketRenderer: React.FC<PacketRendererProps> = ({ packet, onClick }) => {
  const isEncapsulated = packet.encapsulation === 'ipv6-in-ipv4';
  const isTranslating = packet.status === 'translating';
  const isIpv4 = packet.protocol === 'ipv4';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(packet);
      }}
      style={{
        transform: `translate3d(${packet.position.x - 36}px, ${packet.position.y - 20}px, 0)`,
        transition: 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      className="absolute top-0 left-0 z-40 cursor-pointer pointer-events-auto group select-none"
    >
      {/* Outer ambient glow */}
      <div
        className={`absolute inset-0 blur-md rounded-2xl opacity-60 transition-colors duration-300 ${
          isEncapsulated
            ? 'bg-[#ff9f0a]/30'
            : isIpv4
            ? 'bg-[#ff9f0a]/30'
            : 'bg-[#2997ff]/30'
        }`}
      />

      {/* ENCAPSULATED TUNNELING PACKET */}
      {isEncapsulated ? (
        <div className="relative bg-[#161617] border border-[#ff9f0a] rounded-xl p-1.5 shadow-2xl flex flex-col items-center gap-1 min-w-[76px] ring-2 ring-[#ff9f0a]/40 animate-pulse">
          <div className="flex items-center justify-between w-full px-1 border-b border-[#ff9f0a]/20 pb-0.5">
            <span className="text-[7px] font-mono font-bold text-[#ff9f0a] tracking-wider uppercase">
              IPv4 Hdr
            </span>
            <span className="text-[6px] font-mono text-[#ff9f0a]/80 bg-[#ff9f0a]/10 px-1 rounded">
              P41
            </span>
          </div>

          {/* Inner IPv6 Payload */}
          <div className="bg-[#2997ff] text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm w-full justify-center">
            <Mail className="w-2.5 h-2.5 shrink-0" />
            <span className="text-[7px] font-bold font-mono uppercase tracking-tight">
              IPv6 Data
            </span>
          </div>
        </div>
      ) : isTranslating ? (
        /* TRANSLATING STATE */
        <div className="relative bg-[#161617] border border-[#2997ff] rounded-xl px-2.5 py-1.5 shadow-2xl flex items-center gap-1.5 ring-2 ring-[#2997ff]/50 animate-bounce">
          <ArrowRightLeft className="w-3 h-3 text-[#2997ff] animate-spin" />
          <span className="text-[8px] font-bold font-mono text-white tracking-wider uppercase">
            NAT64 Translation
          </span>
        </div>
      ) : (
        /* NATIVE IPv4 OR IPv6 PACKET */
        <div
          className={`relative rounded-xl px-2.5 py-1 shadow-2xl flex items-center gap-1.5 border transition-all duration-300 group-hover:scale-110 ${
            isIpv4
              ? 'bg-[#ff9f0a] border-[#ff9f0a] text-black font-semibold'
              : 'bg-[#2997ff] border-[#2997ff] text-white font-semibold'
          }`}
        >
          <Mail className="w-3 h-3 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase tracking-tight leading-tight">
              {isIpv4 ? 'IPv4 Datagram' : 'IPv6 Datagram'}
            </span>
          </div>
        </div>
      )}

      {/* Floating Inspection Prompt */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-neutral-700 rounded px-1.5 py-0.5 text-[8px] font-mono text-neutral-300 whitespace-nowrap shadow-lg">
        Click to inspect
      </div>
    </div>
  );
};
