'use client';

import React, { useState } from 'react';
import {
  Laptop,
  Router,
  Server,
  ShieldCheck,
  ArrowRightLeft,
  Cloud,
  Layers,
  Info
} from 'lucide-react';
import { LabBlueprint, ProtocolType } from '../types';

interface ReferenceTopologyVisualProps {
  blueprint: LabBlueprint;
  isExpanded?: boolean;
}

interface VisualNode {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  ipv4?: string;
  ipv6?: string;
  protocols: { ipv4?: boolean; ipv6?: boolean };
  ports: { id: string; name: string; side: 'left' | 'right' | 'top' | 'bottom'; protocol: ProtocolType }[];
}

interface VisualCable {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  protocol: 'ipv4' | 'ipv6' | 'both';
  label?: string;
}

export const ReferenceTopologyVisual: React.FC<ReferenceTopologyVisualProps> = ({
  blueprint
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredCableId, setHoveredCableId] = useState<string | null>(null);

  // Define crisp, native-resolution diagrams without any CSS transform: scale() blurriness
  const getDiagramData = (): { width: number; height: number; nodes: VisualNode[]; cables: VisualCable[] } => {
    switch (blueprint.labType) {
      case 'dual-stack': {
        const nodes: VisualNode[] = [
          {
            id: 'host',
            name: 'Dual-Stack Laptop',
            type: 'host-dual',
            x: 20,
            y: 95,
            w: 190,
            h: 92,
            ipv4: '192.168.1.10',
            ipv6: '2001:db8:1::10',
            protocols: { ipv4: true, ipv6: true },
            ports: [{ id: 'eth0', name: 'eth0', side: 'right', protocol: 'both' }]
          },
          {
            id: 'router',
            name: 'Dual-Stack Core Router',
            type: 'router',
            x: 340,
            y: 95,
            w: 200,
            h: 92,
            protocols: { ipv4: true, ipv6: true },
            ports: [
              { id: 'eth0', name: 'eth0 (Host)', side: 'left', protocol: 'both' },
              { id: 'eth1', name: 'eth1 (v4 Svr)', side: 'right', protocol: 'ipv4' },
              { id: 'eth2', name: 'eth2 (v6 Svr)', side: 'right', protocol: 'ipv6' }
            ]
          },
          {
            id: 'srv-v4',
            name: 'IPv4 Web Server',
            type: 'server-v4',
            x: 655,
            y: 20,
            w: 190,
            h: 90,
            ipv4: '198.51.100.25',
            protocols: { ipv4: true },
            ports: [{ id: 'eth0', name: 'eth0', side: 'left', protocol: 'ipv4' }]
          },
          {
            id: 'srv-v6',
            name: 'IPv6 Cloud Server',
            type: 'server-v6',
            x: 655,
            y: 170,
            w: 190,
            h: 90,
            ipv6: '2001:db8:2::80',
            protocols: { ipv6: true },
            ports: [{ id: 'eth0', name: 'eth0', side: 'left', protocol: 'ipv6' }]
          }
        ];

        const cables: VisualCable[] = [
          {
            id: 'c-host-router',
            from: { x: 210, y: 141 },
            to: { x: 340, y: 141 },
            protocol: 'both',
            label: 'IPv4 + IPv6'
          },
          {
            id: 'c-router-v4',
            from: { x: 540, y: 125 },
            to: { x: 655, y: 65 },
            protocol: 'ipv4',
            label: 'IPv4'
          },
          {
            id: 'c-router-v6',
            from: { x: 540, y: 157 },
            to: { x: 655, y: 215 },
            protocol: 'ipv6',
            label: 'IPv6'
          }
        ];

        return { width: 870, height: 285, nodes, cables };
      }

      case 'tunneling': {
        const nodes: VisualNode[] = [
          {
            id: 'host-a',
            name: 'IPv6 Host (Site A)',
            type: 'host-v6',
            x: 20,
            y: 65,
            w: 138,
            h: 88,
            ipv6: '2001:db8:1::10',
            protocols: { ipv6: true },
            ports: [{ id: 'eth0', name: 'eth0', side: 'right', protocol: 'ipv6' }]
          },
          {
            id: 'te-a',
            name: 'Tunnel Gateway A',
            type: 'tunnel-endpoint',
            x: 243,
            y: 65,
            w: 148,
            h: 88,
            ipv4: '192.0.2.1',
            ipv6: '2001:db8:1::1',
            protocols: { ipv4: true, ipv6: true },
            ports: [
              { id: 'v6-in', name: 'IPv6 LAN', side: 'left', protocol: 'ipv6' },
              { id: 'v4-tun', name: 'Tunnel', side: 'right', protocol: 'ipv4' }
            ]
          },
          {
            id: 'transit',
            name: 'IPv4 Transit Cloud',
            type: 'network-v4',
            x: 491,
            y: 65,
            w: 138,
            h: 88,
            ipv4: 'Backbone',
            protocols: { ipv4: true },
            ports: [
              { id: 'p0', name: 'Port A', side: 'left', protocol: 'ipv4' },
              { id: 'p1', name: 'Port B', side: 'right', protocol: 'ipv4' }
            ]
          },
          {
            id: 'te-b',
            name: 'Tunnel Gateway B',
            type: 'tunnel-endpoint',
            x: 729,
            y: 65,
            w: 148,
            h: 88,
            ipv4: '192.0.2.2',
            ipv6: '2001:db8:2::1',
            protocols: { ipv4: true, ipv6: true },
            ports: [
              { id: 'v4-tun', name: 'Tunnel', side: 'left', protocol: 'ipv4' },
              { id: 'v6-in', name: 'IPv6 LAN', side: 'right', protocol: 'ipv6' }
            ]
          },
          {
            id: 'host-b',
            name: 'IPv6 Host (Site B)',
            type: 'host-v6',
            x: 962,
            y: 65,
            w: 138,
            h: 88,
            ipv6: '2001:db8:2::20',
            protocols: { ipv6: true },
            ports: [{ id: 'eth0', name: 'eth0', side: 'left', protocol: 'ipv6' }]
          }
        ];

        const cables: VisualCable[] = [
          {
            id: 'c-hostA-gwA',
            from: { x: 158, y: 109 },
            to: { x: 243, y: 109 },
            protocol: 'ipv6',
            label: 'IPv6'
          },
          {
            id: 'c-gwA-transit',
            from: { x: 391, y: 109 },
            to: { x: 491, y: 109 },
            protocol: 'ipv4',
            label: 'Proto 41'
          },
          {
            id: 'c-transit-gwB',
            from: { x: 629, y: 109 },
            to: { x: 729, y: 109 },
            protocol: 'ipv4',
            label: 'Proto 41'
          },
          {
            id: 'c-gwB-hostB',
            from: { x: 877, y: 109 },
            to: { x: 962, y: 109 },
            protocol: 'ipv6',
            label: 'IPv6'
          }
        ];

        return { width: 1120, height: 220, nodes, cables };
      }

      case 'translation':
      default: {
        const nodes: VisualNode[] = [
          {
            id: 'client',
            name: 'IPv6 Client',
            type: 'host-v6',
            x: 25,
            y: 70,
            w: 185,
            h: 92,
            ipv6: '2001:db8::10',
            protocols: { ipv6: true },
            ports: [{ id: 'eth0', name: 'eth0', side: 'right', protocol: 'ipv6' }]
          },
          {
            id: 'nat64',
            name: 'NAT64 Translator',
            type: 'nat64-translator',
            x: 335,
            y: 70,
            w: 195,
            h: 92,
            ipv4: '192.0.2.1 (Pool)',
            ipv6: '64:ff9b::/96',
            protocols: { ipv4: true, ipv6: true },
            ports: [
              { id: 'v6-side', name: 'IPv6 In', side: 'left', protocol: 'ipv6' },
              { id: 'v4-side', name: 'IPv4 Out', side: 'right', protocol: 'ipv4' }
            ]
          },
          {
            id: 'server',
            name: 'IPv4 Web Server',
            type: 'server-v4',
            x: 675,
            y: 70,
            w: 185,
            h: 92,
            ipv4: '198.51.100.25',
            protocols: { ipv4: true },
            ports: [{ id: 'eth0', name: 'eth0', side: 'left', protocol: 'ipv4' }]
          }
        ];

        const cables: VisualCable[] = [
          {
            id: 'c-client-nat',
            from: { x: 210, y: 116 },
            to: { x: 335, y: 116 },
            protocol: 'ipv6',
            label: 'IPv6 Traffic'
          },
          {
            id: 'c-nat-server',
            from: { x: 530, y: 116 },
            to: { x: 675, y: 116 },
            protocol: 'ipv4',
            label: 'IPv4 Translated'
          }
        ];

        return { width: 885, height: 230, nodes, cables };
      }
    }
  };

  const { width, height, nodes, cables } = getDiagramData();

  const getPillWidth = (label: string) => {
    // Dynamic pill width based on text length with generous padding
    return Math.max(50, Math.round(label.length * 7.2) + 20);
  };

  const getDeviceIcon = (type: string) => {
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
        return <Layers className={`${iconClass} text-neutral-400`} />;
    }
  };

  const getCableStroke = (protocol: VisualCable['protocol'], isHov: boolean) => {
    if (isHov) return '#ffffff';
    switch (protocol) {
      case 'ipv4':
        return '#ff9f0a';
      case 'ipv6':
        return '#2997ff';
      default:
        return '#a855f7';
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center bg-[#0d0d0f] border border-white/[0.1] rounded-2xl p-4 sm:p-5 select-none shadow-2xl">
      {/* Blueprint Sub-bar */}
      <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2997ff] shadow-[0_0_8px_#2997ff]" />
          <span className="font-bold uppercase tracking-wider text-white">Target Reference Architecture</span>
        </div>
        <span className="text-neutral-400 text-[11px] font-sans">Razor-sharp reference preview</span>
      </div>

      {/* Razor-sharp Vector & Card Canvas */}
      <div className="w-full overflow-x-auto [scrollbar-width:thin] py-1">
        <div
          style={{ width: `${width}px`, height: `${height}px` }}
          className="relative mx-auto shrink-0"
        >
          {/* Layer 1: SVG Vector Cables (lines, connectors, hover hitboxes) */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-auto z-10"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            {cables.map((cable) => {
              const { from, to, protocol } = cable;
              const isHov = hoveredCableId === cable.id;

              const dx = Math.abs(to.x - from.x);
              const dy = Math.abs(to.y - from.y);
              const offset = Math.max(dx * 0.45, dy * 0.35, 25);
              const pathD = `M ${from.x} ${from.y} C ${from.x + offset} ${from.y}, ${to.x - offset} ${to.y}, ${to.x} ${to.y}`;

              const strokeColor = getCableStroke(protocol, isHov);

              return (
                <g
                  key={cable.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredCableId(cable.id)}
                  onMouseLeave={() => setHoveredCableId(null)}
                >
                  {/* Invisible broad hitbox */}
                  <path d={pathD} fill="none" stroke="transparent" strokeWidth="24" />

                  {/* Outer Glow on hover */}
                  {isHov && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="8"
                      opacity="0.35"
                      className="animate-pulse"
                    />
                  )}

                  {/* Visible Cable */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isHov ? 4 : 3}
                    strokeDasharray={protocol === 'ipv4' && blueprint.labType === 'tunneling' ? '6 4' : undefined}
                    className="transition-all duration-150"
                  />

                  {/* Port Connectors at Ends */}
                  <circle cx={from.x} cy={from.y} r={4.5} fill={strokeColor} />
                  <circle cx={to.x} cy={to.y} r={4.5} fill={strokeColor} />
                </g>
              );
            })}
          </svg>

          {/* Layer 2: Crisp Device Nodes */}
          {nodes.map((node) => {
            const isHov = hoveredNodeId === node.id;

            return (
              <div
                key={node.id}
                style={{
                  transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                  width: `${node.w}px`,
                  height: `${node.h}px`
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={`absolute rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-xl z-20 ${
                  isHov
                    ? 'bg-[#1e1e24] border-2 border-[#2997ff] ring-4 ring-[#2997ff]/25 shadow-[0_0_20px_rgba(41,151,255,0.3)]'
                    : 'bg-[#151518] border border-white/[0.14] hover:border-white/[0.28]'
                }`}
              >
                {/* Node Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-5 h-5 rounded-lg bg-black/60 border border-white/[0.1] flex items-center justify-center shrink-0">
                      {getDeviceIcon(node.type)}
                    </div>
                    <span className="text-[11px] font-bold text-white tracking-tight truncate">
                      {node.name}
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#30d158] shadow-[0_0_6px_#30d158] shrink-0" />
                </div>

                {/* Node IP Badges */}
                <div className="flex flex-col gap-0.5 text-[9.5px] font-mono leading-none my-auto px-0.5">
                  {node.ipv4 && (
                    <div className="flex items-center justify-between text-[#ff9f0a]">
                      <span className="text-[8px] font-bold text-neutral-500">v4</span>
                      <span className="truncate font-semibold">{node.ipv4}</span>
                    </div>
                  )}
                  {node.ipv6 && (
                    <div className="flex items-center justify-between text-[#2997ff]">
                      <span className="text-[8px] font-bold text-neutral-500">v6</span>
                      <span className="truncate font-semibold">{node.ipv6}</span>
                    </div>
                  )}
                </div>

                {/* Protocol Tags & Ports count */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[8px] font-mono uppercase">
                  <div className="flex items-center gap-1 font-bold">
                    {node.protocols.ipv4 && (
                      <span className="px-1.5 py-0.2 rounded bg-[#ff9f0a]/20 text-[#ff9f0a] border border-[#ff9f0a]/30">
                        IPv4
                      </span>
                    )}
                    {node.protocols.ipv6 && (
                      <span className="px-1.5 py-0.2 rounded bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/30">
                        IPv6
                      </span>
                    )}
                  </div>
                  <span className="text-neutral-400 font-semibold">{node.ports.length} Port{node.ports.length > 1 ? 's' : ''}</span>
                </div>
              </div>
            );
          })}

          {/* Layer 3: Cable Connection Labels (Top Layer: Never hidden or clipped by cards!) */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-30"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            {cables.map((cable) => {
              if (!cable.label) return null;
              const { from, to, protocol } = cable;
              const isHov = hoveredCableId === cable.id;
              const strokeColor = getCableStroke(protocol, isHov);
              const pillW = getPillWidth(cable.label);
              const halfW = pillW / 2;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;

              return (
                <g key={`lbl-${cable.id}`} transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x={-halfW}
                    y="-11"
                    width={pillW}
                    height="22"
                    rx="11"
                    fill="#131317"
                    stroke={strokeColor}
                    strokeWidth={isHov ? 2 : 1.5}
                    className="shadow-xl"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#ffffff"
                    fontFamily="monospace"
                    letterSpacing="0.02em"
                  >
                    {cable.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Clue Bar */}
      <div className="w-full mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-300">
          <Info className="w-4 h-4 text-[#2997ff] shrink-0" />
          <span>
            {hoveredNodeId ? (
              <span className="text-white">
                Device Target: <strong className="text-[#2997ff]">{nodes.find(n => n.id === hoveredNodeId)?.name}</strong>
              </span>
            ) : hoveredCableId ? (
              <span className="text-white">
                Wire this link using the corresponding device ports.
              </span>
            ) : (
              'Assemble devices and cables to match this exact layout'
            )}
          </span>
        </div>
        <span className="text-neutral-500 hidden sm:inline text-[11px]">
          {nodes.length} Devices • {cables.length} Connections
        </span>
      </div>
    </div>
  );
};
