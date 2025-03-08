// routes/index.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Event = require('../models/event');
const moment = require('moment');

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    let selectedMonth = req.query.month || '';
    let query = { user: req.user.id };

    if (selectedMonth) {
      const startOfMonth = moment(selectedMonth, 'YYYY-MM').startOf('month').toDate();
      const endOfMonth = moment(selectedMonth, 'YYYY-MM').endOf('month').toDate();
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const events = await Event.find(query).sort({ date: 1 });

    res.render('calendar', { events, selectedMonth, moment });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;