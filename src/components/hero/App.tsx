'use client';

import React, { useRef, useState, Suspense, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { OverlayContent } from './OverlayContent';

const Scene3D = dynamic(() => import('./Scene3D').then((mod) => mod.Scene3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center text-slate-500 font-mono text-xs uppercase tracking-widest">
      Waking Lattice...
    </div>
  ),
});

export default function App() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only listen to mouse movements on devices with a fine pointer (mouse/trackpad).
    // Do not attach touchmove on touch screens, which causes violent tilting and camera shaking during mobile scroll.
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Tighter, responsive spring that tracks touch momentum without lag or oscillation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 38,
    mass: 0.15,
    restDelta: 0.0005,
  });

  const handleCapture = useCallback(async () => {
    if (!canvasRef.current) return null;
    return canvasRef.current.toDataURL('image/png');
  }, []);

  // Use smoothProgress for overlay transforms to stay in 1:1 sync with the 3D scene
  const ipv4Opacity = useTransform(smoothProgress, [0, 0.22], [1, 0]);
  const ipv4X = useTransform(smoothProgress, [0, 0.22], [0, -30]);
  const fractureOpacity = useTransform(smoothProgress, [0.35, 0.46, 0.56], [0, 1, 0]);
  const fractureScale = useTransform(smoothProgress, [0.35, 0.56], [0.85, 1.25]);

  return (
    <div
      ref={containerRef}
      style={{ height: '400vh' }}
      className="relative w-full bg-[#030305] selection:bg-indigo-500/30"
    >
      <div className="sticky top-0 h-screen h-[100svh] w-full z-0 pointer-events-none overflow-hidden">
        {mounted ? (
          <Suspense
            fallback={
              <div className="w-full h-full bg-black flex items-center justify-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                Waking Lattice...
              </div>
            }
          >
            <Scene3D progress={smoothProgress} canvasRef={canvasRef} mousePosRef={mousePosRef} />
          </Suspense>
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center text-slate-500 font-mono text-xs uppercase tracking-widest">
            Waking Lattice...
          </div>
        )}
      </div>

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ height: '400vh' }}
      >
        <section className="h-[150vh] flex flex-col justify-start pt-[18vh] sm:pt-[20vh] px-6 sm:px-12 md:px-20 max-w-2xl">
          <motion.div
            style={{ opacity: ipv4Opacity, x: ipv4X }}
            className="space-y-6"
          >
            <div className="text-[#ff4500] font-mono text-sm sm:text-base font-semibold tracking-[0.25em] uppercase">
              Status: Exhaustion
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-[#fde047] leading-tight italic">
              IPv4 is a 32-bit <br />
              Mechanical <br />
              Ceiling
            </h2>
            <p className="text-xl text-[#fde047]/80 font-serif leading-relaxed">
              4.3 Billion nodes spinning at the edge of collapse. Every address is a precious,
              finite resource.
            </p>
            <div className="flex gap-2 pt-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-12 border border-[#fde047]/25 bg-[#fde047]/5 flex items-center justify-center text-lg font-mono text-[#ff4500]"
                >
                  255
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="h-[70vh] flex items-center justify-center px-4">
          <motion.div
            style={{
              opacity: fractureOpacity,
              scale: fractureScale,
            }}
            className="text-center space-y-4"
          >
            <h3 className="text-6xl md:text-[12rem] font-black text-white uppercase tracking-tighter mix-blend-overlay">
              Fracture
            </h3>
            <p className="text-lg md:text-2xl font-mono text-zinc-300 tracking-[0.25em] uppercase">
              We had to switch.
            </p>
          </motion.div>
        </section>

        <section className="h-[190vh] pt-[10vh] px-6 sm:px-12 md:px-20">
          <OverlayContent progress={smoothProgress} onCapture={handleCapture} />
        </section>
      </div>

      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>
    </div>
  );
}
