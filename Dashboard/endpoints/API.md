# Teleport.iq API — Documentation Index

**Base URL:** `marketplace/api/v1`

The frontend is split into three separate apps. Each has its own API reference:

| App | Document | Roles covered |
|-----|----------|---------------|
| Customer app | [API-Customer.md](API-Customer.md) | `customer` |
| Driver app | [API-Driver.md](API-Driver.md) | `driver` |
| Admin panel | [API-Admin.md](API-Admin.md) | `admin` |

## Common Notes

- All protected endpoints require `Authorization: Bearer <token>`.
- Customer and driver tokens are obtained **only** via OTP verification (`verify-otp`). Phone-only login endpoints were removed — they bypassed OTP and allowed anyone to authenticate as any registered number.
- Admin tokens are obtained via password login (`POST /auth/admin/login`).
- All responses follow the same envelope shapes — see **Common Types** in each document.
- Dates are ISO 8601 strings. UUIDs are lowercase hyphenated strings.



### Customer — Request OTP

```
POST /auth/customer/request-otp
```

**Body**

```json
{ "phoneNumber": "+9647801234567" }
```

**Response `200`**

```json
{ "success": true, "message": "OTP sent" }
```

---

### Customer — Verify OTP & Login

```
POST /auth/customer/verify-otp
```

**Body**

```json
{
  "phoneNumber": "+9647801234567",
  "otp": "482931"
}
```

