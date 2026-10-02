import {
  NetworkDevice,
  DeviceConnection,
  SimulationEvaluation,
  SimulationStep,
  PacketData,
  LabType
} from '../types';
import { findPath, getPortCoordinates } from './graphUtils';
import { isValidIPv4, isValidIPv6, synthesizeNat64IPv6 } from './ipValidator';

export interface RunOptions {
  labType: LabType;
  selectedProtocol?: 'ipv4' | 'ipv6'; // for dual-stack testing
  sourceDeviceId?: string;
  targetDeviceId?: string;
}

export function evaluateSimulation(
  devices: NetworkDevice[],
  connections: DeviceConnection[],
  options: RunOptions
): SimulationEvaluation {
  const { labType, selectedProtocol = 'ipv6' } = options;

  if (devices.length === 0) {
    return {
      success: false,
      message: 'Network canvas is empty. Drag devices from the toolbox to start.',
      steps: [],
      errorDetail: {
        reason: 'No devices found on the canvas.',
        howToFix: 'Drag network components from the left toolbox onto the canvas.'
      }
    };
  }

  if (connections.length === 0) {
    return {
      success: false,
      message: 'No connections found. Connect devices with network cables.',
      steps: [],
      errorDetail: {
        reason: 'Devices are placed but not connected.',
        howToFix: 'Drag cables between device ports to create a network topology.'
      }
    };
  }

  switch (labType) {
    case 'dual-stack':
      return evaluateDualStack(devices, connections, selectedProtocol);
    case 'tunneling':
      return evaluateTunneling(devices, connections);
    case 'translation':
      return evaluateTranslation(devices, connections);
    default:
      return {
        success: false,
        message: 'Unknown lab type',
        steps: []
      };
  }
}

