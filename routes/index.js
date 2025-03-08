// routes/index.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Event = require('../models/event');
const moment = require('moment');

router.get('/', ensureAuthenticated, async (req, res) => {
  const currentDate = moment();
  const year = currentDate.year();
  const month = currentDate.month();

  const firstDayOfMonth = moment([year, month, 1]);
  const lastDayOfMonth = moment(firstDayOfMonth).endOf('month');

  const daysInMonth = lastDayOfMonth.date();
  const firstDayOfWeek = firstDayOfMonth.day();

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ date: '', events: [] });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = moment([year, month, i]);
    const events = await Event.find({
      user: req.user.id,
      startDate: {
        $gte: date.clone().startOf('day').toDate(),
        $lte: date.clone().endOf('day').toDate(),
      },
    });
    days.push({ date: i, events: events });
  }
  //Added this line to send the month name.
  res.render('calendar', { days, currentMonth: moment.months(month), currentYear: year });
});

module.exports = router;