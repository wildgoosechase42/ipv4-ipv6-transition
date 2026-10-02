'use client';

import React from 'react';
import { DualStackLab } from '../network-lab/labs/DualStackLab';

export type Protocol = 'ipv4' | 'ipv6';
export type DestinationKey = 'A' | 'B' | 'C';

export default function DualStackSim() {
  return <DualStackLab />;
}

export { DualStackSim };
