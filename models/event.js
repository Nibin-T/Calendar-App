// models/event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  user: { // Link to the user who created the event
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { // Add a timestamp for when the event was created
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', EventSchema);