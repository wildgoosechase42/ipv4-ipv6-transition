import { LabBlueprint, LabType } from '../types';
import {
  DUAL_STACK_PRESET,
  TUNNELING_PRESET,
  TRANSLATION_PRESET
} from '../presets/labPresets';

export const DUAL_STACK_BLUEPRINT: LabBlueprint = {
  labType: 'dual-stack',
  title: 'Dual Stack Network Blueprint',
  subtitle: 'Coexistence of IPv4 and IPv6 on a Single Infrastructure',
  goal: 'Build a network where a dual-stack computer can communicate with both an IPv4-only legacy server and an IPv6-only cloud server through a dual-stack core router.',
  whyBuild:
    'During the transition period, IPv4 and IPv6 must coexist. A Dual-Stack device (RFC 4213) runs both protocol stacks simultaneously on the same hardware and network interface. Operating systems use RFC 6724 address selection algorithms to automatically choose between IPv6 (preferred) and IPv4 fallback depending on the target DNS records.',
  theoryAnchor: '#dual-stack',
  requiredComponents: [
    {
      id: 'host-dual',
      type: 'host-dual',
      label: 'Dual Stack Host',
      count: 1,
      description: 'Host with both IPv4 (192.168.1.10) and IPv6 (2001:db8:1::10) stacks enabled',
      requiredIpv4: '192.168.1.10',
      requiredIpv6: '2001:db8:1::10'
    },
    {
      id: 'router-dual',
      type: 'router',
      label: 'Dual Stack Router',
      count: 1,
      description: 'Core router with dual routing table supporting both IPv4 and IPv6 forwarding'
    },
    {
      id: 'server-v4',
      type: 'server-v4',
      label: 'IPv4 Server',
      count: 1,
      description: 'Legacy web server with standard IPv4 A record (198.51.100.25)',
      requiredIpv4: '198.51.100.25'
    },
    {
      id: 'server-v6',
      type: 'server-v6',
      label: 'IPv6 Server',
      count: 1,
      description: 'Modern cloud server reachable over IPv6 AAAA record (2001:db8:2::80)',
      requiredIpv6: '2001:db8:2::80'
    }
  ],
  optionalComponents: [
    {
      type: 'host-v4',
      label: 'IPv4 Host',
      hint: 'Test legacy host communication'
    },
    {
      type: 'host-v6',
      label: 'IPv6 Host',
      hint: 'Test IPv6-only host communication'
    }
  ],
  assemblySteps: [
    {
      step: 1,
      title: 'Place Dual-Stack Host',
      instruction: 'Drag a Dual Stack Host from the toolbox and position it on the left canvas.',
      targetHint: 'Dual Stack Laptop (Left)'
    },
    {
      step: 2,
      title: 'Place Core Router',
      instruction: 'Drag a Dual Stack Router and place it in the center of the workspace.',
      targetHint: 'Central Routing Hub'
    },
    {
      step: 3,
      title: 'Place Destination Servers',
      instruction: 'Drag an IPv4 Server (top right) and an IPv6 Server (bottom right) onto the canvas.',
      targetHint: 'IPv4 Server & IPv6 Server'
    },
    {
      step: 4,
      title: 'Connect Host to Router',
      instruction: 'Drag a cable from the Host port (eth0) to the Router port (eth0).',
      targetHint: 'Host ── Router (Dual Stack Link)'
    },
    {
      step: 5,
      title: 'Connect Router to IPv4 Server',
      instruction: 'Drag a cable from the Router port (eth1) to the IPv4 Server port (eth0).',
      targetHint: 'Router ── IPv4 Server'
    },
    {
      step: 6,
      title: 'Connect Router to IPv6 Server',
      instruction: 'Drag a cable from the Router port (eth2) to the IPv6 Server port (eth0).',
      targetHint: 'Router ── IPv6 Server'
    },
    {
      step: 7,
      title: 'Check Your Network',
      instruction: 'Click "Check Network" to validate your topology and connections.',
      targetHint: 'Run topology validation'
    },
    {
      step: 8,
      title: 'Run Simulation',
      instruction: 'Click "Test IPv4" and "Test IPv6" to watch packets travel along their respective paths.',
      targetHint: 'Observe dual-stack protocol selection'
    }
  ],
  targetTopology: DUAL_STACK_PRESET,
  explanationAfterSim: {
    title: 'Dual Stack Protocol Coexistence',
    whatHappened:
      'The Dual-Stack Host maintained parallel IPv4 and IPv6 network stacks. When testing IPv4, it transmitted a standard IPv4 datagram to the IPv4 server. When testing IPv6, RFC 6724 address selection chose native IPv6 to communicate with the IPv6 server without needing encapsulation or translation.',
    theoryLink: '#dual-stack'
  },
  hints: [
    'The central device needs to support both protocols simultaneously.',
    'Look for the device labeled Dual Stack Router (IPv4 + IPv6).',
    'Connect both servers through the dual-stack router so the host can communicate with either.'
  ]
};

