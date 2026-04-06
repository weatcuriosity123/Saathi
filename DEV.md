# Saathi — Developer Guide

> Affordable e-learning platform for India. Courses ₹100–₹200. Think Udemy but cheaper.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js + Express + Mongoose |
| Database | MongoDB Atlas |
| Video | Vimeo API (browser uploads directly to Vimeo) |
| Payments | Razorpay |
| Image/File Storage | Cloudinary |
| Frontend (todo) | Next.js + Tailwind |

---

## Project Structure

```
Saathi/
├── backend/
│   └── src/
│       ├── app.js                  ← Express setup, middleware, routes
│       ├── config/db.js            ← MongoDB connection
│       ├── utils/
│       │   ├── AppError.js         ← Custom error class
│       │   ├── ApiResponse.js      ← Consistent response helper
│       │   ├── asyncHandler.js     ← Wraps async controllers (no try/catch needed)
│       │   └── token.js            ← JWT sign/verify helpers
│       ├── middleware/
│       │   ├── auth.middleware.js  ← protect, restrictTo
│       │   ├── course.middleware.js← isCourseOwner, isEnrolled
│       │   ├── validate.middleware.js ← Zod schema validation
│       │   └── error.middleware.js ← Global error handler
│       ├── services/
│       │   └── vimeo.service.js    ← All Vimeo API calls
│       └── modules/
│           ├── auth/               ← register, login, refresh, logout, /me
│           ├── user/               ← User model
│           ├── course/             ← Course CRUD + submit for review
│           ├── module/             ← Video modules within a course
│           └── enrollment/         ← Razorpay payment + access control
└── DEV.md                          ← You are here
```

---

## Setup & Run

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Create `.env`
```env
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/saathi

JWT_ACCESS_SECRET=your_32_char_secret_here
JWT_REFRESH_SECRET=your_other_32_char_secret

CLIENT_URL=http://localhost:3000
CLIENT_DOMAIN=localhost

# Vimeo (get from developer.vimeo.com)
VIMEO_ACCESS_TOKEN=your_vimeo_token
VIMEO_APP_CLIENT_ID=xxx
VIMEO_APP_CLIENT_SECRET=xxx

# Razorpay (get from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Redis (BullMQ — for certificate generation queue)
REDIS_URL=redis://localhost:6379

# SMTP (Nodemailer — leave empty in dev, Ethereal is used automatically)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@saathi.in
```

### 3. Start server
```bash
npm run dev     # with nodemon (auto-restart)
npm start       # production
```

Server runs at `http://localhost:5000`

Health check: `GET http://localhost:5000/health`

---

## Authentication

### How it works
- **Access token** (JWT, 15 min) — sent in `Authorization: Bearer <token>` header
- **Refresh token** (JWT, 7 days) — stored in `HttpOnly` cookie, used to get new access tokens
- **accountVersion** — stored in DB. When password changes, this increments. Any token with an old version is instantly rejected (no token blacklist needed).

### Roles
- `student` — default role on register
- `tutor` — can create/manage courses
- `admin` — full access

### Endpoints

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
GET  /api/v1/auth/me          ← requires token
```

### Test with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123","role":"student"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'
# Returns: { accessToken, user }
# Also sets refreshToken cookie
```

**Use access token:**
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

---

## Courses

### Course lifecycle
```
draft → under_review → published
                     ↘ removed (soft delete)
```

Tutors create draft courses, add modules, then submit for review. Admin approves → published. Only published courses appear in public listing.

### Endpoints

```
GET    /api/v1/courses                    ← Public listing
GET    /api/v1/courses/:id                ← Course detail (by ID or slug)
GET    /api/v1/courses/tutor/my-courses   ← Tutor: see all their courses

POST   /api/v1/courses                    ← Tutor: create draft
PATCH  /api/v1/courses/:id                ← Tutor: update own course
POST   /api/v1/courses/:id/submit-review  ← Tutor: submit for admin review
DELETE /api/v1/courses/:id                ← Tutor: soft delete (if no students)
```

### Query params for listing
```
GET /api/v1/courses?category=programming&level=beginner&priceMax=500&search=react&sort=newest&page=1&limit=10
```

Sort options: `newest`, `oldest`, `price_asc`, `price_desc`, `rating`

### Create a course (tutor)
```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Authorization: Bearer <tutorToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete React Course for Beginners",
    "description": "Learn React from scratch with hands-on projects. Covers hooks, state management...",
    "shortDescription": "Master React in 30 days",
    "price": 199,
    "category": "programming",
    "level": "beginner"
  }'
```

Categories: `programming`, `design`, `business`, `marketing`, `data-science`, `personal-development`, `language`, `other`

---

## Modules (Video Lessons)

