import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages, temperature } = await request.json();
    
    const response = await fetch(process.env.DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.DOUBAO_MODEL,
        messages: messages,
        temperature: temperature || 0.8
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
