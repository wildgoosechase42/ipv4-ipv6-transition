'use client';

import React, { useState } from 'react';
import {
  Lightbulb,
  X,
  CheckCircle,
  Circle,
  HelpCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ChallengeItem, LabType } from '../types';
import { LAB_CHALLENGES } from '../presets/labPresets';

interface ChallengeDrawerProps {
  labType: LabType;
  isOpen: boolean;
  onClose: () => void;
  onLoadExample: () => void;
}

export const ChallengeDrawer: React.FC<ChallengeDrawerProps> = ({
  labType,
  isOpen,
  onClose,
  onLoadExample
}) => {
  const challenge = LAB_CHALLENGES[labType];
  const [unlockedHints, setUnlockedHints] = useState<number>(0);

  if (!isOpen) return null;

  const handleNextHint = () => {
    if (unlockedHints < challenge.hints.length) {
      setUnlockedHints(unlockedHints + 1);
    }
  };

  return (
    <div className="absolute top-14 right-4 z-40 w-80 sm:w-96 bg-[#161617]/95 backdrop-blur-xl border border-neutral-700/80 rounded-2xl p-4 shadow-2xl select-none animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Lab Challenge & Objectives
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Objective */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
            Primary Mission
          </span>
          <p className="text-xs text-neutral-200 leading-relaxed font-sans font-medium bg-black/40 border border-neutral-800 p-2.5 rounded-xl">
            {challenge.objective}
          </p>
        </div>

        {/* Checklist */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5">
            Requirements Checklist
          </span>
          <div className="space-y-1.5">
            {challenge.checklist.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px]"
              >
                <span className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center text-[9px] font-mono text-neutral-400 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-neutral-300 leading-snug">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progressive Hints System */}
        <div className="border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-amber-400 font-bold">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Progressive Hints</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">
              {unlockedHints}/{challenge.hints.length} revealed
            </span>
          </div>

          <div className="space-y-2 mb-3">
            {challenge.hints.slice(0, unlockedHints).map((hint, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed animate-in fade-in duration-200 font-sans"
              >
                {hint}
              </div>
            ))}
          </div>

          {unlockedHints < challenge.hints.length ? (
            <button
              onClick={handleNextHint}
              className="w-full py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 hover:bg-neutral-800 text-xs font-medium text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Unlock Next Hint ({unlockedHints + 1}/{challenge.hints.length})</span>
            </button>
          ) : (
            <div className="text-center text-[10px] font-mono text-neutral-500 italic">
              All hints unlocked! Need help? Load the editable example.
            </div>
          )}
        </div>

        {/* Load Example Option */}
        <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
          <span className="text-[10px] text-neutral-500 font-mono">Stuck?</span>
          <button
            onClick={() => {
              onLoadExample();
              onClose();
            }}
            className="text-xs text-[#2997ff] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>Load Working Topology</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
