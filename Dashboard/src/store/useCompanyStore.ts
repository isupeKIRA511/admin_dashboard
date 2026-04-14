import { create } from 'zustand';
import type { Company, CompanyStatus, DocStatus } from '../types';

interface CompanyState {
  companies: Company[];
  addCompany: (companyData: Partial<Company>) => void;
  updateCompanyStatus: (id: string, status: CompanyStatus) => void;
  updateDocumentStatus: (companyId: string, docId: string, status: DocStatus) => void;
}

const mockDocs = [
  { id: 'd1', name: 'Commercial Registration', type: 'pdf' as const, status: 'verified' as const, uploadedAt: '2024-03-20' },
  { id: 'd2', name: 'Tax Identification', type: 'pdf' as const, status: 'pending' as const, uploadedAt: '2024-03-21' },
  { id: 'd3', name: 'Company License', type: 'image' as const, status: 'verified' as const, uploadedAt: '2024-03-22' },
];

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [
    {
      id: 'c1',
      name: 'Alpha Modern Transport',
      email: 'contact@alphatransport.com',
      phone: '+1234567890',
      managerName: 'Ahmed Salem',
      fullAddress: 'Main St, Riyadh',
      taxId: '1000234556',
      fleetSize: 45,
      services: ['Airport Transfers', 'City P2P'],
      businessType: 'airport',
      commissionRate: 0.15,
      status: 'active',
      totalTrips: 120,
      joinedAt: new Date().toISOString(),
      documents: [...mockDocs],
    },
    {
      id: 'c2',
      name: 'Beta Fleet Services',
      email: 'info@betafleet.com',
      phone: '+0987654321',
      managerName: 'Sarah Khalid',
      fullAddress: 'Old District, Jeddah',
      taxId: '2000345678',
      fleetSize: 32,
      services: ['Inter-province', 'Airport Transfers'],
      businessType: 'inter-province',
      commissionRate: 0.10,
      status: 'active',
      totalTrips: 85,
      joinedAt: new Date().toISOString(),
      documents: mockDocs.map(d => ({ ...d, status: 'verified' })),
    },
    {
      id: 'c3',
      name: 'Giga Group Movers',
      email: 'logistics@gigamovers.com',
      phone: '+1122334455',
      managerName: 'Omar Farouk',
      fullAddress: 'Logistics Zone, Dammam',
      taxId: '3000456789',
      fleetSize: 15,
      services: ['Group Transport', 'Heavy Load'],
      businessType: 'inter-province',
      commissionRate: 0.12,
      status: 'active',
      totalTrips: 42,
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'c4',
      name: 'Care Mobility',
      email: 'support@caremobility.com',
      phone: '+5566778899',
      managerName: 'Laila Hassan',
      fullAddress: 'Health Center, Riyadh',
      taxId: '4000567890',
      fleetSize: 10,
      services: ['Special Needs', 'Medical Transport'],
      businessType: 'airport',
      commissionRate: 0.08,
      status: 'active',
      totalTrips: 28,
      joinedAt: new Date().toISOString(),
    }
  ],


  addCompany: (companyData) =>
    set((state) => ({
      companies: [
        ...state.companies,
        {
          ...companyData,
          id: Math.random().toString(36).substring(7),
          totalTrips: 0,
          joinedAt: new Date().toISOString(),
          documents: mockDocs.map(d => ({ ...d, status: 'pending' })),
        } as Company,
      ],
    })),
  updateCompanyStatus: (id, status) =>
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id ? { ...c, status } : c
      ),
    })),
  updateDocumentStatus: (companyId, docId, status) =>
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === companyId
          ? {
              ...c,
              documents: c.documents?.map((d) =>
                d.id === docId ? { ...d, status } : d
              ),
            }
          : c
      ),
    })),
}));

