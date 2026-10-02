import { NetworkDevice, DeviceConnection, DeviceType, DevicePort } from '../types';

export function createDefaultPorts(type: DeviceType): DevicePort[] {
  switch (type) {
    case 'host-dual':
    case 'host-v4':
    case 'host-v6':
      return [
        { id: 'eth0', name: 'eth0', position: 'right', protocol: type === 'host-dual' ? 'both' : type === 'host-v4' ? 'ipv4' : 'ipv6' }
      ];
    case 'server-dual':
    case 'server-v4':
    case 'server-v6':
      return [
        { id: 'eth0', name: 'eth0', position: 'left', protocol: type === 'server-dual' ? 'both' : type === 'server-v4' ? 'ipv4' : 'ipv6' }
      ];
    case 'router':
    case 'router-v4':
    case 'router-v6':
      return [
        { id: 'eth0', name: 'eth0', position: 'left', protocol: type === 'router-v4' ? 'ipv4' : type === 'router-v6' ? 'ipv6' : 'both' },
        { id: 'eth1', name: 'eth1', position: 'right', protocol: type === 'router-v4' ? 'ipv4' : type === 'router-v6' ? 'ipv6' : 'both' },
        { id: 'eth2', name: 'eth2', position: 'top', protocol: type === 'router-v4' ? 'ipv4' : type === 'router-v6' ? 'ipv6' : 'both' },
        { id: 'eth3', name: 'eth3', position: 'bottom', protocol: type === 'router-v4' ? 'ipv4' : type === 'router-v6' ? 'ipv6' : 'both' }
      ];
    case 'tunnel-endpoint':
      return [
        { id: 'v6-in', name: 'IPv6 LAN', position: 'left', protocol: 'ipv6' },
        { id: 'v4-tun', name: 'IPv4 Tunnel', position: 'right', protocol: 'ipv4' }
      ];
    case 'nat64-translator':
      return [
        { id: 'v6-side', name: 'IPv6 In', position: 'left', protocol: 'ipv6' },
        { id: 'v4-side', name: 'IPv4 Out', position: 'right', protocol: 'ipv4' }
      ];
    case 'network-v4':
      return [
        { id: 'p0', name: 'Port A', position: 'left', protocol: 'ipv4' },
        { id: 'p1', name: 'Port B', position: 'right', protocol: 'ipv4' }
      ];
    case 'network-v6':
      return [
        { id: 'p0', name: 'Port A', position: 'left', protocol: 'ipv6' },
        { id: 'p1', name: 'Port B', position: 'right', protocol: 'ipv6' }
      ];
    default:
      return [{ id: 'p0', name: 'eth0', position: 'right', protocol: 'both' }];
  }
}

