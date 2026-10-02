export type LabType = 'dual-stack' | 'tunneling' | 'translation';

export type ProtocolType = 'ipv4' | 'ipv6' | 'both' | 'none';

export type DeviceType =
  | 'host-dual'
  | 'host-v4'
  | 'host-v6'
  | 'router'
  | 'router-v4'
  | 'router-v6'
  | 'server-v4'
  | 'server-v6'
  | 'server-dual'
  | 'tunnel-endpoint'
  | 'nat64-translator'
  | 'network-v4'
  | 'network-v6';

export interface DevicePort {
  id: string;
  name: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  protocol: ProtocolType;
}

export interface NetworkDevice {
  id: string;
  type: DeviceType;
  name: string;
  x: number;
  y: number;
  ipv4?: string;
  ipv6?: string;
  subnet?: string;
  prefix?: number;
  protocols: {
    ipv4: boolean;
    ipv6: boolean;
  };
  ports: DevicePort[];
  status: 'idle' | 'ready' | 'active' | 'sending' | 'receiving' | 'error';
  errorMsg?: string;
}

export interface DeviceConnection {
  id: string;
  sourceDeviceId: string;
  sourcePortId: string;
  targetDeviceId: string;
  targetPortId: string;
  protocol: ProtocolType;
  status: 'idle' | 'active' | 'error';
  label?: string;
}

export interface PacketData {
  id: string;
  protocol: 'ipv4' | 'ipv6';
  sourceIp: string;
  targetIp: string;
  currentHopIndex: number;
  currentDeviceId: string;
  currentDeviceName: string;
  encapsulation: 'none' | 'ipv6-in-ipv4';
  translationState: 'none' | 'translating' | 'translated-to-v4' | 'translated-to-v6';
  status: 'forwarding' | 'encapsulating' | 'decapsulating' | 'translating' | 'delivered' | 'dropped';
  position: { x: number; y: number };
  activeConnectionId?: string;
}

export interface SimulationStep {
  stepNumber: number;
  title: string;
  description: string;
  deviceId: string;
  connectionId?: string;
  packetUpdate: Partial<PacketData>;
  theoryNote?: string;
  isTransformation?: 'encapsulate' | 'decapsulate' | 'translate-v4' | 'translate-v6';
}

export interface SimulationEvaluation {
  success: boolean;
  message: string;
  steps: SimulationStep[];
  errorDetail?: {
    reason: string;
    howToFix: string;
    faultyDeviceId?: string;
  };
  latencyMs?: number;
  activePath?: string[]; // device IDs
}

export interface EventLogItem {
  id: string;
  timestamp: string;
  level: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  details?: string;
  theoryAnchor?: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  objective: string;
  checklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  hints: string[];
}

export interface AssemblyStep {
  step: number;
  title: string;
  instruction: string;
  targetHint?: string;
}

export interface BlueprintComponent {
  id?: string;
  type: DeviceType;
  label: string;
  count: number;
  description: string;
  requiredIpv4?: string;
  requiredIpv6?: string;
}

export interface LabBlueprint {
  labType: LabType;
  title: string;
  subtitle: string;
  goal: string;
  whyBuild: string;
  theoryAnchor: string;
  requiredComponents: BlueprintComponent[];
  optionalComponents?: {
    type: DeviceType;
    label: string;
    hint: string;
  }[];
  assemblySteps: AssemblyStep[];
  targetTopology: {
    devices: NetworkDevice[];
    connections: DeviceConnection[];
  };
  explanationAfterSim: {
    title: string;
    whatHappened: string;
    theoryLink: string;
  };
  hints?: string[];
}

export interface TopologyCheckItem {
  id: string;
  label: string;
  status: 'passed' | 'failed' | 'warning';
  detail: string;
  relatedDeviceId?: string;
}

export interface TopologyCheckResult {
  isReady: boolean;
  score: number; // 0 to 100
  passedCount: number;
  totalCount: number;
  items: TopologyCheckItem[];
  missingDevices: { type: DeviceType; label: string; count: number }[];
  missingConnections: { sourceName: string; targetName: string; protocol: string }[];
  configErrors: { deviceName: string; issue: string; field: string }[];
}

