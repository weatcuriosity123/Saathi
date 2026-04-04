const nodemailer = require('nodemailer');

/**
 * createTransporter
 * Returns a nodemailer transporter.
 * In development: uses Ethereal (fake SMTP — emails are captured in a test inbox).
 * In production: uses SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS from env.
 */
const createTransporter = async () => {
  if (process.env.NODE_ENV !== 'production') {
    // Ethereal: https://ethereal.email — view sent emails in browser during dev
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const FROM = `"Saathi" <${process.env.EMAIL_FROM || 'noreply@saathi.in'}>`;

// ── Email Templates ───────────────────────────────────────────────────────────

const templates = {
  welcome: (name) => ({
    subject: 'Welcome to Saathi!',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#7c3aed">Welcome to Saathi, ${name}!</h2>
        <p>We're thrilled to have you. Start exploring affordable courses and level up your skills.</p>
        <a href="${process.env.CLIENT_URL}" style="background:#7c3aed;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px">
          Browse Courses
        </a>
        <p style="margin-top:24px;color:#888;font-size:13px">The Saathi Team</p>
      </div>
    `,
  }),

  enrollmentConfirm: (name, courseTitle, courseSlug) => ({
    subject: `You're enrolled in "${courseTitle}"`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#7c3aed">Enrollment Confirmed!</h2>
        <p>Hi ${name}, you're now enrolled in <strong>${courseTitle}</strong>.</p>
        <a href="${process.env.CLIENT_URL}/courses/${courseSlug}" style="background:#7c3aed;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px">
          Start Learning
        </a>
        <p style="margin-top:24px;color:#888;font-size:13px">Happy learning!<br>The Saathi Team</p>
      </div>
    `,
  }),

  courseApproved: (tutorName, courseTitle) => ({
    subject: `Your course "${courseTitle}" is now live!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#7c3aed">Course Published!</h2>
        <p>Hi ${tutorName}, your course <strong>${courseTitle}</strong> has been reviewed and is now live on Saathi.</p>
        <p>Students can start enrolling right away.</p>
        <p style="margin-top:24px;color:#888;font-size:13px">The Saathi Team</p>
      </div>
    `,
  }),

  courseRejected: (tutorName, courseTitle, note) => ({
    subject: `Action needed on your course "${courseTitle}"`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#dc2626">Course Needs Revision</h2>
        <p>Hi ${tutorName}, your course <strong>${courseTitle}</strong> needs some changes before it can be published.</p>
        <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px;margin:16px 0;border-radius:4px">
          <strong>Reviewer note:</strong><br>${note}
        </div>
        <p>Please update your course and resubmit for review.</p>
        <p style="margin-top:24px;color:#888;font-size:13px">The Saathi Team</p>
      </div>
    `,
  }),

  tutorApproved: (name) => ({
    subject: 'Your tutor application is approved!',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#7c3aed">Welcome, Instructor!</h2>
        <p>Hi ${name}, your tutor application has been approved. You can now create and publish courses on Saathi.</p>
        <a href="${process.env.CLIENT_URL}/dashboard/tutor" style="background:#7c3aed;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px">
          Create Your First Course
        </a>
        <p style="margin-top:24px;color:#888;font-size:13px">The Saathi Team</p>
      </div>
    `,
  }),

  certificateIssued: (name, courseTitle, certificateId, pdfUrl) => ({
    subject: `Your certificate for "${courseTitle}" is ready!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#7c3aed">Congratulations, ${name}!</h2>
        <p>You've completed <strong>${courseTitle}</strong>. Your certificate is ready.</p>
        <p style="color:#555;font-size:13px">Certificate ID: <code>${certificateId}</code></p>
        ${pdfUrl ? `<a href="${pdfUrl}" style="background:#7c3aed;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px">Download Certificate</a>` : ''}
        <p style="margin-top:24px;color:#888;font-size:13px">Keep learning!<br>The Saathi Team</p>
      </div>
    `,
  }),
};

// ── Send Helper ───────────────────────────────────────────────────────────────

/**
 * sendEmail
 * Low-level send. Don't call directly from controllers — use the named helpers below.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({ from: FROM, to, subject, html });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Email] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    // Email failures should never break the main flow — log and continue
    console.error('[Email] Failed to send:', err.message);
  }
};

// ── Named Senders ─────────────────────────────────────────────────────────────

const sendWelcomeEmail = (email, name) => {
  const t = templates.welcome(name);
  return sendEmail({ to: email, ...t });
};

const sendEnrollmentConfirm = (email, name, courseTitle, courseSlug) => {
  const t = templates.enrollmentConfirm(name, courseTitle, courseSlug);
  return sendEmail({ to: email, ...t });
};

const sendCourseApproved = (email, tutorName, courseTitle) => {
  const t = templates.courseApproved(tutorName, courseTitle);
  return sendEmail({ to: email, ...t });
};

const sendCourseRejected = (email, tutorName, courseTitle, note) => {
  const t = templates.courseRejected(tutorName, courseTitle, note);
  return sendEmail({ to: email, ...t });
};

const sendTutorApproved = (email, name) => {
  const t = templates.tutorApproved(name);
  return sendEmail({ to: email, ...t });
};

const sendCertificateIssued = (email, name, courseTitle, certificateId, pdfUrl) => {
  const t = templates.certificateIssued(name, courseTitle, certificateId, pdfUrl);
  return sendEmail({ to: email, ...t });
};

module.exports = {
  sendWelcomeEmail,
  sendEnrollmentConfirm,
  sendCourseApproved,
  sendCourseRejected,
  sendTutorApproved,
  sendCertificateIssued,
};
