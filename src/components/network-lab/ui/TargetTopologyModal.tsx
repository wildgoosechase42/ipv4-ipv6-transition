'use client';

import React from 'react';
import { X, Target, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { LabBlueprint } from '../types';
import { ReferenceTopologyVisual } from './ReferenceTopologyVisual';

interface TargetTopologyModalProps {
  blueprint: LabBlueprint;
  isOpen: boolean;
  onClose: () => void;
}

export const TargetTopologyModal: React.FC<TargetTopologyModalProps> = ({
  blueprint,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#161617] border border-neutral-700/80 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto [scrollbar-width:thin] space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2997ff]/10 border border-[#2997ff]/30 flex items-center justify-center text-[#2997ff]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#2997ff] font-bold">
                Target Architecture Blueprint
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                {blueprint.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal */}
        <p className="text-xs text-neutral-300 bg-black/40 border border-neutral-800 p-3 rounded-2xl font-sans">
          {blueprint.goal}
        </p>

        {/* Blueprint Visual Reference */}
        <div>
          <ReferenceTopologyVisual blueprint={blueprint} isExpanded={true} />
        </div>

        {/* Required Hardware */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          {blueprint.requiredComponents.map((comp, idx) => (
            <div
              key={comp.id || `${comp.type}-${idx}`}
              className="p-2.5 rounded-xl bg-black/30 border border-neutral-800 flex items-center justify-between"
            >
              <span className="text-white font-bold text-xs truncate">{comp.label}</span>
              <span className="text-[10px] text-[#2997ff] bg-[#2997ff]/10 px-1.5 py-0.5 rounded font-bold shrink-0">
                ×{comp.count}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <a
            href={blueprint.theoryAnchor}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2997ff] hover:underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read full theory section</span>
          </a>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-md cursor-pointer"
          >
            Got It • Return to Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