// ----------------------------------------------------
// DUAL STACK EVALUATION
// ----------------------------------------------------
function evaluateDualStack(
  devices: NetworkDevice[],
  connections: DeviceConnection[],
  protocol: 'ipv4' | 'ipv6'
): SimulationEvaluation {
  // Find client host
  const client =
    devices.find((d) => d.type === 'host-dual') ||
    devices.find((d) => d.type.startsWith('host-'));

  if (!client) {
    return {
      success: false,
      message: 'Simulation Failed: Missing Client Host',
      steps: [],
      errorDetail: {
        reason: 'No computer or host device exists in the topology.',
        howToFix: 'Drag a Dual Stack Host onto the canvas to act as the client.',
        faultyDeviceId: undefined
      }
    };
  }

  // Check client address configuration for the tested protocol
  if (protocol === 'ipv4') {
    if (!client.protocols.ipv4 || !isValidIPv4(client.ipv4 || '')) {
      return {
        success: false,
        message: 'IPv4 Communication Failed: Host Missing IPv4 Configuration',
        steps: [],
        errorDetail: {
          reason: `Host "${client.name}" does not have a valid IPv4 address configured (Current: "${client.ipv4 || 'none'}").`,
          howToFix: 'Select the host in the inspector and assign a valid IPv4 address (e.g. 192.168.1.10).',
          faultyDeviceId: client.id
        }
      };
    }
  } else {
    if (!client.protocols.ipv6 || !isValidIPv6(client.ipv6 || '')) {
      return {
        success: false,
        message: 'IPv6 Communication Failed: Host Missing IPv6 Configuration',
        steps: [],
        errorDetail: {
          reason: `Host "${client.name}" does not have a valid IPv6 address configured (Current: "${client.ipv6 || 'none'}").`,
          howToFix: 'Select the host in the inspector and assign a valid IPv6 address (e.g. 2001:db8:1::10).',
          faultyDeviceId: client.id
        }
      };
    }
  }

  // Find target server
  const server = devices.find((d) => {
    if (protocol === 'ipv4') {
      return d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4);
    } else {
      return d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6);
    }
  });

  if (!server) {
    return {
      success: false,
      message: `Simulation Failed: Missing ${protocol.toUpperCase()} Server`,
      steps: [],
      errorDetail: {
        reason: `No destination ${protocol.toUpperCase()} server found in the topology.`,
        howToFix: `Drag an ${protocol.toUpperCase()} Server from the toolbox and connect it to your network.`
      }
    };
  }

  // Check target server IP
  if (protocol === 'ipv4' && (!server.protocols.ipv4 || !isValidIPv4(server.ipv4 || ''))) {
    return {
      success: false,
      message: `IPv4 Communication Failed: Server "${server.name}" has invalid IPv4 configuration`,
      steps: [],
      errorDetail: {
        reason: `Destination server "${server.name}" is missing a valid IPv4 address.`,
        howToFix: 'Configure an IPv4 address on the server (e.g. 192.168.1.50).',
        faultyDeviceId: server.id
      }
    };
  }

  if (protocol === 'ipv6' && (!server.protocols.ipv6 || !isValidIPv6(server.ipv6 || ''))) {
    return {
      success: false,
      message: `IPv6 Communication Failed: Server "${server.name}" has invalid IPv6 configuration`,
      steps: [],
      errorDetail: {
        reason: `Destination server "${server.name}" is missing a valid IPv6 address.`,
        howToFix: 'Configure an IPv6 address on the server (e.g. 2001:db8:1::50).',
        faultyDeviceId: server.id
      }
    };
  }

  // Find path
  const pathResult = findPath(client.id, server.id, devices, connections);
  if (!pathResult) {
    return {
      success: false,
      message: `Unreachable: No physical link between "${client.name}" and "${server.name}"`,
      steps: [],
      errorDetail: {
        reason: 'There is no connected cable path from the client to the destination server.',
        howToFix: 'Connect the client to the server directly or via a network router.'
      }
    };
  }

  const { devicePath, connectionPath } = pathResult;

  // Validate protocol support along every device in the path
  for (const devId of devicePath) {
    const dev = devices.find((d) => d.id === devId)!;
    if (protocol === 'ipv4' && !dev.protocols.ipv4) {
      return {
        success: false,
        message: `Protocol Mismatch: "${dev.name}" cannot forward IPv4 packets`,
        steps: [],
        errorDetail: {
          reason: `Device "${dev.name}" is IPv6-only and cannot process or forward IPv4 traffic.`,
          howToFix: 'Use a Dual-Stack router or an IPv4-capable device along the IPv4 path.',
          faultyDeviceId: dev.id
        }
      };
    }
    if (protocol === 'ipv6' && !dev.protocols.ipv6) {
      return {
        success: false,
        message: `Protocol Mismatch: "${dev.name}" cannot forward IPv6 packets`,
        steps: [],
        errorDetail: {
          reason: `Device "${dev.name}" is IPv4-only and cannot process or forward IPv6 traffic without tunneling or translation.`,
          howToFix: 'Use a Dual-Stack router or an IPv6-capable device along the IPv6 path.',
          faultyDeviceId: dev.id
        }
      };
    }
  }

  // Build sequential simulation steps
  const steps: SimulationStep[] = [];
  const srcIp = protocol === 'ipv4' ? client.ipv4! : client.ipv6!;
  const dstIp = protocol === 'ipv4' ? server.ipv4! : server.ipv6!;

  devicePath.forEach((devId, idx) => {
    const dev = devices.find((d) => d.id === devId)!;
    const isFirst = idx === 0;
    const isLast = idx === devicePath.length - 1;
    const connId = isFirst ? undefined : connectionPath[idx - 1];

    let title = `Hop ${idx + 1}: ${dev.name}`;
    let desc = '';
    let status: PacketData['status'] = 'forwarding';

    if (isFirst) {
      title = `Transmission Ingress: ${dev.name}`;
      desc = `Dual-stack host selected native ${protocol.toUpperCase()} stack based on destination DNS record.`;
    } else if (isLast) {
      title = `Delivered: ${dev.name}`;
      desc = `Destination server received native ${protocol.toUpperCase()} datagram. Handshake complete.`;
      status = 'delivered';
    } else {
      desc = `Router "${dev.name}" forwarded ${protocol.toUpperCase()} datagram to next hop interface.`;
    }

    steps.push({
      stepNumber: idx + 1,
      title,
      description: desc,
      deviceId: dev.id,
      connectionId: connId,
      packetUpdate: {
        id: `pkt-${protocol}-${idx}`,
        protocol,
        sourceIp: srcIp,
        targetIp: dstIp,
        currentHopIndex: idx,
        currentDeviceId: dev.id,
        currentDeviceName: dev.name,
        encapsulation: 'none',
        translationState: 'none',
        status,
        position: { x: dev.x, y: dev.y },
        activeConnectionId: connId
      },
      theoryNote: isFirst
        ? `Dual Stack Coexistence: Host has both stacks active. Sending via ${protocol.toUpperCase()}.`
        : undefined
    });
  });

  return {
    success: true,
    message: `✓ ${protocol.toUpperCase()} COMMUNICATION ESTABLISHED`,
    steps,
    activePath: devicePath,
    latencyMs: devicePath.length * 15
  };
}

