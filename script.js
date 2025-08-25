let useBias = true;
let allLines = [];

const hotNumbers = [2, 6, 10, 28, 33, 38, 44];
const coldNumbers = [5, 13, 17, 20, 31, 35, 40];

function toggleBias() {
  useBias = !useBias;
  document.getElementById("biasLabel").textContent = useBias ? "Hot/Cold" : "Random";
}

function generateLine() {
  let pool = [...Array(45).keys()].map(n => n + 1);
  let selected = [];

  if (useBias) {
    selected.push(...pickRandom(hotNumbers, 3));
    selected.push(...pickRandom(coldNumbers, 2));
    let remainingPool = pool.filter(n => !selected.includes(n));
    selected.push(pickRandom(remainingPool, 1)[0]);
  } else {
    selected = pickRandom(pool, 6);
  }

  selected = [...new Set(selected)].sort((a, b) => a - b);
  let oddCount = selected.filter(n => n % 2 !== 0).length;
  let sum = selected.reduce((a, b) => a + b, 0);

  if ([2, 3, 4].includes(oddCount) && sum >= 106 && sum <= 170) {
    return selected;
  }

  return generateLine(); // Retry until valid
}

function pickRandom(arr, count) {
  let copy = [...arr];
  let result = [];
  while (result.length < count && copy.length > 0) {
    let idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function generateLines() {
  const container = document.getElementById("results");
  container.innerHTML = "";
  allLines = [];

  for (let i = 0; i < 50; i++) {
    const line = generateLine();
    allLines.push(line);

    const div = document.createElement("div");
    div.className = "line";

    const span = document.createElement("span");
    span.innerHTML = `Line ${i + 1}: ` + line.map(n => `<span class="roll">${n}</span>`).join(", ");

    div.appendChild(span);
    container.appendChild(div);

    setTimeout(() => div.classList.add("visible"), i * 30);
  }

  // ✅ Hide spinner here after all lines are generated
  const spinner = document.getElementById("spinner");
  spinner.style.display = "none";
}


function regenerateLines() {
  const container = document.getElementById("results");
  const spinner = document.getElementById("spinner");

  spinner.style.display = "block";
  container.classList.add("fade-out");

  setTimeout(() => {
    generateLines();
    container.classList.remove("fade-out");
    spinner.style.display = "none";
  }, 500);
}


function exportCSV() {
  if (allLines.length === 0) return alert("No lines to export!");

  let csv = "";
  allLines.forEach(line => {
    csv += line.join(", ") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "lotto_lines.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const toggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function updateIcon(theme) {
  themeIcon.textContent = theme === 'dark' ? '🌜' : '🌞';
}

toggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateIcon(newTheme);
});

// Load saved theme on startup
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);
});

window.onload = () => {
  const spinner = document.getElementById("spinner");
  spinner.classList.add("spinner-fade");
  setTimeout(() => {
    spinner.style.display = "none";
  }, 500); // Wait for fade to finish
};

