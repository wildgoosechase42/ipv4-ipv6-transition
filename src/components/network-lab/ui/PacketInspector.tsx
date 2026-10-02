'use client';

import React from 'react';
import { X, Mail, ShieldAlert, ArrowRightLeft, Layers } from 'lucide-react';
import { PacketData } from '../types';

interface PacketInspectorProps {
  packet: PacketData | null;
  onClose: () => void;
}

export const PacketInspector: React.FC<PacketInspectorProps> = ({ packet, onClose }) => {
  if (!packet) return null;

  return (
    <div className="absolute top-16 right-4 z-50 w-72 bg-[#161617]/95 backdrop-blur-xl border border-neutral-700/80 rounded-2xl p-4 shadow-2xl select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-lg flex items-center justify-center ${
              packet.protocol === 'ipv4' ? 'bg-[#ff9f0a]/20 text-[#ff9f0a]' : 'bg-[#2997ff]/20 text-[#2997ff]'
            }`}
          >
            <Mail className="w-3 h-3" />
          </div>
          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            Packet Header Inspector
          </h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2 text-[11px] font-mono">
        <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
          <span className="text-neutral-500 uppercase">Protocol</span>
          <span
            className={`font-bold uppercase ${
              packet.protocol === 'ipv4' ? 'text-[#ff9f0a]' : 'text-[#2997ff]'
            }`}
          >
            {packet.protocol}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
          <span className="text-neutral-500 uppercase">Source IP</span>
          <span className="text-neutral-200 font-semibold truncate max-w-[150px]">
            {packet.sourceIp}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
          <span className="text-neutral-500 uppercase">Destination IP</span>
          <span className="text-neutral-200 font-semibold truncate max-w-[150px]">
            {packet.targetIp}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
          <span className="text-neutral-500 uppercase">Current Hop</span>
          <span className="text-white font-medium">{packet.currentDeviceName}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
          <span className="text-neutral-500 uppercase">Encapsulation</span>
          <span
            className={`font-semibold ${
              packet.encapsulation === 'ipv6-in-ipv4'
                ? 'text-[#ff9f0a] flex items-center gap-1'
                : 'text-neutral-400'
            }`}
          >
            {packet.encapsulation === 'ipv6-in-ipv4' ? 'IPv6 inside IPv4 (P41)' : 'None'}
          </span>
        </div>

        {packet.translationState !== 'none' && (
          <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
            <span className="text-neutral-500 uppercase">Translation</span>
            <span className="text-[#2997ff] font-semibold flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" />
              <span>{packet.translationState}</span>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between py-1 pt-1.5">
          <span className="text-neutral-500 uppercase">Delivery Status</span>
          <span
            className={`font-bold capitalize ${
              packet.status === 'delivered'
                ? 'text-[#30d158]'
                : packet.status === 'dropped'
                ? 'text-red-400'
                : 'text-[#2997ff]'
            }`}
          >
            ● {packet.status}
          </span>
        </div>
      </div>
    </div>
  );
};
