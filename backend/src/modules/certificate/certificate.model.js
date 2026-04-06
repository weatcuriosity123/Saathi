const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * Certificate stores proof of course completion.
 * certificateId: human-readable unique ID printed on the PDF (e.g. SAATHI-A1B2C3D4)
 * pdfUrl: Cloudinary URL of the generated PDF
 */
const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    // Unique verifiable ID printed on the certificate
    certificateId: {
      type: String,
      unique: true,
    },

    // Cloudinary URL of the generated PDF
    pdfUrl: {
      type: String,
      default: null,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// One certificate per student per course
// Note: certificateId index is created automatically via unique:true in field def
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Auto-generate certificateId before first save
certificateSchema.pre('save', function (next) {
  if (!this.certificateId) {
    const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
    this.certificateId = `SAATHI-${suffix}`;
  }
  next();
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
