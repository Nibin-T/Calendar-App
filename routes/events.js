// routes/events.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Event = require('../models/event');
const moment = require('moment');

router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      user: req.user.id,
    });
    await newEvent.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.render('editEvent', { event });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/month/:year/:month', ensureAuthenticated, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month) - 1; // Months are 0-indexed

    const firstDayOfMonth = moment([year, month, 1]);
    const lastDayOfMonth = moment(firstDayOfMonth).endOf('month');

    const events = await Event.find({
      user: req.user.id,
      startDate: {
        $gte: firstDayOfMonth.clone().startOf('day').toDate(),
        $lte: lastDayOfMonth.clone().endOf('day').toDate(),
      },
    });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;