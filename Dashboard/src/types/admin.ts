export interface AuthResponse {
  id: string;
  phoneNumber: string;
  token: string;
}

export interface PaginationQuery {
  pageNum: number;
  pageSize: number;
  term?: string;
  startDate?: string;
  endDate?: string;
}

export interface ApiGetOneResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiGetManyResponse<T> {
  success: boolean;
  pageNum: number;
  pageSize: number;
  totalCount: number;
  data: T[];
  message: string;
}

export interface ApiStatusResponse {
  success: boolean;
  code: number;
  message: string;
}

export interface CustomerModel {
  id: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface DriverModel {
  id: string;
  name: string;
  phoneNumber: string;
  companyId: string;
  carModel: string;
  carBrand: string;
  carLicensePlate: string;
  comfortScore: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  company: CompanyModel | null;
}

export interface CompanyModel {
  id: string;
  name: string;
  status: boolean;
  reputationScore: number;
  createdAt: string;
  deletedAt: string | null;
}

// OTP request/verify shapes
export interface OtpRequest {
  phoneNumber?: string;
}

export interface OtpVerifyRequest {
  phoneNumber?: string;
  otp?: string;
}

// Driver registration request (public-facing). Use Partial when creating via service.
export interface DriverRegisterRequest {
  name?: string;
  phoneNumber?: string;
  companyId?: string;
  carModel?: string;
  carBrand?: string;
  carLicensePlate?: string;
}
