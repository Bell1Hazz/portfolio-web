function searchWord(wordParam = null) {
  const input = document.getElementById("search");
  const word = wordParam || input.value.trim();
  const resultBox = document.getElementById("result");

  if (!word) return;

  resultBox.innerHTML = `
    <div class="placeholder">
      <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
      <p>Mencari kata...</p>
    </div>
  `;

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => {
      if (!res.ok) throw new Error("Kata tidak ditemukan");
      return res.json();
    })
    .then((data) => {
      const phonetic = data[0].phonetic || data[0].phonetics[0]?.text || "Tidak tersedia";
      const audio = data[0].phonetics.find(p => p.audio)?.audio;

      let meaningsHtml = "";
      data[0].meanings.forEach((meaning) => {
        meaningsHtml += `
          <div class="meaning-section">
            <span class="part-of-speech">${meaning.partOfSpeech}</span>
        `;
        meaning.definitions.forEach((def) => {
          meaningsHtml += `
            <div class="definition">${def.definition}</div>
            ${def.example ? `<div class="example">${def.example}</div>` : ""}
            <button class="copy-btn" onclick="copyToClipboard('${def.definition.replace(/'/g, "\\'")}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Salin
            </button>
          `;
        });
        meaningsHtml += `</div>`;
      });

      resultBox.innerHTML = `
        <div class="word-header">
          <h2 class="word-title">${data[0].word}</h2>
          <div class="phonetic">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            ${phonetic}
          </div>
          ${audio ? `
            <button class="play-audio" onclick="playAudio('${audio}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Putar Suara
            </button>
          ` : ""}
        </div>
        ${meaningsHtml}
      `;

      saveToHistory(data[0].word);
    })
    .catch((err) => {
      resultBox.innerHTML = `
        <div class="placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p class="error-message">${err.message}</p>
        </div>
      `;
    });
}


function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}

function saveToHistory(word) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  if (!history.includes(word)) {
    history.unshift(word);
    history = history.slice(0, 10);
    localStorage.setItem("history", JSON.stringify(history));
  }
  renderHistory();
}

function renderHistory() {
  const historyList = document.getElementById("history");
  let history = JSON.parse(localStorage.getItem("history")) || [];
  
  if (history.length === 0) {
    historyList.innerHTML = `
      <li style="text-align: center; color: #64748b; cursor: default; pointer-events: none;">
        Belum ada riwayat pencarian
      </li>
    `;
    return;
  }

  historyList.innerHTML = "";
  history.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    li.onclick = () => searchWord(word);
    historyList.appendChild(li);
  });
}


function clearHistory() {
  localStorage.removeItem("history");
  renderHistory();
}

function getRandomWord() {
  const randomWords = [
    "harmony", "dawn", "whisper", "journey", "mystery", "brave", "spark", "eternity",
    "sincere", "radiant", "solitude", "graceful", "wander", "serenity", "luminous"
  ];

  const random = randomWords[Math.floor(Math.random() * randomWords.length)];
  document.getElementById("search").value = random;
  searchWord(random);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show toast notification
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
      z-index: 1000;
      animation: slideInUp 0.3s ease-out;
    `;
    toast.textContent = "✓ Teks berhasil disalin!";
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = "slideOutDown 0.3s ease-out";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  });
}

// Add CSS for toast animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100px);
      opacity: 0;
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", renderHistory);
