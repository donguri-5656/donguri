// solitaire.js
let stock = [], waste = [], tableau = [], foundations = [[], [], [], []];
let suits = ["♠", "♥", "♣", "♦"];
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let score = 0;
let drawCount = 1; // 1 for easy, 3 for hard

function toggleRules() {
  const rules = document.getElementById("rules");
  rules.classList.toggle("hidden");
}

function resetGame() {
  document.getElementById("difficultyOverlay").style.display = "flex";
}

function startGame(drawMode) {
  drawCount = drawMode;
  document.getElementById("difficultyOverlay").style.display = "none";
  score = 0;
  updateScore();
  initGame();
}

function updateScore(val = 0) {
  score += val;
  document.getElementById("score").textContent = `スコア: ${score}`;
}

function createDeck() {
  let deck = [];
  suits.forEach((suit, si) => {
    values.forEach((val, vi) => {
      deck.push({
        suit,
        value: val,
        number: vi + 1,
        color: suit === "♥" || suit === "♦" ? "red" : "black",
        faceUp: false
      });
    });
  });
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function initGame() {
  let deck = shuffle(createDeck());
  stock = [];
  waste = [];
  tableau = Array.from({ length: 7 }, () => []);
  foundations = [[], [], [], []];

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
      let card = deck.pop();
      card.faceUp = j === i;
      tableau[i].push(card);
    }
  }
  stock = deck;
  render();
}

function render() {
  const stockEl = document.getElementById("stock");
  const wasteEl = document.getElementById("waste");
  const foundationsEl = document.querySelectorAll(".foundation");
  const tableauEl = document.getElementById("tableau");

  stockEl.innerHTML = stock.length ? `<div class="card back" onclick="drawCard()"></div>` : "";

  wasteEl.innerHTML = "";
  if (waste.length) {
    let top = waste[waste.length - 1];
    let card = createCardElement(top);
    wasteEl.appendChild(card);
  }

  foundationsEl.forEach((el, i) => {
    el.innerHTML = "";
    let f = foundations[i];
    if (f.length) {
      el.appendChild(createCardElement(f[f.length - 1]));
    } else {
      el.textContent = el.dataset.suit;
    }
  });

  tableauEl.innerHTML = "";
  tableau.forEach((pile, i) => {
    let pileEl = document.createElement("div");
    pileEl.className = "pile";
    pile.forEach((card, j) => {
      let cardEl = createCardElement(card);
      cardEl.style.top = `${j * 20}px`;
      pileEl.appendChild(cardEl);
    });
    tableauEl.appendChild(pileEl);
  });
}

function drawCard() {
  if (stock.length === 0) {
    stock = waste.reverse();
    waste = [];
    stock.forEach(c => c.faceUp = false);
  }
  for (let i = 0; i < drawCount; i++) {
    let card = stock.pop();
    if (!card) break;
    card.faceUp = true;
    waste.push(card);
  }
  updateScore(5);
  render();
}

function createCardElement(card) {
  let div = document.createElement("div");
  div.className = `card ${card.color} ${card.faceUp ? 'face-up' : 'face-down'}`;
  if (card.faceUp) div.textContent = `${card.value}${card.suit}`;
  return div;
}
