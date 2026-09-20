'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, ArrowUp } from 'lucide-react';

interface VLabNavProps {
  onOpenTest?: (type: 'pre' | 'post') => void;
}

export function VLabNav({ onOpenTest }: VLabNavProps) {
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY < 120) {
        setActiveTab('');
        return;
      }

      const scrollBottom = vh + scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 180) {
        setActiveTab('conclusion');
        return;
      }

      const conclusionEl = document.getElementById('conclusion');
      if (conclusionEl) {
        const conclusionRect = conclusionEl.getBoundingClientRect();
        if (conclusionRect.top <= vh * 0.65) {
          setActiveTab('conclusion');
          return;
        }
      }

      const postEl = document.getElementById('post-test');
      if (postEl) {
        const postRect = postEl.getBoundingClientRect();
        if (postRect.top <= vh * 0.65) {
          setActiveTab('post-test');
          return;
        }
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
        'conclusion',
      ];
      const focalY = Math.min(320, vh * 0.4);
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'aim', label: 'Aim', href: '#aim' },
    { id: 'theory', label: 'Theory', href: '#theory' },
    { id: 'pre-test', label: 'Pre-Test', href: '#pre-test' },
    { id: 'simulation', label: 'Simulation', href: '#simulation' },
    { id: 'post-test', label: 'Post-Test', href: '#post-test' },
    { id: 'conclusion', label: 'Conclusion', href: '#conclusion' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveTab(id);
      window.history.replaceState(null, '', href);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('');
    window.history.replaceState(null, '', window.location.pathname);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-2xl border-b border-neutral-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-8">
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/[0.05] border border-neutral-800 flex items-center justify-center text-zinc-300 shadow-sm">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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
