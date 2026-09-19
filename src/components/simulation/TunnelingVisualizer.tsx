'use client';

import React, { useState } from 'react';
import { StepForward, RotateCcw, Box, ArrowRight, ShieldCheck } from 'lucide-react';

export function TunnelingVisualizer() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      step: 0,
      title: 'Initial State: Native IPv6 Generated at Origin',
      location: 'Host Subnet (2001:db8:1::/64)',
      description: 'Host creates standard IPv6 datagram destined for 2001:db8:2::50. The local gateway detects the destination is across an IPv4-only core network.',
      packetView: {
        type: 'native-v6',
        outer: null,
        inner: {
          proto: 'IPv6 (40 bytes)',
          src: '2001:db8:1::10',
          dst: '2001:db8:2::50',
          hopLimit: 64,
          payload: 'Payload Data (1460 B)',
          color: '#38BDF8',
        },
      },
      mtu: '1500 Bytes (Native Ethernet)',
    },
    {
      step: 1,
      title: 'Ingress Router: Protocol 41 Encapsulation',
      location: 'Ingress Tunnel Endpoint Router (198.51.100.1)',
      description: 'The router wraps the entire untouched IPv6 packet inside an outer 20-byte IPv4 header. The IPv4 Protocol field is explicitly set to 41 (IPv6 encapsulation).',
      packetView: {
        type: 'encapsulated',
        outer: {
          proto: 'IPv4 Header (20 bytes, Proto 41)',
          src: '198.51.100.1 (Ingress WAN)',
          dst: '203.0.113.2 (Egress WAN)',
          ttl: 64,
          checksum: '0x8F3A (Mandatory)',
          color: '#D97706',
        },
        inner: {
          proto: 'Inner IPv6 Datagram (40 bytes)',
          src: '2001:db8:1::10',
          dst: '2001:db8:2::50',
          hopLimit: 64,
          payload: 'Payload Data (1460 B)',
          color: '#38BDF8',
        },
      },
      mtu: 'Tunnel MTU: 1480 Bytes (1500 - 20)',
    },
    {
      step: 2,
      title: 'Transit: Traversing the Legacy IPv4 WAN',
      location: 'IPv4 Core Transit Backbone (AS1299)',
      description: 'Intermediate IPv4 routers inspect only the outer IPv4 header. They are completely unaware of the IPv6 payload. Routing occurs strictly via standard IPv4 BGP/OSPF tables.',
      packetView: {
        type: 'transit',
        outer: {
          proto: 'Outer IPv4 Header (Proto 41)',
          src: '198.51.100.1',
          dst: '203.0.113.2',
          ttl: 60,
          checksum: '0x9B1C',
          color: '#D97706',
        },
        inner: {
          proto: 'Encapsulated IPv6 Payload (Hidden)',
          src: 'Encapsulated',
          dst: 'Encapsulated',
          hopLimit: 64,
          payload: 'Ciphertext / Data',
          color: '#38BDF8',
        },
      },
      mtu: '1500 Bytes Wire Size',
    },
    {
      step: 3,
      title: 'Egress Router: Decapsulation & Outer Header Strip',
      location: 'Egress Tunnel Endpoint Router (203.0.113.2)',
      description: 'The egress router identifies Protocol 41, strips the 20-byte outer IPv4 header, decrements the inner IPv6 Hop Limit, and injects the native IPv6 packet into the destination LAN.',
      packetView: {
        type: 'decapsulated',
        outer: null,
        inner: {
          proto: 'Restored Native IPv6 (40 bytes)',
          src: '2001:db8:1::10',
          dst: '2001:db8:2::50',
          hopLimit: 63,
          payload: 'Payload Data (1460 B)',
          color: '#38BDF8',
        },
      },
      mtu: 'Restored: 1500 Bytes LAN MTU',
    },
    {
      step: 4,
      title: 'Destination: Pure IPv6 Delivery Confirmed',
      location: 'Destination Host (2001:db8:2::50)',
      description: 'The destination host receives a pristine native IPv6 packet without any trace of the intermediate IPv4 journey. Socket communication terminates cleanly.',
      packetView: {
        type: 'delivered',
        outer: null,
        inner: {
          proto: 'IPv6 Complete Delivery',
          src: '2001:db8:1::10',
          dst: '2001:db8:2::50',
          hopLimit: 63,
          payload: 'TCP ACK / Response Ready',
          color: '#22C55E',
        },
      },
      mtu: 'Success (Zero NAT state maintained)',
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-[#080808] border border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-[#EDEDED]">
            Pipeline Phase: {currentStep + 1} of {steps.length}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#8A8A8E]">
            {current.location}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3 py-1.5 rounded bg-[#111111] border border-white/[0.08] text-xs font-mono text-[#8A8A8E] hover:text-[#EDEDED] disabled:opacity-30 transition-all cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-[#D97706] text-[#080808] text-xs font-mono font-bold hover:bg-[#D97706]/90 disabled:opacity-50 transition-all cursor-pointer"
          >
            <span>Step Forward</span>
            <StepForward className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-[#111111] border border-white/[0.08] text-[#8A8A8E] hover:text-[#EDEDED] transition-colors cursor-pointer"
            title="Reset to origin"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-6 rounded bg-[#080808] border border-white/[0.06] space-y-6">
        <div className="grid grid-cols-5 gap-2 font-mono text-center">
          {[
            { label: 'Host (IPv6)', active: currentStep === 0 },
            { label: 'Ingress Router', active: currentStep === 1 },
            { label: 'IPv4 WAN (Proto 41)', active: currentStep === 2 },
            { label: 'Egress Router', active: currentStep === 3 },
            { label: 'Destination (IPv6)', active: currentStep === 4 },
          ].map((node, i) => (
            <div
              key={i}
              className={`p-2 rounded border transition-all ${
                node.active
                  ? 'bg-white/[0.08] border-white/[0.3] text-[#EDEDED] font-bold shadow-md'
                  : i < currentStep
                  ? 'bg-white/[0.02] border-white/[0.08] text-[#22C55E]'
                  : 'bg-transparent border-white/[0.03] text-[#8A8A8E]/50'
              }`}
            >
              <div className="text-[9px] uppercase tracking-wider mb-1">Node 0{i + 1}</div>
              <div className="text-[11px] truncate">{node.label}</div>
            </div>
          ))}
        </div>

        <div className="p-5 rounded bg-[#111111] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h4 className="text-sm font-mono font-bold text-[#EDEDED]">{current.title}</h4>
            <span className="text-[11px] font-mono text-[#38BDF8]">{current.mtu}</span>
          </div>

          <p className="text-xs text-[#8A8A8E] leading-relaxed">{current.description}</p>

          <div className="p-4 rounded bg-[#080808] border border-white/[0.06] font-mono text-xs space-y-3">
            <div className="text-[10px] text-[#8A8A8E] uppercase tracking-wider">Wire Inspection Dissector:</div>

            {current.packetView.outer && (
              <div className="p-3 rounded bg-[#D97706]/10 border border-[#D97706]/40 space-y-1.5 transition-all">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#D97706]">
                  <span>{current.packetView.outer.proto}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#D97706]/20 text-[10px]">Outer IPv4 Envelope</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-[#EDEDED] pt-1">
                  <div>Src IP: {current.packetView.outer.src}</div>
                  <div>Dst IP: {current.packetView.outer.dst}</div>
                  <div>TTL: {current.packetView.outer.ttl}</div>
                  <div>Checksum: {current.packetView.outer.checksum}</div>
                </div>
              </div>
            )}

            <div
              className="p-3 rounded border space-y-1.5 transition-all"
              style={{
                backgroundColor: currentStep === 4 ? 'rgba(34,197,94,0.1)' : 'rgba(56,189,248,0.1)',
                borderColor: currentStep === 4 ? 'rgba(34,197,94,0.4)' : 'rgba(56,189,248,0.4)',
              }}
            >
              <div className="flex items-center justify-between text-[11px] font-bold" style={{ color: current.packetView.inner.color }}>
                <span>{current.packetView.inner.proto}</span>
                <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-[#8A8A8E]">
                  {current.packetView.outer ? 'Encapsulated Payload' : 'Native Datagram'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-[#EDEDED] pt-1">
                <div>Src: {current.packetView.inner.src}</div>
                <div>Dst: {current.packetView.inner.dst}</div>
                <div>Hop Limit: {current.packetView.inner.hopLimit}</div>
                <div>Payload: {current.packetView.inner.payload}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[10px] text-[#8A8A8E] uppercase">Tunnel Protocol</div>
            <div className="text-sm font-bold text-[#D97706] mt-0.5">Protocol 41 (6in4)</div>
          </div>
          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[10px] text-[#8A8A8E] uppercase">Header Overhead</div>
            <div className="text-sm font-bold text-[#EDEDED] mt-0.5">+20 Bytes per Packet</div>
          </div>
          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[10px] text-[#8A8A8E] uppercase">Security Traversal</div>
            <div className="text-sm font-bold text-[#38BDF8] mt-0.5">Requires Proto 41 Firewall Rule</div>
          </div>
        </div>
      </div>
    </div>
  );
}
