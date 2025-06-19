import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import { saveUserDomain } from './saveDomain.js';
import Stripe from 'stripe';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('🚀 Supabase OAuth + Resume Parser API running!');
});

app.get('/login/:provider', async (req, res) => {
  const provider = req.params.provider;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.PUBLIC_URL || 'https://packiepresents.onrender.com'}/callback`
    }
  });

  if (error || !data?.url) {
    console.error(`❌ OAuth (${provider}) error:`, error?.message || 'No URL');
    return res.status(500).send('Auth error');
  }

  res.redirect(data.url);
});

app.get('/login', async (req, res) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.PUBLIC_URL || 'https://packiepresents.onrender.com'}/callback`
    }
  });

  if (error || !data?.url) {
    console.error('OAuth redirect error:', error?.message || 'No URL returned');
    return res.status(500).send('Auth error');
  }

  res.redirect(data.url);
});

app.get('/callback', (req, res) => {
  res.redirect('/signup.html');
});

app.post('/parse-resume', async (req, res) => {
  try {
    const resumeText = req.body.resumeText;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume formatter. Format the resume into a professional About Me HTML page.'
          },
          {
            role: 'user',
            content: resumeText
          }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();
    const formattedContent = data.choices?.[0]?.message?.content || 'No response from OpenAI.';

    const email = req.body.email || 'anonymous';
    const sanitized = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();

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
    }
    h2 {
      margin-top: 2em;
      text-align: center;
    }
    .cta {
      text-align: center;
      margin-top: 3em;
    }
    a.cta-link {
      display: inline-block;
      text-decoration: none;
      font-size: 1.1em;
      color: #00ffff;
      background: #000;
      padding: 0.75em 1.5em;
      border: 2px solid #00ffff;
      border-radius: 8px;
      cursor: pointer;
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
    <a class="cta-link" id="supabaseLogin">Sign in with Google via Supabase</a>
  </div>

  <script>
    document.getElementById('supabaseLogin').addEventListener('click', function () {
      window.location.href = '/login';
    });
  </script>
</body>
</html>`;

    const outputPath = path.join(__dirname, 'public', 'resumes', `${sanitized}.html`);
    await fs.writeFile(outputPath, fullHTML);

    res.send(fullHTML);
  } catch (error) {
    console.error('❌ Resume error:', error.message);
    res.status(500).send('Error parsing resume.');
  }
});

app.post('/save-domain', async (req, res) => {
  const { email, type, domain } = req.body;

  if (!email || !type || !domain) {
    return res.status(400).send('Missing fields');
  }

  await saveUserDomain(email, type, domain);
  res.send('✅ Domain saved!');
});

app.get('/:slug', async (req, res, next) => {
  const filePath = path.join(__dirname, 'public', 'resumes', `${req.params.slug}.html`);
  try {
    await fs.access(filePath);
    res.sendFile(filePath);
  } catch {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});