export const TUNNELING_BLUEPRINT: LabBlueprint = {
  labType: 'tunneling',
  title: 'IPv6-in-IPv4 Tunneling Blueprint',
  subtitle: 'Bridging Isolated IPv6 Islands Across Legacy IPv4 Transit',
  goal: 'Construct a network allowing two isolated IPv6 sites to communicate across an IPv4-only transit network using Protocol 41 tunneling encapsulation.',
  whyBuild:
    'In early migration stages, isolated IPv6 networks exist while intermediate backbone networks remain strictly IPv4. Replacing every intermediate router is too expensive. Tunneling (RFC 4213 / Protocol 41) solves this by encapsulating the entire IPv6 packet inside an IPv4 datagram header at Ingress (Gateway A) and stripping it at Egress (Gateway B).',
  theoryAnchor: '#tunneling',
  requiredComponents: [
    {
      id: 'host-v6-a',
      type: 'host-v6',
      label: 'IPv6 Host (Site A)',
      count: 1,
      description: 'IPv6-only source computer in Site A (2001:db8:1::10)',
      requiredIpv6: '2001:db8:1::10'
    },
    {
      id: 'tunnel-gw-a',
      type: 'tunnel-endpoint',
      label: 'Tunnel Gateway A',
      count: 1,
      description: 'Ingress endpoint: wraps IPv6 packets inside an IPv4 Protocol 41 header'
    },
    {
      id: 'transit-v4',
      type: 'network-v4',
      label: 'IPv4 Transit Net',
      count: 1,
      description: 'Legacy intermediate transit cloud unable to understand native IPv6'
    },
    {
      id: 'tunnel-gw-b',
      type: 'tunnel-endpoint',
      label: 'Tunnel Gateway B',
      count: 1,
      description: 'Egress endpoint: removes IPv4 wrapper and extracts original IPv6 datagram'
    },
    {
      id: 'host-v6-b',
      type: 'host-v6',
      label: 'IPv6 Host (Site B)',
      count: 1,
      description: 'IPv6-only destination computer in Site B (2001:db8:2::20)',
      requiredIpv6: '2001:db8:2::20'
    }
  ],
  optionalComponents: [
    {
      type: 'router-v4',
      label: 'IPv4 Router',
      hint: 'Can be used inside the IPv4 transit corridor'
    }
  ],
  assemblySteps: [
    {
      step: 1,
      title: 'Place IPv6 Host (Site A)',
      instruction: 'Drag an IPv6 Host and position it on the far left (Site A).',
      targetHint: 'Host A (Site A)'
    },
    {
      step: 2,
      title: 'Place Tunnel Endpoint A',
      instruction: 'Drag a Tunnel Endpoint and place it adjacent to Host A.',
      targetHint: 'Tunnel Gateway A (Ingress)'
    },
    {
      step: 3,
      title: 'Place IPv4 Transit Network',
      instruction: 'Drag an IPv4 Transit Net and position it in the center of the canvas.',
      targetHint: 'IPv4 Backbone'
    },
    {
      step: 4,
      title: 'Place Tunnel Endpoint B',
      instruction: 'Drag a second Tunnel Endpoint and place it on the right side of the transit network.',
      targetHint: 'Tunnel Gateway B (Egress)'
    },
    {
      step: 5,
      title: 'Place IPv6 Host (Site B)',
      instruction: 'Drag an IPv6 Host and place it on the far right (Site B).',
      targetHint: 'Host B (Site B)'
    },
    {
      step: 6,
      title: 'Connect Site A to Gateway A',
      instruction: 'Connect Host A (eth0) to Tunnel Gateway A (IPv6 LAN port).',
      targetHint: 'Host A ── Gateway A (IPv6)'
    },
    {
      step: 7,
      title: 'Connect Gateway A to IPv4 Transit',
      instruction: 'Connect Gateway A (IPv4 Tunnel port) to IPv4 Transit Net (Port A).',
      targetHint: 'Gateway A ── Transit (IPv4 Tunnel)'
    },
    {
      step: 8,
      title: 'Connect IPv4 Transit to Gateway B',
      instruction: 'Connect IPv4 Transit Net (Port B) to Gateway B (IPv4 Tunnel port).',
      targetHint: 'Transit ── Gateway B (IPv4 Tunnel)'
    },
    {
      step: 9,
      title: 'Connect Gateway B to Site B',
      instruction: 'Connect Gateway B (IPv6 LAN port) to Host B (eth0).',
      targetHint: 'Gateway B ── Host B (IPv6)'
    },
    {
      step: 10,
      title: 'Check and Simulate',
      instruction: 'Click "Check Network" then "Run Simulation". Observe Protocol 41 encapsulation and decapsulation.',
      targetHint: 'Observe [IPv4 [IPv6]] encapsulation'
    }
  ],
  targetTopology: TUNNELING_PRESET,
  explanationAfterSim: {
    title: 'Protocol 41 Encapsulation and Decapsulation',
    whatHappened:
      'The IPv6 datagram from Site A reached Tunnel Gateway A. Because the intermediate transit network is IPv4-only, Gateway A encapsulated the IPv6 packet inside an IPv4 header (Protocol 41). The IPv4 transit routed the datagram as ordinary IPv4 traffic. Upon reaching Gateway B, the IPv4 wrapper was stripped away, and the original IPv6 packet was delivered intact to Site B.',
    theoryLink: '#tunneling'
  },
  hints: [
    'Intermediate transit routers only understand IPv4 traffic.',
    'Place Tunnel Endpoint A at the entrance to the IPv4 transit cloud and Tunnel Endpoint B at the exit.',
    'The tunnel endpoints will wrap (encapsulate) the IPv6 packet inside an IPv4 header (Protocol 41).'
  ]
};

