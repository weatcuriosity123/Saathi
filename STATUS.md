# Saathi — Project Status Tracker

> **Last Updated:** 2026-04-05 (Phase G — All Phases Complete)  
> **Update this file after every phase or feature implementation.**  
> Legend: ✅ Done &nbsp;|&nbsp; 🔄 In Progress &nbsp;|&nbsp; ⏳ Pending &nbsp;|&nbsp; ❌ Blocked &nbsp;|&nbsp; 🔮 Future Feature

---

## Integration Phases

| Phase | Name | Status | Completed On |
|---|---|---|---|
| A | Foundation (env, apiClient, AuthContext, middleware) | ✅ Done | 2026-04-04 |
| B | Auth Slice (AuthForm wired, Navbar connected, route guards) | ✅ Done | 2026-04-04 |
| C | Public Pages (course listing + detail → real API) | ✅ Done | 2026-04-04 |
| D | Protected Student Pages (dashboard, player, progress) | ✅ Done | 2026-04-04 |
| E | Payment Flow (Razorpay checkout + verify) | ✅ Done | 2026-04-05 |
| F | Tutor Pages (dashboard, create-course, verification) | ✅ Done | 2026-04-05 |
| G | Admin Panel (stats, moderation UI) | ✅ Done | 2026-04-05 |

---

## Pages

### Public Pages

| Page | Route | UI | API Wired | Status | Notes |
|---|---|---|---|---|---|
| Home | `/` | ✅ | ✅ | ✅ Done | FeaturedCourses fetches `GET /courses?limit=4&sort=rating` |
| Course Listing | `/list` | ✅ | ✅ | ✅ Done | Real filters, pagination, empty state, skeletons |
| Course Detail | `/[courseId]` | ✅ | ✅ | ✅ Done | Course + modules + tutor + reviews all from API, 404 handled |

### Auth Pages

| Page | Route | UI | API Wired | Status | Notes |
|---|---|---|---|---|---|
| Login | `/login` | ✅ | ✅ | ✅ Done | Phase B — real API, error handling, role redirect |
| Signup | `/signup` | ✅ | ✅ | ✅ Done | Phase B — real API, field errors, spinner |

### Student Pages

| Page | Route | UI | API Wired | Guard | Status | Notes |
|---|---|---|---|---|---|---|
| Student Dashboard | `/dashboard` | ✅ | ✅ | ✅ | ✅ Done | Real progress, resume link, XP points, stats |
| Course Player | `/[courseId]/player` | ✅ | ✅ | ✅ | ✅ Done | Vimeo iframe, mark-complete, prev/next nav |
| Checkout | `/checkout` | ✅ | ✅ | ✅ | ✅ Done | Free + paid Razorpay flow, already-enrolled guard |

### Tutor Pages

| Page | Route | UI | API Wired | Guard | Status | Notes |
|---|---|---|---|---|---|---|
| Tutor Dashboard | `/tutor-dashboard` | ✅ | ✅ | ✅ | ✅ Done | Real courses + computed stats from API |
| Create Course | `/create-course` | ✅ | ✅ | ✅ | ✅ Done | Full form → POST /courses, thumbnail upload, TUS video upload, submit-for-review |
| Verification | `/verification` | ✅ | ✅ | ✅ | ✅ Done | Real profile form → PATCH /tutors/me/profile, approval status display |

### Admin Pages

| Page | Route | UI | API Wired | Guard | Status | Notes |
|---|---|---|---|---|---|---|
| Admin Dashboard | `/admin` | ✅ | ✅ | ✅ | ✅ Done | Real stats, pending tutors queue + approve/reject, course review queue + publish/reject |

---

## Components

### Layout

