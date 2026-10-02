'use client';

import React, { useEffect, useState } from 'react';
import HeroApp from '@/components/hero/App';
import { VLabNav } from '@/components/vlab/VLabNav';
import { VLabTheory } from '@/components/vlab/VLabTheory';
import { NetworkLabHub } from '@/components/network-lab/NetworkLabHub';
import { TestModal } from '@/components/vlab/TestModal';
import { ScrollReveal } from '@/components/vlab/ScrollReveal';
import { ChevronRight, Check, Target, CheckCircle2 } from 'lucide-react';

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
        <section id="aim" className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-2">
          <ScrollReveal>
            <div className="border border-neutral-800 bg-[#161617] rounded-[2rem] p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2997ff]/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#2997ff]/10 border border-[#2997ff]/20 flex items-center justify-center text-[#2997ff]">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Aim
                </h2>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl border-l-4 border-[#2997ff] bg-black/40 text-base sm:text-lg text-white font-medium leading-relaxed tracking-tight">
                To understand different IPv4 to IPv6 Transition Mechanisms
              </div>
            </div>
          </ScrollReveal>
        </section>

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
          <div className="w-full max-w-7xl px-2 sm:px-6">
            <NetworkLabHub />
          </div>
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

        <section id="conclusion" className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <ScrollReveal>
            <div className="border border-neutral-800 bg-[#161617] rounded-[2rem] p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#30d158]/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#30d158]/10 border border-[#30d158]/20 flex items-center justify-center text-[#30d158]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#30d158] font-medium">
                  Lab Outcome
                </span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-3">
                  Conclusion
                </h3>
                <div className="p-4 sm:p-5 rounded-2xl border-l-4 border-[#30d158] bg-black/40 text-sm sm:text-base text-zinc-200 font-medium leading-relaxed">
                  IPv4 to IPv6 transition is achieved through Dual Stack for parallel coexistence, Tunneling for bridging isolated IPv6 networks across legacy IPv4 transit, and Translation for direct inter-protocol communication.
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <ScrollReveal className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-16 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#30d158]/10 border border-[#30d158]/25 flex items-center justify-center mb-3 text-[#30d158]">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-zinc-400 tracking-tight">
            Experiment Complete.
          </p>
        </ScrollReveal>
      </main>

      {/* Developer & Student Attribution Footer Bar */}
      <footer className="relative z-20 w-full border-t border-white/[0.1] bg-[#0c0c0e] py-6 sm:py-7">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          {/* Left: Developer Name */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#ff9f0a] shadow-[0_0_8px_#ff9f0a] shrink-0" />
            <span className="text-xs sm:text-sm font-mono text-neutral-400 tracking-wider">
              DEVELOPER <span className="text-neutral-500 mx-0.5">•</span>{' '}
              <strong className="text-white font-bold font-mono">Ninad Nikte</strong>
            </span>
          </div>

          {/* Right: Roll Number Capsule */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono tracking-widest text-neutral-400 font-semibold uppercase">
              ROLL NO:
            </span>
            <div className="px-4 py-1 rounded-full border border-white/20 bg-white/[0.04] text-xs sm:text-sm font-mono font-bold text-[#ff9f0a] shadow-sm tracking-wider">
              16010425076
            </div>
          </div>
        </div>
      </footer>

      <TestModal
        isOpen={activeTest !== null}
        type={activeTest || 'pre'}
        onClose={() => setActiveTest(null)}
      />
    </div>
  );
}
