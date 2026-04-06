/**
 * Vimeo Service — wraps all Vimeo API interactions.
 *
 * Architecture:
 *   - Videos stored under the PLATFORM's Vimeo account (not individual tutors).
 *   - Tutors upload directly from browser via TUS protocol (browser → Vimeo).
 *   - This server only creates upload slots and manages metadata.
 *   - Vimeo fires webhooks when transcoding is complete.
 *
 * Vimeo plan required: Business ($50/mo) for signed embed tokens + domain whitelist.
 * Basic/Plus plans: createUploadSlot and deleteVideo will work; embed tokens won't.
 */

const { Vimeo } = require('vimeo');
const AppError = require('../utils/AppError');

const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID     || null,
  process.env.VIMEO_CLIENT_SECRET || null,
  process.env.VIMEO_ACCESS_TOKEN
);

// ── Helper: promisify the callback-based Vimeo SDK ────────────────────────────
const vimeoRequest = (opts) =>
  new Promise((resolve, reject) => {
    client.request(opts, (error, body, statusCode) => {
      if (error) return reject(new AppError(`Vimeo API error: ${error.message}`, 502));
      if (statusCode >= 400) return reject(new AppError(`Vimeo API error: ${JSON.stringify(body)}`, 502));
      resolve(body);
    });
  });

// ── Service Methods ───────────────────────────────────────────────────────────

/**
 * ping
 * Verifies the access token is valid.
 * Returns the authenticated Vimeo account info.
 */
const ping = async () => {
  const body = await vimeoRequest({ method: 'GET', path: '/me', query: { fields: 'name,uri,account' } });
  return { name: body.name, uri: body.uri, plan: body.account };
};

/**
 * createUploadSlot
 * Creates a TUS upload slot on Vimeo.
 * Returns vimeoId + uploadUrl — browser uploads directly to uploadUrl.
 */
const createUploadSlot = async ({ title, description, fileSize }) => {
  const body = await vimeoRequest({
    method: 'POST',
    path: '/me/videos',
    query: { fields: 'uri,upload' },
    body: {
      upload: { approach: 'tus', size: fileSize },
      name: title,
      description: description || '',
      privacy: { view: 'disable', embed: 'whitelist' },
    },
  });

  const vimeoId = body.uri.split('/').pop();
  return { vimeoId, uploadUrl: body.upload.upload_link };
};

/**
 * setVideoDomainPrivacy
 * Restricts video playback to your domain only.
 * Requires Vimeo Business plan.
 */
const setVideoDomainPrivacy = async (vimeoId, domain) => {
  try {
    await vimeoRequest({
      method: 'PUT',
      path: `/videos/${vimeoId}/privacy/domains/${domain}`,
    });
  } catch (err) {
    // Domain privacy requires Business plan — warn but don't break the flow
    console.warn(`[Vimeo] setVideoDomainPrivacy failed (Business plan required?): ${err.message}`);
  }
};

/**
 * getVideoMetadata
 * Fetches current status and duration from Vimeo.
 */
const getVideoMetadata = async (vimeoId) => {
  const body = await vimeoRequest({
    method: 'GET',
    path: `/videos/${vimeoId}`,
    query: { fields: 'status,duration' },
  });
  return { status: body.status, duration: body.duration || 0 };
};

/**
 * deleteVideo
 * Permanently deletes a video from Vimeo.
 */
const deleteVideo = async (vimeoId) => {
  if (!vimeoId || vimeoId.startsWith('placeholder')) return;
  await vimeoRequest({ method: 'DELETE', path: `/videos/${vimeoId}` });
};

/**
 * generateEmbedToken
 * Generates a signed embed token (Vimeo Business plan).
 * Falls back to returning vimeoId so player still works on public privacy setting.
 */
const generateEmbedToken = async (vimeoId) => {
  try {
    const body = await vimeoRequest({
      method: 'POST',
      path: `/videos/${vimeoId}/tokens`,
      body: { scope: 'video:read' },
    });
    return body.token;
  } catch (err) {
    // Business plan required for tokens — fall back gracefully
    console.warn(`[Vimeo] generateEmbedToken failed (Business plan required?): ${err.message}`);
    return null;
  }
};

module.exports = {
  ping,
  createUploadSlot,
  setVideoDomainPrivacy,
  getVideoMetadata,
  deleteVideo,
  generateEmbedToken,
};
