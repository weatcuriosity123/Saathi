/**
 * Vimeo Service — wraps all Vimeo API interactions.
 *
 * Architecture:
 *   - Videos are stored under the PLATFORM's Vimeo account (not individual tutors).
 *   - Tutors upload directly from the browser via TUS protocol (browser → Vimeo).
 *   - This server only creates upload slots and manages metadata.
 *   - Vimeo fires webhooks to notify us when transcoding is complete.
 *
 * To activate: install the Vimeo Node SDK and replace placeholder functions.
 *   npm install vimeo
 *
 * Vimeo plan required: Business ($50/month) for signed embed tokens + domain whitelist.
 */

// const { Vimeo } = require('vimeo');
// const client = new Vimeo(
//   process.env.VIMEO_CLIENT_ID,
//   process.env.VIMEO_CLIENT_SECRET,
//   process.env.VIMEO_ACCESS_TOKEN
// );

const AppError = require('../utils/AppError');

/**
 * createUploadSlot
 * Calls Vimeo to create an upload slot and returns the TUS upload URL.
 * The browser uses this URL to upload the video file directly to Vimeo.
 *
 * @param {object} options
 * @param {string} options.title       - Video title (shown in Vimeo dashboard)
 * @param {string} options.description - Video description
 * @param {number} options.fileSize    - File size in bytes (required by Vimeo TUS)
 * @returns {{ vimeoId: string, uploadUrl: string }}
 */
const createUploadSlot = async ({ title, description, fileSize }) => {
  // ── PLACEHOLDER ────────────────────────────────────────────────────────────
  // Replace this block with real Vimeo API call when credentials are ready:
  //
  // return new Promise((resolve, reject) => {
  //   client.request(
  //     {
  //       method: 'POST',
  //       path: '/me/videos',
  //       query: { fields: 'uri,upload' },
  //       body: {
  //         upload: { approach: 'tus', size: fileSize },
  //         name: title,
  //         description,
  //         privacy: { view: 'disable', embed: 'whitelist' },
  //       },
  //     },
  //     (error, body) => {
  //       if (error) return reject(new AppError('Vimeo upload slot creation failed', 502));
  //       const vimeoId = body.uri.split('/').pop();
  //       resolve({ vimeoId, uploadUrl: body.upload.upload_link });
  //     }
  //   );
  // });

  console.warn('[Vimeo] PLACEHOLDER: createUploadSlot called. Configure Vimeo credentials.');
  return {
    vimeoId: `placeholder_${Date.now()}`,
    uploadUrl: 'https://vimeo.com/placeholder-tus-upload-url',
  };
};

/**
 * setVideoDomainPrivacy
 * Restricts video playback to your domain only.
 * Call this after the upload slot is created.
 *
 * @param {string} vimeoId
 * @param {string} domain - e.g. 'saathi.in'
 */
const setVideoDomainPrivacy = async (vimeoId, domain) => {
  // ── PLACEHOLDER ─────────────────────────────────────────────────────────
  // client.request({ method: 'PUT', path: `/videos/${vimeoId}/privacy/domains/${domain}` }, cb);
  console.warn(`[Vimeo] PLACEHOLDER: setVideoDomainPrivacy for video ${vimeoId}`);
};

/**
 * getVideoMetadata
 * Fetches current status and duration from Vimeo.
 * Used for polling when webhook is delayed.
 *
 * @param {string} vimeoId
 * @returns {{ status: string, duration: number }}
 */
const getVideoMetadata = async (vimeoId) => {
  // ── PLACEHOLDER ─────────────────────────────────────────────────────────
  // return new Promise((resolve, reject) => {
  //   client.request(
  //     { method: 'GET', path: `/videos/${vimeoId}`, query: { fields: 'status,duration' } },
  //     (error, body) => {
  //       if (error) return reject(new AppError('Vimeo metadata fetch failed', 502));
  //       resolve({ status: body.status, duration: body.duration });
  //     }
  //   );
  // });
  console.warn(`[Vimeo] PLACEHOLDER: getVideoMetadata for video ${vimeoId}`);
  return { status: 'available', duration: 0 };
};

/**
 * deleteVideo
 * Permanently deletes a video from Vimeo.
 * Called when a module or course is removed.
 *
 * @param {string} vimeoId
 */
const deleteVideo = async (vimeoId) => {
  // ── PLACEHOLDER ─────────────────────────────────────────────────────────
  // client.request({ method: 'DELETE', path: `/videos/${vimeoId}` }, cb);
  console.warn(`[Vimeo] PLACEHOLDER: deleteVideo ${vimeoId}`);
};

/**
 * generateEmbedToken
 * Generates a signed embed token (Vimeo Business plan feature).
 * Token expires in 2 hours — prevents URL sharing.
 *
 * @param {string} vimeoId
 * @returns {string} signed token
 */
const generateEmbedToken = async (vimeoId) => {
  // ── PLACEHOLDER ─────────────────────────────────────────────────────────
  // Vimeo Business: POST /videos/{vimeo_id}/tokens
  // Returns a time-limited token the frontend passes to the player
  console.warn(`[Vimeo] PLACEHOLDER: generateEmbedToken for video ${vimeoId}`);
  return `placeholder_embed_token_${vimeoId}_${Date.now()}`;
};

module.exports = {
  createUploadSlot,
  setVideoDomainPrivacy,
  getVideoMetadata,
  deleteVideo,
  generateEmbedToken,
};
