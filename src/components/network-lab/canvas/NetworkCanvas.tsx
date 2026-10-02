'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Grid, Target, BookOpen, Trash2 } from 'lucide-react';
import { NetworkDevice, DeviceConnection, PacketData, DeviceType } from '../types';
import { GridBackground } from './GridBackground';
import { DeviceNode } from './DeviceNode';
import { CableConnection } from './CableConnection';
import { PacketRenderer } from './PacketRenderer';
import { MiniMap } from './MiniMap';
import { getPortCoordinates, generateBezierPath } from '../engine/graphUtils';

interface NetworkCanvasProps {
  devices: NetworkDevice[];
  connections: DeviceConnection[];
  selectedDeviceId: string | null;
  selectedConnectionId: string | null;
  activePacket: PacketData | null;
  activeHopDeviceId?: string;
  snapToGrid: boolean;
  onSelectDevice: (id: string | null) => void;
  onSelectConnection: (id: string | null) => void;
  onUpdateDevicePosition: (id: string, x: number, y: number) => void;
  onConnectPorts: (sourceDevId: string, sourcePortId: string, targetDevId: string, targetPortId: string) => void;
  onDeleteConnection: (id: string) => void;
  onDeleteDevice?: (id: string) => void;
  onAddDeviceFromToolbox: (type: DeviceType, x: number, y: number) => void;
  onPacketClick: (packet: PacketData) => void;
  onToggleSnap: () => void;
  onOpenTargetTopology?: () => void;
  onOpenHowToBuild?: () => void;
}

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  devices,
  connections,
  selectedDeviceId,
  selectedConnectionId,
  activePacket,
  activeHopDeviceId,
  snapToGrid,
  onSelectDevice,
  onSelectConnection,
  onUpdateDevicePosition,
  onConnectPorts,
  onDeleteConnection,
  onDeleteDevice,
  onAddDeviceFromToolbox,
  onPacketClick,
  onToggleSnap,
  onOpenTargetTopology,
  onOpenHowToBuild
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Delete key shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused on an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedDeviceId && onDeleteDevice) {
          e.preventDefault();
          onDeleteDevice(selectedDeviceId);
        } else if (selectedConnectionId) {
          e.preventDefault();
          onDeleteConnection(selectedConnectionId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDeviceId, selectedConnectionId, onDeleteDevice, onDeleteConnection]);

  // Node Dragging State
  const [draggingDeviceId, setDraggingDeviceId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Trash Zone State & Ref
  const [isOverTrash, setIsOverTrash] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  // Cable Connection Dragging State
  const [connectingFrom, setConnectingFrom] = useState<{
    deviceId: string;
    portId: string;
  } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Container dimensions
  const [dims, setDims] = useState({ width: 900, height: 600 });

  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        setDims({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Zoom handlers
  const handleZoom = useCallback((delta: number, clientX?: number, clientY?: number) => {
    setZoom((prevZoom) => {
      const newZoom = Math.min(Math.max(prevZoom + delta, 0.4), 2.0);
      if (clientX !== undefined && clientY !== undefined && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        setPan((prevPan) => ({
          x: mouseX - (mouseX - prevPan.x) * (newZoom / prevZoom),
          y: mouseY - (mouseY - prevPan.y) * (newZoom / prevZoom)
        }));
      }
      return newZoom;
    });
  }, []);

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 40, y: 40 });
  };

  const handleFitView = () => {
    if (devices.length === 0) {
      handleResetView();
      return;
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    devices.forEach((d) => {
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x + 180);
      minY = Math.min(minY, d.y);
      maxY = Math.max(maxY, d.y + 100);
    });

    const padding = 80;
    const contentW = maxX - minX + padding * 2;
    const contentH = maxY - minY + padding * 2;

    const scaleX = dims.width / contentW;
    const scaleY = dims.height / contentH;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.5), 1.4);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoom(newZoom);
    setPan({
      x: dims.width / 2 - centerX * newZoom,
      y: dims.height / 2 - centerY * newZoom
    });
  };

  // Pan / Canvas Mouse Down
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      onSelectDevice(null);
      onSelectConnection(null);
    }
  };

  // Node Drag Start
  const handleStartNodeDrag = (e: React.MouseEvent, deviceId: string) => {
    e.stopPropagation();
    const dev = devices.find((d) => d.id === deviceId);
    if (!dev || !containerRef.current) return;

    setDraggingDeviceId(deviceId);
    const rect = containerRef.current.getBoundingClientRect();
    const mouseCanvasX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseCanvasY = (e.clientY - rect.top - pan.y) / zoom;

    dragOffsetRef.current = {
      x: mouseCanvasX - dev.x,
      y: mouseCanvasY - dev.y
    };
  };

  // Port Mouse Down (Start connecting)
  const handlePortMouseDown = (e: React.MouseEvent, deviceId: string, portId: string) => {
    e.stopPropagation();
    setConnectingFrom({ deviceId, portId });
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursorPos({
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom
      });
    }
  };

  // Port Mouse Up (Complete connection)
  const handlePortMouseUp = (e: React.MouseEvent, deviceId: string, portId: string) => {
    e.stopPropagation();
    if (connectingFrom && connectingFrom.deviceId !== deviceId) {
      onConnectPorts(connectingFrom.deviceId, connectingFrom.portId, deviceId, portId);
    }
    setConnectingFrom(null);
  };

  // Global Mouse Move & Up
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      });
    } else if (draggingDeviceId) {
      // Check if mouse is hovering over top-right trash drop zone
      if (trashRef.current) {
        const trashRect = trashRef.current.getBoundingClientRect();
        const isOver = (
          e.clientX >= trashRect.left - 20 &&
          e.clientX <= trashRect.right + 20 &&
          e.clientY >= trashRect.top - 20 &&
          e.clientY <= trashRect.bottom + 20
        );
        setIsOverTrash(isOver);
      }

      const mouseCanvasX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseCanvasY = (e.clientY - rect.top - pan.y) / zoom;
      let newX = mouseCanvasX - dragOffsetRef.current.x;
      let newY = mouseCanvasY - dragOffsetRef.current.y;

      if (snapToGrid) {
        newX = Math.round(newX / 20) * 20;
        newY = Math.round(newY / 20) * 20;
      }

      onUpdateDevicePosition(draggingDeviceId, Math.max(0, newX), Math.max(0, newY));
    } else if (connectingFrom) {
      setCursorPos({
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom
      });
    }
  };

  const handleMouseUp = () => {
    if (draggingDeviceId && isOverTrash) {
      onDeleteDevice?.(draggingDeviceId);
    }
    setIsPanning(false);
    setDraggingDeviceId(null);
    setIsOverTrash(false);
    setConnectingFrom(null);
  };

  // Drag and Drop from Toolbox
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/dcn-device-type') as DeviceType;
    if (!type || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left - pan.x) / zoom - 90;
    let y = (e.clientY - rect.top - pan.y) / zoom - 50;

    if (snapToGrid) {
      x = Math.round(x / 20) * 20;
      y = Math.round(y / 20) * 20;
    }

    onAddDeviceFromToolbox(type, Math.max(20, x), Math.max(20, y));
  };

  // Preview path while dragging a connection from a port
  let tempConnectionPath: string | null = null;
  if (connectingFrom) {
    const srcDev = devices.find((d) => d.id === connectingFrom.deviceId);
    if (srcDev) {
      const srcPort = srcDev.ports.find((p) => p.id === connectingFrom.portId) || {
        id: connectingFrom.portId,
        name: 'port',
        position: 'right' as const,
        protocol: 'both' as const
      };
      const p1 = getPortCoordinates(srcDev, srcPort);
      tempConnectionPath = generateBezierPath(p1, cursorPos, srcPort.position, 'left');
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative w-full h-full min-h-[560px] bg-[#0c0c0e] rounded-2xl md:rounded-[2rem] border border-neutral-800 overflow-hidden select-none cursor-${
        isPanning ? 'grabbing' : 'default'
      }`}
    >
      {/* Background Subtle Grid */}
      <GridBackground zoom={zoom} pan={pan} />

      {/* Floating Canvas Controls (Zoom, Fit, Snap) */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-[#161617]/90 backdrop-blur-md border border-neutral-800 rounded-xl p-1 shadow-2xl">
        <button
          onClick={() => handleZoom(0.15)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.15)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-neutral-800 mx-0.5" />
        <button
          onClick={handleResetView}
          className="px-2 py-1 rounded-lg hover:bg-white/10 text-[10px] font-mono font-medium text-neutral-400 hover:text-white transition-colors"
          title="Reset Zoom to 100%"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={handleFitView}
          className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          title="Fit Topology to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleSnap}
          className={`p-1.5 rounded-lg transition-colors ${
            snapToGrid
              ? 'bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/40'
              : 'hover:bg-white/10 text-neutral-400 hover:text-white'
          }`}
          title="Toggle Snap to Grid (20px)"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Top-Right Trash Drop Zone: Drag device here to delete */}
      <div
        ref={trashRef}
        onMouseEnter={() => draggingDeviceId && setIsOverTrash(true)}
        onMouseLeave={() => setIsOverTrash(false)}
        onClick={() => {
          if (selectedDeviceId && onDeleteDevice) {
            onDeleteDevice(selectedDeviceId);
          }
        }}
        className={`absolute top-4 right-4 z-40 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all duration-200 select-none shadow-2xl cursor-pointer ${
          !draggingDeviceId && !selectedDeviceId
            ? 'opacity-0 scale-90 pointer-events-none -translate-y-2'
            : 'opacity-100 scale-100 translate-y-0'
        } ${
          isOverTrash
            ? 'bg-red-500/25 border-red-500 text-red-200 ring-4 ring-red-500/35 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.55)]'
            : draggingDeviceId
            ? 'bg-[#18181b]/95 border-red-500/40 text-red-400 hover:border-red-500 animate-pulse'
            : 'bg-[#161617]/90 hover:bg-red-950/40 border-neutral-800 hover:border-red-500/50 text-neutral-400 hover:text-red-400'
        }`}
        title="Drag to delete"
      >
        <div
          className={`p-1.5 rounded-lg transition-all ${
            isOverTrash ? 'bg-red-500 text-white animate-bounce' : 'bg-red-500/15 text-red-400'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </div>
        <span className="text-[11px] font-mono font-medium tracking-tight text-neutral-200">
          {isOverTrash ? 'Release to delete' : 'Drag to delete'}
        </span>
      </div>

      {/* Scaled/Panned Graph Workspace */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {/* SVG Layer for Cables & Connections */}
        <svg className="absolute inset-0 overflow-visible w-full h-full pointer-events-auto">
          {connections.map((conn) => {
            const src = devices.find((d) => d.id === conn.sourceDeviceId);
            const dst = devices.find((d) => d.id === conn.targetDeviceId);
            if (!src || !dst) return null;

            return (
              <CableConnection
                key={conn.id}
                connection={conn}
                sourceDevice={src}
                targetDevice={dst}
                isSelected={selectedConnectionId === conn.id}
                isActivePath={conn.status === 'active'}
                onSelect={(e) => {
                  e.stopPropagation();
                  onSelectConnection(conn.id);
                  onSelectDevice(null);
                }}
                onDelete={onDeleteConnection}
              />
            );
          })}

          {/* Interactive Dragging Cable Preview */}
          {tempConnectionPath && (
            <path
              d={tempConnectionPath}
              fill="none"
              stroke="#2997ff"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* HTML Layer for Device Nodes */}
        <div className="absolute inset-0 pointer-events-auto">
          {devices.map((device) => (
            <DeviceNode
              key={device.id}
              device={device}
              isSelected={selectedDeviceId === device.id}
              isSimulatingHop={activeHopDeviceId === device.id}
              connectingSourcePortId={
                connectingFrom ? `${connectingFrom.deviceId}:${connectingFrom.portId}` : null
              }
              onSelect={(e, id) => {
                e.stopPropagation();
                onSelectDevice(id);
                onSelectConnection(null);
              }}
              onStartDrag={handleStartNodeDrag}
              onPortMouseDown={handlePortMouseDown}
              onPortMouseUp={handlePortMouseUp}
              onDelete={onDeleteDevice}
            />
          ))}

          {/* Animated Packet */}
          {activePacket && (
            <PacketRenderer packet={activePacket} onClick={onPacketClick} />
          )}
        </div>
      </div>

      {/* Empty State Overlay: Clean & Minimal Text */}
      {devices.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-center mb-3 text-[#2997ff] shadow-xl">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight mb-1 font-mono uppercase">
            Assemble Target Topology
          </h3>
          <p className="text-[11px] text-neutral-400 max-w-xs leading-normal mb-4">
            Drag devices from the left and wire ports together.
          </p>
          <div className="flex items-center gap-2 pointer-events-auto">
            {onOpenHowToBuild && (
              <button
                onClick={onOpenHowToBuild}
                className="px-4 py-2 rounded-xl bg-[#2997ff]/20 hover:bg-[#2997ff]/30 text-[#2997ff] text-xs font-semibold border border-[#2997ff]/40 shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Build Guide</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mini Map */}
      <MiniMap
        devices={devices}
        connections={connections}
        zoom={zoom}
        pan={pan}
        canvasWidth={dims.width}
        canvasHeight={dims.height}
      />
    </div>
  );
};
