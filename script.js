let num1, num2, correctAnswer;
let currentMode = 'mult'; // Режим таблиці підказки: 'mult' або 'div'

// Іконки FontAwesome замість звичайних смайлів
const themeIcons = {
  marvel: ['fa-mask', 'fa-bolt', 'fa-shield-halved', 'fa-hand-fist', 'fa-explosion'],
  anime: ['fa-dragon', 'fa-wand-magic-sparkles', 'fa-fire', 'fa-ghost', 'fa-om'],
  cars: ['fa-car-side', 'fa-gauge-high', 'fa-trophy', 'fa-flag-checkered', 'fa-oil-can'],
  moto: ['fa-motorcycle', 'fa-fire-flame-curved', 'fa-helmet-safety', 'fa-bolt-lightning'],
  football: ['fa-futbol', 'fa-trophy', 'fa-medal', 'fa-bullseye']
};

let currentInterval;

function changeTheme() {
  const selectedTheme = document.getElementById('themeSelect').value;
  clearInterval(currentInterval);
  const container = document.getElementById('floatingBg');
  container.innerHTML = '';

  createFloatingIcons(themeIcons[selectedTheme]);
  currentInterval = setInterval(() => {
    spawnIcon(themeIcons[selectedTheme]);
  }, 600);
}

function spawnIcon(icons) {
  const container = document.getElementById('floatingBg');
  const iconElement = document.createElement('i');
  iconElement.classList.add('floating-item', 'fa-solid');

  const randomIcon = icons[Math.floor(Math.random() * icons.length)];
  iconElement.classList.add(randomIcon);

  iconElement.style.left = Math.random() * 100 + 'vw';
  iconElement.style.animationDuration = (Math.random() * 4 + 5) + 's';
  iconElement.style.fontSize = (Math.random() * 20 + 25) + 'px';

  container.appendChild(iconElement);

  setTimeout(() => {
    iconElement.remove();
  }, 9000);
}

function createFloatingIcons(icons) {
  for (let i = 0; i < 8; i++) {
    spawnIcon(icons);
  }
}

// Генерація завдань
function generateQuestion() {
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

  document.getElementById('answer-input').value = '';
  document.getElementById('result-message').innerText = '';
}

function checkAnswer() {
  const userAnswer = parseInt(document.getElementById('answer-input').value);
  const messageElement = document.getElementById('result-message');

  if (userAnswer === correctAnswer) {
    messageElement.style.color = '#10b981';
    messageElement.innerText = 'Правильно! 🎉';
    setTimeout(generateQuestion, 1000);
  } else {
    messageElement.style.color = '#ef4444';
    messageElement.innerText = 'Спробуй ще раз! ❌';
  }
}

// Управління модальним вікном та таблицями
function openModal() {
  document.getElementById('modal').style.display = 'flex';
  renderTable();
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function switchTable(mode) {
  currentMode = mode;
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (mode === 'mult') {
    buttons[0].classList.add('active');
  } else {
    buttons[1].classList.add('active');
  }

  renderTable();
}

function renderTable() {
  const container = document.getElementById('table-container');
  container.innerHTML = '';

  for (let i = 2; i <= 9; i++) {
    const block = document.createElement('div');
    block.classList.add('table-block');
    let html = `<h4>На ${i}</h4>`;

    if (currentMode === 'mult') {
      for (let j = 1; j <= 10; j++) {
        html += `${i} × ${j} = ${i * j}<br>`;
      }
    } else {
      for (let j = 1; j <= 10; j++) {
        const res = i * j;
        html += `${res} ÷ ${i} = ${j}<br>`;
      }
    }

    block.innerHTML = html;
    container.appendChild(block);
  }
}

document.getElementById('answer-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    checkAnswer();
  }
});

// Запуск проєкту
generateQuestion();
changeTheme();