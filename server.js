import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import { supabase } from './supabaseClient.js';
import { saveUserDomain } from './saveDomain.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('✅ Supabase Resume App is running!');
});

// Resume Parser Endpoint
app.post('/parse-resume', async (req, res) => {
  try {
    const resumeText = req.body.resumeText;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert resume formatter. Format this resume into a clean HTML About Me page.' },
          { role: 'user', content: resumeText }
        ],
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const formatted = response.data.choices[0].message.content;

    const fullHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Your About Me Page</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: auto; }
          .cta { margin-top: 3rem; text-align: center; }
          .cta a { padding: 10px 20px; border: 2px solid #00ffff; color: #00ffff; text-decoration: none; border-radius: 8px; }
          .cta a:hover { background-color: #00ffff; color: black; }
        </style>
      </head>
      <body>
        ${formatted}
        <div class="cta">
          <h2>🚀 Claim Your Digital Presence</h2>
          <a href="/auth/supabase">Sign in with Google to publish your page or upgrade</a>
        </div>
      </body>
      </html>
    `;

    res.send(fullHTML);
  } catch (error) {
    console.error('❌ Error parsing resume:', error.message);
    res.status(500).send('Failed to parse resume.');
  }
});

// Supabase OAuth Initiation
app.get('/auth/supabase', async (req, res) => {
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback`; // Replace if needed
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl }
  });

  if (error) {
    return res.status(500).send(`❌ OAuth error: ${error.message}`);
  }

  res.redirect(data.url);
});

// Optional: You can also handle Supabase POST-login routing if needed

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
