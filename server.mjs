import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { saveUserDomain } from './saveDomain.js';
import { renderResumePage } from './utils/renderResumePage.js';
import Stripe from 'stripe';
import fetch from 'node-fetch';

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Dynamic subdomain rendering
app.get('*', async (req, res) => {
  const host = req.headers.host;
  const subdomain = host.split('.')[0];

  if (!subdomain || ['www', 'localhost', 'pacmacmobile'].includes(subdomain)) {
    return res.send('🚀 Supabase OAuth + Resume Parser API running!');
  }

  try {
    const html = await renderResumePage(subdomain);
    res.send(html);
  } catch (err) {
    console.error(`❌ Resume not found for ${subdomain}:`, err.message);
    res.status(404).send(`<h2>❌ Resume not found for "${subdomain}"</h2>`);
  }
});

// OAuth login
app.get('/login/:provider', async (req, res) => {
  const provider = req.params.provider;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${process.env.PUBLIC_URL}/callback` }
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

// Resume Upload -> Parse -> Save -> Redirect
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);
    const resumeText = await fs.promises.readFile(filePath, 'utf-8');
    const username = resumeText.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Date.now().toString().slice(-4);

    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a resume-to-HTML formatter.' },
          { role: 'user', content: resumeText }
        ]
      })
    });

    const gptData = await gptRes.json();
    const formattedContent = gptData.choices?.[0]?.message?.content || 'Error formatting resume.';

    const { error } = await supabase.from('resume_pages').insert({
      subdomain: username,
      html: formattedContent
    });

    if (error) throw error;
    fs.unlink(filePath, () => {});
    res.redirect(`https://${username}.pacmacmobile.com`);
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).send('Resume processing failed.');
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
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Custom Domain + Google Suite Setup' },
          unit_amount: 1500
        },
        quantity: 1
      }],
      success_url: `${process.env.PUBLIC_URL}/success.html`,
      cancel_url: `${process.env.PUBLIC_URL}/signup.html`
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe error:', err.message);
    res.status(500).json({ error: 'Stripe checkout failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});