import { NetworkDevice, DeviceConnection, LabBlueprint, TopologyCheckResult, TopologyCheckItem } from '../types';
import { isValidIPv4, isValidIPv6 } from './ipValidator';
import { findPath } from './graphUtils';

export function checkTopologyAgainstBlueprint(
  devices: NetworkDevice[],
  connections: DeviceConnection[],
  blueprint: LabBlueprint
): TopologyCheckResult {
  const items: TopologyCheckItem[] = [];
  const missingDevices: { type: any; label: string; count: number }[] = [];
  const missingConnections: { sourceName: string; targetName: string; protocol: string }[] = [];
  const configErrors: { deviceName: string; issue: string; field: string }[] = [];

  let passedCount = 0;
  let totalCount = 0;

  // 1. CHECK REQUIRED DEVICES
  blueprint.requiredComponents.forEach((req, idx) => {
    totalCount++;
    const matching = devices.filter((d) => {
      if (req.type === 'host-dual') return d.type === 'host-dual' || (d.protocols.ipv4 && d.protocols.ipv6 && d.type.startsWith('host'));
      if (req.type === 'host-v6') return d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6);
      if (req.type === 'router') return d.type === 'router' || (d.type.startsWith('router') && d.protocols.ipv4 && d.protocols.ipv6);
      if (req.type === 'server-v4') return d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4);
      if (req.type === 'server-v6') return d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6);
      return d.type === req.type;
    });

    const sameTypeBefore = blueprint.requiredComponents.slice(0, idx).filter((c) => c.type === req.type);
    const prevNeeded = sameTypeBefore.reduce((acc, c) => acc + c.count, 0);
    const allocated = Math.min(req.count, Math.max(0, matching.length - prevNeeded));
    const reqKey = req.id || `${req.type}-${idx}`;

    if (allocated >= req.count) {
      passedCount++;
      items.push({
        id: `dev-${reqKey}`,
        label: `${req.label} placed`,
        status: 'passed',
        detail: `Found ${allocated} of ${req.count} required.`
      });
    } else {
      missingDevices.push({
        type: req.type,
        label: req.label,
        count: req.count - allocated
      });
      items.push({
        id: `dev-${reqKey}`,
        label: `${req.label} missing`,
        status: 'failed',
        detail: `Required ${req.count}, but found ${allocated}. Drag one from the toolbox.`
      });
    }
  });

  // 2. CHECK ADDRESS CONFIGURATIONS
  if (blueprint.labType === 'dual-stack') {
    const dsHost = devices.find((d) => d.type === 'host-dual' || (d.protocols.ipv4 && d.protocols.ipv6 && d.type.startsWith('host')));
    if (dsHost) {
      totalCount++;
      const hasValidV4 = dsHost.protocols.ipv4 && isValidIPv4(dsHost.ipv4 || '');
      const hasValidV6 = dsHost.protocols.ipv6 && isValidIPv6(dsHost.ipv6 || '');

      if (hasValidV4 && hasValidV6) {
        passedCount++;
        items.push({
          id: 'cfg-host-ds',
          label: 'Dual-Stack Host addressing',
          status: 'passed',
          detail: `Configured with IPv4 (${dsHost.ipv4}) and IPv6 (${dsHost.ipv6}).`,
          relatedDeviceId: dsHost.id
        });
      } else {
        if (!hasValidV4) configErrors.push({ deviceName: dsHost.name, issue: 'Missing/invalid IPv4 address', field: 'ipv4' });
        if (!hasValidV6) configErrors.push({ deviceName: dsHost.name, issue: 'Missing/invalid IPv6 address', field: 'ipv6' });
        items.push({
          id: 'cfg-host-ds',
          label: 'Dual-Stack Host address incomplete',
          status: 'failed',
          detail: 'Host requires both a valid IPv4 address (e.g. 192.168.1.10) and IPv6 address (e.g. 2001:db8:1::10).',
          relatedDeviceId: dsHost.id
        });
      }
    }

    const v4Server = devices.find((d) => d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4));
    if (v4Server) {
      totalCount++;
      if (isValidIPv4(v4Server.ipv4 || '')) {
        passedCount++;
        items.push({
          id: 'cfg-srv-v4',
          label: 'IPv4 Server addressing',
          status: 'passed',
          detail: `Configured with ${v4Server.ipv4}`,
          relatedDeviceId: v4Server.id
        });
      } else {
        configErrors.push({ deviceName: v4Server.name, issue: 'Invalid IPv4 address', field: 'ipv4' });
        items.push({
          id: 'cfg-srv-v4',
          label: 'IPv4 Server address invalid',
          status: 'failed',
          detail: 'IPv4 Server requires a valid IPv4 address (e.g. 198.51.100.25).',
          relatedDeviceId: v4Server.id
        });
      }
    }

    const v6Server = devices.find((d) => d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6));
    if (v6Server) {
      totalCount++;
      if (isValidIPv6(v6Server.ipv6 || '')) {
        passedCount++;
        items.push({
          id: 'cfg-srv-v6',
          label: 'IPv6 Server addressing',
          status: 'passed',
          detail: `Configured with ${v6Server.ipv6}`,
          relatedDeviceId: v6Server.id
        });
      } else {
        configErrors.push({ deviceName: v6Server.name, issue: 'Invalid IPv6 address', field: 'ipv6' });
        items.push({
          id: 'cfg-srv-v6',
          label: 'IPv6 Server address invalid',
          status: 'failed',
          detail: 'IPv6 Server requires a valid IPv6 address (e.g. 2001:db8:2::80).',
          relatedDeviceId: v6Server.id
        });
      }
    }
  } else if (blueprint.labType === 'tunneling') {
    const v6Hosts = devices.filter((d) => d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6));
    v6Hosts.forEach((host, idx) => {
      totalCount++;
      if (isValidIPv6(host.ipv6 || '')) {
        passedCount++;
        items.push({
          id: `cfg-host-v6-${idx}`,
          label: `${host.name} address`,
          status: 'passed',
          detail: `Configured with ${host.ipv6}`,
          relatedDeviceId: host.id
        });
      } else {
        configErrors.push({ deviceName: host.name, issue: 'Invalid IPv6 address', field: 'ipv6' });
        items.push({
          id: `cfg-host-v6-${idx}`,
          label: `${host.name} address invalid`,
          status: 'failed',
          detail: 'Assign a valid IPv6 address (e.g. 2001:db8:1::10) in the inspector.',
          relatedDeviceId: host.id
        });
      }
    });
  } else if (blueprint.labType === 'translation') {
    const client = devices.find((d) => d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6));
    const server = devices.find((d) => d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4));

    if (client) {
      totalCount++;
      if (isValidIPv6(client.ipv6 || '')) {
        passedCount++;
        items.push({
          id: 'cfg-nat-client',
          label: 'IPv6 Client address',
          status: 'passed',
          detail: `Configured with ${client.ipv6}`,
          relatedDeviceId: client.id
        });
      } else {
        configErrors.push({ deviceName: client.name, issue: 'Invalid IPv6 address', field: 'ipv6' });
        items.push({
          id: 'cfg-nat-client',
          label: 'IPv6 Client address invalid',
          status: 'failed',
          detail: 'Assign a valid IPv6 address (e.g. 2001:db8::10) in the inspector.',
          relatedDeviceId: client.id
        });
      }
    }

    if (server) {
      totalCount++;
      if (isValidIPv4(server.ipv4 || '')) {
        passedCount++;
        items.push({
          id: 'cfg-nat-server',
          label: 'IPv4 Server address',
          status: 'passed',
          detail: `Configured with ${server.ipv4}`,
          relatedDeviceId: server.id
        });
      } else {
        configErrors.push({ deviceName: server.name, issue: 'Invalid IPv4 address', field: 'ipv4' });
        items.push({
          id: 'cfg-nat-server',
          label: 'IPv4 Server address invalid',
          status: 'failed',
          detail: 'Assign a valid IPv4 address (e.g. 198.51.100.25) in the inspector.',
          relatedDeviceId: server.id
        });
      }
    }
  }

  // 3. CHECK LOGICAL CONNECTIONS / TOPOLOGY STRUCTURE
  if (blueprint.labType === 'dual-stack') {
    const host = devices.find((d) => d.type === 'host-dual' || (d.protocols.ipv4 && d.protocols.ipv6 && d.type.startsWith('host')));
    const router = devices.find((d) => d.type === 'router' || (d.type.startsWith('router') && d.protocols.ipv4 && d.protocols.ipv6));
    const v4Svr = devices.find((d) => d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4));
    const v6Svr = devices.find((d) => d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6));

    // Check Host <-> Router
    totalCount++;
    if (host && router) {
      const p = findPath(host.id, router.id, devices, connections);
      if (p) {
        passedCount++;
        items.push({
          id: 'conn-host-router',
          label: 'Host ── Router link',
          status: 'passed',
          detail: 'Dual-Stack host connected to router.'
        });
      } else {
        missingConnections.push({ sourceName: host.name, targetName: router.name, protocol: 'both' });
        items.push({
          id: 'conn-host-router',
          label: 'Host ── Router link missing',
          status: 'failed',
          detail: 'Connect cable from Dual Stack Host to the Router.'
        });
      }
    } else {
      items.push({
        id: 'conn-host-router',
        label: 'Host ── Router link',
        status: 'failed',
        detail: 'Place both the Host and Router first.'
      });
    }

    // Check Router <-> IPv4 Server
    totalCount++;
    if (router && v4Svr) {
      const p = findPath(router.id, v4Svr.id, devices, connections);
      if (p) {
        passedCount++;
        items.push({
          id: 'conn-router-v4',
          label: 'Router ── IPv4 Server link',
          status: 'passed',
          detail: 'Router connected to IPv4 server.'
        });
      } else {
        missingConnections.push({ sourceName: router.name, targetName: v4Svr.name, protocol: 'ipv4' });
        items.push({
          id: 'conn-router-v4',
          label: 'Router ── IPv4 Server link missing',
          status: 'failed',
          detail: 'Connect cable from the Router to the IPv4 Server.'
        });
      }
    } else {
      items.push({
        id: 'conn-router-v4',
        label: 'Router ── IPv4 Server link',
        status: 'failed',
        detail: 'Place both Router and IPv4 Server first.'
      });
    }

    // Check Router <-> IPv6 Server
    totalCount++;
    if (router && v6Svr) {
      const p = findPath(router.id, v6Svr.id, devices, connections);
      if (p) {
        passedCount++;
        items.push({
          id: 'conn-router-v6',
          label: 'Router ── IPv6 Server link',
          status: 'passed',
          detail: 'Router connected to IPv6 server.'
        });
      } else {
        missingConnections.push({ sourceName: router.name, targetName: v6Svr.name, protocol: 'ipv6' });
        items.push({
          id: 'conn-router-v6',
          label: 'Router ── IPv6 Server link missing',
          status: 'failed',
          detail: 'Connect cable from the Router to the IPv6 Server.'
        });
      }
    } else {
      items.push({
        id: 'conn-router-v6',
        label: 'Router ── IPv6 Server link',
        status: 'failed',
        detail: 'Place both Router and IPv6 Server first.'
      });
    }
  } else if (blueprint.labType === 'tunneling') {
    const v6Hosts = devices.filter((d) => d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6));
    const teDevices = devices.filter((d) => d.type === 'tunnel-endpoint');
    const v4Transit = devices.find((d) => d.type === 'network-v4' || d.type === 'router-v4');

    totalCount += 2;
    if (v6Hosts.length >= 2 && teDevices.length >= 2 && v4Transit) {
      const pathAB = findPath(v6Hosts[0].id, v6Hosts[1].id, devices, connections);
      if (pathAB) {
        passedCount += 2;
        items.push({
          id: 'conn-tunnel-pipeline',
          label: 'Complete Tunneling Pipeline',
          status: 'passed',
          detail: 'Path exists from Site A through Tunnel Gateways and IPv4 Transit to Site B.'
        });
      } else {
        items.push({
          id: 'conn-tunnel-pipeline',
          label: 'Tunneling Pipeline Incomplete',
          status: 'failed',
          detail: 'Connect Host A → Gateway A → IPv4 Transit → Gateway B → Host B.'
        });
      }
    } else {
      items.push({
        id: 'conn-tunnel-pipeline',
        label: 'Tunneling Pipeline Incomplete',
        status: 'failed',
        detail: 'Ensure 2 IPv6 Hosts, 2 Tunnel Gateways, and 1 IPv4 Transit Net are placed and linked.'
      });
    }
  } else if (blueprint.labType === 'translation') {
    const client = devices.find((d) => d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6));
    const translator = devices.find((d) => d.type === 'nat64-translator');
    const server = devices.find((d) => d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4));

    totalCount++;
    if (client && translator) {
      const p1 = findPath(client.id, translator.id, devices, connections);
      if (p1) {
        passedCount++;
        items.push({
          id: 'conn-client-nat',
          label: 'Client ── NAT64 link',
          status: 'passed',
          detail: 'IPv6 Client connected to NAT64 Translator.'
        });
      } else {
        missingConnections.push({ sourceName: client.name, targetName: translator.name, protocol: 'ipv6' });
        items.push({
          id: 'conn-client-nat',
          label: 'Client ── NAT64 link missing',
          status: 'failed',
          detail: 'Connect cable from IPv6 Client to the NAT64 Translator.'
        });
      }
    } else {
      items.push({
        id: 'conn-client-nat',
        label: 'Client ── NAT64 link',
        status: 'failed',
        detail: 'Place both IPv6 Client and NAT64 Translator first.'
      });
    }

    totalCount++;
    if (translator && server) {
      const p2 = findPath(translator.id, server.id, devices, connections);
      if (p2) {
        passedCount++;
        items.push({
          id: 'conn-nat-server',
          label: 'NAT64 ── Server link',
          status: 'passed',
          detail: 'NAT64 Translator connected to IPv4 Server.'
        });
      } else {
        missingConnections.push({ sourceName: translator.name, targetName: server.name, protocol: 'ipv4' });
        items.push({
          id: 'conn-nat-server',
          label: 'NAT64 ── Server link missing',
          status: 'failed',
          detail: 'Connect cable from the NAT64 Translator to the IPv4 Server.'
        });
      }
    } else {
      items.push({
        id: 'conn-nat-server',
        label: 'NAT64 ── Server link',
        status: 'failed',
        detail: 'Place both NAT64 Translator and IPv4 Server first.'
      });
    }
  }

  const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const isReady = passedCount === totalCount && totalCount > 0;

  return {
    isReady,
    score,
    passedCount,
    totalCount,
    items,
    missingDevices,
    missingConnections,
    configErrors
  };
}
