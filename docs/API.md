# QuickCred API Reference

Base URLs:

- Production: `https://quickcred-api.onrender.com/api`
- Local: `http://localhost:8080/api`

The API is built with NestJS. All endpoints are JWT-protected by default unless marked public. Most responses are wrapped by the global response interceptor.

## Authentication

Use the access token from login/signup as a bearer token:

```http
Authorization: Bearer <accessToken>
```

Refresh tokens are also stored by the client and used to request new access tokens.

## Roles

| Role | Value |
| --- | --- |
| Admin | `admin` |
| Sales | `sales` |
| Sanction | `sanction` |
| Disbursement | `disbursement` |
| Collection | `collection` |
| Borrower | `borrower` |

## Response Shape

Typical success response:

```json
{
  "status": "success",
  "data": {}
}
```

Typical error response:

```json
{
  "statusCode": 403,
  "message": "Role 'disbursement' is not authorized for this resource",
  "error": "Forbidden"
}
```

## Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/health` | Public | API health check |

## Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Public | Register a borrower account |
| POST | `/auth/login` | Public | Login and receive tokens |
| POST | `/auth/refresh` | Public refresh guard | Refresh access and refresh tokens |
| POST | `/auth/logout` | Authenticated | Invalidate refresh token |

Signup payload:

```json
{
  "fullName": "Test Borrower",
  "email": "borrower@example.com",
  "password": "Borrow@123"
}
```

Login payload:

```json
{
  "email": "admin@quickcred.com",
  "password": "Admin@123"
}
```

## Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/users/me` | Authenticated | Get current user profile |
| PATCH | `/users/profile` | Borrower | Update borrower profile and run eligibility validation |
| GET | `/users/leads?page=1&limit=10` | Sales, Admin | List borrower leads |
| GET | `/users?page=1&limit=10` | Admin | Paginated user list |

Profile update payload:

```json
{
  "fullName": "Test Borrower",
  "pan": "ABCDE1234F",
  "dob": "1995-01-01",
  "monthlySalary": 50000,
  "employmentMode": "salaried"
}
```

## Loans

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/loans` | Borrower | Apply for a new loan |
| GET | `/loans/my` | Borrower | Get current borrower's loans |
| GET | `/loans?page=1&limit=10&status=applied` | Admin, Sales, Sanction, Disbursement, Collection | Paginated loan list |
| GET | `/loans/:id` | Admin, Borrower, Sales, Sanction, Disbursement, Collection | Get one loan |
| PATCH | `/loans/:id/sanction` | Sanction, Admin | Approve or reject a loan |
| PATCH | `/loans/:id/disburse` | Disbursement, Admin | Mark a sanctioned loan as disbursed |
| GET | `/loans/:id/audit` | Admin, Sanction, Disbursement, Collection | Get audit trail |

Apply loan payload:

```json
{
  "amount": 100000,
  "tenureDays": 90,
  "purpose": "Working capital"
}
```

Sanction payload:

```json
{
  "approved": true,
  "sanctionedAmount": 100000,
  "remarks": "Approved after document review"
}
```

Disburse payload:

```json
{
  "reference": "UTR123456789",
  "remarks": "Funds transferred"
}
```

## Documents

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/documents/upload` | Borrower, Admin | Upload PDF/JPG/PNG document up to 5 MB |
| GET | `/documents/loan/:loanId` | Borrower, Admin, Sanction, Disbursement, Collection | Get documents attached to a loan |
| GET | `/documents/my` | Borrower | Get own documents |
| DELETE | `/documents/:id` | Borrower, Admin | Delete own document or admin delete |

Upload uses `multipart/form-data`:

```text
file=<binary>
documentType=salary_slip | id_proof | address_proof
loanId=<optional loan object id>
```

## Payments

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/payments` | Collection, Admin | Record a borrower payment |
| GET | `/payments/loan/:loanId` | Collection, Admin, Disbursement, Sanction | Get payments for a loan |
| GET | `/payments/loan/:loanId/summary` | Collection, Admin, Disbursement, Borrower | Get paid/outstanding summary |

Record payment payload:

```json
{
  "loanId": "65f000000000000000000000",
  "amount": 5000,
  "paidAt": "2026-05-16",
  "reference": "PAY123456"
}
```

## Notifications

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/notifications?page=1&limit=20` | Authenticated | Get current user's notifications |
| GET | `/notifications/unread-count` | Authenticated | Get unread count |
| GET | `/notifications/all?page=1&limit=20` | Admin | Get all notifications |
| PATCH | `/notifications/:id/read` | Authenticated | Mark one notification as read |
| PATCH | `/notifications/read-all` | Authenticated | Mark all current-user notifications as read |

## Analytics

All analytics endpoints are Admin-only.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/analytics/overview` | KPI summary |
| GET | `/analytics/disbursement-chart?days=180` | Disbursement trend |
| GET | `/analytics/repayment-chart?months=6` | Repayment trend |
| GET | `/analytics/status-breakdown` | Loan status distribution |

## Common Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Successful read/update |
| 201 | Resource created |
| 204 | Resource deleted |
| 400 | Validation failed |
| 401 | Missing or invalid authentication |
| 403 | Role is not allowed |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |
