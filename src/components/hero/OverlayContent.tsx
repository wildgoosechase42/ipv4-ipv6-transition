'use client';

import { motion, MotionValue, useTransform } from 'motion/react';

interface OverlayContentProps {
  progress: MotionValue<number>;
  onCapture?: () => Promise<string | null>;
}

export function OverlayContent({ progress }: OverlayContentProps) {
  const opacity = useTransform(progress, [0.68, 0.84], [0, 1]);
  const scale = useTransform(progress, [0.68, 0.84], [0.94, 1]);

  return (
    <div className="sticky top-0 h-screen h-[100svh] flex items-center justify-center pointer-events-none px-4">
      <motion.div
        style={{ opacity, scale }}
        className="flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6 pb-12 sm:pb-16 pointer-events-none"
      >
        <div className="space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#2997ff] font-medium block">
            Next Generation Fabric
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            We Switched <br /> to IPv6
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-md mx-auto">
            Providing 340 undecillion addresses. Limitless address space for every device on Earth and beyond.
          </p>
        </div>

        <div className="font-mono text-xs tracking-wider text-[#2997ff] bg-[#2997ff]/10 border border-[#2997ff]/25 px-5 py-2.5 rounded-full shadow-sm">
          IPv6 Header: 40 Bytes (320 bits)
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full pt-1">
          {[
            { label: 'Address Space', value: '3.4 × 10³⁸' },
            { label: 'Capacity', value: '2¹²⁸' },
          ].map((stat, i) => (
            <div key={i} className="p-4 sm:p-5 bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-2xl">
              <div className="text-[9px] sm:text-[10px] text-neutral-400 font-mono uppercase mb-1 tracking-wider">{stat.label}</div>
              <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{stat.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