| Component | File | Real Data | Status | Notes |
|---|---|---|---|---|
| `Navbar` | `layout/Navbar.jsx` | ✅ | ✅ Done | Phase B — `useAuth()` connected, real name/avatar/role |
| `Footer` | `layout/Footer.jsx` | — | ✅ Done | Static — no API needed |
| `Sidebar` (student) | `layout/Sidebar.jsx` | ⏳ | ⏳ Pending | Links fine; active course highlight needs data |
| `TutorSidebar` | `layout/tutor/TutorSidebar.jsx` | — | ✅ Done | Static nav — no API needed |
| `TutorHeader` | `layout/tutor/TutorHeader.jsx` | ⏳ | ⏳ Pending | Needs real user name/avatar |
| `AdminSidebar` | `admin/AdminSidebar.jsx` | — | ✅ Done | Static nav |
| `AdminTopBar` | `admin/AdminTopBar.jsx` | ⏳ | ⏳ Pending | Needs real user name/avatar |

### Auth

| Component | File | Status | Notes |
|---|---|---|---|
| `AuthForm` | `auth/AuthForm.jsx` | ✅ Done | Phase B — login + register wired, field errors, loading state |

### Guards

| Component | File | Status | Notes |
|---|---|---|---|
| `TutorGuard` | `guards/TutorGuard.jsx` | ✅ Done | Phase B — allows tutor + admin, redirects student |
| `AdminGuard` | `guards/AdminGuard.jsx` | ✅ Done | Phase B — admin only, redirects everyone else |

### Courses — Listing

| Component | File | Real Data | Status | Notes |
|---|---|---|---|---|
| `CourseGrid` | `courses/CourseGrid.jsx` | ✅ | ✅ Done | Receives courses prop, real pagination, skeleton loader, empty state |
| `CourseFilters` | `courses/CourseFilters.jsx` | ✅ | ✅ Done | Categories aligned to backend enum, emits filter changes up |

### Courses — Detail

| Component | File | Real Data | Status | Notes |
|---|---|---|---|---|
| `CourseHero` | `courses/detail/CourseHero.jsx` | ✅ | ✅ Done | Accepts `course` prop — title, stats, tags, duration |
| `CourseSidebar` | `courses/detail/CourseSidebar.jsx` | ✅ | ✅ Done | Real price, enroll/continue button based on `isEnrolled` |
| `CourseCurriculum` | `courses/detail/CourseCurriculum.jsx` | ✅ | ✅ Done | Accepts `modules[]` — accordion, duration, free preview badge |
| `InstructorCard` | `courses/detail/InstructorCard.jsx` | ✅ | ✅ Done | Accepts `tutor` prop from separate fetch, graceful fallback |
| `CourseReviews` | `courses/detail/CourseReviews.jsx` | ✅ | ✅ Done | Real reviews + aggregate rating display |

### Courses — Player

| Component | File | Real Data | Status | Notes |
|---|---|---|---|---|
| `VideoPlayer` | `courses/player/VideoPlayer.jsx` | ✅ | ✅ Done | Vimeo iframe with signed embed token, loading + no-video states |
| `LessonInfo` | `courses/player/LessonInfo.jsx` | ✅ | ✅ Done | Real module title/description/resources, prev/next nav |
| `CourseSidebar` (player) | `courses/player/CourseSidebar.jsx` | ✅ | ✅ Done | Full module list, completion icons, progress bar, mark-complete |

### Home

| Component | File | Real Data | Status | Notes |
|---|---|---|---|---|
| `HomeHero` | `home/HomeHero.jsx` | — | ✅ Done | Fully static — no API needed |
| `FeaturedCourses` | `home/FeaturedCourses.jsx` | ✅ | ✅ Done | Async server component — `GET /courses?limit=4&sort=rating`, hides if API down |
| `WhySaathi` | `home/WhySaathi.jsx` | — | ✅ Done | Static |
| `HowItWorks` | `home/HowItWorks.jsx` | — | ✅ Done | Static |
| `CTASection` | `home/CTASection.jsx` | — | ✅ Done | Static |
| `Testimonials` | `home/Testimonials.jsx` | — | ✅ Done | Static (or keep as social proof) |