// ----------------------------------------------------
// TUNNELING EVALUATION
// ----------------------------------------------------
function evaluateTunneling(
  devices: NetworkDevice[],
  connections: DeviceConnection[]
): SimulationEvaluation {
  // Find source IPv6 Host and destination IPv6 Host
  const v6Hosts = devices.filter(
    (d) => d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6)
  );

  if (v6Hosts.length < 2) {
    return {
      success: false,
      message: 'Tunneling Requires Two IPv6 Endpoints',
      steps: [],
      errorDetail: {
        reason: 'At least two IPv6 hosts are required to demonstrate tunneling across an IPv4 network.',
        howToFix: 'Add two IPv6 Hosts (Site A and Site B) to your canvas.'
      }
    };
  }

  const hostA = v6Hosts[0];
  const hostB = v6Hosts[1];

  if (!isValidIPv6(hostA.ipv6 || '')) {
    return {
      success: false,
      message: `Invalid IPv6 Address on Host "${hostA.name}"`,
      steps: [],
      errorDetail: {
        reason: `Host "${hostA.name}" has an invalid IPv6 address.`,
        howToFix: 'Assign a valid IPv6 address in the inspector (e.g. 2001:db8:1::10).',
        faultyDeviceId: hostA.id
      }
    };
  }

  if (!isValidIPv6(hostB.ipv6 || '')) {
    return {
      success: false,
      message: `Invalid IPv6 Address on Host "${hostB.name}"`,
      steps: [],
      errorDetail: {
        reason: `Host "${hostB.name}" has an invalid IPv6 address.`,
        howToFix: 'Assign a valid IPv6 address in the inspector (e.g. 2001:db8:2::20).',
        faultyDeviceId: hostB.id
      }
    };
  }

  // Find path from Host A to Host B
  const pathResult = findPath(hostA.id, hostB.id, devices, connections);
  if (!pathResult) {
    return {
      success: false,
      message: `Unreachable: No link between "${hostA.name}" and "${hostB.name}"`,
      steps: [],
      errorDetail: {
        reason: 'No connected path exists between Site A and Site B.',
        howToFix: 'Connect Host A -> Tunnel Endpoint A -> IPv4 Transit -> Tunnel Endpoint B -> Host B.'
      }
    };
  }

  const { devicePath, connectionPath } = pathResult;

  // Inspect devices in path
  const pathDevices = devicePath.map((id) => devices.find((d) => d.id === id)!);

  // Check if there is an IPv4 transit segment
  const hasIpv4Transit = pathDevices.some(
    (d) => d.type === 'network-v4' || d.type === 'router-v4' || (!d.protocols.ipv6 && d.protocols.ipv4)
  );

  if (!hasIpv4Transit) {
    return {
      success: false,
      message: 'Tunneling Inapplicable: Path is Already Fully IPv6-Capable',
      steps: [],
      errorDetail: {
        reason: 'There is no IPv4-only transit network along the path that necessitates encapsulation.',
        howToFix: 'Insert an IPv4 Transit Network or IPv4 Router between the two sites.'
      }
    };
  }

  // Check for tunnel endpoints
  const tunnelEndpoints = pathDevices.filter((d) => d.type === 'tunnel-endpoint');

  if (tunnelEndpoints.length < 2) {
    // If an IPv4 device is reached without a tunnel endpoint:
    const faultyIpv4Device = pathDevices.find(
      (d) => d.type === 'network-v4' || d.type === 'router-v4' || (!d.protocols.ipv6 && d.protocols.ipv4)
    );
    return {
      success: false,
      message: 'Simulation Failed: Tunnel Endpoint Missing',
      steps: [],
      errorDetail: {
        reason:
          'The IPv6 packet reached an IPv4-only network, but no tunnel endpoint was configured to encapsulate it.',
        howToFix:
          'Add a Tunnel Endpoint before the IPv4 transit network and another Tunnel Endpoint after it.',
        faultyDeviceId: faultyIpv4Device?.id
      }
    };
  }

  // Verify ordering: Host A ... -> Tunnel Endpoint 1 -> IPv4 Transit ... -> Tunnel Endpoint 2 -> ... Host B
  const te1Idx = pathDevices.findIndex((d) => d.type === 'tunnel-endpoint');
  const te2Idx = pathDevices.slice().reverse().findIndex((d) => d.type === 'tunnel-endpoint');
  const te2RealIdx = pathDevices.length - 1 - te2Idx;

  if (te1Idx >= te2RealIdx) {
    return {
      success: false,
      message: 'Invalid Tunnel Placement',
      steps: [],
      errorDetail: {
        reason: 'The tunnel endpoints are not configured to encapsulate across the transit.',
        howToFix: 'Place one tunnel endpoint at ingress and one at egress.'
      }
    };
  }

  // Verify that any device between TE1 and TE2 is IPv4 capable
  for (let i = te1Idx + 1; i < te2RealIdx; i++) {
    const dev = pathDevices[i];
    if (!dev.protocols.ipv4) {
      return {
        success: false,
        message: `Transit Error: "${dev.name}" cannot route IPv4 tunnel packets`,
        steps: [],
        errorDetail: {
          reason: `Device "${dev.name}" inside the transit corridor does not support IPv4.`,
          howToFix: 'Ensure transit nodes are IPv4-capable.',
          faultyDeviceId: dev.id
        }
      };
    }
  }

  // Success! Build steps with Encapsulation & Decapsulation
  const steps: SimulationStep[] = [];
  const srcIp = hostA.ipv6!;
  const dstIp = hostB.ipv6!;

  pathDevices.forEach((dev, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === pathDevices.length - 1;
    const isIngressTE = idx === te1Idx;
    const isEgressTE = idx === te2RealIdx;
    const isInsideTunnel = idx >= te1Idx && idx <= te2RealIdx;
    const connId = isFirst ? undefined : connectionPath[idx - 1];

    let title = `Hop ${idx + 1}: ${dev.name}`;
    let desc = '';
    let encapsulation: PacketData['encapsulation'] = isInsideTunnel ? 'ipv6-in-ipv4' : 'none';
    let status: PacketData['status'] = 'forwarding';
    let isTransformation: SimulationStep['isTransformation'] = undefined;
    let theoryNote: string | undefined = undefined;

    if (isFirst) {
      title = `Origin: ${dev.name}`;
      desc = `IPv6 datagram generated at Site A. Destined for ${dstIp}.`;
      status = 'forwarding';
    } else if (isIngressTE) {
      title = `Encapsulation: ${dev.name}`;
      desc = `Tunnel Ingress Endpoint wrapped IPv6 packet inside IPv4 header (Protocol 41).`;
      encapsulation = 'ipv6-in-ipv4';
      status = 'encapsulating';
      isTransformation = 'encapsulate';
      theoryNote =
        'Tunneling Encapsulation: The original IPv6 packet is placed inside an IPv4 datagram payload so it can cross legacy transit networks.';
    } else if (isEgressTE) {
      title = `Decapsulation: ${dev.name}`;
      desc = `Tunnel Egress Endpoint stripped outer IPv4 header, extracting original IPv6 datagram.`;
      encapsulation = 'none';
      status = 'decapsulating';
      isTransformation = 'decapsulate';
      theoryNote =
        'Tunneling Decapsulation: The IPv4 wrapper is stripped away. The restored IPv6 packet resumes native forwarding.';
    } else if (isInsideTunnel) {
      title = `IPv4 Transit: ${dev.name}`;
      desc = `Traversing IPv4 transit. Routers treat this as standard IPv4 Protocol 41 traffic.`;
      encapsulation = 'ipv6-in-ipv4';
      status = 'forwarding';
    } else if (isLast) {
      title = `Delivered: ${dev.name}`;
      desc = `Destination IPv6 host received original uncompromised packet.`;
      status = 'delivered';
      encapsulation = 'none';
    }

    steps.push({
      stepNumber: idx + 1,
      title,
      description: desc,
      deviceId: dev.id,
      connectionId: connId,
      packetUpdate: {
        id: `pkt-tunnel-${idx}`,
        protocol: 'ipv6',
        sourceIp: srcIp,
        targetIp: dstIp,
        currentHopIndex: idx,
        currentDeviceId: dev.id,
        currentDeviceName: dev.name,
        encapsulation,
        translationState: 'none',
        status,
        position: { x: dev.x, y: dev.y },
        activeConnectionId: connId
      },
      theoryNote,
      isTransformation
    });
  });

  return {
    success: true,
    message: '✓ TUNNELING COMMUNICATION ESTABLISHED',
    steps,
    activePath: devicePath,
    latencyMs: devicePath.length * 20
  };
}

