const { Worker } = require('bullmq');
const PDFDocument = require('pdfkit');
const { getRedisConnection } = require('../config/redis');
const { CERTIFICATE_QUEUE, getQueue } = require('../queues/certificate.queue');
const Certificate = require('../modules/certificate/certificate.model');
const User = require('../modules/user/user.model');
const Course = require('../modules/course/course.model');
const { sendCertificateIssued } = require('../services/email.service');

/**
 * generateCertificatePDF
 * Creates a simple PDF certificate in memory (no temp files).
 * Returns a Buffer ready to upload to Cloudinary.
 */
const generateCertificatePDF = ({ studentName, courseTitle, tutorName, certificateId, issuedAt }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 60 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const dateStr = new Date(issuedAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // ── Certificate layout ──────────────────────────────────────────────────
    doc
      .rect(0, 0, doc.page.width, doc.page.height)
      .fill('#f9f5ff');

    doc
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .stroke('#7c3aed');

    doc
      .fillColor('#7c3aed')
      .fontSize(36)
      .font('Helvetica-Bold')
      .text('SAATHI', { align: 'center' })
      .moveDown(0.3);

    doc
      .fillColor('#555')
      .fontSize(14)
      .font('Helvetica')
      .text('Certificate of Completion', { align: 'center' })
      .moveDown(1.5);

    doc
      .fillColor('#111')
      .fontSize(18)
      .text('This is to certify that', { align: 'center' })
      .moveDown(0.5);

    doc
      .fillColor('#7c3aed')
      .fontSize(30)
      .font('Helvetica-Bold')
      .text(studentName, { align: 'center' })
      .moveDown(0.5);

    doc
      .fillColor('#111')
      .fontSize(18)
      .font('Helvetica')
      .text('has successfully completed the course', { align: 'center' })
      .moveDown(0.5);

    doc
      .fillColor('#1e1e2f')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text(courseTitle, { align: 'center' })
      .moveDown(0.5);

    doc
      .fillColor('#555')
      .fontSize(14)
      .font('Helvetica')
      .text(`Instructor: ${tutorName}`, { align: 'center' })
      .moveDown(2);

    doc
      .fillColor('#888')
      .fontSize(11)
      .text(`Issued on: ${dateStr}     Certificate ID: ${certificateId}`, { align: 'center' });

    doc.end();
  });
};

/**
 * Certificate Worker
 * Picks up jobs from the certificate queue and:
 * 1. Creates the Certificate record (idempotent — skips if already exists)
 * 2. Generates a PDF in memory
 * 3. Uploads to Cloudinary
 * 4. Saves the PDF URL back to the Certificate record
 */
const startCertificateWorker = () => {
  const worker = new Worker(
    CERTIFICATE_QUEUE,
    async (job) => {
      const { userId, courseId } = job.data;

      // Idempotency: skip if certificate already issued
      const existing = await Certificate.findOne({ userId, courseId });
      if (existing?.pdfUrl) {
        console.log(`[CertWorker] Certificate already exists for ${userId}/${courseId} — skipping`);
        return;
      }

      const [user, course] = await Promise.all([
        User.findById(userId).select('name'),
        Course.findById(courseId).select('title tutorId').populate('tutorId', 'name'),
      ]);

      if (!user || !course) {
        throw new Error(`User or course not found: ${userId} / ${courseId}`);
      }

      // Upsert certificate record to get the certificateId
      let certificate = existing || new Certificate({ userId, courseId, issuedAt: new Date() });
      if (!certificate.certificateId) {
        await certificate.save(); // triggers pre-save hook to generate certificateId
      }

      const pdfBuffer = await generateCertificatePDF({
        studentName: user.name,
        courseTitle: course.title,
        tutorName: course.tutorId?.name || 'Saathi Instructor',
        certificateId: certificate.certificateId,
        issuedAt: certificate.issuedAt,
      });

      // Upload PDF as raw file to Cloudinary
      const { url } = await new Promise((resolve, reject) => {
        const cloudinary = require('cloudinary').v2;
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'saathi/certificates',
            resource_type: 'raw',
            public_id: certificate.certificateId,
            format: 'pdf',
          },
          (err, result) => {
            if (err) return reject(err);
            resolve({ url: result.secure_url });
          }
        );
        uploadStream.end(pdfBuffer);
      });

      certificate.pdfUrl = url;
      await certificate.save();

      sendCertificateIssued(user.email, user.name, course.title, certificate.certificateId, url);
      console.log(`[CertWorker] Certificate issued: ${certificate.certificateId}`);
    },
    {
      connection: getRedisConnection(),
      concurrency: 3,
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`[CertWorker] Job ${job.id} failed:`, err.message);
  });

  return worker;
};

module.exports = { startCertificateWorker };
