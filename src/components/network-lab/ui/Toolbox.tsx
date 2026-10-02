'use client';

import React, { useState } from 'react';
import {
  Laptop,
  Router,
  Server,
  ArrowRightLeft,
  ShieldCheck,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { DeviceType, LabBlueprint, NetworkDevice } from '../types';

interface ToolboxProps {
  blueprint: LabBlueprint;
  currentDevices: NetworkDevice[];
  onAddDevice: (type: DeviceType) => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({
  blueprint,
  currentDevices,
  onAddDevice
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  const getDeviceIcon = (type: DeviceType) => {
    const iconClass = 'w-4 h-4';
    switch (type) {
      case 'host-dual':
      case 'host-v6':
        return <Laptop className={`${iconClass} text-[#2997ff]`} />;
      case 'host-v4':
        return <Laptop className={`${iconClass} text-[#ff9f0a]`} />;
      case 'router':
      case 'router-v4':
      case 'router-v6':
        return <Router className={`${iconClass} text-[#30d158]`} />;
      case 'server-v4':
        return <Server className={`${iconClass} text-[#ff9f0a]`} />;
      case 'server-v6':
      case 'server-dual':
        return <Server className={`${iconClass} text-[#2997ff]`} />;
      case 'tunnel-endpoint':
        return <ShieldCheck className={`${iconClass} text-[#ff9f0a]`} />;
      case 'nat64-translator':
        return <ArrowRightLeft className={`${iconClass} text-[#2997ff]`} />;
      case 'network-v4':
      case 'network-v6':
        return <Cloud className={`${iconClass} text-neutral-400`} />;
      default:
        return <Laptop className={`${iconClass} text-neutral-400`} />;
    }
  };

  const handleDragStart = (e: React.DragEvent, type: DeviceType) => {
    e.dataTransfer.setData('application/dcn-device-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  if (collapsed) {
    return (
      <div className="w-10 bg-[#141415] border-r border-neutral-800 flex flex-col items-center py-4 justify-between transition-all select-none">
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Expand Toolbox"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono uppercase text-neutral-500 [writing-mode:vertical-lr] tracking-widest rotate-180">
          Hardware
        </span>
        <div className="w-2 h-2 rounded-full bg-[#2997ff]" />
      </div>
    );
  }

  // Count placed devices for a given type
  const getPlacedCount = (type: DeviceType) => {
    return currentDevices.filter((d) => {
      if (type === 'host-dual') return d.type === 'host-dual' || (d.protocols.ipv4 && d.protocols.ipv6 && d.type.startsWith('host'));
      if (type === 'host-v6') return d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6);
      if (type === 'router') return d.type === 'router' || (d.type.startsWith('router') && d.protocols.ipv4 && d.protocols.ipv6);
      if (type === 'server-v4') return d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4);
      if (type === 'server-v6') return d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6);
      return d.type === type;
    }).length;
  };

  return (
    <aside className="w-56 sm:w-60 bg-[#141415] border-r border-neutral-800 flex flex-col h-full select-none shrink-0 transition-all">
      {/* Header */}
      <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
            Hardware Toolbox
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Collapse Toolbox"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3 [scrollbar-width:thin]">
        {/* REQUIRED HARDWARE SECTION */}
        <div className="space-y-1.5">
          <div className="px-1 text-[9px] font-mono uppercase tracking-wider text-[#2997ff] font-bold">
            Components
          </div>

          {blueprint.requiredComponents.map((item, idx) => {
            const matchingTotal = currentDevices.filter((d) => {
              if (item.type === 'host-dual') return d.type === 'host-dual' || (d.protocols.ipv4 && d.protocols.ipv6 && d.type.startsWith('host'));
              if (item.type === 'host-v6') return d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6);
              if (item.type === 'router') return d.type === 'router' || (d.type.startsWith('router') && d.protocols.ipv4 && d.protocols.ipv6);
              if (item.type === 'server-v4') return d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4);
              if (item.type === 'server-v6') return d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6);
              return d.type === item.type;
            }).length;

            const sameTypeBefore = blueprint.requiredComponents
              .slice(0, idx)
              .filter((c) => c.type === item.type);
            const prevNeeded = sameTypeBefore.reduce((acc, c) => acc + c.count, 0);
            const countPlaced = Math.min(item.count, Math.max(0, matchingTotal - prevNeeded));
            const isFilled = countPlaced >= item.count;

            return (
              <div
                key={item.id || `${item.type}-${idx}`}
                draggable
                onDragStart={(e) => handleDragStart(e, item.type)}
                className={`group relative border rounded-xl p-2 transition-all duration-150 cursor-grab active:cursor-grabbing shadow-sm flex items-center justify-between gap-2 ${
                  isFilled
                    ? 'bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-[#18181a] hover:bg-[#1f1f22] border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-black/50 border border-white/[0.06] flex items-center justify-center shrink-0">
                    {getDeviceIcon(item.type)}
                  </div>
                  <span className="text-xs font-medium text-white truncate">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isFilled
                        ? 'bg-emerald-500/20 text-[#30d158]'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {isFilled ? `✓ ${countPlaced}/${item.count}` : `${countPlaced}/${item.count}`}
                  </span>

                  <button
                    onClick={() => onAddDevice(item.type)}
                    className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title={`Add ${item.label}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* OPTIONAL / OTHER SECTION */}
        {blueprint.optionalComponents && blueprint.optionalComponents.length > 0 && (
          <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
            <button
              onClick={() => setShowOptional(!showOptional)}
              className="w-full flex items-center justify-between px-1 text-[9px] font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
            >
              <span>Optional Devices</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showOptional ? 'rotate-180' : ''}`}
              />
            </button>

            {showOptional &&
              blueprint.optionalComponents.map((item, optIdx) => (
                <div
                  key={`${item.type}-${optIdx}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  className="group relative bg-[#18181a]/60 hover:bg-[#1f1f22] border border-neutral-800 rounded-xl p-2 transition-all cursor-grab active:cursor-grabbing flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-black/40 border border-white/[0.04] flex items-center justify-center shrink-0">
                      {getDeviceIcon(item.type)}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-300 truncate">
                      {item.label}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddDevice(item.type)}
                    className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-neutral-800 text-[9px] text-neutral-500 font-mono flex items-center justify-between">
        <span>Drag or click +</span>
        <span className="text-neutral-400">Tinkercad Flow</span>
      </div>
    </aside>
  );
};
