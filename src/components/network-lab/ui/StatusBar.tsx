'use client';

import React from 'react';
import { Activity, Clock } from 'lucide-react';

interface StatusBarProps {
  deviceCount: number;
  connectionCount: number;
  packetCount: number;
  status: 'idle' | 'ready' | 'running' | 'paused' | 'completed' | 'error';
  statusMessage?: string;
  latencyMs?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  deviceCount,
  connectionCount,
  packetCount,
  status,
  statusMessage,
  latencyMs
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-[#30d158]';
      case 'running':
        return 'bg-[#2997ff] animate-pulse';
      case 'error':
        return 'bg-red-500';
      case 'paused':
        return 'bg-amber-400';
      default:
        return 'bg-emerald-400';
    }
  };

  const getStatusText = () => {
    if (statusMessage) return statusMessage;
    switch (status) {
      case 'completed':
        return 'Delivery Verified';
      case 'running':
        return 'Packet In Flight';
      case 'paused':
        return 'Simulation Paused';
      case 'error':
        return 'Configuration Error';
      default:
        return 'Ready to Simulate';
    }
  };

  return (
    <footer className="w-full h-8 bg-[#141415] border-t border-neutral-800 px-4 flex items-center justify-between text-[11px] font-mono text-neutral-400 select-none">
      {/* Counters */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div>
          Devices: <span className="text-white font-semibold">{deviceCount}</span>
        </div>
        <div>
          Connections: <span className="text-white font-semibold">{connectionCount}</span>
        </div>
        <div>
          Packets: <span className="text-white font-semibold">{packetCount}</span>
        </div>
      </div>

      {/* Latency & Status */}
      <div className="flex items-center gap-4">
        {latencyMs !== undefined && (
          <div className="hidden sm:flex items-center gap-1 text-neutral-500">
            <Clock className="w-3 h-3" />
            <span>{latencyMs}ms transit</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-white font-medium capitalize truncate max-w-[200px] sm:max-w-none">
            {getStatusText()}
          </span>
        </div>
      </div>
    </footer>
  );
};
