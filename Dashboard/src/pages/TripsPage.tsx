import React from 'react';
import { TripLog } from '../features/trips/TripLog';

export const TripsPage: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TripLog />
    </div>
  );
};
