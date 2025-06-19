const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: 'pacmac_secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('✅ Google user:', req.user);
    res.redirect('/signup.html');
  }
);

app.get('/', (req, res) => {
  res.send('Resume Parser API with Google Auth is live!');
});

const signupHandler = require('./signupHandler');
signupHandler(app);

const resumeParser = require('./resumeParser');
app.use('/', resumeParser);

const dashboardRoutes = require('./dashboardRoutes');
dashboardRoutes(app);

const authSignup = require('./authSignup');
authSignup(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
