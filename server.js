const express = require('express');
const axios = require('axios');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const { saveUserDomain } = require('./saveDomain');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

require('./auth');

// Home route
app.get('/', (req, res) => {
  res.send('🧠 Resume Parser API is live!');
});

// Resume parser route
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
            content: 'You are an expert resume formatter. Format the given resume into a clean, professional personal About Me page in HTML.'
          },
          {
            role: 'user',
            content: resumeText,
          }
        ],
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const formattedContent = response.data.choices[0].message.content;

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Your About Me Page</title>
        <style>
          body { font-family: sans-serif; max-width: 800px; margin: auto; padding: 2em; line-height: 1.6; }
          h2 { margin-top: 2em; text-align: center; }
          .cta { text-align: center; margin-top: 3em; }
          a.cta-link {
            display: inline-block;
            text-decoration: none;
            font-size: 1.1em;
            color: #00ffff;
            background: #000;
            padding: 0.75em 1.5em;
            border: 2px solid #00ffff;
            border-radius: 8px;
          }
          a.cta-link:hover {
            background: #00ffff;
            color: #000;
          }
        </style>
      </head>
      <body>
        ${formattedContent}
        <div class="cta">
          <h2>🔧 Claim Your Digital Presence</h2>
          <a class="cta-link" href="/auth/google">
            Sign in with Google to publish your page or upgrade with GSuite
          </a>
        </div>
      </body>
      </html>
    `;

    res.send(fullHTML);
  } catch (error) {
    console.error('❌ Error parsing resume:', error.message);
    res.status(500).send('Failed to parse resume');
  }
});

// Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const email = user.emails[0].value;
    const subdomain = `${user.displayName.replace(/\s+/g, '').toLowerCase()}.pacmacmobile.com`;

    // Save free subdomain on login
    saveUserDomain(email, 'subdomain', subdomain);

    res.redirect('/signup.html');
  }
);

// Include signup and dashboard routes
require('./signupHandler')(app);
require('./dashboardRoutes')(app);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
