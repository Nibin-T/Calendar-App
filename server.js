// server.js
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path'); // Import path module

dotenv.config();

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
});

// Passport Config
require('./config/passport')(passport);

// Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public'))); // Use path.join

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // specify views directory

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/events', require('./routes/events'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));