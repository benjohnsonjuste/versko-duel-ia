export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt manquant' });
  }

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Tu es un poète inspiré, élégant, et réactif.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 100
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.status(200).json({ text: data.choices[0].message.content.trim() });
    } else {
      return res.status(500).json({ error: 'Réponse invalide de OpenAI', raw: data });
    }

  } catch (err) {
    console.error("Erreur OpenAI :", err);
    return res.status(500).json({ error: 'Erreur serveur OpenAI' });
  }
}