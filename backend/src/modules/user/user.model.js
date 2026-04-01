const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = Object.freeze({
  STUDENT: 'student',
  TUTOR: 'tutor',
  ADMIN: 'admin',
});

/**
 * Tutor-specific profile data — embedded in User to avoid a join on every auth check.
 * Only populated when role === 'tutor'.
 */
const tutorProfileSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    expertise: [{ type: String, trim: true }],
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    verificationNote: String, // Admin rejection reason
    isApproved: { type: Boolean, default: false },
    totalEarnings: { type: Number, default: 0 },   // lifetime INR
    pendingPayout: { type: Number, default: 0 },   // unpaid balance INR
  },
  { _id: false } // no separate _id for embedded doc
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,  // always stored as lowercase
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STUDENT,
    },

    // ── Account State ──────────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true, // soft delete: set to false instead of deleting
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    /**
     * accountVersion: incremented on password change or forced logout.
     * JWT payload carries this value — middleware rejects tokens with stale version.
     * This makes token invalidation stateless (no token blacklist DB needed).
     */
    accountVersion: {
      type: Number,
      default: 1,
      select: false, // internal field, not returned to client
    },

    // ── Profile ────────────────────────────────────────────────────────────
    avatar: {
      type: String,
      default: null, // Cloudinary URL
    },

    // ── Tutor-specific ────────────────────────────────────────────────────
    tutorProfile: {
      type: tutorProfileSchema,
      default: null,
    },

    // ── Soft delete ────────────────────────────────────────────────────────
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.accountVersion;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// email index is created automatically from unique: true above
userSchema.index({ role: 1 });
userSchema.index({ 'tutorProfile.verificationStatus': 1 });

// ── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Hash password before save.
 * Only runs when password field is modified (not on every save).
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance Methods ─────────────────────────────────────────────────────────

/**
 * comparePassword — use this instead of calling bcrypt directly.
 * Requires the user to be fetched with .select('+password').
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * incrementAccountVersion — call after password change or forced logout.
 * Invalidates all existing JWTs for this user instantly.
 */
userSchema.methods.incrementAccountVersion = async function () {
  this.accountVersion += 1;
  await this.save({ validateBeforeSave: false });
};

/**
 * toSafeObject — returns user data safe to send to the client.
 * Excludes all sensitive fields.
 */
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    isEmailVerified: this.isEmailVerified,
    tutorProfile: this.tutorProfile,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
module.exports.ROLES = ROLES;
