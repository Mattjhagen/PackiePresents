const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { saveUserDomain } = require('./saveDomain.js');
const signupHandler = require('./signupHandler.js'); // <-- make sure this file exists

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('🚀 Supabase OAuth and Resume Parser backend running!');
});

app.post('/parse-resume', async (req, res) => {
  try {
    const resumeText = req.body.resumeText;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume formatter. Format the given resume into a clean, professional personal About Me page in HTML.'
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
          <a class="cta-link" href="/auth/supabase">
            Sign in with Google to publish your page or upgrade with GSuite
          </a>
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

// ✅ Add signup handler so /signup POST works
signupHandler(app);

// ✅ Start listening
app.listen(PORT, () => {
  console.log(`🚀 Server is live at https://packiepresents.onrender.com`);
});
