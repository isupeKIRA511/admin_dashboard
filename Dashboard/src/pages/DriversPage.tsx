import React from 'react';
import { DriverList } from '../features/drivers/DriverList';

export const DriversPage: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DriverList />
    </div>
  );
};