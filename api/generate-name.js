module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, temperature } = req.body;
    
    const apiUrl = process.env.DOUBAO_API_URL;
    const apiKey = process.env.DOUBAO_API_KEY;
    const model = process.env.DOUBAO_MODEL;
    
    if (!apiUrl || !apiKey || !model) {
      return res.status(500).json({ error: 'Server configuration error - missing environment variables' });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature || 0.75
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: `API request failed`,
        status: response.status,
        details: errorData 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};
