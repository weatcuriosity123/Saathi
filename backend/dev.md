# Saathi Backend — Developer Reference Guide

> **Last Updated:** 2026-04-04  
> **Tech Stack:** Node.js · Express 4 · MongoDB/Mongoose · JWT · BullMQ  
> **Base URL:** `http://localhost:5000/api/v1`  
> **Port:** 5000 (configurable via `.env`)  

---

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Environment Setup](#2-environment-setup)
3. [Running the Server](#3-running-the-server)
4. [Architecture Overview](#4-architecture-overview)
5. [Authentication Flow](#5-authentication-flow)
6. [API Endpoint Reference](#6-api-endpoint-reference)
7. [Data Models](#7-data-models)
8. [Middleware Reference](#8-middleware-reference)
9. [Error Handling](#9-error-handling)
10. [Background Jobs](#10-background-jobs)
11. [External Services](#11-external-services)
12. [What's Not Built Yet](#12-whats-not-built-yet)

---

## 1. Folder Structure

```
D:\Saathi\backend/
├── .env                          # Secret config (git-ignored)
├── .env.example                  # Config template for new developers
├── package.json
├── server.js                     # Entry point — boots DB, starts server, graceful shutdown
│
└── src/
    ├── app.js                    # Express app — middleware stack + route registration
    │
    ├── config/
    │   ├── db.js                 # MongoDB connection (singleton, graceful disconnect)
    │   └── redis.js              # Redis client (BullMQ, optional — app works without it)
    │
    ├── middleware/
    │   ├── auth.middleware.js    # JWT verify + role check (protect, restrictTo)
    │   ├── course.middleware.js  # isCourseOwner, isEnrolled
    │   ├── error.middleware.js   # Global error handler (last middleware in stack)
    │   ├── upload.middleware.js  # Multer memory storage (images only, 5MB max)
    │   └── validate.middleware.js # Zod schema validation wrapper
    │
    ├── modules/                  # Feature-based MVC modules
    │   ├── admin/                # Admin dashboard & moderation
    │   ├── auth/                 # Register, login, refresh, logout, /me
    │   ├── certificate/          # Certificate issuance + verification
    │   ├── course/               # Course CRUD + review workflow
    │   ├── enrollment/           # Payment initiation, verification, webhook
    │   ├── module/               # Video lesson management + Vimeo integration
    │   ├── progress/             # Module completion tracking
    │   ├── review/               # Course ratings and reviews
    │   ├── tutor/                # Tutor profile + password change
    │   ├── upload/               # Avatar + thumbnail uploads to Cloudinary
    │   └── user/
    │       └── user.model.js     # Shared User model used across all modules
    │
    ├── services/
    │   ├── cloudinary.service.js # Upload/delete images
    │   ├── email.service.js      # Nodemailer templates + sending
    │   └── vimeo.service.js      # Vimeo API: upload slots, embed tokens, deletion
    │
    ├── queues/
    │   └── certificate.queue.js  # BullMQ queue definition + job enqueuer
    │
    ├── workers/
    │   └── certificate.worker.js # PDF generation + Cloudinary upload worker
    │
    ├── utils/
    │   ├── AppError.js           # Custom error class (operational errors)
    │   ├── asyncHandler.js       # Async route wrapper (eliminates try/catch)
    │   ├── ApiResponse.js        # Standardized response helper
    │   └── token.js              # JWT generation, verification, cookie management
    │
    └── script/
        └── dbconnecttest.js      # Standalone DB connection test
```

### Module Structure Pattern

Every module follows this MVC layout:

```
modules/[feature]/
├── [feature].routes.js      # HTTP verb + path definitions
├── [feature].controller.js  # Request/response handling ONLY (no business logic)
├── [feature].service.js     # Business logic (testable independently)
├── [feature].model.js       # Mongoose schema + instance methods
└── [feature].validation.js  # Zod schemas (request body validation)
```

---

## 2. Environment Setup

### Required Variables (`.env`)

```env
# App
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/saathi

# JWT
JWT_ACCESS_SECRET=<32+ random bytes>
JWT_REFRESH_SECRET=<32+ random bytes>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (must match frontend dev server)
CLIENT_URL=http://localhost:3000

# Cloudinary (images)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Vimeo (video hosting — requires Business plan for embed tokens)
VIMEO_CLIENT_ID=
VIMEO_CLIENT_SECRET=
VIMEO_ACCESS_TOKEN=

# Razorpay (payments)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Redis (optional — only needed for certificate queue)
REDIS_URL=redis://localhost:6379

# Email (dev: auto-uses Ethereal, prod: fill these)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## 3. Running the Server

```bash
# Install dependencies
npm install

# Development (auto-reload)
npm run dev

# Production
npm start

# Test DB connection only
node src/script/dbconnecttest.js
```

**Startup sequence:**
1. Loads `.env`
2. Connects to MongoDB (fatal if fails)
3. Starts certificate worker (skips gracefully if Redis unavailable)
4. Listens on PORT

**Graceful shutdown** (SIGTERM/SIGINT):
- Stops accepting connections
- Allows in-flight requests to complete
- Disconnects from MongoDB
- Force-kills after 10 seconds

---

## 4. Architecture Overview

### Middleware Stack (in order)

```
Request
  → Helmet (security headers)
  → CORS (origin: CLIENT_URL, credentials: true)
  → Global rate limiter (100 req/min per IP)
  → express.json() (10KB max)
  → express.urlencoded() (10KB max)
  → cookie-parser
  → morgan (dev logging)
  → Routes
  → 404 handler
  → Global error middleware
Response
```

### Request Flow

```
HTTP Request
  → Route match
  → [auth.middleware: protect + restrictTo]
  → [validate.middleware: Zod schema]
  → Controller (extract req params, call service)
  → Service (business logic, DB queries)
  → ApiResponse.success(data)
```

### Response Shape

```json
// Success
{ "success": true, "message": "...", "data": {...} }

// Error
{ "success": false, "message": "...", "errors": [{ "field": "...", "message": "..." }] }
```

---

## 5. Authentication Flow

### Token Strategy

| Token | Lifetime | Storage | Transmission |
|---|---|---|---|
| Access Token | 15 minutes | Client memory (never localStorage) | `Authorization: Bearer <token>` header |
| Refresh Token | 7 days | HttpOnly cookie (SameSite=Strict) | Sent automatically by browser |

### JWT Payload

```json
{
  "id": "<userId>",
  "role": "student | tutor | admin",
  "accountVersion": 1
}
```

**Account Versioning:** Every user has an `accountVersion` field. It increments when the password changes or forced logout is triggered. If the version in the token doesn't match the DB, the token is instantly invalid — no blacklist needed.

### Auth Sequence

```
1. POST /auth/register OR /auth/login
   ↓
   Backend: validate → check email → hash password → create user
   Response: { accessToken, user } + Set-Cookie: refreshToken (HttpOnly)
   
2. Frontend stores accessToken in memory (React state/ref)
   All subsequent requests: Authorization: Bearer <accessToken>
   
3. accessToken expires (15m)
   Frontend: POST /auth/refresh-token (cookie sent automatically)
   Backend: verify cookie → validate accountVersion → issue new token pair
   Response: { accessToken }
   
4. Logout
   POST /auth/logout → Backend clears cookie → Frontend clears token
```

### Protecting Routes

```js
// Route-level protection
router.get('/profile', protect, handler);

// Role-based restriction (AFTER protect)
router.patch('/approve', protect, restrictTo('admin'), handler);
router.post('/courses', protect, restrictTo('tutor', 'admin'), handler);
```

---

## 6. API Endpoint Reference

### Health Check

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Server status + timestamp |

---

### Auth — `/api/v1/auth`

Rate limited: 10/15min on register & login, 30/15min on refresh.

| Method | Route | Auth | Body / Notes | Response |
|---|---|---|---|---|
| POST | `/register` | None | `{ name, email, password, role? }` | `{ accessToken, user }` + refresh cookie |
| POST | `/login` | None | `{ email, password }` | `{ accessToken, user }` + refresh cookie |
| POST | `/refresh-token` | Cookie | No body — reads HttpOnly cookie | `{ accessToken }` |
| POST | `/logout` | None | No body | Clears refresh cookie |
| GET | `/me` | Bearer | None | `{ user }` |

**Register Notes:**
- `role` accepts `student` (default) or `tutor`. Admin role cannot be self-registered.
- Tutor registration initializes embedded `tutorProfile` with `verificationStatus: 'pending'`
- Welcome email sent fire-and-forget

**Password Rules:** 8+ chars, must contain uppercase + lowercase + number

---

### Courses — `/api/v1/courses`

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | None | All | List published courses (filter, search, paginate) |
| GET | `/:id` | Optional | All | Course detail + module list (shows enrollment status if authed) |
| GET | `/tutor/my-courses` | Bearer | Tutor/Admin | All courses owned by authenticated tutor |
| POST | `/` | Bearer | Tutor/Admin | Create new draft course |
| PATCH | `/:id` | Bearer | Owner/Admin | Update course (draft only) |
| POST | `/:id/submit-review` | Bearer | Owner/Admin | Submit for admin review (requires ≥1 ready module) |
| DELETE | `/:id` | Bearer | Owner/Admin | Delete course (no enrolled students allowed) |

**Course Listing Query Params:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number | 1 | |
| `limit` | number | 12 | Max 50 |
| `category` | string | — | Enum filter |
| `level` | string | — | beginner/intermediate/advanced |
| `priceMin` | number | — | INR |
| `priceMax` | number | — | INR |
| `search` | string | — | Full-text search on title, description, tags |
| `sort` | string | newest | newest, oldest, price_asc, price_desc, rating |

**Course Categories:** `programming`, `design`, `business`, `marketing`, `data-science`, `personal-development`, `language`, `other`

**Course Status Workflow:** `draft` → `under_review` → `published` | `removed`

---

### Modules — `/api/v1/courses/:courseId/modules`

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | Optional | All | List modules. Enrolled/tutor/admin get full list with vimeoId; others get free only |
| GET | `/:moduleId/player` | Bearer | Enrolled/Tutor/Admin | Signed Vimeo embed token for playback |
| POST | `/` | Bearer | Tutor/Admin | Create module + initiate Vimeo upload (returns `uploadUrl` for TUS) |
| PATCH | `/reorder` | Bearer | Owner/Admin | Bulk reorder modules |
| PATCH | `/:moduleId` | Bearer | Owner/Admin | Update module metadata |
| DELETE | `/:moduleId` | Bearer | Owner/Admin | Delete module + remove Vimeo video |

**Create Module — Response includes:**
```json
{
  "module": { "_id": "...", "vimeoStatus": "uploading", ... },
  "uploadUrl": "https://files.tus.vimeo.com/..."
}
```
Frontend uses this `uploadUrl` with a TUS client library for direct browser upload to Vimeo.

---

### Enrollments — `/api/v1/enrollments`

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/webhook/razorpay` | Webhook | — | Razorpay payment reconciliation (raw body required) |
| GET | `/my-courses` | Bearer | Student | All enrolled courses with progress |
| GET | `/check/:courseId` | Bearer | Student | Check enrollment status for a course |
| POST | `/:courseId/initiate` | Bearer | Student | Start enrollment. Free: instant COMPLETED. Paid: returns Razorpay order |
| POST | `/verify-payment` | Bearer | Student | Verify Razorpay signature + activate enrollment |

**Initiate Enrollment — Free Course Response:**
```json
{ "message": "Enrolled successfully", "enrollment": { "status": "completed" } }
```

**Initiate Enrollment — Paid Course Response:**
```json
{
  "razorpayOrderId": "order_xxx",
  "amount": 19900,
  "currency": "INR",
  "key": "<razorpay_key_id>"
}
```

**Verify Payment — Request Body:**
```json
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "<hmac-sha256>"
}
```

---

### Progress — `/api/v1/progress`

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/my-learning` | Bearer | Student | All enrolled courses + progress % + resume pointer |
| GET | `/:courseId` | Bearer | Student | Progress for a single course (must be enrolled) |
| POST | `/:courseId/modules/:moduleId/complete` | Bearer | Student | Mark module as completed |
| DELETE | `/:courseId/modules/:moduleId/complete` | Bearer | Student | Unmark module completion |

**Completion Trigger:** When a student marks the last module complete (`percentage === 100`), `completedAt` is set and a certificate generation job is enqueued.

---

### Reviews — `/api/v1/courses/:courseId/reviews`

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | None | All | Paginated reviews for course |
| POST | `/` | Bearer | Student (enrolled) | Create/upsert own review |
| PATCH | `/my` | Bearer | Student | Update own review |
| DELETE | `/my` | Bearer | Student/Admin | Delete review |

---

### Tutor Profile — `/api/v1/tutors`

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/:tutorId/profile` | None | All | Public tutor profile + published courses |
| PATCH | `/me/profile` | Bearer | Tutor/Admin | Update name, bio, expertise |
| PATCH | `/me/password` | Bearer | Any | Change password (increments accountVersion) |

---

### Uploads — `/api/v1/uploads`

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/avatar` | Bearer | Any | Upload avatar image (multipart/form-data, field: `avatar`) |
| POST | `/courses/:courseId/thumbnail` | Bearer | Tutor/Admin | Upload course thumbnail (field: `thumbnail`) |

**Constraints:** JPEG/PNG/WebP only, max 5MB per file.

---

### Certificates — `/api/v1/certificates`

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/verify/:certificateId` | None | All | Public certificate verification (for employers) |
| GET | `/my` | Bearer | Student | All certificates earned by authenticated student |

**Certificate ID Format:** `SAATHI-A1B2C3D4` (SAATHI- prefix + 8 hex chars)

---

### Admin — `/api/v1/admin`

All routes require: `protect` + `restrictTo('admin')`

| Method | Route | Description |
|---|---|---|
| GET | `/stats` | Dashboard stats: users, courses, enrollments counts |
| GET | `/users` | Paginated user list (filter by role, search by name/email) |
| PATCH | `/users/:userId/toggle-active` | Activate / deactivate user account |
| GET | `/tutors/pending` | Tutors awaiting verification (FIFO) |
| GET | `/tutors` | All tutors |
| PATCH | `/tutors/:tutorId/approve` | Approve tutor application |
| PATCH | `/tutors/:tutorId/reject` | Reject with feedback note |
| GET | `/courses/under-review` | Courses awaiting admin review |
| PATCH | `/courses/:courseId/publish` | Publish course |
| PATCH | `/courses/:courseId/reject` | Send back to draft with note |
| PATCH | `/courses/:courseId/unpublish` | Remove published course |

---

## 7. Data Models

### User

```
_id, name, email, password*, role (student|tutor|admin),
isActive, isEmailVerified, accountVersion*, avatar,
tutorProfile { bio, expertise[], verificationStatus, isApproved, totalEarnings, pendingPayout },
deletedAt, createdAt, updatedAt
```
`*` = never returned to client (select: false or toSafeObject() strips it)

### Course

```
_id, title, slug*, description, shortDescription, price (0–10000 INR),
tutorId (→ User), category (enum), level (enum), language,
tags[], requirements[], outcomes[], thumbnail (Cloudinary URL),
totalModules*, totalDuration* (seconds), totalStudents*,
rating { average, count }, status (draft|under_review|published|removed),
reviewNote, publishedAt, createdAt, updatedAt
```
`*` = denormalized counters, updated by services

### Module

```
_id, courseId (→ Course), title, description, vimeoId, vimeoStatus (uploading|transcoding|ready|error),
duration (seconds), order, points (0–100), isFree, resources[],
createdAt, updatedAt
```

### Enrollment

```
_id, userId (→ User), courseId (→ Course), amount (INR at enrollment),
razorpayOrderId, razorpayPaymentId, razorpaySignature*,
status (pending|completed|failed|refunded),
enrolledAt, refundedAt, refundNote, createdAt, updatedAt
```
`*` = never returned to client

### Progress

```
_id, userId (→ User), courseId (→ Course),
completedModules[] (→ Module), percentage (0–100),
totalPoints, lastModuleId (→ Module), completedAt, createdAt, updatedAt
```

### Review

```
_id, userId (→ User), courseId (→ Course),
rating (1–5), comment (max 1000), createdAt, updatedAt
```

### Certificate

```
_id, userId (→ User), courseId (→ Course),
certificateId (SAATHI-XXXXXXXX), pdfUrl (Cloudinary URL),
issuedAt, createdAt, updatedAt
```

---

## 8. Middleware Reference

### `protect` (auth.middleware.js)

Validates Bearer JWT, attaches user to `req.user`. Use on any route requiring login.

```js
import { protect } from '../middleware/auth.middleware.js';
router.get('/me', protect, getMeController);
```

### `restrictTo(...roles)` (auth.middleware.js)

RBAC guard. Must come after `protect`.

```js
router.post('/courses', protect, restrictTo('tutor', 'admin'), createCourse);
router.patch('/admin/publish', protect, restrictTo('admin'), publishCourse);
```

### `isCourseOwner` (course.middleware.js)

Verifies authenticated user owns the course (or is admin). Attaches `req.course`.

```js
router.patch('/:id', protect, isCourseOwner, updateCourse);
```

### `isEnrolled` (course.middleware.js)

Verifies user has a COMPLETED enrollment for the course. Free courses pass automatically. Admins and course tutors always pass.

```js
router.post('/:courseId/modules/:moduleId/complete', protect, isEnrolled, markComplete);
```

### `validate(schema)` (validate.middleware.js)

Runs Zod schema against `req.body`. On success, replaces `req.body` with parsed/coerced output. On failure, returns 400 with field errors.

```js
import { registerSchema } from './auth.validation.js';
router.post('/register', validate(registerSchema), register);
```

### `imageUpload` (upload.middleware.js)

Multer memory storage instance. Use as `imageUpload.single('fieldName')`.

```js
router.post('/avatar', protect, imageUpload.single('avatar'), uploadAvatar);
```

---

## 9. Error Handling

### AppError Class

```js
throw new AppError('Course not found', 404);
throw new AppError('Validation failed', 400, [
  { field: 'email', message: 'Already in use' }
]);
```

### Auto-Handled Error Types

| Error | HTTP Status |
|---|---|
| Mongoose `CastError` (invalid ObjectId) | 400 |
| MongoDB duplicate key (code 11000) | 409 |
| Mongoose `ValidationError` | 400 |
| JWT `TokenExpiredError` | 401 "Session expired" |
| JWT `JsonWebTokenError` | 401 "Invalid token" |
| `AppError` (operational) | As specified |
| Unknown errors | 500 (stack in dev, hidden in prod) |

### asyncHandler

Wraps async controllers to eliminate try/catch boilerplate:

```js
import asyncHandler from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.user.id);
  respond(res).success(user, 'Profile fetched');
});
```

---

## 10. Background Jobs

### Certificate Queue (BullMQ + Redis)

When a student completes a course (100% progress), the progress service enqueues a certificate job:

```js
await addCertificateJob(userId, courseId);
```

The certificate worker (`src/workers/certificate.worker.js`) runs concurrently (3 workers) and:
1. Checks idempotency (skips if certificate pdfUrl already exists)
2. Fetches user + course data
3. Generates PDF in memory with PDFKit (A4 landscape, Saathi branding)
4. Uploads PDF to Cloudinary (`saathi/certificates/` folder)
5. Saves Cloudinary URL to certificate document
6. Sends certificate email to student

**If Redis is unavailable:** The queue enqueue is skipped with a warning log. The app continues to function; certificates won't be auto-generated until Redis comes back.

**Retry policy:** 3 attempts, exponential backoff starting at 5 seconds.

---

## 11. External Services

### Cloudinary (Images + Certificate PDFs)

```js
import { uploadImage, deleteImage } from '../services/cloudinary.service.js';

const { url, publicId } = await uploadImage(fileBuffer, 'saathi/avatars', {
  transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'center' }]
});
```

**Folders used:**
- `saathi/avatars` — User profile pictures
- `saathi/thumbnails` — Course thumbnail images
- `saathi/certificates` — Certificate PDFs (resource_type: 'raw')

### Vimeo (Video Hosting)

Requires **Vimeo Business plan** for embed tokens and domain whitelisting.

```js
import vimeoService from '../services/vimeo.service.js';

// Step 1: Create TUS upload slot (returns uploadUrl for browser)
const { vimeoId, uploadUrl } = await vimeoService.createUploadSlot({ title, description, fileSize });

// Step 2: After transcoding, generate embed token for playback
const token = await vimeoService.generateEmbedToken(vimeoId);
```

**Vimeo Status Lifecycle:** `uploading` → `transcoding` → `ready` | `error`

### Razorpay (Payments)

> **Status:** Mock client in place for development. Real Razorpay client is commented out pending `npm install razorpay`.

Payment flow:
1. `POST /enrollments/:courseId/initiate` → Creates Razorpay order → Returns `{ razorpayOrderId, amount, key }`
2. Frontend opens Razorpay checkout modal
3. On success → `POST /enrollments/verify-payment` → HMAC signature verification → Enrollment activated
4. Webhook (`POST /enrollments/webhook/razorpay`) → Reconciliation for missed verifications

**HMAC Verification:** `sha256(orderId + "|" + paymentId, RAZORPAY_KEY_SECRET)`

### Email (Nodemailer)

In development: Ethereal (fake SMTP). Emails are captured at `https://ethereal.email` — check the console for the preview URL.

In production: Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.

All emails are fire-and-forget (do not block main request flow).

---

## 12. What's Not Built Yet

| Module | Status | Notes |
|---|---|---|
| **Razorpay real client** | Placeholder | `npm install razorpay`, uncomment in enrollment.service.js |
| **Email verification** | Planned | `isEmailVerified` field exists on User, logic not wired |
| **Payout system** | Planned | `totalEarnings`, `pendingPayout` on tutorProfile exist; payout flow not built |
| **Vimeo webhook** | Planned | `handleVimeoWebhook` service method exists but no route created yet |
| **Course search (advanced)** | Partial | MongoDB text index exists, basic search works, no elastic/atlas search |
| **Admin analytics** | Stub | Stats endpoint returns counts; no time-series or chart data yet |
| **Refresh token rotation on refresh** | Implemented | Both old and new refresh tokens work (should only allow new one) |
| **Redis graceful degradation** | Implemented | App works without Redis, but certificates won't auto-generate |

---

*This document is the single source of truth for backend API contracts. Update when adding routes, models, or auth flows.*
