const { Queue } = require('bullmq');
const { getRedisConnection } = require('../config/redis');

const CERTIFICATE_QUEUE = 'certificate-generation';

let certificateQueue = null;

const getQueue = () => {
  if (certificateQueue) return certificateQueue;
  certificateQueue = new Queue(CERTIFICATE_QUEUE, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 200 },
    },
  });
  return certificateQueue;
};

/**
 * addCertificateJob
 * Safe to call even if Redis is down — logs a warning and continues.
 */
const addCertificateJob = async (userId, courseId) => {
  try {
    const queue = getQueue();
    await queue.add(
      'generate',
      { userId: userId.toString(), courseId: courseId.toString() },
      { jobId: `cert-${userId}-${courseId}` }
    );
  } catch (err) {
    console.warn('[CertQueue] Could not enqueue certificate job (Redis unavailable):', err.message);
  }
};

module.exports = { getQueue, addCertificateJob, CERTIFICATE_QUEUE };
