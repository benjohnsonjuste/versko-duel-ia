let joueurActuel = 'humain';
let transcription = '';
let timerInterval;

function changerTour() {
  joueurActuel = joueurActuel === 'humain' ? 'ia' : 'humain';
  document.getElementById('joueurActuelLabel').textContent = joueurActuel === 'humain' ? 'Vous :' : 'IA :';
  if (joueurActuel === 'ia') {
    commencerMinuteur();
    lancerReponseIA();
  }
}

function commencerMinuteur() {
  clearInterval(timerInterval);
  let tempsRestant = 60;
  document.getElementById('timer').textContent = tempsRestant;

  timerInterval = setInterval(() => {
    tempsRestant--;
    document.getElementById('timer').textContent = tempsRestant;
    if (tempsRestant <= 0) {
      clearInterval(timerInterval);
      changerTour();
    }
  }, 1000);
}

async function soumettreVers() {
  if (joueurActuel !== 'humain') return;

  const input = document.getElementById('inputVers');
  const vers = input.value.trim();
  if (!vers) return;

  transcription += `👤 Vous : ${vers}\n`;
  document.getElementById('transcription').textContent = transcription;
  input.value = '';
  changerTour();
}

async function lancerReponseIA() {
  const theme = document.getElementById('theme').value;
  const prompt = `${transcription}\n🤖 IA (thème : ${theme}) :`;

  const reponseIA = await obtenirReponseIA(prompt);
  transcription += `🤖 IA : ${reponseIA}\n`;
  document.getElementById('transcription').textContent = transcription;

  changerTour();
}

async function obtenirReponseIA(prompt) {
  try {
    const response = await fetch("https://versko-duel-ia.vercel.app/api/huggingface", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 60
      })
    });

    const data = await response.json();

    if (data.generated_text) {
      return data.generated_text.trim();
    } else {
      return "IA muette";
    }
  } catch (error) {
    console.error("Erreur IA:", error);
    return "Erreur de réponse IA";
  }
}

window.onload = commencerMinuteur;
