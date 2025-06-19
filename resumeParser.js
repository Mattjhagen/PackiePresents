const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const apiKey = process.env.OPENAI_API_KEY;

// Test route
app.get('/', (req, res) => {
  res.send('Resume Parser API is live!');
});

// Resume parsing route
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
            content: `You are a professional resume formatter. Take plain resume text and generate clean, styled HTML with semantic tags.

Structure it as:
- <h1> for the user's name
- <section> with <h2> for each: About Me, Skills, Experience, and Education
- Use <ul> and <li> for lists of skills/jobs/education
Return only valid HTML markup (no backticks or Markdown).`
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
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
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
          body {
            font-family: sans-serif;
            max-width: 800px;
            margin: auto;
            padding: 2em;
            line-height: 1.6;
            color: #ffffff;
            background-color: #000000;
          }
          h1, h2, h3 {
            color: #00ffff;
          }
          a.cta-link {
            display: inline-block;
            margin-top: 1em;
            text-decoration: none;
            font-size: 1.1em;
            color: #000;
            background: #00ffff;
            padding: 0.75em 1.5em;
            border-radius: 8px;
          }
          a.cta-link:hover {
            background: #ffffff;
            color: #000;
          }
          .cta {
            text-align: center;
            margin-top: 3em;
            border-top: 1px solid #444;
            padding-top: 2em;
          }
        </style>
      </head>
      <body>
        ${formattedContent}
        <div class="cta">
          <h2>🔧 Claim Your Digital Presence</h2>
          <a class="cta-link" href="https://packiepresents.onrender.com/auth/google">
            Sign in with Google to publish your page on a free subdomain or upgrade with GSuite
          </a>
        </div>
      </body>
      </html>
    `;

    res.send(fullHTML);
  } catch (error) {
    console.error('Error parsing resume:', error.message);
    res.status(500).send('Failed to parse resume');
  }
});

module.exports = app;
