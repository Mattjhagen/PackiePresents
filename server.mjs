import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { saveUserDomain } from './saveDomain.js';
import Stripe from 'stripe';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your About Me Page</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #111;
      color: #eee;
      padding: 2rem;
      max-width: 800px;
      margin: auto;
      line-height: 1.6;
    }
    h1, h2 {
      color: #00ffff;
    }
    a {
      color: #00ffff;
    }
    .cta {
      text-align: center;
      margin-top: 3em;
    }
    .cta-link {
      display: inline-block;
      padding: 0.75em 1.5em;
      background: #000;
      color: #00ffff;
      border: 2px solid #00ffff;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease-in-out;
      font-size: 1.1em;
    }
    .cta-link:hover {
      background: #00ffff;
      color: #000;
    }
  </style>
</head>
<body>
  ${formattedContent}
  
  app.post('/save-resume', async (req, res) => {
  const { email, html } = req.body;

  if (!email || !html) {
    return res.status(400).send('Missing email or HTML content');
  }

  const { error } = await supabase
    .from('resume_pages')
    .insert([{ email, html }]);

  if (error) {
    console.error('❌ Supabase insert error:', error.message);
    return res.status(500).send('Error saving resume');
  }

  res.send('✅ Resume saved!');
});

  <div class="cta">
    <h2>🔧 Claim Your Digital Presence</h2>
    <a class="cta-link" href="/login" target="_blank" rel="noopener">
      Sign in with Google via Supabase
    </a>
  </div>
</body>
</html>
`;
    const username = resumeText.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const filename = path.join(__dirname, 'public', 'resumes', `${username}.html`);

    const fullHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${username}</title></head><body>${formattedContent}</body></html>`;

    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, fullHTML);

    res.send(fullHTML);
  } catch (error) {
    console.error('❌ Resume error:', error.message);
    res.status(500).send('Error parsing resume.');
  }
});

app.get('/:username', (req, res, next) => {
  const filePath = path.join(__dirname, 'public', 'resumes', `${req.params.username}.html`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next();
  }
});

app.post('/save-domain', async (req, res) => {
  const { email, type, domain } = req.body;
  if (!email || !type || !domain) return res.status(400).send('Missing fields');
  await saveUserDomain(email, type, domain);
  res.send('✅ Domain saved!');
});

app.post('/save-resume', async (req, res) => {
  const { email, html } = req.body;

  if (!email || !html) {
    return res.status(400).send('Missing email or resume HTML');
  }

  const { error } = await supabase
    .from('resume_pages')
    .insert([{ email, html }]);

  if (error) {
    console.error('❌ Failed to save resume:', error.message);
    return res.status(500).send('Database insert failed');
  }

  res.send('✅ Resume saved');
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
            product_data: {
              name: 'Custom Domain + Google Suite Setup',
            },
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
