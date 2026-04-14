export type TripStatus = 'pending' | 'ongoing' | 'completed' | 'canceled';
export type CompanyStatus = 'active' | 'suspended' | 'pending';
export type DocStatus = 'verified' | 'pending' | 'rejected' | 'missing';

export interface CompanyDoc {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  status: DocStatus;
  uploadedAt: string;
  url?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  companyId: string;
  status: 'active' | 'inactive';
  tripsCount: number;
  rating: number;
}

export interface Vehicle {
  id: string;
  model: string;
  plateNumber: string;
  type: 'sedan' | 'suv' | 'van';
  companyId: string;
  status: 'active' | 'maintenance';
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  email: string;
  phone: string;
  managerName: string;
  fullAddress: string;
  taxId: string;
  fleetSize: number;
  services: string[];
  businessType: 'airport' | 'inter-province';
  commissionRate: number; // e.g., 0.15 for 15%

  status: CompanyStatus;
  totalTrips: number;
  joinedAt: string;
  documents?: CompanyDoc[];
}


export interface Trip {
  id: string;
  companyId: string;
  passengerName: string;
  passengerPhone: string;
  flightNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  price: number;
  status: TripStatus;
  driverName?: string;
  paymentMethod: 'cash' | 'online';
}

export interface GlobalStats {
  totalGmv: number;
  totalCommission: number;
  activeCompaniesCount: number;
  totalTripsToday: number;
}

