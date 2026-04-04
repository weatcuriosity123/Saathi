const multer = require('multer');
const AppError = require('../utils/AppError');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

/**
 * imageUpload
 * Multer instance that:
 *  - Stores files in memory (buffer) — we stream directly to Cloudinary
 *  - Rejects non-image files
 *  - Rejects files over 5 MB
 */
const imageUpload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new AppError('Only JPEG, PNG, and WebP images are allowed', 400), false);
    }
    cb(null, true);
  },

  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024,
  },
});

module.exports = { imageUpload };
