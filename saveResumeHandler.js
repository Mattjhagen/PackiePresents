// saveResumeHandler.js
import express from 'express';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/api/saveResume', async (req, res) => {
  try {
    const { email, html } = req.body;

    if (!email || !html) {
      return res.status(400).json({ error: 'Missing email or resume HTML' });
    }

    const subdomain = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();

    const { error } = await supabase.from('resume_pages').insert({
      user_id: email,
      subdomain,
      html,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    await sendConfirmationEmail(email, subdomain);
    res.status(200).json({ message: 'Resume saved and email sent' });
  } catch (err) {
    console.error('❌ Failed to save resume or send email:', err.message);
    res.status(500).json({ error: err.message });
  }
});

async function sendConfirmationEmail(email, subdomain) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"PacMac Mobile" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: '🚀 Your Resume Page is Ready',
    html: `
      <h2>Your page is live!</h2>
      <p>Visit your new About Me page at:</p>
      <a href="https://${subdomain}.pacmacmobile.com">https://${subdomain}.pacmacmobile.com</a>
    `,
  });
}

export default router;
