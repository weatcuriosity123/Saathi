# Saathi Frontend — Developer Onboarding Guide

> **Last Updated:** 2026-04-04  
> **Tech Stack:** Next.js 16.2.1 · React 19.2.4 · Tailwind CSS 4.0  
> **Author:** Auto-generated via full codebase scan  

---

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Configuration Files](#2-configuration-files)
3. [Routing Architecture](#3-routing-architecture)
4. [Authentication Flow](#4-authentication-flow)
5. [API Service Layer](#5-api-service-layer)
6. [State Management](#6-state-management)
7. [Component Architecture](#7-component-architecture)
8. [Design System](#8-design-system)
9. [Pages Reference](#9-pages-reference)
10. [Missing Pieces & Required Work](#10-missing-pieces--required-work)
11. [Integration Checklist](#11-integration-checklist)

---

## 1. Folder Structure

```
D:\Saathi\frontend/
├── .gitignore
├── AGENTS.md                          # Breaking changes notice for Next.js 16+
├── CLAUDE.md                          # References AGENTS.md
├── README.md
├── package.json                       # Dependencies (Next, React, Tailwind, lucide-react)
├── jsconfig.json                      # Path alias: @/* → ./src/*
├── postcss.config.mjs                 # @tailwindcss/postcss plugin
├── tailwind.config.js                 # Full design token config
├── eslint.config.mjs                  # Next.js core-web-vitals ruleset
│
├── public/                            # Static assets (served at root /)
│
└── src/
    ├── app/                           # Next.js App Router — all pages live here
    │   ├── layout.jsx                 # Root layout: font loading, metadata, <body>
    │   ├── template.jsx               # Navbar/Footer wrapper (conditionally shown)
    │   │
    │   ├── (auth)/                    # Route group: /login, /signup
    │   │   ├── layout.jsx             # Centered flex layout (no Navbar/Footer)
    │   │   ├── login/page.jsx
    │   │   └── signup/page.jsx
    │   │
    │   ├── (main)/                    # Route group: all main content pages
    │   │   ├── layout.jsx
    │   │   ├── page.jsx               # Home page: /
    │   │   ├── checkout/page.jsx      # Checkout: /checkout
    │   │   │
    │   │   ├── (courses)/             # Sub-group: course browsing
    │   │   │   ├── layout.jsx
    │   │   │   ├── list/page.jsx      # Course listing: /list
    │   │   │   └── [courseId]/
    │   │   │       ├── page.jsx       # Course detail: /[courseId]
    │   │   │       └── player/page.jsx # Course player: /[courseId]/player
    │   │   │
    │   │   └── (student)/             # Sub-group: student protected area
    │   │       ├── layout.jsx
    │   │       ├── dashboard/page.jsx # Student dashboard: /dashboard
    │   │       └── course-player/page.jsx
    │   │
    │   ├── (tutor)/                   # Route group: tutor tools
    │   │   ├── layout.jsx             # TutorSidebar + TutorHeader layout
    │   │   ├── tutor-dashboard/page.jsx
    │   │   ├── create-course/page.jsx
    │   │   └── verification/page.jsx
    │   │
    │   └── admin/                     # Admin panel: /admin
    │       ├── layout.jsx             # AdminSidebar + AdminTopBar
    │       └── page.jsx
    │
    ├── components/
    │   ├── ui/                        # Primitive reusable components
    │   │   ├── index.js               # Barrel export
    │   │   ├── Button.jsx             # Variants: primary, secondary, accent
    │   │   ├── Card.jsx
    │   │   ├── Input.jsx
    │   │   ├── Badge.jsx              # Tonal badges: primary, secondary, accent
    │   │   └── ProgressBar.jsx        # Animated fill bar
    │   │
    │   ├── layout/                    # Navigation & structural layout
    │   │   ├── index.js
    │   │   ├── Navbar.jsx             # Top nav with search, profile dropdown
    │   │   ├── Footer.jsx
    │   │   ├── Sidebar.jsx            # Student left sidebar
    │   │   └── tutor/
    │   │       ├── TutorSidebar.jsx   # Fixed 64rem left sidebar
    │   │       └── TutorHeader.jsx    # Notifications, profile, search bar
    │   │
    │   ├── auth/
    │   │   └── AuthForm.jsx           # Unified login/signup form component
    │   │
    │   ├── courses/
    │   │   ├── CourseGrid.jsx         # Grid of course cards
    │   │   ├── CourseFilters.jsx      # Category, price, rating filters
    │   │   ├── detail/                # Course detail page components
    │   │   │   ├── CourseHero.jsx
    │   │   │   ├── CourseSidebar.jsx  # Price / purchase card
    │   │   │   ├── CourseCurriculum.jsx
    │   │   │   ├── InstructorCard.jsx
    │   │   │   └── CourseReviews.jsx
    │   │   └── player/                # Course player page components
    │   │       ├── VideoPlayer.jsx    # Custom Vimeo player controls
    │   │       ├── LessonInfo.jsx     # Tabs: Overview, Resources, Discussion, Notes
    │   │       └── CourseSidebar.jsx  # Curriculum & module list with progress
    │   │
    │   ├── home/                      # Landing page sections
    │   │   ├── HomeHero.jsx
    │   │   ├── FeaturedCourses.jsx
    │   │   ├── WhySaathi.jsx
    │   │   ├── HowItWorks.jsx
    │   │   ├── CTASection.jsx
    │   │   └── Testimonials.jsx
    │   │
    │   ├── tutor/
    │   │   └── dashboard/
    │   │       ├── StatsGrid.jsx
    │   │       ├── CourseList.jsx
    │   │       ├── AnalyticsCard.jsx
    │   │       └── RecentEarnings.jsx
    │   │
    │   ├── admin/
    │   │   ├── AdminSidebar.jsx
    │   │   ├── AdminTopBar.jsx
    │   │   ├── StatCard.jsx
    │   │   └── ActivityMonitor.jsx
    │   │
    │   └── shared/
    │       ├── index.js
    │       └── PageTemplate.jsx       # Reusable page wrapper
    │
    ├── hooks/
    │   └── useMounted.js              # Prevents SSR hydration mismatch
    │
    ├── services/
    │   └── apiClient.js               # Fetch wrapper — base URL from env
    │
    ├── lib/
    │   └── constants.js               # APP_NAME, ROUTES object
    │
    ├── utils/
    │   └── cn.js                      # Class name combiner utility
    │
    ├── types/
    │   └── index.js                   # JSDoc type definitions
    │
    ├── styles/
    │   ├── globals.css                # Tailwind import + box-sizing reset
    │   └── theme.css                  # CSS custom properties (color system)
    │
    └── features/                      # Feature-level README stubs (empty)
        ├── auth/README.md
        ├── checkout/README.md
        ├── courses/README.md
        ├── dashboard/README.md
        └── tutor/README.md
```

---

## 2. Configuration Files

### `package.json`

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "lucide-react": "^1.7.0",
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.2.1",
    "tailwindcss": "^4"
  }
}
```

> **Important:** Next.js 16.2.1 has breaking API changes vs older versions. See `AGENTS.md` for details before making changes.

### `jsconfig.json`

Path alias configured: `@/*` → `./src/*`

Always import using `@/` prefix:
```js
// Correct
import { Button } from '@/components/ui';
import apiClient from '@/services/apiClient';

// Wrong — avoid relative traversal
import { Button } from '../../../components/ui';
```

### `tailwind.config.js`

Full custom design system:
- **Colors:** primary (#3525cd), secondary (#10b981), tertiary (#f97316)
- **Surfaces:** 5 levels (lowest → highest) matching Material Design
- **Fonts:** Manrope (headings), Inter (body/label)
- **Spacing:** Extends with 18, 22, 26, 30 units
- **Shadows:** ambient, soft, glass
- **Transitions:** 250ms, 400ms smooth timing

---

## 3. Routing Architecture

### Route Groups Overview

Next.js App Router route groups use `(parentheses)` in directory names — they define layouts without affecting the URL.

| Route Group | URL Paths | Layout Description |
|---|---|---|
| `(auth)` | `/login`, `/signup` | Centered fullscreen — no Navbar/Footer |
| `(main)` | `/`, `/checkout`, `/list`, `/[courseId]`, `/dashboard` | Navbar + Footer |
| `(main)/(courses)` | `/list`, `/[courseId]`, `/[courseId]/player` | Course browsing layout |
| `(main)/(student)` | `/dashboard`, `/course-player` | Student sidebar + content |
| `(tutor)` | `/tutor-dashboard`, `/create-course`, `/verification` | TutorSidebar + TutorHeader |
| `admin` | `/admin` | AdminSidebar + AdminTopBar |

### Public Routes (no auth required)

```
/                   → Home page
/login              → Login
/signup             → Signup
/list               → Course listing
/[courseId]         → Course detail (public view)
```

### Protected Routes (auth required)

```
/[courseId]/player  → Course player (must be enrolled OR tutor/admin)
/dashboard          → Student dashboard
/checkout           → Payment checkout
/tutor-dashboard    → Tutor dashboard
/create-course      → Course creation
/verification       → Tutor verification
/admin              → Admin panel
```

> **CURRENT STATE:** Route protection is NOT implemented. All routes are accessible without authentication. Guards must be added (see Section 10).

### `template.jsx` — Navbar/Footer Logic

The template wrapper at `src/app/template.jsx` conditionally renders `<Navbar>` and `<Footer>` based on `usePathname()`. Auth pages (`/login`, `/signup`) skip these layout elements.

---

## 4. Authentication Flow

### Current State (Mocked)

Authentication is **not implemented** yet. The `Navbar.jsx` has a hardcoded:
```js
const [isLoggedIn, setIsLoggedIn] = useState(true);
```

### How It Should Work (Backend-Ready Design)

The backend uses **JWT + HttpOnly cookie** pattern:

```
Step 1: User fills AuthForm (login or signup)
        ↓
Step 2: POST /api/v1/auth/login (or /register)
        ↓
Step 3: Backend responds with:
        - accessToken (in JSON body, expires 15m)
        - refreshToken (set as HttpOnly cookie automatically)
        ↓
Step 4: Frontend stores accessToken in memory
        (NOT localStorage — XSS risk)
        ↓
Step 5: Every API call includes:
        Authorization: Bearer <accessToken>
        ↓
Step 6: When accessToken expires (15m):
        POST /api/v1/auth/refresh-token
        (cookie sent automatically by browser)
        ↓
Step 7: Backend validates refresh cookie, returns new accessToken
        ↓
Step 8: Logout: POST /api/v1/auth/logout
        Backend clears cookie, frontend clears memory token
```

### What Needs to Be Built

1. **`AuthContext`** — React context holding `user`, `accessToken`, `login()`, `logout()`, `refreshToken()`
2. **Token storage** — In-memory (React state or `useRef`), NOT `localStorage`
3. **Axios/Fetch interceptor** — Auto-attach `Authorization` header
4. **Silent refresh** — Intercept 401 responses, call `/refresh-token`, retry original request
5. **Route guards** — Middleware or layout-level checks for protected routes
6. **Role-based guards** — Redirect students away from `/tutor-dashboard`, etc.

---

## 5. API Service Layer

### Current Implementation

**File:** `src/services/apiClient.js`

```js
// Simple fetch wrapper
async function apiClient(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return response.json();
}
```

### What's Missing

1. **No Authorization header injection** — Bearer token not attached
2. **No cookie credentials** — `credentials: 'include'` not set (needed for refresh cookie)
3. **No error handling** — 4xx/5xx responses not caught
4. **No token refresh logic** — 401 responses not intercepted
5. **No environment variable** — `.env.local` file not created yet

### Required Environment Variable

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### Recommended Upgrade Pattern

```js
// src/services/apiClient.js — production-ready pattern
let accessToken = null;

export const setToken = (token) => { accessToken = token; };
export const clearToken = () => { accessToken = null; };

async function apiClient(endpoint, options = {}, retry = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    { ...options, headers, credentials: 'include' }
  );

  // Auto-refresh on 401
  if (res.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiClient(endpoint, options, false);
    // Redirect to login if refresh fails
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

async function refreshAccessToken() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
      { method: 'POST', credentials: 'include' }
    );
    if (!res.ok) return false;
    const { data } = await res.json();
    setToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}

export default apiClient;
```

---

## 6. State Management

### Current State

**No global state management** is implemented. Everything is local `useState` within components.

| State | Location | Type |
|---|---|---|
| Mobile menu open | `Navbar.jsx` | `useState` |
| Profile dropdown open | `Navbar.jsx` | `useState` |
| isLoggedIn (mock) | `Navbar.jsx` | `useState` (hardcoded `true`) |
| Login/Signup toggle | `AuthForm.jsx` | `useState` |
| Publish status | `create-course/page.jsx` | `useState` |
| Open module accordion | `CourseSidebar.jsx` | `useState` |

### What Should Be Added

**Auth Context** (minimal global state needed):

```js
// src/context/AuthContext.jsx
'use client';
import { createContext, useContext, useState } from 'react';
import { setToken, clearToken } from '@/services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData, accessToken) => {
    setToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**Add to root layout:**
```jsx
// src/app/layout.jsx
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
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

## 7. Component Architecture

### UI Primitives (`src/components/ui/`)

| Component | Props | Notes |
|---|---|---|
| `Button` | `variant`, `size`, `disabled`, `onClick` | Variants: primary, secondary, accent |
| `Card` | `className`, `children` | Rounded border with shadow |
| `Input` | `label`, `type`, `value`, `onChange`, `error` | Focus ring styling |
| `Badge` | `variant`, `children` | Tonal: primary, secondary, accent |
| `ProgressBar` | `value` (0–100), `className` | Animated CSS fill |

### Key Layout Components

**`Navbar.jsx`**
- Fixed top navigation
- Mobile hamburger menu (`isOpen` state)
- Profile dropdown (`isProfileOpen` state)
- Click-outside detection via `useRef` + `useEffect`
- Search bar (UI only, no API call yet)
- `isLoggedIn` state (currently hardcoded `true` — must connect to `AuthContext`)

**`template.jsx`**
- Wraps all pages
- Uses `usePathname()` to conditionally show/hide Navbar & Footer
- Auth pages skip Navbar/Footer

### Auth Component

**`AuthForm.jsx`** — Single component handles both login and signup
- `initialView` prop: `'login'` | `'signup'`
- Internal `view` state toggles between modes
- `router.replace()` syncs URL when switching views
- Left panel: brand illustration + glass card (hidden on mobile)
- Right panel: form fields + social login (UI only)
- **TODO:** Wire up `apiClient` calls and connect to `AuthContext`

### Course Components

**`CourseGrid.jsx`** — 6 hardcoded mock courses in a responsive grid
- Must be replaced with API fetch from `GET /api/v1/courses`

**`CourseCurriculum.jsx`** — Expandable accordion of modules
- Currently hardcoded curriculum data
- Must be driven by course data from API

**`VideoPlayer.jsx`** — Custom player UI with controls
- Uses `isPlaying` state
- Must integrate with Vimeo embed token from backend
- Backend provides signed embed token via `GET /api/v1/courses/:courseId/modules/:moduleId/player`

---

## 8. Design System

### Color Tokens

| Token | Value | Usage |
|---|---|---|
| `primary` | `#3525cd` | CTAs, active states, links |
| `primary-container` | `#4f46e5` | Auth gradient, containers |
| `secondary` | `#10b981` | Success, completions, checkmarks |
| `tertiary` | `#f97316` | Accents, offers, attention |
| `surface` | `#f8f9fa` | Default page background |
| `surface-container-low` | `#f3f4f5` | Subtle containers |
| `surface-container` | `#f8fafc` | Standard cards |
| `surface-container-high` | `#e7e8e9` | Elevated containers |
| `surface-container-highest` | `#e1e3e4` | Most elevated |
| `on-surface` | `#191c1d` | Primary text |
| `on-surface-variant` | `#464555` | Secondary text |

### Typography

- **Headings:** Manrope (400–800 weight) — Google Fonts, loaded in `layout.jsx`
- **Body/Labels:** Inter / system default
- **Icons:** Material Symbols Outlined — loaded via Google Fonts CDN

### Responsive Breakpoints

| Breakpoint | Value | Usage |
|---|---|---|
| `md:` | 768px | Tablet layouts |
| `lg:` | 1024px | Desktop layouts |
| `xl:` | 1280px | Large desktop |

### Icon System

Material Symbols are used throughout:
```jsx
<span className="material-symbols-outlined">home</span>
```

Lucide React is used in `create-course/page.jsx`:
```jsx
import { Info, Layers, Plus } from 'lucide-react';
```

---

## 9. Pages Reference

| Page | Route | Auth Required | Role | API Calls Needed |
|---|---|---|---|---|
| Home | `/` | No | All | `GET /courses` (featured) |
| Login | `/login` | No | Guest only | `POST /auth/login` |
| Signup | `/signup` | No | Guest only | `POST /auth/register` |
| Course Listing | `/list` | No | All | `GET /courses` |
| Course Detail | `/[courseId]` | No | All | `GET /courses/:id` |
| Course Player | `/[courseId]/player` | Yes | Enrolled/Tutor/Admin | `GET /courses/:id/modules/:moduleId/player` |
| Student Dashboard | `/dashboard` | Yes | Student | `GET /progress/my-learning` |
| Checkout | `/checkout` | Yes | Student | `POST /enrollments/:courseId/initiate` |
| Tutor Dashboard | `/tutor-dashboard` | Yes | Tutor | `GET /courses/tutor/my-courses` |
| Create Course | `/create-course` | Yes | Tutor | `POST /courses`, `POST /courses/:id/modules` |
| Verification | `/verification` | Yes | Tutor | `PATCH /tutors/me/profile` |
| Admin | `/admin` | Yes | Admin | `GET /admin/stats` |

---

## 10. Missing Pieces & Required Work

### Critical (Blocking Integration)

| # | Item | Description | Priority |
|---|---|---|---|
| 1 | **Auth Context** | `src/context/AuthContext.jsx` — user state, login/logout functions | P0 |
| 2 | **`.env.local`** | `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1` | P0 |
| 3 | **apiClient upgrade** | Add token injection, 401 retry, `credentials: 'include'` | P0 |
| 4 | **Route guards** | Protect `/dashboard`, `/tutor-dashboard`, `/admin`, `/create-course` | P0 |
| 5 | **AuthForm wiring** | Connect login/signup forms to actual API calls | P0 |

### Important (Feature Work)

| # | Item | Description | Priority |
|---|---|---|---|
| 6 | **Course listing API** | Replace mock data in `CourseGrid.jsx` with API fetch | P1 |
| 7 | **Course detail API** | Wire `[courseId]/page.jsx` to `GET /courses/:id` | P1 |
| 8 | **Vimeo player** | Integrate embed token into `VideoPlayer.jsx` | P1 |
| 9 | **Payment flow** | Connect `checkout/page.jsx` to Razorpay order creation | P1 |
| 10 | **Progress tracking** | Wire student dashboard to `GET /progress/my-learning` | P1 |
| 11 | **Tutor dashboard** | Wire to `GET /courses/tutor/my-courses` | P1 |

### Nice-to-Have

| # | Item | Description | Priority |
|---|---|---|---|
| 12 | **Loading states** | Skeleton loaders during API fetches | P2 |
| 13 | **Error boundaries** | Global error UI for failed requests | P2 |
| 14 | **Toast notifications** | Feedback on login, enrollment, errors | P2 |
| 15 | **Admin API wiring** | Connect admin panel to actual admin stats | P2 |
| 16 | **Search functionality** | Navbar search → course listing with query | P2 |
| 17 | **Middleware.ts** | Next.js edge middleware for server-side route protection | P2 |

---

## 11. Integration Checklist

Before connecting frontend to backend, verify:

- [ ] `frontend/.env.local` exists with `NEXT_PUBLIC_API_BASE_URL`
- [ ] Backend running at `http://localhost:5000`
- [ ] Backend CORS allows `http://localhost:3000` (frontend dev port)
- [ ] `credentials: 'include'` in all fetch calls that need cookies
- [ ] `AuthContext` wrapping root layout
- [ ] `apiClient` upgraded with token injection
- [ ] `Navbar.jsx` connected to `useAuth()` instead of hardcoded state
- [ ] `AuthForm.jsx` calls real API and calls `login()` from context
- [ ] Route guards on protected pages
- [ ] Role-based redirects (student can't access tutor routes)

---

*This document is a living guide. Update it when adding new pages, routes, or integration patterns.*
