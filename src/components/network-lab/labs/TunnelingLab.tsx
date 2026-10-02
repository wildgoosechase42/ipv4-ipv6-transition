'use client';

import React from 'react';
import { NetworkLab } from '../NetworkLab';
import { LabType } from '../types';

interface TunnelingLabProps {
  onSelectLab?: (lab: LabType) => void;
}

export const TunnelingLab: React.FC<TunnelingLabProps> = ({ onSelectLab }) => {
  return (
    <div id="tunneling-lab" className="w-full flex justify-center scroll-mt-24 p-2 sm:p-4">
      <NetworkLab labType="tunneling" onSelectLab={onSelectLab} />
    </div>
  );
};
