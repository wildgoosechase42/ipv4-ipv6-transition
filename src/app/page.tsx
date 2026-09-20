'use client';

import React, { useEffect, useState } from 'react';
import HeroApp from '@/components/hero/App';
import { VLabNav } from '@/components/vlab/VLabNav';
import { VLabTheory } from '@/components/vlab/VLabTheory';
import DualStackSim from '@/components/dualstack-sim/DualStackSim';
import TunnelingSim from '@/components/tunneling-sim/TunnelingSim';
import TranslationSim from '@/components/translation-sim/TranslationSim';
import { TestModal } from '@/components/vlab/TestModal';
import { ScrollReveal } from '@/components/vlab/ScrollReveal';
import { ChevronRight, Check } from 'lucide-react';

export default function Home() {
  const [activeTest, setActiveTest] = useState<'pre' | 'post' | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const handleBeforeUnload = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#000000] text-zinc-100 selection:bg-[#2997ff]/25">
      <div id="hero-section" className="relative z-10">
        <HeroApp />
      </div>

      <VLabNav onOpenTest={(type) => setActiveTest(type)} />

      <main className="relative z-20 bg-[#000000]">
        <VLabTheory />

        <div id="pre-test" className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-14">
          <ScrollReveal>
            <div
              onClick={() => setActiveTest('pre')}
              className="w-full p-6 sm:p-8 rounded-[2rem] border border-neutral-800 bg-[#161617] hover:border-[#2997ff]/40 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 cursor-pointer group shadow-2xl"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#2997ff] font-medium">
                  Phase 1 &bull; Baseline Assessment
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white group-hover:text-white transition-colors">
                  Pre-Test
                </h3>
                <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">
                  Assess your foundational understanding of IPv4 address exhaustion and IPv6 transition principles before starting the lab.
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTest('pre');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 text-xs sm:text-sm font-medium hover:bg-zinc-200 hover:text-black active:scale-95 transition-all shadow-sm shrink-0 self-start sm:self-auto"
              >
                <span>Take Pre-Test</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>

        <section id="simulation" className="scroll-mt-20 flex flex-col gap-8 items-center">
          <ScrollReveal className="max-w-7xl mx-auto px-6 pt-4 pb-2 text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#2997ff] block">
              Interactive Lab
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Transition Mechanism Simulations
            </h2>
          </ScrollReveal>
          <DualStackSim />
          <TunnelingSim />
          <TranslationSim />
        </section>

        <div id="post-test" className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-16">
          <ScrollReveal>
            <div
              onClick={() => setActiveTest('post')}
              className="w-full p-6 sm:p-8 rounded-[2rem] border border-neutral-800 bg-[#161617] hover:border-[#2997ff]/40 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 cursor-pointer group shadow-2xl"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#2997ff] font-medium">
                  Phase 2 &bull; Verification Assessment
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white group-hover:text-white transition-colors">
                  Post-Test
                </h3>
                <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">
                  Test your mastery of Dual-Stack prioritization, IPv6-in-IPv4 tunneling encapsulation, and NAT64 stateful translation.
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTest('post');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 text-xs sm:text-sm font-medium hover:bg-zinc-200 hover:text-black active:scale-95 transition-all shadow-sm shrink-0 self-start sm:self-auto"
              >
                <span>Take Post-Test</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#30d158]/10 border border-[#30d158]/25 flex items-center justify-center mb-3 text-[#30d158]">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-zinc-400 tracking-tight">
            Experiment Complete. IPv6 Transition Mechanisms Mastered.
          </p>
        </ScrollReveal>
      </main>

      <TestModal
        isOpen={activeTest !== null}
        type={activeTest || 'pre'}
        onClose={() => setActiveTest(null)}
      />
    </div>
  );
}
