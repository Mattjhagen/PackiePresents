// resumeParser.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config(); // Keep your API key in a .env file

const app = express();
app.use(bodyParser.json());

app.post('/parse-resume', async (req, res) => {
  const { resumeText, tone } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a personal brand expert creating digital bios.' },
          { role: 'user', content: `Parse and format the following resume into a 1-page personal bio. Use a tone that is ${tone}. Resume:\n\n${resumeText}` }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ result: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).send('Parsing failed.');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
