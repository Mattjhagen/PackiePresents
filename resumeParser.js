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
    const resumeText = req.body.resumeText;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
    
      messages: [
  {
    role: 'system',
    content: `You are an expert personal branding web developer. When given a plain text resume, return a full professional 1-page HTML document styled in clean white and black, centered, with bold section headers (like Contact, Skills, Experience, Education). Use semantic HTML. The result should be visually impressive and easily scannable. Do NOT return markdown. Only return clean HTML.`,
  },
  {
    role: 'user',
    content: resumeText
  }
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
//import nd register signup route
const signupRoute = require('./signupRoute');
signupRoute(app);
//Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Resume Parser API is running on port ${PORT}`);
});
