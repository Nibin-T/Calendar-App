// routes/events.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Event = require('../models/event');
const moment = require('moment');

// Create Event Page
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('createEvent');
});

// Create Event (POST)
router.post('/create', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const newEvent = new Event({
      title,
      description,
      date: moment(date).toDate(),
      user: req.user.id,
    });
    await newEvent.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Edit Event Page
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.user.toString() !== req.user.id) {
      return res.status(404).send('Event not found');
    }
    res.render('editEvent', { event });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Edit Event (POST)
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.user.toString() !== req.user.id) {
      return res.status(404).send('Event not found');
    }
    const { title, description, date } = req.body;
    event.title = title;
    event.description = description;
    event.date = moment(date).toDate();
    await event.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;