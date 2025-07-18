async function soumettreVers() {
  const input = document.getElementById("inputVers");
  const transcription = document.getElementById("transcription");
  const theme = document.getElementById("theme").value;

  const versUtilisateur = input.value.trim();
  if (!versUtilisateur) {
    alert("Veuillez écrire un vers !");
    return;
  }

  transcription.innerText += `\n👤 Vous : ${versUtilisateur}`;
  input.value = "";
  input.disabled = true;

  try {
    const prompt = `Dans un duel de poésie sur le thème "${theme}", réponds élégamment à ce vers : "${versUtilisateur}"`;

    const response = await fetch("/api/huggingface", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.text) {
      transcription.innerText += `\n🤖 IA : ${data.text.trim()}\n`;
    } else if (data.error) {
      transcription.innerText += `\n⚠️ Erreur : ${data.error}`;
    } else {
      transcription.innerText += `\n🤖 IA : [Aucune réponse]`;
    }

  } catch (err) {
    console.error("Erreur IA :", err);
    transcription.innerText += `\n⚠️ Erreur lors de l'appel à l'IA.`;
  } finally {
    input.disabled = false;
    input.focus();
  }
}