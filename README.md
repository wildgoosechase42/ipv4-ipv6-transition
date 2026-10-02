# IPv4 to IPv6 Transition Mechanisms — Interactive Virtual Network Lab

[![Deployment Status](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://ipv6-transition.vercel.app)
[![Framework](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org)
[![Language](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)

An interactive, Tinkercad-style educational network laboratory and visualization platform for understanding and simulating IPv4 to IPv6 migration strategies.

**Live Deployment:** [https://ipv6-transition.vercel.app](https://ipv6-transition.vercel.app)

---

## Overview

As the global IPv4 address pool is exhausted, migrating to IPv6 is imperative. However, because IPv4 and IPv6 headers are fundamentally incompatible, global infrastructure relies on standardized transition mechanisms during the coexistence era.

This platform bridges theoretical network engineering concepts with hands-on practice, allowing students to design, cable, validate, and simulate packet flow across all three primary transition architectures.

---

## Key Features

### 1. Interactive Network Simulator (Tinkercad-Style Interaction)
- **Guided Assembly Experience**: Open blueprints to inspect the exact reference topology, wire connections between ports, and validate network correctness.
- **Protocol-Aware Wiring**: Drag cables between device interfaces with protocol validation (IPv4 orange cables, IPv6 blue cables, Dual-Stack purple cables).
- **Drag-to-Delete**: Drag any placed hardware node into the dynamic top-right trash zone to cleanly remove it and its attached links.
- **Precision Canvas Controls**: Zoom in/out, reset view, fit to screen, and snap-to-grid (20px).
- **Step-by-Step Packet Simulation**: Observe datagrams traveling across routers, tunnel gateways, and translators with animated packet visualization.
- **Packet Header Inspector**: Inspect real-time bit-level headers including IPv4/IPv6 version, traffic class, flow labels, payload lengths, next header/protocol (Protocol 41), and IP addresses.

### 2. Transition Mechanisms Covered

#### A. Dual Stack Architecture (RFC 4213)
- Enables IPv4 and IPv6 protocol stacks simultaneously on the same hardware interface.
- Simulates operating system RFC 6724 address selection algorithms (preferring IPv6 when available, falling back to IPv4).
- Tests independent forwarding paths through dual-stack core routing tables.

#### B. IPv6-in-IPv4 Tunneling (RFC 4213 / Protocol 41)
- Connects isolated IPv6 islands across legacy IPv4 transit backbones.
- Simulates ingress encapsulation (wrapping 40-byte IPv6 datagrams inside 20-byte IPv4 headers with IP protocol `41`).
- Simulates egress decapsulation (stripping outer IPv4 headers to deliver native IPv6 traffic).

#### C. NAT64 Stateful Translation (RFC 6146)
- Allows IPv6-only clients to communicate directly with legacy IPv4-only web servers without upgrading endpoints.
- Demonstrates stateful address translation using the standard Well-Known Prefix (`64:ff9b::/96`).
- Dynamically translates IPv6 headers into IPv4 headers and maps ephemeral return sessions.

### 3. Integrated Learning & Assessments
- **Pre-Test & Post-Test**: Structured assessments to evaluate student understanding before and after practical experimentation.
- **Target Blueprint Guides**: Clean visual reference architectures with step-by-step assembly guides.
- **Comparison & Diagnostics**: Instant topology diagnostics identifying missing devices, incorrect ports, or unconfigured IP addresses.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **UI & Interaction**: [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com), Custom Glassmorphic Dark Design System
- **Icons**: [Lucide React](https://lucide.dev)
- **Deployment**: [Vercel](https://vercel.com)

---

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/ninadnikte/ipv4-ipv6-transition.git

# Navigate into project directory
cd ipv4-ipv6-transition

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
```

---

## Deployment

The application is deployed on Vercel:
- **Production URL**: [https://ipv6-transition.vercel.app](https://ipv6-transition.vercel.app)

---

## License

MIT License. Designed and developed for Data Communications & Networking (DCN) coursework.
