const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/generate-name', async (req, res) => {
  try {
    const response = await axios.post(
      process.env.DOUBAO_API_URL,
      {
        model: process.env.DOUBAO_MODEL,
        messages: req.body.messages,
        temperature: req.body.temperature || 0.75
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/wuxing-name', async (req, res) => {
  try {
    const response = await axios.post(
      process.env.DOUBAO_API_URL,
      {
        model: process.env.DOUBAO_MODEL,
        messages: req.body.messages,
        temperature: req.body.temperature || 0.8
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/meaning-name', async (req, res) => {
  try {
    const response = await axios.post(
      process.env.DOUBAO_API_URL,
      {
        model: process.env.DOUBAO_MODEL,
        messages: req.body.messages,
        temperature: req.body.temperature || 0.8
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});