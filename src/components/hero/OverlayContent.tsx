'use client';

import { motion, MotionValue, useTransform } from 'motion/react';

interface OverlayContentProps {
  progress: MotionValue<number>;
  onCapture?: () => Promise<string | null>;
}

export function OverlayContent({ progress }: OverlayContentProps) {
  const opacity = useTransform(progress, [0.7, 0.85], [0, 1]);
  const scale = useTransform(progress, [0.7, 0.85], [0.9, 1]);

  return (
    <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none">
      <motion.div
        style={{ opacity, scale }}
        className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 pb-20 pointer-events-auto"
      >
        <div className="space-y-6">
          <h2 className="text-5xl md:text-7xl font-serif text-[#fde047] leading-tight italic">
            We Switched <br /> to IPv6
          </h2>

          <p className="text-xl text-[#fde047]/80 font-serif leading-relaxed italic max-w-lg mx-auto">
            We switched to IPv6 — providing 340 undecillion addresses. Way too much space for every device on Earth and beyond.
          </p>
        </div>

        <div className="font-mono text-xs sm:text-sm tracking-widest text-[#fde047] bg-[#fde047]/5 border border-[#fde047]/20 px-6 py-3 rounded-lg">
          IPv6 Header: 40 Bytes (320 bits)
        </div>

        <div className="grid grid-cols-2 gap-6 w-full">
          {[
            { label: 'Address Space', value: '3.4 × 10³⁸' },
            { label: 'Capacity', value: '2^128' },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-[#fde047]/5 border border-[#fde047]/20 backdrop-blur-md rounded-lg">
              <div className="text-[10px] text-[#fde047]/70 font-mono uppercase mb-1 tracking-widest">{stat.label}</div>
              <div className="text-3xl sm:text-4xl font-black text-[#fde047]">{stat.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
