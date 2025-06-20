import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  const { email, html } = req.body;

  const subdomain = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();

  // Save in DB
  const { error } = await supabase.from('resume_pages').insert({
    user_id: email,
    subdomain,
    html,
    created_at: new Date().toISOString()
  });

  if (error) return res.status(500).json({ error: error.message });

  // Send email
  await sendConfirmationEmail(email, subdomain);
  res.status(200).json({ message: 'Saved and emailed!' });
}

async function sendConfirmationEmail(email, subdomain) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `"PacMac Mobile" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: `🚀 Your Resume Page Is Ready`,
    html: `
      <h2>Your page is live!</h2>
      <p>Check it out: <a href="https://${subdomain}.pacmacmobile.com">${subdomain}.pacmacmobile.com</a></p>
    `
  });
}