'use client';

import React from 'react';
import { X, CheckCircle2, ArrowRight, BookOpen, Layers, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { LabBlueprint, SimulationEvaluation } from '../types';

interface SimulationResultModalProps {
  blueprint: LabBlueprint;
  evaluation: SimulationEvaluation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationResultModal: React.FC<SimulationResultModalProps> = ({
  blueprint,
  evaluation,
  isOpen,
  onClose
}) => {
  if (!isOpen || !evaluation || !evaluation.success) return null;

  const firstStep = evaluation.steps[0];
  const lastStep = evaluation.steps[evaluation.steps.length - 1];

  const getLabIcon = () => {
    switch (blueprint.labType) {
      case 'dual-stack':
        return <Layers className="w-5 h-5 text-[#2997ff]" />;
      case 'tunneling':
        return <ShieldCheck className="w-5 h-5 text-[#ff9f0a]" />;
      case 'translation':
        return <ArrowRightLeft className="w-5 h-5 text-[#30d158]" />;
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#161617] border border-neutral-700/80 rounded-3xl p-6 shadow-2xl flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-[#30d158]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#30d158] font-bold block">
                Simulation Verified
              </span>
              <h2 className="text-lg font-bold tracking-tight text-white mt-0.5">
                Packet Delivered Successfully
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transmission Metadata Table */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-neutral-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
            <span className="text-neutral-500 uppercase">Mechanism:</span>
            <span className="text-white font-semibold capitalize flex items-center gap-1.5">
              {getLabIcon()}
              <span>{blueprint.title}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
            <span className="text-neutral-500 uppercase">Protocol:</span>
            <span
              className={`font-bold uppercase ${
                lastStep.packetUpdate.protocol === 'ipv4' ? 'text-[#ff9f0a]' : 'text-[#2997ff]'
              }`}
            >
              {lastStep.packetUpdate.protocol}
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
            <span className="text-neutral-500 uppercase">Source:</span>
            <span className="text-neutral-200">{firstStep.packetUpdate.currentDeviceName || 'Host'}</span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
            <span className="text-neutral-500 uppercase">Destination:</span>
            <span className="text-neutral-200">{lastStep.packetUpdate.currentDeviceName || 'Server'}</span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
            <span className="text-neutral-500 uppercase">Path:</span>
            <span className="text-[#30d158] font-bold text-[11px] truncate max-w-[280px]">
              {evaluation.steps.map((s) => s.packetUpdate.currentDeviceName || 'Node').join(' → ')}
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/80">
            <span className="text-neutral-500 uppercase">Hop Count:</span>
            <span className="text-neutral-200">{evaluation.steps.length} Hops Transited</span>
          </div>

          {evaluation.latencyMs && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 uppercase">Latency:</span>
              <span className="text-neutral-300">{evaluation.latencyMs}ms simulated RTT</span>
            </div>
          )}
        </div>

        {/* What Happened Card */}
        <div className="p-4 rounded-2xl bg-[#1c1c1f] border border-white/[0.08] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#2997ff]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>What Happened?</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans font-medium">
            {blueprint.explanationAfterSim.whatHappened}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <a
            href={blueprint.theoryAnchor}
            onClick={onClose}
            className="text-xs font-mono text-[#2997ff] hover:underline flex items-center gap-1"
          >
            <span>Review Theory</span>
            <ArrowRight className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-md cursor-pointer"
          >
            Continue Experimenting
          </button>
        </div>
      </div>
    </div>
  );
};
