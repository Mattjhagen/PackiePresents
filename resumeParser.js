// resumeParser.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiKey = process.env.OPENAI_API_KEY;

// Test GET route
app.get('/', (req, res) => {
  res.send('Resume Parser API is live!');
});

app.post('/parse-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume formatter. Format the given resume into a clean, professional personal webpage summary.',
          },
          {
            role: 'user',
            content: resumeText,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const formatted = response.data.choices[0].message.content;
    res.send({ html: formatted });
  } catch (error) {
    console.error('Error parsing resume:', error.message);
    res.status(500).send('Failed to parse resume');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Resume Parser API is running on port ${PORT}`);
});
