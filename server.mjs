// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const pdfParse = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');
const { createSubdomainRecord } = require('./cloudflare');
const { validateResume, validateDomain } = require('./validators');
const { saveUserDomain } = require('./saveDomain');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Subdomain route
app.use(async (req, res, next) => {
  const subdomain = req.subdomains?.[0];
  if (subdomain && subdomain !== 'www') {
    const { data, error } = await supabase
      .from('about_pages')
      .select('html')
      .eq('slug', subdomain)
      .single();

    if (data?.html) return res.send(data.html);
    return res.status(404).send('User page not found.');
  }
  next();
});

// Authenticated upload endpoint
app.post('/upload-resume', upload.single('resumeFile'), async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) return res.status(401).send('Missing access token');

  const authedClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  const { data: userData, error: userError } = await authedClient.auth.getUser();
  if (!userData?.user) return res.status(401).send('Unauthorized');

  try {
    const file = req.file;
    if (!file) return res.status(400).send('No file');

    let resumeText = '';
    if (file.mimetype === 'application/pdf') {
      const buffer = await fs.readFile(file.path);
      const data = await pdfParse(buffer);
      resumeText = data.text;
    } else if (file.mimetype === 'text/plain') {
      resumeText = await fs.readFile(file.path, 'utf-8');
    } else {
      return res.status(400).send('Unsupported file format');
    }

    await fs.unlink(file.path);

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert resume formatter. Format into an HTML About Me page.' },
          { role: 'user', content: resumeText }
        ]
      })
    });

    const aiData = await openaiRes.json();
    const formattedHTML = aiData.choices?.[0]?.message?.content || '';

    const email = userData.user.email;
    const slug = email.split('@')[0].toLowerCase().replace(/\W/g, '');

    await supabase.from('about_pages').upsert({
      slug,
      email,
      html: formattedHTML
    });

    await createSubdomainRecord(slug);

    res.send({ message: 'Success', previewUrl: `https://${slug}.${process.env.ROOT_DOMAIN}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to upload resume');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
