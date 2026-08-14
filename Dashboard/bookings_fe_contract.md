# Booking API -- Frontend Integration Contract

## Base URL

```
http://<host>/marketplace/api/v1/Booking
```

## Authentication

All endpoints require a **JWT Bearer token** in the `Authorization` header:

```
Authorization: Bearer <token>
```

### How to obtain a token

**As a Customer** (OTP flow -- two steps):

```bash
# Step 1: Request OTP
curl -s -X POST http://<host>/marketplace/api/v1/Auth/customer/request-otp \
  -H "Content-Type: application/json" \
  -d '{"PhoneNumber": "0123456789"}'

# Step 2: Verify OTP (gets back token)
curl -s -X POST http://<host>/marketplace/api/v1/Auth/customer/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"PhoneNumber": "0123456789", "Otp": "123456"}'
```

Response shape:
```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "phoneNumber": "0123456789",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**As an Admin** (username + password):

```bash
curl -s -X POST http://<host>/marketplace/api/v1/Auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"PhoneNumber": "admin_phone", "Password": "admin_password"}'
```

Response shape is identical to the customer one above.

> **Tip:** Store the `token` field and an env var for quick curl testing:
> ```bash
> TOKEN="eyJhbGciOiJIUzI1NiIs..."
> ```

---

## Data Types

### BookingStatus (string enum)

| Value | Arabic Label |
|---|---|
| `Pending` | بانتظار التأكيد |
| `Confirmed` | تم التأكيد |
| `Cancelled` | تم الإلغاء |
| `Completed` | مكتمل |

### BookingResponse (what the API returns)

| Field | Type | Notes |
|---|---|---|
| `id` | `Guid` (UUID string) | Auto-generated |
| `pickup` | `string` | Pickup location description |
| `dropoff` | `string` | Dropoff location description |
| `latitude` | `double` | Pickup coordinate |
| `longitude` | `double` | Pickup coordinate |
| `maxPassengers` | `int` | Passenger count |
| `homeToAirport` | `bool` | `true` = home-to-airport, `false` = airport-to-home |
| `status` | `string` | One of the BookingStatus values above |
| `customerId` | `Guid` | ID of the customer who created it |
| `customerName` | `string` | Customer's display name |
| `companyId` | `Guid` | Target company |
| `companyName` | `string` | Company's display name |
| `createdAt` | `DateTime` (ISO 8601) | When the booking was created |
| `updatedAt` | `DateTime` (ISO 8601) | Last update timestamp |

---

## Endpoints

### 1. Create a Booking

```
POST /marketplace/api/v1/Booking
Auth: Customer (role = "customer")
```

**Request body** (`CreateBookingRequest`):

| Field | Type | Required | Notes |
|---|---|---|---|
| `pickup` | `string` | Yes | e.g. "Cairo International Airport" |
| `dropoff` | `string` | Yes | e.g. "Zamalek, Cairo" |
| `latitude` | `double` | Yes | Pickup location lat |
| `longitude` | `double` | Yes | Pickup location lng |
| `maxPassengers` | `int` | Yes | At least 1 |
| `homeToAirport` | `bool` | Yes | `true` means pickup=home, dropoff=airport |
| `companyId` | `Guid` | Yes | Must be a valid existing company |

**Response** (200 OK): `ApiGetOneResponse<BookingResponse>`

```json
{
  "success": true,
  "data": { ... BookingResponse ... },
  "message": "Booking created successfully"
}
```

**Errors:**
- `400` -- `Company not found` if `companyId` is invalid
- `401` -- missing/invalid JWT token

**curl:**

```bash
curl -s -X POST http://<host>/marketplace/api/v1/Booking \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup": "Cairo International Airport, Terminal 2",
    "dropoff": "Zamalek, 26th of July Street",
    "latitude": 30.1124,
    "longitude": 31.3992,
    "maxPassengers": 3,
    "homeToAirport": false,
    "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }'