### Tutor Dashboard

| Component | File | Real Data | Status | Notes |
|---|---|---|---|---|
| `StatsGrid` | `tutor/dashboard/StatsGrid.jsx` | ⏳ | ⏳ Pending | Needs real earnings/student counts |
| `CourseList` | `tutor/dashboard/CourseList.jsx` | ⏳ | ⏳ Pending | Needs `GET /courses/tutor/my-courses` |
| `AnalyticsCard` | `tutor/dashboard/AnalyticsCard.jsx` | ⏳ | ⏳ Pending | Needs aggregated stats |
| `RecentEarnings` | `tutor/dashboard/RecentEarnings.jsx` | ⏳ | ⏳ Pending | Needs earnings data (not yet in backend) |

### Admin

| Component | File | Real Data | Status | Notes |
|---|---|---|---|---|
| `StatCard` | `admin/StatCard.jsx` | ⏳ | ⏳ Pending | Needs `GET /admin/stats` |
| `ActivityMonitor` | `admin/ActivityMonitor.jsx` | ⏳ | ⏳ Pending | No real-time activity endpoint yet |

### UI Primitives

| Component | File | Status | Notes |
|---|---|---|---|
| `Button` | `ui/Button.jsx` | ✅ Done | Generic — no API |
| `Card` | `ui/Card.jsx` | ✅ Done | Generic |
| `Input` | `ui/Input.jsx` | ✅ Done | Generic |
| `Badge` | `ui/Badge.jsx` | ✅ Done | Generic |
| `ProgressBar` | `ui/ProgressBar.jsx` | ✅ Done | Generic |

---

## Services & Utilities

| File | Status | Notes |
|---|---|---|
| `services/apiClient.js` | ✅ Done | Phase A — token injection, 401 retry, silent refresh |
| `context/AuthContext.jsx` | ✅ Done | Phase A — user state, login/logout, session restore on reload |
| `middleware.js` | ✅ Done | Phase A — cookie-based route guard at edge |
| `lib/constants.js` | ✅ Done | Static constants — no changes needed |
| `utils/cn.js` | ✅ Done | Class name utility — no changes needed |
| `hooks/useMounted.js` | ✅ Done | Hydration guard — no changes needed |

---

## Backend Modules

| Module | Routes Built | Status | Notes |
|---|---|---|---|
| `auth` | register, login, refresh, logout, /me | ✅ Done | Full JWT + cookie flow |
| `user` | Model only | ✅ Done | Used by all modules |
| `course` | CRUD + submit-review + listing | ✅ Done | Full workflow |
| `module` | CRUD + reorder + player token | ✅ Done | Vimeo TUS integration |
| `enrollment` | initiate + verify + webhook | ✅ Done | Razorpay mock in place |
| `progress` | mark complete + my-learning | ✅ Done | Certificate trigger at 100% |
| `review` | CRUD + rating recalculation | ✅ Done | |
| `certificate` | generate (BullMQ) + verify | ✅ Done | PDFKit + Cloudinary |
| `admin` | stats + user/tutor/course moderation | ✅ Done | |
| `tutor` | profile + password change | ✅ Done | |
| `upload` | avatar + thumbnail | ✅ Done | Cloudinary |
| **Vimeo webhook** | — | ⏳ Pending | `handleVimeoWebhook()` service exists, route missing |
| **Razorpay real client** | — | ⏳ Pending | `npm install razorpay` + uncomment in enrollment.service.js |
| **Email verification** | — | 🔮 Future | `isEmailVerified` field exists, flow not built |
| **Payout system** | — | 🔮 Future | `totalEarnings`, `pendingPayout` fields exist |

---

## Features Breakdown

