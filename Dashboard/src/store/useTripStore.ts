import { create } from 'zustand';
import type { Trip, TripStatus } from '../types';

interface TripState {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTripStatus: (id: string, status: TripStatus) => void;
  getTotalGmv: () => number;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [
    {
      id: 't1',
      companyId: 'c1',
      passengerName: 'John Doe',
      passengerPhone: '+1122334455',
      flightNumber: 'BA123',
      pickupLocation: 'LHR T5',
      dropoffLocation: 'Central London',
      pickupTime: new Date(Date.now() + 3600000).toISOString(), // +1 hour
      price: 100,
      status: 'pending',
      paymentMethod: 'online',
    },
    {
      id: 't2',
      companyId: 'c1',
      passengerName: 'Jane Smith',
      passengerPhone: '+9988776655',
      flightNumber: 'AF456',
      pickupLocation: 'CDG T2',
      dropoffLocation: 'Paris City',
      pickupTime: new Date().toISOString(),
      price: 80,
      status: 'completed',
      paymentMethod: 'cash',
    }
  ],
  addTrip: (tripData) =>
    set((state) => ({
      trips: [
        ...state.trips,
        {
          ...tripData,
          id: Math.random().toString(36).substring(7),
        },
      ],
    })),
  updateTripStatus: (id, status) =>
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),
  getTotalGmv: () => {
    return get().trips.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.price, 0);
  }
}));
