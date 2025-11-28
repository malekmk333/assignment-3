// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const connectDB = require('./config/db');

// NEW: load passport config (sets up strategies)
const passport = require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
app.set('trust proxy', 1);

// connect to MongoDB
connectDB();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// body parser
app.use(express.urlencoded({ extended: true }));

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// make user available in EJS
app.use((req, res, next) => {
  // prefer passport user, fallback to your manual session
  res.locals.currentUser = req.user || req.session.user;
  next();
});

// routes
app.use('/', authRoutes);
app.use('/assignments', assignmentRoutes);

// home page
app.get('/', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
