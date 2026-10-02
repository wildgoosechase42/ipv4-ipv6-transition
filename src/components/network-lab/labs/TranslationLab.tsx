'use client';

import React from 'react';
import { NetworkLab } from '../NetworkLab';
import { LabType } from '../types';

interface TranslationLabProps {
  onSelectLab?: (lab: LabType) => void;
}

export const TranslationLab: React.FC<TranslationLabProps> = ({ onSelectLab }) => {
  return (
    <div id="translation-lab" className="w-full flex justify-center scroll-mt-24 p-2 sm:p-4">
      <NetworkLab labType="translation" onSelectLab={onSelectLab} />
    </div>
  );
};