**Response `200`** → [`AuthResponse`](#authresponse)

---

### Customer — Login (phone-only, no OTP)

```
POST /auth/customer/login
```

**Body**

```json
{ "phoneNumber": "+9647801234567" }
```

**Response `200`** → [`AuthResponse`](#authresponse)

---

### Driver — Request OTP

```
POST /auth/driver/request-otp
```

**Body**

```json
{ "phoneNumber": "+9647801234567" }
```

**Response `200`**

```json
{ "success": true, "message": "OTP sent" }
```

---

### Driver — Verify OTP & Login

```
POST /auth/driver/verify-otp
```

**Body**

```json
{
  "phoneNumber": "+9647801234567",
  "otp": "482931"
}
```

**Response `200`** → [`AuthResponse`](#authresponse)

---

### Driver — Login (phone-only, no OTP)

```
POST /auth/driver/login
```

**Body**

```json
{ "phoneNumber": "+9647801234567" }
```

**Response `200`** → [`AuthResponse`](#authresponse)

---

### Admin — Login

```
POST /auth/admin/login
```

**Body**

```json
{
  "phoneNumber": "admin",
  "password": "secret"
}
```

**Response `200`** → [`AuthResponse`](#authresponse)

---

## 2. Customers

### Get My Account

> **Role:** `customer`

```
GET /customers/MyAccount
```

**Response `200`** → [`ApiGetOneResponse<CustomerModel>`](#apigetoneresponse)

---

### Update My Account

> **Role:** `customer`

```
PUT /customers/MyAccount
```

**Body**

```json
{
  "fullName": "Ali Hassan",
  "phoneNumber": "+9647801234567"
}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

### List All Customers

> **Role:** `admin`

```
GET /customers?pageNum=1&pageSize=20
```

**Query params** → [`PaginationQuery`](#paginationquery)

**Response `200`** → [`ApiGetManyResponse<CustomerModel>`](#apigetmanyresponse)

---

### Get Customer by ID

> **Role:** `admin`

```
GET /customers/{id}
```

**Response `200`** → [`ApiGetOneResponse<CustomerModel>`](#apigetoneresponse)

---

### Update Customer

> **Role:** `admin`

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

---

### Delete Customer

> **Role:** `admin`

```
DELETE /customers/{id}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

## 3. Credit Cards

All endpoints require the `customer` role.

### List My Credit Cards

```
GET /creditcards?pageNum=1&pageSize=20
```

**Query params** → [`PaginationQuery`](#paginationquery)

**Response `200`** → [`ApiGetManyResponse<CreditCardModel>`](#apigetmanyresponse)

---

### Get Credit Card by ID

```
GET /creditcards/{id}
```

**Response `200`** → [`ApiGetOneResponse<CreditCardModel>`](#apigetoneresponse)

---

### Add Credit Card

```
POST /creditcards?ownerId={customerId}
```

**Body**

```json
{
  "cardNumber": "4111111111111111",
  "cardHolderName": "ALI HASSAN",
  "cve": 123,
  "expiration": 1229
}
```

> `expiration` is an integer in `MMYY` format (e.g. `1229` = Dec 2029).

**Response `200`** → [`ApiGetOneResponse<CreditCardModel>`](#apigetoneresponse)

---

### Delete Credit Card

```
DELETE /creditcards/{id}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

## 4. Drivers

### Get My Account

> **Role:** `driver`

```
GET /drivers/MyAccount
```

**Response `200`** → [`ApiGetOneResponse<DriverModel>`](#apigetoneresponse)

---

### Get Driver by ID

> **Role:** `admin`

```
GET /drivers/{id}
```

**Response `200`** → [`ApiGetOneResponse<DriverModel>`](#apigetoneresponse)

---

### List Drivers by Company

> **Role:** `admin`

```
GET /ByCompany/{companyId}?pageNum=1&pageSize=20
```

**Query params** → [`PaginationQuery`](#paginationquery)

**Response `200`** → [`ApiGetManyResponse<DriverModel>`](#apigetmanyresponse)

---

### Create Driver

> **Role:** `admin`

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

**Response `200`** → [`ApiGetOneResponse<DriverModel>`](#apigetoneresponse)

---

### Update Driver

> **Role:** `admin`

```
PUT /drivers/{id}
```

**Body** — same shape as Create Driver above.

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

### Delete Driver

> **Role:** `admin`

```
DELETE /drivers/{id}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

## 5. Companies

All endpoints require the `admin` role.

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

**Response `200`** → [`ApiGetOneResponse<CompanyModel>`](#apigetoneresponse)

---

### Update Company

```
PUT /companies/{id}
```

**Body** — same shape as Create Company above. The `id` in the body must match the URL `{id}`.

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

### Delete Company

```
DELETE /companies/{id}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

## 6. Ride Offers

### Search Offers

> **Role:** `customer` or `driver`

Used by passengers to find available rides.

```
GET /rideoffers/Search?pickupProvince=Baghdad&dropoffProvince=Basra&seatCount=2&pageNum=1&pageSize=20
```

**Query params**

| Field | Type | Description |
|-------|------|-------------|
| `pickupProvince` | string | Departure province |
| `dropoffProvince` | string | Destination province |
| `seatCount` | int | Number of seats needed |
| `pageNum` | int | Page number (starts at 1) |
| `pageSize` | int | Results per page (max 100) |

**Response `200`** → [`ApiGetManyResponse<RideOffersSearchFields>`](#apigetmanyresponse)

```json
{
  "success": true,
  "pageNum": 1,
  "pageSize": 20,
  "totalCount": 4,
  "data": [
    {
      "price": 15000,
      "pickupProvince": "Baghdad",
      "dropoffProvince": "Basra",
      "destinationLatitude": 30.5,
      "destinationLongitude": 47.8,
      "maxPassengers": 4,
      "companyName": "Baghdad Express",
      "driverName": "Mohammed Ali",
      "carBrand": "Toyota",
      "carModel": "Camry"
    }
  ],
  "message": "Offers retrieved successfully"
}
```

---

### Create Offer

> **Role:** `driver`

The driver's ID is taken from the JWT — no need to send it explicitly.

```
POST /rideoffers
```

**Body**

```json
{
  "price": 15000,
  "pickupProvince": "Baghdad",
  "dropoffProvince": "Basra",
  "destinationLatitude": 30.508,
  "destinationLongitude": 47.783,
  "maxPassengers": 4
}
```

**Response `200`** → [`ApiGetOneResponse<RideOfferModel>`](#apigetoneresponse)

---

### Get My Offers

> **Role:** `driver`

Returns all offers created by the authenticated driver.

```
GET /rideoffers/MyOffers?pageNum=1&pageSize=20
```

**Query params** → [`PaginationQuery`](#paginationquery)

**Response `200`** → [`ApiGetManyResponse<RideOfferModel>`](#apigetmanyresponse)

---

### Get Offer Status

> **Role:** `driver`

Poll this to track how many passengers have requested and accepted a specific offer.

```
GET /rideoffers/{rideOfferId}/Status
```

**Response `200`** → [`ApiGetOneResponse<RideOfferStatusResponse>`](#apigetoneresponse)

```json
{
  "success": true,
  "data": {
    "status": "AwaitingPassengers",
    "message": "بانتظار الركاب"
  },
  "message": "Status retrieved successfully"
}
```

**Possible `status` values**

| Value | Meaning |
|-------|---------|
| `AwaitingPassengers` | Waiting for passengers to request |
| `PickingUpPassengers` | Driver on the way to pick up |
| `Transporting` | Passengers in vehicle, heading to destination |
| `Completed` | Trip finished |
| `DriverCancelled` | Offer was cancelled by the driver |

---

### Cancel Offer

> **Role:** `driver`

```
DELETE /rideoffers/{rideOfferId}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

## 7. Rides

### Passenger — Request a Ride

> **Role:** `customer`

Book a seat on an existing ride offer. The passenger's ID is taken from the JWT.

```
POST /rides
```

**Body**

```json
{ "rideOfferId": "3fa85f64-5717-4562-b3fc-2c963f66afa6" }
```

**Response `200`** → [`ApiGetOneResponse<RideModel>`](#apigetoneresponse)

---

### Passenger — Poll Ride Status

> **Role:** `customer`

```
GET /rides/{rideId}
```

**Response `200`** → [`ApiGetOneResponse<RideModel>`](#apigetoneresponse)

**Possible `status` values on `RideModel`**

| Value | Meaning |
|-------|---------|
| `RequestingRide` | Awaiting driver acceptance |
| `AcceptedRide` | Driver accepted, not yet picked up |
| `PickingYouUp` | Driver is on the way to you |
| `TaxiAwaitingYou` | Driver has arrived at your location |
| `TransportingYou` | You are in the vehicle |
| `Completed` | Trip finished |
| `PassengerCancelled` | Cancelled by passenger |
| `DriverDeclined` | Driver declined the request |

---

### Passenger — Board Ride

> **Role:** `customer`

Call this when the passenger physically boards the vehicle (transitions status to `TransportingYou`).

```
POST /rides/{rideId}/board
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

### Passenger — Cancel Ride

> **Role:** `customer`

```
DELETE /rides/{rideId}
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

### Driver — List Pending Requests for an Offer

> **Role:** `driver`

Returns all ride requests in `RequestingRide` state for the specified offer.

```
GET /rides/offer/{rideOfferId}/pending
```

**Response `200`** → `ApiGetOneResponse<RideModel[]>`

---

### Driver — Accept Request

> **Role:** `driver`

```
POST /rides/{rideId}/accept
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

### Driver — Decline Request

> **Role:** `driver`

```
POST /rides/{rideId}/decline
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

### Driver — Start Pickup

> **Role:** `driver`

Signal that the driver is on the way to pick up the passenger.

```
POST /rides/{rideId}/pickup
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

### Driver — Mark Arrived

> **Role:** `driver`

Signal that the driver has arrived at the passenger's location.

```
POST /rides/{rideId}/arrived
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

### Driver — Complete Trip

> **Role:** `driver`

Signal that the trip is finished.

```
POST /rides/{rideId}/complete
```

**Response `200`** → [`ApiStatusResponse`](#apistatusresponse)

---

## 8. Common Types

### AuthResponse

```ts
{
  id: string;         // UUID of the authenticated user
  phoneNumber: string;
  token: string;      // JWT — store this and send as Bearer token
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
  createdAt: string;   // ISO 8601
  updatedAt: string;
  deletedAt: string | null;
}
```

---

### CreditCardModel

```ts
{
  id: string;
  owner_Id: string;
  cardNumber: string;
  cardHolderName: string;
  cve: number;
  expiration: number;  // MMYY integer, e.g. 1229
  createdAt: string;
  deletedAt: string;
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
  createdAt: string;
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
  createdAt: string;
  deletedAt: string;
}
```

---

### RideOfferModel

```ts
{
  id: string;
  price: number;
  pickupProvince: string;
  dropoffProvince: string;
  destinationLatitude: number;
  destinationLongitude: number;
  maxPassengers: number;
  passengersCount: number;
  driverName: string;
  driverPhoneNumber: string;
  carBrand: string;
  carModel: string;
  carLicensePlate: string;
  companyName: string;
  companyReputation: number;
  carComfortScore: number;
  status: string;   // see RideOffer status values
  driverId: string;
  companyId: string;
}
```

---

### RideModel

```ts
{
  id: string;
  status: string;      // see Ride status values
  price: number;
  passengerName: string;
  driverName: string;
  driverPhoneNumber: string;
  rideOfferId: string;
  companyId: string;
  passengerId: string;
  driverId: string;
  pickupProvince: string;
  dropoffProvince: string;
  destinationLatitude: number;
  destinationLongitude: number;
}
```

---

## Typical Flows

### Customer Books a Ride

```
1. POST /auth/customer/request-otp   → OTP sent to phone
2. POST /auth/customer/verify-otp    → receive token
3. GET  /rideoffers/Search           → browse available offers
4. POST /rides                       → request a seat { rideOfferId }
5. GET  /rides/{rideId}              → poll status (repeat)
6. POST /rides/{rideId}/board        → when driver arrives
7. GET  /rides/{rideId}              → poll until Completed
```

### Driver Runs a Trip
*
```
1. POST /auth/driver/request-otp     → OTP sent to phone
2. POST /auth/driver/verify-otp      → receive token
3. POST /rideoffers                  → create an offer
4. GET  /rideoffers/{offerId}/Status → poll for requests
5. GET  /rides/offer/{offerId}/pending → list pending passenger requests
6. POST /rides/{rideId}/accept       → accept a passenger
7. POST /rides/{rideId}/pickup       → on the way to pick up
8. POST /rides/{rideId}/arrived      → arrived at passenger location
9. POST /rides/{rideId}/complete     → trip finished
```
