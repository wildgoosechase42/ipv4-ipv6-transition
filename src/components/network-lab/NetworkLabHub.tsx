'use client';

import React, { useState } from 'react';
import { Layers, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { LabType } from './types';
import { DualStackLab } from './labs/DualStackLab';
import { TunnelingLab } from './labs/TunnelingLab';
import { TranslationLab } from './labs/TranslationLab';

export const NetworkLabHub: React.FC = () => {
  const [activeLab, setActiveLab] = useState<LabType>('dual-stack');

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('tunneling')) {
        setActiveLab('tunneling');
      } else if (hash.includes('translation') || hash.includes('nat64')) {
        setActiveLab('translation');
      } else if (hash.includes('dual-stack') || hash.includes('dualstack')) {
        setActiveLab('dual-stack');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Top Laboratory Selector Tabs */}
      <div className="flex items-center p-1.5 rounded-2xl bg-[#161617] border border-neutral-800 shadow-2xl font-mono text-xs flex-wrap justify-center gap-1">
        <button
          onClick={() => setActiveLab('dual-stack')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeLab === 'dual-stack'
              ? 'bg-neutral-800 text-white font-bold shadow-md border border-neutral-700'
              : 'text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#2997ff]" />
          <span>01 DUAL STACK LAB</span>
        </button>

        <button
          onClick={() => setActiveLab('tunneling')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeLab === 'tunneling'
              ? 'bg-neutral-800 text-white font-bold shadow-md border border-neutral-700'
              : 'text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#ff9f0a]" />
          <span>02 TUNNELING LAB</span>
        </button>

        <button
          onClick={() => setActiveLab('translation')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeLab === 'translation'
              ? 'bg-neutral-800 text-white font-bold shadow-md border border-neutral-700'
              : 'text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#30d158]" />
          <span>03 NAT64 TRANSLATION LAB</span>
        </button>
      </div>

      {/* Active Lab Container */}
      <div className="w-full">
        {activeLab === 'dual-stack' && (
          <DualStackLab onSelectLab={(l) => setActiveLab(l)} />
        )}
        {activeLab === 'tunneling' && (
          <TunnelingLab onSelectLab={(l) => setActiveLab(l)} />
        )}
        {activeLab === 'translation' && (
          <TranslationLab onSelectLab={(l) => setActiveLab(l)} />
        )}
      </div>
    </div>
  );
};