export const TRANSLATION_BLUEPRINT: LabBlueprint = {
  labType: 'translation',
  title: 'NAT64 Stateful Translation Blueprint',
  subtitle: 'Direct Inter-Protocol Header Translation',
  goal: 'Construct a topology enabling an IPv6-only client to directly communicate with a legacy IPv4-only server using a NAT64 translator.',
  whyBuild:
    'When an IPv6-only device must communicate with an IPv4-only service, tunneling does not work because the destination server does not understand IPv6 at all. NAT64 (RFC 6146) solves this by actively rewriting and translating the packet headers: transforming a 40-byte IPv6 header into a 20-byte IPv4 header, and vice-versa on the return path via stateful mapping.',
  theoryAnchor: '#translation',
  requiredComponents: [
    {
      id: 'client-v6',
      type: 'host-v6',
      label: 'IPv6 Client',
      count: 1,
      description: 'IPv6-only computer needing to access legacy services (2001:db8::10)',
      requiredIpv6: '2001:db8::10'
    },
    {
      id: 'nat64-trans',
      type: 'nat64-translator',
      label: 'NAT64 Translator',
      count: 1,
      description: 'Stateful gateway mapping IPv6 addresses to IPv4 pool addresses (192.0.2.1)'
    },
    {
      id: 'server-v4-tgt',
      type: 'server-v4',
      label: 'IPv4 Server',
      count: 1,
      description: 'Legacy web server with no IPv6 support (198.51.100.25)',
      requiredIpv4: '198.51.100.25'
    }
  ],
  optionalComponents: [
    {
      type: 'router-v6',
      label: 'IPv6 Router',
      hint: 'Intermediate IPv6 router on client side'
    },
    {
      type: 'router-v4',
      label: 'IPv4 Router',
      hint: 'Intermediate IPv4 router on server side'
    }
  ],
  assemblySteps: [
    {
      step: 1,
      title: 'Place IPv6 Client',
      instruction: 'Drag an IPv6 Host from the toolbox and place it on the left canvas.',
      targetHint: 'IPv6 Client (Left)'
    },
    {
      step: 2,
      title: 'Place NAT64 Translator',
      instruction: 'Drag a NAT64 Translator and position it in the center.',
      targetHint: 'NAT64 Translator (Center)'
    },
    {
      step: 3,
      title: 'Place IPv4 Server',
      instruction: 'Drag an IPv4 Server and place it on the right.',
      targetHint: 'IPv4 Legacy Server (Right)'
    },
    {
      step: 4,
      title: 'Connect Client to Translator',
      instruction: 'Connect IPv6 Client (eth0) to NAT64 Translator (IPv6 In port).',
      targetHint: 'Client ── NAT64 (IPv6)'
    },
    {
      step: 5,
      title: 'Connect Translator to Server',
      instruction: 'Connect NAT64 Translator (IPv4 Out port) to IPv4 Server (eth0).',
      targetHint: 'NAT64 ── Server (IPv4)'
    },
    {
      step: 6,
      title: 'Check and Simulate',
      instruction: 'Click "Check Network" then "Run Simulation" to observe packet translation.',
      targetHint: 'Observe header conversion'
    }
  ],
  targetTopology: TRANSLATION_PRESET,
  explanationAfterSim: {
    title: 'Stateful Header Translation (NAT64 / DNS64)',
    whatHappened:
      'The IPv6-only client initiated traffic toward a synthetic address (64:ff9b::198.51.100.25). At the NAT64 gateway, the IPv6 header was stripped and replaced with a newly generated IPv4 header, assigning a source address from the NAT64 pool (192.0.2.1). The IPv4 server responded to this pool address. NAT64 looked up its session state table and reverse-translated the response back to native IPv6 for the client.',
    theoryLink: '#translation'
  },
  hints: [
    'The IPv6 client cannot communicate directly with the IPv4 server without a protocol gateway.',
    'Place the NAT64 Translator between the IPv6 client and the IPv4 server.',
    'The translator converts the IPv6 header to IPv4 (and vice-versa) using stateful IP/port mapping.'
  ]
};

export function getLabBlueprint(labType: LabType): LabBlueprint {
  switch (labType) {
    case 'dual-stack':
      return DUAL_STACK_BLUEPRINT;
    case 'tunneling':
      return TUNNELING_BLUEPRINT;
    case 'translation':
      return TRANSLATION_BLUEPRINT;
  }
}
