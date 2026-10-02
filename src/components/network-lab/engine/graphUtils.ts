import { NetworkDevice, DeviceConnection, DevicePort } from '../types';

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 100;

export function getPortCoordinates(
  device: NetworkDevice,
  port: DevicePort
): { x: number; y: number } {
  const { x, y } = device;
  switch (port.position) {
    case 'left':
      return { x: x, y: y + NODE_HEIGHT / 2 };
    case 'right':
      return { x: x + NODE_WIDTH, y: y + NODE_HEIGHT / 2 };
    case 'top':
      return { x: x + NODE_WIDTH / 2, y: y };
    case 'bottom':
      return { x: x + NODE_WIDTH / 2, y: y + NODE_HEIGHT };
    default:
      return { x: x + NODE_WIDTH / 2, y: y + NODE_HEIGHT / 2 };
  }
}

export function generateBezierPath(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  pos1: 'left' | 'right' | 'top' | 'bottom' = 'right',
  pos2: 'left' | 'right' | 'top' | 'bottom' = 'left'
): string {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const offset = Math.max(dx * 0.45, dy * 0.3, 40);

  let cp1 = { x: p1.x, y: p1.y };
  let cp2 = { x: p2.x, y: p2.y };

  if (pos1 === 'right') cp1.x += offset;
  else if (pos1 === 'left') cp1.x -= offset;
  else if (pos1 === 'bottom') cp1.y += offset;
  else if (pos1 === 'top') cp1.y -= offset;

  if (pos2 === 'right') cp2.x += offset;
  else if (pos2 === 'left') cp2.x -= offset;
  else if (pos2 === 'bottom') cp2.y += offset;
  else if (pos2 === 'top') cp2.y -= offset;

  return `M ${p1.x} ${p1.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;
}

export function interpolateCubicBezier(
  p0: { x: number; y: number },
  cp1: { x: number; y: number },
  cp2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const clampedT = Math.max(0, Math.min(1, t));
  const u = 1 - clampedT;
  const tt = clampedT * clampedT;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * clampedT;

  const x = uuu * p0.x + 3 * uu * clampedT * cp1.x + 3 * u * tt * cp2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * clampedT * cp1.y + 3 * u * tt * cp2.y + ttt * p3.y;

  return { x, y };
}

export function getPathCoordinatesAtT(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  pos1: 'left' | 'right' | 'top' | 'bottom' = 'right',
  pos2: 'left' | 'right' | 'top' | 'bottom' = 'left',
  t: number = 0.5
): { x: number; y: number } {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const offset = Math.max(dx * 0.45, dy * 0.3, 40);

  const cp1 = { x: p1.x, y: p1.y };
  const cp2 = { x: p2.x, y: p2.y };

  if (pos1 === 'right') cp1.x += offset;
  else if (pos1 === 'left') cp1.x -= offset;
  else if (pos1 === 'bottom') cp1.y += offset;
  else if (pos1 === 'top') cp1.y -= offset;

  if (pos2 === 'right') cp2.x += offset;
  else if (pos2 === 'left') cp2.x -= offset;
  else if (pos2 === 'bottom') cp2.y += offset;
  else if (pos2 === 'top') cp2.y -= offset;

  return interpolateCubicBezier(p1, cp1, cp2, p2, t);
}

// Find shortest path between two devices in an unweighted graph using BFS
export function findPath(
  startId: string,
  targetId: string,
  devices: NetworkDevice[],
  connections: DeviceConnection[]
): { devicePath: string[]; connectionPath: string[] } | null {
  if (startId === targetId) return { devicePath: [startId], connectionPath: [] };

  const adj: Map<string, { neighborId: string; connectionId: string }[]> = new Map();
  for (const d of devices) {
    adj.set(d.id, []);
  }

  for (const conn of connections) {
    const list1 = adj.get(conn.sourceDeviceId) || [];
    list1.push({ neighborId: conn.targetDeviceId, connectionId: conn.id });
    adj.set(conn.sourceDeviceId, list1);

    const list2 = adj.get(conn.targetDeviceId) || [];
    list2.push({ neighborId: conn.sourceDeviceId, connectionId: conn.id });
    adj.set(conn.targetDeviceId, list2);
  }

  const queue: string[] = [startId];
  const visited: Set<string> = new Set([startId]);
  const parentMap: Map<string, { parentId: string; connectionId: string }> = new Map();

  let found = false;

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === targetId) {
      found = true;
      break;
    }

    const neighbors = adj.get(current) || [];
    for (const { neighborId, connectionId } of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        parentMap.set(neighborId, { parentId: current, connectionId });
        queue.push(neighborId);
      }
    }
  }

  if (!found) return null;

  const devicePath: string[] = [];
  const connectionPath: string[] = [];
  let curr = targetId;

  while (curr !== startId) {
    devicePath.unshift(curr);
    const pInfo = parentMap.get(curr)!;
    connectionPath.unshift(pInfo.connectionId);
    curr = pInfo.parentId;
  }
  devicePath.unshift(startId);

  return { devicePath, connectionPath };
}
