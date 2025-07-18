export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt manquant' });
  }

  try {
    const HF_API_KEY = process.env.HF_API_KEY; // à définir dans Vercel
    const model = 'tiiuae/falcon-7b-instruct'; // ou un autre modèle texte

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return res.status(200).json({ text: data[0].generated_text });
    } else if (data.generated_text) {
      return res.status(200).json({ text: data.generated_text });
    } else {
      return res.status(500).json({ error: 'Réponse vide ou invalide de Hugging Face', raw: data });
    }

  } catch (err) {
    console.error("Erreur Hugging Face :", err);
    return res.status(500).json({ error: 'Erreur serveur Hugging Face' });
  }
}
