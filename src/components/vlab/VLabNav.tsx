'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUp } from 'lucide-react';

interface VLabNavProps {
  onOpenTest?: (type: 'pre' | 'post') => void;
}

export function VLabNav({ onOpenTest }: VLabNavProps) {
  const [activeTab, setActiveTab] = useState('');
  const isManualScroll = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll.current) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY < 120) {
        setActiveTab('');
        return;
      }

      const sectionIds = [
        'aim',
        'theory',
        'the-problem',
        'dual-stack',
        'tunneling',
        'translation',
        'pre-test',
        'simulation',
        'post-test',
        'ai-use-case',
        'conclusion',
      ];
      const focalY = 160;
      let current = '';

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalY) {
            current = id;
            break;
          }
        }
      }

      // If at the very bottom of the document and conclusion is in view
      const scrollBottom = vh + scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 30) {
        const conclusionEl = document.getElementById('conclusion');
        if (conclusionEl) {
          const cRect = conclusionEl.getBoundingClientRect();
          if (cRect.top <= vh * 0.7) {
            current = 'conclusion';
          }
        }
      }

      if (
        current === 'the-problem' ||
        current === 'dual-stack' ||
        current === 'tunneling' ||
        current === 'translation' ||
        current === 'theory'
      ) {
        setActiveTab('theory');
      } else {
        setActiveTab(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const navItems = [
    { id: 'aim', label: 'Aim', href: '#aim' },
    { id: 'theory', label: 'Theory', href: '#theory' },
    { id: 'pre-test', label: 'Pre-Test', href: '#pre-test' },
    { id: 'simulation', label: 'Simulation', href: '#simulation' },
    { id: 'post-test', label: 'Post-Test', href: '#post-test' },
    { id: 'ai-use-case', label: 'AI Use Case', href: '#ai-use-case' },
    { id: 'conclusion', label: 'Conclusion', href: '#conclusion' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      isManualScroll.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      setActiveTab(id);
      window.history.replaceState(null, '', href);

      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      scrollTimeout.current = setTimeout(() => {
        isManualScroll.current = false;
      }, 900);
    }
  };

  const scrollToTop = () => {
    isManualScroll.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('');
    window.history.replaceState(null, '', window.location.pathname);
    scrollTimeout.current = setTimeout(() => {
      isManualScroll.current = false;
    }, 900);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-2xl border-b border-neutral-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-8">
        <div
          onClick={scrollToTop}
          className="flex items-center gap-3.5 shrink-0 cursor-pointer group hover:opacity-90 transition-opacity"
          title="Go to top of page"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-neutral-700/80 flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/somaiya-logo.png"
              alt="Somaiya Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[11px] sm:text-xs tracking-wider uppercase text-[#2997ff] font-medium block">
              VLab &bull; Experiment 08
            </span>
            <h1 className="text-sm sm:text-base font-medium tracking-tight text-white hidden sm:block">
              IPv4 to IPv6 Transition Mechanisms
            </h1>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0">
          <button
            onClick={scrollToTop}
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 whitespace-nowrap active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-95 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
