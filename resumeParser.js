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
            content: `
You are a resume formatter. Convert plain text into a clean HTML layout.

- Use semantic tags like <section>, <ul>, <li>, and <h2>
- Structure: About Me, Skills, Experience, Education
- Do NOT wrap output in Markdown or code blocks
- Output only valid HTML content to embed inside <body>`
          },
          {
            role: 'user',
            content: resumeText
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
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
    body {
      font-family: system-ui, sans-serif;
      max-width: 900px;
      margin: 3rem auto;
      padding: 2rem;
      background: #111;
      color: #eee;
      line-height: 1.6;
    }
    h1, h2 {
      color: #00ffff;
    }
    ul {
      margin-left: 1.5rem;
    }
    .cta {
      margin-top: 3em;
      text-align: center;
    }
    .cta-link {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75em 1.5em;
      background: #000;
      color: #00ffff;
      font-size: 1.1em;
      text-decoration: none;
      border: 2px solid #00ffff;
      border-radius: 8px;
      transition: 0.3s;
    }
    .cta-link:hover {
      background: #00ffff;
      color: #000;
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
