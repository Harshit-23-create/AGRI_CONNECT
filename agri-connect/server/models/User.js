const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      default: 'Farmer User'
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    serviceProvider: {
      type: String,
      required: [true, 'Service provider field is required'],
      enum: ['Yes', 'No'],
      default: 'No',
    },
    language: {
      type: String,
      required: [true, 'Language selection is required'],
      default: 'en',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Hash password before saving if present
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
