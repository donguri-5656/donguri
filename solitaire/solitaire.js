let drawCount = 1; // 初期は簡単モード
let stock = [];
let waste = [];

document.getElementById("easyBtn").addEventListener("click", () => {
  drawCount = 1;
  startGame();
});

document.getElementById("hardBtn").addEventListener("click", () => {
  drawCount = 3;
  startGame();
});

function startGame() {
  document.getElementById("difficultyScreen").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  initDeck();
  renderStock();
}

function initDeck() {
  stock = [];
  const suits = ["♠", "♥", "♦", "♣"];
  for (let suit of suits) {
    for (let i = 1; i <= 13; i++) {
      stock.push({ suit, value: i });
    }
  }
  shuffle(stock);
  waste = [];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.getElementById("stock").addEventListener("click", () => {
  drawFromStock();
});

function drawFromStock() {
  const draw = stock.splice(0, drawCount);
  waste.unshift(...draw);
  renderStock();
}

function renderStock() {
  const wasteDiv = document.getElementById("waste");
  wasteDiv.innerHTML = "";
  for (let card of waste.slice(0, 3)) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.textContent = `${card.value}${card.suit}`;
    wasteDiv.appendChild(cardDiv);
  }
}
