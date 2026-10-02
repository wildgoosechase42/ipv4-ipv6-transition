'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  BookOpen,
  Target,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Trash2,
  MoreHorizontal,
  Circle,
  ArrowRight
} from 'lucide-react';
import { LabBlueprint, TopologyCheckResult } from '../types';

interface TopBarProps {
  blueprint: LabBlueprint;
  simStatus: 'idle' | 'ready' | 'running' | 'paused' | 'completed' | 'error';
  checkResult: TopologyCheckResult | null;
  buildProgress?: {
    isDevicesPlaced: boolean;
    isLinked: boolean;
    isChecked: boolean;
    isSimulated: boolean;
  };
  onOpenHowToBuild: () => void;
  onCheckNetwork: () => void;
  onOpenCompare: () => void;
  onRunSimulation: (protocol?: 'ipv4' | 'ipv6') => void;
  onResetSimulation: () => void;
  onLoadPreset: () => void;
  onClearCanvas: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  blueprint,
  simStatus,
  checkResult,
  buildProgress,
  onOpenHowToBuild,
  onCheckNetwork,
  onOpenCompare,
  onRunSimulation,
  onResetSimulation,
  onLoadPreset,
  onClearCanvas
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isDualStack = blueprint.labType === 'dual-stack';
  const isNetworkReady = checkResult?.isReady === true;

  const shortTitle = blueprint.title
    .replace(' Network Blueprint', '')
    .replace(' Blueprint', '')
    .replace(' Stateful Translation', '')
    .replace(' IPv6-in-IPv4', '');

  return (
    <header className="w-full bg-[#121214] border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between gap-4 select-none">
      {/* Left: Lab Name & Compact Assembly Progress */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2997ff] ring-4 ring-[#2997ff]/20 animate-pulse" />
          <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase font-mono truncate">
            {shortTitle}
          </h2>
        </div>

        {/* Compact Integrated Progress Chips */}
        {buildProgress && (
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-neutral-800 text-[10px] font-mono">
            <span
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                buildProgress.isDevicesPlaced ? 'text-[#30d158] bg-emerald-950/40' : 'text-neutral-500'
              }`}
            >
              {buildProgress.isDevicesPlaced ? '✓' : '1'} Devices
            </span>
            <span className="text-neutral-600">→</span>
            <span
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                buildProgress.isLinked ? 'text-[#30d158] bg-emerald-950/40' : 'text-neutral-500'
              }`}
            >
              {buildProgress.isLinked ? '✓' : '2'} Cables
            </span>
            <span className="text-neutral-600">→</span>
            <span
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                buildProgress.isChecked ? 'text-[#30d158] bg-emerald-950/40' : 'text-neutral-500'
              }`}
            >
              {buildProgress.isChecked ? '✓' : '3'} Check
            </span>
            <span className="text-neutral-600">→</span>
            <span
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                buildProgress.isSimulated ? 'text-[#30d158] bg-emerald-950/40' : 'text-neutral-500'
              }`}
            >
              {buildProgress.isSimulated ? '✓' : '4'} Sim
            </span>
          </div>
        )}
      </div>

      {/* Right: Primary Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Guide */}
        <button
          onClick={onOpenHowToBuild}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2997ff]/15 hover:bg-[#2997ff]/25 border border-[#2997ff]/30 text-xs font-semibold text-[#2997ff] hover:text-white transition-all cursor-pointer shadow-sm"
          title="Open build guide"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guide</span>
        </button>

        {/* Check */}
        <button
          onClick={onCheckNetwork}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
            isNetworkReady
              ? 'bg-emerald-950/50 border-emerald-500/50 text-[#30d158]'
              : checkResult && !isNetworkReady
              ? 'bg-amber-950/50 border-amber-500/50 text-amber-400'
              : 'bg-white/[0.08] hover:bg-white/[0.12] border-white/[0.12] text-white'
          }`}
          title="Validate topology"
        >
          {isNetworkReady ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158]" />
          ) : checkResult && !isNetworkReady ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>Check</span>
        </button>

        {/* Compare (if issues found) */}
        {checkResult && !isNetworkReady && (
          <button
            onClick={onOpenCompare}
            className="px-2.5 py-1.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-300 hover:bg-amber-900/40 text-xs font-semibold transition-all cursor-pointer"
            title="Compare with target"
          >
            Compare
          </button>
        )}

        {/* Simulation */}
        {isDualStack ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRunSimulation('ipv4')}
              disabled={simStatus === 'running'}
              className="px-3 py-1.5 rounded-xl bg-[#ff9f0a] hover:bg-[#ff9f0a]/90 active:scale-95 text-black font-bold text-xs transition-all shadow-md flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              title="Test IPv4"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>IPv4</span>
            </button>
            <button
              onClick={() => onRunSimulation('ipv6')}
              disabled={simStatus === 'running'}
              className="px-3 py-1.5 rounded-xl bg-[#2997ff] hover:bg-[#2997ff]/90 active:scale-95 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              title="Test IPv6"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>IPv6</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onRunSimulation()}
            disabled={simStatus === 'running'}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 active:scale-95 text-black font-bold text-xs transition-all shadow-md flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            title="Run simulation"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Simulate</span>
          </button>
        )}

        {/* Reset */}
        <button
          onClick={onResetSimulation}
          className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-400 hover:text-white transition-all cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Overflow Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-400 hover:text-white transition-all cursor-pointer"
            title="Options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#18181b] border border-neutral-700/80 rounded-2xl p-1.5 shadow-2xl z-50 text-xs font-mono select-none animate-in fade-in duration-150">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLoadPreset();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-neutral-200 hover:bg-neutral-800 text-left transition-colors cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#2997ff]" />
                <span>Load Solution</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onClearCanvas();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-red-400 hover:bg-red-950/40 text-left transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Canvas</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
