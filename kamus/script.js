function searchWord(wordParam = null) {
  const input = document.getElementById("search");
  const word = wordParam || input.value.trim();
  const resultBox = document.getElementById("result");

  if (!word) return;

  resultBox.innerHTML = "Mencari...";
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => {
      if (!res.ok) throw new Error("Kata tidak ditemukan");
      return res.json();
    })
    .then((data) => {
      const phonetic = data[0].phonetic || data[0].phonetics[0]?.text || "Tidak tersedia";
      const audio = data[0].phonetics[0]?.audio;

      let meaningsHtml = "";
      data[0].meanings.forEach((meaning) => {
        meaningsHtml += `<p><strong>${meaning.partOfSpeech}</strong></p>`;
        meaning.definitions.forEach((def, i) => {
          meaningsHtml += `
            <p class="definition">🔹 ${def.definition}</p>
            ${def.example ? `<p class="example">✏️ ${def.example}</p>` : ""}
            <button onclick="copyToClipboard('${def.definition.replace(/'/g, "\'")}')">📋 Salin </button>
          `;
        });
      });

      resultBox.innerHTML = `
        <h2>${data[0].word}</h2>
        <p class="phonetic">🔈 ${phonetic}</p>
        ${audio ? `<button onclick="playAudio('${audio}')">🔊 Putar Suara</button>` : ""}
        ${meaningsHtml}
      `;

      saveToHistory(data[0].word);
    })
    .catch((err) => {
      resultBox.innerHTML = `<p style="color:red;">${err.message}</p>`;
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
  historyList.innerHTML = "";

  history.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    li.style.cursor = "pointer";
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
    alert("Arti berhasil disalin!");
  });
}

document.addEventListener("DOMContentLoaded", renderHistory);


function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// Aktifkan dark mode kalau sebelumnya sudah dipilih
document.addEventListener("DOMContentLoaded", () => {
  renderHistory();
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark");
    document.getElementById("darkModeToggle").checked = true;
  }
});
