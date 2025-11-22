// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle register form
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
    // very simple error handling, reload page
    res.redirect('/register');
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.redirect('/login');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.redirect('/login');
    }

    // save user in session
    req.session.user = { id: user._id, username: user.username };
    res.redirect('/assignments');
  } catch (err) {
    console.error('Login error:', err.message);
    res.redirect('/login');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
