import { fetchApi } from '../lib/apiClient';
import { buildPaginationParams } from './apiParams';
import type {
  PaginationQuery,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiStatusResponse,
  CustomerModel,
  DriverModel,
  CompanyModel,
  DriverRegistrationForm,
  AdminBookingQuery,
  BookingResponse,
} from '../types/admin';

// OTP and registration request types are defined in types/admin.ts

/* ==============================================================
   Customers
============================================================== */
export const getCustomers = (query: PaginationQuery) => {
  const params = buildPaginationParams(query);
  return fetchApi<ApiGetManyResponse<CustomerModel>>(`/Customer?${params}`);
};

export const getCustomer = (id: string) => fetchApi<ApiGetOneResponse<CustomerModel>>(`/Customer/${id}`);
export const updateCustomer = (id: string, data: Partial<CustomerModel>) => fetchApi<ApiStatusResponse>(`/Customer/${id}`, 'PUT', data);
export const deleteCustomer = (id: string) => fetchApi<ApiStatusResponse>(`/Customer/${id}`, 'DELETE');


/* ==============================================================
   Drivers
============================================================== */
export const getDriver = (id: string) => fetchApi<ApiGetOneResponse<DriverModel>>(`/Driver/${id}`);
export const getDriversByCompany = (companyId: string, query: PaginationQuery) => {
  const params = buildPaginationParams(query);
  // Backend exposes drivers by company under the Driver controller: /Driver/ByCompany/{companyId}
  // previous implementation omitted the 'Driver' prefix which produced 404 on the server.
  return fetchApi<ApiGetManyResponse<DriverModel>>(`/Driver/ByCompany/${companyId}?${params}`);
};
export const createDriver = (data: Partial<DriverModel>) => fetchApi<ApiGetOneResponse<DriverModel>>(`/Driver`, 'POST', data);
export const updateDriver = (id: string, data: Partial<DriverModel>) => fetchApi<ApiStatusResponse>(`/Driver/${id}`, 'PUT', data);
export const deleteDriver = (id: string) => fetchApi<ApiStatusResponse>(`/Driver/${id}`, 'DELETE');

// Register driver via the dedicated registration endpoint (public-facing)
// Use the main Driver POST endpoint for registration (matches backend Swagger)
export const registerDriver = (data: DriverRegistrationForm) => {
  const payload = new FormData();
  payload.append('name', data.name ?? '');
  payload.append('phoneNumber', data.phoneNumber ?? '');
  payload.append('companyId', data.companyId ?? '');
  payload.append('carModel', data.carModel ?? '');
  payload.append('carBrand', data.carBrand ?? '');
  payload.append('carLicensePlate', data.carLicensePlate ?? '');

  if (data.identityFrontImage) payload.append('identityFrontImage', data.identityFrontImage);
  if (data.identityBackImage) payload.append('identityBackImage', data.identityBackImage);
  if (data.vehicleRegistrationImage) payload.append('vehicleRegistrationImage', data.vehicleRegistrationImage);
  data.vehicleImages.forEach((image) => payload.append('vehicleImages', image));

  return fetchApi<ApiGetOneResponse<DriverModel>>(`/Driver`, 'POST', payload);
};

/* ==============================================================
   Airport transfer bookings (Admin)
============================================================== */
export const getAirportTransferBookings = (query: AdminBookingQuery) => {
  const params = new URLSearchParams({
    page: query.page.toString(),
    pageNum: query.page.toString(),
    pageSize: query.pageSize.toString(),
  });

  if (query.companyId) params.append('companyId', query.companyId);
  if (query.customerId) params.append('customerId', query.customerId);
  if (query.status) params.append('status', query.status);

  return fetchApi<ApiGetManyResponse<BookingResponse>>(`/Booking/admin?${params}`);
};

export const cancelAirportTransferBooking = (bookingId: string) => (
  fetchApi<ApiStatusResponse>(`/Booking/${bookingId}`, 'DELETE')
);

// Auth (OTP) endpoints for drivers and customers
export const requestDriverOtp = (payload: { phoneNumber?: string }) => fetchApi(`/Auth/driver/request-otp`, 'POST', payload);
export const verifyDriverOtp = (payload: { phoneNumber?: string; otp?: string }) => fetchApi(`/Auth/driver/verify-otp`, 'POST', payload);

export const requestCustomerOtp = (payload: { phoneNumber?: string }) => fetchApi(`/Auth/customer/request-otp`, 'POST', payload);
export const verifyCustomerOtp = (payload: { phoneNumber?: string; otp?: string }) => fetchApi(`/Auth/customer/verify-otp`, 'POST', payload);


/* ==============================================================
   Companies
============================================================== */
export const getCompanies = (query: PaginationQuery) => {
  const params = buildPaginationParams(query);
  return fetchApi<ApiGetManyResponse<CompanyModel>>(`/Company?${params}`);
};

export const getCompany = (id: string) => fetchApi<ApiGetOneResponse<CompanyModel>>(`/Company/${id}`);
export const createCompany = (data: Partial<CompanyModel>) => fetchApi<ApiGetOneResponse<CompanyModel>>(`/Company`, 'POST', data);
export const updateCompany = (id: string, data: Partial<CompanyModel>) => fetchApi<ApiStatusResponse>(`/Company/${id}`, 'PUT', data);
export const deleteCompany = (id: string) => fetchApi<ApiStatusResponse>(`/Company/${id}`, 'DELETE');
