const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true, // transform to lowercase
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minLength: [8, 'A password must be at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // On FindAndUpdate, we need to pass in runValidators: true
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Only when the password is update
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined; 
        next();
    } catch (err) {
        console.log(err);
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
    
});

// Instance methods
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  // return true or false
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfterJWT = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000), 10);
    // console.log(changedTimestamp, JWTTimestamp);
    return changedTimestamp > JWTTimestamp;
  }
  return false;
}

userSchema.methods.createPasswordResetToken = function () {
  // Create a random string (this will be sent to the user)
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Encrypt the generated random string above and store them to our DB
  this.passwordResetToken = crypto
    .createHash('sha256') //algorithm
    .update(resetToken) 
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // return the unencrypted version 
  return resetToken;
};


// Create and export an instance of the Tour Class
const User = mongoose.model('User', userSchema); // model-name, schema-name
module.exports = User;