### How video upload works
```
1. Tutor calls POST /modules (with fileSize)
   → Server creates Vimeo upload slot
   → Returns: module data + uploadUrl

2. Frontend uses tus-js-client to upload video file directly to uploadUrl
   (video never touches your server)

3. Vimeo transcodes the video

4. Vimeo calls your webhook when done
   → Module status changes: uploading → ready

5. Enrolled student calls GET /modules/:moduleId/player
   → Returns a signed embed token (expires 2h)
   → Frontend uses Vimeo player with that token
```

### Endpoints

```
GET    /api/v1/courses/:courseId/modules
  - Public: only isFree=true modules (no vimeoId)
  - Enrolled: all modules + vimeoId

GET    /api/v1/courses/:courseId/modules/:moduleId/player   ← Enrolled only

POST   /api/v1/courses/:courseId/modules                    ← Tutor: add module
PATCH  /api/v1/courses/:courseId/modules/reorder            ← Tutor: reorder
PATCH  /api/v1/courses/:courseId/modules/:moduleId          ← Tutor: update metadata
DELETE /api/v1/courses/:courseId/modules/:moduleId          ← Tutor: remove
```

### Add a module (tutor)
```bash
curl -X POST http://localhost:5000/api/v1/courses/<courseId>/modules \
  -H "Authorization: Bearer <tutorToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to React",
    "description": "What is React and why use it",
    "points": 10,
    "isFree": true,
    "fileSize": 104857600
  }'
# fileSize is in bytes (100MB = 104857600)
# Response includes uploadUrl — use tus-js-client to upload the video file to it
```

### Reorder modules
```bash
curl -X PATCH http://localhost:5000/api/v1/courses/<courseId>/modules/reorder \
  -H "Authorization: Bearer <tutorToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "order": [
      {"moduleId": "<id1>", "order": 1},
      {"moduleId": "<id2>", "order": 2}
    ]
  }'
```

---

## Enrollment & Payments

### How Razorpay payment flow works
```
1. Student: POST /enrollments/:courseId/initiate
   → Creates Razorpay order
   → Returns order details (orderId, amount, keyId)

2. Frontend: Load Razorpay checkout with those details
   → Student pays in popup

3. Razorpay returns: { orderId, paymentId, signature }

4. Student: POST /enrollments/verify-payment with those 3 values
   → Server verifies HMAC signature
   → Activates enrollment (status: completed)
   → Student now has full course access

Free courses: step 1 instantly activates enrollment. No steps 2-4.

Webhook (/enrollments/webhook/razorpay): reconciliation only —
handles cases where step 4 was never called (network drop, etc.)
```

### Endpoints

```
POST /api/v1/enrollments/:courseId/initiate   ← Start payment or enroll free
POST /api/v1/enrollments/verify-payment       ← Confirm payment (step 4)
POST /api/v1/enrollments/webhook/razorpay     ← Razorpay webhook (no auth)

GET  /api/v1/enrollments/my-courses           ← Student: list enrolled courses
GET  /api/v1/enrollments/check/:courseId      ← Is current user enrolled?
```

### Frontend Razorpay integration
```js
// Step 1: Initiate
const { data } = await axios.post(`/api/v1/enrollments/${courseId}/initiate`);

if (data.free) {
  // Already enrolled — redirect to course
  return;
}

// Step 2: Open Razorpay popup
const rzp = new Razorpay({
  key: data.order.keyId,
  amount: data.order.amount,
  currency: data.order.currency,
  order_id: data.order.id,
  name: 'Saathi',
  description: data.course.title,
  handler: async (response) => {
    // Step 3: Verify with backend
    await axios.post('/api/v1/enrollments/verify-payment', {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
    });
    // Student is now enrolled — redirect to course
  },
});
rzp.open();
```

---

## Standard API Response Format

All endpoints return this shape:

**Success:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "What went wrong",
  "errors": [ ... ]   // validation errors only
}
```

HTTP status codes are meaningful: `200` success, `201` created, `400` bad input, `401` not logged in, `403` not authorized, `404` not found, `409` conflict.

---

## Frontend Integration Guide

### Auth flow
1. On login, store `accessToken` in memory (not localStorage — XSS risk)
2. `refreshToken` is already in HttpOnly cookie (browser handles it)
3. Add to every request: `Authorization: Bearer <accessToken>`
4. On `401`, call `/auth/refresh-token` → get new access token → retry request
5. On refresh failure → redirect to login

### Recommended axios setup
```js
// api.js
const api = axios.create({ baseURL: '/api/v1', withCredentials: true });

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      const { data } = await axios.post('/api/v1/auth/refresh-token', {}, { withCredentials: true });
      err.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(err.config);
    }
    return Promise.reject(err);
  }
);
```

### Key things to know
- `withCredentials: true` is required on all requests (for the refresh token cookie)
- Tutor routes need `role: 'tutor'` in the JWT — set during registration
- Module `vimeoId` is only returned if enrolled or owner — don't expect it on public listing
- Use `slug` for SEO-friendly URLs: `GET /api/v1/courses/complete-react-course-abc12`

---

## Admin Panel

All admin routes require `role: 'admin'`. Apply `Authorization: Bearer <adminToken>` to every request.

### Endpoints

```
GET   /api/v1/admin/stats                          ← Dashboard counts

