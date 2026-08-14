import { fetchApi } from '../lib/apiClient';
import type { ApiGetManyResponse, BookingResponse, CompanyModel } from '../types/admin';
import type { Company, Trip } from '../types';

export interface ActivityPoint {
  name: string;
  bookings: number;
}

const BOOKING_PAGE_SIZE = 200;
const COMPANY_PAGE_SIZE = 100;

const mapCompany = (company: CompanyModel): Company => ({
  id: company.id,
  name: company.name,
  email: '',
  phone: '',
  managerName: '',
  fullAddress: '',
  taxId: '',
  fleetSize: 0,
  services: [],
  businessType: 'airport',
  commissionRate: 0,
  status: company.status ? 'active' : 'suspended',
  totalTrips: 0,
  joinedAt: company.createdAt,
});

const mapBookingStatus = (status: BookingResponse['status']): Trip['status'] => {
  if (status === 'Completed') return 'completed';
  if (status === 'Cancelled') return 'canceled';
  if (status === 'Confirmed') return 'ongoing';
  return 'pending';
};

const mapBookingToTrip = (booking: BookingResponse): Trip => ({
  id: booking.id,
  companyId: booking.companyId,
  passengerName: booking.customerName,
  passengerPhone: '',
  flightNumber: '',
  pickupLocation: booking.pickup,
  dropoffLocation: booking.dropoff,
  pickupTime: booking.createdAt,
  price: 0,
  status: mapBookingStatus(booking.status),
  paymentMethod: 'cash',
});

const getAdminBookings = async () => {
  const response = await fetchApi<ApiGetManyResponse<BookingResponse>>(
    `/Booking/admin?page=1&pageSize=${BOOKING_PAGE_SIZE}`,
  );

  return response.success ? response.data : [];
};

export const getTrips = async (): Promise<Trip[]> => {
  const bookings = await getAdminBookings();
  return bookings.map(mapBookingToTrip);
};

export const getCompanyDirectory = async (): Promise<Company[]> => {
  const response = await fetchApi<ApiGetManyResponse<CompanyModel>>(`/Company?pageNum=1&pageSize=${COMPANY_PAGE_SIZE}`);
  return response.success ? response.data.map(mapCompany) : [];
};

export const getDashboardChart = async (): Promise<ActivityPoint[]> => {
  const bookings = await getAdminBookings();
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const dateKey = date.toISOString().slice(0, 10);

    return {
      name: formatter.format(date),
      bookings: bookings.filter((booking) => booking.createdAt?.startsWith(dateKey)).length,
    };
  });
};
