# Teleport.iq — Admin Panel API Reference

**Base URL:** `marketplace/api/v1`

All endpoints except login require:

```
Authorization: Bearer <token>
```

The token is returned by the [Admin Login](#admin-login) endpoint.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Customers](#2-customers)
3. [Drivers](#3-drivers)
4. [Companies](#4-companies)
5. [Common Types](#5-common-types)

---

## 1. Authentication

> **Security note:** Customer and driver phone-only login endpoints (`POST /auth/customer/login` and `POST /auth/driver/login`) were removed. They allowed authentication with only a phone number, bypassing OTP verification entirely. All customer/driver authentication now requires OTP verification via `verify-otp`.

### Admin Login

```
POST /auth/admin/login
```

**Body**

```json
{
  "phoneNumber": "admin",
  "password": "your-admin-password"
}
```

> Credentials are set via the `ADMIN_PHONE` and `ADMIN_PASSWORD` environment variables on the server.

**Response `200`** → [`AuthResponse`](#authresponse)

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "phoneNumber": "admin",
  "token": "<jwt>"
}
```

---

## 2. Customers

### List All Customers

```
GET /customers?pageNum=1&pageSize=20
```

**Query params** → [`PaginationQuery`](#paginationquery)

**Response `200`** → [`ApiGetManyResponse<CustomerModel>`](#apigetmanyresponse)

---

### Get Customer by ID

```
GET /customers/{id}
```

**Response `200`** → [`ApiGetOneResponse<CustomerModel>`](#apigetoneresponse)

**Response `404`** if the customer does not exist.

---

### Update Customer

```
PUT /customers/{id}
```

**Body**

```json
{
  "fullName": "Ali Hassan",
  "phoneNumber": "+9647801234567"
}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

**Response `404`** if customer not found.

---

### Delete Customer

```
DELETE /customers/{id}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

**Response `404`** if customer not found.

---

## 3. Drivers

### Get Driver by ID

```
GET /drivers/{id}
```

**Response `200`** → [`ApiGetOneResponse<DriverModel>`](#apigetoneresponse)

**Response `404`** if driver not found.

---

### List Drivers by Company

```
GET /ByCompany/{companyId}?pageNum=1&pageSize=20
```

**Query params** → [`PaginationQuery`](#paginationquery)

**Response `200`** → [`ApiGetManyResponse<DriverModel>`](#apigetmanyresponse)

---

### Create Driver

```
POST /drivers
```

**Body**

```json
{
  "name": "Mohammed Ali",
  "phoneNumber": "+9647801234567",
  "companyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "carModel": "Camry",
  "carBrand": "Toyota",
  "carLicensePlate": "12 A 34567"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Driver's full name |
| `phoneNumber` | string | Used for OTP login |
| `companyId` | UUID | Must be an existing company ID |
| `carModel` | string | e.g. `"Camry"` |
| `carBrand` | string | e.g. `"Toyota"` |
| `carLicensePlate` | string | Vehicle plate number |

**Response `200`** → [`ApiGetOneResponse<DriverModel>`](#apigetoneresponse)

---

### Update Driver

```
PUT /drivers/{id}
```

**Body** — same shape as [Create Driver](#create-driver).

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

**Response `404`** if driver not found.

---

### Delete Driver

```
DELETE /drivers/{id}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

**Response `404`** if driver not found.

---

## 4. Companies

### List Companies

```
GET /companies?pageNum=1&pageSize=20
```

**Query params** → [`PaginationQuery`](#paginationquery)

**Response `200`** → [`ApiGetManyResponse<CompanyModel>`](#apigetmanyresponse)

---

### Get Company by ID

```
GET /companies/{id}
```

**Response `200`** → [`ApiGetOneResponse<CompanyModel>`](#apigetoneresponse)

**Response `404`** if company not found.

---

### Create Company

```
POST /companies
```

**Body**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Baghdad Express",
  "status": true,
  "reputationScore": 80,
  "createdAt": "2026-01-01T00:00:00Z",
  "deletedAt": "0001-01-01T00:00:00Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Provide a new random UUID |
| `name` | string | Company display name |
| `status` | bool | `true` = active, `false` = inactive |
| `reputationScore` | int | Starting reputation (0–100) |
| `createdAt` | ISO 8601 | Creation timestamp |
| `deletedAt` | ISO 8601 | Set to `"0001-01-01T00:00:00Z"` for new records |

**Response `200`** → [`ApiGetOneResponse<CompanyModel>`](#apigetoneresponse)

---

### Update Company

```
PUT /companies/{id}
```

**Body** — same shape as [Create Company](#create-company). The `id` field in the body **must match** the `{id}` in the URL, otherwise a 400 is returned.

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

**Response `400`** — ID mismatch between URL and body.

**Response `404`** — Company not found.

---

### Delete Company

```
DELETE /companies/{id}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

**Response `404`** if company not found.

---

## 5. Common Types

### AuthResponse

```ts
{
  id: string;           // "00000000-0000-0000-0000-000000000000" for admin
  phoneNumber: string;  // The ADMIN_PHONE value
  token: string;        // JWT bearer token
}
```

---

### PaginationQuery

| Param | Type | Constraints |
|-------|------|-------------|
| `pageNum` | int | ≥ 1 |
| `pageSize` | int | 1 – 100 |
| `term` | string? | Optional text search |
| `startDate` | ISO 8601? | Optional date filter |
| `endDate` | ISO 8601? | Optional date filter |

---

### ApiGetOneResponse

```ts
{
  success: boolean;
  data: T;
  message: string;
}
```

---

### ApiGetManyResponse

```ts
{
  success: boolean;
  pageNum: number;
  pageSize: number;
  totalCount: number;
  data: T[];
  message: string;
}
```

---

### ApiStatusResponse

```ts
{
  success: boolean;
  code: number;
  message: string;
}
```

---

### CustomerModel

```ts
{
  id: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;    // ISO 8601
  updatedAt: string;
  deletedAt: string | null;
}
```

---

### DriverModel

```ts
{
  id: string;
  name: string;
  phoneNumber: string;
  companyId: string;
  carModel: string;
  carBrand: string;
  carLicensePlate: string;
  comfortScore: number;
  createdAt: string;        // ISO 8601
  updatedAt: string | null;
  deletedAt: string | null;
  company: CompanyModel | null;
}
```

---

### CompanyModel

```ts
{
  id: string;
  name: string;
  status: boolean;
  reputationScore: number;
  createdAt: string;    // ISO 8601
  deletedAt: string;
}
```
