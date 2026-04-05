/**
 * Saathi — Demo Data Seeder
 *
 * Creates:
 *   - 1 Admin user
 *   - 2 Tutor users (approved)
 *   - 2 Student users
 *   - 4 Published courses with modules
 *   - Enrollments for students in some courses
 *
 * Usage:
 *   node src/script/seed.js          → seed (skips if data already exists)
 *   node src/script/seed.js --fresh  → wipe and reseed everything
 *
 * Credentials printed at the end.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../modules/user/user.model');
const Course = require('../modules/course/course.model');
const Module = require('../modules/module/module.model');
const Enrollment = require('../modules/enrollment/enrollment.model');
const Progress = require('../modules/progress/progress.model');

// ── Colour helpers ────────────────────────────────────────────────────────────
const G = (s) => `\x1b[32m${s}\x1b[0m`;
const Y = (s) => `\x1b[33m${s}\x1b[0m`;
const B = (s) => `\x1b[34m${s}\x1b[0m`;
const R = (s) => `\x1b[31m${s}\x1b[0m`;
const BOLD = (s) => `\x1b[1m${s}\x1b[0m`;

// ── Seed Definitions ──────────────────────────────────────────────────────────

const USERS = [
  {
    name: 'Saathi Admin',
    email: 'admin@saathi.dev',
    password: 'Admin@1234',
    role: 'admin',
    isEmailVerified: true,
  },
  {
    name: 'Arjun Sharma',
    email: 'tutor1@saathi.dev',
    password: 'Tutor@1234',
    role: 'tutor',
    isEmailVerified: true,
    tutorProfile: {
      bio: 'Full-stack developer with 8 years of experience building scalable web applications. I have worked with startups and MNCs alike, and love breaking down complex topics into simple, actionable lessons.',
      expertise: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      verificationStatus: 'approved',
      isApproved: true,
    },
  },
  {
    name: 'Priya Mehta',
    email: 'tutor2@saathi.dev',
    password: 'Tutor@1234',
    role: 'tutor',
    isEmailVerified: true,
    tutorProfile: {
      bio: 'UI/UX designer and Figma expert with a passion for design systems and accessible interfaces. Previously at Razorpay design team.',
      expertise: ['Figma', 'UI/UX Design', 'Design Systems', 'Accessibility'],
      verificationStatus: 'approved',
      isApproved: true,
    },
  },
  {
    name: 'Rohan Verma',
    email: 'student1@saathi.dev',
    password: 'Student@1234',
    role: 'student',
    isEmailVerified: true,
  },
  {
    name: 'Ananya Singh',
    email: 'student2@saathi.dev',
    password: 'Student@1234',
    role: 'student',
    isEmailVerified: true,
  },
];

// Courses keyed to tutor index (0 = Arjun, 1 = Priya)
const COURSES = [
  {
    tutorIdx: 1, // Arjun
    title: 'Complete JavaScript & ES2024 — Zero to Hero',
    shortDescription: 'Master JavaScript from fundamentals to modern ES2024 features with real-world projects.',
    description: `JavaScript is the language of the web, and this course takes you from absolute beginner to confident developer. You will learn core concepts like closures, prototypes, the event loop, and async/await, then level up with modern ES2024 features including decorators, pattern matching, and the new Array grouping methods. By the end, you will have built three real-world projects: a weather dashboard, a kanban board, and a full REST API client.`,
    price: 0,
    category: 'programming',
    level: 'beginner',
    language: 'English',
    tags: ['javascript', 'es6', 'web development', 'frontend', 'beginner'],
    requirements: ['A computer with internet access', 'No prior programming experience needed'],
    outcomes: [
      'Write clean, modern JavaScript using ES2024 features',
      'Understand the JavaScript event loop and async programming',
      'Build and consume REST APIs from the browser',
      'Debug JS code like a pro using Chrome DevTools',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop',
    rating: { average: 4.8, count: 124 },
    totalStudents: 312,
    modules: [
      { title: 'Welcome & Course Overview', description: 'What you will build and how the course is structured.', order: 1, duration: 300, isFree: true, points: 5 },
      { title: 'Variables, Data Types & Operators', description: 'let, const, primitive types, type coercion, and operators.', order: 2, duration: 1800, isFree: true, points: 10 },
      { title: 'Functions & Scope', description: 'Function declarations, expressions, arrow functions, scope chain.', order: 3, duration: 2400, isFree: false, points: 10 },
      { title: 'Arrays & Objects In-Depth', description: 'Destructuring, spread, rest, and powerful array methods.', order: 4, duration: 3000, isFree: false, points: 15 },
      { title: 'DOM Manipulation', description: 'Selecting elements, events, and building interactive UIs.', order: 5, duration: 2700, isFree: false, points: 15 },
      { title: 'Async JavaScript — Callbacks, Promises, Async/Await', description: 'Master asynchronous programming patterns.', order: 6, duration: 3600, isFree: false, points: 20 },
      { title: 'Fetch API & REST Clients', description: 'Consuming APIs, handling errors, loading states.', order: 7, duration: 2400, isFree: false, points: 15 },
      { title: 'ES2024 New Features', description: 'Decorators, Array.groupBy, Promise.withResolvers and more.', order: 8, duration: 1800, isFree: false, points: 10 },
    ],
  },
  {
    tutorIdx: 1, // Arjun
    title: 'React 19 — Build Modern Web Apps with Hooks & Server Components',
    shortDescription: 'Learn React 19 from the ground up including the new compiler, Server Components, and Actions.',
    description: `This course dives deep into React 19 — the biggest React release in years. You will start with JSX and component thinking, move through hooks (useState, useEffect, useReducer, useContext), and then explore the exciting new primitives: Server Components, the React Compiler, use() hook, and Actions. We build two full projects: a real-time dashboard and an e-commerce product page.`,
    price: 1499,
    category: 'programming',
    level: 'intermediate',
    language: 'English',
    tags: ['react', 'hooks', 'server components', 'frontend', 'javascript'],
    requirements: ['Solid JavaScript fundamentals (ES6+)', 'Basic understanding of HTML and CSS'],
    outcomes: [
      'Build production-ready React 19 applications',
      'Use React Server Components and the new use() hook',
      'Manage state with useReducer and Context API',
      'Optimise rendering with the React Compiler',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
    rating: { average: 4.7, count: 89 },
    totalStudents: 198,
    modules: [
      { title: 'Why React? Setup & JSX', description: 'Vite setup, JSX rules, and thinking in components.', order: 1, duration: 900, isFree: true, points: 5 },
      { title: 'Props, State & Event Handling', description: 'Component communication and interactive UIs.', order: 2, duration: 2400, isFree: true, points: 10 },
      { title: 'useEffect & Lifecycle', description: 'Side effects, cleanups, and dependency arrays.', order: 3, duration: 2700, isFree: false, points: 15 },
      { title: 'useReducer & Context API', description: 'State machines and global state without Redux.', order: 4, duration: 3000, isFree: false, points: 15 },
      { title: 'React Router v7', description: 'Client-side routing, nested routes, and loaders.', order: 5, duration: 2400, isFree: false, points: 10 },
      { title: 'React 19 — Server Components', description: 'RSC fundamentals, async components, and caching.', order: 6, duration: 3600, isFree: false, points: 20 },
      { title: 'React 19 — Actions & use() Hook', description: 'Form actions, optimistic updates, use() for promises.', order: 7, duration: 2700, isFree: false, points: 20 },
      { title: 'Performance & the React Compiler', description: 'Auto-memoisation, profiling, and bundle optimisation.', order: 8, duration: 1800, isFree: false, points: 15 },
    ],
  },
  {
    tutorIdx: 2, // Priya
    title: 'Figma Master Class — Design Systems & Component Libraries',
    shortDescription: 'Design pixel-perfect, accessible UIs and build a production-ready design system in Figma.',
    description: `Figma has become the industry standard for product design, and this course teaches you to use it like a professional. You will learn Auto Layout, Variants, Component Properties, and the new Dev Mode. The centrepiece is building a complete design system from scratch — colour tokens, typography, spacing scale, and a library of 40+ components — following WCAG accessibility guidelines throughout.`,
    price: 999,
    category: 'design',
    level: 'intermediate',
    language: 'English',
    tags: ['figma', 'ui design', 'ux', 'design system', 'components'],
    requirements: ['Basic computer skills', 'A free Figma account (no paid plan needed for this course)'],
    outcomes: [
      'Build a complete design system in Figma from scratch',
      'Master Auto Layout, Variants, and Component Properties',
      'Design WCAG-AA accessible colour schemes and typography',
      'Hand off designs to developers using Dev Mode',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
    rating: { average: 4.9, count: 201 },
    totalStudents: 445,
    modules: [
      { title: 'Figma Interface & Navigation', description: 'Frames, layers panel, plugins, and keyboard shortcuts.', order: 1, duration: 1200, isFree: true, points: 5 },
      { title: 'Auto Layout Deep Dive', description: 'Responsive layouts, gap, padding, and fill modes.', order: 2, duration: 2700, isFree: true, points: 10 },
      { title: 'Components & Instances', description: 'Building reusable components, overrides, and nesting.', order: 3, duration: 2400, isFree: false, points: 15 },
      { title: 'Variants & Component Properties', description: 'Boolean, text, instance swap, and nested variants.', order: 4, duration: 3000, isFree: false, points: 20 },
      { title: 'Colour Tokens & Theming', description: 'Building a semantic colour system with light/dark modes.', order: 5, duration: 2700, isFree: false, points: 15 },
      { title: 'Typography Scale & Text Styles', description: 'Type hierarchy, variable fonts, and text styles.', order: 6, duration: 1800, isFree: false, points: 10 },
      { title: 'Building the Component Library', description: '40+ components: buttons, inputs, cards, modals, nav.', order: 7, duration: 5400, isFree: false, points: 25 },
      { title: 'Dev Mode & Handoff', description: 'Annotations, inspect panel, and code snippets for devs.', order: 8, duration: 1800, isFree: false, points: 10 },
    ],
  },
  {
    tutorIdx: 2, // Priya
    title: 'UX Research Fundamentals — From User Interviews to Insights',
    shortDescription: 'Learn to conduct user research, analyse findings, and translate insights into better product decisions.',
    description: `Great design starts with understanding your users. This course teaches the core UX research methods used at top product companies: user interviews, usability testing, surveys, card sorting, and affinity mapping. You will learn how to recruit participants, write discussion guides, synthesise qualitative data, and present findings in a way that drives product decisions. Includes real case studies from SaaS and consumer app contexts.`,
    price: 0,
    category: 'design',
    level: 'beginner',
    language: 'English',
    tags: ['ux research', 'user interviews', 'usability testing', 'product design'],
    requirements: ['No prior design experience required', 'Curiosity about people and how they use products'],
    outcomes: [
      'Plan and conduct effective user interviews',
      'Run moderated and unmoderated usability tests',
      'Synthesise qualitative data using affinity mapping',
      'Present research findings to product and engineering teams',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=800&auto=format&fit=crop',
    rating: { average: 4.6, count: 67 },
    totalStudents: 189,
    modules: [
      { title: 'What is UX Research and Why It Matters', description: 'Overview of research methods and when to use each.', order: 1, duration: 900, isFree: true, points: 5 },
      { title: 'Planning a Research Study', description: 'Research questions, goals, and choosing methods.', order: 2, duration: 1800, isFree: true, points: 10 },
      { title: 'Recruiting Participants', description: 'Screeners, incentives, and finding the right users.', order: 3, duration: 1500, isFree: false, points: 10 },
      { title: 'Conducting User Interviews', description: 'Discussion guides, active listening, and avoiding bias.', order: 4, duration: 3000, isFree: false, points: 20 },
      { title: 'Usability Testing — Moderated', description: 'Think-aloud protocol, observation, and note-taking.', order: 5, duration: 2700, isFree: false, points: 15 },
      { title: 'Usability Testing — Unmoderated', description: 'Tools like Maze and Lyssna; writing tasks and metrics.', order: 6, duration: 1800, isFree: false, points: 10 },
      { title: 'Affinity Mapping & Synthesis', description: 'Turning raw notes into themes, insights, and opportunities.', order: 7, duration: 2400, isFree: false, points: 20 },
      { title: 'Communicating Research Findings', description: 'Research reports, presentations, and top task analysis.', order: 8, duration: 1800, isFree: false, points: 10 },
    ],
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  const isFresh = process.argv.includes('--fresh');

  await connectDB();

  if (isFresh) {
    console.log(Y('\n⚠  --fresh flag detected. Wiping existing seed data...\n'));
    const seedEmails = USERS.map((u) => u.email);
    const seedUsers = await User.find({ email: { $in: seedEmails } }).select('_id').lean();
    const seedUserIds = seedUsers.map((u) => u._id);
    const seedCourses = await Course.find({ tutorId: { $in: seedUserIds } }).select('_id').lean();
    const seedCourseIds = seedCourses.map((c) => c._id);

    await Promise.all([
      Progress.deleteMany({ courseId: { $in: seedCourseIds } }),
      Enrollment.deleteMany({ courseId: { $in: seedCourseIds } }),
      Module.deleteMany({ courseId: { $in: seedCourseIds } }),
      Course.deleteMany({ _id: { $in: seedCourseIds } }),
      User.deleteMany({ email: { $in: seedEmails } }),
    ]);
    console.log(G('✓ Wiped previous seed data\n'));
  }

  // ── 1. Create Users ──────────────────────────────────────────────────────
  console.log(B('━━━ Creating users ━━━'));
  const createdUsers = [];

  for (const userData of USERS) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      console.log(Y(`  skip  ${userData.email} (already exists)`));
      createdUsers.push(existing);
      continue;
    }
    const user = await User.create(userData);
    console.log(G(`  ✓  ${userData.role.padEnd(7)} ${user.email}`));
    createdUsers.push(user);
  }

  // Map by email for easy lookup
  const userMap = {};
  createdUsers.forEach((u) => { userMap[u.email] = u; });

  const tutors = [userMap['tutor1@saathi.dev'], userMap['tutor2@saathi.dev']];
  const students = [userMap['student1@saathi.dev'], userMap['student2@saathi.dev']];

  // ── 2. Create Courses + Modules ──────────────────────────────────────────
  console.log(B('\n━━━ Creating courses & modules ━━━'));
  const createdCourses = [];

  for (const courseDef of COURSES) {
    const tutor = tutors[courseDef.tutorIdx - 1];
    const { modules: moduleDefs, tutorIdx, ...courseData } = courseDef;

    // Check if course already exists (by title + tutor)
    const existing = await Course.findOne({ tutorId: tutor._id, title: courseData.title });
    if (existing) {
      console.log(Y(`  skip  "${courseData.title.substring(0, 50)}…" (already exists)`));
      createdCourses.push(existing);
      continue;
    }

    // Create course
    const course = await Course.create({
      ...courseData,
      tutorId: tutor._id,
      status: 'published',
      publishedAt: new Date(),
      totalModules: moduleDefs.length,
      totalDuration: moduleDefs.reduce((s, m) => s + m.duration, 0),
    });

    // Create modules (no real Vimeo videos — status set to 'ready' for testing)
    const modulePromises = moduleDefs.map((m) =>
      Module.create({
        ...m,
        courseId: course._id,
        vimeoId: null,       // no real video
        vimeoStatus: 'ready', // set ready so player doesn't block
      })
    );
    await Promise.all(modulePromises);

    console.log(G(`  ✓  "${course.title.substring(0, 55)}…"`));
    console.log(`       ${moduleDefs.length} modules · ${courseData.price === 0 ? 'FREE' : `₹${courseData.price}`} · ${courseData.level}`);
    createdCourses.push(course);
  }

  // ── 3. Enroll Students ───────────────────────────────────────────────────
  console.log(B('\n━━━ Creating enrollments ━━━'));

  // student1 → enrolled in JS course (free) + React course (paid)
  // student2 → enrolled in Figma course (paid) + UX course (free)
  const enrollmentPlan = [
    { student: students[0], courseIdx: 0 }, // Rohan → JS (free)
    { student: students[0], courseIdx: 1 }, // Rohan → React (paid)
    { student: students[1], courseIdx: 2 }, // Ananya → Figma (paid)
    { student: students[1], courseIdx: 3 }, // Ananya → UX Research (free)
  ];

  const enrolledPairs = [];

  for (const { student, courseIdx } of enrollmentPlan) {
    const course = createdCourses[courseIdx];
    if (!course) continue;

    const existing = await Enrollment.findOne({ userId: student._id, courseId: course._id });
    if (existing) {
      console.log(Y(`  skip  ${student.name} → "${course.title.substring(0, 40)}…"`));
      enrolledPairs.push({ student, course });
      continue;
    }

    await Enrollment.create({
      userId: student._id,
      courseId: course._id,
      amount: course.price,
      status: 'completed',
      enrolledAt: new Date(),
    });

    console.log(G(`  ✓  ${student.name.padEnd(14)} → "${course.title.substring(0, 40)}…"`));
    enrolledPairs.push({ student, course });
  }

  // ── 4. Seed Some Progress ────────────────────────────────────────────────
  console.log(B('\n━━━ Seeding progress ━━━'));

  for (const { student, course } of enrolledPairs) {
    const existing = await Progress.findOne({ userId: student._id, courseId: course._id });
    if (existing) {
      console.log(Y(`  skip  ${student.name} progress for "${course.title.substring(0, 35)}…"`));
      continue;
    }

    const modules = await Module.find({ courseId: course._id }).sort({ order: 1 }).lean();
    if (!modules.length) continue;

    // Complete first 2 modules for each enrollment
    const completedModules = modules.slice(0, 2).map((m) => m._id);
    const percentage = Math.round((completedModules.length / modules.length) * 100);
    const totalPoints = modules.slice(0, 2).reduce((s, m) => s + m.points, 0);

    await Progress.create({
      userId: student._id,
      courseId: course._id,
      completedModules,
      percentage,
      totalPoints,
      lastModuleId: completedModules[completedModules.length - 1],
    });

    console.log(G(`  ✓  ${student.name.padEnd(14)} → ${percentage}% on "${course.title.substring(0, 35)}…"`));
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(60)}`);
  console.log(BOLD('  SAATHI DEMO CREDENTIALS'));
  console.log('─'.repeat(60));

  console.log(BOLD('\n  ADMIN'));
  console.log(`  Email    : admin@saathi.dev`);
  console.log(`  Password : Admin@1234`);
  console.log(`  Access   : http://localhost:3000/admin`);

  console.log(BOLD('\n  TUTORS'));
  console.log(`  Email    : tutor1@saathi.dev   (Arjun Sharma — JS & React)`);
  console.log(`  Email    : tutor2@saathi.dev   (Priya Mehta  — Design)`);
  console.log(`  Password : Tutor@1234`);
  console.log(`  Access   : http://localhost:3000/tutor-dashboard`);

  console.log(BOLD('\n  STUDENTS'));
  console.log(`  Email    : student1@saathi.dev  (Rohan Verma  — enrolled in JS + React)`);
  console.log(`  Email    : student2@saathi.dev  (Ananya Singh — enrolled in Figma + UX)`);
  console.log(`  Password : Student@1234`);
  console.log(`  Access   : http://localhost:3000/dashboard`);

  console.log(BOLD('\n  COURSES CREATED'));
  createdCourses.forEach((c, i) => {
    console.log(`  ${(i + 1).toString().padStart(2)}. ${c.title.substring(0, 52).padEnd(52)} ${c.price === 0 ? G('FREE') : Y(`₹${c.price}`)}`);
  });

  console.log(`\n${'─'.repeat(60)}\n`);
  console.log(G('  Seed complete! Start both servers and test away.\n'));

  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error(R(`\nSeed failed: ${err.message}`));
  console.error(err.stack);
  process.exit(1);
});
