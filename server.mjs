// server.mjs
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import { saveUserDomain } from './saveDomain.js';
import Stripe from 'stripe';

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

// Global request logger
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url} from ${req.headers['user-agent']}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  console.log('✅ Root route hit');
  res.send('🚀 Supabase OAuth + Resume Parser API running!');
});

// Supabase OAuth login
app.get('/login', async (req, res) => {
  console.log('🔑 Initiating Supabase OAuth login');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.PUBLIC_URL || 'https://packiepresents.onrender.com'}/callback`
    }
  });

  if (error || !data?.url) {
    console.error('❌ OAuth error:', error);
    return res.status(500).send('OAuth failed');
  }

  console.log('✅ Supabase redirect URL:', data.url);
  res.redirect(data.url);
});

// OAuth callback
app.get('/callback', (req, res) => {
  console.log('🔁 OAuth callback triggered');
  res.redirect('/signup.html');
});

// Resume parsing endpoint
app.post('/parse-resume', async (req, res) => {
  try {
    const resumeText = req.body.resumeText;
    console.log('📄 Resume text received:', resumeText?.slice(0, 100));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert resume formatter. Format the resume into a professional About Me HTML page.' },
          { role: 'user', content: resumeText }
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

    res.send(fullHTML);
  } catch (error) {
    console.error('❌ Resume error:', error.message);
    res.status(500).send('Error parsing resume.');
  }
});

// Save domain route
app.post('/save-domain', async (req, res) => {
  const { email, type, domain } = req.body;
  console.log('🌐 Saving domain:', { email, type, domain });

  if (!email || !type || !domain) {
    console.warn('⚠️ Missing fields in /save-domain request');
    return res.status(400).send('Missing fields');
  }

  try {
    await saveUserDomain(email, type, domain);
    console.log('✅ Domain saved for', email);
    res.send('✅ Domain saved!');
  } catch (err) {
    console.error('❌ Failed to save domain:', err.message);
    res.status(500).send('Server error while saving domain');
  }
});

// Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  console.log('💳 Creating Stripe checkout session...');
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Custom Domain + Google Suite Setup' },
            unit_amount: 1500
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.PUBLIC_URL || 'https://packiepresents.onrender.com'}/success.html`,
      cancel_url: `${process.env.PUBLIC_URL || 'https://packiepresents.onrender.com'}/signup.html`
    });

    console.log('✅ Stripe session created:', session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe error:', err.message);
    res.status(500).json({ error: 'Stripe checkout failed' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Uncaught server error:', err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});