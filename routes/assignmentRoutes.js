// routes/assignmentRoutes.js
const express = require('express');
const Assignment = require('../models/Assignment');

const router = express.Router();

// Auth guard for write operations
function requireLogin(req, res, next) {
  // Works for BOTH passport OAuth + manual session login
  const loggedIn =
    (req.session && req.session.user) ||
    (req.isAuthenticated && req.isAuthenticated());

  if (!loggedIn) {
    return res.redirect('/login');
  }

  next();
}

// READ — Everyone can view
// Logged in  → show ONLY their assignments
// Logged out → show ALL assignments (read-only)
router.get('/', async (req, res) => {
  let assignments = [];

  if (req.session && req.session.user) {
    // User logged in → show THEIR assignments only
    assignments = await Assignment.find({
      user: req.session.user.id
    }).sort({ dueDate: 1 });
  } else {
    // Not logged in → show ALL assignments
    assignments = await Assignment.find().sort({ dueDate: 1 });
  }

  res.render('assignments', { assignments });
});

// CREATE — Show form (authenticated only)
router.get('/new', requireLogin, (req, res) => {
  res.render('new-assignment');
});

// CREATE — Submit form 
router.post('/', requireLogin, async (req, res) => {
  const { title, course, dueDate, status } = req.body;

  await Assignment.create({
    title,
    course,
    dueDate,
    status,
    user: req.session.user.id
  });

  res.redirect('/assignments');
});

// UPDATE — Show edit form
router.get('/:id/edit', requireLogin, async (req, res) => {
  const assignment = await Assignment.findOne({
    _id: req.params.id,
    user: req.session.user.id
  });

  if (!assignment) {
    return res.redirect('/assignments');
  }

  res.render('edit-assignment', { assignment });
});

// UPDATE — Submit changes
router.post('/:id', requireLogin, async (req, res) => {
  const { title, course, dueDate, status } = req.body;

  await Assignment.updateOne(
    { _id: req.params.id, user: req.session.user.id },
    { title, course, dueDate, status }
  );

  res.redirect('/assignments');
});

// DELETE — Confirm delete page
router.get('/:id/delete', requireLogin, async (req, res) => {
  const assignment = await Assignment.findOne({
    _id: req.params.id,
    user: req.session.user.id
  });

  if (!assignment) {
    return res.redirect('/assignments');
  }

  res.render('delete-confirm', { assignment });
});

// DELETE — Perform delete
router.post('/:id/delete', requireLogin, async (req, res) => {
  await Assignment.deleteOne({
    _id: req.params.id,
    user: req.session.user.id
  });

  res.redirect('/assignments');
});

module.exports = router;
