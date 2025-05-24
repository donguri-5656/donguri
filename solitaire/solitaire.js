let deck = [];
let waste = [];
let foundations = [[], [], [], []];
let tableau = [[], [], [], [], [], [], []];
let drawCount = 1;
let score = 0;

function startGame(count) {
  drawCount = count;
  document.querySelector(".difficulty-select").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  initGame();
}

function initGame() {
  deck = createDeck();
  shuffle(deck);
  waste = [];
  foundations = [[], [], [], []];
  tableau = [[], [], [], [], [], [], []];
  score = 0;
  updateScore(0);

  // Deal to tableau
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
      let card = deck.pop();
      card.faceUp = j === i;
      tableau[i].push(card);
    }
  }

  render();
}

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const colors = ["black", "red", "red", "black"];
  const deck = [];
  for (let s = 0; s < 4; s++) {
    for (let r = 1; r <= 13; r++) {
      deck.push({
        suit: suits[s],
        color: colors[s],
        rank: r,
        faceUp: false,
      });
    }
  }
  return deck;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function render() {
  // Deck
  const deckDiv = document.getElementById("deck");
  deckDiv.innerText = deck.length > 0 ? "山札" : "なし";

  // Waste
  const wasteDiv = document.getElementById("waste");
  wasteDiv.innerHTML = "";
  const last = waste[waste.length - 1];
  if (last) {
    const el = createCardElement(last);
    wasteDiv.appendChild(el);
  }

  // Foundations
  const foundDiv = document.getElementById("foundations");
  foundDiv.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const slot = document.createElement("div");
    slot.className = "foundation-slot";
    slot.innerText = foundations[i].length ? `${foundations[i].slice(-1)[0].suit}${foundations[i].slice(-1)[0].rank}` : "台札";
    foundDiv.appendChild(slot);
  }

  // Tableau
  const tableDiv = document.getElementById("tableau");
  tableDiv.innerHTML = "";
  tableau.forEach(col => {
    const colDiv = document.createElement("div");
    colDiv.className = "column";
    col.forEach(card => {
      const el = createCardElement(card);
      colDiv.appendChild(el);
    });
    tableDiv.appendChild(colDiv);
  });

  // Check win
  if (foundations.every(f => f.length === 13)) {
    document.getElementById("winMessage").style.display = "block";
  }
}

function createCardElement(card) {
  const div = document.createElement("div");
  div.className = "card";
  div.classList.add(card.color);
  if (!card.faceUp) div.classList.add("hidden");
  div.innerText = card.faceUp ? `${card.suit}${card.rank}` : "";
  return div;
}

function drawCard() {
  if (deck.length === 0) {
    deck = waste.reverse();
    waste = [];
  } else {
    for (let i = 0; i < drawCount && deck.length > 0; i++) {
      let card = deck.pop();
      card.faceUp = true;
      waste.push(card);
      updateScore(-1);
    }
  }
  render();
}

function resetGame() {
  if (confirm("やり直しますか？")) {
    startGame(drawCount);
  }
}

function showHint() {
  alert("山札をクリックしてカードを引いてください");
}

function toggleRules() {
  const panel = document.getElementById("rulePanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}

function updateScore(change) {
  score += change;
  document.getElementById("score").innerText = score;
}