GET   /api/v1/admin/users                          ← All users (paginated)
  ?page=1&limit=20&role=student&search=john
PATCH /api/v1/admin/users/:userId/toggle-active    ← Activate / deactivate user

GET   /api/v1/admin/tutors                         ← All tutors
GET   /api/v1/admin/tutors/pending                 ← Tutors awaiting verification
PATCH /api/v1/admin/tutors/:tutorId/approve        ← Approve tutor application
PATCH /api/v1/admin/tutors/:tutorId/reject         ← Reject with note

GET   /api/v1/admin/courses/under-review           ← Courses submitted for review
PATCH /api/v1/admin/courses/:courseId/publish      ← Publish course (makes it live)
PATCH /api/v1/admin/courses/:courseId/reject       ← Send back to draft with note
PATCH /api/v1/admin/courses/:courseId/unpublish    ← Remove from public listing
```

### Tutor approval flow
```
1. Tutor registers with role: 'tutor' → verificationStatus: 'pending'
2. Admin sees them in GET /admin/tutors/pending
3. Admin approves → isApproved: true, verificationStatus: 'approved'
   OR rejects → verificationStatus: 'rejected', verificationNote set
4. Approved tutors can create/submit courses
```

### Course publish flow
```
Tutor: draft → (submit-review) → under_review
Admin: under_review → (publish)  → published   ← visible to students
       under_review → (reject)   → draft        ← tutor must fix and resubmit
Admin: published   → (unpublish) → removed
```

### Reject with note (body)
```bash
curl -X PATCH http://localhost:5000/api/v1/admin/courses/<id>/reject \
  -H "Authorization: Bearer <adminToken>" \
  -H "Content-Type: application/json" \
  -d '{"note": "Please add more detail to the course description"}'
```

---

## Progress Tracking

Tracks which modules a student has completed within a course.

### Endpoints

```
GET    /api/v1/progress/my-learning              ← All enrolled courses + % progress
GET    /api/v1/progress/:courseId                ← Progress for one course
POST   /api/v1/progress/:courseId/modules/:moduleId/complete   ← Mark module done
DELETE /api/v1/progress/:courseId/modules/:moduleId/complete   ← Unmark module
```

### How it works
- Each student has one Progress document per enrolled course
- `completedModules` is an array of module IDs they've finished
- `percentage` is recalculated automatically on every mark/unmark
- `lastModuleId` powers the "Continue watching" button
- When `percentage` hits 100, `completedAt` is set → certificate trigger (BullMQ, coming soon)
- `totalPoints` accumulates from each module's `points` field

### Frontend "Continue" button
```js
// GET /api/v1/progress/my-learning returns:
{
  course: { title, slug, thumbnail, ... },
  percentage: 65,
  lastModuleId: "<moduleId>",   // use this to deep-link into the course player
  completedAt: null,
  totalPoints: 80
}
```

### Mark a module complete
```bash
curl -X POST http://localhost:5000/api/v1/progress/<courseId>/modules/<moduleId>/complete \
  -H "Authorization: Bearer <studentToken>"
```

---

## File Uploads (Cloudinary)

Images are uploaded to Cloudinary. The server receives the file, resizes it, and pushes to Cloudinary. The Cloudinary URL is saved in MongoDB.

### Endpoints

```
POST /api/v1/uploads/avatar                        ← Update own avatar
POST /api/v1/uploads/courses/:courseId/thumbnail   ← Update course thumbnail (tutor/admin)
```

### Request format
Use `multipart/form-data`. Field name must match exactly.

```bash
# Upload avatar
curl -X POST http://localhost:5000/api/v1/uploads/avatar \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@/path/to/photo.jpg"

# Upload course thumbnail
curl -X POST http://localhost:5000/api/v1/uploads/courses/<courseId>/thumbnail \
  -H "Authorization: Bearer <tutorToken>" \
  -F "thumbnail=@/path/to/cover.jpg"
```

### Constraints
- Allowed formats: JPEG, PNG, WebP
- Max size: 5 MB
- Avatar: auto-cropped to 300×300 (face detection)
- Thumbnail: auto-cropped to 1280×720 (16:9)
- Old image is deleted from Cloudinary when replaced

### Frontend (Next.js)
```js
const formData = new FormData();
formData.append('avatar', file);  // file from <input type="file">

