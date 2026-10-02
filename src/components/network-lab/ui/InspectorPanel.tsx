'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Copy,
  Network,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Settings,
  Link
} from 'lucide-react';
import { NetworkDevice, DeviceConnection } from '../types';
import { isValidIPv4, isValidIPv6, isValidSubnet, isValidPrefix } from '../engine/ipValidator';

interface InspectorPanelProps {
  device: NetworkDevice | null;
  connection: DeviceConnection | null;
  allDevices: NetworkDevice[];
  onUpdateDevice: (updated: NetworkDevice) => void;
  onDeleteDevice: (id: string) => void;
  onDuplicateDevice: (id: string) => void;
  onDeleteConnection: (id: string) => void;
  onClose: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  device,
  connection,
  allDevices,
  onUpdateDevice,
  onDeleteDevice,
  onDuplicateDevice,
  onDeleteConnection,
  onClose
}) => {
  // Local edit state
  const [name, setName] = useState('');
  const [ipv4, setIpv4] = useState('');
  const [subnet, setSubnet] = useState('');
  const [ipv6, setIpv6] = useState('');
  const [prefix, setPrefix] = useState<number | string>(64);
  const [hasIpv4, setHasIpv4] = useState(false);
  const [hasIpv6, setHasIpv6] = useState(false);

  const [v4Error, setV4Error] = useState<string | null>(null);
  const [v6Error, setV6Error] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (device) {
      setName(device.name);
      setIpv4(device.ipv4 || '');
      setSubnet(device.subnet || '255.255.255.0');
      setIpv6(device.ipv6 || '');
      setPrefix(device.prefix || 64);
      setHasIpv4(device.protocols.ipv4);
      setHasIpv6(device.protocols.ipv6);
      setV4Error(null);
      setV6Error(null);
      setSavedSuccess(false);
    }
  }, [device]);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!device) return;

    let hasErr = false;

    // Validate IPv4 if enabled or provided
    if (hasIpv4 && ipv4.trim()) {
      if (!isValidIPv4(ipv4)) {
        setV4Error('Invalid IPv4 address format (e.g. 192.168.1.10).');
        hasErr = true;
      } else {
        setV4Error(null);
      }
    } else {
      setV4Error(null);
    }

    // Validate IPv6 if enabled or provided
    if (hasIpv6 && ipv6.trim()) {
      if (!isValidIPv6(ipv6)) {
        setV6Error('Invalid IPv6 address format (e.g. 2001:db8:1::10).');
        hasErr = true;
      } else {
        setV6Error(null);
      }
    } else {
      setV6Error(null);
    }

    if (hasErr) return;

    const updated: NetworkDevice = {
      ...device,
      name: name.trim() || device.name,
      ipv4: hasIpv4 ? ipv4.trim() : undefined,
      subnet: hasIpv4 ? subnet.trim() : undefined,
      ipv6: hasIpv6 ? ipv6.trim() : undefined,
      prefix: hasIpv6 ? Number(prefix) : undefined,
      protocols: {
        ipv4: hasIpv4,
        ipv6: hasIpv6
      },
      status: 'ready',
      errorMsg: undefined
    };

    onUpdateDevice(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // If a connection is selected
  if (connection) {
    const src = allDevices.find((d) => d.id === connection.sourceDeviceId);
    const dst = allDevices.find((d) => d.id === connection.targetDeviceId);

    return (
      <aside className="w-72 sm:w-80 bg-[#141415] border-l border-neutral-800 flex flex-col h-full select-none shrink-0 p-4 justify-between transition-all">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-[#2997ff]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                Connection Inspector
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-black/40 border border-neutral-800 rounded-xl p-3 space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-0.5">
                Source
              </span>
              <p className="font-semibold text-white">{src?.name || 'Unknown'}</p>
              <span className="text-[10px] font-mono text-[#2997ff]">Port: {connection.sourcePortId}</span>
            </div>

            <div className="border-t border-neutral-800/80 pt-2">
              <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-0.5">
                Destination
              </span>
              <p className="font-semibold text-white">{dst?.name || 'Unknown'}</p>
              <span className="text-[10px] font-mono text-[#2997ff]">Port: {connection.targetPortId}</span>
            </div>

            <div className="border-t border-neutral-800/80 pt-2 flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-neutral-500">Protocol Link:</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-200">
                {connection.protocol}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDeleteConnection(connection.id)}
          className="w-full py-2.5 rounded-xl border border-red-900/40 bg-red-950/20 text-red-400 hover:bg-red-900/30 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Connection</span>
        </button>
      </aside>
    );
  }

  // If no device is selected
  if (!device) {
    return (
      <aside className="w-72 sm:w-80 bg-[#141415] border-l border-neutral-800 flex flex-col h-full select-none shrink-0 p-4 transition-all">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-4">
          <Settings className="w-4 h-4 text-neutral-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
            Inspector
          </h3>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3 text-neutral-600">
            <Layers className="w-6 h-6 opacity-40" />
          </div>
          <p className="text-xs font-medium text-neutral-300 mb-1">No Device Selected</p>
          <p className="text-[11px] text-neutral-500 max-w-[200px] leading-relaxed">
            Click on any device or cable in the canvas to inspect and configure IP addresses, interfaces, and protocols.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 sm:w-80 bg-[#141415] border-l border-neutral-800 flex flex-col h-full select-none shrink-0 p-4 overflow-y-auto [scrollbar-width:thin] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <Network className="w-4 h-4 text-[#2997ff] shrink-0" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-mono truncate">
            Device Inspector
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleApply} className="space-y-4 flex-1">
        {/* Rename Device */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Device Label
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/40 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff]/30 font-medium"
          />
        </div>

        {/* Device Type Badge */}
        <div className="bg-black/30 border border-neutral-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Type</span>
          <span className="text-[11px] font-mono font-medium text-neutral-300 capitalize">
            {device.type.replace('-', ' ')}
          </span>
        </div>

        {/* Protocol Capabilities Toggle */}
        <div className="space-y-2 border-t border-neutral-800/80 pt-3">
          <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
            Active Protocol Stacks
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                hasIpv4
                  ? 'bg-[#ff9f0a]/10 border-[#ff9f0a]/40 text-[#ff9f0a]'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
              }`}
            >
              <input
                type="checkbox"
                checked={hasIpv4}
                onChange={(e) => setHasIpv4(e.target.checked)}
                className="rounded accent-[#ff9f0a]"
              />
              <span className="font-semibold">IPv4 Stack</span>
            </label>

            <label
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                hasIpv6
                  ? 'bg-[#2997ff]/10 border-[#2997ff]/40 text-[#2997ff]'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
              }`}
            >
              <input
                type="checkbox"
                checked={hasIpv6}
                onChange={(e) => setHasIpv6(e.target.checked)}
                className="rounded accent-[#2997ff]"
              />
              <span className="font-semibold">IPv6 Stack</span>
            </label>
          </div>
        </div>

        {/* IPv4 Configuration */}
        {hasIpv4 && (
          <div className="space-y-2.5 bg-black/30 border border-[#ff9f0a]/20 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#ff9f0a]">
                IPv4 Interface
              </span>
              <span className="text-[9px] font-mono text-neutral-500">eth0</span>
            </div>

            <div>
              <label className="text-[9px] font-mono text-neutral-400 block mb-1">
                IPv4 Address
              </label>
              <input
                type="text"
                placeholder="192.168.1.10"
                value={ipv4}
                onChange={(e) => {
                  setIpv4(e.target.value);
                  setV4Error(null);
                }}
                className={`w-full bg-black/60 border rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none ${
                  v4Error ? 'border-red-500' : 'border-neutral-800 focus:border-[#ff9f0a]'
                }`}
              />
              {v4Error && (
                <p className="text-[9px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                  <span>{v4Error}</span>
                </p>
              )}
            </div>

            <div>
              <label className="text-[9px] font-mono text-neutral-400 block mb-1">
                Subnet Mask
              </label>
              <input
                type="text"
                value={subnet}
                onChange={(e) => setSubnet(e.target.value)}
                className="w-full bg-black/60 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-[#ff9f0a]"
              />
            </div>
          </div>
        )}

        {/* IPv6 Configuration */}
        {hasIpv6 && (
          <div className="space-y-2.5 bg-black/30 border border-[#2997ff]/20 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#2997ff]">
                IPv6 Interface
              </span>
              <span className="text-[9px] font-mono text-neutral-500">eth0</span>
            </div>

            <div>
              <label className="text-[9px] font-mono text-neutral-400 block mb-1">
                IPv6 Address
              </label>
              <input
                type="text"
                placeholder="2001:db8:1::10"
                value={ipv6}
                onChange={(e) => {
                  setIpv6(e.target.value);
                  setV6Error(null);
                }}
                className={`w-full bg-black/60 border rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none ${
                  v6Error ? 'border-red-500' : 'border-neutral-800 focus:border-[#2997ff]'
                }`}
              />
              {v6Error && (
                <p className="text-[9px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                  <span>{v6Error}</span>
                </p>
              )}
            </div>

            <div>
              <label className="text-[9px] font-mono text-neutral-400 block mb-1">
                Prefix Length (/bits)
              </label>
              <input
                type="number"
                min="1"
                max="128"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full bg-black/60 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-[#2997ff]"
              />
            </div>
          </div>
        )}

        {/* Apply Changes Button */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-98 font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Applied Successfully</span>
            </>
          ) : (
            <span>Apply Changes</span>
          )}
        </button>

        {/* Duplicate & Delete Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => onDuplicateDevice(device.id)}
            className="py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>
          <button
            type="button"
            onClick={() => onDeleteDevice(device.id)}
            className="py-2 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-900/30 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </form>
    </aside>
  );
};
