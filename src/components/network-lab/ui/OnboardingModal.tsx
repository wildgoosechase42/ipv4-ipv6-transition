'use client';

import React from 'react';
import { MousePointer, Cable, Sliders, Play, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      icon: <MousePointer className="w-4 h-4 text-[#2997ff]" />,
      title: 'Drag Devices',
      desc: 'Drag network components from the left toolbox onto the canvas.'
    },
    {
      num: 2,
      icon: <Cable className="w-4 h-4 text-[#30d158]" />,
      title: 'Connect Cables',
      desc: 'Click and drag from a port to link devices together into a topology.'
    },
    {
      num: 3,
      icon: <Sliders className="w-4 h-4 text-[#ff9f0a]" />,
      title: 'Configure Properties',
      desc: 'Select any device to edit its IPv4/IPv6 addresses and protocols in the inspector.'
    },
    {
      num: 4,
      icon: <Play className="w-4 h-4 text-white" />,
      title: 'Run Simulation',
      desc: 'Evaluate your topology, watch packets travel, and observe protocol transitions.'
    }
  ];

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-[#161617] border border-neutral-700/80 rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#2997ff] font-bold">
            Interactive Network Laboratory
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            Build Your Network Topology
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            This is a real topology simulator. Your network evaluates based on the actual components and links you construct.
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className="flex items-start gap-3 p-3 rounded-2xl bg-black/40 border border-neutral-800"
            >
              <div className="w-7 h-7 rounded-xl bg-neutral-900 border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                {s.icon}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">
                  {s.num}. {s.title}
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white hover:bg-neutral-200 active:scale-98 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Got It &bull; Let&apos;s Build</span>
        </button>
      </div>
    </div>
  );
};
