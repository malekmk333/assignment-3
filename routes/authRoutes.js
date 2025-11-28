// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// Register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle register form (local username/password)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ username, passwordHash });
    await user.save();

    // after register, send them to login
    res.redirect('/login');
  } catch (err) {
    console.error('Register error:', err.message);
    res.redirect('/register');
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login (local username/password)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.redirect('/login');
    }

    const match = await bcrypt.compare(password, user.passwordHash || '');
    if (!match) {
      return res.redirect('/login');
    }

    // save user in your session object
    req.session.user = { id: user._id, username: user.username };
    res.redirect('/assignments');
  } catch (err) {
    console.error('Login error:', err.message);
    res.redirect('/login');
  }
});

// ---------- Google OAuth ----------

// Start Google login
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // map passport user into same session.user structure
    req.session.user = {
      id: req.user._id,
      username: req.user.username || req.user.displayName
    };
    res.redirect('/assignments');
  }
);

// ---------- GitHub OAuth ----------

// Start GitHub login
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub callback
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = {
      id: req.user._id,
      username: req.user.username || req.user.displayName
    };
    res.redirect('/assignments');
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  // logout passport
  req.logout(err => {
    if (err) return next(err);
    // destroy express-session
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

module.exports = router;
