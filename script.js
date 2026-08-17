// Посилання на твій Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZsXv8wtCHJv46ynb65V0aOTp1xtxKF5Jcao1hDLxo80jx68pBWUrSDRUwukrScmamtg/exec";

let userName = "";
let secondsSpent = 0;
let solvedCount = 0;
let timerInterval;

let num1, num2, correctAnswer;
let currentGameMode = 'add';
let currentTableMode = 'mult';

const themeIcons = {
  marvel: ['fa-mask', 'fa-bolt', 'fa-shield-halved', 'fa-hand-fist', 'fa-explosion'],
  anime: ['fa-dragon', 'fa-wand-magic-sparkles', 'fa-fire', 'fa-ghost', 'fa-om'],
  cars: ['fa-car-side', 'fa-gauge-high', 'fa-trophy', 'fa-flag-checkered', 'fa-oil-can'],
  moto: ['fa-motorcycle', 'fa-fire-flame-curved', 'fa-helmet-safety', 'fa-bolt-lightning'],
  football: ['fa-futbol', 'fa-trophy', 'fa-medal', 'fa-bullseye']
};

let currentInterval;

function selectUser(name) {
  document.getElementById('custom-name-input').value = name;
}

function startSession() {
  const inputName = document.getElementById('custom-name-input').value.trim();
  if (!inputName) {
    alert("Будь ласка, вкажи ім'я!");
    return;
  }
  userName = inputName;
  document.getElementById('current-user-display').innerText = userName;
  document.getElementById('user-modal').style.display = 'none';

  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    secondsSpent++;
    const mins = String(Math.floor(secondsSpent / 60)).padStart(2, '0');
    const secs = String(secondsSpent % 60).padStart(2, '0');
    document.getElementById('timer-display').innerText = `${mins}:${secs}`;

    // Щохвилини відправляємо оновлення в Google Таблицю
    if (secondsSpent % 60 === 0) {
      sendDataToGoogleSheets();
    }
  }, 1000);
}

function sendDataToGoogleSheets() {
  if (!userName) return;

  const minsSpent = Math.round(secondsSpent / 60);

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: userName,
      timeSpent: `${minsSpent} хв`,
      score: solvedCount
    })
  });
}

// Автоматично відправляємо дані, якщо закривають або згортають вкладку
window.addEventListener("beforeunload", sendDataToGoogleSheets);

function changeTheme() {
  const selectedTheme = document.getElementById('themeSelect').value;
  clearInterval(currentInterval);
  const container = document.getElementById('floatingBg');
  container.innerHTML = '';

  createFloatingIcons(themeIcons[selectedTheme]);
  currentInterval = setInterval(() => { spawnIcon(themeIcons[selectedTheme]); }, 600);
}

function spawnIcon(icons) {
  const container = document.getElementById('floatingBg');
  const iconElement = document.createElement('i');
  iconElement.classList.add('floating-item', 'fa-solid');
  iconElement.classList.add(icons[Math.floor(Math.random() * icons.length)]);
  iconElement.style.left = Math.random() * 100 + 'vw';
  iconElement.style.animationDuration = (Math.random() * 4 + 5) + 's';
  iconElement.style.fontSize = (Math.random() * 20 + 25) + 'px';
  container.appendChild(iconElement);
  setTimeout(() => { iconElement.remove(); }, 9000);
}

function createFloatingIcons(icons) {
  for (let i = 0; i < 8; i++) spawnIcon(icons);
}

function setGameMode(mode) {
  currentGameMode = mode;
  document.getElementById('mode-add-btn').classList.toggle('active', mode === 'add');
  document.getElementById('mode-mult-btn').classList.toggle('active', mode === 'mult');
  generateQuestion();
}

function generateQuestion() {
  if (currentGameMode === 'add') {
    const isAddition = Math.random() > 0.5;
    if (isAddition) {
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 9) + 1;
      correctAnswer = num1 + num2;
      document.getElementById('question').innerText = `${num1} + ${num2}`;
    } else {
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * num1) + 1;
      correctAnswer = num1 - num2;
      document.getElementById('question').innerText = `${num1} − ${num2}`;
    }
  } else {
    const isMultiplication = Math.random() > 0.5;
    if (isMultiplication) {
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      correctAnswer = num1 * num2;
      document.getElementById('question').innerText = `${num1} × ${num2}`;
    } else {
      num2 = Math.floor(Math.random() * 9) + 2;
      correctAnswer = Math.floor(Math.random() * 9) + 2;
      num1 = num2 * correctAnswer;
      document.getElementById('question').innerText = `${num1} ÷ ${num2}`;
    }
  }

  document.getElementById('answer-input').value = '';
  document.getElementById('result-message').innerText = '';
}

function checkAnswer() {
  const userAnswer = parseInt(document.getElementById('answer-input').value);
  const messageElement = document.getElementById('result-message');

  if (userAnswer === correctAnswer) {
    messageElement.style.color = '#10b981';
    messageElement.innerText = 'Правильно! 🎉';
    solvedCount++;
    setTimeout(generateQuestion, 1000);
  } else {
    messageElement.style.color = '#ef4444';
    messageElement.innerText = 'Спробуй ще раз! ❌';
  }
}

function openModal() { document.getElementById('modal').style.display = 'flex'; renderTable(); }
function closeModal() { document.getElementById('modal').style.display = 'none'; }
function openTricksModal() { document.getElementById('tricks-modal').style.display = 'flex'; }
function closeTricksModal() { document.getElementById('tricks-modal').style.display = 'none'; }
function openCounterModal() { document.getElementById('counter-modal').style.display = 'flex'; }
function closeCounterModal() { document.getElementById('counter-modal').style.display = 'none'; }

document.getElementById('answer-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') checkAnswer();
});

generateQuestion();
changeTheme();