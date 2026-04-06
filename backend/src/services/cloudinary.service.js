const cloudinary = require('cloudinary').v2;
const AppError = require('../utils/AppError');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * uploadImage
 * Uploads a base64 or buffer image to Cloudinary.
 * Returns the secure URL and public_id.
 *
 * @param {string} fileBuffer  — Buffer from multer memoryStorage
 * @param {string} folder      — Cloudinary folder (e.g. 'avatars', 'thumbnails')
 * @param {Object} options     — Extra cloudinary options (width, height, etc.)
 */
const uploadImage = (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `saathi/${folder}`,
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(new AppError(`Cloudinary upload failed: ${error.message}`, 500));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * deleteImage
 * Removes an image from Cloudinary by its public_id.
 * Called when replacing an avatar or thumbnail.
 */
const deleteImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

/**
 * extractPublicId
 * Pulls the public_id from a Cloudinary URL.
 * e.g. "https://res.cloudinary.com/demo/image/upload/v1/saathi/avatars/abc123"
 *      → "saathi/avatars/abc123"
 */
const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  // Skip the version segment (v1234567) if present
  const afterUpload = parts.slice(uploadIndex + 1);
  if (/^v\d+$/.test(afterUpload[0])) afterUpload.shift();
  // Remove file extension
  const withoutExt = afterUpload.join('/').replace(/\.[^/.]+$/, '');
  return withoutExt;
};

module.exports = { uploadImage, deleteImage, extractPublicId };
