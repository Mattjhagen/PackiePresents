const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files if needed

// Ensure /data directory exists for SQLite
const dataDir = path.dirname(process.env.DB_PATH || '/data/domains.db');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`📁 Created data directory at ${dataDir}`);
}

// GPT API Resume Parser
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
            content:
              'You are an expert resume formatter. Format the given resume into a clean, professional personal webpage. Include headings like About Me, Experience, Skills, and Education.',
          },
          {
            role: 'user',
            content: resumeText,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const formattedContent = response.data.choices[0].message.content;

    const ctaHTML = `
      <hr>
      <div style="text-align:center; margin-top:2em;">
        <h2>🔧 Claim Your Digital Presence</h2>
        <a href="/auth/signup/google"
           style="font-size:1.2em; text-decoration:none; color:#00ffcc;">
          👉 Sign in with Google to publish your page on a free subdomain or upgrade with GSuite
        </a>
      </div>
    `;

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Your About Me Page</title>
        <style>
          body { font-family: sans-serif; max-width: 800px; margin: auto; padding: 2em; line-height: 1.6; }
          h2 { text-align: center; }
          a.cta-link {
            display: inline-block;
            margin-top: 1em;
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
        ${ctaHTML}
      </body>
      </html>
    `;

    res.send({ html: fullHTML });
  } catch (error) {
    console.error('❌ Error parsing resume:', error.message);
    res.status(500).send('Failed to parse resume');
  }
});

// OAuth (Google)
const passport = require('passport');
require('./auth');
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
const authSignup = require('./authSignup');
authSignup(app);

// Signup & dashboard
const signupRoute = require('./signupHandler');
const dashboardRoutes = require('./dashboardRoutes');
signupRoute(app);
dashboardRoutes(app);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
