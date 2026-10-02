'use client';

import React from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Layers } from 'lucide-react';
import { LabBlueprint, NetworkDevice, DeviceConnection, TopologyCheckResult } from '../types';

interface CompareTopologyModalProps {
  blueprint: LabBlueprint;
  currentDevices: NetworkDevice[];
  currentConnections: DeviceConnection[];
  checkResult: TopologyCheckResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CompareTopologyModal: React.FC<CompareTopologyModalProps> = ({
  blueprint,
  currentDevices,
  currentConnections,
  checkResult,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const targetDevs = blueprint.targetTopology.devices;
  const targetConns = blueprint.targetTopology.connections;

  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#161617] border border-neutral-700/80 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto [scrollbar-width:thin] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff9f0a]" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                Topology Comparison Diagnostic
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Compare your current canvas assembly directly against the target blueprint specification.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono bg-black/40 border border-neutral-800 p-2.5 rounded-xl flex-wrap">
          <span className="text-neutral-500 font-bold uppercase">Color Key:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#30d158]/20 border border-[#30d158] flex items-center justify-center text-[#30d158] text-[8px]">✓</span>
            <span className="text-neutral-300">Green = Correct</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-950/40 border border-red-500 flex items-center justify-center text-red-400 text-[8px]">✕</span>
            <span className="text-neutral-300">Red = Missing Component/Link</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-950/40 border border-amber-500 flex items-center justify-center text-amber-400 text-[8px]">!</span>
            <span className="text-neutral-300">Yellow = Address/Config Incomplete</span>
          </div>
        </div>

        {/* Side-by-side Device Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Blueprint Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2997ff]">
                Target Architecture
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                {targetDevs.length} Devices • {targetConns.length} Links
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {blueprint.requiredComponents.map((req, idx) => (
                <div
                  key={req.id || `${req.type}-${idx}`}
                  className="p-3 rounded-xl bg-black/40 border border-neutral-800 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">{req.label}</span>
                    <span className="text-[10px] text-neutral-500 font-sans">{req.description}</span>
                  </div>
                  <span className="text-[10px] text-[#2997ff] bg-[#2997ff]/10 px-2 py-0.5 rounded font-bold">
                    1 Needed
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Network Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Your Current Canvas
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {currentDevices.length} Placed • {currentConnections.length} Linked
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {blueprint.requiredComponents.map((req, idx) => {
                const found = currentDevices.filter((d) => {
                  if (req.type === 'host-dual') return d.type === 'host-dual' || (d.protocols.ipv4 && d.protocols.ipv6 && d.type.startsWith('host'));
                  if (req.type === 'host-v6') return d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6);
                  if (req.type === 'router') return d.type === 'router' || (d.type.startsWith('router') && d.protocols.ipv4 && d.protocols.ipv6);
                  if (req.type === 'server-v4') return d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4);
                  if (req.type === 'server-v6') return d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6);
                  return d.type === req.type;
                });

                const sameTypeBefore = blueprint.requiredComponents.slice(0, idx).filter((c) => c.type === req.type);
                const prevNeeded = sameTypeBefore.reduce((acc, c) => acc + c.count, 0);
                const allocated = Math.min(req.count, Math.max(0, found.length - prevNeeded));
                const isMissing = allocated < req.count;
                const dev = found[prevNeeded] || found[0];
                const hasConfigIssue = dev && ((req.requiredIpv4 && !dev.ipv4) || (req.requiredIpv6 && !dev.ipv6));

                return (
                  <div
                    key={req.id || `${req.type}-${idx}`}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isMissing
                        ? 'bg-red-950/20 border-red-500/40 text-red-300'
                        : hasConfigIssue
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                        : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isMissing ? (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      ) : hasConfigIssue ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#30d158] shrink-0" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {isMissing ? req.label : dev.name}
                        </span>
                        <span className="text-[10px] opacity-75 font-sans">
                          {isMissing
                            ? 'Not placed on canvas yet'
                            : hasConfigIssue
                            ? 'Address configuration needed in inspector'
                            : 'Placed and configured'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40">
                      {found.length}/{req.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Itemized Checklist from Checker */}
        {checkResult && (
          <div className="space-y-2 border-t border-white/[0.08] pt-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block">
              Validation Diagnostic Breakdown ({checkResult.score}% Complete)
            </span>
            <div className="space-y-1.5 text-xs font-mono">
              {checkResult.items.map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border flex items-start justify-between gap-3 ${
                    item.status === 'passed'
                      ? 'bg-emerald-950/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-red-950/15 border-red-500/30 text-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {item.status === 'passed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-white">{item.label}</span>
                      <p className="text-[11px] opacity-80 font-sans mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0 bg-black/40">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-md cursor-pointer"
          >
            Return to Canvas to Fix
          </button>
        </div>
      </div>
    </div>
  );
};