export function createNewDevice(type: DeviceType, x: number, y: number, count: number): NetworkDevice {
  const ports = createDefaultPorts(type);
  const id = `dev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  let name = 'Device';
  let ipv4: string | undefined = undefined;
  let ipv6: string | undefined = undefined;
  let protocols = { ipv4: false, ipv6: false };

  switch (type) {
    case 'host-dual':
      name = count === 1 ? 'Dual Stack Laptop' : `Dual Stack Laptop ${count}`;
      ipv4 = `192.168.1.${10 + count}`;
      ipv6 = `2001:db8:1::${10 + count}`;
      protocols = { ipv4: true, ipv6: true };
      break;
    case 'host-v4':
      name = count === 1 ? 'IPv4 Host' : `IPv4 Host ${count}`;
      ipv4 = `192.168.1.${20 + count}`;
      protocols = { ipv4: true, ipv6: false };
      break;
    case 'host-v6':
      name = count === 1 ? 'IPv6 Host' : `IPv6 Host ${count}`;
      ipv6 = `2001:db8:1::${30 + count}`;
      protocols = { ipv4: false, ipv6: true };
      break;
    case 'router':
      name = count === 1 ? 'Dual Stack Router' : `Router ${count}`;
      protocols = { ipv4: true, ipv6: true };
      break;
    case 'router-v4':
      name = count === 1 ? 'IPv4 Router' : `IPv4 Router ${count}`;
      protocols = { ipv4: true, ipv6: false };
      break;
    case 'router-v6':
      name = count === 1 ? 'IPv6 Router' : `IPv6 Router ${count}`;
      protocols = { ipv4: false, ipv6: true };
      break;
    case 'server-v4':
      name = count === 1 ? 'IPv4 Legacy Server' : `IPv4 Server ${count}`;
      ipv4 = `198.51.100.${20 + count}`;
      protocols = { ipv4: true, ipv6: false };
      break;
    case 'server-v6':
      name = count === 1 ? 'IPv6 Cloud Server' : `IPv6 Server ${count}`;
      ipv6 = `2001:db8:2::${40 + count}`;
      protocols = { ipv4: false, ipv6: true };
      break;
    case 'server-dual':
      name = count === 1 ? 'Dual Stack Server' : `Dual Server ${count}`;
      ipv4 = `198.51.100.${50 + count}`;
      ipv6 = `2001:db8:3::${50 + count}`;
      protocols = { ipv4: true, ipv6: true };
      break;
    case 'tunnel-endpoint':
      name = count === 1 ? 'Tunnel Gateway' : `Tunnel Gateway ${count}`;
      ipv4 = `192.0.2.${count}`;
      ipv6 = `2001:db8:tun::${count}`;
      protocols = { ipv4: true, ipv6: true };
      break;
    case 'nat64-translator':
      name = count === 1 ? 'NAT64 Translator' : `NAT64 Gateway ${count}`;
      ipv4 = `192.0.2.1`;
      ipv6 = `64:ff9b::/96`;
      protocols = { ipv4: true, ipv6: true };
      break;
    case 'network-v4':
      name = count === 1 ? 'IPv4 Transit Net' : `IPv4 Transit ${count}`;
      protocols = { ipv4: true, ipv6: false };
      break;
    case 'network-v6':
      name = count === 1 ? 'IPv6 Transit Net' : `IPv6 Transit ${count}`;
      protocols = { ipv4: false, ipv6: true };
      break;
  }

  return {
    id,
    type,
    name,
    x,
    y,
    ipv4,
    ipv6,
    subnet: '255.255.255.0',
    prefix: 64,
    protocols,
    ports,
    status: 'ready'
  };
}

// ---------------- PRESET TOPOLOGIES ----------------

export const DUAL_STACK_PRESET: { devices: NetworkDevice[]; connections: DeviceConnection[] } = {
  devices: [
    {
      id: 'ds-laptop',
      type: 'host-dual',
      name: 'Dual-Stack Laptop',
      x: 80,
      y: 200,
      ipv4: '192.168.1.10',
      ipv6: '2001:db8:1::10',
      subnet: '255.255.255.0',
      prefix: 64,
      protocols: { ipv4: true, ipv6: true },
      ports: [{ id: 'eth0', name: 'eth0', position: 'right', protocol: 'both' }],
      status: 'ready'
    },
    {
      id: 'ds-router',
      type: 'router',
      name: 'Dual-Stack Core Router',
      x: 360,
      y: 200,
      protocols: { ipv4: true, ipv6: true },
      ports: [
        { id: 'eth0', name: 'eth0 (Host)', position: 'left', protocol: 'both' },
        { id: 'eth1', name: 'eth1 (v4 Svr)', position: 'top', protocol: 'ipv4' },
        { id: 'eth2', name: 'eth2 (v6 Svr)', position: 'bottom', protocol: 'ipv6' }
      ],
      status: 'ready'
    },
    {
      id: 'ds-srv-v4',
      type: 'server-v4',
      name: 'IPv4 Web Server',
      x: 640,
      y: 90,
      ipv4: '198.51.100.25',
      subnet: '255.255.255.0',
      protocols: { ipv4: true, ipv6: false },
      ports: [{ id: 'eth0', name: 'eth0', position: 'left', protocol: 'ipv4' }],
      status: 'ready'
    },
    {
      id: 'ds-srv-v6',
      type: 'server-v6',
      name: 'IPv6 Cloud Server',
      x: 640,
      y: 310,
      ipv6: '2001:db8:2::80',
      prefix: 64,
      protocols: { ipv4: false, ipv6: true },
      ports: [{ id: 'eth0', name: 'eth0', position: 'left', protocol: 'ipv6' }],
      status: 'ready'
    }
  ],
  connections: [
    {
      id: 'conn-1',
      sourceDeviceId: 'ds-laptop',
      sourcePortId: 'eth0',
      targetDeviceId: 'ds-router',
      targetPortId: 'eth0',
      protocol: 'both',
      status: 'idle'
    },
    {
      id: 'conn-2',
      sourceDeviceId: 'ds-router',
      sourcePortId: 'eth1',
      targetDeviceId: 'ds-srv-v4',
      targetPortId: 'eth0',
      protocol: 'ipv4',
      status: 'idle'
    },
    {
      id: 'conn-3',
      sourceDeviceId: 'ds-router',
      sourcePortId: 'eth2',
      targetDeviceId: 'ds-srv-v6',
      targetPortId: 'eth0',
      protocol: 'ipv6',
      status: 'idle'
    }
  ]
};

export const TUNNELING_PRESET: { devices: NetworkDevice[]; connections: DeviceConnection[] } = {
  devices: [
    {
      id: 'tun-host-a',
      type: 'host-v6',
      name: 'IPv6 Host (Site A)',
      x: 50,
      y: 200,
      ipv6: '2001:db8:1::10',
      prefix: 64,
      protocols: { ipv4: false, ipv6: true },
      ports: [{ id: 'eth0', name: 'eth0', position: 'right', protocol: 'ipv6' }],
      status: 'ready'
    },
    {
      id: 'tun-te-a',
      type: 'tunnel-endpoint',
      name: 'Tunnel Gateway A',
      x: 270,
      y: 200,
      ipv4: '192.0.2.1',
      ipv6: '2001:db8:1::1',
      protocols: { ipv4: true, ipv6: true },
      ports: [
        { id: 'v6-in', name: 'IPv6 LAN', position: 'left', protocol: 'ipv6' },
        { id: 'v4-tun', name: 'IPv4 Tunnel', position: 'right', protocol: 'ipv4' }
      ],
      status: 'ready'
    },
    {
      id: 'tun-net-v4',
      type: 'network-v4',
      name: 'IPv4 Transit Cloud',
      x: 490,
      y: 200,
      protocols: { ipv4: true, ipv6: false },
      ports: [
        { id: 'p0', name: 'Port A', position: 'left', protocol: 'ipv4' },
        { id: 'p1', name: 'Port B', position: 'right', protocol: 'ipv4' }
      ],
      status: 'ready'
    },
    {
      id: 'tun-te-b',
      type: 'tunnel-endpoint',
      name: 'Tunnel Gateway B',
      x: 710,
      y: 200,
      ipv4: '192.0.2.2',
      ipv6: '2001:db8:2::1',
      protocols: { ipv4: true, ipv6: true },
      ports: [
        { id: 'v4-tun', name: 'IPv4 Tunnel', position: 'left', protocol: 'ipv4' },
        { id: 'v6-in', name: 'IPv6 LAN', position: 'right', protocol: 'ipv6' }
      ],
      status: 'ready'
    },
    {
      id: 'tun-host-b',
      type: 'host-v6',
      name: 'IPv6 Host (Site B)',
      x: 930,
      y: 200,
      ipv6: '2001:db8:2::20',
      prefix: 64,
      protocols: { ipv4: false, ipv6: true },
      ports: [{ id: 'eth0', name: 'eth0', position: 'left', protocol: 'ipv6' }],
      status: 'ready'
    }
  ],
  connections: [
    {
      id: 'conn-tun-1',
      sourceDeviceId: 'tun-host-a',
      sourcePortId: 'eth0',
      targetDeviceId: 'tun-te-a',
      targetPortId: 'v6-in',
      protocol: 'ipv6',
      status: 'idle'
    },
    {
      id: 'conn-tun-2',
      sourceDeviceId: 'tun-te-a',
      sourcePortId: 'v4-tun',
      targetDeviceId: 'tun-net-v4',
      targetPortId: 'p0',
      protocol: 'ipv4',
      status: 'idle'
    },
    {
      id: 'conn-tun-3',
      sourceDeviceId: 'tun-net-v4',
      sourcePortId: 'p1',
      targetDeviceId: 'tun-te-b',
      targetPortId: 'v4-tun',
      protocol: 'ipv4',
      status: 'idle'
    },
    {
      id: 'conn-tun-4',
      sourceDeviceId: 'tun-te-b',
      sourcePortId: 'v6-in',
      targetDeviceId: 'tun-host-b',
      targetPortId: 'eth0',
      protocol: 'ipv6',
      status: 'idle'
    }
  ]
};

export const TRANSLATION_PRESET: { devices: NetworkDevice[]; connections: DeviceConnection[] } = {
  devices: [
    {
      id: 'nat-client',
      type: 'host-v6',
      name: 'IPv6 Client',
      x: 100,
      y: 200,
      ipv6: '2001:db8::10',
      prefix: 64,
      protocols: { ipv4: false, ipv6: true },
      ports: [{ id: 'eth0', name: 'eth0', position: 'right', protocol: 'ipv6' }],
      status: 'ready'
    },
    {
      id: 'nat-gateway',
      type: 'nat64-translator',
      name: 'NAT64 Translator Gateway',
      x: 390,
      y: 200,
      ipv4: '192.0.2.1',
      ipv6: '64:ff9b::/96',
      protocols: { ipv4: true, ipv6: true },
      ports: [
        { id: 'v6-side', name: 'IPv6 Side', position: 'left', protocol: 'ipv6' },
        { id: 'v4-side', name: 'IPv4 Side', position: 'right', protocol: 'ipv4' }
      ],
      status: 'ready'
    },
    {
      id: 'nat-server',
      type: 'server-v4',
      name: 'Legacy IPv4 Server',
      x: 680,
      y: 200,
      ipv4: '198.51.100.25',
      subnet: '255.255.255.0',
      protocols: { ipv4: true, ipv6: false },
      ports: [{ id: 'eth0', name: 'eth0', position: 'left', protocol: 'ipv4' }],
      status: 'ready'
    }
  ],
  connections: [
    {
      id: 'conn-nat-1',
      sourceDeviceId: 'nat-client',
      sourcePortId: 'eth0',
      targetDeviceId: 'nat-gateway',
      targetPortId: 'v6-side',
      protocol: 'ipv6',
      status: 'idle'
    },
    {
      id: 'conn-nat-2',
      sourceDeviceId: 'nat-gateway',
      sourcePortId: 'v4-side',
      targetDeviceId: 'nat-server',
      targetPortId: 'eth0',
      protocol: 'ipv4',
      status: 'idle'
    }
  ]
};

export const LAB_CHALLENGES = {
  'dual-stack': {
    id: 'ch-dual-stack',
    title: 'Dual Stack Coexistence Challenge',
    objective:
      'Build a network where a dual-stack computer can communicate with both an IPv4-only server and an IPv6-only server through a router.',
    checklist: [
      { id: 'c1', label: 'Place a Dual-Stack Host with valid IPv4 and IPv6 addresses', completed: false },
      { id: 'c2', label: 'Place a Dual-Stack Router and connect it to the host', completed: false },
      { id: 'c3', label: 'Connect an IPv4 Server and an IPv6 Server to the router', completed: false },
      { id: 'c4', label: 'Successfully test both IPv4 and IPv6 packet transmissions', completed: false }
    ],
    hints: [
      'Hint 1: A dual-stack device has both an IPv4 address (e.g. 192.168.1.10) and an IPv6 address (e.g. 2001:db8:1::10) active on the same physical interface.',
      'Hint 2: Connect the Dual Stack Host to a central Dual-Stack Router so traffic can branch to both servers.',
      'Hint 3: Use the top bar controls to run "Test IPv4" and "Test IPv6" separately to verify both protocol stacks.'
    ]
  },
  tunneling: {
    id: 'ch-tunneling',
    title: 'IPv6-over-IPv4 Tunneling Challenge',
    objective:
      'Connect two isolated IPv6 networks across an IPv4-only transit infrastructure using Protocol 41 tunnel endpoints.',
    checklist: [
      { id: 'c1', label: 'Place two IPv6 Hosts (Site A and Site B)', completed: false },
      { id: 'c2', label: 'Place an IPv4 Transit Network or IPv4 Router in between', completed: false },
      { id: 'c3', label: 'Place Tunnel Endpoints at both edges of the IPv4 transit', completed: false },
      { id: 'c4', label: 'Run simulation and observe Protocol 41 packet encapsulation and decapsulation', completed: false }
    ],
    hints: [
      'Hint 1: An IPv6 packet cannot travel raw across an IPv4-only network. It requires encapsulation.',
      'Hint 2: Add Tunnel Endpoint A at the entrance to the IPv4 network, and Tunnel Endpoint B at the exit.',
      'Hint 3: Watch the packet transform when it reaches Tunnel Endpoint A — an amber IPv4 wrapper will envelop the blue IPv6 packet!'
    ]
  },
  translation: {
    id: 'ch-translation',
    title: 'NAT64 Stateful Translation Challenge',
    objective:
      'Enable direct bidirectional communication between an IPv6-only client and an IPv4-only server using a NAT64 translator.',
    checklist: [
      { id: 'c1', label: 'Place an IPv6-only client on the left', completed: false },
      { id: 'c2', label: 'Place an IPv4-only server on the right', completed: false },
      { id: 'c3', label: 'Insert a NAT64 Translator in between to bridge the protocols', completed: false },
      { id: 'c4', label: 'Run simulation and inspect the header translation in both directions', completed: false }
    ],
    hints: [
      'Hint 1: An IPv6 host cannot communicate directly with an IPv4 server because their packet headers have entirely different formats.',
      'Hint 2: Add a NAT64 Translator between the two devices. Connect the IPv6 client to the left port and the IPv4 server to the right port.',
      'Hint 3: Notice that unlike tunneling (which encapsulates), NAT64 completely transforms the packet from IPv6 to IPv4!'
    ]
  }
};
