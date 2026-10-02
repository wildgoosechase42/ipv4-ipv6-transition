'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DeviceConnection, NetworkDevice } from '../types';
import { getPortCoordinates, generateBezierPath, getPathCoordinatesAtT } from '../engine/graphUtils';

interface CableConnectionProps {
  connection: DeviceConnection;
  sourceDevice: NetworkDevice;
  targetDevice: NetworkDevice;
  isSelected: boolean;
  isActivePath: boolean;
  onSelect: (e: React.MouseEvent, id: string) => void;
  onDelete: (id: string) => void;
}

export const CableConnection: React.FC<CableConnectionProps> = ({
  connection,
  sourceDevice,
  targetDevice,
  isSelected,
  isActivePath,
  onSelect,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const srcPort = sourceDevice.ports.find((p) => p.id === connection.sourcePortId) || {
    id: connection.sourcePortId,
    name: 'port',
    position: 'right' as const,
    protocol: connection.protocol
  };

  const dstPort = targetDevice.ports.find((p) => p.id === connection.targetPortId) || {
    id: connection.targetPortId,
    name: 'port',
    position: 'left' as const,
    protocol: connection.protocol
  };

  const p1 = getPortCoordinates(sourceDevice, srcPort);
  const p2 = getPortCoordinates(targetDevice, dstPort);

  const pathD = generateBezierPath(p1, p2, srcPort.position, dstPort.position);
  const midPoint = getPathCoordinatesAtT(p1, p2, srcPort.position, dstPort.position, 0.5);

  const getCableStrokeColor = () => {
    if (connection.status === 'error') return '#ef4444';
    if (isActivePath) return '#30d158';
    if (isSelected) return '#ffffff';
    switch (connection.protocol) {
      case 'ipv4':
        return '#ff9f0a';
      case 'ipv6':
        return '#2997ff';
      default:
        return 'rgba(255, 255, 255, 0.35)';
    }
  };

  const strokeColor = getCableStrokeColor();

  return (
    <g
      className="cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => onSelect(e, connection.id)}
    >
      {/* Invisible thicker path for easier hover and clicking */}
      <path d={pathD} fill="none" stroke="transparent" strokeWidth="24" />

      {/* Outer ambient glow when active or selected */}
      {(isActivePath || isSelected) && (
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeOpacity="0.3"
          className="filter blur-xs"
        />
      )}

      {/* Main Base Cable */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isSelected || isActivePath ? 2.5 : 1.75}
        strokeOpacity={isSelected ? 1 : 0.65}
        strokeDasharray={isActivePath ? '6 4' : undefined}
        className={isActivePath ? 'animate-[dash_1s_linear_infinite]' : undefined}
      />

      {/* Hover delete button at midpoint */}
      {isHovered && (
        <g
          transform={`translate(${midPoint.x - 10}, ${midPoint.y - 10})`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(connection.id);
          }}
          className="cursor-pointer"
        >
          <circle cx="10" cy="10" r="9" fill="#18181b" stroke="#ef4444" strokeWidth="1.5" />
          <foreignObject x="4" y="4" width="12" height="12">
            <X className="w-3 h-3 text-red-400 hover:text-white transition-colors" />
          </foreignObject>
        </g>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}} />
    </g>
  );
};
