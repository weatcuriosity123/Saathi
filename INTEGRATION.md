# Saathi — Frontend ↔ Backend Integration Plan

> **Date:** 2026-04-04  
> **Status:** Pre-integration (UI complete, APIs complete, wiring not started)  
> **Goal:** Connect the Next.js frontend to the Express backend and make the app production-ready.

---

## Table of Contents

1. [Current State Snapshot](#1-current-state-snapshot)
2. [Identified Mismatches](#2-identified-mismatches)
3. [Integration Strategy](#3-integration-strategy)
4. [Step-by-Step Integration Plan](#4-step-by-step-integration-plan)
5. [Auth Integration Deep Dive](#5-auth-integration-deep-dive)
6. [Route Guard Implementation](#6-route-guard-implementation)
7. [Razorpay Payment Flow](#7-razorpay-payment-flow)
8. [Vimeo Player Integration](#8-vimeo-player-integration)
9. [Error Handling Strategy](#9-error-handling-strategy)
10. [Environment Config](#10-environment-config)

---

## 1. Current State Snapshot

### Frontend
- Next.js 16.2.1 App Router, fully designed UI
- **Auth:** Hardcoded `isLoggedIn = true` in Navbar
- **API calls:** `apiClient.js` exists but not wired anywhere
- **State:** No global state, no Auth context
- **Route guards:** None — all routes accessible to everyone
- **Data:** 100% hardcoded mock data (courses, modules, dashboard stats)
- **Environment:** No `.env.local` file

### Backend
- Fully built Express API on port 5000
- JWT (15m access) + HttpOnly refresh cookie (7d)
- All modules complete: auth, courses, modules, enrollment, progress, reviews, certificates, admin
- CORS configured to `CLIENT_URL` (must match frontend origin)
- Razorpay mock client in place (real client not yet installed)

---

## 2. Identified Mismatches

### 2.1 Auth Flow Gap

| # | Issue | Frontend | Backend | Fix |
|---|---|---|---|---|
| A | No AuthContext | Auth state is local `useState(true)` in Navbar | `/auth/login` returns `{ accessToken, user }` | Create `AuthContext`, wrap root layout |
| B | No token storage | — | Bearer token required on protected routes | Store `accessToken` in React state/ref (NOT localStorage) |
| C | No cookie credentials | `apiClient` doesn't send cookies | Refresh token is an HttpOnly cookie | Add `credentials: 'include'` to all fetch calls |
| D | No silent refresh | No 401 interceptor | 401 returned when access token expires | Add retry logic with `/auth/refresh-token` call |
| E | No logout | No logout button wired | `POST /auth/logout` clears cookie | Connect logout UI to API |

### 2.2 Route Naming Mismatch

| Frontend Route | Backend Expects | Issue |
|---|---|---|
| `/list` | Course listing page | Route is `/list` but backend serves courses at `GET /api/v1/courses` — not a conflict, just note |
| `/[courseId]/player` | Module player | Frontend uses `courseId` but player needs specific `moduleId` too. Must fetch and pick module |
| `/tutor-dashboard` | — | Frontend route is `/tutor-dashboard`; backend has no concept of dashboard routes — fine, dashboard fetches from `/courses/tutor/my-courses` |
| `/checkout` | `POST /enrollments/:courseId/initiate` | Checkout page must know which `courseId` to enroll in — needs query param or context |

### 2.3 Data Shape Mismatches

| Frontend Assumption | Backend Reality | Fix |
|---|---|---|
| Course cards use `course.instructor` | Backend returns `tutorId` (ObjectId ref) | Need populate or separate tutor fetch |
| Course has `duration` as string (e.g. "4h 20m") | Backend stores `totalDuration` in seconds | Frontend must format seconds → human readable |
| Course detail page: `course.modules` is flat array | Backend: `GET /courses/:id` includes `modules` array sorted by `order` | Frontend component must map this |
| VideoPlayer expects Vimeo URL string | Backend returns signed `embedToken` + `vimeoId` | Build Vimeo embed URL from `vimeoId` + token |
| Dashboard shows "continue where you left off" | Backend: `progress.lastModuleId` | Frontend must use this to route to correct player page |
| Hardcoded avatar (DiceBear URLs) | Backend: `user.avatar` (Cloudinary URL or null) | Show Cloudinary URL if exists, else fallback to DiceBear |

### 2.4 Missing Frontend API Calls

These pages exist but make zero API calls:

| Page | Missing Calls |
|---|---|
| `/list` | `GET /api/v1/courses` with filters |
| `/[courseId]` | `GET /api/v1/courses/:id` |
| `/[courseId]/player` | `GET /courses/:courseId/modules/:moduleId/player` |
| `/dashboard` | `GET /progress/my-learning` |
| `/tutor-dashboard` | `GET /courses/tutor/my-courses` |
| `/create-course` | `POST /courses`, `POST /courses/:id/modules` |
| `/checkout` | `POST /enrollments/:courseId/initiate`, `POST /enrollments/verify-payment` |
| `/admin` | `GET /admin/stats` |
| `Navbar` | `GET /auth/me` (on page load, to restore session) |
| `AuthForm` | `POST /auth/login`, `POST /auth/register` |

### 2.5 Missing Backend Feature

| Item | Impact |
|---|---|
| No Vimeo webhook route (`POST /webhooks/vimeo`) | After video upload, status stays `uploading` forever. Must create route to receive Vimeo's transcoding callback and call `handleVimeoWebhook()` |
| Razorpay real client not installed | Payments will fail in any non-dev environment |
| No `GET /courses/:courseId/modules/first` or similar | Frontend player needs to know which module to start on — must use `lastModuleId` from progress or pick first `isFree` module |

---

## 3. Integration Strategy

### Base URL Management

```
Development:  http://localhost:5000/api/v1
Production:   https://api.saathi.in/api/v1 (or wherever deployed)
```

Set via `.env.local` in frontend:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### API Service Layer Design

Single `apiClient` function as the HTTP gateway:
- Reads `NEXT_PUBLIC_API_BASE_URL`
- Always sends `Content-Type: application/json`
- Always sends `credentials: 'include'` (for refresh cookie)
- Injects `Authorization: Bearer <token>` when token exists
- On 401: silently refreshes token once, retries request
- On second 401: redirects to `/login`
- On other errors: throws with `error.message` from backend JSON

### Token Storage Strategy

**Rule: Never use localStorage or sessionStorage for JWTs.**

Recommended approach:
- Store `accessToken` in React context state (in-memory)
- On browser refresh, the token is lost — but refresh cookie persists
- On app load (`layout.jsx`), call `GET /auth/me` with cookie — if it returns user, issue new access token via `/auth/refresh-token` silently
- This restores session without re-login

```
App Load
  → Try GET /auth/me (with Bearer if in memory)
  → If 401: Try POST /auth/refresh-token (cookie auto-sent)
  → If success: store new accessToken in context
  → If refresh also fails: user is logged out
```

---

## 4. Step-by-Step Integration Plan

### Step 1 — Environment Setup

**Frontend:**
```bash
# Create frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

**Backend:**
- Confirm `CLIENT_URL=http://localhost:3000` in `.env`
- Ensure MongoDB is running and connection string works
- Run `npm run dev` in `/backend` and verify `GET http://localhost:5000/health` returns 200

---

### Step 2 — Upgrade API Client

**File:** `src/services/apiClient.js`

Replace current implementation with:
```js
'use client';

let _accessToken = null;

export const setAccessToken = (token) => { _accessToken = token; };
export const clearAccessToken = () => { _accessToken = null; };
export const getAccessToken = () => _accessToken;

async function refreshToken() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
      { method: 'POST', credentials: 'include' }
    );
    if (!res.ok) return false;
    const { data } = await res.json();
    setAccessToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}

async function apiClient(endpoint, options = {}, _retry = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(_accessToken ? { Authorization: `Bearer ${_accessToken}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    { ...options, headers, credentials: 'include' }
  );

  if (res.status === 401 && _retry) {
    const refreshed = await refreshToken();
    if (refreshed) return apiClient(endpoint, options, false);
    clearAccessToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
    return;
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

export default apiClient;
```

---

### Step 3 — Create Auth Context

**New file:** `src/context/AuthContext.jsx`

```jsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { setAccessToken, clearAccessToken } from '@/services/apiClient';
import apiClient from '@/services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // prevents flash of wrong UI

  // Restore session on app load
  useEffect(() => {
    (async () => {
      try {
        // Try to refresh silently using cookie
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          { method: 'POST', credentials: 'include' }
        );
        if (res.ok) {
          const { data } = await res.json();
          setAccessToken(data.accessToken);
          // Fetch user profile
          const meRes = await apiClient('/auth/me');
          setUser(meRes.data.user);
        }
      } catch {
        // Not logged in — that's fine
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (userData, accessToken) => {
    setAccessToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
```

**Add to `src/app/layout.jsx`:**
```jsx
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

### Step 4 — Wire AuthForm to API

**File:** `src/components/auth/AuthForm.jsx`

```jsx
// Add to top of component
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/apiClient';
import { useRouter } from 'next/navigation';

// Inside component:
const { login } = useAuth();
const router = useRouter();
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const endpoint = view === 'login' ? '/auth/login' : '/auth/register';
    const body = view === 'login'
      ? { email, password }
      : { name, email, password, role };

    const res = await apiClient(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    login(res.data.user, res.data.accessToken);
    router.push('/dashboard'); // or role-based redirect
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

### Step 5 — Implement Route Guards

**Option A: Next.js `middleware.ts` (Recommended for server-side protection)**

Create `src/middleware.ts`:
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/checkout', '/tutor-dashboard', '/create-course', '/verification', '/admin'];
const TUTOR_ONLY = ['/tutor-dashboard', '/create-course', '/verification'];
const ADMIN_ONLY = ['/admin'];
const GUEST_ONLY = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isLoggedIn = !!refreshToken;

  if (GUEST_ONLY.some(r => pathname.startsWith(r)) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

> **Note:** Middleware can only check cookie presence (not role). For role-based protection, add role check in the layout component using `useAuth()`.

**Option B: Layout-level guard (for role enforcement)**

In `src/app/(tutor)/layout.jsx`:
```jsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TutorLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'tutor')) {
      router.replace('/dashboard');
    }
  }, [user, loading]);

  if (loading || !user) return null; // or a loading spinner

  return <div>{children}</div>;
}
```

---

### Step 6 — Connect Navbar to Auth

**File:** `src/components/layout/Navbar.jsx`

Replace:
```js
const [isLoggedIn, setIsLoggedIn] = useState(true);
```

With:
```js
import { useAuth } from '@/context/AuthContext';
const { user, isLoggedIn, logout } = useAuth();
```

Update profile dropdown to show `user.name` and `user.avatar`.
Wire logout button to `logout()` function.

---

### Step 7 — Replace Mock Data with API Calls

**Course Listing (`/list`):**
```jsx
// src/app/(main)/(courses)/list/page.jsx
import apiClient from '@/services/apiClient';

// In component or server component:
const { data } = await apiClient('/courses?limit=12&page=1');
// Pass data.courses to <CourseGrid courses={data.courses} />
```

**Course Detail (`/[courseId]`):**
```jsx
const { data } = await apiClient(`/courses/${courseId}`);
// data.course + data.modules + data.isEnrolled
```

**Student Dashboard (`/dashboard`):**
```jsx
const { data } = await apiClient('/progress/my-learning');
// data = [{ course, progress, lastModuleId }]
```

---

### Step 8 — Razorpay Payment Integration

See [Section 7](#7-razorpay-payment-flow) for full flow.

1. Install Razorpay SDK on backend: `cd backend && npm install razorpay`
2. Uncomment real Razorpay client in `enrollment.service.js`
3. Add Razorpay checkout script to frontend
4. Wire checkout page to initiate + verify flow

---

### Step 9 — Vimeo Player Integration

See [Section 8](#8-vimeo-player-integration) for full flow.

1. Fetch embed token from `GET /courses/:courseId/modules/:moduleId/player`
2. Build Vimeo embed URL: `https://player.vimeo.com/video/{vimeoId}?token={embedToken}`
3. Render in `VideoPlayer.jsx` as `<iframe>`

---

### Step 10 — Test Full Flow

Checklist:
- [ ] Register new student → get token → redirected to dashboard
- [ ] Login → session persists on page refresh (via cookie)
- [ ] Browse courses → API data renders (not mock)
- [ ] Enroll in free course → dashboard shows progress
- [ ] Pay for course → Razorpay modal → enrollment activated
- [ ] Watch video → Vimeo iframe loads with embed token
- [ ] Mark module complete → progress updates
- [ ] Complete course → certificate auto-generated
- [ ] Login as tutor → can access `/tutor-dashboard`, not `/admin`
- [ ] Login as admin → can access `/admin`, approve tutors/courses
- [ ] Logout → cookie cleared, redirected to login

---

## 5. Auth Integration Deep Dive

### Token Flow Diagram

```
Browser                     Frontend                     Backend
   |                            |                            |
   |-- navigate to /dashboard ->|                            |
   |                            |-- GET /auth/refresh-token->|
   |                            |   (HttpOnly cookie auto)   |
   |                            |<---- { accessToken } ------|
   |                            | setToken(accessToken)      |
   |                            |-- GET /auth/me ----------->|
   |                            |   Bearer: <accessToken>    |
   |                            |<---- { user } -------------|
   |<---- render dashboard -----|                            |
   |                            |                            |
   |-- click "View Course" ---->|                            |
   |                            |-- GET /courses/:id ------->|
   |                            |   Bearer: <accessToken>    |
   |                            |<---- { course, modules } --|
   |                            |                            |
   |  (15m later, token expires)|                            |
   |                            |-- GET /progress/... ------>|
   |                            |<---- 401 Unauthorized -----|
   |                            |-- POST /auth/refresh ------>|
   |                            |   (cookie auto)            |
   |                            |<---- { newAccessToken } ---|
   |                            | setToken(newAccessToken)   |
   |                            |-- GET /progress/... ------>| (retry)
   |                            |<---- { data } -------------|
```

---

## 6. Route Guard Implementation

### Protection Matrix

| Route | Guard Type | Condition |
|---|---|---|
| `/login`, `/signup` | Guest only | Redirect to `/dashboard` if logged in |
| `/dashboard` | Auth required | Redirect to `/login` if not logged in |
| `/checkout` | Auth + role | Student only |
| `/[courseId]/player` | Auth + enrolled | Must have COMPLETED enrollment |
| `/tutor-dashboard` | Auth + role | Tutor only |
| `/create-course` | Auth + role | Tutor only |
| `/verification` | Auth + role | Tutor only |
| `/admin` | Auth + role | Admin only |

### Implementation Layers

1. **Next.js `middleware.ts`** — Cookie presence check (fast, runs on edge)
2. **Layout guards** — Role check using `useAuth()` (client-side, after hydration)
3. **API-level** — Backend always validates regardless of frontend guards (defense in depth)

---

## 7. Razorpay Payment Flow

```
Step 1: Student clicks "Enroll" on course detail page
        ↓
Step 2: POST /api/v1/enrollments/:courseId/initiate
        Response: { razorpayOrderId, amount, currency, key }
        ↓
Step 3: Open Razorpay checkout modal with order details
        (load Razorpay script from CDN)
        ↓
Step 4: Student completes payment in modal
        Razorpay calls onSuccess handler with:
        { razorpayOrderId, razorpayPaymentId, razorpaySignature }
        ↓
Step 5: POST /api/v1/enrollments/verify-payment
        Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
        Response: { enrollment: { status: 'completed' } }
        ↓
Step 6: Redirect to course player or dashboard
```

**Frontend Razorpay Script:**
```jsx
// In checkout/page.jsx
const loadRazorpay = () => new Promise((resolve) => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  document.body.appendChild(script);
});

const handlePayment = async (courseId) => {
  await loadRazorpay();
  const { data } = await apiClient(`/enrollments/${courseId}/initiate`, { method: 'POST' });

  const options = {
    key: data.key,
    amount: data.amount,
    currency: data.currency,
    order_id: data.razorpayOrderId,
    handler: async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
      await apiClient('/enrollments/verify-payment', {
        method: 'POST',
        body: JSON.stringify({
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        }),
      });
      router.push(`/${courseId}/player`);
    },
  };

  new window.Razorpay(options).open();
};
```

---

## 8. Vimeo Player Integration

```
Step 1: Student navigates to /[courseId]/player
        Determine which module to play:
        - If coming from dashboard: use progress.lastModuleId
        - Default: first module where isFree=false (or first module)
        ↓
Step 2: GET /api/v1/courses/:courseId/modules/:moduleId/player
        Response: { moduleId, title, vimeoId, embedToken }
        ↓
Step 3: Build Vimeo embed URL:
        https://player.vimeo.com/video/{vimeoId}?token={embedToken}
        ↓
Step 4: Render in VideoPlayer.jsx as iframe:
        <iframe
          src={embedUrl}
          width="100%" height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
        ↓
Step 5: On module completion (video ended or manual):
        POST /api/v1/progress/:courseId/modules/:moduleId/complete
        Update UI with new progress %
```

**Note:** Backend `generateEmbedToken()` may return `null` if Vimeo Business plan is not active. Handle gracefully by showing a fallback message.

---

## 9. Error Handling Strategy

### API Error Categories

| HTTP Status | Meaning | Frontend Action |
|---|---|---|
| 400 | Validation failed | Show field-level errors from `errors[]` array |
| 401 | Not authenticated | Silently refresh → retry → redirect to login |
| 403 | Forbidden (wrong role) | Show "Access Denied" page or redirect |
| 404 | Resource not found | Show 404 page or "not found" message |
| 409 | Conflict (duplicate) | Show specific message (e.g., "Email already registered") |
| 429 | Rate limited | Show "Too many attempts, try again in X minutes" |
| 500 | Server error | Show generic "Something went wrong, try again" |

### Error Response Shape from Backend

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Must be a valid email" },
    { "field": "password", "message": "Must contain uppercase letter" }
  ]
}
```

### Recommended Toast Pattern

Add `react-hot-toast` or similar:
```bash
npm install react-hot-toast
```

```jsx
// In layout.jsx
import { Toaster } from 'react-hot-toast';
<Toaster position="top-right" />

// In any component
import toast from 'react-hot-toast';
try {
  await apiClient('/courses', { method: 'POST', body: JSON.stringify(data) });
  toast.success('Course created!');
} catch (err) {
  toast.error(err.message);
}
```

---

## 10. Environment Config

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### Backend `.env` (development)

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_URI=<your Atlas URI>
JWT_ACCESS_SECRET=<random 32 bytes>
JWT_REFRESH_SECRET=<random 32 bytes>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<your name>
CLOUDINARY_API_KEY=<your key>
CLOUDINARY_API_SECRET=<your secret>
VIMEO_CLIENT_ID=<your id>
VIMEO_CLIENT_SECRET=<your secret>
VIMEO_ACCESS_TOKEN=<your token>
RAZORPAY_KEY_ID=rzp_test_<key>
RAZORPAY_KEY_SECRET=<secret>
RAZORPAY_WEBHOOK_SECRET=<secret>
```

### Production Checklist

- [ ] `NODE_ENV=production` 
- [ ] `CLIENT_URL` set to production frontend domain
- [ ] Razorpay keys switched from `rzp_test_` to `rzp_live_`
- [ ] SMTP credentials filled for real emails
- [ ] Redis URL set for certificate queue
- [ ] MongoDB Atlas IP whitelist updated for production server
- [ ] Vimeo Business plan active for embed tokens

---

*This document should be kept updated as integration progresses. Cross-reference with `frontend/frontend-dev.md` and `backend/dev.md`.*