### Authentication & Sessions
| Feature | Status | Notes |
|---|---|---|
| Register (student) | ✅ Done | Via AuthForm |
| Register (tutor) | ⏳ Pending | No role selector in UI — needs "Register as Tutor" toggle in AuthForm |
| Login | ✅ Done | Via AuthForm |
| Session restore on refresh | ✅ Done | AuthContext silent refresh via cookie |
| Logout | ✅ Done | Clears cookie + memory token |
| Password show/hide toggle | ✅ Done | |
| Forgot password flow | 🔮 Future | Backend not built |
| Google OAuth | 🔮 Future | Button exists, disabled |
| Email verification | 🔮 Future | |

### Course Discovery
| Feature | Status | Notes |
|---|---|---|
| Browse all courses | ⏳ Pending | Phase C |
| Filter by category/level/price | ⏳ Pending | Phase C |
| Full-text search | ⏳ Pending | Phase C |
| Sort courses | ⏳ Pending | Phase C |
| Course detail page | ⏳ Pending | Phase C |
| View instructor profile | ⏳ Pending | Phase C |
| Read reviews | ⏳ Pending | Phase C |

### Enrollment & Payments
| Feature | Status | Notes |
|---|---|---|
| Free course enrollment | ✅ Done | Instant via `POST /enrollments/:courseId/initiate` |
| Paid enrollment (Razorpay) | ✅ Done | Razorpay.js modal; works with real keys |
| Payment verification | ✅ Done | HMAC check on backend, `POST /enrollments/verify-payment` |
| Enrollment status check | ✅ Done | `GET /enrollments/check/:courseId` on page load |
| My enrolled courses list | ✅ Done | Dashboard shows enrolled courses with progress |

### Learning Experience
| Feature | Status | Notes |
|---|---|---|
| Video playback (Vimeo embed) | ⏳ Pending | Phase D |
| Mark module complete | ⏳ Pending | Phase D |
| Unmark module complete | ⏳ Pending | Phase D |
| Progress percentage display | ⏳ Pending | Phase D |
| Resume where you left off | ⏳ Pending | Phase D — uses `progress.lastModuleId` |
| Download resources | ⏳ Pending | Phase D — Cloudinary URLs from module.resources |

### Reviews & Ratings
| Feature | Status | Notes |
|---|---|---|
| View course reviews | ⏳ Pending | Phase C |
| Write a review | 🔮 Future | UI not designed yet |
| Edit own review | 🔮 Future | |
| Delete own review | 🔮 Future | |

### Certificates
| Feature | Status | Notes |
|---|---|---|
| Auto-generate on 100% completion | ✅ Done | Backend BullMQ worker |
| View my certificates | ⏳ Pending | UI not built |
| Certificate PDF download | ⏳ Pending | Cloudinary URL available |
| Public certificate verification | ✅ Done | `GET /certificates/verify/:id` (backend) |
| Verification UI page | 🔮 Future | No page exists yet |

### Tutor Tools
| Feature | Status | Notes |
|---|---|---|
| View own courses | ✅ Done | Tutor dashboard shows real courses with status |
| Create new course | ✅ Done | Full form → POST /courses, saves as draft |
| Upload course thumbnail | ✅ Done | POST /uploads/courses/:id/thumbnail → Cloudinary |
| Add video module | ✅ Done | File input → POST /courses/:id/modules → TUS upload to Vimeo |
| Reorder modules | ⏳ Pending | Backend supports it; no drag-and-drop UI yet |
| Submit course for review | ✅ Done | POST /courses/:id/submit-review button in editor |
| View earnings | 🔮 Future | Payout system not built |
| Tutor verification flow | ⏳ Pending | Phase F — file upload to Cloudinary |
| Public tutor profile page | 🔮 Future | No UI page, API exists |

