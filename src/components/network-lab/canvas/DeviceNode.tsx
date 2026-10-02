'use client';

import React from 'react';
import {
  Laptop,
  Router,
  Server,
  ArrowRightLeft,
  ShieldCheck,
  Cloud,
  Layers,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { NetworkDevice, DevicePort, ProtocolType } from '../types';
import { NODE_WIDTH, NODE_HEIGHT } from '../engine/graphUtils';

interface DeviceNodeProps {
  device: NetworkDevice;
  isSelected: boolean;
  isSimulatingHop: boolean;
  connectingSourcePortId: string | null;
  onSelect: (e: React.MouseEvent, id: string) => void;
  onStartDrag: (e: React.MouseEvent, id: string) => void;
  onPortMouseDown: (e: React.MouseEvent, deviceId: string, portId: string) => void;
  onPortMouseUp: (e: React.MouseEvent, deviceId: string, portId: string) => void;
  onDelete?: (id: string) => void;
}

export const DeviceNode: React.FC<DeviceNodeProps> = ({
  device,
  isSelected,
  isSimulatingHop,
  connectingSourcePortId,
  onSelect,
  onStartDrag,
  onPortMouseDown,
  onPortMouseUp,
  onDelete
}) => {
  const getDeviceIcon = () => {
    const iconClass = 'w-4 h-4';
    switch (device.type) {
      case 'host-dual':
        return <Laptop className={`${iconClass} text-[#2997ff]`} />;
      case 'host-v4':
        return <Laptop className={`${iconClass} text-[#ff9f0a]`} />;
      case 'host-v6':
        return <Laptop className={`${iconClass} text-[#2997ff]`} />;
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
        return <Layers className={`${iconClass} text-neutral-400`} />;
    }
  };

  const getPortPositionStyles = (pos: DevicePort['position']) => {
    switch (pos) {
      case 'left':
        return 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'right':
        return 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2';
      case 'top':
        return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'bottom':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2';
    }
  };

  const getPortColor = (protocol: ProtocolType) => {
    switch (protocol) {
      case 'ipv4':
        return 'bg-[#ff9f0a] border-[#ff9f0a]/50 text-[#ff9f0a]';
      case 'ipv6':
        return 'bg-[#2997ff] border-[#2997ff]/50 text-[#2997ff]';
      case 'both':
        return 'bg-purple-500 border-purple-400 text-purple-400';
      default:
        return 'bg-neutral-500 border-neutral-400 text-neutral-400';
    }
  };

  return (
    <div
      style={{
        transform: `translate3d(${device.x}px, ${device.y}px, 0)`,
        width: `${NODE_WIDTH}px`,
        height: `${NODE_HEIGHT}px`
      }}
      className={`absolute select-none cursor-move transition-all duration-150 rounded-2xl p-2.5 flex flex-col justify-between ${
        isSelected
          ? 'bg-[#18181b] border-2 border-[#2997ff] shadow-[0_0_24px_rgba(41,151,255,0.3)] z-20'
          : isSimulatingHop
          ? 'bg-[#18181b] border-2 border-[#30d158] shadow-[0_0_24px_rgba(48,209,88,0.35)] z-20'
          : 'bg-[#141416]/95 hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.16] shadow-xl z-10'
      }`}
      onMouseDown={(e) => {
        onSelect(e, device.id);
        onStartDrag(e, device.id);
      }}
    >
      {/* Active pulse aura when simulating this hop */}
      {isSimulatingHop && (
        <div className="absolute inset-0 rounded-2xl border border-[#30d158] animate-ping pointer-events-none opacity-30" />
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between gap-1.5 border-b border-white/[0.06] pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-lg bg-black/50 border border-white/[0.08] flex items-center justify-center shrink-0">
            {getDeviceIcon()}
          </div>
          <span className="text-xs font-semibold text-white tracking-tight truncate leading-tight">
            {device.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isSelected && onDelete ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(device.id);
              }}
              className="p-1 rounded-md bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white transition-colors cursor-pointer"
              title="Remove device"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          ) : (
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                device.status === 'error'
                  ? 'bg-red-500'
                  : isSimulatingHop
                  ? 'bg-[#30d158] animate-pulse'
                  : 'bg-[#30d158]'
              }`}
            />
          )}
        </div>
      </div>

      {/* Middle IP / Protocol info */}
      <div className="flex flex-col gap-0.5 my-auto text-[10px] font-mono leading-tight px-0.5">
        {device.ipv4 && (
          <div className="flex items-center justify-between text-[#ff9f0a]">
            <span className="text-[8px] font-bold text-neutral-500">v4</span>
            <span className="truncate max-w-[124px] text-[10px]">{device.ipv4}</span>
          </div>
        )}
        {device.ipv6 && (
          <div className="flex items-center justify-between text-[#2997ff]">
            <span className="text-[8px] font-bold text-neutral-500">v6</span>
            <span className="truncate max-w-[124px] text-[9.5px]">{device.ipv6}</span>
          </div>
        )}
      </div>

      {/* Bottom Protocol Tags */}
      <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
        <div className="flex items-center gap-1 text-[8px] font-bold tracking-wider uppercase font-mono">
          {device.protocols.ipv4 && (
            <span className="px-1.5 py-0.2 rounded bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 text-[#ff9f0a]">
              IPv4
            </span>
          )}
          {device.protocols.ipv6 && (
            <span className="px-1.5 py-0.2 rounded bg-[#2997ff]/10 border border-[#2997ff]/20 text-[#2997ff]">
              IPv6
            </span>
          )}
        </div>

        <span className="text-[8px] font-mono text-neutral-500">
          {device.ports.length}P
        </span>
      </div>

      {/* Connection Ports on borders */}
      {device.ports.map((port) => {
        const isDraggingFromHere = connectingSourcePortId === `${device.id}:${port.id}`;
        const colorClasses = getPortColor(port.protocol);

        return (
          <div
            key={port.id}
            title={`${port.name} (${port.protocol.toUpperCase()})`}
            className={`absolute ${getPortPositionStyles(port.position)} group z-30`}
            onMouseDown={(e) => {
              e.stopPropagation();
              onPortMouseDown(e, device.id, port.id);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              onPortMouseUp(e, device.id, port.id);
            }}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 cursor-crosshair flex items-center justify-center ${colorClasses} ${
                isDraggingFromHere
                  ? 'scale-150 ring-4 ring-white/20'
                  : 'hover:scale-135 hover:shadow-[0_0_10px_currentColor]'
              }`}
            >
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>

            {/* Port Tooltip */}
            <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-black/90 border border-neutral-700 text-[8px] font-mono text-white whitespace-nowrap shadow-lg">
              {port.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
