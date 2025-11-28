// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Local auth
  username: { type: String, unique: true },
  passwordHash: { type: String }, // may be empty for OAuth-only users

  // OAuth fields
  googleId: { type: String },
  githubId: { type: String },

  displayName: { type: String },
  email: { type: String }
});

module.exports = mongoose.model('User', userSchema);
