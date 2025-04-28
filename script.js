const API_KEY = 'AIzaSyCuGYE3gfHhOZzVGMAubCVwATtpua3mxF4';
const chatBox = document.getElementById('chat-box');
// Preload available voices
let voices = [];
speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

async function sendMessage() {
  const inputField = document.getElementById('user-input');
  const userMessage = inputField.value;
  if (!userMessage) return;

  chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  inputField.value = "";

  document.getElementById('loading').classList.remove('hidden');

  const systemPrompt = "Reply as if you are Naruto Uzumaki. Speak like Naruto from the anime Naruto in an energetic and inspiring way and in easy and short way.";

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: systemPrompt + " " + userMessage }]
      }]
    })
  });

  document.getElementById('loading').classList.add('hidden');

  const data = await response.json();
  const reply = data.candidates[0]?.content?.parts[0]?.text || "Believe it! Something went wrong.";

  chatBox.innerHTML += `<p><strong>Naruto:</strong> ${reply}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
  speak(reply);
}
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);

  if (voices.length === 0) {
    voices = speechSynthesis.getVoices();
  }

  // Try to pick a Naruto-like voice
  let narutoVoice = voices.find(voice =>
    (voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('english')) &&
    voice.lang.startsWith('en')
  );

  // Fallback: pick first English voice if none found
  if (!narutoVoice) {
    narutoVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
  }

  utterance.voice = narutoVoice;
  utterance.pitch = 1.5; // Energetic pitch
  utterance.rate = 1;    // Normal speaking speed

  speechSynthesis.speak(utterance);
}

