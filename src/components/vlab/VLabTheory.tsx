'use client';

interface VLabTheoryProps {
  onOpenTest?: (type: 'pre' | 'post') => void;
}

export function VLabTheory({ onOpenTest }: VLabTheoryProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-14 text-zinc-300">
      <div className="border-b border-zinc-800 pb-8 space-y-2">
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Theory Reference
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
          Transitioning from IPv4 to IPv6
        </h2>
      </div>

      <section id="the-problem" className="scroll-mt-20 space-y-6">
        <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 sm:p-8 space-y-5">
          <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
            IPv4 uses 32-bit addresses, giving about 4.3 billion addresses.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
            But the number of devices connected to the Internet became much larger, so IPv4 addresses started running out.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
            IPv6 uses 128-bit addresses, providing a huge number of addresses.
          </p>

          <div className="p-4 rounded-xl border-l-2 border-zinc-500 bg-zinc-900/80 text-sm leading-relaxed text-zinc-200">
            The problem is: we cannot switch the entire Internet from IPv4 to IPv6 at once. So, IPv4 and IPv6 need to coexist during the transition.
          </div>

          <div className="pt-2 space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">
              There are three main transition mechanisms:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="#dual-stack"
                className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors text-xs font-medium text-zinc-200 text-center"
              >
                1. Dual Stack
              </a>
              <a
                href="#tunneling"
                className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors text-xs font-medium text-zinc-200 text-center"
              >
                2. Tunneling
              </a>
              <a
                href="#translation"
                className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors text-xs font-medium text-zinc-200 text-center"
              >
                3. Translation
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="dual-stack" className="scroll-mt-20 space-y-5">
        <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-800/80 pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 block mb-1">
              Mechanism 01
            </span>
            <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">
              1. Dual Stack
            </h3>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-medium">
              Basic idea:
            </span>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
              A device runs both IPv4 and IPv6 at the same time.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-medium">
              For example:
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
              The computer has:
            </p>
            <div className="font-mono text-xs space-y-1 pl-3 border-l-2 border-zinc-700 text-zinc-200">
              <div>IPv4 address: <span className="text-zinc-100 font-semibold">192.168.1.10</span></div>
              <div>IPv6 address: <span className="text-zinc-100 font-semibold">2001:db8::10</span></div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
              It can communicate using either IPv4 or IPv6, depending on what the destination supports.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-medium">
              Example:
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
              If Computer A connects to an IPv6 website, IPv6 is used. If Computer A connects to an IPv4-only website, IPv4 is used.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 block font-semibold">
                Advantages:
              </span>
              <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                <li>Simple concept</li>
                <li>Supports both protocols</li>
                <li>Gradual migration is possible</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 block font-semibold">
                Disadvantage:
              </span>
              <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                <li>Devices must support and maintain both IPv4 and IPv6.</li>
                <li>IPv4 addresses are still required.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="tunneling" className="scroll-mt-20 space-y-5">
        <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-800/80 pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 block mb-1">
              Mechanism 02
            </span>
            <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">
              2. Tunneling
            </h3>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-medium">
              Basic idea:
            </span>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
              Sometimes an IPv6 network needs to communicate through an IPv4 network. We can solve this by putting an IPv6 packet inside an IPv4 packet. Think of it like putting a letter inside another envelope.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-medium">
              How it works:
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
              At the beginning, there is an IPv6 packet. The tunnel entry puts that IPv6 packet inside an IPv4 packet (IPv4 Header + IPv6 Packet). The IPv4 network transports it. At the other end, the tunnel exit removes the IPv4 header and the original IPv6 packet continues.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-medium">
              Simple analogy:
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
              Imagine an IPv6 car needs to travel through an IPv4-only road. The IPv6 car is put inside an IPv4 truck/train, travels across the IPv4 road, and comes out at the other side.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 block font-semibold">
                Advantages:
              </span>
              <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                <li>Allows IPv6 networks to communicate across existing IPv4 infrastructure.</li>
                <li>Existing IPv4 networks don&apos;t need to understand IPv6 packets.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 block font-semibold">
                Disadvantage:
              </span>
              <ul className="text-xs text-zinc-300 space-y-1.5 pl-3 list-disc">
                <li>Adds additional header/overhead.</li>
                <li>Configuration can be complicated.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="translation" className="scroll-mt-20 space-y-5">
        <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-800/80 pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 block mb-1">
              Mechanism 03
            </span>
            <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">
              3. Translation
            </h3>
          </div>

          <p className="text-xs text-zinc-400 font-mono">
            This is slightly different.
          </p>

          <div className="space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-medium">
              Basic idea:
            </span>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
              Translation converts IPv4 packets into IPv6 packets, or IPv6 packets into IPv4 packets. The translator acts like a middleman between IPv4 and IPv6.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-medium">
              Example:
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
              Suppose an IPv6-only computer wants to communicate with an IPv4-only server. The IPv6 computer sends an IPv6 packet to the translator, which converts it into an IPv4 packet and delivers it to the IPv4 server.
            </p>
            <div className="text-xs font-mono text-zinc-300 pt-1">
              One common technology is <span className="font-semibold text-zinc-100">NAT64</span>.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