```

---

### 2. List My Bookings

```
GET /marketplace/api/v1/Booking/my
Auth: Customer (role = "customer")
```

No request body. The customer ID is extracted from the JWT token automatically.

**Response** (200 OK): `ApiGetOneResponse<List<BookingResponse>>`

```json
{
  "success": true,
  "data": [
    { ... BookingResponse ... },
    { ... BookingResponse ... }
  ],
  "message": "My bookings retrieved"
}
```

Bookings are ordered by `createdAt` descending (newest first).

**curl:**

```bash
curl -s http://<host>/marketplace/api/v1/Booking/my \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3. Cancel a Booking

```
DELETE /marketplace/api/v1/Booking/{bookingId}
Auth: Customer (role = "customer")
```

- `bookingId` is a `Guid` in the URL path
- Customer must **own** the booking (created it)
- Booking must be in `Pending` or `Confirmed` status
- Status is changed to `Cancelled`

**Response** (200 OK): `ApiStatusResponse`

```json
{
  "success": true,
  "code": 200,
  "message": "Booking cancelled"
}
```

**Errors:**
- `400` -- "Booking not found or access denied" (not yours or doesn't exist)
- `400` -- "Booking cannot be cancelled" (already `Cancelled` or `Completed`)

**curl:**

```bash
curl -s -X DELETE http://<host>/marketplace/api/v1/Booking/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Admin -- List All Bookings (with filters)

```
GET /marketplace/api/v1/Booking/admin
Auth: Admin (role = "admin")
```

All query parameters are **optional**. If none are passed, returns all bookings.

| Query param | Type | Default | Notes |
|---|---|---|---|
| `companyId` | `Guid?` | `null` | Filter by company |
| `customerId` | `Guid?` | `null` | Filter by customer |
| `status` | `string?` | `null` | Filter by status (`Pending`, `Confirmed`, etc.) |
| `page` | `int` | `1` | Page number |
| `pageSize` | `int` | `10` | Items per page |

**Response** (200 OK): `ApiGetManyResponse<BookingResponse>`

```json
{
  "success": true,
  "data": [ ... BookingResponse[] ... ],
  "totalCount": 42,
  "pageNum": 1,
  "pageSize": 10,
  "message": "Bookings retrieved"
}
```

**curl examples:**

```bash
# Get all bookings, page 1, 10 per page
curl -s "http://<host>/marketplace/api/v1/Booking/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Filter by company and status, page 2, 20 per page
curl -s "http://<host>/marketplace/api/v1/Booking/admin?companyId=a1b2c3d4-e5f6-7890-abcd-ef1234567890&status=Pending&page=2&pageSize=20" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Filter by customer only
curl -s "http://<host>/marketplace/api/v1/Booking/admin?customerId=f1e2d3c4-b5a6-7890-1234-567890abcdef" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## Response Wrapper Cheat Sheet

All endpoints return one of these three shapes:

### `ApiStatusResponse` (simple success/fail)

```json
{ "success": true, "code": 200, "message": "..." }
```

### `ApiGetOneResponse<T>` (single item or list)

```json
{ "success": true, "data": <T>, "message": "..." }
```

### `ApiGetManyResponse<T>` (paginated list)

```json
{
  "success": true,
  "data": [<T>, ...],
  "totalCount": 42,
  "pageNum": 1,
  "pageSize": 10,
  "message": "..."
}
```

---

## Error Responses

All errors follow the same shape:

```json
{
  "success": false,
  "code": 400,
  "message": "Human-readable Arabic or English error message"
}
```

Common HTTP status codes:
- `400` -- Validation error, business rule violation
- `401` -- Missing/expired JWT, or wrong role
- `403` -- Authenticated but insufficient role (e.g. customer hitting admin endpoint)

---

## Quick Integration Checklist

- [ ] Obtain customer JWT via OTP flow (request-otp -> verify-otp)
- [ ] Store token in secure storage (Keychain/Keystore for mobile, httpOnly cookie for web)
- [ ] Attach `Authorization: Bearer <token>` header to every request
- [ ] On `401`, redirect to login flow (token expired)
- [ ] Create booking: collect 7 fields from user, POST to `/`
- [ ] My bookings: GET `/my`, display newest-first
- [ ] Cancel: confirm dialog, then DELETE `/{id}` -- only enabled when `status` is `Pending` or `Confirmed`
- [ ] Admin panel: GET `/admin` with optional filters, implement pagination using `totalCount` / `pageNum` / `pageSize`
