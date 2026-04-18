import { fetchApi } from '../lib/apiClient';
import type {
  PaginationQuery,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiStatusResponse,
  CustomerModel,
  DriverModel,
  CompanyModel
} from '../types/admin';

// OTP and registration request types are defined in types/admin.ts

/* ==============================================================
   Customers
============================================================== */
export const getCustomers = (query: PaginationQuery) => {
  const params = new URLSearchParams({
    pageNum: query.pageNum.toString(),
    pageSize: query.pageSize.toString(),
  });
  if (query.term) params.append('term', query.term);
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
  const params = new URLSearchParams({
    pageNum: query.pageNum.toString(),
    pageSize: query.pageSize.toString(),
  });
  if (query.term) params.append('term', query.term);
  return fetchApi<ApiGetManyResponse<DriverModel>>(`/ByCompany/${companyId}?${params}`);
};
export const createDriver = (data: Partial<DriverModel>) => fetchApi<ApiGetOneResponse<DriverModel>>(`/Driver`, 'POST', data);
export const updateDriver = (id: string, data: Partial<DriverModel>) => fetchApi<ApiStatusResponse>(`/Driver/${id}`, 'PUT', data);
export const deleteDriver = (id: string) => fetchApi<ApiStatusResponse>(`/Driver/${id}`, 'DELETE');

// Register driver via the dedicated registration endpoint (public-facing)
// Use the main Driver POST endpoint for registration (matches backend Swagger)
export const registerDriver = (data: Partial<DriverModel>) => fetchApi<ApiGetOneResponse<DriverModel>>(`/Driver`, 'POST', data);

// Auth (OTP) endpoints for drivers and customers
export const requestDriverOtp = (payload: { phoneNumber?: string }) => fetchApi(`/Auth/driver/request-otp`, 'POST', payload);
export const verifyDriverOtp = (payload: { phoneNumber?: string; otp?: string }) => fetchApi(`/Auth/driver/verify-otp`, 'POST', payload);

export const requestCustomerOtp = (payload: { phoneNumber?: string }) => fetchApi(`/Auth/customer/request-otp`, 'POST', payload);
export const verifyCustomerOtp = (payload: { phoneNumber?: string; otp?: string }) => fetchApi(`/Auth/customer/verify-otp`, 'POST', payload);


/* ==============================================================
   Companies
============================================================== */
export const getCompanies = (query: PaginationQuery) => {
  const params = new URLSearchParams({
    pageNum: query.pageNum.toString(),
    pageSize: query.pageSize.toString(),
  });
  if (query.term) params.append('term', query.term);
  return fetchApi<ApiGetManyResponse<CompanyModel>>(`/Company?${params}`);
};

export const getCompany = (id: string) => fetchApi<ApiGetOneResponse<CompanyModel>>(`/Company/${id}`);
export const createCompany = (data: Partial<CompanyModel>) => fetchApi<ApiGetOneResponse<CompanyModel>>(`/Company`, 'POST', data);
export const updateCompany = (id: string, data: Partial<CompanyModel>) => fetchApi<ApiStatusResponse>(`/Company/${id}`, 'PUT', data);
export const deleteCompany = (id: string) => fetchApi<ApiStatusResponse>(`/Company/${id}`, 'DELETE');