await axios.post('/api/v1/uploads/avatar', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

---

## Tutor Profile

### Endpoints
```
GET   /api/v1/tutors/:tutorId/profile   ← Public tutor page (bio + their published courses)
PATCH /api/v1/tutors/me/profile         ← Tutor: update own name, bio, expertise
PATCH /api/v1/tutors/me/password        ← Any logged-in user: change password
```

### Update profile (tutor)
```bash
curl -X PATCH http://localhost:5000/api/v1/tutors/me/profile \
  -H "Authorization: Bearer <tutorToken>" \
  -H "Content-Type: application/json" \
  -d '{"bio": "10 years in software engineering", "expertise": ["React", "Node.js"]}'
```

### Change password
```bash
curl -X PATCH http://localhost:5000/api/v1/tutors/me/password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword": "old123", "newPassword": "new123456"}'
```
> Note: After password change, all existing tokens are invalidated. User must log in again.

---

## Certificate Generation

Certificates are generated automatically when a student completes 100% of a course.

### How it works
```
Student marks last module complete
  → progress.percentage hits 100
  → addCertificateJob(userId, courseId) enqueued in Redis (BullMQ)
  → certificate.worker.js picks up the job (concurrency: 3)
  → Generates a PDF in memory (no temp files)
  → Uploads PDF to Cloudinary (/saathi/certificates/)
  → Saves Certificate record with pdfUrl + unique certificateId (e.g. SAATHI-A1B2C3D4)
  → Sends "certificate ready" email to student
```

### Endpoints
```
GET /api/v1/certificates/my                    ← Student: list own certificates
GET /api/v1/certificates/verify/:certificateId ← Public: verify any certificate
```

### Verify a certificate (public)
```bash
curl http://localhost:5000/api/v1/certificates/verify/SAATHI-A1B2C3D4
# Returns: { valid: true, studentName, courseTitle, issuedAt }
```

### Requirements
- Redis must be running (`REDIS_URL` in .env, defaults to `redis://localhost:6379`)
- Cloudinary must be configured for PDF upload
- Worker starts automatically when server starts

---

## Email Notifications

Uses Nodemailer. In development, emails go to **Ethereal** (fake inbox) — the preview URL is logged to the console. No real emails are sent in dev.

### Triggered automatically at
| Event | Email sent to |
|---|---|
| User registers | Student/tutor — welcome email |
| Student enrolls | Student — enrollment confirmation |
| Admin approves tutor | Tutor — approval notification |
| Admin rejects course | Tutor — rejection with note |
| Admin publishes course | Tutor — course is live notification |
| Course 100% complete | Student — certificate ready + download link |

### Production setup (add to .env)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
EMAIL_FROM=noreply@saathi.in
```

> Email failures never break the main flow — errors are logged and the request succeeds anyway.

---

## Rating & Reviews

Students can rate a course (1–5 stars) with an optional comment. Must be enrolled to review.

### Endpoints
```
GET    /api/v1/courses/:courseId/reviews      ← Public: list reviews (paginated)
POST   /api/v1/courses/:courseId/reviews      ← Enrolled student: submit review
PATCH  /api/v1/courses/:courseId/reviews/my   ← Student: edit own review
DELETE /api/v1/courses/:courseId/reviews/my   ← Student/Admin: delete review
```

### Submit a review
```bash
curl -X POST http://localhost:5000/api/v1/courses/<courseId>/reviews \
  -H "Authorization: Bearer <studentToken>" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "comment": "Excellent course, very practical!"}'
```

### How rating works
- After every create/update/delete, an aggregation recalculates `rating.average` and `rating.count` on the Course
- `rating.average` is rounded to 1 decimal (e.g. 4.3)
- Calling POST again on the same course updates the existing review (upsert)

---

## What's Not Built Yet

| Feature | Notes |
|---|---|
| Razorpay `npm install razorpay` | Package is a placeholder — uncomment in enrollment.service.js when adding real keys |
| Frontend (Next.js) | Backend is now feature-complete |

---

## Adding New Features (Quick Pattern)

Every module follows the same structure:

```
modules/feature/
├── feature.model.js       ← Mongoose schema
├── feature.validation.js  ← Zod schemas for request validation
├── feature.service.js     ← Business logic (no req/res here)
├── feature.controller.js  ← Call service, call respond()
└── feature.routes.js      ← Routes with middleware chain
```

Then register in `app.js`:
```js
app.use('/api/v1/feature', require('./modules/feature/feature.routes'));
```

> **Update this file** when new modules are added.
