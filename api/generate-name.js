const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, temperature } = req.body;
    
    const response = await axios.post(
      process.env.DOUBAO_API_URL,
      {
        model: process.env.DOUBAO_MODEL,
        messages: messages,
        temperature: temperature || 0.75
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
};