### Admin Tools
| Feature | Status | Notes |
|---|---|---|
| Dashboard stats | ✅ Done | Real counts from GET /admin/stats |
| List all users | ⏳ Pending | API exists (GET /admin/users); no dedicated UI page |
| Activate/deactivate user | ⏳ Pending | PATCH /admin/users/:id/toggle-active exists; no UI |
| Pending tutor verification queue | ✅ Done | Admin dashboard shows queue with approve/reject |
| Approve/reject tutor | ✅ Done | One-click approve; reject with reason prompt |
| Course review queue | ✅ Done | Admin dashboard shows courses under review |
| Publish/reject/unpublish course | ✅ Done | Publish + reject-to-draft with reason prompt |
| Delete reviews (moderation) | 🔮 Future | API exists, no UI |

### Profile & Settings
| Feature | Status | Notes |
|---|---|---|
| View own profile | 🔮 Future | `/profile` route doesn't exist yet |
| Upload avatar | 🔮 Future | `POST /uploads/avatar` exists on backend |
| Change password | 🔮 Future | `PATCH /tutors/me/password` exists on backend |
| Update bio/expertise (tutor) | ⏳ Pending | Phase F — verification page partially covers this |

---

## Planned New Pages (Not Yet Created)

| Page | Route | Priority | Notes |
|---|---|---|---|
| Public Tutor Profile | `/tutors/[tutorId]` | P2 | `GET /tutors/:id/profile` exists |
| My Certificates | `/certificates` | P2 | `GET /certificates/my` exists |
| Certificate Verify | `/verify/[certificateId]` | P2 | `GET /certificates/verify/:id` exists |
| User Profile / Settings | `/profile` | P2 | Navbar has link, page missing |
| Course Search Results | `/search?q=` | P2 | Could merge into `/list` with query |
| Error 404 | `/not-found` | P1 | Default Next.js, customize |
| Error 500 | — | P1 | Error boundary needed |

---

## Technical Debt & Known Issues

| Issue | Severity | Notes |
|---|---|---|
| No toast / notification system | Medium | Errors only shown inline; no global success/failure toasts |
| No loading skeletons | Medium | Pages show blank while fetching; need skeleton components |
| No error boundary | High | Uncaught render errors will crash the whole page |
| `TutorHeader` shows hardcoded name | Low | Needs `useAuth()` connected |
| `AdminTopBar` shows hardcoded name | Low | Needs `useAuth()` connected |
| Role selector missing in signup | Medium | Can only register as student via UI; tutors must use API |
| Razorpay not installed on backend | High | Blocks all paid enrollments |
| Vimeo webhook route missing | Medium | Without it, module status stays "uploading" forever |
| Search in Navbar is UI-only | Medium | No API call on submit |
| Course player needs moduleId routing | Medium | `/[courseId]/player` doesn't specify which module to play |
| No pagination UI on course listing | Medium | Backend supports it, frontend has no page controls |
| No 404 handling for bad course IDs | Medium | Would crash the detail page |

---

## Future Features (Post-MVP)

| Feature | Notes |
|---|---|
| Google OAuth login | Needs Passport.js or NextAuth on backend |
| Email verification on register | `isEmailVerified` field ready, flow missing |
| Forgot password / reset flow | Not started |
| Real-time notifications | Would need WebSockets or SSE |
| Course discussions / comments | No model or UI yet |
| Student notes (per lesson) | LessonInfo has a Notes tab — no backend |
| Mentor booking system | Navbar has "Mentors" link — not built |
| Leaderboard / XP system | Dashboard shows XP badge — not wired |
| Mobile app (React Native) | — |
| Referral / affiliate system | — |
| Course bundles / subscriptions | — |
| Multi-language support | — |
| Dark mode | Design tokens support it, no toggle |
| Tutor payout dashboard | `totalEarnings`, `pendingPayout` fields ready |
| Analytics for tutors | Charts page exists as stub |
| Admin revenue reports | No backend endpoint |
| Certificate sharing (LinkedIn) | PDF URL available, share flow not built |
| Live cohort / batch courses | — |

---

*Update this file whenever a phase is completed or a feature is implemented. Change ⏳ → ✅ and add the date.*
