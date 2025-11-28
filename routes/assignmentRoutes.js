// routes/assignmentRoutes.js
const express = require('express');
const Assignment = require('../models/Assignment');

const router = express.Router();

// Auth guard for write operations
function requireLogin(req, res, next) {
  // support both your manual session and passport
  const loggedIn =
    (req.session && req.session.user) ||
    (req.isAuthenticated && req.isAuthenticated());

  if (!loggedIn) {
    return res.redirect('/login');
  }

  next();
}

// READ: list assignments
// - If logged in: show only this user's assignments
// - If NOT logged in: show all assignments (view-only mode)
router.get('/', async (req, res) => {
  let assignments;

  if (req.session && req.session.user) {
    assignments = await Assignment.find({
      user: req.session.user.id
    }).sort({ dueDate: 1 });
  } else {
    assignments = await Assignment.find().sort({ dueDate: 1 });
  }

  res.render('assignments', { assignments });
});

// CREATE: show form (authenticated only)
router.get('/new', requireLogin, (req, res) => {
  res.render('new-assignment');
});

// CREATE: handle form submit (authenticated only)
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

// UPDATE: show edit form (authenticated only)
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

// UPDATE: handle edit submit (authenticated only)
router.post('/:id', requireLogin, async (req, res) => {
  const { title, course, dueDate, status } = req.body;

  await Assignment.updateOne(
    { _id: req.params.id, user: req.session.user.id },
    { title, course, dueDate, status }
  );

  res.redirect('/assignments');
});

// DELETE: confirm delete page (authenticated only)
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

// DELETE: handle delete (authenticated only)
router.post('/:id/delete', requireLogin, async (req, res) => {
  await Assignment.deleteOne({
    _id: req.params.id,
    user: req.session.user.id
  });

  res.redirect('/assignments');
});

module.exports = router;
