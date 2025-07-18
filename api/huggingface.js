// fichier: api/huggingface.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prompt, max_tokens } = req.body;

  try {
    const hfResponse = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        Authorization: `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`, // ⚠️ à remplacer
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt, max_new_tokens: max_tokens || 60 }),
    });

    const data = await hfResponse.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    const generated = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    res.status(200).json({ generated_text: generated });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur ou modèle indisponible' });
  }
}
