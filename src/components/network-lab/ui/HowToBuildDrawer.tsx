'use client';

import React, { useEffect } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { LabBlueprint, NetworkDevice, DeviceConnection } from '../types';
import { ReferenceTopologyVisual } from './ReferenceTopologyVisual';

interface HowToBuildDrawerProps {
  blueprint: LabBlueprint;
  currentDevices: NetworkDevice[];
  currentConnections: DeviceConnection[];
  isOpen: boolean;
  onClose: () => void;
  onCheckNetwork: () => void;
}

export const HowToBuildDrawer: React.FC<HowToBuildDrawerProps> = ({
  blueprint,
  currentDevices,
  isOpen,
  onClose
}) => {
  // Prevent background body scroll while the modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none overscroll-contain animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-[#131316] border border-white/[0.14] rounded-3xl shadow-2xl flex flex-col max-h-[86vh] overflow-hidden">
        {/* Fixed Header: Always visible */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#161619]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#2997ff]/20 border border-[#2997ff]/30 flex items-center justify-center text-[#2997ff]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#2997ff] font-bold block">
                Assembly Guide
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                {blueprint.title.replace(' Network Blueprint', '').replace(' Blueprint', '')} Target Blueprint
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body: Over-scroll contained so whole website never scrolls */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 overscroll-contain [scrollbar-width:thin]">
          {/* Big Crisp Reference Architecture Diagram */}
          <ReferenceTopologyVisual blueprint={blueprint} isExpanded={true} />

          {/* Required Hardware Checklist */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
              Required Hardware
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {blueprint.requiredComponents.map((comp, idx) => {
                const matchingTotal = currentDevices.filter((d) => {
                  if (comp.type === 'host-dual') return d.type === 'host-dual' || (d.protocols.ipv4 && d.protocols.ipv6 && d.type.startsWith('host'));
                  if (comp.type === 'host-v6') return d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6);
                  if (comp.type === 'router') return d.type === 'router' || (d.type.startsWith('router') && d.protocols.ipv4 && d.protocols.ipv6);
                  if (comp.type === 'server-v4') return d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4);
                  if (comp.type === 'server-v6') return d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6);
                  return d.type === comp.type;
                }).length;

                const sameTypeBefore = blueprint.requiredComponents
                  .slice(0, idx)
                  .filter((c) => c.type === comp.type);
                const prevNeeded = sameTypeBefore.reduce((acc, c) => acc + c.count, 0);
                const countPlaced = Math.min(comp.count, Math.max(0, matchingTotal - prevNeeded));
                const isDone = countPlaced >= comp.count;

                return (
                  <div
                    key={comp.id || `${comp.type}-${idx}`}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-black/40 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158] shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                      )}
                      <span className="truncate text-xs font-medium text-white">{comp.label}</span>
                    </div>
                    <span className="text-[10px] font-bold shrink-0 ml-1">
                      {countPlaced}/{comp.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assembly Steps */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
              Assembly Steps
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              {blueprint.assemblySteps.map((s) => (
                <div
                  key={s.step}
                  className="p-2.5 rounded-xl bg-black/40 border border-neutral-800/80 flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded-lg bg-neutral-900 border border-neutral-700 text-[#2997ff] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {s.step}
                  </span>
                  <p className="text-[11px] text-neutral-200 leading-snug">{s.instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Footer: Always visible at bottom */}
        <div className="px-5 py-3 border-t border-white/[0.08] flex items-center justify-end shrink-0 bg-[#161619]">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
          >
            Got It • Return to Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
