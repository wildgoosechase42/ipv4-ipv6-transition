'use client';

import React from 'react';
import {
  ScrollReveal,
  ScrollParagraph,
  ScrollStagger,
  ScrollStaggerItem,
} from './ScrollReveal';

interface VLabTheoryProps {
  onOpenTest?: (type: 'pre' | 'post') => void;
}

export function VLabTheory({ onOpenTest }: VLabTheoryProps) {
  return (
    <div id="theory" className="scroll-mt-20 max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-14 text-zinc-300">
      <ScrollReveal className="border-b border-neutral-800 pb-8 space-y-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#2997ff]">
          Theory Reference
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Transitioning from IPv4 to IPv6
        </h2>
      </ScrollReveal>

      <section id="the-problem" className="scroll-mt-20 space-y-6">
        <ScrollReveal>
          <div className="border border-neutral-800 bg-[#161617] rounded-[2rem] p-6 sm:p-8 space-y-5 shadow-2xl">
            <ScrollStagger className="space-y-4">
              <ScrollStaggerItem>
                <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
                  IPv4 uses <span className="text-[#ff9f0a] font-semibold">32-bit</span> addresses, giving about <span className="text-white font-medium">4.3 billion</span> addresses.
                </p>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
                  But the number of devices connected to the Internet became much larger, so IPv4 addresses started running out.
                </p>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
                  IPv6 uses <span className="text-[#2997ff] font-semibold">128-bit</span> addresses, providing a virtually unlimited address space of 340 undecillion addresses.
                </p>
              </ScrollStaggerItem>
            </ScrollStagger>

            <ScrollParagraph delay={0.2} className="p-4 rounded-2xl border-l-2 border-[#2997ff] bg-black/40 text-sm leading-relaxed text-zinc-200">
              The problem is: we cannot switch the entire Internet from IPv4 to IPv6 at once. So, IPv4 and IPv6 need to coexist during the transition.
            </ScrollParagraph>

            <div className="pt-2 space-y-3">
              <ScrollParagraph delay={0.25} className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
                There are three main transition mechanisms:
              </ScrollParagraph>
              <ScrollStagger staggerDelay={0.06} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ScrollStaggerItem>
                  <a
                    href="#dual-stack"
                    className="block p-3.5 rounded-[1.25rem] border border-neutral-800 bg-black/50 hover:bg-neutral-800/40 hover:border-[#2997ff]/40 transition-all text-xs font-medium text-zinc-200 text-center"
                  >
                    1. Dual Stack
                  </a>
                </ScrollStaggerItem>
                <ScrollStaggerItem>
                  <a
                    href="#tunneling"
                    className="block p-3.5 rounded-[1.25rem] border border-neutral-800 bg-black/50 hover:bg-neutral-800/40 hover:border-[#ff9f0a]/40 transition-all text-xs font-medium text-zinc-200 text-center"
                  >
                    2. Tunneling
                  </a>
                </ScrollStaggerItem>
                <ScrollStaggerItem>
                  <a
                    href="#translation"
                    className="block p-3.5 rounded-[1.25rem] border border-neutral-800 bg-black/50 hover:bg-neutral-800/40 hover:border-[#2997ff]/40 transition-all text-xs font-medium text-zinc-200 text-center"
                  >
                    3. Translation
                  </a>
                </ScrollStaggerItem>
              </ScrollStagger>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="dual-stack" className="scroll-mt-20 space-y-5">
        <ScrollReveal>
          <div className="border border-neutral-800 bg-[#161617] rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-neutral-800/80 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#2997ff] block mb-1 font-medium">
                Mechanism 01
              </span>
              <h3 className="text-xl font-semibold text-white tracking-tight">
                1. Dual Stack
              </h3>
            </div>

            <ScrollStagger className="space-y-4">
              <ScrollStaggerItem>
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                    Basic idea:
                  </span>
                  <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
                    A device runs both IPv4 and IPv6 protocols simultaneously on the same network interface.
                  </p>
                </div>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <div className="p-4 rounded-2xl border border-neutral-800 bg-black/40 space-y-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                    For example:
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                    The dual-stack host is assigned:
                  </p>
                  <div className="font-mono text-xs space-y-1.5 pl-3 border-l-2 border-neutral-700 text-zinc-200">
                    <div>
                      IPv4 address: <span className="text-[#ff9f0a] font-semibold">192.168.1.10</span>
                    </div>
                    <div>
                      IPv6 address: <span className="text-[#2997ff] font-semibold">2001:db8::10</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                    It can communicate natively using either IPv4 or IPv6, depending on the DNS records and network capability of the destination.
                  </p>
                </div>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                    Operating Principle:
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                    If Computer A connects to an IPv6-capable destination with an AAAA record, IPv6 is prioritized (RFC 6724). If Computer A connects to an IPv4-only destination with only an A record, IPv4 is seamlessly used.
                  </p>
                </div>
              </ScrollStaggerItem>
            </ScrollStagger>

            <ScrollStagger staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <ScrollStaggerItem>
                <div className="p-5 rounded-[2rem] border border-neutral-800 bg-black/40 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#30d158] block font-semibold">
                    Advantages:
                  </span>
                  <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                    <li>Simple conceptual model without protocol modification</li>
                    <li>Full native performance without encapsulation latency</li>
                    <li>Enables gradual, non-disruptive migration</li>
                  </ul>
                </div>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <div className="p-5 rounded-[2rem] border border-neutral-800 bg-black/40 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ff9f0a] block font-semibold">
                    Disadvantages:
                  </span>
                  <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                    <li>Every device still requires a scarce IPv4 address</li>
                    <li>Doubles routing table complexity and memory overhead</li>
                    <li>Security policies must be maintained across both stacks</li>
                  </ul>
                </div>
              </ScrollStaggerItem>
            </ScrollStagger>
          </div>
        </ScrollReveal>
      </section>

      <section id="tunneling" className="scroll-mt-20 space-y-5">
        <ScrollReveal>
          <div className="border border-neutral-800 bg-[#161617] rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-neutral-800/80 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#ff9f0a] block mb-1 font-medium">
                Mechanism 02
              </span>
              <h3 className="text-xl font-semibold text-white tracking-tight">
                2. Tunneling
              </h3>
            </div>

            <ScrollStagger className="space-y-4">
              <ScrollStaggerItem>
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                    Basic idea:
                  </span>
                  <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
                    When two IPv6 islands need to communicate across an intermediate IPv4-only transit network, IPv6 packets are encapsulated inside IPv4 headers (Protocol 41).
                  </p>
                </div>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <div className="p-4 rounded-2xl border border-neutral-800 bg-black/40 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                    How it works:
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                    At the tunnel ingress router, the incoming IPv6 packet is encapsulated into a standard IPv4 datagram: <span className="font-mono text-white">[IPv4 Header (Proto 41) + IPv6 Datagram]</span>. The intermediate IPv4 core routes the packet normally without inspecting the payload. At the egress router, the IPv4 header is stripped and the pristine IPv6 packet delivers to the destination.
                  </p>
                </div>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <div className="p-4 rounded-2xl border border-neutral-800 bg-black/40 space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                    Simple analogy:
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                    Imagine an IPv6 electric car needs to cross an ocean where only IPv4 cargo ships can sail. The car is loaded into an IPv4 shipping container, ferried across the ocean, and unloaded on the other side to resume driving natively.
                  </p>
                </div>
              </ScrollStaggerItem>
            </ScrollStagger>

            <ScrollStagger staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <ScrollStaggerItem>
                <div className="p-5 rounded-[2rem] border border-neutral-800 bg-black/40 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#30d158] block font-semibold">
                    Advantages:
                  </span>
                  <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                    <li>Leverages existing IPv4 routing infrastructure without upgrades</li>
                    <li>Intermediate transit routers require zero IPv6 knowledge</li>
                    <li>Interconnects isolated IPv6 campuses effortlessly</li>
                  </ul>
                </div>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <div className="p-5 rounded-[2rem] border border-neutral-800 bg-black/40 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ff9f0a] block font-semibold">
                    Disadvantages:
                  </span>
                  <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                    <li>Adds 20 bytes of IPv4 header overhead per packet</li>
                    <li>Reduces Effective Path MTU, triggering fragmentation</li>
                    <li>Troubleshooting and ICMP tracepath diagnosis is obscured</li>
                  </ul>
                </div>
              </ScrollStaggerItem>
            </ScrollStagger>
          </div>
        </ScrollReveal>
      </section>

      <section id="translation" className="scroll-mt-20 space-y-5">
        <ScrollReveal>
          <div className="border border-neutral-800 bg-[#161617] rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-neutral-800/80 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#2997ff] block mb-1 font-medium">
                Mechanism 03
              </span>
              <h3 className="text-xl font-semibold text-white tracking-tight">
                3. Translation (NAT64 / DNS64)
              </h3>
            </div>

            <ScrollStagger className="space-y-4">
              <ScrollStaggerItem>
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                    Basic idea:
                  </span>
                  <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
                    When an IPv6-only client needs to talk to a legacy IPv4-only service, a stateful gateway dynamically translates packet headers between the two incompatible network architectures.
                  </p>
                </div>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <div className="p-4 rounded-2xl border border-neutral-800 bg-black/40 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                    How it works:
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                    DNS64 synthesizes an IPv6 address using the Well-Known Prefix <span className="font-mono text-[#2997ff]">64:ff9b::/96</span> embedded with the target IPv4 address. The NAT64 gateway terminates the IPv6 session, replaces headers with an IPv4 header, and tracks state in its translation table for return packets.
                  </p>
                  <div className="text-xs font-mono text-zinc-300 pt-1">
                    Enables modern single-stack IPv6 datacenters to retire internal IPv4 while maintaining global reach.
                  </div>
                </div>
              </ScrollStaggerItem>
            </ScrollStagger>

            <ScrollStagger staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <ScrollStaggerItem>
                <div className="p-5 rounded-[2rem] border border-neutral-800 bg-black/40 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#30d158] block font-semibold">
                    Advantages:
                  </span>
                  <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                    <li>Allows IPv6-only networks to access legacy IPv4 servers</li>
                    <li>Eliminates IPv4 exhaustion inside customer networks</li>
                    <li>Supports modern cloud infrastructures and mobile networks</li>
                  </ul>
                </div>
              </ScrollStaggerItem>

              <ScrollStaggerItem>
                <div className="p-5 rounded-[2rem] border border-neutral-800 bg-black/40 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ff9f0a] block font-semibold">
                    Disadvantages:
                  </span>
                  <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                    <li>Breaks protocols with embedded IP addresses in application payloads (e.g., SIP, FTP)</li>
                    <li>Requires stateful session tracking on the NAT64 gateway</li>
                    <li>Adds computational translation overhead to routers</li>
                  </ul>
                </div>
              </ScrollStaggerItem>
            </ScrollStagger>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
