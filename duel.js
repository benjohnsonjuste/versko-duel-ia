const HF_API = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
const HF_TOKEN = "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"; // Remplace par ton vrai token si besoin

let texteFinal = "";
let secondesRestantes = 60;
let timer;

function startTimer() {
  secondesRestantes = 60;
  document.getElementById('timer').innerText = secondesRestantes;
  clearInterval(timer);
  timer = setInterval(() => {
    secondesRestantes--;
    document.getElementById('timer').innerText = secondesRestantes;
    if (secondesRestantes <= 0) {
      clearInterval(timer);
      soumettreVers();
    }
  }, 1000);
}

async function soumettreVers() {
  clearInterval(timer);
  const input = document.getElementById("inputVers");
  const vers = input.value.trim();
  if (!vers) return;

  input.disabled = true;
  document.getElementById("submitBtn").disabled = true;

  texteFinal += `👤 Moi : ${vers}\n`;
  document.getElementById("transcription").innerText = texteFinal;

  const theme = document.getElementById("theme").value;
  const prompt = `Thème: ${theme}\nJoueur: ${vers}\nIA:`;

  try {
    const res = await fetch(HF_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 60, temperature: 0.7 }
      })
    });

    const data = await res.json();
    let iaVers = "…";
    if (Array.isArray(data) && data[0]?.generated_text) {
      const texteGenere = data[0].generated_text;
      iaVers = texteGenere.includes("IA:")
        ? texteGenere.split("IA:")[1].trim()
        : texteGenere.split("\n").slice(-1)[0].trim();
    } else if (data?.generated_text) {
      iaVers = data.generated_text;
    }

    texteFinal += `🤖 Kitty : ${iaVers}\n\n`;

  } catch (e) {
    console.error("Erreur API HuggingFace :", e);
    texteFinal += "⚠️ Erreur de réponse IA\n\n";
  }

  document.getElementById("transcription").innerText = texteFinal;
  input.value = "";
  input.disabled = false;
  document.getElementById("submitBtn").disabled = false;
  startTimer();
}

startTimer();
