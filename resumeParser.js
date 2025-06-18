require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiKey = process.env.OPENAI_API_KEY;

app.post('/parse-resume', async (req, res) => {
  const { resumeText, tone = 'professional' } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: 'Missing resumeText' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a personal brand expert that formats resumes into clean, modern HTML bios for web display.'
          },
          {
            role: 'user',
            content: `Please format this resume into a stylish, modern 1-page HTML portfolio with embedded style. Use a ${tone} tone. Resume:\n\n${resumeText}`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const formattedHtml = response.data.choices[0].message.content;
    res.json({ html: formattedHtml });
  } catch (error) {
    console.error('Error parsing resume:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to parse resume' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Resume Parser API is running at http://localhost:${PORT}`);
});
