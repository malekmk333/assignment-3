// routes/assignmentRoutes.js
const express = require('express');
const Assignment = require('../models/Assignment');

const router = express.Router();

// simple auth guard
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// READ: list all assignments for logged in user
router.get('/', requireLogin, async (req, res) => {
  const assignments = await Assignment.find({ user: req.session.user.id }).sort({ dueDate: 1 });
  res.render('assignments', { assignments });
});

// CREATE: show form
router.get('/new', requireLogin, (req, res) => {
  res.render('new-assignment');
});

// CREATE: handle form submit
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

// UPDATE: show edit form
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

// UPDATE: handle edit submit
router.post('/:id', requireLogin, async (req, res) => {
  const { title, course, dueDate, status } = req.body;

  await Assignment.updateOne(
    { _id: req.params.id, user: req.session.user.id },
    { title, course, dueDate, status }
  );

  res.redirect('/assignments');
});

// DELETE: confirm delete page
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

// DELETE: handle delete
router.post('/:id/delete', requireLogin, async (req, res) => {
  await Assignment.deleteOne({
    _id: req.params.id,
    user: req.session.user.id
  });

  res.redirect('/assignments');
});

module.exports = router;
