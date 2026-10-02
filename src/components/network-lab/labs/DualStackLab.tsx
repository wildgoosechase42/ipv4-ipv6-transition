'use client';

import React from 'react';
import { NetworkLab } from '../NetworkLab';
import { LabType } from '../types';

interface DualStackLabProps {
  onSelectLab?: (lab: LabType) => void;
}

export const DualStackLab: React.FC<DualStackLabProps> = ({ onSelectLab }) => {
  return (
    <div id="dual-stack-lab" className="w-full flex justify-center scroll-mt-24 p-2 sm:p-4">
      <NetworkLab labType="dual-stack" onSelectLab={onSelectLab} />
    </div>
  );
};
