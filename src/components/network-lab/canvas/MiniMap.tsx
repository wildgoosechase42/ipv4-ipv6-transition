'use client';

import React from 'react';
import { NetworkDevice, DeviceConnection } from '../types';

interface MiniMapProps {
  devices: NetworkDevice[];
  connections: DeviceConnection[];
  zoom: number;
  pan: { x: number; y: number };
  canvasWidth: number;
  canvasHeight: number;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  devices,
  connections,
  zoom,
  pan,
  canvasWidth,
  canvasHeight
}) => {
  if (devices.length === 0) return null;

  const mapWidth = 140;
  const mapHeight = 90;

  // Compute bounding box of all devices
  let minX = 0;
  let maxX = 1200;
  let minY = 0;
  let maxY = 800;

  devices.forEach((d) => {
    minX = Math.min(minX, d.x - 50);
    maxX = Math.max(maxX, d.x + 250);
    minY = Math.min(minY, d.y - 50);
    maxY = Math.max(maxY, d.y + 150);
  });

  const worldWidth = Math.max(maxX - minX, 1000);
  const worldHeight = Math.max(maxY - minY, 600);

  const scaleX = mapWidth / worldWidth;
  const scaleY = mapHeight / worldHeight;
  const scale = Math.min(scaleX, scaleY);

  const worldToMap = (x: number, y: number) => ({
    x: (x - minX) * scale,
    y: (y - minY) * scale
  });

  // Calculate viewport rectangle in world coordinates
  const vpWorldX = -pan.x / zoom;
  const vpWorldY = -pan.y / zoom;
  const vpWorldW = canvasWidth / zoom;
  const vpWorldH = canvasHeight / zoom;

  const vpMapTopLeft = worldToMap(vpWorldX, vpWorldY);
  const vpMapW = Math.max(vpWorldW * scale, 15);
  const vpMapH = Math.max(vpWorldH * scale, 10);

  return (
    <div className="absolute bottom-3 right-3 z-30 bg-[#161617]/85 backdrop-blur-md border border-neutral-800 rounded-xl p-1 shadow-2xl overflow-hidden pointer-events-none select-none">
      <svg width={mapWidth} height={mapHeight} className="overflow-hidden">
        {/* Device Connections */}
        {connections.map((conn) => {
          const src = devices.find((d) => d.id === conn.sourceDeviceId);
          const dst = devices.find((d) => d.id === conn.targetDeviceId);
          if (!src || !dst) return null;
          const p1 = worldToMap(src.x + 90, src.y + 50);
          const p2 = worldToMap(dst.x + 90, dst.y + 50);
          return (
            <line
              key={conn.id}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* Devices */}
        {devices.map((d) => {
          const pt = worldToMap(d.x, d.y);
          const w = 180 * scale;
          const h = 100 * scale;
          const isV4 = d.protocols.ipv4 && !d.protocols.ipv6;
          const isV6 = !d.protocols.ipv4 && d.protocols.ipv6;
          const color = isV4 ? '#ff9f0a' : isV6 ? '#2997ff' : '#a855f7';

          return (
            <rect
              key={d.id}
              x={pt.x}
              y={pt.y}
              width={Math.max(w, 8)}
              height={Math.max(h, 5)}
              rx="2"
              fill={color}
              fillOpacity="0.8"
            />
          );
        })}

        {/* Viewport Box */}
        <rect
          x={vpMapTopLeft.x}
          y={vpMapTopLeft.y}
          width={vpMapW}
          height={vpMapH}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeOpacity="0.5"
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  );
};
