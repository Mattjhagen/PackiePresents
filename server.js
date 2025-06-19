const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./auth'); // 👈 Google OAuth config

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

// Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('✅ Google user info:', req.user);
    res.redirect('/signup.html');
  }
);

// Test Route
app.get('/', (req, res) => {
  res.send('Resume Parser API with Google Auth is live!');
});

// Signup Handler
const signupHandler = require('./signupHandler');
signupHandler(app);

// Resume Parser Route
app.post('/parse-resume', async (req, res) => {
  try {
    const resumeText = req.body.resumeText;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume formatter. Format the given resume into a clean, professional personal website.'
          },
          {
            role: 'user',
            content: resumeText
          }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const formatted = response.data.choices[0].message.content;
    res.send({ html: formatted });

  } catch (error) {
    console.error('Error parsing resume:', error.message);
    res.status(500).send('Failed to parse resume');
  }
});

// OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/signup.html'); // Redirect to signup after login
  }
);

// Signup route
const signupRoute = require('./signupHandler');
signupRoute(app);

// Add Dashboard
const dashboardRoutes = require('./dashboardRoutes');
dashboardRoutes(app);

const authSignup = require('./authSignup');
authSignup(app);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
