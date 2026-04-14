import React from 'react';
import { FinancialSettlement } from '../features/settlements/FinancialSettlement';

export const SettlementsPage: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FinancialSettlement />
    </div>
  );
};
