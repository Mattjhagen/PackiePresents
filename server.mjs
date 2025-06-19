// --- server.mjs (expanded) ---
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import { saveUserDomain } from './saveDomain.js';
import Stripe from 'stripe';
import fetch from 'node-fetch'; // Needed for Discord webhook

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/login/:provider', async (req, res) => {
  const provider = req.params.provider;

  if (!provider) {
    return res.status(400).send('❌ No provider specified');
  }

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

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your About Me Page</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: auto; padding: 2em; line-height: 1.6; }
    h2 { margin-top: 2em; text-align: center; }
    .cta { text-align: center; margin-top: 3em; }
    a.cta-link {
      display: inline-block; text-decoration: none; font-size: 1.1em;
      color: #00ffff; background: #000; padding: 0.75em 1.5em;
      border: 2px solid #00ffff; border-radius: 8px; cursor: pointer;
    }
    a.cta-link:hover { background: #00ffff; color: #000; }
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

    res.send(fullHTML);
  } catch (error) {
    console.error('❌ Resume error:', error.message);
    res.status(500).send('Error parsing resume.');
  }
});
app.post('/save-resume', async (req, res) => {
  const { email, html } = req.body;
  if (!email || !html) return res.status(400).send('Missing email or HTML');

  const fs = await import('fs/promises');
  const safeEmail = email.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filePath = `./public/resumes/${safeEmail}.html`;

  try {
    await fs.writeFile(filePath, html, 'utf8');
    res.send('✅ Resume saved');
  } catch (err) {
    console.error('❌ Failed to save resume:', err.message);
    res.status(500).send('Error saving resume');
  }
});
app.post('/save-domain', async (req, res) => {
  const { email, type, domain } = req.body;
  if (!email || !type || !domain) return res.status(400).send('Missing fields');
  await saveUserDomain(email, type, domain);
  res.send('✅ Domain saved!');
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Custom Domain + Google Suite Setup' },
            unit_amount: 1500,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.PUBLIC_URL || 'https://packiepresents.onrender.com'}/success.html`,
      cancel_url: `${process.env.PUBLIC_URL || 'https://packiepresents.onrender.com'}/signup.html`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe error:', err.message);
    res.status(500).json({ error: 'Stripe checkout failed' });
  }
});

app.post('/capture-lead', async (req, res) => {
  const { name, email, source, message } = req.body;
  console.log('📥 New lead captured:', { name, email, source, message });

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `📧 New Lead Captured:
**Name**: ${name}
**Email**: ${email}
**Source**: ${source}
**Message**: ${message || 'n/a'}`
      })
    });
  }

  res.send('👍 Lead captured');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});