// ----------------------------------------------------
// TRANSLATION / NAT64 EVALUATION
// ----------------------------------------------------
function evaluateTranslation(
  devices: NetworkDevice[],
  connections: DeviceConnection[]
): SimulationEvaluation {
  // Find IPv6 Client
  const client =
    devices.find((d) => d.type === 'host-v6') ||
    devices.find((d) => d.type.startsWith('host') && d.protocols.ipv6 && !d.protocols.ipv4);

  if (!client) {
    return {
      success: false,
      message: 'Simulation Failed: Missing IPv6 Client',
      steps: [],
      errorDetail: {
        reason: 'No IPv6-only client host exists in the topology.',
        howToFix: 'Drag an IPv6 Host onto the canvas to represent the IPv6 client.'
      }
    };
  }

  // Find IPv4 Server
  const server =
    devices.find((d) => d.type === 'server-v4') ||
    devices.find((d) => d.type.startsWith('server') && d.protocols.ipv4 && !d.protocols.ipv6);

  if (!server) {
    return {
      success: false,
      message: 'Simulation Failed: Missing IPv4 Server',
      steps: [],
      errorDetail: {
        reason: 'No IPv4-only destination server exists in the topology.',
        howToFix: 'Drag an IPv4 Server onto the canvas.'
      }
    };
  }

  if (!isValidIPv6(client.ipv6 || '')) {
    return {
      success: false,
      message: `Invalid IPv6 Address on Client "${client.name}"`,
      steps: [],
      errorDetail: {
        reason: `Client "${client.name}" has an invalid IPv6 address.`,
        howToFix: 'Set a valid IPv6 address in the inspector (e.g. 2001:db8::10).',
        faultyDeviceId: client.id
      }
    };
  }

  if (!isValidIPv4(server.ipv4 || '')) {
    return {
      success: false,
      message: `Invalid IPv4 Address on Server "${server.name}"`,
      steps: [],
      errorDetail: {
        reason: `Server "${server.name}" has an invalid IPv4 address.`,
        howToFix: 'Set a valid IPv4 address in the inspector (e.g. 198.51.100.25).',
        faultyDeviceId: server.id
      }
    };
  }

  // Find path
  const pathResult = findPath(client.id, server.id, devices, connections);
  if (!pathResult) {
    return {
      success: false,
      message: `Unreachable: No link between "${client.name}" and "${server.name}"`,
      steps: [],
      errorDetail: {
        reason: 'No physical network connection connects the IPv6 client to the IPv4 server.',
        howToFix: 'Connect IPv6 Client -> NAT64 Translator -> IPv4 Server.'
      }
    };
  }

  const { devicePath, connectionPath } = pathResult;
  const pathDevices = devicePath.map((id) => devices.find((d) => d.id === id)!);

  // Check for NAT64 translator
  const translator = pathDevices.find((d) => d.type === 'nat64-translator');
  if (!translator) {
    return {
      success: false,
      message: '❌ Translation Failed: Protocol Incompatibility',
      steps: [],
      errorDetail: {
        reason:
          'An IPv6-only client cannot directly communicate with an IPv4-only server because the header formats are incompatible.',
        howToFix:
          'Add a NAT64 Translator between the IPv6 client and the IPv4 server to convert packet headers.',
        faultyDeviceId: client.id
      }
    };
  }

  const translatorIdx = pathDevices.findIndex((d) => d.type === 'nat64-translator');

  // Verify before translator is IPv6 capable, after translator is IPv4 capable
  for (let i = 0; i < translatorIdx; i++) {
    if (!pathDevices[i].protocols.ipv6) {
      return {
        success: false,
        message: `Protocol Mismatch: "${pathDevices[i].name}" cannot forward IPv6`,
        steps: [],
        errorDetail: {
          reason: `Device "${pathDevices[i].name}" on the client side of the translator cannot handle IPv6 packets.`,
          howToFix: 'Ensure all devices preceding the NAT64 translator support IPv6.',
          faultyDeviceId: pathDevices[i].id
        }
      };
    }
  }

  for (let i = translatorIdx + 1; i < pathDevices.length; i++) {
    if (!pathDevices[i].protocols.ipv4) {
      return {
        success: false,
        message: `Protocol Mismatch: "${pathDevices[i].name}" cannot forward IPv4`,
        steps: [],
        errorDetail: {
          reason: `Device "${pathDevices[i].name}" on the server side of the translator cannot handle IPv4 packets.`,
          howToFix: 'Ensure all devices following the NAT64 translator support IPv4.',
          faultyDeviceId: pathDevices[i].id
        }
      };
    }
  }

  // Success! Build steps demonstrating translation (Outbound IPv6 -> IPv4, plus Return IPv4 -> IPv6)
  const steps: SimulationStep[] = [];
  const clientIpv6 = client.ipv6!;
  const targetIpv4 = server.ipv4!;
  const syntheticIpv6 = synthesizeNat64IPv6(targetIpv4);
  const natPoolIpv4 = '192.0.2.1';

  // Forward Journey: Client -> NAT64 -> Server
  pathDevices.forEach((dev, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === pathDevices.length - 1;
    const isTranslator = idx === translatorIdx;
    const isAfterTranslator = idx > translatorIdx;
    const connId = isFirst ? undefined : connectionPath[idx - 1];

    let title = `Hop ${idx + 1}: ${dev.name}`;
    let desc = '';
    let protocol: 'ipv4' | 'ipv6' = isAfterTranslator ? 'ipv4' : 'ipv6';
    let status: PacketData['status'] = 'forwarding';
    let translationState: PacketData['translationState'] = isAfterTranslator
      ? 'translated-to-v4'
      : 'none';
    let isTransformation: SimulationStep['isTransformation'] = undefined;
    let theoryNote: string | undefined = undefined;

    let sIp = clientIpv6;
    let dIp = syntheticIpv6;

    if (isFirst) {
      title = `Client Outbound: ${dev.name}`;
      desc = `DNS64 synthesized destination address "${syntheticIpv6}". IPv6 packet dispatched.`;
      status = 'forwarding';
    } else if (isTranslator) {
      title = `Header Translation: ${dev.name}`;
      desc = `NAT64 extracted IPv4 target (${targetIpv4}), stripped IPv6 header, assigned pool IPv4 (${natPoolIpv4}), and generated an IPv4 header.`;
      status = 'translating';
      translationState = 'translating';
      isTransformation = 'translate-v4';
      theoryNote =
        'NAT64 State Translation: Unlike tunneling which wraps packets, NAT64 actively converts the IP headers, rewriting IPv6 to IPv4.';
      sIp = natPoolIpv4;
      dIp = targetIpv4;
    } else if (isAfterTranslator && !isLast) {
      title = `IPv4 Transit: ${dev.name}`;
      desc = `Forwarding translated IPv4 datagram towards target server.`;
      sIp = natPoolIpv4;
      dIp = targetIpv4;
    } else if (isLast) {
      title = `Server Ingress: ${dev.name}`;
      desc = `Legacy IPv4 server received standard IPv4 datagram without realizing the client was IPv6-only.`;
      status = 'delivered';
      sIp = natPoolIpv4;
      dIp = targetIpv4;
    }

    steps.push({
      stepNumber: idx + 1,
      title,
      description: desc,
      deviceId: dev.id,
      connectionId: connId,
      packetUpdate: {
        id: `pkt-trans-fwd-${idx}`,
        protocol,
        sourceIp: sIp,
        targetIp: dIp,
        currentHopIndex: idx,
        currentDeviceId: dev.id,
        currentDeviceName: dev.name,
        encapsulation: 'none',
        translationState,
        status,
        position: { x: dev.x, y: dev.y },
        activeConnectionId: connId
      },
      theoryNote,
      isTransformation
    });
  });

  // Return Journey: Server -> NAT64 -> Client
  const returnDevices = [...pathDevices].reverse();
  const returnConnections = [...connectionPath].reverse();

  returnDevices.forEach((dev, rIdx) => {
    const isFirstReturn = rIdx === 0;
    const isLastReturn = rIdx === returnDevices.length - 1;
    const isTranslatorReturn = dev.id === translator.id;
    const isAfterTranslatorReturn = rIdx > returnDevices.findIndex((d) => d.id === translator.id);
    const connId = isFirstReturn ? undefined : returnConnections[rIdx - 1];

    const stepNum = pathDevices.length + rIdx + 1;
    let title = `Return Hop ${rIdx + 1}: ${dev.name}`;
    let desc = '';
    let protocol: 'ipv4' | 'ipv6' = isAfterTranslatorReturn ? 'ipv6' : 'ipv4';
    let status: PacketData['status'] = 'forwarding';
    let translationState: PacketData['translationState'] = isAfterTranslatorReturn
      ? 'translated-to-v6'
      : 'none';
    let isTransformation: SimulationStep['isTransformation'] = undefined;
    let theoryNote: string | undefined = undefined;

    let sIp = targetIpv4;
    let dIp = natPoolIpv4;

    if (isFirstReturn) {
      title = `Server Reply: ${dev.name}`;
      desc = `IPv4 server sent response to pool address (${natPoolIpv4}).`;
    } else if (isTranslatorReturn) {
      title = `Reverse Translation: ${dev.name}`;
      desc = `NAT64 looked up state table, mapped session back to ${clientIpv6}, and synthesized IPv6 header.`;
      status = 'translating';
      translationState = 'translating';
      isTransformation = 'translate-v6';
      theoryNote =
        'Stateful Mapping: NAT64 maintains a state table to reverse-translate incoming IPv4 responses back to the original IPv6 client.';
      sIp = syntheticIpv6;
      dIp = clientIpv6;
    } else if (isLastReturn) {
      title = `Session Completed: ${dev.name}`;
      desc = `IPv6 client received complete response from IPv4 server. Handshake verified.`;
      status = 'delivered';
      sIp = syntheticIpv6;
      dIp = clientIpv6;
    } else {
      desc = `Forwarding return packet to client.`;
      if (isAfterTranslatorReturn) {
        sIp = syntheticIpv6;
        dIp = clientIpv6;
      }
    }

    steps.push({
      stepNumber: stepNum,
      title,
      description: desc,
      deviceId: dev.id,
      connectionId: connId,
      packetUpdate: {
        id: `pkt-trans-ret-${rIdx}`,
        protocol,
        sourceIp: sIp,
        targetIp: dIp,
        currentHopIndex: stepNum,
        currentDeviceId: dev.id,
        currentDeviceName: dev.name,
        encapsulation: 'none',
        translationState,
        status,
        position: { x: dev.x, y: dev.y },
        activeConnectionId: connId
      },
      theoryNote,
      isTransformation
    });
  });

  return {
    success: true,
    message: '✓ NAT64 TRANSLATION SESSION ESTABLISHED',
    steps,
    activePath: devicePath,
    latencyMs: devicePath.length * 25
  };
}
